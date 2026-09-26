from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.models import AgentRun, Action, Experiment, Opportunity, AuditLog
from scripts.seed_demo_data import seed

router = APIRouter(prefix="/admin", tags=["Admin & Observability"])

@router.get("/observability")
def get_observability_metrics(db: Session = Depends(get_db)):
    total_runs = db.query(AgentRun).count()
    avg_latency = db.query(func.avg(AgentRun.latency_ms)).scalar() or 142.0
    action_count = db.query(Action).count()
    experiment_count = db.query(Experiment).count()
    audit_count = db.query(AuditLog).count()

    recent_runs = db.query(AgentRun).order_by(AgentRun.created_at.desc()).limit(8).all()

    return {
        "status": "HEALTHY",
        "system_version": "1.0.0-prototype",
        "active_engine": "GrowthOS Multi-Agent Pipeline",
        "telemetry": {
            "total_ai_queries": total_runs,
            "avg_agent_latency_ms": round(float(avg_latency), 1),
            "total_actions_recorded": action_count,
            "active_experiments_count": experiment_count,
            "audit_events_count": audit_count,
            "model_provider": "Hybrid Rule + Multi-Agent Orchestrator",
            "voice_provider": "Sarvam AI (Saarika Indic Engine)",
            "memory_provider": "Cognee Knowledge Graph (Local Fallback)"
        },
        "recent_agent_runs": [
            {
                "id": r.id,
                "agent_name": r.agent_name,
                "query": r.query,
                "latency_ms": r.latency_ms,
                "status": r.status,
                "timestamp": r.created_at.isoformat() if r.created_at else None
            } for r in recent_runs
        ]
    }

@router.post("/reset-demo")
def reset_demo_state():
    """Restores the pristine deterministic demo state."""
    seed()
    return {
        "status": "SUCCESS",
        "message": "Demo data successfully reset to pristine baseline (Rajesh General Store, Pune)."
    }
