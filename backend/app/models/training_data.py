# app/models/training_data.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TranslationContribution(SQLModel, table=True):
    """
    This SQLModel table will store user contributions
    for Banglish-to-Bangla pairs, which an admin can verify.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    banglish_text: str = Field(..., description="Original Banglish text")
    proposed_bangla_text: str = Field(..., description="Proposed Bangla translation")
    is_verified: bool = Field(default=False, description="Admin verified?")
    verified_by: Optional[int] = Field(default=None, description="Admin user ID who verified")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    verified_at: Optional[datetime] = None
    submitted_by: Optional[int] = None  # If you track who submitted it
