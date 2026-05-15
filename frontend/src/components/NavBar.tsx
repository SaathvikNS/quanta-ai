"use-client";

import Link from "next/link";
import { Brand } from "./brand";
import ThemeToggle from "./ui/ThemeToggle";
import { ArrowRight } from "lucide-react";

const NavBar = () => {
	return (
		<header className="border-b border-border/60 backdrop-blur-md fixed w-full top-0 z-40 bg-background/70">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
				<Brand />
				<div className="flex items-center gap-5">
					<ThemeToggle />
					<Link
						href={"/login"}
						className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Open terminal <ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>
			</div>
		</header>
	);
};

export default NavBar;
