# Valentine Card & Love Letter Creator

## Overview
An interactive Valentine's Day application where users can:
1. Create personalized Valentine's cards with AI-generated romantic poems, love notes, and scratch-to-reveal messages
2. Create beautiful AI-powered love letters with customizable templates, fonts, colors, and PDF download

Deployed at valentine-efforts.space.

## Architecture
- **Single-server deployment**: FastAPI backend serves both the API and built React frontend
- **Frontend**: React (CRA with CRACO), Tailwind CSS, Radix UI components
- **Backend**: Python FastAPI with uvicorn on port 5000 (0.0.0.0)
- **Database**: PostgreSQL (Replit built-in, via asyncpg) - tables: valentine_cards, love_letters
- **AI**: Google Gemini 2.0 Flash for generating romantic content
- **API key fallback**: Tries GOOGLE_API_KEY, GOOGLE_API_KEY1, GOOGLE_API_KEY2, GOOGLE_API_KEY3, GEMINI_API_KEY in order
- **PDF Generation**: html2canvas + jsPDF (client-side)

## Project Structure
```
frontend/         - React frontend application
  src/
    components/   - UI components (FlipCard, ScratchCard, FloatingHearts, etc.)
    pages/
      LandingPage.jsx    - Home page with dual CTAs (Card + Letter)
      CardCreator.jsx    - Valentine card creation wizard
      ViewCard.jsx       - Interactive card viewing experience
      LetterCreator.jsx  - Love letter creation wizard (5 steps)
      ViewLetter.jsx     - Letter display with PDF download
    lib/          - Utility functions
  plugins/        - CRACO plugins (visual-edits, health-check)
backend/
  server.py       - FastAPI backend server (serves API + frontend)
build.sh          - Build script for deployment
```

## API Endpoints
- `GET /api/` - Health check
- `POST /api/cards` - Create Valentine card (AI poem + notes + scratch message)
- `GET /api/cards/:id` - Retrieve Valentine card
- `POST /api/letters` - Create love letter (AI-generated, customizable)
- `GET /api/letters/:id` - Retrieve love letter

## Love Letter Feature
- **8 letter types**: Love, Sorry (asks what the fight was about), Proposal, Anniversary, Miss You, First Love, Long Distance, Custom
- **6 tones**: Romantic, Poetic, Funny, Emotional, Casual, Dramatic
- **6 templates**: Classic Elegance, Modern Love, Midnight Romance, Secret Garden, Golden Sunset, Royal Purple
- **4 fonts**: Playfair Display, Dancing Script, Lato, Classic Serif
- **7 color schemes**: Romantic Red, Blush Pink, Ocean Blue, Forest Green, Golden Hour, Royal Purple, Midnight
- **Image upload**: Up to 6 images per letter
- **PDF download**: Client-side via html2canvas + jsPDF

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-provisioned by Replit)
- `GOOGLE_API_KEY` - Primary Google Gemini API key (secret)
- `GOOGLE_API_KEY1` - Backup API key 1 (secret)
- `GOOGLE_API_KEY2` - Backup API key 2 (secret)

## Deployment
- **Build**: `bash build.sh` (installs Python deps from requirements.txt, builds React frontend)
- **Run**: `python -m uvicorn backend.server:app --host 0.0.0.0 --port 5000`
- **Type**: Autoscale deployment
- **Domain**: valentine-efforts.space (Namecheap DNS with A record to 34.111.179.208)

## Recent Changes
- 2026-02-15: Added Love Letter Creator feature
  - New love_letters DB table
  - 8 letter types with context-aware AI prompts
  - 5-step creation wizard with full design customization
  - Beautiful letter viewing page with intro animation
  - PDF download support
  - Updated landing page with dual CTAs
- 2026-02-13: Switched from MongoDB to PostgreSQL (Replit built-in)
  - Replaced motor/pymongo with asyncpg
  - Added API key fallback (tries multiple keys sequentially)
- 2026-02-13: Initial Replit setup
  - Configured single-server architecture (backend serves frontend build)
  - Connected custom domain valentine-efforts.space
  - Published to Replit deployment
