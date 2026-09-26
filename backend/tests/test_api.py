from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["tagline"] == "From payment data to the next best action."

def test_demo_login():
    response = client.post("/api/auth/demo-login", json={"phone": "9876543210"})
    assert response.status_code == 200
    data = response.json()
    assert data["merchant_name"] == "Rajesh Kumar"
    assert data["city"] == "Pune"

def test_dashboard_api():
    response = client.get("/api/merchant/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["headline_metrics"]["today_sales"] == 18420.0
    assert data["headline_metrics"]["today_transactions"] == 96

def test_opportunities_api():
    response = client.get("/api/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert data["total_opportunity_space"]["value"] == 7400.0

def test_assistant_query_api():
    response = client.post("/api/assistant/query", json={"query": "Mujhe iss week ₹5,000 extra kamaana hai", "language": "hi"})
    assert response.status_code == 200
    data = response.json()
    assert "₹7,400" in data["explanation"] or "7,400" in data["explanation"]
    assert "growth_plan" in data

def test_simulator_calculate_api():
    response = client.post("/api/simulator/calculate", json={"discount_amount": 20, "target_hours": "14:00-17:00", "min_order": 200, "duration_days": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["simulated"]["transaction_lift_pct"] > 0
    assert data["simulated"]["net_revenue_lift_pct"] > 0
