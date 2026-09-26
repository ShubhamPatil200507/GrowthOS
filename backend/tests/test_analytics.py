import pytest
from app.db.database import SessionLocal
from app.services.analytics_engine import AnalyticsEngine

def test_summary_metrics():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    metrics = AnalyticsEngine.calculate_summary_metrics(db, merchant_id)
    
    assert metrics["today_sales"] == 18420.0
    assert metrics["today_transactions"] == 96
    assert metrics["today_aov"] == 191.0
    assert metrics["repeat_customer_rate_pct"] == 38.0
    assert metrics["settlement_balance"] == 17840.0
    db.close()

def test_hourly_distribution_detects_afternoon_lull():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    hourly = AnalyticsEngine.calculate_hourly_distribution(db, merchant_id)
    
    assert len(hourly) > 0
    # Check that 14:00 (2 PM) is marked weak
    weak_slots = [h for h in hourly if h["is_weak"]]
    assert len(weak_slots) >= 3
    assert any(h["hour"] == "14:00" for h in weak_slots)
    db.close()

def test_dormant_cohort_detection():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    dormant = AnalyticsEngine.detect_dormant_cohort(db, merchant_id)
    
    assert dormant["dormant_count"] == 47
    assert dormant["avg_past_basket"] > 250.0
    db.close()

def test_product_affinity_tea_samosa():
    db = SessionLocal()
    merchant_id = "rajesh-general-store-pune-001"
    affinities = AnalyticsEngine.calculate_product_affinity(db, merchant_id)
    
    top = affinities[0]
    assert "Chai" in top["combo"] and "Samosa" in top["combo"]
    assert top["affinity_score"] == 0.38
    db.close()
