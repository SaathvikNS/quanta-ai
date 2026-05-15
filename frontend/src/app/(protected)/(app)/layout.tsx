import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ProtectedAppLayout = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const session = await getServerSession(authOptions);
	const user = await prisma.user.findUnique({
		where: { email: session!.user!.email! },
		select: { onBoarded: true },
	});

	if (!user?.onBoarded) {
		redirect("/onboarding");
	}
	return <>{children}</>;
};

export default ProtectedAppLayout;
