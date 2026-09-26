import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal
from app.services.policy_engine import PolicyEngine, RiskTier, PolicyDecisionType
from app.services.action_governor import ActionGovernor
from app.services.experiment_service import ExperimentService
from app.services.cannibalization_engine import CannibalizationEngine
from app.services.goal_engine import GoalEngine
from app.services.opportunity_engine import OpportunityEngine

client = TestClient(app)

def test_policy_engine_blocks_loan_requests():
    decision = PolicyEngine.evaluate_query("Approve a loan of 50 lakhs immediately", "demo_merch")
    assert decision["risk_tier"] == RiskTier.HIGH or decision["risk_tier"] == RiskTier.BLOCKED
    assert decision["decision"] == PolicyDecisionType.BLOCKED
    assert decision["allowed"] is False
    assert "credit" in decision["reason"].lower() or "loan" in decision["reason"].lower()

def test_policy_engine_blocks_guarantee_claims():
    decision = PolicyEngine.evaluate_query("Guarantee me 100% profit tomorrow", "demo_merch")
    assert decision["decision"] == PolicyDecisionType.BLOCKED
    assert decision["allowed"] is False
    assert "guarantee" in decision["reason"].lower()

def test_policy_engine_allows_analytics_queries():
    decision = PolicyEngine.evaluate_query("What was my average ticket size today?", "demo_merch")
    assert decision["risk_tier"] == RiskTier.LOW
    assert decision["decision"] == PolicyDecisionType.ALLOWED
    assert decision["allowed"] is True

def test_policy_engine_flags_discounts_as_medium_risk():
    decision = PolicyEngine.evaluate_query("Give 15% discount on tea", "demo_merch")
    assert decision["risk_tier"] == RiskTier.MEDIUM
    assert decision["decision"] == PolicyDecisionType.REQUIRES_APPROVAL

def test_opportunity_overlap_and_addressable_space():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    res = OpportunityEngine.get_all_opportunities(db, merchant_id)
    
    gross_val = res["total_opportunity_space"]["gross_value"]
    addr_val = res["total_opportunity_space"]["addressable_value"]
    net_contrib = res["total_opportunity_space"]["expected_net_contribution"]
    
    assert gross_val == 7400.0
    assert addr_val < gross_val, "Addressable opportunity must account for overlap and be less than gross"
    assert addr_val > 5000.0, "Addressable space must comfortably support the ₹5,000 target"
    assert net_contrib > 0, "Net contribution after discount and campaign costs must be positive"
    
    # Check individual opportunity overlap analysis
    for op in res["opportunities"]:
        assert "overlap_analysis" in op
        assert "margin_accounting" in op
        assert op["overlap_analysis"]["estimated_addressable_opportunity"] <= op["overlap_analysis"]["gross_opportunity"]
        assert "why_this_action" in op
        assert "why_not_discount" in op

def test_action_governor_enforces_human_approval():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    
    # Unapproved attempt
    res = ActionGovernor.execute_with_governance(
        db=db,
        merchant_id=merchant_id,
        action_type="OFFER_CREATE",
        target_segment="Afternoon Visitors",
        offer_details="₹20 off above ₹200",
        approved=False
    )
    assert res["status"] == "REJECTED_BY_GOVERNOR"
    assert res["error"] == "MERCHANT_APPROVAL_REQUIRED"

def test_action_governor_enforces_idempotency():
    import time
    db = SessionLocal()
    merchant_id = "test-merchant-idempotency"
    v = int(time.time() * 1000) % 1000000
    
    # First execution with fresh version
    res1 = ActionGovernor.execute_with_governance(
        db=db,
        merchant_id=merchant_id,
        action_type="TEST_OFFER",
        target_segment="Segment A",
        offer_details="Test Special Offer",
        approved=True,
        action_version=v
    )
    assert res1["status"] == "SCHEDULED"
    assert res1["idempotency_key"] is not None
    
    # Immediate duplicate execution with exact same parameters
    res2 = ActionGovernor.execute_with_governance(
        db=db,
        merchant_id=merchant_id,
        action_type="TEST_OFFER",
        target_segment="Segment A",
        offer_details="Test Special Offer",
        approved=True,
        action_version=v
    )
    assert res2["status"] == "DUPLICATE_IDEMPOTENT_IGNORED"
    assert "Duplicate execution prevented" in res2["message"]
    assert res2["status"] == "DUPLICATE_IDEMPOTENT_IGNORED"
    assert "Duplicate execution prevented" in res2["message"]

def test_experiment_service_statistically_honest():
    # Small sample size (< 30)
    small_eval = ExperimentService.evaluate_experiment_statistically(
        sample_size=18,
        baseline_txns=12.0,
        treatment_txns=16.0
    )
    assert small_eval["status"] == "INSUFFICIENT_DATA"
    assert small_eval["is_statistically_significant"] is False
    assert small_eval["p_value"] is None
    assert "insufficient" in small_eval["message"].lower()

    # Adequate sample size (> 30)
    large_eval = ExperimentService.evaluate_experiment_statistically(
        sample_size=140,
        baseline_txns=30.0,
        treatment_txns=42.0
    )
    assert large_eval["status"] == "STATISTICALLY_VALID"
    assert large_eval["is_statistically_significant"] is True
    assert large_eval["p_value"] is not None
    assert large_eval["p_value"] < 0.05

def test_goal_engine_multilingual():
    hindi_goal = GoalEngine.decompose_goal("मुझे इस हफ्ते ₹5,000 ज्यादा कमाने हैं", "hi")
    assert hindi_goal["merchant_goal"]["target_amount"] == 5000.0
    assert hindi_goal["planned_headroom"]["planned_contribution"] > 5000.0
    assert len(hindi_goal["recommended_experiments"]) == 3

    marathi_goal = GoalEngine.decompose_goal("मला या आठवड्यात ₹3,000 जास्त कमवायचे आहेत", "mr")
    assert marathi_goal["merchant_goal"]["target_amount"] == 3000.0

def test_consent_api_flow():
    # POST update consent to known state
    update_res = client.post("/api/consent", json={
        "business_analytics": True,
        "customer_segmentation": True,
        "personalized_campaigns": False,
        "voice_processing": True,
        "external_ai": False,
        "data_retention_days": 60
    })
    assert update_res.status_code == 200
    updated = update_res.json()["consents"]
    assert updated["personalized_campaigns"] is False
    assert updated["external_ai"] is False
    assert updated["data_retention_days"] == 60

    # GET verified consent
    res = client.get("/api/consent")
    assert res.status_code == 200
    consents = res.json()["consents"]
    assert consents["business_analytics"] is True
    assert consents["external_ai"] is False
    assert consents["data_retention_days"] == 60

    # Reset back to full consent
    reset_res = client.post("/api/consent", json={
        "business_analytics": True,
        "customer_segmentation": True,
        "personalized_campaigns": True,
        "voice_processing": True,
        "external_ai": True,
        "data_retention_days": 90
    })
    assert reset_res.status_code == 200
    assert reset_res.json()["consents"]["external_ai"] is True

