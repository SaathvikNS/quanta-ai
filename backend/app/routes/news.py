from app.services.news_data import get_company_news_analysis
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/analysed-feed")
async def get_company_news_feed(
    symbol: str = Query(..., description="The stock ticker symbol, e.g., AAPL"),
    days: int = Query(
        7, description="Number of historical days to inspect for news articles"
    ),
):
    try:
        data = await get_company_news_analysis(symbol=symbol, days_back=days)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to compile financial signal matrix: {str(e)}",
        )
