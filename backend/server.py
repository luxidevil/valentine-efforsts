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
