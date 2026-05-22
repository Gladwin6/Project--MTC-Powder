import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Default: SQLite for local dev — set DATABASE_URL env var for PostgreSQL in production
    database_url: str = "sqlite:///./mtc_pipeline.db"
    cad_service_url: str = "http://localhost:8001"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
