import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			onBoarded: boolean;
			displayName: string | null;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		onBoarded: boolean;
		displayName: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		onBoarded: boolean;
		displayName: string | null;
	}
}