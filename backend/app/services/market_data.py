import yfinance as yf


async def get_quote(symbol: str, xchg: str):
    ticker = yf.Ticker((symbol, xchg))

    info = ticker.info

    print(info)

    current_price = info.get("currentPrice")
    previous_close = info.get("previousClose")

    if not current_price or not previous_close:
        raise Exception("Unable to fetch market data")

    change_pct = ((current_price - previous_close) / previous_close) * 100

    return {
        "ticker": symbol.upper(),
        "company": info.get("longName", symbol.upper()),
        "price": round(current_price, 2),
        "changePct": round(change_pct, 2),
    }


async def get_chart_data(
    symbol: str, xchg: str, interval: str = "1d", period: str = "6mo"
):
    ticker = yf.Ticker((symbol, xchg))

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
                "volume": float(row["Volume"].item()),
            }
        )

    return candles
