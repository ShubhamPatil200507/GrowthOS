from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

from app.db.database import get_db
from app.db.models import Action, ActionApproval, Merchant, Recommendation
from app.services.action_governor import ActionGovernor

router = APIRouter(prefix="/actions", tags=["Actions & Approvals"])

class ActionDecisionRequest(BaseModel):
    recommendation_id: Optional[str] = "rec_01"
    action_type: str = "OFFER_CREATE"
    target_segment: str = "Afternoon Visitors (2-5 PM)"
    offer_details: str = "₹20 off orders above ₹200"
    duration_days: int = 3
    approved: bool = True
    approved_by: Optional[str] = "Rajesh Kumar (Merchant)"
    modification_notes: Optional[str] = None
    action_version: Optional[int] = 1

class RejectActionRequest(BaseModel):
    recommendation_id: Optional[str] = "rec_01"
    action_id: Optional[str] = None
    reason: str = "Merchant preferred not to run promotional discounts at this time."

@router.post("/approve")
@router.post("/execute")
def approve_and_execute_action(req: ActionDecisionRequest, db: Session = Depends(get_db)):
    """
    Routes merchant action approval through the deterministic Action Governor.
    Enforces idempotency, policy limits, margin protections, and promotion fatigue checks.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    governor_result = ActionGovernor.execute_with_governance(
        db=db,
        merchant_id=merchant.id,
        action_type=req.action_type,
        target_segment=req.target_segment,
        offer_details=req.offer_details,
        duration_days=req.duration_days,
        approved=req.approved,
        approved_by=req.approved_by,
        recommendation_id=req.recommendation_id,
        action_version=req.action_version
    )

    if governor_result.get("status") == "REJECTED_BY_GOVERNOR":
        raise HTTPException(status_code=400, detail=governor_result["message"])

    if governor_result.get("status") == "BLOCKED_BY_POLICY":
        raise HTTPException(status_code=403, detail=governor_result["message"])

    return governor_result

@router.post("/modify")
def modify_and_approve_action(req: ActionDecisionRequest, db: Session = Depends(get_db)):
    """
    Allows the merchant to modify discount depth, target segment, or duration before sign-off.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    req.action_version = (req.action_version or 1) + 1
    return approve_and_execute_action(req, db)

@router.post("/reject")
def reject_action(req: RejectActionRequest, db: Session = Depends(get_db)):
    """
    Records merchant rejection and feeds reason into Growth Memory to prevent repeat proposals.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    now = datetime.utcnow()
    action = Action(
        merchant_id=merchant.id,
        recommendation_id=req.recommendation_id,
        action_type="REJECTED_PROPOSAL",
        status="REJECTED",
        rejection_reason=req.reason,
        target_segment="None",
        offer_details=f"Rejected: {req.reason}",
        execution_engine="NONE",
        created_at=now
    )
    db.add(action)

    approval = ActionApproval(
        action_id=action.id,
        merchant_id=merchant.id,
        decision="REJECTED",
        decided_by="Rajesh Kumar (Merchant)",
        notes=req.reason,
        decided_at=now
    )
    db.add(approval)
    db.commit()

    return {
        "status": "REJECTED",
        "action_id": action.id,
        "message": "Action rejected by merchant. Feedback saved to Growth Memory.",
        "reason": req.reason
    }

@router.get("")
def list_actions(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        return []

    actions = db.query(Action).filter(Action.merchant_id == merchant.id).order_by(Action.created_at.desc()).all()

    output = []
    for a in actions:
        approvals = [
            {"decision": ap.decision, "by": ap.decided_by, "at": ap.decided_at.isoformat()}
            for ap in a.approvals
        ]
        output.append({
            "id": a.id,
            "action_type": a.action_type,
            "status": a.status,
            "target_segment": a.target_segment,
            "offer_details": a.offer_details,
            "execution_engine": a.execution_engine,
            "idempotency_key": a.idempotency_key,
            "policy_status": a.policy_status,
            "rejection_reason": a.rejection_reason,
            "approvals": approvals,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "executed_at": a.executed_at.isoformat() if a.executed_at else None
        })
    return output
