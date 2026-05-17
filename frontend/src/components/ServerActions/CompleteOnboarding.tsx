"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface OnboardingPayload {
	fullName: string;
	displayName: string;
	avatarUrl: string | null;
	tickers: string[];
}

export async function completeOnboarding(data: OnboardingPayload) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		throw new Error("Unauthorized access");
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
	});

	if (!user) throw new Error("User structure not found");

	await prisma.$transaction([
		prisma.user.update({
			where: { id: user.id },
			data: {
				name: data.fullName,
				image: data.avatarUrl,
				onBoarded: true,
			},
		}),

		prisma.profile.create({
			data: {
				userId: user.id,
				displayName: data.displayName,
				avatarUrl: data.avatarUrl,
			},
		}),

		prisma.userRole.create({
			data: {
				userId: user.id,
				role: "user",
			},
		}),

		...data.tickers.map((ticker) =>
			prisma.watchlist.create({
				data: {
					userId: user.id,
					ticker: ticker,
					notes: "Seeded during profile setup workflow.",
				},
			}),
		),
	]);
}
