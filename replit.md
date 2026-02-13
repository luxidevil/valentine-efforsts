# Valentine Card Creator

## Overview
An interactive Valentine's Day card application where users can create personalized Valentine's cards with AI-generated romantic poems, love notes, and scratch-to-reveal messages. Deployed at valentine-efforts.space.

## Architecture
- **Single-server deployment**: FastAPI backend serves both the API and built React frontend
- **Frontend**: React (CRA with CRACO), Tailwind CSS, Radix UI components
- **Backend**: Python FastAPI with uvicorn on port 5000 (0.0.0.0)
- **Database**: PostgreSQL (Replit built-in, via asyncpg)
- **AI**: Google Gemini 2.0 Flash for generating romantic content
- **API key fallback**: Tries GOOGLE_API_KEY, GOOGLE_API_KEY1, GOOGLE_API_KEY2, GOOGLE_API_KEY3, GEMINI_API_KEY in order

## Project Structure
```
frontend/         - React frontend application
  src/
    components/   - UI components (FlipCard, ScratchCard, etc.)
    pages/        - Page components (LandingPage, CardCreator, ViewCard)
    lib/          - Utility functions
  plugins/        - CRACO plugins (visual-edits, health-check)
backend/
  server.py       - FastAPI backend server (serves API + frontend)
build.sh          - Build script for deployment
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `GOOGLE_API_KEY` - Primary Google Gemini API key (secret)
- `GOOGLE_API_KEY1` - Backup API key 1 (secret)
- `GOOGLE_API_KEY2` - Backup API key 2 (secret)

## Deployment
- **Build**: `bash build.sh` (installs asyncpg, builds React frontend)
- **Run**: `python -m uvicorn backend.server:app --host 0.0.0.0 --port 5000`
- **Type**: Autoscale deployment
- **Domain**: valentine-efforts.space (Namecheap DNS with A record to 34.111.179.208)

## Recent Changes
- 2026-02-13: Switched from MongoDB to PostgreSQL (Replit built-in)
  - Replaced motor/pymongo with asyncpg
  - Added API key fallback (tries multiple keys sequentially)
  - All API endpoints tested end-to-end: create card, retrieve card, frontend serving, SPA routing
- 2026-02-13: Initial Replit setup
  - Configured single-server architecture (backend serves frontend build)
  - Connected custom domain valentine-efforts.space
  - Published to Replit deployment
