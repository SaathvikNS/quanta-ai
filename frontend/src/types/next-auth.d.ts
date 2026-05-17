import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onBoarded: boolean;
      profile?: {
        displayName: string | null;
        avatarUrl: string | null;
      } | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    onBoarded: boolean;
    profile?: {
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  }
}