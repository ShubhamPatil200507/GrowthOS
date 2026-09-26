from typing import Dict, Any
import httpx
from app.core.config import settings

class LocalWorkflowExecutor:
    """Deterministic local simulator for workflow automation when n8n is offline."""
    @staticmethod
    def execute(payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "execution_engine": "DEMO_SIMULATOR",
            "execution_id": f"sim_wf_{payload.get('approval_id', 'local_exec_99')}",
            "steps_completed": [
                "Opportunity selected and parameters validated",
                "Target customer segment query materialized",
                "Offer payload compiled and digitally signed",
                "Action scheduled on merchant surface",
                "Experiment tracking telemetry activated"
            ],
            "details": payload,
            "message": "Workflow successfully simulated by LocalWorkflowExecutor"
        }

class N8nWebhookAdapter:
    """Live n8n webhook dispatcher."""
    @staticmethod
    async def dispatch(payload: Dict[str, Any]) -> Dict[str, Any]:
        if not settings.N8N_WEBHOOK_URL:
            return LocalWorkflowExecutor.execute(payload)

        headers = {"Content-Type": "application/json"}
        if settings.N8N_API_KEY:
            headers["X-N8N-API-KEY"] = settings.N8N_API_KEY

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.post(
                    settings.N8N_WEBHOOK_URL,
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                return {
                    "status": "SUCCESS",
                    "execution_engine": "N8N",
                    "response": response.json() if response.headers.get("content-type") == "application/json" else response.text,
                    "message": "Workflow dispatched to external n8n engine"
                }
            except Exception as e:
                # Fallback to local simulator on connection failure
                res = LocalWorkflowExecutor.execute(payload)
                res["fallback_reason"] = f"n8n webhook unreachable ({str(e)}), executed via LocalWorkflowExecutor"
                return res
