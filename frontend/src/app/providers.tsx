"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider>
			<SessionProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</SessionProvider>
		</ThemeProvider>
	);
};

export default Providers;
