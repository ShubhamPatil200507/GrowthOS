# 📘 GrowthOS REST API Documentation

Base URL: `http://localhost:8000/api`

---

## 1. System & Health
### `GET /health`
Returns backend health status, active database dialect, and provider modes.

**Response:**
```json
{
  "status": "healthy",
  "app": "GrowthOS",
  "version": "1.0.0",
  "database": "sqlite",
  "providers": {
    "paytm": "MockPaytmProvider",
    "sarvam": "MockSarvamProvider",
    "cognee": "LocalMemoryProvider",
    "n8n": "LocalWorkflowExecutor"
  }
}
```

---

## 2. Merchant Telemetry
### `GET /merchant/dashboard`
Returns live KPI summary for the authenticated merchant persona.

**Response:**
```json
{
  "merchant_name": "Rajesh General Store",
  "category": "Grocery / Retail",
  "city": "Pune",
  "weekly_revenue": 142800.0,
  "today_revenue": 18420.0,
  "avg_ticket": 187.0,
  "repeat_rate_pct": 38.2,
  "weak_hours": "2:00 PM - 5:00 PM",
  "peak_hours": "6:00 PM - 9:00 PM",
  "total_discovered_opportunity": 7400.0
}
```

---

## 3. Opportunities & Growth Space
### `GET /opportunities`
Returns the 4 discovered opportunity vectors forming the ₹7,400 headroom.

**Response:**
```json
[
  {
    "id": "opp_afternoon_01",
    "category": "AFTERNOON_DEMAND",
    "title": "Convert 2-5 PM Weak Hours with Tea & Snack Combos",
    "estimated_value": 2400.0,
    "confidence_score": 0.88,
    "effort_level": "LOW",
    "evidence": "Sales drop to ₹480/hr between 2-5 PM compared to ₹2,800/hr peak.",
    "next_best_action": "15% off Tea+Samosa combo voucher on orders above ₹100"
  },
  {
    "id": "opp_dormant_02",
    "category": "DORMANT_CUSTOMERS",
    "title": "Reactivate 47 High-Value Regulars",
    "estimated_value": 2100.0,
    "confidence_score": 0.84,
    "effort_level": "LOW",
    "evidence": "47 regular customers inactive for >21 days with ₹312 past avg basket.",
    "next_best_action": "Disclose ₹30 welcome-back coupon via WhatsApp"
  },
  {
    "id": "opp_basket_03",
    "category": "BASKET_BUILDING",
    "title": "Co-Purchase Cross-Sell Bundling",
    "estimated_value": 1700.0,
    "confidence_score": 0.91,
    "effort_level": "MEDIUM",
    "evidence": "Tea + Samosa have 74% affinity; Dairy + Bread have 68% affinity.",
    "next_best_action": "Table-top QR prompt recommending complementary pairs"
  },
  {
    "id": "opp_weekend_04",
    "category": "WEEKEND_PROMOTION",
    "title": "Weekend Morning Household Staples Bundle",
    "estimated_value": 1200.0,
    "confidence_score": 0.82,
    "effort_level": "MEDIUM",
    "evidence": "Saturday/Sunday 8-11 AM sees surge in bulk pantry shoppers.",
    "next_best_action": "Offer flat ₹20 off pantry bundles > ₹300"
  }
]
```

---

## 4. Growth Plan Builder
### `POST /opportunities/growth-plan`
Synthesizes a prioritized multi-action plan targeting the merchant's target revenue goal.

**Request:**
```json
{
  "merchant_id": "MERCH_PUNE_001",
  "target_revenue_goal": 5000.0
}
```

**Response:**
```json
{
  "target_goal": 5000.0,
  "total_planned_value": 6200.0,
  "plan_status": "READY_FOR_APPROVAL",
  "actions": [
    {
      "action_id": "act_afternoon",
      "opportunity_id": "opp_afternoon_01",
      "title": "Launch Afternoon Tea & Snacks 15% Combo Voucher",
      "expected_uplift": 2400.0,
      "channels": ["Paytm Voucher", "Soundbox Audio", "Counter QR Standee"]
    },
    {
      "action_id": "act_dormant",
      "opportunity_id": "opp_dormant_02",
      "title": "WhatsApp ₹30 Win-Back Campaign for 47 Dormant Regulars",
      "expected_uplift": 2100.0,
      "channels": ["WhatsApp Business", "Paytm Voucher"]
    },
    {
      "action_id": "act_basket",
      "opportunity_id": "opp_basket_03",
      "title": "Affinity Cross-Sell Counter Display Collateral",
      "expected_uplift": 1700.0,
      "channels": ["Counter QR Display"]
    }
  ]
}
```

---

## 5. Human-in-the-Loop Actions & Execution
### `POST /actions/{id}/approve`
Records cryptographic merchant approval and dispatches the execution pipeline.

**Request:**
```json
{
  "action_id": "act_afternoon",
  "merchant_id": "MERCH_PUNE_001",
  "pin_verified": true
}
```

**Response:**
```json
{
  "approval_status": "APPROVED",
  "action_id": "act_afternoon",
  "dispatched_pipeline": {
    "engine": "N8N_OR_LOCAL_SIMULATOR",
    "stages": 6,
    "experiment_id": "exp_afternoon_01"
  }
}
```

---

## 6. What-If Simulator
### `POST /simulator/simulate`
Computes volume lift, margin preservation, and risk assessment based on merchant elasticity inputs.

**Request:**
```json
{
  "discount_pct": 15.0,
  "window_hours": 3,
  "min_cart": 100.0,
  "duration_days": 7
}
```

**Response:**
```json
{
  "projected_txns": 248,
  "incremental_txns": 36,
  "projected_gross_revenue": 5100.0,
  "projected_net_profit": 938.4,
  "net_margin_pct": 18.4,
  "risk_assessment": "LOW"
}
```
