import openai
from fastapi import APIRouter, HTTPException
from app.schemas.translation import BanglishToBanglaRequest, BanglishToBanglaResponse
from app.utils.translate import banglish_to_bangla as banglish_to_bangla_util

router = APIRouter(prefix="/translate", tags=["BanglishToBangla"])


@router.post("/banglish-to-bangla", response_model=BanglishToBanglaResponse)
async def banglish_to_bangla(payload: BanglishToBanglaRequest):
    banglish_text = payload.banglish_text.strip()
    temperature = payload.temperature

    if not banglish_text:
        raise HTTPException(status_code=400, detail="Banglish text must not be empty.")

    try:
        bangla_output = await banglish_to_bangla_util(banglish_text, temperature)
        return BanglishToBanglaResponse(bangla_text=bangla_output)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
