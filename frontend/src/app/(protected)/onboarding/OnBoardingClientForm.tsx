// src/app/(protected)/onboarding/onoardingclientform.tsx

"use client";

import { completeOnboarding } from "@/components/ServerActions/CompleteOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, Upload, Camera } from "lucide-react";
import Image from "next/image";

export type SearchTicker = {
	symbol: string;
	exchange: string;
	name: string;
};

export default function OnBoardingPage() {
	const router = useRouter();
	const { data: session } = useSession();

	// Profile Data States
	const [fullName, setFullName] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [avatar, setAvatar] = useState<string | null>(null);

	// Ticker Search States
	const [tickerInput, setTickerInput] = useState("");
	const [searchResults, setSearchResults] = useState<SearchTicker[]>([]);
	const [selectedTickers, setSelectedTickers] = useState<SearchTicker[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Flow Management States
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Automatically fill the email view read-only from session if available
	const userEmail = session?.user?.email || "loading...";

	// Handle Closing Search Dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Fetch tickers in real time as the user types via our internal API proxy
	useEffect(() => {
		const trimmed = tickerInput.trim();

		if (trimmed.length < 2) {
			return;
		}

		const controller = new AbortController();

		const delayDebounce = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/tickers?search=${encodeURIComponent(tickerInput)}`,
					{
						signal: controller.signal,
					},
				);

				if (res.ok) {
					const data = await res.json();

					const tickers: SearchTicker[] =
						data.results?.map(
							(item: {
								symbol: string;
								exchange: string;
								name: string;
							}) => ({
								symbol: item.symbol,
								exchange: item.exchange,
								name: item.name,
							}),
						) || [];

					setSearchResults(tickers);
					setIsDropdownOpen(tickers.length > 0);
				} else {
					triggerMockFallback();
				}
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") {
					return;
				}
				console.error("Ticker fetch error:", err);
				triggerMockFallback();
			}
		}, 200);

		function triggerMockFallback() {
			const mockTickers = [
				{ symbol: "AAPL", exchange: "mock", name: "AAPL" },
				{ symbol: "MSFT", exchange: "mock", name: "MSFT" },
				{ symbol: "TSLA", exchange: "mock", name: "TSLA" },
				{ symbol: "NVDA", exchange: "mock", name: "NVDA" },
				{ symbol: "AMD", exchange: "mock", name: "AMD" },
				{ symbol: "AMZN", exchange: "mock", name: "AMZN" },
				{ symbol: "GOOGL", exchange: "mock", name: "GOOGL" },
				{ symbol: "META", exchange: "mock", name: "META" },
			];
			const filtered = mockTickers.filter((t) =>
				t.symbol.includes(tickerInput.toUpperCase()),
			);
			setSearchResults(filtered);
			setIsDropdownOpen(filtered.length > 0);
		}

		return () => {
			controller.abort();
			clearTimeout(delayDebounce);
		};
	}, [tickerInput]);

	// Handle Local Image Upload to Base64 String Conversion
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 2 * 1024 * 1024) {
			setError("Image size must be less than 2MB");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatar(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Handle Selecting a Ticker from Dropdown List
	const handleSelectTicker = (ticker: SearchTicker) => {
		const alreadySelected = selectedTickers.some(
			(t) => t.symbol === ticker.symbol && t.exchange === ticker.exchange,
		);

		if (alreadySelected) {
			setTickerInput("");
			setIsDropdownOpen(false);
			return;
		}

		if (selectedTickers.length >= 3) {
			setError("You can select a maximum of 3 tickers.");
			return;
		}

		setSelectedTickers((prev) => [...prev, ticker]);

		setTickerInput("");
		setIsDropdownOpen(false);
		setError("");
	};

	// Remove Selected Ticker Capsule
	const handleRemoveTicker = (tickerToRemove: SearchTicker) => {
		setSelectedTickers((prev) =>
			prev.filter(
				(t) =>
					!(
						t.symbol === tickerToRemove.symbol &&
						t.exchange === tickerToRemove.exchange
					),
			),
		);
	};
	// Handle Form Processing
	const handleSubmitProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!fullName.trim() || !displayName.trim()) {
			setError("Please fill out your full name and display name.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await completeOnboarding({
				fullName,
				displayName,
				avatarUrl: avatar,
				tickers: selectedTickers,
			});

			router.replace("/dashboard");
		} catch (err) {
			console.error(err);
			setError(
				"Failed to save your workspace profile. Please try again.",
			);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-screen flex justify-center items-center bg-background relative py-12 px-4 overflow-y-auto">
			{/* Top Right Sign Out */}
			<div className="absolute right-5 top-5">
				<Button variant="destructive" onClick={() => signOut()}>
					Sign Out
				</Button>
			</div>

			{/* Profile Setup Container Card */}
			<div className="w-full max-w-xl bg-muted p-8 rounded-2xl shadow-2xl border border-border space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-extrabold tracking-tight text-accent">
						Complete Your Profile
					</h1>
					<p className="text-sm text-muted-foreground mt-2">
						Set up your workspace credentials and initial asset
						monitoring parameters.
					</p>
				</div>

				<form onSubmit={handleSubmitProfile} className="space-y-6">
					{/* Interactive Avatar Upload Node */}
					<div className="flex flex-col items-center justify-center space-y-3">
						<div className="relative group h-24 w-24 rounded-full overflow-hidden bg-background border-2 border-border flex items-center justify-center shadow-inner">
							{avatar ? (
								<Image
									src={avatar}
									width={100}
									height={100}
									alt="Avatar Profile"
									className="h-full w-full object-cover"
								/>
							) : (
								<Camera className="h-8 w-8 text-muted-foreground" />
							)}
							<label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] text-white font-medium">
								<Upload className="h-4 w-4 mb-1" />
								Upload Photo
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>
							</label>
						</div>
						<span className="text-xs text-muted-foreground">
							Custom avatar image (Max 2MB)
						</span>
					</div>

					{/* Personal Information Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Full Name
							</label>
							<Input
								type="text"
								placeholder="John Doe"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								disabled={loading}
								className="bg-background"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Display Name
							</label>
							<Input
								type="text"
								placeholder="johndoe_trader"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								disabled={loading}
								className="bg-background"
							/>
						</div>
					</div>

					{/* Email View Block (Read Only Verification) */}
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Registered Email
						</label>
						<Input
							type="email"
							value={userEmail}
							disabled
							className="bg-background/50 cursor-not-allowed opacity-70"
						/>
					</div>

					{/* Dynamic Watchlist Setup Area */}
					<div className="space-y-2 relative" ref={dropdownRef}>
						<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
							<span>Seed Watchlist Tickers</span>
							<span className="text-muted-foreground normal-case font-normal">
								{selectedTickers.length}/3 selected
							</span>
						</label>

						{/* Search Input Field */}
						<Input
							type="text"
							placeholder={
								selectedTickers.length >= 3
									? "Maximum limit reached"
									: "Type to search market symbols (e.g. AAPL, TSLA)..."
							}
							value={tickerInput}
							onChange={(e) => {
								const value = e.target.value;
								setTickerInput(value);

								if (!value.trim()) {
									setSearchResults([]);
									setIsDropdownOpen(false);
								}
							}}
							disabled={loading || selectedTickers.length >= 3}
							className="bg-background"
						/>
						{/* Real-time Result List Dropdown */}
						{isDropdownOpen && (
							<div className="absolute left-0 right-0 top-[102%] bg-background border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
								{searchResults.map((ticker) => (
									<div
										key={`${ticker.symbol}-${ticker.exchange}`}
										onClick={() =>
											handleSelectTicker(ticker)
										}
										className="px-4 py-2.5 hover:bg-muted text-sm font-semibold text-foreground cursor-pointer transition-colors flex justify-between items-center"
									>
										<div className="flex flex-col">
											<span>{ticker.symbol}</span>
											<span className="text-xs text-muted-foreground">
												{ticker.name}
											</span>
										</div>

										<span className="text-[10px] text-muted-foreground flex flex-col items-end">
											{ticker.exchange}
											{selectedTickers.some(
												(t) =>
													t.symbol ===
														ticker.symbol &&
													t.exchange ===
														ticker.exchange,
											) && (
												<span className="text-primary font-medium">
													Added
												</span>
											)}{" "}
										</span>
									</div>
								))}
							</div>
						)}

						{/* Selected Capsules Container */}
						{selectedTickers.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-2">
								{selectedTickers.map((ticker) => (
									<div
										key={`${ticker.symbol}-${ticker.exchange}`}
										className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
									>
										<span>
											{ticker.symbol}
											<span className="ml-1 text-[10px] opacity-70">
												({ticker.exchange})
											</span>
										</span>
										<button
											type="button"
											onClick={() =>
												handleRemoveTicker(ticker)
											}
											className="hover:bg-primary/20 rounded-full p-0.5 transition"
										>
											<X className="h-3 w-3" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Error Alerts Display */}
					{error && (
						<p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium">
							{error}
						</p>
					)}

					{/* Form Execution Confirmation Button */}
					<Button
						type="submit"
						className="w-full h-11 text-base font-bold shadow-lg"
						disabled={loading}
					>
						{loading
							? "Creating Dynamic Profile..."
							: "Save Profile & Launch App 🚀"}
					</Button>
				</form>
			</div>
		</div>
	);
}
