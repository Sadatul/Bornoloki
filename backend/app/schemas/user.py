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
    name : str | None = None
    email : str | None = None
    picture : str | None = None

class UserUpdate(SQLModel):
    pass