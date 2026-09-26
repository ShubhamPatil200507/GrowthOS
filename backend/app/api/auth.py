from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import Merchant

router = APIRouter(prefix="/auth", tags=["Authentication"])

class DemoLoginRequest(BaseModel):
    phone: str = "9876543210"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    merchant_id: str
    merchant_name: str
    business_name: str
    city: str
    role: str = "MERCHANT_OWNER"
    is_demo: bool = True

@router.post("/demo-login", response_model=LoginResponse)
def demo_login(req: DemoLoginRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).filter(Merchant.phone == req.phone).first()
    if not merchant:
        merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Demo merchant not found. Please run seed script.")

    return LoginResponse(
        access_token=f"demo_jwt_token_for_{merchant.id}",
        merchant_id=merchant.id,
        merchant_name=merchant.name,
        business_name=merchant.business_name,
        city=merchant.city,
        is_demo=True
    )

@router.get("/me")
def get_current_user(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    return {
        "id": merchant.id if merchant else "demo",
        "name": merchant.name if merchant else "Rajesh Kumar",
        "business": merchant.business_name if merchant else "Rajesh General Store",
        "authenticated": True,
        "mode": "DEMO"
    }
