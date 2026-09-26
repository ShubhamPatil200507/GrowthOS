import pytest
from app.services.safe_language import SafeLanguageService

def test_safe_language_normalizes_revenue_guarantees():
    raw_ai_output = "Revenue will definitely increase by ₹5,000 this week with this offer."
    sanitized = SafeLanguageService.sanitize_text(raw_ai_output)
    
    assert "will definitely increase" not in sanitized.lower()
    assert "estimated scenario potential" in sanitized.lower()

def test_safe_language_normalizes_guaranteed_revenue():
    raw_ai_output = "This action produces guaranteed revenue of ₹7,400."
    sanitized = SafeLanguageService.sanitize_text(raw_ai_output)
    
    assert "guaranteed revenue" not in sanitized.lower()
    assert "estimated scenario opportunity" in sanitized.lower()

def test_safe_language_blocks_credit_approval_claims():
    raw_ai_output = "Based on your sales, you are eligible for a loan of ₹50,000."
    sanitized = SafeLanguageService.sanitize_text(raw_ai_output)
    
    assert "you are eligible for a loan" not in sanitized.lower()
    assert "explore potential credit eligibility options" in sanitized.lower()

def test_opportunity_payload_contains_disclaimer():
    payload = {
        "title": "Afternoon Demand",
        "explanation": "Revenue will definitely increase with this test.",
        "estimated_opportunity": {"weekly_value": 2400.0}
    }
    validated = SafeLanguageService.validate_opportunity_payload(payload)
    
    assert "disclaimer" in validated
    assert "not guaranteed outcomes" in validated["disclaimer"]
    assert "will definitely increase" not in validated["explanation"]
