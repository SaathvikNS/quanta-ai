import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	// metadataBase: new URL("https://example.com"),
	title: "QUANTA Intelligence - AI Stock Analysis",
	description:
		"AI-powered financial intelligence for informed stock market decisions",
	applicationName: "Quanta.ai",
	icons: {
		icon: "/favicon.svg",
	},
	openGraph: {
		title: "QUANTA Intelligence - AI Stock Analysis",
		description:
			"AI-powered financial intelligence for informed stock market decisions",
		// url: "https://example.com",
		siteName: "Quanta.ai",
		// images: [
		// 	{
		// 		url: "https://example.com/og.png",
		// 		width: 1200,
		// 		height: 630,
		// 		alt: "Quanta AI",
		// 	},
		// ],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "QUANTA Intelligence - AI Stock Analysis",
		description:
			"AI-powered financial intelligence for informed stock market decisions",
		// images: ["https://example.com/og.png"],
	},
	keywords: [],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				inter.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
