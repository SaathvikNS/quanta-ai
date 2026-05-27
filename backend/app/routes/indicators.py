from app.schemas.indicators import IndicatorResponse
from app.services.technical_indicators import calculate_indicators
from fastapi import APIRouter

router = APIRouter(prefix="/indicators", tags=["indicators"])


@router.get("/{symbol}", response_model=IndicatorResponse)
async def indicators(symbol: str):
    xchg = symbol.split(":")[1]
    symbol = symbol.split(":")[0]
    return await calculate_indicators(symbol, xchg)
