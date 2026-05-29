# AVBOB Lead Assistant

AI-powered funeral insurance lead detection and CRM for AVBOB consultants in South Africa.

## Architecture

```
React PWA (zip-hub--lesedisiyaya.replit.app)
        ↓  /api/*
TypeScript API Server  (port 8080, path: /api)
        ↓  proxy → strip /api prefix
Python FastAPI Backend  (port 5000)
        ↓
PostgreSQL (Supabase)  +  OpenAI
        ↑
Facebook Page API (auto-polled every 10 min using token from Supabase)
```

## Run & Operate

- **AVBOB Backend** workflow — runs the Python FastAPI backend on port 5000
- **API Server** workflow — runs the TypeScript proxy server on port 8080 (routes `/api/*` to port 5000)
- Backend URL (deployed): configure via Replit deployment
- Backend URL (dev): `https://$REPLIT_DEV_DOMAIN/api`

## Stack

- **Proxy**: TypeScript / Express (routes `/api/*` → Python backend)
- **Backend**: Python 3.11, FastAPI, uvicorn
- **AI**: OpenAI `gpt-4o-mini` (primary) / keyword scoring (fallback)
- **Database**: PostgreSQL via psycopg2 (Supabase)
- **Frontend**: React PWA at `zip-hub--lesedisiyaya.replit.app`

## Where things live

- `artifacts/api-server/` — TypeScript proxy (proxies `/api/*` to Python backend)
- `artifacts/avbob-backend/` — Python FastAPI backend (main entry point: `main.py`)
- `artifacts/avbob-backend/routes/` — API route handlers
- `artifacts/avbob-backend/ai/` — OpenAI / Ollama AI engine
- `artifacts/avbob-backend/database.py` — PostgreSQL CRUD (uses `SUPABASE_DATABASE_URL`)
- `artifacts/avbob-backend/models.py` — Pydantic request/response models

## API Endpoints

All accessible via the TypeScript proxy at `/api` prefix:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/get-leads` | List all leads |
| POST | `/api/save-lead` | Score + persist a lead |
| POST | `/api/analyze-lead` | AI-score a post |
| POST | `/api/generate-reply` | AI-generate Facebook reply |
| POST | `/api/whatsapp-link` | Generate WhatsApp follow-up |
| POST | `/api/update-status/{id}` | Update lead status |
| GET | `/api/stats` | Lead statistics |
| GET | `/api/dashboard` | HTML dashboard |
| POST | `/api/facebook/poll` | Manually trigger FB page poll |
| GET/POST | `/api/settings` | Token management |

## Required Environment Secrets

| Secret | Description |
|--------|-------------|
| `SUPABASE_DATABASE_URL` | PostgreSQL connection string (Supabase) |
| `OPENAI_API_KEY` | OpenAI key for AI scoring (optional — falls back to keyword scoring) |
| `FB_PAGE_ACCESS_TOKEN` | Facebook Page token for auto-polling (optional, also stored in Supabase settings) |
| `FB_VERIFY_TOKEN` | Facebook webhook verify token (optional) |

## Architecture Decisions

- TypeScript API Server acts as a thin proxy — all AVBOB logic stays in Python.
- CORS on the Python backend is `allow_origins=["*"]`; the proxy adds its own CORS headers too.
- Facebook tokens are stored in Supabase settings table and loaded at startup — no extension needed.
- Chrome extension has been removed; Facebook polling runs automatically from the backend.

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
