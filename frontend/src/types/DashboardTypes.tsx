export interface QuoteType {
  ticker: string;
  exchange: string;
  displayName: string;
  company: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: number;
  volume: number;
  avgVolume: number;
  week52High: number;
  week52Low: number;
  beta: number;
  currency: string;
  marketState: string;
}

export interface ProfileType {
  company: string;
  sector: string;
  industry: string;
  country: string;
  website: string;
  employees: number;
  businessSummary: string;
}

export interface FundamentalsType {
  pe: number;
  forwardPE: number;
  pb: number;
  peg: number;
  eps: number;
  revenue: number;
  revenueGrowth: number;
  earningsGrowth: number;
  grossMargin: number;
  operatingMargin: number;
  profitMargin: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
  freeCashFlow: number;
  dividendYield: number;
}

export interface IndicatorsType {
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  sma20: number;
  sma50: number;
  ema20: number;
  atr: number;
  volatility: number;
  bolingerUpper: number;
  bolingerMiddle: number;
  bolingerLower: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MetaType {
  articles_analyzed: number;
  aggregate_sentiment_score: number;
  aggregate_confidence: number;
  ai_signal: "BULLISH" | "BEARISH" | "NEUTRAL";
  risk_score: number;
  risk_level: "HIGH" | "MEDIUM" | "LOW";
}

interface News {
  id: number;
  datetime: number;
  headline: string;
  summary: string;
  url: string;
  source: string;
  sentiment: {
    label: "NEUTRAL" | "POSITIVE" | "NEGATIVE";
    confidence: number;
  }
}

export interface NewsType {
  symbol: string;
  meta: MetaType;
  news_panel: News[];
}

export interface WatchlistItem {
  symbol: string;
  exchange: string;
  mic_code: string;
  currency: string;
}

export interface ChartProps {
  candles: Candle[];
  indicators?: IndicatorsType;
}
