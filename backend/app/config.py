from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str
    redis_host: str
    redis_port: int
<<<<<<< HEAD
    supabase_jwt_public_key: str
    supabase_url: str
    supabase_service_role_key: str
    
=======
    openai_api_key: str  # <-- Added field

>>>>>>> 6d1678b8f7ea8f061329e1e694aa52c5a7e4fda5
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
