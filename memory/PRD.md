# Valentine Card Generator - PRD

## Original Problem Statement
Build a website where users can upload pictures of their girlfriend and create a super interactive Valentine's Day card. The girlfriend is asked to tap here and there and things pop up to make her feel special. AI generates personalized love poems/messages. Final card is shareable via unique link.

## User Personas
1. **Card Creator (Boyfriend/Partner)**: Wants to create something special and unique for their significant other
2. **Card Recipient (Girlfriend)**: Receives an interactive, personalized Valentine's experience

## Core Requirements
- No login/authentication needed
- Photo upload (up to 5 photos)
- Text input about girlfriend for AI personalization
- AI-generated poem and love notes using Gemini 3 Flash
- Interactive card with tap-to-reveal elements
- Shareable via unique URL

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + Canvas Confetti
- **Backend**: FastAPI + MongoDB
- **AI**: Gemini 3 Flash via emergentintegrations library
- **Storage**: Photos as base64 in MongoDB

## What's Been Implemented (Jan 2026)
1. ✅ Landing page with floating hearts animation
2. ✅ 4-step card creator flow (names → photos → description → preview)
3. ✅ AI-powered poem and love notes generation
4. ✅ Interactive card viewing experience:
   - Intro screen with "Open Your Valentine" button
   - Poem section with AI-generated personalized poem
   - Flip cards (tap photos to reveal messages)
   - Tap-to-reveal love notes
   - Scratch-to-reveal final surprise
   - Heart burst confetti animations
5. ✅ Shareable unique URL for each card
6. ✅ Mobile-responsive design

## API Endpoints
- `POST /api/cards` - Create new Valentine card
- `GET /api/cards/{id}` - Retrieve card by ID

## Prioritized Backlog
### P0 (Done)
- Core card creation flow
- AI integration
- Interactive viewing experience

### P1 (Future)
- Email delivery option
- Music/audio support
- More animation themes

### P2 (Nice to have)
- Video messages
- Custom backgrounds
- Multiple language support
