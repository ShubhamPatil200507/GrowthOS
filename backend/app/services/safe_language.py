import re
from typing import Dict, Any, List

PROHIBITED_PATTERNS = [
    (re.compile(r"will\s+definitely\s+(?:earn|increase|generate)", re.IGNORECASE), "has an estimated scenario potential to generate"),
    (re.compile(r"guaranteed\s+(?:revenue|return|profit|sales|outcome)", re.IGNORECASE), "estimated scenario opportunity"),
    (re.compile(r"you\s+will\s+earn\s+₹?(\d[\d,]*)", re.IGNORECASE), r"estimated scenario potential of ₹\1"),
    (re.compile(r"you\s+are\s+eligible\s+for\s+(?:a\s+)?loan", re.IGNORECASE), "explore potential credit eligibility options"),
    (re.compile(r"will\s+100%\s+succeed", re.IGNORECASE), "shows strong historical indicators in simulation"),
]

DISCLAIMER_TEXT = "These are scenario estimates based on synthetic historical data, not guaranteed outcomes."

class SafeLanguageService:
    @staticmethod
    def sanitize_text(text: str) -> str:
        """Sanitizes text to prevent false revenue promises or unauthorized credit claims."""
        if not text:
            return text
        sanitized = text
        for pattern, replacement in PROHIBITED_PATTERNS:
            sanitized = pattern.sub(replacement, sanitized)
        return sanitized

    @staticmethod
    def validate_opportunity_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
        """Ensures opportunity payload follows safety contract and disclaimers."""
        if "explanation" in payload and isinstance(payload["explanation"], str):
            payload["explanation"] = SafeLanguageService.sanitize_text(payload["explanation"])
        if "title" in payload and isinstance(payload["title"], str):
            payload["title"] = SafeLanguageService.sanitize_text(payload["title"])

        payload["disclaimer"] = DISCLAIMER_TEXT
        payload["is_simulation_estimate"] = True
        return payload

    @staticmethod
    def format_safe_response(content: str) -> Dict[str, Any]:
        """Wraps assistant response with compliance guarantees."""
        return {
            "text": SafeLanguageService.sanitize_text(content),
            "disclaimer": DISCLAIMER_TEXT,
            "is_guaranteed": False
        }
