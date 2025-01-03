import openai
from fastapi import APIRouter, HTTPException
from app.schemas.translation import BanglishToBanglaRequest, BanglishToBanglaResponse
from app.config import settings  # <-- import the Settings instance

router = APIRouter(prefix="/translate", tags=["BanglishToBangla"])

# Initialize OpenAI with the key from settings
openai.api_key = settings.openai_api_key


@router.post("/banglish-to-bangla", response_model=BanglishToBanglaResponse)
async def banglish_to_bangla(payload: BanglishToBanglaRequest):
    banglish_text = payload.banglish_text.strip()
    temperature = payload.temperature

    if not banglish_text:
        raise HTTPException(status_code=400, detail="Banglish text must not be empty.")

    system_prompt = (
        "You accurately convert Banglish (Bengali words written with the Latin alphabet) "
        "to proper Bengali script. Output only the converted text in Bengali. No extra commentary."
    )

    user_prompt = f"Banglish input: {banglish_text}\nPlease provide the exact Bengali script equivalent:\n"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",  # or "gpt-4" if you have access
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=200,
        )
        bangla_output = response.choices[0].message["content"].strip()
        return BanglishToBanglaResponse(bangla_text=bangla_output)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
