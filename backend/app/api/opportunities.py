from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import json
from datetime import datetime

from app.db.database import get_db
from app.db.models import Merchant, Opportunity, Recommendation
from app.services.opportunity_engine import OpportunityEngine
from app.services.action_executor import ActionExecutor

router = APIRouter(tags=["Opportunities"])

class GrowthPlanRequest(BaseModel):
    target_revenue: float = 5000.0

class ActionDecisionRequest(BaseModel):
    notes: Optional[str] = "Approved by merchant via GrowthOS"

@router.get("/opportunities")
def list_opportunities(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")
    return OpportunityEngine.get_all_opportunities(db, merchant.id)

@router.get("/opportunities/{id}")
def get_opportunity(id: str, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    opp = OpportunityEngine.get_opportunity_by_id(db, merchant.id, id)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    return opp

@router.post("/growth-plan")
def create_growth_plan(req: GrowthPlanRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    return OpportunityEngine.build_growth_plan(db, merchant.id, target_revenue=req.target_revenue)

@router.post("/recommendations/{id}/approve")
async def approve_recommendation(id: str, req: ActionDecisionRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    rec = db.query(Recommendation).filter(Recommendation.id == id).first()
    if not rec:
        # Fallback if opportunity ID was passed
        opp = db.query(Opportunity).filter(Opportunity.id == id).first()
        if opp:
            rec = db.query(Recommendation).filter(Recommendation.opportunity_id == opp.id).first()
    
    if not rec:
        # Create ad-hoc recommendation for approval
        rec = Recommendation(
            merchant_id=merchant.id,
            title="Approved Action",
            action_type="EXPERIMENT_START",
            payload_json=json.dumps({"offer": "Approved Action"}),
            status="PENDING"
        )
        db.add(rec)
        db.commit()

    # Execute approved action into active experiment
    payload = json.loads(rec.payload_json) if rec.payload_json else {}
    result = await ActionExecutor.execute_approved_action(
        db=db,
        merchant_id=merchant.id,
        recommendation_id=rec.id,
        action_type=rec.action_type,
        target_segment=payload.get("target_segment", "Afternoon Visitors (2-5 PM)"),
        offer_details=rec.title,
        duration_days=payload.get("duration_days", 3),
        approved_by="Rajesh Kumar (Merchant)"
    )
    return result

@router.post("/recommendations/{id}/reject")
def reject_recommendation(id: str, req: ActionDecisionRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    rec = db.query(Recommendation).filter(Recommendation.id == id).first()
    if rec:
        rec.status = "REJECTED"
        rec.merchant_feedback = req.notes
        db.commit()
    return {"status": "SUCCESS", "message": "Recommendation dismissed."}
