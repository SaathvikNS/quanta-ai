"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Search,
	Star,
	RefreshCw,
	TrendingUp,
	TrendingDown,
	ShieldAlert,
	Newspaper,
	BrainCircuit,
	Menu,
	User,
	X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import SignOutButton from "@/components/ServerActions/signoutbutton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getWatchlist } from "@/lib/data/watchlist";

type Signal = "bullish" | "bearish" | "neutral";
type RiskLevel = "low" | "medium" | "high";

interface PredictionData {
	ticker: string;
	company: string;
	price: number;
	changePct: number;
	signal: Signal;
	confidence: number;
	riskLevel: RiskLevel;
	riskScore: number;
	summary: string;
	sentimentScore: number;
	sentimentLabel: string;
}

interface WatchlistItem {
	symbol: string;
	exchange: string;
}

interface FeatureContribution {
	feature: string;
	contribution: number;
}

interface NewsItem {
	title: string;
	source: string;
	publishedAt: string;
	sentiment: "positive" | "negative" | "neutral";
}

const mockPrediction: PredictionData = {
	ticker: "AAPL",
	company: "Apple Inc.",
	price: 213.42,
	changePct: 2.14,
	signal: "bullish",
	confidence: 78,
	riskLevel: "medium",
	riskScore: 62,
	summary:
		"Momentum remains positive with strong trend continuation above moving averages. Volume expansion suggests sustained institutional participation.",
	sentimentScore: 0.64,
	sentimentLabel: "Positive",
};

const mockFeatures: FeatureContribution[] = [
	{ feature: "RSI", contribution: 31 },
	{ feature: "MACD", contribution: 22 },
	{ feature: "Volume", contribution: 17 },
	{ feature: "Momentum", contribution: 14 },
	{ feature: "Sentiment", contribution: 9 },
	{ feature: "Volatility", contribution: 7 },
];

const mockNews: NewsItem[] = [
	{
		title: "Apple expands AI initiatives across ecosystem",
		source: "Bloomberg",
		publishedAt: "2h ago",
		sentiment: "positive",
	},
	{
		title: "Market volatility rises ahead of Fed comments",
		source: "Reuters",
		publishedAt: "4h ago",
		sentiment: "neutral",
	},
	{
		title: "Tech sector sees valuation concerns",
		source: "CNBC",
		publishedAt: "7h ago",
		sentiment: "negative",
	},
];

