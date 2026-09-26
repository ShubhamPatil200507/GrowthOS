from abc import ABC, abstractmethod
from typing import Dict, Any, List

class IntegrationStatus:
    WORKING = "WORKING"
    SIMULATED = "SIMULATED"
    INTEGRATION_READY = "INTEGRATION-READY"
    PRODUCTION_DEPENDENT = "PRODUCTION-DEPENDENT"

class BaseAdapter(ABC):
    @abstractmethod
    def get_status(self) -> Dict[str, Any]:
        pass

class SoundboxAdapter(BaseAdapter):
    @abstractmethod
    def announce_payment(self, amount: float, currency: str = "INR") -> Dict[str, Any]:
        pass

    @abstractmethod
    def announce_action_scheduled(self, message: str) -> Dict[str, Any]:
        pass

class WhatsAppAdapter(BaseAdapter):
    @abstractmethod
    def stage_customer_broadcast(self, target_segment: str, template_body: str) -> Dict[str, Any]:
        pass

class SettlementAdapter(BaseAdapter):
    @abstractmethod
    def get_settlement_reconciliation(self, merchant_id: str) -> Dict[str, Any]:
        pass

class CampaignAdapter(BaseAdapter):
    @abstractmethod
    def register_campaign(self, campaign_payload: Dict[str, Any]) -> Dict[str, Any]:
        pass

def get_adapter_registry():
    from app.integrations.adapters.implementations import get_adapter_registry as _get
    return _get()

