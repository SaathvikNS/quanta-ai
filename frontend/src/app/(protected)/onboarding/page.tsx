"use client";

import { completeOnboarding } from "@/components/ServerActions/CompleteOnboarding";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const OnBoardingPage = () => {
	const router = useRouter();

	return (
		<div className="h-dvh w-dvw flex justify-center">
			<div className="absolute right-5 top-5">
				<Button
					variant={"destructive"}
					onClick={() => {
						signOut();
					}}
				>
					Sign Out
				</Button>
			</div>
			<h1 className="text-4xl font-extrabold text-accent">
				lets start the onnboarding process <br />
				<Button>set onboarding</Button>
			</h1>
		</div>
	);
};

export default OnBoardingPage;
