import yfinance as yf


async def get_company_data(symbol: str, xchg: str):
    if xchg in ["XNGS", "XNYS", "ARCX"]:
        ticker_input = symbol
    else:
        ticker_input = (symbol, xchg)

    ticker = yf.Ticker(ticker_input)

    info = ticker.info
    return {
        "company": info.get("longName"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "country": info.get("country"),
        "website": info.get("website"),
        "employees": info.get("fullTimeEmployees"),
        "businessSummary": info.get("longBusinessSummary"),
    }


async def get_company_fundamentals(symbol: str, xchg: str):
    if xchg in ["XNGS", "XNYS", "ARCX"]:
        ticker_input = symbol
    else:
        ticker_input = (symbol, xchg)

    ticker = yf.Ticker(ticker_input)

    info = ticker.info
    return {
        "pe": info.get("trailingPE"),
        "forwardPE": info.get("forwardPE"),
        "pb": info.get("priceToBook"),
        "peg": info.get("pegRatio"),
        "eps": info.get("trailingEps"),
        "revenue": info.get("totalRevenue"),
        "revenueGrowth": info.get("revenueGrowth"),
        "earningsGrowth": info.get("earningsGrowth"),
        "grossMargin": info.get("grossMargins"),
        "operatingMargin": info.get("operatingMargins"),
        "profitMargin": info.get("profitMargins"),
        "roe": info.get("returnOnEquity"),
        "debtToEquity": info.get("debtToEquity"),
        "currentRatio": info.get("currentRatio"),
        "freeCashFlow": info.get("freeCashFlow"),
        "dividendYield": info.get("dividendYield"),
    }
