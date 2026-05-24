import NextAuth, { NextAuthOptions } from "next-auth";
import Email from "next-auth/providers/email";
import Github, { GithubProfile } from "next-auth/providers/github";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { createTransport } from "nodemailer";
import CustomMail from "@/constants/CustomMail";

// Type-safety helper for environment variables
const getEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) throw new Error(`Missing environment variable: ${name}`);
	return value;
};

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/login",
		error: "/login",
		verifyRequest: "/login/verification",
	},
	adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	providers: [
		Github({
			clientId: getEnv("GITHUB_CLIENT_ID"),
			clientSecret: getEnv("GITHUB_CLIENT_SECRET"),
		}),
		Google({
			clientId: getEnv("GOOGLE_CLIENT_ID"),
			clientSecret: getEnv("GOOGLE_CLIENT_SECRET"),
		}),
		Email({
			server: {
				host: getEnv("EMAIL_SERVER_HOST"),
				port: Number(getEnv("EMAIL_SERVER_PORT")),
				auth: {
					user: getEnv("EMAIL_SERVER_USER"),
					pass: getEnv("EMAIL_SERVER_PASS"),
				},
			},
			from: process.env.EMAIL_FROM,
			async sendVerificationRequest({
				identifier: email,
				url,
				provider: { server, from },
			}) {
				const transport = createTransport(server);
				const result = await transport.sendMail({
					to: email,
					from,
					subject: `Sign in to Quanta Intelligence`,
					html: CustomMail(url),
				});
				const failed = result.rejected
					.concat(result.pending)
					.filter(Boolean);
				if (failed.length) {
					throw new Error(
						`Email (${failed.join(", ")}) could not be sent`,
					);
				}
			},
		}),
	],
	events: {
		async linkAccount({ account, profile }) {
			if (!account || !profile) return;

			let avatarUrl: string | null = null;

			if (account.provider === "google") {
				const googleProfile = profile as unknown as GoogleProfile;
				avatarUrl = googleProfile.picture ?? null;
			} else if (account.provider === "github") {
				const githubProfile = profile as unknown as GithubProfile;
				avatarUrl = githubProfile.avatar_url ?? null;
			}

			if (avatarUrl) {
				await prisma.account.update({
					where: {
						provider_providerAccountId: {
							provider: account.provider,
							providerAccountId: account.providerAccountId,
						},
					},
					data: {
						providerAvatarUrl: avatarUrl,
					},
				});
			}
		},
	},
	callbacks: {
		async jwt({ token, user }) {
			const userId = user?.id || token.id;

			if (!userId) return token;

			const dbUser = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					onBoarded: true,
					displayName: true,
					image: true,
					name: true,
					email: true,
				},
			});

			if (dbUser) {
				token.id = dbUser.id;
				token.onBoarded = dbUser.onBoarded;
				token.displayName = dbUser.displayName;

				token.picture = dbUser.image;
				token.name = dbUser.name;
				token.email = dbUser.email;
			}

			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
				session.user.onBoarded = token.onBoarded;
				session.user.displayName = token.displayName;

				session.user.image = token.picture;
				session.user.name = token.name;
				session.user.email = token.email;
			}

			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
