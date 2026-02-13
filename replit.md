# Valentine Card Creator

## Overview
An interactive Valentine's Day card application where users can create personalized Valentine's cards with AI-generated romantic poems, love notes, and scratch-to-reveal messages.

## Architecture
- **Frontend**: React (CRA with CRACO), Tailwind CSS, Radix UI components
  - Runs on port 5000 (0.0.0.0)
  - Uses proxy to forward `/api` requests to backend
- **Backend**: Python FastAPI with uvicorn
  - Runs on port 8000 (localhost)
  - MongoDB for card storage
  - Google Gemini AI for generating romantic content

## Project Structure
```
frontend/         - React frontend application
  src/
    components/   - UI components (FlipCard, ScratchCard, etc.)
    pages/        - Page components (LandingPage, CardCreator, ViewCard)
    lib/          - Utility functions
  plugins/        - CRACO plugins (visual-edits, health-check)
backend/
  server.py       - FastAPI backend server
start.sh          - Startup script
```

## Environment Variables
- `MONGO_URL` - MongoDB connection string (secret)
- `DB_NAME` - MongoDB database name (default: valentine_cards)
- `GEMINI_API_KEY` - Google Gemini API key (secret)
- `CORS_ORIGINS` - Allowed CORS origins (default: *)

## Recent Changes
- 2026-02-13: Initial Replit setup
  - Configured frontend on port 5000 with all hosts allowed
  - Configured backend on port 8000 (localhost)
  - Replaced unavailable `emergentintegrations` package with direct `google-genai` SDK
  - Set up proxy from frontend dev server to backend API
  - Disabled visual-edits plugin (platform-specific)
