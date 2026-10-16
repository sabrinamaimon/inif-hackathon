import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any, List, Optional
from models.schemas import ChatRequest, ChatResponse, RideSharePost, CreateRideShareRequest
from services.ai_service import DhakaAIService
from services.graph_routing import DhakaTransitGraph
from routers.simulation import current_sim_state
from routers.alerts import alerts_store

router = APIRouter(prefix="/api", tags=["Conversational AI & Bonus Modules"])

ai_service = DhakaAIService()
graph_engine = DhakaTransitGraph()

# Seed Ride-Share Pool (Bonus Task 3)
rideshare_posts: List[Dict[str, Any]] = [
    {
        "id": "ride-001",
        "hub_origin": "Farmgate",
        "destination": "Dhanmondi",
        "vehicle_type": "rickshaw",
        "total_fare_bdt": 60,
        "seats_available": 1,
        "seats_taken": 1,
        "host_name": "Sadia (DU Student)",
        "contact_phone": "01711-234567",
        "departure_time": "Now (Next 10 mins)",
        "split_fare_per_person": 30,
        "notes": "Waiting near Ananda Cinema foot-overbridge. Need 1 co-rider to split rickshaw."
    },
    {
        "id": "ride-002",
        "hub_origin": "Agargaon",
        "destination": "Mohakhali",
        "vehicle_type": "cng",
        "total_fare_bdt": 200,
        "seats_available": 2,
        "seats_taken": 2,
        "host_name": "Fahim (Office Commuter)",
        "contact_phone": "01822-987654",
        "departure_time": "6:15 PM",
        "split_fare_per_person": 67,
        "notes": "CNG heading to Mohakhali Wireless. Metro gate 2 pickup."
    }
]

@router.post("/chat", response_model=ChatResponse)
def chat_with_commute_assistant(request: ChatRequest):
    """
    Part 5: Conversational Commute Assistant
    Supports natural language and Banglish for route queries, fare checks, and alert submissions.
    """
    reply_data = ai_service.generate_chat_reply(
        message=request.message,
        conversation_history=request.conversation_history,
        current_state=current_sim_state
    )

    structured_route = None
    if reply_data.get("action_type") == "route_found" and "extracted_query" in reply_data:
        eq = reply_data["extracted_query"]
        routes = graph_engine.find_routes(
            origin=eq.get("origin", "Farmgate"),
            destination=eq.get("destination", "Motijheel"),
            passenger_type=request.passenger_type,
            weather="rain" if current_sim_state["rain_active"] else "normal",
            is_rush_hour=current_sim_state["rush_hour_active"],
            active_alerts=alerts_store
        )
        if routes:
            structured_route = routes[0]

    return ChatResponse(
        reply=reply_data["reply"],
        reply_bn=reply_data.get("reply_bn"),
        structured_route=structured_route,
        action_type=reply_data.get("action_type")
    )

@router.post("/bonus/digitize-signboard")
async def digitize_bus_signboard(file: Optional[UploadFile] = File(None)):
    """
    Bonus Task 1: Signboard & Notice Digitization
    Uploads a photo of a local bus signboard or printed fare chart to extract structured data.
    """
    contents = None
    filename = ""
    if file:
        contents = await file.read()
        filename = file.filename or ""

    result = ai_service.digitize_signboard(image_data=contents, filename=filename)
    return result

@router.get("/bonus/rideshare", response_model=List[RideSharePost])
def get_rideshares():
    """Bonus Task 3: Ride-Share board for commuters splitting rickshaws/CNGs"""
    return [RideSharePost(**p) for p in rideshare_posts]

@router.post("/bonus/rideshare", response_model=RideSharePost)
def create_rideshare(request: CreateRideShareRequest):
    """Post a new ride-share invitation at a transit hub"""
    total_est = 60 if request.vehicle_type == "rickshaw" else 200
    total_people = request.seats_available + 1
    split_fare = int(round(total_est / total_people))

    new_post = {
        "id": f"ride-{uuid.uuid4().hex[:6]}",
        "hub_origin": request.hub_origin,
        "destination": request.destination,
        "vehicle_type": request.vehicle_type,
        "total_fare_bdt": total_est,
        "seats_available": request.seats_available,
        "seats_taken": 1,
        "host_name": request.host_name,
        "contact_phone": request.contact_phone,
        "departure_time": "In 10 mins",
        "split_fare_per_person": split_fare,
        "notes": request.notes
    }
    rideshare_posts.insert(0, new_post)
    return RideSharePost(**new_post)
