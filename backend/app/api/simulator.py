from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.services.growth_simulator import GrowthSimulator

router = APIRouter(prefix="/simulator", tags=["Growth Simulator"])

class SimulationRequest(BaseModel):
    discount_amount: float = 20.0
    target_hours: str = "14:00-17:00"
    min_order: float = 200.0
    duration_days: int = 3

@router.post("/calculate")
def run_simulation(req: SimulationRequest):
    result = GrowthSimulator.simulate(
        discount_amount=req.discount_amount,
        target_hours=req.target_hours,
        min_order=req.min_order,
        duration_days=req.duration_days
    )
    return result
