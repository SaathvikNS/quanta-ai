"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const SignOutButton = () => {
	return (
		<Button
			variant={"destructive"}
			onClick={() => signOut()}
			className="w-full cursor-pointer"
		>
			Sign Out <LogOut />
		</Button>
	);
};

export default SignOutButton;
