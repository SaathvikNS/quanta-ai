"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
		>
			<SessionProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};

export default Providers;
