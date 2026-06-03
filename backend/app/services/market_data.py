import numpy as np
import pandas_ta as ta
import yfinance as yf


async def get_quote(symbol: str, xchg: str):
    if xchg in ["XNGS", "XNYS", "ARCX", "XBOG", "XWBO"]:
        ticker_input = symbol
    else:
        ticker_input = (symbol, xchg)

    ticker = yf.Ticker(ticker_input)

    info = ticker.info

    current_price = info.get("currentPrice")
    previous_close = info.get("previousClose")

    if not current_price or not previous_close:
        raise Exception("Unable to fetch market data")

    change = current_price - previous_close
    change_pct = (change / previous_close) * 100

    return {
        "ticker": symbol.upper(),
        "exchange": xchg,
        "displayName": info.get("displayName"),
        "company": info.get("longName"),
        "price": round(current_price, 2),
        "change": round(change, 2),
        "changePct": round(change_pct, 2),
        "marketCap": info.get("marketCap"),
        "volume": info.get("volume"),
        "avgVolume": info.get("averageVolume"),
        "week52High": info.get("fiftyTwoWeekHigh"),
        "week52Low": info.get("fiftyTwoWeekLow"),
        "beta": info.get("beta"),
        "currency": info.get("currency"),
        "marketState": info.get("marketState"),
    }


async def get_chart_data(symbol: str, xchg: str, interval: str, period: str):
    if xchg in ["XNGS", "XNYS", "ARCX"]:
        ticker_input = symbol
    else:
        ticker_input = (symbol, xchg)

    ticker = yf.Ticker(ticker_input)

    history = ticker.history(interval=interval, period=period)

    candles = []

    for index, row in history.iterrows():
        candles.append(
            {
                "time": index,
                "open": round(float(row["Open"].item()), 2),
                "high": round(float(row["High"].item()), 2),
                "low": round(float(row["Low"].item()), 2),
                "close": round(float(row["Close"].item()), 2),
                "volume": int(row["Volume"].item()),
            }
        )

    return candles


async def calculate_indicators(symbol: str, xchg: str):
    if xchg in ["XNGS", "XNYS", "ARCX"]:
        ticker_input = symbol
    else:
        ticker_input = (symbol, xchg)

    ticker = yf.Ticker(ticker_input)

    history = ticker.history(period="6mo")
    close = history["Close"]

    rsi_series = history.ta.rsi()
    macd_df = history.ta.macd()
    print(macd_df.describe())
    sma20 = history.ta.sma(length=20)
    sma50 = history.ta.sma(length=50)
    ema20 = history.ta.ema(length=20)
    atr = history.ta.atr()
    bbands = history.ta.bbands(length=20)

    returns = close.pct_change().dropna()
    volatility = np.std(returns) * 100

    return {
        "rsi": round(float(rsi_series.iloc[-1]), 2),
        "macd": round(float(macd_df["MACD_12_26_9"].iloc[-1]), 2),
        "macd_signal": round(float(macd_df["MACDs_12_26_9"].iloc[-1]), 2),
        "macd_hist": round(float(macd_df["MACDh_12_26_9"].iloc[-1]), 2),
        "sma20": round(float(sma20.iloc[-1]), 2),
        "sma50": round(float(sma50.iloc[-1]), 2),
        "ema20": round(float(ema20.iloc[-1]), 2),
        "atr": round(float(atr.iloc[-1]), 2),
        "volatility": round(float(volatility), 2),
        "bolingerUpper": round(float(bbands["BBU_20_2.0_2.0"].iloc[-1]), 2),
        "bolingerMiddle": round(float(bbands["BBM_20_2.0_2.0"].iloc[-1]), 2),
        "bolingerLower": round(float(bbands["BBL_20_2.0_2.0"].iloc[-1]), 2),
    }
