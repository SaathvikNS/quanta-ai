from app.routes.indicators import router as indicators_router
from app.routes.market import router as market_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_router)
app.include_router(indicators_router)


@app.get("/")
def health_check():
    return {"status": "ok"}
