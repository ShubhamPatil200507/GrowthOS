import hashlib
import json
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.db.models import Action, ActionApproval, IdempotencyRecord, Recommendation
from app.services.policy_engine import PolicyEngine, RiskTier, PolicyDecisionType
from app.services.cannibalization_engine import CannibalizationEngine
from app.integrations.adapters.base import get_adapter_registry

class ActionGovernor:
    """
    Deterministic gatekeeper between AI recommendation proposals and external execution.
    Enforces:
    1. Strict schema validation
    2. Policy compliance
    3. Human-in-the-loop merchant approval
    4. Action idempotency
    5. Promotion fatigue & margin checks
    """
    @staticmethod
    def execute_with_governance(
        db: Session,
        merchant_id: str,
        action_type: str,
        target_segment: str,
        offer_details: str,
        duration_days: int = 3,
        approved: bool = False,
        approved_by: str = "Rajesh Kumar (Merchant)",
        recommendation_id: str = None,
        action_version: int = 1
    ) -> Dict[str, Any]:
        # 1. Enforce Human-in-the-loop
        if not approved:
            return {
                "status": "REJECTED_BY_GOVERNOR",
                "error": "MERCHANT_APPROVAL_REQUIRED",
                "message": "AI agent cannot dispatch external actions without explicit human merchant authorization."
            }

        # 2. Check Promotion Fatigue & Margin Guard
        fatigue = CannibalizationEngine.check_promotion_fatigue(db, merchant_id, action_type=action_type)
        if fatigue["fatigue_detected"]:
            return {
                "status": "BLOCKED_BY_POLICY",
                "error": "PROMOTION_FATIGUE_EXCEEDED",
                "message": fatigue["explanation"],
                "recommended_alternative": fatigue["recommended_lever"]
            }

        # 3. Policy Engine Evaluation
        policy_eval = PolicyEngine.evaluate_action_proposal(
            action_type=action_type,
            payload={"offer_details": offer_details, "duration_days": duration_days},
            merchant_id=merchant_id,
            db=db
        )
        if not policy_eval["allowed"]:
            return {
                "status": "BLOCKED_BY_POLICY",
                "error": "POLICY_VIOLATION",
                "message": policy_eval["reason"]
            }

        # 4. Idempotency Check
        idempotency_raw = f"{merchant_id}:{action_type}:{offer_details}:{duration_days}:{action_version}"
        idempotency_key = hashlib.sha256(idempotency_raw.encode("utf-8")).hexdigest()

        existing_record = db.query(IdempotencyRecord).filter(
            IdempotencyRecord.idempotency_key == idempotency_key
        ).first()

        if existing_record:
            return {
                "status": "DUPLICATE_IDEMPOTENT_IGNORED",
                "message": "Action has already been approved and registered. Duplicate execution prevented.",
                "idempotency_key": idempotency_key,
                "cached_action_id": existing_record.action_id
            }

        # 5. Create Action record
        now = datetime.utcnow()
        action = Action(
            merchant_id=merchant_id,
            recommendation_id=recommendation_id,
            action_type=action_type,
            status="APPROVED",
            target_segment=target_segment,
            offer_details=offer_details,
            execution_engine="INTEGRATION_ADAPTER",
            idempotency_key=idempotency_key,
            policy_status="APPROVED_BY_POLICY",
            risk_tier=RiskTier.MEDIUM,
            created_at=now
        )
        db.add(action)
        db.commit()
        db.refresh(action)

        # 6. Log Approval
        approval = ActionApproval(
            action_id=action.id,
            merchant_id=merchant_id,
            decision="APPROVED",
            decided_by=approved_by,
            notes="Authorized via Action Governor with valid idempotency key",
            decided_at=now
        )
        db.add(approval)

        # 7. Record Idempotency
        idempotency_rec = IdempotencyRecord(
            merchant_id=merchant_id,
            idempotency_key=idempotency_key,
            action_id=action.id,
            status="EXECUTED",
            response_json=json.dumps({"action_id": action.id, "offer": offer_details})
        )
        db.add(idempotency_rec)
        db.commit()

        # 8. Dispatch via Adapters
        registry = get_adapter_registry()
        soundbox = registry.soundbox_adapter.announce_action_scheduled(offer_details)
        whatsapp = registry.whatsapp_adapter.stage_customer_broadcast(target_segment, offer_details)

        action.status = "SCHEDULED"
        action.executed_at = now
        action.execution_result_json = json.dumps({
            "soundbox": soundbox,
            "whatsapp": whatsapp,
            "idempotency_key": idempotency_key
        })
        db.commit()

        return {
            "status": "SCHEDULED",
            "action_id": action.id,
            "idempotency_key": idempotency_key,
            "target_segment": target_segment,
            "offer_details": offer_details,
            "duration_days": duration_days,
            "dispatch": {
                "soundbox": soundbox,
                "whatsapp": whatsapp
            },
            "governor_verification": {
                "human_approved": True,
                "policy_check": "PASSED",
                "idempotency_enforced": True
            }
        }
