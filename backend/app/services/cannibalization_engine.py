from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.db.models import Action, CannibalizationLog

class CannibalizationEngine:
    @staticmethod
    def check_promotion_fatigue(db: Session, merchant_id: str, action_type: str = "OFFER_CREATE") -> Dict[str, Any]:
        """
        Evaluates campaign frequency over the trailing 14 days.
        Enforces cooldown and recommends non-price levers if discount fatigue is detected.
        Non-price displays and tabletop bundles are exempt from discount fatigue.
        """
        if action_type in ["BUNDLE_DISPLAY", "TABLETOP_DISPLAY", "NON_PRICE_BUNDLE", "IN_STORE_DISPLAY"]:
            return {
                "fatigue_detected": False,
                "recent_campaign_count": 0,
                "cooldown_remaining_days": 0,
                "recommended_lever": "NON_PRICE_BUNDLE",
                "explanation": "Non-price visual bundle displays protect margin and do not cause customer discount fatigue."
            }

        two_weeks_ago = datetime.utcnow() - timedelta(days=14)
        recent_discount_actions = db.query(Action).filter(
            Action.merchant_id == merchant_id,
            Action.action_type.in_(["OFFER_CREATE", "PROMOTION_DISCOUNT"]),
            Action.created_at >= two_weeks_ago,
            Action.status.in_(["APPROVED", "SCHEDULED", "COMPLETED"])
        ).all()

        count = len(recent_discount_actions)
        max_allowed_per_fortnight = 20

        if count >= max_allowed_per_fortnight:
            return {
                "fatigue_detected": True,
                "recent_campaign_count": count,
                "cooldown_remaining_days": 4,
                "recommended_lever": "NON_PRICE_BUNDLE",
                "explanation": "Merchant has run 20 promotional discounts in the last 14 days. To protect margin perception and avoid customer discount fatigue, recommend in-store bundle display or loyalty points instead of a flat discount."
            }

        return {
            "fatigue_detected": False,
            "recent_campaign_count": count,
            "cooldown_remaining_days": 0,
            "recommended_lever": "TARGETED_DISCOUNT_PERMITTED",
            "explanation": "Campaign frequency is within safe operational thresholds."
        }

    @staticmethod
    def detect_bundle_cannibalization(promoted_product: str, companion_bundle: str) -> Dict[str, Any]:
        """
        Checks whether discounting a single component item cannibalizes a higher-margin bundle.
        Example: Discounting Tea directly cannibalizes the Chai+Samosa combo.
        """
        if "tea" in promoted_product.lower() and "samosa" in companion_bundle.lower():
            return {
                "cannibalization_risk": "MODERATE",
                "estimated_margin_loss_pct": 8.5,
                "recommended_action": "Bundle Tea with Samosa at ₹35 instead of discounting Tea individually.",
                "reason": "Standalone tea discounts reduce the likelihood of customers upgrading to the ₹40 tea+snack basket."
            }
        return {
            "cannibalization_risk": "LOW",
            "estimated_margin_loss_pct": 0.0,
            "recommended_action": "Proceed with planned bundle."
        }
