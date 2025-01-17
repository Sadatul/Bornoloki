from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str
    redis_host: str
    redis_port: int
    supabase_jwt_public_key: str
    supabase_url: str
    supabase_service_role_key: str
    qdrant_url: str
    qdrant_api_key: str
    openai_api_key: str  # <-- Added field

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
