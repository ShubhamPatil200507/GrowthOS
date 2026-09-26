from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.core.config import settings

class PaytmMerchantDataProvider(ABC):
    @abstractmethod
    def get_merchant_profile(self, merchant_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_transactions(self, merchant_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_settlements(self, merchant_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_authorized_customer_signals(self, merchant_id: str) -> Dict[str, Any]:
        pass

class PaytmActionProvider(ABC):
    @abstractmethod
    def create_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def schedule_offer(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def send_approved_notification(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        pass

class MockPaytmProvider(PaytmMerchantDataProvider, PaytmActionProvider):
    """
    High-fidelity mock adapter for Paytm for Business merchant integration.
    Clearly marked as synthetic demo provider.
    """
    def get_merchant_profile(self, merchant_id: str) -> Dict[str, Any]:
        return {
            "merchant_id": merchant_id,
            "business_name": "Rajesh General Store",
            "owner_name": "Rajesh Kumar",
            "category": "Retail / Grocery",
            "city": "Pune",
            "upi_vpa": "rajeshstore@paytm",
            "soundbox_device_id": "SBX_PUN_9921",
            "pos_machine_linked": True,
            "kyc_status": "VERIFIED_BUSINESS",
            "is_demo_data": True
        }

    def get_transactions(self, merchant_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        return []

    def get_settlements(self, merchant_id: str) -> Dict[str, Any]:
        return {
            "last_settled_amount": 17840.0,
            "settlement_time": "Today, 06:30 AM",
            "destination_bank": "State Bank of India (Ending in 4421)",
            "utr_number": "UTR994821048291",
            "status": "SETTLED"
        }

    def get_authorized_customer_signals(self, merchant_id: str) -> Dict[str, Any]:
        return {
            "total_authorized_shoppers_seen_30d": 1240,
            "dormant_count": 47,
            "high_affinity_pairs": ["Tea", "Samosa"]
        }

    def create_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "campaign_id": f"paytm_cmp_{payload.get('campaign_id', 'demo_123')}",
            "adapter": "MockPaytmProvider",
            "message": "Campaign queued for Paytm for Business merchant surface"
        }

    def schedule_offer(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "offer_id": f"paytm_ofr_{payload.get('approval_id', 'demo_ofr')}",
            "adapter": "MockPaytmProvider",
            "message": "Dynamic UPI discount rule registered on Paytm Soundbox and QR surface"
        }

    def send_approved_notification(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "message": "Merchant push notification dispatched through Paytm Merchant SDK"
        }

class PaytmApiProvider(PaytmMerchantDataProvider, PaytmActionProvider):
    """
    Production integration provider.
    Requires authorized Paytm Partner credentials, contractual data permissions,
    and enterprise gateway onboarding.
    """
    def __init__(self, client_id: str, client_secret: str, merchant_id: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.merchant_id = merchant_id
        self.base_url = "https://securegw.paytm.in/merchant-api/v1"

    def get_merchant_profile(self, merchant_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding and mutual TLS.")

    def get_transactions(self, merchant_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

    def get_settlements(self, merchant_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

    def get_authorized_customer_signals(self, merchant_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

    def create_campaign(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

    def schedule_offer(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

    def send_approved_notification(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError("Production Paytm API requires enterprise partner onboarding.")

def get_paytm_provider() -> PaytmMerchantDataProvider:
    """Returns active Paytm provider based on configuration."""
    if settings.PAYTM_CLIENT_ID and settings.PAYTM_CLIENT_SECRET:
        return PaytmApiProvider(settings.PAYTM_CLIENT_ID, settings.PAYTM_CLIENT_SECRET, settings.PAYTM_MERCHANT_ID)
    return MockPaytmProvider()
