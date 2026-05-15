"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getAvatarChoices() {
	const session = await getServerSession();
	if (!session?.user?.email) throw new Error("Unauthorized");

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		include: { accounts: true },
	});

	if (!user) throw new Error("User not found");

	const providerAvatars = user.accounts
		.filter((acc) => acc.providerAvatarUrl)
		.map((acc) => ({
			type: acc.provider,
			url: acc.providerAvatarUrl!,
		}));

	return {
		currentAvatar: user.image,
		choices: [...providerAvatars],
	};
}

export async function updateProfileAvatar(url: string) {
	const session = await getServerSession();
	if (!session?.user?.email) throw new Error("Unauthorized");

	await prisma.user.update({
		where: { email: session.user.email },
		data: { image: url },
	});

	revalidatePath("/settings");
}
