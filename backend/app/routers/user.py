from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate
from app.middleware.auth_middleware import verify_auth, require_roles
from supabase import create_client
from app.database import get_session
from sqlmodel import Session, select
from app.models.user import User
from app.config import settings

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

# Initialize Supabase client
supabase = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key
)

@router.post("/register")
async def create_user(
    user: UserCreate, 
    payload: dict = Depends(verify_auth),
    session: Session = Depends(get_session)
):
    try:
        # Get user UUID from the verified token
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token: no user ID found")

        # Check if user already exists
        statement = select(User).where(User.uuid == user_id)
        existing_user = session.exec(statement).one_or_none()
        if existing_user:
            return {"exists": True}

        # Store user in Redis with UUID from token
        user_data = user.dict()
        user_data["uuid"] = user_id

        # print("Got it")
        # Update user role in Supabase
        supabase.auth.admin.update_user_by_id(
            user_id,
            {"user_metadata": {"role": user.role}}
        )

        session.add(User(uuid=user_id, role=user.role))
        session.commit()
        # print("Got it2")

        return {
            "message": "User created successfully",
            "user_data": user_data,
            "exists": False
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# @router.get("/", response_model=UserRead)
# async def get_user(redis_client: Annotated[RedisClient, Depends()]):
#     user = await redis_client.get_json("user")
#     print(user)
#     return UserRead(**user, id=1, uuid="123", created_at=datetime.now())

@router.get("/protected")
async def protected_route(payload: dict = Depends(verify_auth)):
    return {
        "message": "You have access to protected route",
        "user": payload
    } 

# Example protected route that only allows admin role
@router.get("/user-only")
@require_roles(["user"])
async def admin_route(payload: dict = Depends(verify_auth)):
    return {
        "message": "You have access to admin route",
        "user": payload
    }

