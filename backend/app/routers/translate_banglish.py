import openai
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.translation import BanglishToBanglaRequest, BanglishToBanglaResponse
from app.utils.translate import banglish_to_bangla as banglish_to_bangla_util
from transformers import AutoTokenizer
from transformers import AutoModelForSeq2SeqLM
import torch
from app.utils.analytics import track_translation
from sqlmodel import Session
from app.database import get_session
from app.middleware.auth_middleware import verify_auth

router = APIRouter(prefix="/v1", tags=["BanglishToBangla"])
model_name = "munimthahmid/bornoloki"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

async def transliterate_local(text: str) -> str:
    try:
        input_ids = tokenizer(text, return_tensors="pt").input_ids
        with torch.no_grad():
            outputs = model.generate(input_ids, max_length=64)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

@router.post("/banglish-to-bangla-deprecated", response_model=BanglishToBanglaResponse)
async def banglish_to_bangla_deprecated(payload: BanglishToBanglaRequest):
    banglish_text = payload.banglish_text.strip()
    
    if not banglish_text:
        raise HTTPException(status_code=400, detail="Banglish text must not be empty.")
    
    try:
        bangla_output = await transliterate_local(banglish_text)
        return BanglishToBanglaResponse(bangla_text=bangla_output)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/banglish-to-bangla", response_model=BanglishToBanglaResponse)
async def banglish_to_bangla(
    payload: BanglishToBanglaRequest,
    user_metadata: dict = Depends(verify_auth),
    session: Session = Depends(get_session)
):
    banglish_text = payload.banglish_text.strip()
    temperature = payload.temperature

    if not banglish_text:
        raise HTTPException(status_code=400, detail="Banglish text must not be empty.")

    try:
        bangla_output = await banglish_to_bangla_util(banglish_text, temperature)
        # Track analytics
        user_id = user_metadata.get("user_metadata", {}).get("id")
        if user_id:
            word_count = len(payload.banglish_text.split())
            await track_translation(
                session=session,
                user_id=user_id,
                word_count=word_count,
                translation_type="banglish_to_bangla"
            )
        return BanglishToBanglaResponse(bangla_text=bangla_output)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
