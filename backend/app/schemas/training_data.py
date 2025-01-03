# app/schemas/training_data.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TranslationContributionCreate(BaseModel):
    banglish_text: str = Field(..., example="Ami tomay valobashi")
    proposed_bangla_text: str = Field(..., example="আমি তোমায় ভালোবাসি")

class TranslationContributionVerify(BaseModel):
    is_verified: bool
    admin_id: int

class TranslationContributionResponse(BaseModel):
    id: int
    banglish_text: str
    proposed_bangla_text: str
    is_verified: bool
    verified_by: Optional[int]
    created_at: datetime
    verified_at: Optional[datetime]
    submitted_by: Optional[int]

    class Config:
        orm_mode = True
