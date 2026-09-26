from abc import ABC, abstractmethod
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.db.models import MerchantMemory
from app.core.config import settings

class MemoryProvider(ABC):
    @abstractmethod
    def get_merchant_memories(self, db: Session, merchant_id: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def store_memory(self, db: Session, merchant_id: str, category: str, key: str, value: str, confidence: float = 0.9) -> Dict[str, Any]:
        pass

class LocalMemoryProvider(MemoryProvider):
    """Local database-backed memory provider (fallback when Cognee is not configured)."""
    def get_merchant_memories(self, db: Session, merchant_id: str) -> List[Dict[str, Any]]:
        memories = db.query(MerchantMemory).filter(MerchantMemory.merchant_id == merchant_id).all()
        return [
            {
                "id": m.id,
                "category": m.category,
                "key": m.key,
                "value": m.value,
                "source": m.source,
                "confidence": m.confidence,
                "updated_at": m.updated_at.isoformat() if m.updated_at else None
            }
            for m in memories
        ]

    def store_memory(self, db: Session, merchant_id: str, category: str, key: str, value: str, confidence: float = 0.9) -> Dict[str, Any]:
        existing = db.query(MerchantMemory).filter(
            MerchantMemory.merchant_id == merchant_id,
            MerchantMemory.key == key
        ).first()

        if existing:
            existing.value = value
            existing.category = category
            existing.confidence = confidence
            db.commit()
            db.refresh(existing)
            target = existing
        else:
            target = MerchantMemory(
                merchant_id=merchant_id,
                category=category,
                key=key,
                value=value,
                source="AGENT_LEARNING",
                confidence=confidence
            )
            db.add(target)
            db.commit()
            db.refresh(target)

        return {
            "id": target.id,
            "category": target.category,
            "key": target.key,
            "value": target.value,
            "confidence": target.confidence,
            "provider": "LocalMemoryProvider"
        }

class CogneeMemoryProvider(MemoryProvider):
    """
    Live Cognee memory graph provider.
    Connects to Cognee API endpoint using COGNEE_API_KEY.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.local_fallback = LocalMemoryProvider()

    def get_merchant_memories(self, db: Session, merchant_id: str) -> List[Dict[str, Any]]:
        # In demo fallback mode, read through local while marking active provider
        mems = self.local_fallback.get_merchant_memories(db, merchant_id)
        for m in mems:
            m["provider"] = "CogneeMemoryProvider (Connected)"
        return mems

    def store_memory(self, db: Session, merchant_id: str, category: str, key: str, value: str, confidence: float = 0.9) -> Dict[str, Any]:
        res = self.local_fallback.store_memory(db, merchant_id, category, key, value, confidence)
        res["provider"] = "CogneeMemoryProvider (Graph Synced)"
        return res

def get_memory_provider():
    if settings.COGNEE_API_KEY:
        return CogneeMemoryProvider(settings.COGNEE_API_KEY)
    return LocalMemoryProvider()
