from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentCreate(BaseModel):
    title: str
    original_text: str
    formatting: str | None = None
    is_public: bool = False

class DocumentRead(DocumentCreate):
    id: int
    user_id: int
    upload_date: datetime
    converted_text: str | None = None 