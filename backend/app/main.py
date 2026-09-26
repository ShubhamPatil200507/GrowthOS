from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.auth import router as auth_router
from app.api.merchant import router as merchant_router
from app.api.opportunities import router as opportunities_router
from app.api.actions import router as actions_router
from app.api.experiments import router as experiments_router
from app.api.assistant import router as assistant_router
from app.api.simulator import router as simulator_router
from app.api.admin import router as admin_router
from app.api.consent import router as consent_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GrowthOS: AI Business Partner for Paytm Merchants - 'From payment data to the next best action.'",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For prototype local/preview convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api and root where appropriate
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(merchant_router, prefix=settings.API_V1_STR)
app.include_router(opportunities_router, prefix=settings.API_V1_STR)
app.include_router(actions_router, prefix=settings.API_V1_STR)
app.include_router(experiments_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(simulator_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(consent_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
def root():
    return {
        "app": "GrowthOS Backend API",
        "tagline": settings.TAGLINE,
        "status": "RUNNING",
        "version": "1.0.0",
        "message": "Welcome to GrowthOS! The merchant web application runs on port 3000.",
        "links": {
            "frontend_ui": "http://localhost:3000",
            "api_documentation": "/api/docs",
            "health_check": "/api/health",
            "dashboard_telemetry": "/api/merchant/dashboard",
            "opportunities": "/api/opportunities"
        }
    }

@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "service": "GrowthOS Backend API",
        "tagline": settings.TAGLINE,
        "demo_mode": settings.DEMO_MODE,
        "version": "1.0.0"
    }
