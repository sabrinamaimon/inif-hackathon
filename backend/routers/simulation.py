from fastapi import APIRouter
from typing import Dict, Any, List
from models.schemas import SimulationState
from routers.alerts import alerts_store

router = APIRouter(prefix="/api/simulation", tags=["Scenario Simulation"])

current_sim_state = {
    "rain_active": False,
    "rush_hour_active": False,
    "blocked_hubs": [],
    "waterlogged_hubs": []
}

@router.get("/state", response_model=SimulationState)
def get_simulation_state():
    """Returns current active scenario simulation toggles"""
    return SimulationState(**current_sim_state)

@router.post("/trigger", response_model=SimulationState)
def trigger_scenario(payload: Dict[str, Any]):
    """
    Scenario Simulation Controls:
    - action: 'toggle_rain', 'toggle_rush', 'block_hub', 'waterlog_hub', 'reset'
    """
    action = payload.get("action")
    target_hub = payload.get("hub")

    if action == "toggle_rain":
        current_sim_state["rain_active"] = not current_sim_state["rain_active"]
        if current_sim_state["rain_active"] and "Malibagh" not in current_sim_state["waterlogged_hubs"]:
            current_sim_state["waterlogged_hubs"].append("Malibagh")
    elif action == "toggle_rush":
        current_sim_state["rush_hour_active"] = not current_sim_state["rush_hour_active"]
    elif action == "block_hub" and target_hub:
        if target_hub in current_sim_state["blocked_hubs"]:
            current_sim_state["blocked_hubs"].remove(target_hub)
        else:
            current_sim_state["blocked_hubs"].append(target_hub)
    elif action == "waterlog_hub" and target_hub:
        if target_hub in current_sim_state["waterlogged_hubs"]:
            current_sim_state["waterlogged_hubs"].remove(target_hub)
        else:
            current_sim_state["waterlogged_hubs"].append(target_hub)
    elif action == "reset":
        current_sim_state["rain_active"] = False
        current_sim_state["rush_hour_active"] = False
        current_sim_state["blocked_hubs"] = []
        current_sim_state["waterlogged_hubs"] = []

    return SimulationState(**current_sim_state)
