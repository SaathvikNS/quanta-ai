// src/app/(protected)/onboarding/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OnBoardingClientForm from "./OnBoardingClientForm";

export default async function OnBoardingPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		redirect("/login");
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
		select: { onBoarded: true },
	});

	if (user?.onBoarded) {
		redirect("/dashboard");
	}

	return <OnBoardingClientForm />;
}