function cn(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function DashboardPage() {
	const { data: session } = useSession();

	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchWatchlist() {
			if (!session?.user?.id) return;
			try {
				setLoading(true);
				const data = await getWatchlist(session.user.id);
				setWatchlist(data);
			} catch (error) {
				console.error("Failed to load watchlist:", error);
			} finally {
				setLoading(false);
			}
		}
		fetchWatchlist();
	}, [session?.user?.id]);

	const avatarSrc =
		typeof session?.user?.image === "string" ? session.user.image : null;

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState("");

	const prediction = useMemo(() => mockPrediction, []);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="flex">
				{/* SIDEBAR */}
				<aside
					className={cn(
						"fixed flex flex-col inset-y-0 left-0 z-50 w-72 border-r border-border bg-sidebar-accent-foreground transition-transform duration-300 lg:translate-x-0",
						sidebarOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<div className="flex h-16 items-center border-b border-border px-6 justify-between">
						<Brand />
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="rounded-lg border border-border p-2 lg:hidden"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<div className="p-4 flex-1">
						<div className="sticky top-0 flex gap-3 mb-6 items-center">
							<div className="relative w-10 h-10">
								{avatarSrc ? (
									<Image
										src={avatarSrc}
										alt="user avatar"
										fill
										sizes="a"
										className="rounded-full object-cover"
									/>
								) : (
									<User />
								)}
							</div>
							<div>
								<p className="font-bold text-primary text-lg tracking-wide">
									{session?.user?.name}
								</p>
								<p className="font-bold text-muted-foreground text-xs tracking-wider">
									@{session?.user?.displayName}
								</p>
							</div>
						</div>

						<div className="mb-6">
							<p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
								Watchlist
							</p>

							<div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
								{loading ? (
									<p className="text-xs text-zinc-500 animate-pulse p-2">
										Loading watchlist...
									</p>
								) : watchlist.length === 0 ? (
									<p className="text-xs text-zinc-500 p-2">
										No items in watchlist.
									</p>
								) : (
									watchlist.map((item) => (
										<button
											key={`${item.symbol}-${item.exchange}`}
											className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-3 transition hover:border-zinc-700 hover:bg-zinc-800"
										>
											<div className="text-left">
												<p className="font-mono text-sm font-semibold">
													{item.symbol}
												</p>
												<p className="text-xs text-zinc-500">
													{item.exchange}
												</p>
											</div>
											<Star className="h-4 w-4 text-amber-400 fill-amber-400" />
										</button>
									))
								)}
							</div>
						</div>

						{/* <div>
                            <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">
							Alerts
                            </p>
							
                            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
							<div className="flex items-center gap-2">
							<Bell className="h-4 w-4 text-orange-400" />
							<p className="text-sm">3 Active Alerts</p>
							</div>
                            </div>
                        </div> */}
					</div>
					<div className="fixed bottom-0 w-full p-4">
						<SignOutButton />
					</div>
				</aside>

				{/* MAIN */}
				<main className="flex-1 lg:ml-72">
					{/* HEADER */}
					<header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/80 backdrop-blur flex justify-between">
						<div className="flex h-16 items-center gap-4 px-4 md:px-6">
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="rounded-lg border border-zinc-800 p-2 lg:hidden"
							>
								<Menu className="h-5 w-5" />
							</button>

							{/* SEARCH */}
							<div className="relative w-md flex-1">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search ticker..."
									className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 text-sm outline-none transition focus:border-zinc-600"
								/>
							</div>

							<button className="flex h-11 items-center gap-2 rounded-xl border border-zinc-800 px-4 text-sm transition hover:bg-zinc-900">
								<RefreshCw className="h-4 w-4" />
								Refresh
							</button>
						</div>
					</header>

					{/* CONTENT */}
					<div className="space-y-6 p-4 md:p-6">
						{/* HERO */}
						<section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
							<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
								<div>
									<div className="flex items-center gap-3">
										<h2 className="font-mono text-3xl font-bold">
											{prediction.ticker}
										</h2>

										<span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
											{prediction.signal}
										</span>
									</div>

									<p className="mt-2 text-zinc-400">
										{prediction.company}
									</p>
								</div>

								<div className="flex items-end gap-6">
									<div>
										<p className="text-sm text-zinc-500">
											Current Price
										</p>

										<p className="text-4xl font-bold">
											${prediction.price.toFixed(2)}
										</p>
									</div>

									<div
										className={cn(
											"flex items-center gap-1 text-lg font-semibold",
											prediction.changePct >= 0
												? "text-emerald-400"
												: "text-red-400",
										)}
									>
										{prediction.changePct >= 0 ? (
											<TrendingUp className="h-5 w-5" />
										) : (
											<TrendingDown className="h-5 w-5" />
										)}
										{prediction.changePct.toFixed(2)}%
									</div>
								</div>
							</div>
						</section>

						{/* GRID */}
						<section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
							{/* PRICE CHART */}
							<div className="xl:col-span-3">
								<Card title="Price Chart">
									<div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50">
										<p className="text-sm text-zinc-500">
											Replace with TradingView / Recharts
											/ Lightweight Charts
										</p>
									</div>
								</Card>
							</div>

							{/* RIGHT PANEL */}
							<div className="space-y-6">
								<Card title="AI Signal">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<p className="text-sm text-zinc-400">
												Confidence
											</p>

											<p className="font-semibold">
												{prediction.confidence}%
											</p>
										</div>

										<div className="h-2 overflow-hidden rounded-full bg-zinc-800">
											<div
												className="h-full rounded-full bg-emerald-400"
												style={{
													width: `${prediction.confidence}%`,
												}}
											/>
										</div>
									</div>
								</Card>

								<Card title="Risk Profile">
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<ShieldAlert className="h-5 w-5 text-orange-400" />

											<span className="font-semibold capitalize">
												{prediction.riskLevel} Risk
											</span>
										</div>

										<div>
											<p className="mb-2 text-sm text-zinc-400">
												Risk Score
											</p>

											<div className="h-2 overflow-hidden rounded-full bg-zinc-800">
												<div
													className="h-full rounded-full bg-orange-400"
													style={{
														width: `${prediction.riskScore}%`,
													}}
												/>
											</div>
										</div>
									</div>
								</Card>
							</div>
						</section>

						{/* STATS */}
						<section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
							{[
								["RSI", "61.2"],
								["MACD", "1.42"],
								["SMA20", "$208.12"],
								["SMA50", "$201.54"],
								["Volume", "84M"],
								["Volatility", "2.8%"],
							].map(([label, value]) => (
								<div
									key={label}
									className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
								>
									<p className="text-xs uppercase tracking-wider text-zinc-500">
										{label}
									</p>

									<p className="mt-3 text-2xl font-bold">
										{value}
									</p>
								</div>
							))}
						</section>

						{/* SUMMARY + FEATURES */}
						<section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
							<Card title="AI Summary">
								<div className="flex items-start gap-3">
									<BrainCircuit className="mt-1 h-5 w-5 text-violet-400" />

									<p className="leading-relaxed text-zinc-300">
										{prediction.summary}
									</p>
								</div>
							</Card>

							<Card title="Feature Attribution">
								<div className="space-y-4">
									{mockFeatures.map((feature) => (
										<div key={feature.feature}>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span>{feature.feature}</span>
												<span>
													{feature.contribution}%
												</span>
											</div>

											<div className="h-2 overflow-hidden rounded-full bg-zinc-800">
												<div
													className="h-full rounded-full bg-blue-400"
													style={{
														width: `${feature.contribution}%`,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</Card>
						</section>

						{/* NEWS + BACKTEST */}
						<section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
							<Card title="News Sentiment">
								<div className="space-y-4">
									{mockNews.map((news) => (
										<div
											key={news.title}
											className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
										>
											<div className="mb-3 flex items-start justify-between gap-3">
												<p className="text-sm leading-relaxed">
													{news.title}
												</p>

												<span
													className={cn(
														"rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
														news.sentiment ===
															"positive"
															? "bg-emerald-500/10 text-emerald-400"
															: news.sentiment ===
																  "negative"
																? "bg-red-500/10 text-red-400"
																: news.sentiment ===
																	  "neutral"
																	? "bg-zinc-700 text-zinc-300"
																	: "",
													)}
												>
													{news.sentiment}
												</span>
											</div>

											<div className="flex items-center justify-between text-xs text-zinc-500">
												<div className="flex items-center gap-1">
													<Newspaper className="h-3 w-3" />
													{news.source}
												</div>

												<span>{news.publishedAt}</span>
											</div>
										</div>
									))}
								</div>
							</Card>

							<Card title="Backtest Performance">
								<div className="space-y-6">
									<div className="flex h-55 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50">
										<p className="text-sm text-zinc-500">
											Replace with equity curve chart
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<Metric label="Accuracy" value="68%" />
										<Metric
											label="Bull Hit Rate"
											value="72%"
										/>
										<Metric
											label="Bear Hit Rate"
											value="61%"
										/>
										<Metric label="Signals" value="143" />
									</div>
								</div>
							</Card>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}

interface CardProps {
	title: string;
	children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
			<div className="mb-5 flex items-center justify-between">
				<h3 className="text-sm font-semibold tracking-wide text-zinc-300">
					{title}
				</h3>
			</div>

			{children}
		</div>
	);
}

interface MetricProps {
	label: string;
	value: string;
}

function Metric({ label, value }: MetricProps) {
	return (
		<div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
			<p className="text-xs uppercase tracking-wider text-zinc-500">
				{label}
			</p>

			<p className="mt-2 text-2xl font-bold">{value}</p>
		</div>
	);
}
