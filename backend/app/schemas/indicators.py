from pydantic import BaseModel


class IndicatorResponse(BaseModel):
    rsi: float
    macd: float
    sma20: float
    sma50: float
    volume: float
    volatility: float
