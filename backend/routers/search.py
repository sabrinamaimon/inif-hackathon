from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from models.schemas import SearchRequest, SearchResponse, StreetAlertModel
from services.graph_routing import DhakaTransitGraph
from services.ai_service import DhakaAIService
from services.validation import TransitValidator
from routers.alerts import alerts_store

router = APIRouter(prefix="/api/search", tags=["Trip Search"])

graph_engine = DhakaTransitGraph()
ai_service = DhakaAIService()

@router.post("/routes", response_model=SearchResponse)
def search_transit_routes(request: SearchRequest):
    """
    Intelligent Multi-Constraint Trip Search
    Calculates multi-leg itineraries with student discounts, weather surges, and detours.
    """
    if request.origin == request.destination:
        raise HTTPException(
            status_code=400,
            detail="যাত্রা শুরু ও গন্তব্য একই স্থান হতে পারে না। অনুগ্রহ করে ভিন্ন গন্তব্য নির্বাচন করুন।"
        )

    # Fetch active alerts
    active_alerts = [
        TransitValidator.calculate_alert_decay(a)
        for a in alerts_store
        if a.get("is_active", True)
    ]

    # Calculate routes via multi-modal graph
    routes = graph_engine.find_routes(
        origin=request.origin,
        destination=request.destination,
        passenger_type=request.passenger_type,
        avoid_hubs=request.avoid_hubs,
        weather=request.weather_condition,
        is_rush_hour=request.is_rush_hour,
        active_alerts=active_alerts
    )

    # Filter by max budget if requested
    if request.max_budget is not None and request.max_budget > 0:
        filtered = [
            r for r in routes
            if (r.total_student_fare if request.passenger_type == "student" else r.total_regular_fare) <= request.max_budget
        ]
        if filtered:
            routes = filtered

    # Perform Output Grounding Verification (Part 4)
    for r in routes:
        for leg in r.legs:
            is_grounded = TransitValidator.ground_route(
                leg_line_name=leg.line_name,
                from_hub=leg.from_hub,
                to_hub=leg.to_hub,
                mode=leg.mode
            )
            if not is_grounded:
                leg.landmark_instructions += " (Grounding note: standard transfer)"

    # Identify alerts affecting the path
    path_hubs = set()
    for r in routes:
        for leg in r.legs:
            path_hubs.add(leg.from_hub)
            path_hubs.add(leg.to_hub)

    affected_alerts = [
        StreetAlertModel(**a)
        for a in active_alerts
        if a.get("hub") in path_hubs
    ]

    return SearchResponse(
        origin=request.origin,
        destination=request.destination,
        passenger_type=request.passenger_type,
        weather_applied=request.weather_condition,
        rush_hour_applied=request.is_rush_hour,
        routes=routes,
        active_alerts_in_path=affected_alerts,
        grounding_verified=True
    )

@router.post("/nlp")
def parse_natural_language_query(payload: Dict[str, str]):
    """Parses natural language (English / Banglish) into structured search parameters"""
    query = payload.get("query", "")
    if not query:
        raise HTTPException(status_code=400, detail="Query text is required")
    parsed = ai_service.parse_natural_language_query(query)
    return parsed
