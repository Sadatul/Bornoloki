from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from typing import Optional
from sqlalchemy import Text, Column

class Document(SQLModel, table=True):
    __tablename__ = "documents"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    title: str
    upload_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    original_text: str = Field(sa_column=Column(Text))
    converted_text: str | None = Field(default=None, sa_column=Column(Text))
    formatting: str | None = Field(default=None, sa_column=Column(Text))
    is_public: bool = Field(default=False) 