from app.schemas.market import QuoteResponse
from app.services.market_data import get_chart_data, get_quote
from fastapi import APIRouter

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/quote/{symbol}", response_model=QuoteResponse)
async def quote(symbol: str):
    xchg = symbol.split(":")[1]
    symbol = symbol.split(":")[0]
    return await get_quote(symbol, xchg)


@router.get("/chart/{symbol}")
async def chart(symbol: str):
    xchg = symbol.split(":")[1]
    symbol = symbol.split(":")[0]
    return await get_chart_data(symbol, xchg)
