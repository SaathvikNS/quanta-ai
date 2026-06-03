import os
from datetime import datetime, timedelta

import finnhub
import numpy as np
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv(dotenv_path=".env.local")

FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)
hf_client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_KEY,
)


async def query_finbert_cloud(text: str) -> dict:
    if not text.strip():
        print("Empty text received, returning NEUTRAL")
        return {"label": "NEUTRAL", "score": 0.0}

    try:
        result = hf_client.text_classification(
            text,
            model="ProsusAI/finbert",
        )

        if result and isinstance(result, list) and len(result) > 0:
            top_prediction = max(result, key=lambda x: x.score)
            return {
                "label": top_prediction.label.upper(),
                "score": top_prediction.score,
            }
    except Exception:
        print("Exception occurred, returning NEUTRAL")
        pass
    return {"label": "NEUTRAL", "score": 0.0}


async def get_company_news_analysis(symbol: str, days_back: int = 7):
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")

    raw_news = finnhub_client.company_news(symbol, _from=start_date, to=end_date)
    top_news = raw_news[:10]

    processed_articles = []
    total_sentiment_score = 0.0
    total_confidence_score = 0.0
    valid_sentiments_count = 0

    individual_scores = []
    negative_count = 0

    for item in top_news:
        headline = item.get("headline", "")
        summary = item.get("summary", "")
        text_to_analyze = f"{headline}. {summary}".strip()

        sentiment_data = await query_finbert_cloud(text_to_analyze)

        label = sentiment_data["label"]
        score = sentiment_data["score"]

        total_confidence_score += score

        directional_score = 0.0
        if label == "POSITIVE":
            total_sentiment_score += score
            valid_sentiments_count += 1
            directional_score = score
        elif label == "NEGATIVE":
            total_sentiment_score -= score
            valid_sentiments_count += 1
            directional_score = -score
        elif label == "NEUTRAL":
            valid_sentiments_count += 1

        individual_scores.append(directional_score)

        processed_articles.append(
            {
                "id": item.get("id"),
                "datetime": item.get("datetime"),
                "headline": headline,
                "summary": summary,
                "url": item.get("url"),
                "source": item.get("source"),
                "sentiment": {"label": label, "confidence": round(score, 4)},
            }
        )

    aggregate_score = 0.0
    aggregate_confidence = 0.0
    if valid_sentiments_count > 0:
        aggregate_score = round(total_sentiment_score / valid_sentiments_count, 4)
        aggregate_confidence = round(
            total_confidence_score / len(processed_articles), 4
        )

    risk_score = 0
    risk_level = "LOW"

    if len(processed_articles) > 0:
        std_dev = np.std(individual_scores) if len(individual_scores) > 1 else 0
        neg_ratio = negative_count / len(processed_articles)

        raw_risk = (std_dev * 0.6) + (neg_ratio * 0.4)
        risk_score = min(int(raw_risk * 100), 100)

        if risk_score >= 65:
            risk_level = "HIGH"
        elif risk_score >= 35:
            risk_level = "MEDIUM"

    if aggregate_score > 0.15:
        signal = "BULLISH"
    elif aggregate_score < -0.15:
        signal = "BEARISH"
    else:
        signal = "NEUTRAL"

    return {
        "symbol": symbol.upper(),
        "meta": {
            "articles_analyzed": len(processed_articles),
            "aggregate_sentiment_score": aggregate_score,
            "aggregate_confidence": aggregate_confidence,
            "ai_signal": signal,
            "risk_score": risk_score,
            "risk_level": risk_level,
        },
        "news_panel": processed_articles,
    }
