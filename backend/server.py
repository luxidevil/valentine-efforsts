from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import base64
from google import genai

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', '')
if mongo_url:
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'valentine_cards')]
else:
    client = None
    db = None

# Gemini API Key
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class CardCreate(BaseModel):
    girlfriend_name: str
    description: str
    photos: List[str]  # Base64 encoded photos
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
    """Generate romantic poem, love notes, and scratch message using Gemini"""
    try:
        import json

        gemini_client = genai.Client(api_key=GEMINI_API_KEY)

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
        logger.error(f"Error generating content: {e}")
        return GeneratedContent(
            poem=f"""My dearest {girlfriend_name},
You are the sunshine in my days,
The stars that light my darkest nights,
In countless beautiful ways,
You make everything feel right.
Forever yours, {sender_name}""",
            love_notes=[
                f"I love how you make me smile every day",
                f"My favorite thing about us is our laughter together",
                f"You are the best thing that ever happened to me",
                f"Every day with you feels like a dream",
                f"I fall in love with you more each day"
            ],
            scratch_message=f"You are my forever, {girlfriend_name}! I love you to the moon and back!"
        )

@api_router.get("/")
async def root():
    return {"message": "Valentine Card API"}

@api_router.post("/cards", response_model=CardResponse)
async def create_card(card_data: CardCreate):
    """Create a new Valentine's card"""
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured. Please set the MONGO_URL environment variable.")
    try:
        content = await generate_romantic_content(
            card_data.girlfriend_name,
            card_data.description,
            card_data.sender_name
        )
        
        card_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()
        
        card_doc = {
            "id": card_id,
            "girlfriend_name": card_data.girlfriend_name,
            "sender_name": card_data.sender_name,
            "description": card_data.description,
            "photos": card_data.photos,
            "poem": content.poem,
            "love_notes": content.love_notes,
            "scratch_message": content.scratch_message,
            "created_at": created_at
        }
        
        await db.valentine_cards.insert_one(card_doc)
        
        return CardResponse(**card_doc)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating card: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/cards/{card_id}", response_model=CardResponse)
async def get_card(card_id: str):
    """Get a Valentine's card by ID"""
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured. Please set the MONGO_URL environment variable.")
    card = await db.valentine_cards.find_one({"id": card_id}, {"_id": 0})
    
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    return CardResponse(**card)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
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

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()
