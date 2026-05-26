"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

interface ThemeToggleProps {
	variant?: "sm" | "lg";
}
const ThemeToggle = ({ variant = "sm" }: ThemeToggleProps) => {
	const mounted = useMounted();
	const { resolvedTheme, setTheme } = useTheme();

	if (!mounted) {
		return (
			<div
				className={`h-9 rounded-full border border-border bg-secondary/10 ${
					variant === "lg" ? "w-full" : "w-9"
				}`}
			/>
		);
	}

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className={`relative h-9 border border-border flex items-center justify-center overflow-hidden transition-colors duration-300 hover:bg-secondary/40 rounded-full ${
				variant === "lg"
					? "w-full px-4 gap-2 justify-around"
					: "w-9 justify-center"
			}`}
			aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
		>
			{/* Icon Wrapper to handle positioning since icons are absolute */}
			<div className="relative h-4 w-4 shrink-0">
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
			</div>

			{/* Dynamic Text: Only renders when variant is "lg" */}
			{variant === "lg" && (
				<span className="text-sm font-medium capitalize animate-fadeIn">
					{!isDark ? "Light" : "Dark"}
				</span>
			)}
		</button>
	);
};

export default ThemeToggle;
