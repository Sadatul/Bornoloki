from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: int | None = Field(default=None, primary_key=True)
    uuid: str = Field(unique=True, index=True)
    role: UserRole = Field(default=UserRole.USER)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 