from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Merchant, MerchantProfile, Notification
from app.services.analytics_engine import AnalyticsEngine
from app.integrations.cognee_provider import get_memory_provider
from app.integrations.paytm_provider import get_paytm_provider

router = APIRouter(tags=["Merchant"])

@router.get("/merchant/profile")
def get_merchant_profile(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant profile not found.")
    
    paytm_provider = get_paytm_provider()
    paytm_status = paytm_provider.get_merchant_profile(merchant.id)

    return {
        "id": merchant.id,
        "name": merchant.name,
        "business_name": merchant.business_name,
        "category": merchant.category,
        "city": merchant.city,
        "phone": merchant.phone,
        "preferred_language": merchant.preferred_language,
        "paytm_integration": paytm_status,
        "is_demo_merchant": True
    }

@router.get("/merchant/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    metrics = AnalyticsEngine.calculate_summary_metrics(db, merchant.id)
    notifications = db.query(Notification).filter(Notification.merchant_id == merchant.id).order_by(Notification.created_at.desc()).limit(5).all()

    return {
        "greeting": f"Good morning, {merchant.name.split()[0]} 👋",
        "merchant": {
            "name": merchant.name,
            "business_name": merchant.business_name,
            "city": merchant.city,
            "category": merchant.category
        },
        "headline_metrics": {
            "today_sales": metrics["today_sales"],
            "today_sales_lift_pct": metrics["today_sales_lift_pct"],
            "today_transactions": metrics["today_transactions"],
            "today_aov": metrics["today_aov"],
            "repeat_customer_rate_pct": metrics["repeat_customer_rate_pct"],
            "settlement_balance": metrics["settlement_balance"]
        },
        "operating_slots": {
            "peak_hours": metrics["peak_hours"],
            "weak_hours": metrics["weak_hours"]
        },
        "suggested_prompts": [
            "Mujhe iss week ₹5,000 extra kamaana hai",
            "Kal sales kaise badhau?",
            "Meri sales kyu gir rahi hai?",
            "Which customers are at risk?"
        ],
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "priority": n.priority,
                "is_read": n.is_read,
                "action_url": n.action_url
            } for n in notifications
        ],
        "disclaimer": "Prototype • Uses synthetic merchant data"
    }

@router.get("/merchant/metrics")
def get_metrics_detail(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    return AnalyticsEngine.calculate_summary_metrics(db, merchant.id)

@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    notifications = db.query(Notification).filter(Notification.merchant_id == merchant.id).order_by(Notification.created_at.desc()).all()
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "priority": n.priority,
            "is_read": n.is_read,
            "action_url": n.action_url,
            "created_at": n.created_at.isoformat()
        } for n in notifications
    ]

@router.get("/customers")
def get_customer_intelligence(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    segments = AnalyticsEngine.calculate_customer_segments_summary(db, merchant.id)
    dormant = AnalyticsEngine.detect_dormant_cohort(db, merchant.id)

    return {
        "privacy_notice": "Privacy-safe aggregated cohort signals. Zero customer PII is transmitted or exposed.",
        "segments": segments,
        "dormant_alert": {
            "count": dormant["dormant_count"],
            "avg_past_basket": dormant["avg_past_basket"],
            "churn_risk_pct": dormant["estimated_churn_risk_pct"],
            "recommendation": "Targeted win-back campaign with ₹30 coupon incentive"
        }
    }

@router.get("/insights")
def get_business_insights(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    hourly = AnalyticsEngine.calculate_hourly_distribution(db, merchant.id)
    weekly = AnalyticsEngine.calculate_weekly_trend(db, merchant.id)
    affinity = AnalyticsEngine.calculate_product_affinity(db, merchant.id)
    segments = AnalyticsEngine.calculate_customer_segments_summary(db, merchant.id)

    return {
        "hourly_distribution": hourly,
        "weekly_trend": weekly,
        "product_affinity": affinity,
        "customer_segments": segments
    }

@router.get("/memory")
def get_memory_insights(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    provider = get_memory_provider()
    memories = provider.get_merchant_memories(db, merchant.id)

    return {
        "merchant_name": merchant.name,
        "business": merchant.business_name,
        "memory_provider": provider.__class__.__name__,
        "memories": memories,
        "insights_summary": [
            "Prefers Hindi/Hinglish communication",
            "Store experiences predictable 2-5 PM lull (32% below baseline)",
            "Strong customer response to bundle promotions (Tea + Samosa)",
            "Strict policy against aggressive margin discounting (>10%)"
        ]
    }
