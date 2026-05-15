"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function completeOnboarding() {
	const session = await getServerSession();

	if (!session?.user?.email) {
		throw new Error("Unauthorized");
	}

	await prisma.user.update({
		where: { email: session.user.email },
		data: { onBoarded: true },
	});
}
