"use client";

import { completeOnboarding } from "@/components/ServerActions/CompleteOnboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, Upload, Camera } from "lucide-react";
import Image from "next/image";

interface PolygonTickerResult {
	ticker: string;
	name?: string;
	market?: string;
	locale?: string;
	[key: string]: unknown;
}

export default function OnBoardingPage() {
	const router = useRouter();
	const { data: session } = useSession();

	// Profile Data States
	const [fullName, setFullName] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [avatar, setAvatar] = useState<string | null>(null);

	// Ticker Search States
	const [tickerInput, setTickerInput] = useState("");
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
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
		if (!tickerInput.trim()) return;

		const delayDebounce = setTimeout(async () => {
			try {
				// Fetching from your internal Next.js API route instead of Polygon directly
				const res = await fetch(`/api/tickers?search=${tickerInput}`);

				console.log("Internal proxy response received");

				if (res.ok) {
					const data = await res.json();
					const tickers =
						data.results?.map(
							(item: PolygonTickerResult) => item.ticker,
						) || [];
					setSearchResults(tickers);
					setIsDropdownOpen(tickers.length > 0);
				} else {
					// Fallback to mock data if your server route returns an error status
					triggerMockFallback();
				}
			} catch (err) {
				console.log(err);
				triggerMockFallback();
			}
		}, 300);

		// Helper to keep the fallback dry
		function triggerMockFallback() {
			const mockTickers = [
				"AAPL",
				"MSFT",
				"TSLA",
				"NVDA",
				"AMD",
				"AMZN",
				"GOOGL",
				"META",
			];
			const filtered = mockTickers.filter((t) =>
				t.includes(tickerInput.toUpperCase()),
			);
			setSearchResults(filtered);
			setIsDropdownOpen(filtered.length > 0);
		}

		return () => clearTimeout(delayDebounce);
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
	const handleSelectTicker = (ticker: string) => {
		if (selectedTickers.includes(ticker)) {
			setTickerInput("");
			setIsDropdownOpen(false);
			return;
		}
		if (selectedTickers.length >= 3) {
			setError("You can select a maximum of 3 tickers.");
			setTickerInput("");
			setIsDropdownOpen(false);
			return;
		}

		setSelectedTickers([...selectedTickers, ticker]);
		setTickerInput("");
		setIsDropdownOpen(false);
		setError("");
	};

	// Remove Selected Ticker Capsule
	const handleRemoveTicker = (tickerToRemove: string) => {
		setSelectedTickers(selectedTickers.filter((t) => t !== tickerToRemove));
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
										key={ticker}
										onClick={() =>
											handleSelectTicker(ticker)
										}
										className="px-4 py-2.5 hover:bg-muted text-sm font-semibold text-foreground cursor-pointer transition-colors flex justify-between items-center"
									>
										<span>{ticker}</span>
										{selectedTickers.includes(ticker) && (
											<span className="text-xs text-primary font-medium">
												Added
											</span>
										)}
									</div>
								))}
							</div>
						)}

						{/* Selected Capsules Container */}
						{selectedTickers.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-2">
								{selectedTickers.map((ticker) => (
									<div
										key={ticker}
										className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
									>
										<span>{ticker}</span>
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
