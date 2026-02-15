from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import asyncpg
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from google import genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

API_KEYS = []
for key_name in ['GOOGLE_API_KEY', 'GOOGLE_API_KEY1', 'GOOGLE_API_KEY2', 'GOOGLE_API_KEY3', 'GEMINI_API_KEY']:
    key = os.environ.get(key_name)
    if key:
        API_KEYS.append(key)

DATABASE_URL = os.environ.get('DATABASE_URL', '')

db_pool: Optional[asyncpg.Pool] = None

app = FastAPI()

api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CardCreate(BaseModel):
    girlfriend_name: str
    description: str
    photos: List[str]
    sender_name: str


class CardResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    girlfriend_name: str
    sender_name: str
    description: str
    photos: List[str]
    poem: str
    love_notes: List[str]
    scratch_message: str
    created_at: str


class GeneratedContent(BaseModel):
    poem: str
    love_notes: List[str]
    scratch_message: str


class LetterCreate(BaseModel):
    letter_type: str
    recipient_name: str
    sender_name: str
    context: str
    custom_prompt: Optional[str] = None
    tone: Optional[str] = "romantic"
    photos: Optional[List[str]] = []
    template: Optional[str] = "classic"
    font: Optional[str] = "playfair"
    color_scheme: Optional[str] = "romantic-red"


class LetterResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    letter_type: str
    recipient_name: str
    sender_name: str
    context: str
    custom_prompt: Optional[str] = None
    tone: str
    photos: List[str]
    content: str
    template: str
    font: str
    color_scheme: str
    created_at: str


async def generate_romantic_content(girlfriend_name: str, description: str, sender_name: str) -> GeneratedContent:
    last_error = None
    for api_key in API_KEYS:
        try:
            gemini_client = genai.Client(api_key=api_key)

            system_instruction = """You are a romantic poet and love letter writer. Create deeply personal, heartfelt content 
            that makes the recipient feel truly special and loved. Be creative, poetic, and emotionally touching.
            Always respond in valid JSON format."""

            prompt = f"""Create romantic Valentine's content for {girlfriend_name} from {sender_name}.

About her: {description}

Generate a JSON response with exactly this structure:
{{
    "poem": "A 4-6 line romantic poem personalized to her",
    "love_notes": ["Note 1", "Note 2", "Note 3", "Note 4", "Note 5"],
    "scratch_message": "A special surprise message for the scratch reveal"
}}

The love_notes should be 5 short, sweet messages like "I love how you..." or "My favorite thing about us is..."
The scratch_message should be something very special and personal.
Make everything deeply personal based on the description provided."""

            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                ),
            )

            response_text = response.text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            content = json.loads(response_text.strip())

            return GeneratedContent(
                poem=content.get("poem", "My heart beats only for you, my love"),
                love_notes=content.get("love_notes", [
                    "I love everything about you",
                    "You make my world brighter",
                    "Every moment with you is precious",
                    "You are my everything",
                    "Forever and always, I choose you"
                ]),
                scratch_message=content.get("scratch_message", f"I love you more than words can say, {girlfriend_name}!")
            )
        except Exception as e:
            last_error = e
            logger.warning(f"API key failed, trying next: {e}")
            continue

    logger.error(f"All API keys failed. Last error: {last_error}")
    return GeneratedContent(
        poem=f"""My dearest {girlfriend_name},
You are the sunshine in my days,
The stars that light my darkest nights,
In countless beautiful ways,
You make everything feel right.
Forever yours, {sender_name}""",
        love_notes=[
            "I love how you make me smile every day",
            "My favorite thing about us is our laughter together",
            "You are the best thing that ever happened to me",
            "Every day with you feels like a dream",
            "I fall in love with you more each day"
        ],
        scratch_message=f"You are my forever, {girlfriend_name}! I love you to the moon and back!"
    )


