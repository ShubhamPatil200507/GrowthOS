# 🔌 Paytm for Business Integration Architecture

This document details how GrowthOS connects with real Paytm merchant hardware, telemetry streams, and payment services, contrasting the prototype implementation with production deployment.

---

## 1. Overview of Provider Abstractions

To ensure zero dependencies on external paid API keys while remaining 100% production-ready, GrowthOS uses **Provider Interfaces**:

```python
class PaytmMerchantDataProvider(ABC):
    @abstractmethod
    async def get_hourly_telemetry(self, merchant_id: str, date_range: Tuple[date, date]) -> List[HourlySales]:
        pass

    @abstractmethod
    async def get_customer_cohorts(self, merchant_id: str) -> List[CustomerCohort]:
        pass

class PaytmActionProvider(ABC):
    @abstractmethod
    async def create_voucher(self, merchant_id: str, voucher_data: VoucherCreateRequest) -> VoucherResponse:
        pass

    @abstractmethod
    async def broadcast_soundbox_prompt(self, device_id: str, audio_url: str) -> SoundboxBroadcastResponse:
        pass
```

---

## 2. Prototype vs Production Comparison

| Feature | Prototype Mode (`MockPaytmProvider`) | Production Mode (`PaytmApiProvider`) |
| :--- | :--- | :--- |
| **Merchant Telemetry** | 9,399 deterministic synthetic transactions with authentic Indian retail seasonality | Paytm Merchant Dashboard APIs (`/v1/merchant/reports/transactions`) |
| **Paytm Soundbox** | Audio player simulation + Sarvam TTS preview | Paytm IoT Soundbox MQTT / Push Audio Notification API |
| **Paytm QR Vouchers** | Generates deterministic voucher codes (`AFTERNOON15`) | Paytm Merchant Deals & Dynamic QR Voucher Engine (`/v2/deals/create`) |
| **Customer Identification**| Hashed pseudo-tokens representing 1,600 loyalty customers | Paytm Merchant CRM / Loyalty tokenized identifiers (Zero PII) |
| **Point of Sale (EDC)** | Emulated terminal state | Paytm Smart POS Android SDK integration |

---

## 3. Real-Time Telemetry Flow (Production)

```
[Customer Scans Paytm QR at Store]
            │
            ▼
[Paytm Payment Gateway / Soundbox IoT]
            │ (Webhook Notification)
            ▼
[GrowthOS Webhook Ingestion Layer]
            │
    ┌───────┴───────────────────────┐
    ▼                               ▼
[Store Audio Broadcast]     [Hourly Telemetry Aggregator]
("Paytm par ₹120 prapt hue")        │
                                    ▼
                        [Analytics & Lull Detection]
                                    │
                                    ▼
                        [Opportunity Discovery Engine]
```
