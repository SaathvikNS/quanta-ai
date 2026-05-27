import numpy as np
import pandas_ta as ta
import yfinance as yf


async def calculate_indicators(symbol: str, xchg: str):
    ticker = yf.Ticker((symbol, xchg))

    history = ticker.history(period="6mo")

    close = history["Close"]

    rsi_series = ta.rsi(close, length=14)  # type: ignore

    macd_df = ta.macd(close)  # type: ignore

    sma20 = ta.sma(close, length=20)  # type: ignore
    sma50 = ta.sma(close, length=50)  # type: ignore

    returns = close.pct_change().dropna()

    volatility = np.std(returns) * 100

    latest_volume = history["Volume"].iloc[-1]

    return {
        "rsi": round(float(rsi_series.iloc[-1]), 2),
        "macd": round(float(macd_df["MACD_12_26_9"].iloc[-1]), 2),
        "sma20": round(float(sma20.iloc[-1]), 2),
        "sma50": round(float(sma50.iloc[-1]), 2),
        "volume": float(latest_volume),
        "volatility": round(float(volatility), 2),
    }
