from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTError
from app.config import settings
from functools import wraps
import os

security = HTTPBearer()

# Format the public key properly
SUPABASE_PUBLIC_KEY = f"""-----BEGIN PUBLIC KEY-----
{settings.supabase_jwt_public_key}
-----END PUBLIC KEY-----"""

async def verify_auth(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        token = credentials.credentials
        # Verify the token using RS256 algorithm and Supabase public key
        print(token)
        payload = jwt.decode(
            token,
            settings.supabase_jwt_public_key,
            algorithms=["HS256"],
            options={"verify_aud": False} 
        )
        return payload
        
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )

def require_roles(allowed_roles: list[str]):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, payload: dict = Depends(verify_auth), **kwargs):
            # Get user metadata from the JWT payload
            user_metadata = payload.get("user_metadata", {})
            user_role = user_metadata.get("role")

            if not user_role:
                raise HTTPException(
                    status_code=403,
                    detail="No role assigned to user"
                )

            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"Role '{user_role}' not authorized to access this endpoint"
                )

            return await func(*args, payload=payload,**kwargs)
        return wrapper
    return decorator 