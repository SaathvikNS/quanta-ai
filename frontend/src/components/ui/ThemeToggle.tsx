"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

const ThemeToggle = () => {
	const mounted = useMounted();
	const { resolvedTheme, setTheme } = useTheme();

	if (!mounted) {
		return (
			<div className="h-9 w-9 rounded-full border border-border bg-secondary/10" />
		);
	}

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="relative h-9 w-9 rounded-full bg-secondary/10 border border-border flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-secondary/40"
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			<Sun
				className={`h-4 w-4 absolute transition-all duration-500 ${
					isDark
						? "rotate-90 scale-0 opacity-0"
						: "rotate-0 scale-100 opacity-100 text-amber-500"
				}`}
			/>

			<Moon
				className={`h-4 w-4 absolute transition-all duration-500 ${
					isDark
						? "rotate-0 scale-100 opacity-100 text-primary"
						: "-rotate-90 scale-0 opacity-0"
				}`}
			/>
		</button>
	);
};

export default ThemeToggle;
