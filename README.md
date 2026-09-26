# 🚀 GrowthOS — AI Business Partner for Paytm Merchants

> **"From payment data to the next best action."**  
> An AI-powered merchant partner that continuously analyzes authorized merchant data, detects revenue/operational opportunities, recommends the next best action, requires merchant approval, executes approved multi-channel workflows, measures outcomes, and learns from previous experiments.

[![Prototype](https://img.shields.io/badge/Prototype-Synthetic%20Merchant%20Data-blue.svg)](#)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black.svg)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Paytm%20Cyan%20%26%20Navy-00BAF2.svg)](#)

---

## ⚠️ Hackathon Evaluation Disclaimer
> **Prototype Note**: GrowthOS uses synthetic merchant data generated for evaluation and prototype demonstration purposes. It does not access private Paytm production user data without authorization. Provider abstractions are used to demonstrate how real Paytm APIs (Soundbox, Merchant Dashboard, EDC) integrate into an autonomous loop.

---

## 🎯 The Core Closed Loop

GrowthOS is not a generic chatbot and not a passive dashboard. It implements the autonomous business loop:

```
OBSERVE ➔ DETECT ➔ REASON ➔ RECOMMEND ➔ APPROVE ➔ EXECUTE ➔ MEASURE ➔ LEARN
```

1. **OBSERVE**: Continuously ingests Paytm payment telemetry (QR, Soundbox, card, time of day, basket size, repeat frequency).
2. **DETECT**: Identifies latent revenue headroom (e.g. 2-5 PM afternoon lull, 47 dormant regulars, basket cross-sells).
3. **REASON**: Mathematical elasticity simulation across 8 specialized domain agents.
4. **RECOMMEND**: Formulates a prioritized 3-action growth plan targeting the merchant's stated revenue goal.
5. **APPROVE**: Strict Human-in-the-Loop gate. AI **never** acts unilaterally.
6. **EXECUTE**: 6-stage automated dispatch via n8n adapter, Paytm Soundbox voice announcements, WhatsApp vouchers, and QR flyers.
7. **MEASURE**: Tracks active 7-day experiment against pre-experiment baseline (+17% transactions, +₹5,100 revenue, +9% profit).
8. **LEARN**: Epistemic & episodic memory stored in Cognee knowledge graph to refine future recommendations.

---

## 👥 Persona: Rajesh General Store, Pune

- **Merchant**: Rajesh Kumar
- **Store**: Rajesh General Store, Kothrud, Pune
- **Type**: Grocery / Daily Retail
- **Weekly Volume**: ₹142,800 (~₹20,400/day)
- **Average Basket**: ₹187
- **Peak Hours**: 6:00 PM – 9:00 PM
- **Lull Hours**: 2:00 PM – 5:00 PM (Sales drop to ₹480/hr)
- **Primary Journey Query**: *"Mujhe iss week ₹5,000 extra kamaana hai"* (I want to earn an extra ₹5,000 this week).

---

## 🏗️ Architecture

GrowthOS is structured into 5 decoupled, production-grade layers:

```
┌────────────────────────────────────────────────────────┐
│  1. Merchant Touchpoints (Voice, Soundbox, Web App)     │
│     • Hinglish/Hindi Voice (Sarvam AI multimodal suite)│
│     • Mobile-First Responsive PWA (Paytm-inspired UI)  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  2. 8-Agent Specialized Intelligence Orchestrator       │
│     • Context Agent • Analytics Engine • Opportunity   │
│     • Customer RFM  • Action Planner   • Experiment    │
│     • Safe Language Guardrail • Cognitive Memory       │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  3. Governance & Human-in-the-Loop Gateway              │
│     • Safe Language Filter (Zero revenue guarantees)   │
│     • Cryptographic Merchant Approval Gate             │
│     • Immutable Audit Logging                          │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  4. Execution Pipeline (n8n & Provider Adapters)       │
│     • Paytm Voucher Generator ('AFTERNOON15')          │
│     • Paytm Soundbox IoT Voice Announcer (Sarvam TTS)  │
│     • WhatsApp Direct Campaign (47 Dormant Regulars)   │
│     • Counter QR Standee Collateral Builder            │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│  5. Data & Cognitive Memory Layer                      │
│     • SQLAlchemy / SQLite / PostgreSQL                 │
│     • Cognee Knowledge Graph (Affinity & Episodic)     │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Quickstart (Running Locally)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Git

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Seed 9,399 synthetic transactions, 1,600 customers, and opportunities:
python scripts/seed_demo_data.py

# Run backend tests (17 passing tests):
pytest -v tests/

# Start FastAPI server on port 8000:
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎬 10-Step Interactive Jury Walkthrough

Navigate to `/demo` or click **"10-Step Demo"** in the navigation bar to experience the scripted end-to-end journey:

1. **Observe**: Rajesh's baseline telemetry (₹142.8k/wk, 2-5 PM lull).
2. **Input**: Merchant speaks: *"Mujhe iss week ₹5,000 extra kamaana hai"*.
3. **Detect**: System uncovers ₹7,400 opportunity space across 4 vectors.
4. **Recommend**: Formulates a prioritized 3-action plan to hit the ₹5,000 target.
5. **Reason**: Interactive what-if scenario simulator for discount and margin elasticity.
6. **Approve**: Merchant reviews safety bounds and provides explicit approval.
7. **Execute**: Live 6-stage stepper dispatching across Paytm Soundbox and WhatsApp.
8. **Measure (Live)**: Active 7-day experiment tracked with baseline comparisons.
9. **Measure (Result)**: Verified +17% transactions, +₹5,100 revenue, +9% net profit.
10. **Learn**: Campaign insights committed into Cognee long-term merchant memory graph.

---

## 🔒 Security & Compliance Guardrails

- **Zero PII Exposure**: Customer data is aggregated and hashed; raw customer phone numbers and names are never leaked to LLMs or UI.
- **Safe Language Engine**: Rewrites prohibited promises ("guaranteed ₹5,000 profit") into scenario-based bounds ("estimated ₹2,400 to ₹3,100 headroom under optimal redemption").
- **Human-in-the-Loop**: Autonomous execution is blocked until a signed merchant approval event is registered.
