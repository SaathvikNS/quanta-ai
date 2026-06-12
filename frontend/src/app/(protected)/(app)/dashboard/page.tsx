"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  LoaderPinwheel,
} from "lucide-react";
import { Brand } from "@/components/brand";
import SignOutButton from "@/components/ServerActions/signoutbutton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { addWatchlistItem, getWatchlist, removeWatchlistItem } from "@/lib/data/watchlist";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SearchTicker } from "../../onboarding/OnBoardingClientForm";
import { createChart, ColorType, CandlestickSeries, LineSeries } from "lightweight-charts";

import { Candle, ChartProps, FundamentalsType, IndicatorsType, NewsType, ProfileType, QuoteType, WatchlistItem } from "@/types/DashboardTypes";



function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function CandlestickChart({ candles }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71717a",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#3f3f46",
      },
      timeScale: {
        borderColor: "#3f3f46",
        timeVisible: true,
      },
      width: chartRef.current.clientWidth,
      height: 340,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderUpColor: "#34d399",
      borderDownColor: "#f87171",
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });

    const formatted = candles.map((c) => ({
      time: c.time.split("T")[0] as unknown as import("lightweight-charts").Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(formatted);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartRef.current) {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles]);

  return <div ref={chartRef} className="w-full" />;
}


export default function DashboardPage() {
  const { data: session } = useSession();

  const validPeriods = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y"]
  const validIntervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]

  const [period, setPeriod] = useState(validPeriods[4]);
  const [interval, setInterval] = useState(validIntervals[8]);

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState<Omit<SearchTicker, "name"> | null>(null);

  const [quote, setQuote] = useState<QuoteType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [fundamentals, setFundamentals] = useState<FundamentalsType | null>(null);
  const [indicators, setIndicators] = useState<IndicatorsType | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [news, setNews] = useState<NewsType | null>(null);

  const [marketLoading, setMarketLoading] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsType["news_panel"] | null>(null);

  const displayedNews = isExpanded ? newsItems : newsItems?.slice(0, 5);

  const isInWatchlist = useMemo(() => {
    if (!selectedTicker) return false;

    return watchlist.some(
      (item) =>
        item.symbol === selectedTicker.symbol &&
        item.exchange === selectedTicker.exchange
    );
  }, [watchlist, selectedTicker]);

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
  const [searchResults, setSearchResults] = useState<SearchTicker[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/tickers?search=${encodeURIComponent(search)}`,
          {
            signal: controller.signal,
          },
        );

        if (res.ok) {
          const data = await res.json();

          console.log("data", data)

          const tickers: SearchTicker[] =
            data.results?.map(
              (item: {
                symbol: string;
                exchange: string;
                name: string;
                mic_code: string;
                currency: string;
              }) => ({
                symbol: item.symbol,
                exchange: item.exchange,
                name: item.name,
                mic_code: item.mic_code,
                currency: item.currency,
              }),
            ) || [];

          setSearchResults(tickers);
          setIsDropdownOpen(tickers.length > 0);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Ticker fetch error:", err);
      }
    }, 200);

    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [search]);

  const handleSelectTicker = async (ticker: Omit<SearchTicker, "name">) => {
    setSelectedTicker(ticker);
    setSearch("");
    setIsDropdownOpen(false);
    try {
      setMarketLoading(true);

      const [quoteRes, profileRes, fundamentalsRes, indicatorsRes, chartDataRes, newsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/quote?symbol=${ticker.symbol}&xchg=${ticker.mic_code}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/profile?symbol=${ticker.symbol}&xchg=${ticker.mic_code}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/fundamentals?symbol=${ticker.symbol}&xchg=${ticker.mic_code}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/indicators?symbol=${ticker.symbol}&xchg=${ticker.mic_code}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/market/chart?symbol=${ticker.symbol}&xchg=${ticker.mic_code}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/analysed-feed?symbol=${ticker.symbol}`),
      ]);

      const quoteData = await quoteRes.json();
      setQuote(quoteData);
      const profileData = await profileRes.json();
      setProfile(profileData);
      const fundamentalsData = await fundamentalsRes.json();
      setFundamentals(fundamentalsData);
      const indicatorsData = await indicatorsRes.json();
      setIndicators(indicatorsData);
      const chartData = await chartDataRes.json();
      setCandles(chartData);
      const newsData = await newsRes.json();
      setNews(newsData);
      const newsItems = newsData.news_panel;
      setNewsItems(newsItems);

    } catch (error) {
      console.error("Failed to select ticker: ", error);
    } finally {
      setMarketLoading(false);
    }
  };

  const handleAdd = async (ticker: Omit<SearchTicker, "name">) => {
    if (!session?.user.id) return;
    try {
      await addWatchlistItem(session.user.id, ticker);
      const data = await getWatchlist(session.user.id);
      setWatchlist(data);
    } catch (error) {
      console.error("Failed to add item: ", error);
    }
  };

  const handleRemove = async (symbol: string, exchange: string) => {
    if (!session?.user.id) return;

    setWatchlist((prev) =>
      prev.filter(
        (item) =>
          !(item.symbol === symbol && item.exchange === exchange),
      ),
    );

    try {
      await removeWatchlistItem(session.user.id, symbol, exchange);
      const data = await getWatchlist(session.user.id);
      setWatchlist(data);
    } catch (error) {
      console.error("Failed to remove item: ", error);
      const data = await getWatchlist(session.user.id);
      setWatchlist(data);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={cn(
            "fixed flex flex-col inset-y-0 left-0 z-50 w-72 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
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
                <p className="font-bold text-primary tracking-wide">
                  {session?.user?.name}
                </p>
                <p className="font-bold text-muted-foreground text-xs tracking-wider">
                  @{session?.user?.displayName}
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-border mb-6"></div>

            <div className="mb-6">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Watchlist
              </p>

              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-xs text-muted-foreground animate-pulse p-2">
                    Loading watchlist...
                  </p>
                ) : watchlist.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">
                    No items in watchlist.
                  </p>
                ) : (
                  watchlist.map((item) => (
                    <div
                      key={`${item.symbol}-${item.exchange}`}
                      className={`flex w-full items-center justify-between rounded-lg cursor-pointer border border-border  px-3 py-3 transition hover:border-border-50 ${selectedTicker?.symbol === item.symbol && selectedTicker.exchange === item.exchange ? "bg-card hover:bg-background/50" : "bg-background hover:bg-background/20"}`}
                    >
                      <button className="flex-1 cursor-pointer" disabled={selectedTicker?.symbol === item.symbol && selectedTicker.exchange === item.exchange} onClick={() => handleSelectTicker(item)}>
                        <div className="text-left">
                          <p className="font-mono text-sm font-semibold">
                            {item.symbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.exchange}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(
                            item.symbol,
                            item.exchange,
                          );
                        }}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* <div>
                            <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
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
          <div className="fixed bottom-0 grid grid-cols-2 gap-3 w-full p-4">
            <ThemeToggle variant="lg" />
            <SignOutButton />
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 lg:ml-72">
          {/* HEADER */}
          <header className="sticky top-0 z-40 bg-background backdrop-blur flex justify-between">
            <div className="flex h-16 w-full items-center gap-4 px-4 md:px-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* SEARCH WRAPPER WITH REF */}
              <div className="relative flex-1" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    if (!value.trim()) {
                      setSearchResults([]);
                      setIsDropdownOpen(false);
                    }
                  }}
                  placeholder="Search ticker..."
                  className="h-11 w-full rounded-xl border border-border/50 bg-card pl-10 pr-4 text-sm dark:text-zinc-100 outline-none transition focus:border-zinc-600"
                />

                {/* REAL-TIME TICKER RESULT DROPDOWN */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[105%] bg-background/98 border border-border/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-border">
                    {searchResults.map((ticker) => (
                      <div
                        key={`${ticker.symbol}-${ticker.exchange}`}
                        onClick={() =>
                          handleSelectTicker(ticker)
                        }
                        className="px-4 py-3 hover:bg-border/40 text-sm font-medium dark:text-zinc-200 dark:hover:text-white cursor-pointer transition-colors flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono font-bold tracking-wide">
                            {ticker.symbol}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {ticker.name}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-wider bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50">
                          {ticker.exchange}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="flex h-11 items-center gap-2 rounded-xl bg-muted px-4 text-sm transition hover:bg-border/50 cursor-pointer">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </header>

          {/* CONTENT */}
          {marketLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <LoaderPinwheel className="h-8 w-8 animate-spin" />
            </div>
          ) : quote == null ? (
            <div className="w-full h-full flex justify-center items-center">select a ticker to get started</div>
          ) : (
            <div className="space-y-6 p-4 md:p-6">
              {/* HERO */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-mono text-3xl font-bold">
                        {quote?.ticker ?? "SELECT"}
                      </h2>

                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        {news?.meta.ai_signal}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInWatchlist) {
                              handleRemove(
                                selectedTicker!.symbol,
                                selectedTicker!.exchange
                              );
                            } else {
                              handleAdd(selectedTicker!);
                            }
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-4 w-4 ${isInWatchlist
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground"
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-zinc-400">
                      {profile?.company}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-muted">
                      {quote?.exchange}
                    </span>

                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        quote?.marketState === "REGULAR"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-orange-500/20 text-orange-400",
                      )}
                    >
                      {quote?.marketState}
                    </span>
                  </div>

                  <div className="flex items-end gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Price
                      </p>

                      <p className="text-4xl font-bold">
                        {quote?.currency} {quote?.price}
                      </p>
                    </div>

                    {quote?.changePct != null && (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-lg font-semibold",
                          quote.changePct >= 0
                            ? "text-emerald-400"
                            : "text-red-400",
                        )}
                      >
                        {quote.changePct >= 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {quote.changePct.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* GRID */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                {/* PRICE CHART */}
                <div className="xl:col-span-3">
                  <Card title="Price Chart">
                    <div className="flex h-100 items-center justify-center rounded-xl border border-dashed border-border bg-background">
                      <CandlestickChart candles={candles} indicators={indicators ?? undefined} />
                    </div>
                  </Card>
                </div>

                {/* RIGHT PANEL */}
                <div className="space-y-6">
                  <Card title="AI Signal">
                    {news?.meta.aggregate_confidence && (<div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-zinc-400">
                          Confidence
                        </p>

                        <p className="font-semibold">
                          {news.meta.aggregate_confidence * 100}%
                        </p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-emerald-400"
                          style={{
                            width: `${news.meta.aggregate_confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>)}
                  </Card>

                  <Card title="Risk Profile">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-orange-400" />

                        <span className="font-semibold capitalize">
                          {news?.meta.risk_level} Risk
                        </span>
                      </div>

                      <div>
                        <p className="mb-2 text-sm text-zinc-400">
                          Risk Score
                        </p>

                        <div className="h-2 overflow-hidden rounded-full bg-border">
                          <div
                            className="h-full rounded-full bg-orange-400"
                            style={{
                              width: `${news?.meta.risk_score}%`,
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
                  ["RSI", indicators?.rsi],
                  ["MACD", indicators?.macd],
                  ["SMA20", indicators?.sma20],
                  ["SMA50", indicators?.sma50],
                  ["Attribution", indicators?.atr],
                  ["Volatility", indicators?.volatility],
                ].map(([label, value]) => (
                  <Metric key={label} label={label!.toString()} value={value} />

                ))}
              </section>

              <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
                {[
                  ["Market Cap", formatCompact(quote?.marketCap)],
                  ["Volume", formatCompact(quote?.volume)],
                  ["Avg Volume", formatCompact(quote?.avgVolume)],
                  ["Beta", quote?.beta || ""],
                  ["52W High", quote?.week52High || ""],
                  ["52W Low", quote?.week52Low || ""],
                ].map(([label, value]) => (
                  <Metric key={label} label={label.toString()} value={value} />
                ))}
              </section>

              {/* SUMMARY + News Analysis */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card title="AI Summary">
                  <div className="flex items-start gap-3">
                    <BrainCircuit className="mt-1 h-5 w-5 text-violet-400" />

                    <p className="leading-relaxed text-muted-foreground">
                      {profile?.businessSummary}
                    </p>
                  </div>
                </Card>

                <Card title="News Sentiment">
                  <div className="space-y-4">
                    {displayedNews!.map((news) => (
                      <div
                        key={news.id}
                        className="rounded-xl border border-border bg-background p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <p className="text-sm leading-relaxed">
                            {news.headline}
                          </p>

                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                              news.sentiment.label.toLowerCase() ===
                                "positive"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : news.sentiment.label.toLowerCase() ===
                                  "negative"
                                  ? "bg-red-500/10 text-red-400"
                                  : news.sentiment.label.toLowerCase() ===
                                    "neutral"
                                    ? "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                                    : "",
                            )}
                          >
                            {news.sentiment.label.toLowerCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Newspaper className="h-3 w-3" />
                            {news.source}
                          </div>

                          <span onClick={() => window.open(news.url, "_blank")} className="cursor-pointer">{news.source}</span>
                        </div>
                      </div>
                    ))}
                    {newsItems!.length > 5 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full rounded-xl border border-border bg-background/50 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-background hover:text-foreground"
                      >
                        {isExpanded ? "Show Less" : `Show More`}
                      </button>
                    )}
                  </div>
                </Card>

              </section>

              {/* Feature + BACKTEST */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card title="Feature Attribution">
                  <div className="space-y-3 text-sm">
                    <Row label="PE" value={fundamentals?.pe} />
                    <Row label="Forward PE" value={fundamentals?.forwardPE} />
                    <Row label="PB" value={fundamentals?.pb} />
                    <Row label="PEG" value={fundamentals?.peg} />
                    <Row label="EPS" value={fundamentals?.eps} />
                    <Row label="ROE" value={fundamentals?.roe} />
                  </div>
                </Card>

                {/*TODO*/}
                <Card title="Backtest Performance">
                  <div className="space-y-6">
                    <div className="flex h-55 items-center justify-center rounded-xl border border-dashed border-border bg-background/">
                      <p className="text-sm text-muted-foreground">
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
              <section>
                <Card title="Company Information">
                  <div className="space-y-4 flex justify-start gap-20">

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Sector
                      </p>
                      <p>{profile?.sector}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Industry
                      </p>
                      <p>{profile?.industry}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Country
                      </p>
                      <p>{profile?.country}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Employees
                      </p>
                      <p>
                        {profile?.employees?.toLocaleString()}
                      </p>
                    </div>

                  </div>

                </Card>
              </section>
            </div>)}
        </main>
      </div>
    </div>
  );
}

function formatCompact(value?: number) {
  if (!value) return "-";

  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-max">
      <div className={`mb-5 flex items-center justify-between`}>
        <h3 className="text-sm font-semibold tracking-wide dark:text-zinc-300">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string | number | null | undefined;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

interface RowProps {
  label: string;
  value: string | number | null | undefined;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/20 transition-colors">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-mono font-semibold">
        {value ?? "-"}
      </span>
    </div>
  );
}
