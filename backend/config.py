from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://hanomi:hanomi_dev@localhost:5432/mtc_pipeline"
    cad_service_url: str = "http://localhost:8001"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
