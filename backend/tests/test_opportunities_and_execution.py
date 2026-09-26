import pytest
import asyncio
from app.db.database import SessionLocal
from app.services.opportunity_engine import OpportunityEngine
from app.services.action_executor import ActionExecutor
from app.db.models import Action, Experiment

def test_opportunity_space_equals_7400():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    opp_space = OpportunityEngine.get_all_opportunities(db, merchant_id)
    
    assert opp_space["total_opportunity_space"]["value"] == 7400.0
    assert len(opp_space["opportunities"]) == 4
    db.close()

def test_growth_plan_covers_5000_target():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    plan = OpportunityEngine.build_growth_plan(db, merchant_id, target_revenue=5000.0)
    
    assert plan["goal"]["target_revenue"] == 5000.0
    assert plan["goal"]["accumulated_opportunity"] >= 5000.0
    assert len(plan["recommended_experiments"]) == 3
    db.close()

@pytest.mark.asyncio
async def test_human_in_the_loop_execution():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    
    result = await ActionExecutor.execute_approved_action(
        db=db,
        merchant_id=merchant_id,
        recommendation_id="rec_test_01",
        action_type="OFFER_CREATE",
        target_segment="Afternoon Visitors (2-5 PM)",
        offer_details="₹20 off above ₹200",
        duration_days=3,
        approved_by="Rajesh Kumar (Merchant)"
    )
    
    assert result["status"] == "SUCCESS"
    assert len(result["workflow_steps"]) == 6
    assert result["experiment_id"] is not None
    
    # Verify in DB
    action = db.query(Action).filter(Action.id == result["action_id"]).first()
    assert action is not None
    assert action.status == "SCHEDULED"
    
    exp = db.query(Experiment).filter(Experiment.id == result["experiment_id"]).first()
    assert exp is not None
    assert exp.status == "RUNNING"
    db.close()
