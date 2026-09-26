import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GrowthOS"
    TAGLINE: str = "From payment data to the next best action."
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "growthos_demo_secret_key_super_secure_for_jwt_tokens_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for demo convenience

    # Database: fallback to local SQLite if POSTGRESQL_URL is not set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./growthos.db")

    # AI & Integrations
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    COGNEE_API_KEY: str = os.getenv("COGNEE_API_KEY", "")

    # n8n Integration
    N8N_BASE_URL: str = os.getenv("N8N_BASE_URL", "")
    N8N_WEBHOOK_URL: str = os.getenv("N8N_WEBHOOK_URL", "")
    N8N_API_KEY: str = os.getenv("N8N_API_KEY", "")

    # Paytm Integration Abstraction
    PAYTM_CLIENT_ID: str = os.getenv("PAYTM_CLIENT_ID", "")
    PAYTM_CLIENT_SECRET: str = os.getenv("PAYTM_CLIENT_SECRET", "")
    PAYTM_MERCHANT_ID: str = os.getenv("PAYTM_MERCHANT_ID", "DEMO_PAYTM_RAJESH_001")

    # Demo mode flags
    DEMO_MODE: bool = True
    DEMO_MERCHANT_PHONE: str = "9876543210"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
