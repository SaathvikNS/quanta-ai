# QUANTA Intelligence - Full-Stack AI Stock Analysis Platform

A comprehensive AI-powered financial intelligence platform that helps users make informed stock market decisions through explainable analytics, technical indicators, sentiment analysis, and machine learning predictions.

## Features

### Core Functionality

- **AI Trend Prediction**: Bullish/Bearish/Neutral predictions with confidence scores
- **Risk Assessment**: Volatility, drawdown, Sharpe ratio analysis with risk scoring
- **Technical Indicators**: RSI, MACD, SMA, EMA, Bollinger Bands, ATR, Relative Volume
- **Sentiment Analysis**: FinBERT-powered financial news sentiment scoring
- **Explainability**: SHAP feature attribution and human-readable insights
- **Natural Language Summaries**: AI-generated trading rationale explanations
- **Historical Backtesting**: Strategy performance and prediction accuracy tracking

### User Features

- User authentication with JWT
- Stock watchlists
- Alerts and notifications
- Personalized dashboard
- Admin panel for data management

## Technology Stack

### Frontend

- **Next.js 15** - Modern React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Recharts** - Data visualization
- **Zustand** - Client state management

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **PostgreSQL** - Primary database
- **Redis** - Caching and Celery broker
- **Celery** - Async task queue

### ML & Analytics

- **scikit-learn** - Machine learning
- **XGBoost** - Gradient boosting
- **SHAP** - Model explainability
- **FinBERT** - Financial sentiment analysis
- **pandas/numpy** - Data manipulation

### APIs

- **Twelve Data API** - Market data
- **Finnhub API** - Financial news

## Project Structure

```
quanta.ai/
├── backend/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   ├── ml/               # ML predictions
│   │   ├── sentiment/        # Sentiment analysis
│   │   ├── explainability/   # SHAP explanations
│   │   ├── risk/             # Risk analysis
│   │   ├── tasks/            # Celery tasks
│   │   ├── utils/            # Utilities
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # Database setup
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Registration
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── stock/        # Stock analysis
│   │   │   ├── watchlist/    # Watchlist
│   │   │   ├── alerts/       # Alerts
│   │   │   ├── admin/        # Admin panel
│   │   │   └── layout.tsx    # Root layout
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities
│   │   ├── types/            # TypeScript types
│   │   ├── store/            # Zustand stores
│   │   └── styles/           # CSS
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose (recommended)
- Or: Python 3.11+, Node.js 18+, PostgreSQL 15+, Redis 7+

### Quick Start with Docker

1. **Clone and Setup**

    ```bash
    git clone <repository>
    cd quanta.ai
    ```

2. **Configure Environment**

    ```bash
    cp backend/.env.example backend/.env
    # Edit backend/.env with your API keys
    ```

3. **Start Services**

    ```bash
    docker-compose up -d
    ```

4. **Initialize Database**

    ```bash
    docker-compose exec backend alembic upgrade head
    ```

5. **Access Application**
    - Frontend: http://localhost:3000
    - API Docs: http://localhost:8000/docs

### Local Development

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Dashboard Sections

1. **Stock Search** - Find and analyze any ticker
2. **Price Charts** - OHLCV visualization with multiple timeframes
3. **AI Signals** - Prediction label, confidence, strength
4. **Risk Assessment** - Risk level, volatility, drawdown metrics
5. **Technical Indicators** - All indicators with plain-English interpretations
6. **News Sentiment** - Recent news with sentiment scores
7. **Explainability Panel** - SHAP feature contributions
8. **AI Summary** - Human-readable trading rationale
9. **Backtesting** - Historical accuracy and performance
10. **Watchlist** - Personalized stock tracking

## Design Philosophy

- **Explainability First**: Focus on interpretability, not prediction certainty
- **Transparency**: Clear disclaimers and confidence metrics
- **Institutional Style**: Bloomberg-inspired dashboard aesthetic
- **Non-flashy**: Serious financial analysis tool, not a trading app
- **Modular**: Easily extensible architecture for new features

## Important Notes

⚠️ **Disclaimer**: This system provides AI-assisted analysis and should NOT be used for guaranteed predictions. Always conduct your own research and consult with financial advisors.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please open a GitHub issue.
