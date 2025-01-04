from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class Analytics(SQLModel, table=True):
    __tablename__ = "analytics"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    words_translated: int
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    translation_type: str  # 'banglish_to_bangla' or 'chat' 