async def generate_letter_content(letter_type: str, recipient_name: str, sender_name: str, context: str, tone: str, custom_prompt: Optional[str] = None) -> str:
    type_instructions = {
        "love": f"Write a deeply romantic and passionate love letter from {sender_name} to {recipient_name}. Make it heartfelt, intimate, and emotionally powerful.",
        "sorry": f"Write a sincere, heartfelt apology letter from {sender_name} to {recipient_name}. They had a fight/disagreement about: {context}. Acknowledge the hurt caused, take responsibility, express genuine remorse, and promise to do better. Be vulnerable and honest.",
        "proposal": f"Write an unforgettable marriage proposal letter from {sender_name} to {recipient_name}. Make it deeply personal, emotional, and build up to the magical question. Reference their journey together.",
        "anniversary": f"Write a beautiful anniversary letter from {sender_name} to {recipient_name}. Celebrate their time together, reminisce about beautiful moments, and look forward to the future.",
        "miss-you": f"Write an emotionally touching 'I miss you' letter from {sender_name} to {recipient_name}. Express how much they miss them, what they miss most, and how they can't wait to be together again.",
        "first-love": f"Write a sweet and innocent first love confession letter from {sender_name} to {recipient_name}. Capture the butterflies, nervousness, and pure joy of falling in love for the first time.",
        "long-distance": f"Write a heartfelt long-distance relationship letter from {sender_name} to {recipient_name}. Express how distance makes the heart grow fonder, share dreams of being together, and reassure your love.",
        "custom": f"Write a personalized letter from {sender_name} to {recipient_name} based on these instructions: {custom_prompt or context}",
    }

    type_instruction = type_instructions.get(letter_type, type_instructions["love"])

    tone_map = {
        "romantic": "deeply romantic, passionate, and sensual",
        "poetic": "lyrical, metaphor-rich, and beautifully poetic like a piece of literature",
        "funny": "witty, playful, and humorous while still being loving and sweet",
        "emotional": "raw, vulnerable, and deeply emotional - pull at heartstrings",
        "casual": "warm, genuine, and conversational like talking to your best friend who you love",
        "dramatic": "grand, theatrical, and over-the-top romantic like a movie scene",
    }

    tone_desc = tone_map.get(tone, tone_map["romantic"])

    last_error = None
    for api_key in API_KEYS:
        try:
            gemini_client = genai.Client(api_key=api_key)

            system_instruction = f"""You are a world-class letter writer who creates deeply personal, beautifully written letters.
Your tone should be {tone_desc}.
Write in a natural, flowing style with proper paragraphs.
Do NOT include any JSON formatting, code blocks, or markdown.
Just write the pure letter content with proper paragraphs.
Do NOT include "Dear..." or sign-off like "Love, name" - those will be added separately.
The letter should be 3-5 paragraphs long, each paragraph being meaningful and personal."""

            prompt = f"""{type_instruction}

Context/Details about them and their relationship: {context}

{f"Additional custom instructions: {custom_prompt}" if custom_prompt else ""}

Write a beautiful, {tone_desc} letter. Make it personal and reference the specific details provided. 3-5 paragraphs."""

            response = gemini_client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                ),
            )

            return response.text.strip()
        except Exception as e:
            last_error = e
            logger.warning(f"API key failed for letter generation, trying next: {e}")
            continue

    logger.error(f"All API keys failed for letter. Last error: {last_error}")
    return f"""Every moment I spend thinking about you fills my heart with a warmth that words can barely capture. You are the most extraordinary person I have ever known, and I find myself falling deeper in love with you with each passing day.

{context}

There are a thousand things I want to say to you, and yet when I try to put them into words, I realize that no language was ever designed to hold this much love. You deserve the world and more, and I promise to spend every day trying to give it to you.

You are my today, my tomorrow, and my forever. Nothing in this world compares to the joy of loving you and being loved by you in return."""


