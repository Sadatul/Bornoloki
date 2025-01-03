# app/schemas/translation.py

from pydantic import BaseModel, Field
from typing import Optional


class BanglishToBanglaRequest(BaseModel):
    banglish_text: str = Field(..., example="Ami tomay valobashi")
    temperature: Optional[float] = Field(
        default=0.2,
        description="Controls the creativity of the model. 0.0 is most deterministic.",
    )


class BanglishToBanglaResponse(BaseModel):
    bangla_text: str = Field(..., example="আমি তোমায় ভালোবাসি")
