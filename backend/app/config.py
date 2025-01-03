from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str
    redis_host: str
    redis_port: int
    openai_api_key: str  # <-- Added field

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
