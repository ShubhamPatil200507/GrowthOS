from typing import Dict, Any
from app.integrations.adapters.base import (
    IntegrationStatus,
    SoundboxAdapter,
    WhatsAppAdapter,
    SettlementAdapter,
    CampaignAdapter
)

class SimulatedSoundboxAdapter(SoundboxAdapter):
    def get_status(self) -> Dict[str, Any]:
        return {
            "adapter_name": "Soundbox 4.0 Simulated Adapter",
            "device_id": "SB4-PUN-088",
            "connection_type": "4G VoLTE",
            "battery_level_pct": 78,
            "status": IntegrationStatus.SIMULATED,
            "message": "Browser Web Speech API fallback paired with local telemetry simulation"
        }

    def announce_payment(self, amount: float, currency: str = "INR") -> Dict[str, Any]:
        return {
            "status": "PLAYED",
            "device_id": "SB4-PUN-088",
            "text": f"Paytm par {int(amount)} rupaye prapt hue",
            "simulation": True
        }

    def announce_action_scheduled(self, message: str) -> Dict[str, Any]:
        return {
            "status": "CONFIRMED",
            "device_id": "SB4-PUN-088",
            "notification": f"Growth campaign active: {message}",
            "simulation": True
        }

class SimulatedWhatsAppAdapter(WhatsAppAdapter):
    def get_status(self) -> Dict[str, Any]:
        return {
            "adapter_name": "WhatsApp Business Messaging Adapter",
            "status": IntegrationStatus.SIMULATED,
            "template_name": "merchant_winback_v2",
            "message": "Template-based message generator with merchant consent enforcement"
        }

    def stage_customer_broadcast(self, target_segment: str, template_body: str) -> Dict[str, Any]:
        return {
            "status": "STAGED",
            "target_segment": target_segment,
            "template": template_body,
            "consent_verified": True,
            "adapter": "SimulatedWhatsAppAdapter",
            "notice": "Simulated dispatch; requires Meta WhatsApp Cloud API credentials in production."
        }

class SimulatedSettlementAdapter(SettlementAdapter):
    def get_status(self) -> Dict[str, Any]:
        return {
            "adapter_name": "Paytm Bank Settlement Reconciliation Adapter",
            "status": IntegrationStatus.SIMULATED,
            "protocol": "NPCI / Bank Auto-Settlement Feed",
            "message": "Reconciles daily midnight merchant batch with receiving bank UTR"
        }

    def get_settlement_reconciliation(self, merchant_id: str) -> Dict[str, Any]:
        return {
            "settlement_id": "SETTL_20260926_01",
            "settled_amount": 17840.0,
            "unsettled_batch": 580.0,
            "receiving_bank": "HDFC Bank (A/c •••• 4921)",
            "utr_number": "UTR260906304912",
            "settlement_time": "Today, 06:30 AM",
            "status": "RECONCILED",
            "integration_mode": IntegrationStatus.SIMULATED
        }

class SimulatedCampaignAdapter(CampaignAdapter):
    def get_status(self) -> Dict[str, Any]:
        return {
            "adapter_name": "Paytm for Business Campaign Adapter",
            "status": IntegrationStatus.INTEGRATION_READY,
            "message": "Registers dynamic UPI promotion rules on Paytm QR and Soundbox surfaces"
        }

    def register_campaign(self, campaign_payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "REGISTERED",
            "campaign_id": f"paytm_cmp_{campaign_payload.get('action_id', 'demo')[:8]}",
            "adapter": "SimulatedCampaignAdapter",
            "integration_mode": IntegrationStatus.INTEGRATION_READY
        }

class AdapterRegistry:
    def __init__(self):
        self.soundbox_adapter = SimulatedSoundboxAdapter()
        self.whatsapp_adapter = SimulatedWhatsAppAdapter()
        self.settlement_adapter = SimulatedSettlementAdapter()
        self.campaign_adapter = SimulatedCampaignAdapter()

_registry = AdapterRegistry()

def get_adapter_registry() -> AdapterRegistry:
    return _registry
