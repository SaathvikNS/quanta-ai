from app.services.company_data import get_company_data, get_company_fundamentals
from fastapi import APIRouter

router = APIRouter(prefix="/company", tags=["company"])


@router.get("/profile")
async def company_profile(symbol: str, xchg: str):
    return await get_company_data(symbol, xchg)


@router.get("/fundamentals")
async def company_fundamentals(symbol: str, xchg: str):
    return await get_company_fundamentals(symbol, xchg)
