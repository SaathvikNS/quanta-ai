"use server";

import { SearchTicker } from "@/app/(protected)/onboarding/OnBoardingClientForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface OnboardingPayload {
  fullName: string;
  displayName: string;
  avatarUrl: string | null;
  tickers: SearchTicker[];
}

export async function completeOnboarding(data: OnboardingPayload) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized access");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User structure not found");

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.fullName,
          displayName: data.displayName,
          onBoarded: true,

          ...(data.avatarUrl && {
            image: data.avatarUrl,
          }),
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
            symbol: ticker.symbol,
            exchange: ticker.exchange,
            name: ticker.symbol,
            mic_code: ticker.mic_code,
            currency: ticker.currency,
            notes: "Seeded during profile setup workflow.",
          },
        }),
      ),
    ]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        `Display name "${data.displayName}" is already taken`,
      );
    }

    throw error;
  }
}
