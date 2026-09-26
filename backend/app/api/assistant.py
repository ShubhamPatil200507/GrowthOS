from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.db.database import get_db
from app.db.models import Merchant
from app.services.agent_orchestrator import AgentOrchestrator
from app.integrations.sarvam_provider import get_sarvam_provider

router = APIRouter(tags=["AI Assistant"])

class QueryRequest(BaseModel):
    query: str
    language: str = "hi"

class TTSRequest(BaseModel):
    text: str
    language: str = "hi-IN"

@router.post("/assistant/query")
def ask_assistant(req: QueryRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")
    
    response = AgentOrchestrator.process_query(
        db=db,
        merchant_id=merchant.id,
        query=req.query,
        language=req.language
    )
    return response

@router.post("/voice/transcribe")
async def transcribe_voice(file: Optional[UploadFile] = None, language: str = "hi-IN"):
    provider = get_sarvam_provider()
    content = await file.read() if file else b""
    result = await provider.transcribe(content, language_code=language)
    return result

@router.post("/voice/synthesize")
async def synthesize_voice(req: TTSRequest):
    provider = get_sarvam_provider()
    result = await provider.synthesize(req.text, language_code=req.language)
    return result
