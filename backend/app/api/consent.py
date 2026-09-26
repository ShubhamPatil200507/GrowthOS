from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any

from app.db.database import get_db
from app.db.models import Merchant, MerchantConsent

router = APIRouter(prefix="/consent", tags=["Merchant Privacy & Consent"])

class ConsentUpdateRequest(BaseModel):
    business_analytics: bool = True
    customer_segmentation: bool = True
    personalized_campaigns: bool = True
    voice_processing: bool = True
    external_ai: bool = True
    data_retention_days: int = 90

@router.get("")
def get_merchant_consent(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")
    
    consent = db.query(MerchantConsent).filter(MerchantConsent.merchant_id == merchant.id).first()
    if not consent:
        # Create default
        consent = MerchantConsent(merchant_id=merchant.id)
        db.add(consent)
        db.commit()
        db.refresh(consent)

    return {
        "merchant_id": merchant.id,
        "business_name": merchant.business_name,
        "consents": {
            "business_analytics": consent.business_analytics,
            "customer_segmentation": consent.customer_segmentation,
            "personalized_campaigns": consent.personalized_campaigns,
            "voice_processing": consent.voice_processing,
            "external_ai": consent.external_ai,
            "data_retention_days": consent.data_retention_days
        },
        "transparency": {
            "data_controller": "Paytm GrowthOS Demo Merchant Instance",
            "pii_sharing": "Zero PII shared with external LLMs (tokenized cohorts only)",
            "withdrawal_policy": "Merchants may modify or withdraw consent at any time; changes take effect immediately."
        },
        "updated_at": consent.updated_at.isoformat()
    }

@router.post("")
def update_merchant_consent(req: ConsentUpdateRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    consent = db.query(MerchantConsent).filter(MerchantConsent.merchant_id == merchant.id).first()
    if not consent:
        consent = MerchantConsent(merchant_id=merchant.id)
        db.add(consent)

    consent.business_analytics = req.business_analytics
    consent.customer_segmentation = req.customer_segmentation
    consent.personalized_campaigns = req.personalized_campaigns
    consent.voice_processing = req.voice_processing
    consent.external_ai = req.external_ai
    consent.data_retention_days = req.data_retention_days

    db.commit()
    db.refresh(consent)

    return {
        "status": "UPDATED",
        "message": "Merchant privacy and consent preferences saved successfully.",
        "consents": {
            "business_analytics": consent.business_analytics,
            "customer_segmentation": consent.customer_segmentation,
            "personalized_campaigns": consent.personalized_campaigns,
            "voice_processing": consent.voice_processing,
            "external_ai": consent.external_ai,
            "data_retention_days": consent.data_retention_days
        }
    }
