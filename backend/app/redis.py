from redis import Redis
from .config import settings
import json

class RedisClient:
    def __init__(self):
        self.redis = Redis(
            host=settings.redis_host,  
            port=settings.redis_port,       
            db=0,            
            decode_responses=True  
        )

    async def set_key(self, key: str, value: str, expiration: int = None) -> bool:
        """Set a string value in Redis"""
        return self.redis.set(key, value, ex=expiration)

    async def get_key(self, key: str) -> str | None:
        """Get a string value from Redis"""
        return self.redis.get(key)

    async def set_json(self, key: str, value: dict, expiration: int = None) -> bool:
        """Set a JSON value in Redis"""
        return self.redis.set(key, json.dumps(value), ex=expiration)

    async def get_json(self, key: str) -> dict | None:
        """Get a JSON value from Redis"""
        data = self.redis.get(key)
        return json.loads(data) if data else None