"use client";

import SignOutButton from "@/components/ServerActions/signoutbutton";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Dashboard = () => {
	const { data: session } = useSession();
	const avatarSrc = session?.user?.profile?.avatarUrl || session?.user?.image;
	console.log(session?.user);
	return (
		<div>
			<nav>this is the nav bar</nav>
			<main>this is the main dashboard content</main>
			<footer>this is the footer</footer>
			<SignOutButton />
			<p>{session?.user?.name}</p>
			<p>{session?.user?.email}</p>
			<div className="relative w-10 h-10">
				{avatarSrc ? (
					<Image
						src={avatarSrc}
						alt="user avatar"
						fill
						unoptimized
						className="rounded-full object-cover"
					/>
				) : (
					<User />
				)}
			</div>
		</div>
	);
};

export default Dashboard;
