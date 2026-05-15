import NavBar from "@/components/NavBar";
import {
	ArrowRight,
	BarChart3,
	Brain,
	LineChart,
	Newspaper,
	ShieldAlert,
	Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
	const modules = [
		{
			i: LineChart,
			t: "Price & indicators",
			d: "Live OHLC, RSI, MACD, moving averages, and volume profile.",
		},
		{
			i: Brain,
			t: "Trend prediction",
			d: "Bullish / bearish / neutral classification with calibrated probability.",
		},
		{
			i: ShieldAlert,
			t: "Risk evaluation",
			d: "Volatility, drawdown, momentum strength → low/medium/high rating.",
		},
		{
			i: Newspaper,
			t: "News sentiment",
			d: "Recent headlines scored with FinBERT-equivalent reasoning.",
		},
		{
			i: BarChart3,
			t: "Explainability",
			d: "Per-feature contribution charts so every signal is auditable.",
		},
		{
			i: Sparkles,
			t: "Plain-English summary",
			d: "Technical output translated into a single readable paragraph.",
		},
	];

	return (
		<div className="min-h-screen">
			<NavBar />
			{/* Hero */}
			<section className="relative overflow-hidden mt-25">
				<div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
					<h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
						Stock intelligence with{" "}
						<span className="text-primary">
							transparent reasoning
						</span>
						, not black-box forecasts.
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
						Quanta combines trend prediction, volatility-aware risk
						scoring, news sentiment, and feature-attribution
						explainability into a single research terminal — so
						every signal comes with the reasoning behind it.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link
							href={"/login"}
							className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
						>
							Launch terminal <ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* Modules */}
			<section id="features">
				<div className="mx-auto max-w-7xl px-6 py-10">
					<div className="mb-12 flex items-end justify-between">
						<div>
							<h2 className="mt-2 text-3xl font-semibold tracking-tight">
								Six analysis layers, one report
							</h2>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-card rounded-xl">
						{modules.map((f) => (
							<div
								key={f.t}
								className="bg-surface-1 p-6 hover:bg-surface-2 transition-colors"
							>
								<f.i className="h-5 w-5 text-primary" />
								<h3 className="mt-4 text-base font-medium">
									{f.t}
								</h3>
								<p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
									{f.d}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Methodology */}
			<section id="how">
				<div className="mx-auto max-w-7xl px-6 py-10">
					<h2 className="mt-2 text-3xl font-semibold tracking-tight max-w-2xl">
						Decision support, not magic forecasts.
					</h2>
					<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								n: "01",
								t: "Ingest",
								d: "Pull OHLC and recent headlines via Twelve Data and curated news sources.",
							},
							{
								n: "02",
								t: "Analyze",
								d: "Compute technical features, run gradient-boosted classifier, and score sentiment.",
							},
							{
								n: "03",
								t: "Explain",
								d: "Surface feature attributions, confidence intervals, and a natural-language rationale.",
							},
						].map((s) => (
							<div key={s.n}>
								<div className="font-mono text-xs text-primary">
									{s.n}
								</div>
								<h3 className="mt-2 text-lg font-medium">
									{s.t}
								</h3>
								<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
									{s.d}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<footer className="border-t border-border/60 py-8">
				<div className="mx-auto max-w-7xl px-6 flex items-center justify-between text-xs text-muted-foreground">
					© Quanta Intelligence ● By Dr. Joydeep Roy, MBBS, FRCS,
					Ph.D, MBA, MCA, M.Sc., IAS, IPS, CA, CS
				</div>
			</footer>
		</div>
	);
}
