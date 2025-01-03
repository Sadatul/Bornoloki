from datetime import datetime
from sqlmodel import SQLModel
from app.models.user import UserRole

class UserBase(SQLModel):
    role: UserRole

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: int
    uuid: str
    created_at: datetime

class UserUpdate(SQLModel):
    pass