@app.on_event("startup")
async def startup():
    global db_pool
    if DATABASE_URL:
        try:
            db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
            async with db_pool.acquire() as conn:
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS valentine_cards (
                        id VARCHAR(36) PRIMARY KEY,
                        girlfriend_name VARCHAR(255) NOT NULL,
                        sender_name VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL,
                        photos TEXT NOT NULL DEFAULT '[]',
                        poem TEXT NOT NULL DEFAULT '',
                        love_notes TEXT NOT NULL DEFAULT '[]',
                        scratch_message TEXT NOT NULL DEFAULT '',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    )
                """)
                await conn.execute("""
                    CREATE TABLE IF NOT EXISTS love_letters (
                        id VARCHAR(36) PRIMARY KEY,
                        letter_type VARCHAR(50) NOT NULL,
                        recipient_name VARCHAR(255) NOT NULL,
                        sender_name VARCHAR(255) NOT NULL,
                        context TEXT NOT NULL DEFAULT '',
                        custom_prompt TEXT,
                        tone VARCHAR(50) NOT NULL DEFAULT 'romantic',
                        photos TEXT NOT NULL DEFAULT '[]',
                        content TEXT NOT NULL DEFAULT '',
                        template VARCHAR(50) NOT NULL DEFAULT 'classic',
                        font VARCHAR(50) NOT NULL DEFAULT 'playfair',
                        color_scheme VARCHAR(50) NOT NULL DEFAULT 'romantic-red',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    )
                """)
            logger.info("Database connected and table ready")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            db_pool = None


@app.on_event("shutdown")
async def shutdown():
    global db_pool
    if db_pool:
        await db_pool.close()


@api_router.get("/")
async def root():
    return {"message": "Valentine Card API"}


@api_router.post("/cards", response_model=CardResponse)
async def create_card(card_data: CardCreate):
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    try:
        content = await generate_romantic_content(
            card_data.girlfriend_name,
            card_data.description,
            card_data.sender_name
        )

        card_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        photos_json = json.dumps(card_data.photos)
        love_notes_json = json.dumps(content.love_notes)

        async with db_pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO valentine_cards (id, girlfriend_name, sender_name, description, photos, poem, love_notes, scratch_message, created_at)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)""",
                card_id, card_data.girlfriend_name, card_data.sender_name,
                card_data.description, photos_json, content.poem,
                love_notes_json, content.scratch_message,
                datetime.now(timezone.utc)
            )

        return CardResponse(
            id=card_id,
            girlfriend_name=card_data.girlfriend_name,
            sender_name=card_data.sender_name,
            description=card_data.description,
            photos=card_data.photos,
            poem=content.poem,
            love_notes=content.love_notes,
            scratch_message=content.scratch_message,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating card: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/cards/{card_id}", response_model=CardResponse)
async def get_card(card_id: str):
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database not configured.")

    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM valentine_cards WHERE id = $1", card_id)

    if not row:
        raise HTTPException(status_code=404, detail="Card not found")

    return CardResponse(
        id=row["id"],
        girlfriend_name=row["girlfriend_name"],
        sender_name=row["sender_name"],
        description=row["description"],
        photos=json.loads(row["photos"]),
        poem=row["poem"],
        love_notes=json.loads(row["love_notes"]),
        scratch_message=row["scratch_message"],
        created_at=row["created_at"].isoformat()
    )


@api_router.post("/letters", response_model=LetterResponse)
async def create_letter(letter_data: LetterCreate):
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database not configured.")
    try:
        content = await generate_letter_content(
            letter_data.letter_type,
            letter_data.recipient_name,
            letter_data.sender_name,
            letter_data.context,
            letter_data.tone or "romantic",
            letter_data.custom_prompt
        )

        letter_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()
        photos_json = json.dumps(letter_data.photos or [])

        async with db_pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO love_letters (id, letter_type, recipient_name, sender_name, context, custom_prompt, tone, photos, content, template, font, color_scheme, created_at)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)""",
                letter_id, letter_data.letter_type, letter_data.recipient_name,
                letter_data.sender_name, letter_data.context,
                letter_data.custom_prompt or "", letter_data.tone or "romantic",
                photos_json, content, letter_data.template or "classic",
                letter_data.font or "playfair", letter_data.color_scheme or "romantic-red",
                datetime.now(timezone.utc)
            )

        return LetterResponse(
            id=letter_id,
            letter_type=letter_data.letter_type,
            recipient_name=letter_data.recipient_name,
            sender_name=letter_data.sender_name,
            context=letter_data.context,
            custom_prompt=letter_data.custom_prompt,
            tone=letter_data.tone or "romantic",
            photos=letter_data.photos or [],
            content=content,
            template=letter_data.template or "classic",
            font=letter_data.font or "playfair",
            color_scheme=letter_data.color_scheme or "romantic-red",
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating letter: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/letters/{letter_id}", response_model=LetterResponse)
async def get_letter(letter_id: str):
    if db_pool is None:
        raise HTTPException(status_code=503, detail="Database not configured.")

    async with db_pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM love_letters WHERE id = $1", letter_id)

    if not row:
        raise HTTPException(status_code=404, detail="Letter not found")

    return LetterResponse(
        id=row["id"],
        letter_type=row["letter_type"],
        recipient_name=row["recipient_name"],
        sender_name=row["sender_name"],
        context=row["context"],
        custom_prompt=row["custom_prompt"] if row["custom_prompt"] else None,
        tone=row["tone"],
        photos=json.loads(row["photos"]),
        content=row["content"],
        template=row["template"],
        font=row["font"],
        color_scheme=row["color_scheme"],
        created_at=row["created_at"].isoformat()
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_build = Path(__file__).parent.parent / "frontend" / "build"
if frontend_build.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_build / "static")), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = frontend_build / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(frontend_build / "index.html"))
