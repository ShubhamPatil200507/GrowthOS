from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import json

from app.db.database import get_db
from app.db.models import Experiment, ExperimentResult, Merchant
from app.services.safe_language import SafeLanguageService

router = APIRouter(prefix="/experiments", tags=["Experiments"])

class CreateExperimentRequest(BaseModel):
    title: str
    objective: str
    hypothesis: str
    control_spec: str = "Standard pricing"
    treatment_spec: str
    duration_days: int = 3
    target_segment: str = "Afternoon Visitors (2-5 PM)"
    primary_metric: str = "Transaction count"

@router.get("")
def list_experiments(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    experiments = db.query(Experiment).filter(Experiment.merchant_id == merchant.id).order_by(Experiment.created_at.desc()).all()

    output = []
    for e in experiments:
        res = None
        if e.results:
            res = {
                "transaction_lift_pct": e.results.transaction_lift_pct,
                "aov_lift_pct": e.results.aov_lift_pct,
                "revenue_lift_pct": e.results.revenue_lift_pct,
                "net_revenue_lift_pct": e.results.net_revenue_lift_pct,
                "confidence_pct": e.results.confidence_pct,
                "ai_interpretation": e.results.ai_interpretation,
                "next_recommendation": e.results.next_recommendation
            }
        output.append({
            "id": e.id,
            "title": e.title,
            "objective": e.objective,
            "hypothesis": e.hypothesis,
            "control": e.control_spec,
            "treatment": e.treatment_spec,
            "duration_days": e.duration_days,
            "target_segment": e.target_segment,
            "primary_metric": e.primary_metric,
            "secondary_metrics": json.loads(e.secondary_metrics_json) if e.secondary_metrics_json else [],
            "status": e.status,
            "start_date": e.start_date.isoformat() if e.start_date else None,
            "results": res
        })
    return output

@router.get("/results/latest")
def get_latest_results(db: Session = Depends(get_db)):
    """Returns the primary completed experiment result to close the OBSERVE -> ACT -> MEASURE -> LEARN loop."""
    result = db.query(ExperimentResult).first()
    if not result:
        raise HTTPException(status_code=404, detail="No completed experiment results available yet.")

    exp = result.experiment
    metrics = json.loads(result.metrics_json) if result.metrics_json else {}

    return {
        "experiment_id": exp.id,
        "title": exp.title,
        "objective": exp.objective,
        "hypothesis": exp.hypothesis,
        "control_spec": exp.control_spec,
        "treatment_spec": exp.treatment_spec,
        "primary_metric": exp.primary_metric,
        "status": "COMPLETED",
        "results": {
            "transaction_lift_pct": result.transaction_lift_pct,
            "aov_lift_pct": result.aov_lift_pct,
            "revenue_lift_pct": result.revenue_lift_pct,
            "net_revenue_lift_pct": result.net_revenue_lift_pct,
            "confidence_pct": result.confidence_pct,
            "control_transactions": metrics.get("control_transactions", 34),
            "treatment_transactions": metrics.get("treatment_transactions", 40),
            "net_incremental_revenue": metrics.get("net_incremental_revenue", 615.0)
        },
        "ai_interpretation": SafeLanguageService.sanitize_text(result.ai_interpretation),
        "next_recommendation": SafeLanguageService.sanitize_text(result.next_recommendation),
        "next_action": {
            "title": "Chai + Samosa Margin Combo",
            "action_type": "BUNDLE_CREATE",
            "spec": "Test ₹40 combo instead of flat discount on Friday"
        },
        "loop_stage": "LEARN"
    }

@router.post("")
def create_experiment(req: CreateExperimentRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    now = datetime.utcnow()
    exp = Experiment(
        merchant_id=merchant.id,
        title=req.title,
        objective=req.objective,
        hypothesis=req.hypothesis,
        control_spec=req.control_spec,
        treatment_spec=req.treatment_spec,
        duration_days=req.duration_days,
        target_segment=req.target_segment,
        primary_metric=req.primary_metric,
        secondary_metrics_json=json.dumps(["Net Revenue", "AOV"]),
        status="SCHEDULED",
        start_date=now,
        end_date=now + timedelta(days=req.duration_days)
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return {"status": "SUCCESS", "experiment_id": exp.id, "message": "Experiment created successfully."}
