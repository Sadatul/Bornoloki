from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate
from typing import Annotated
from app.redis import RedisClient
from app.schemas.user import UserRead
from datetime import datetime

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

@router.post("/")
async def create_user(user: UserCreate, redis_client: Annotated[RedisClient, Depends()]):
    await redis_client.set_json("user", user.dict())
    return {"message": "User created successfully"}

@router.get("/", response_model=UserRead)
async def get_user(redis_client: Annotated[RedisClient, Depends()]):
    user = await redis_client.get_json("user")
    print(user)
    return UserRead(**user, id=1, uuid="123", created_at=datetime.now())

