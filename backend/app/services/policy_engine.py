from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.db.models import PolicyDecision
import re

class RiskTier:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    BLOCKED = "BLOCKED"

class PolicyDecisionType:
    ALLOWED = "ALLOWED"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"
    BLOCKED = "BLOCKED"

PROHIBITED_INTENTS = [
    (re.compile(r"loan|credit|underwriting|advance|borrow", re.IGNORECASE), "Automated credit underwriting and loan disbursement are strictly restricted to licensed lending institutions and cannot be authorized autonomously."),
    (re.compile(r"guarantee|promise|100%\s*profit|definitely\s*earn", re.IGNORECASE), "Financial return guarantees are prohibited under regulatory standards. All projections must be presented as scenario estimates."),
    (re.compile(r"transfer\s*money|change\s*bank|withdraw|payout", re.IGNORECASE), "Direct fund transfers or bank detail modifications cannot be triggered by AI systems."),
    (re.compile(r"delete\s*audit|bypass\s*approval|ignore\s*rules", re.IGNORECASE), "Audit trail evasion or safety rule bypass attempts are strictly forbidden.")
]

class PolicyEngine:
    @staticmethod
    def evaluate_query(query: str, merchant_id: str, db: Session = None) -> Dict[str, Any]:
        """Classifies incoming merchant query for safety and regulatory compliance."""
        for pattern, reason in PROHIBITED_INTENTS:
            if pattern.search(query):
                decision = {
                    "risk_tier": RiskTier.BLOCKED if "transfer" in query or "bypass" in query else RiskTier.HIGH,
                    "decision": PolicyDecisionType.BLOCKED,
                    "reason": reason,
                    "allowed": False
                }
                if db:
                    PolicyEngine._log_decision(db, merchant_id, decision["risk_tier"], "QUERY_SAFETY", "ASSISTANT_QUERY", decision["decision"], reason, query[:150])
                return decision

        # Medium risk: pricing or discount queries
        if re.search(r"discount|offer|coupon|campaign|cut\s*price", query, re.IGNORECASE):
            decision = {
                "risk_tier": RiskTier.MEDIUM,
                "decision": PolicyDecisionType.REQUIRES_APPROVAL,
                "reason": "Promotional offers require explicit merchant sign-off to protect gross margins.",
                "allowed": True
            }
            if db:
                PolicyEngine._log_decision(db, merchant_id, RiskTier.MEDIUM, "PROMOTION_INQUIRY", "PROMOTION_PROPOSAL", decision["decision"], decision["reason"], query[:150])
            return decision

        decision = {
            "risk_tier": RiskTier.LOW,
            "decision": PolicyDecisionType.ALLOWED,
            "reason": "Standard business intelligence and store performance analytics query.",
            "allowed": True
        }
        if db:
            PolicyEngine._log_decision(db, merchant_id, RiskTier.LOW, "ANALYTICS_QUERY", "STORE_TELEMETRY", decision["decision"], decision["reason"], query[:150])
        return decision

    @staticmethod
    def evaluate_action_proposal(action_type: str, payload: Dict[str, Any], merchant_id: str, db: Session = None) -> Dict[str, Any]:
        """Validates action proposals before staging for merchant review."""
        if action_type in ["CREDIT_APPROVE", "BANK_CHANGE", "DIRECT_PAYOUT"]:
            return {
                "risk_tier": RiskTier.BLOCKED,
                "decision": PolicyDecisionType.BLOCKED,
                "reason": "Action type strictly prohibited from autonomous or semi-autonomous execution.",
                "allowed": False
            }

        discount_amount = payload.get("discount_amount", 0)
        discount_pct = payload.get("discount_pct", 0)
        min_order = payload.get("min_order", 0)

        # Margin protection rule
        if discount_pct > 20 or (min_order > 0 and (discount_amount / min_order) > 0.25):
            return {
                "risk_tier": RiskTier.HIGH,
                "decision": PolicyDecisionType.BLOCKED,
                "reason": "Discount depth exceeds the merchant's configured safe margin threshold of 20%.",
                "allowed": False
            }

        return {
            "risk_tier": RiskTier.MEDIUM,
            "decision": PolicyDecisionType.REQUIRES_APPROVAL,
            "reason": "Commercial action requires explicit human merchant authorization before execution.",
            "allowed": True
        }

    @staticmethod
    def _log_decision(db: Session, merchant_id: str, risk_tier: str, intent: str, action_type: str, decision: str, reason: str, snippet: str):
        try:
            record = PolicyDecision(
                merchant_id=merchant_id,
                risk_tier=risk_tier,
                intent=intent,
                action_type=action_type,
                decision=decision,
                reason=reason,
                input_snippet=snippet
            )
            db.add(record)
            db.commit()
        except Exception:
            db.rollback()
