from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings

class SpeechToTextProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN") -> Dict[str, Any]:
        pass

class TranslationProvider(ABC):
    @abstractmethod
    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        pass

class TextToSpeechProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str, language_code: str = "hi-IN") -> Dict[str, Any]:
        pass

class MockSarvamProvider(SpeechToTextProvider, TranslationProvider, TextToSpeechProvider):
    """
    Local mock provider for Sarvam AI speech and Indic language capabilities.
    Works deterministically without external credentials.
    """
    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN") -> Dict[str, Any]:
        # Realistic transcription for common demo phrases
        return {
            "transcript": "Mujhe iss week ₹5,000 extra kamaana hai",
            "language_detected": language_code,
            "confidence": 0.96,
            "provider": "MockSarvamProvider"
        }

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        translations = {
            "Mujhe iss week ₹5,000 extra kamaana hai": "I want to earn an extra ₹5,000 this week",
            "Meri sales kyu gir rahi hai?": "Why are my sales declining?",
            "Kal sales kaise badhau?": "How do I increase sales tomorrow?"
        }
        return translations.get(text, text)

    async def synthesize(self, text: str, language_code: str = "hi-IN") -> Dict[str, Any]:
        return {
            "audio_url": "/static/audio_sample_hindi.mp3",
            "text": text,
            "language": language_code,
            "provider": "MockSarvamProvider"
        }

class SarvamProvider(SpeechToTextProvider, TranslationProvider, TextToSpeechProvider):
    """
    Live Sarvam AI integration provider using SARVAM_API_KEY.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.sarvam.ai"

    async def transcribe(self, audio_bytes: bytes, language_code: str = "hi-IN") -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            headers = {"api-subscription-key": self.api_key}
            files = {"file": ("audio.wav", audio_bytes, "audio/wav")}
            data = {"language_code": language_code, "model": "saarika:v1"}
            response = await client.post(f"{self.base_url}/speech-to-text", headers=headers, files=files, data=data)
            response.raise_for_status()
            return response.json()

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        async with httpx.AsyncClient() as client:
            headers = {"api-subscription-key": self.api_key, "Content-Type": "application/json"}
            payload = {
                "input": text,
                "source_language_code": source_lang,
                "target_language_code": target_lang,
                "speaker_gender": "Male",
                "mode": "formal"
            }
            response = await client.post(f"{self.base_url}/translate", headers=headers, json=payload)
            response.raise_for_status()
            return response.json().get("translated_text", text)

    async def synthesize(self, text: str, language_code: str = "hi-IN") -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            headers = {"api-subscription-key": self.api_key, "Content-Type": "application/json"}
            payload = {
                "inputs": [text],
                "target_language_code": language_code,
                "speaker": "meera",
                "pitch": 0,
                "pace": 1.0
            }
            response = await client.post(f"{self.base_url}/text-to-speech", headers=headers, json=payload)
            response.raise_for_status()
            return response.json()

def get_sarvam_provider():
    if settings.SARVAM_API_KEY:
        return SarvamProvider(settings.SARVAM_API_KEY)
    return MockSarvamProvider()
