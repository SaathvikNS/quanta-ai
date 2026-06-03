from app.services.market_data import calculate_indicators, get_chart_data, get_quote
from fastapi import APIRouter

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/quote")
async def quote(symbol: str, xchg: str):
    return await get_quote(symbol, xchg)


@router.get("/chart")
async def chart(symbol: str, xchg: str, interval: str = "1d", period: str = "6mo"):
    return await get_chart_data(symbol, xchg, interval, period)


@router.get("/indicators")
async def indicators(symbol: str, xchg: str):
    return await calculate_indicators(symbol, xchg)
