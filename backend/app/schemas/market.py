from pydantic import BaseModel


class QuoteResponse(BaseModel):
    ticker: str
    company: str
    price: float
    changePct: float


class Candle(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float
