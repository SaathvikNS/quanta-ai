# QUANTA Intelligence Backend

Backend API for QUANTA Intelligence - AI-powered stock intelligence platform.

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL
- Redis

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit: http://localhost:8000/docs
