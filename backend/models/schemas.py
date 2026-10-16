from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HubModel(BaseModel):
    id: str
    name: str
    name_bn: str
    lat: float
    lng: float
    landmarks: List[str]
    is_metro_station: bool
    metro_station_code: Optional[str] = None
    zone: str

class TransitRouteModel(BaseModel):
    id: str
    name: str
    name_bn: str
    type: str  # metro, bus, leguna, rickshaw
    operator: str
    color: str
    student_pass_allowed: bool
    frequency_mins: int
    hubs: List[str]
    landmark_instructions: str

class StreetAlertModel(BaseModel):
    id: str
    hub: str
    type: str  # waterlogging, blockade, gridlock, construction
    title: str
    title_bn: str
    description: str
    severity: int  # 0 to 100
    affected_modes: List[str]
    upvotes: int = 1
    downvotes: int = 0
    verified: bool = False
    minutes_ago: int = 0
    is_active: bool = True
    trust_score: float = 80.0

class AlertCreateRequest(BaseModel):
    hub: str
    type: str
    title: str
    description: str
    severity: int = 70
    affected_modes: List[str] = ["bus", "rickshaw"]

class AlertVoteRequest(BaseModel):
    alert_id: str
    vote_type: str  # "upvote" or "downvote"

class SearchRequest(BaseModel):
    origin: str
    destination: str
    passenger_type: str = "general"  # "general" or "student"
    avoid_hubs: List[str] = []
    max_budget: Optional[float] = None
    weather_condition: str = "normal"  # "normal", "rain", "heavy_monsoon"
    is_rush_hour: bool = False

class RouteLeg(BaseModel):
    leg_number: int
    mode: str  # metro, bus, leguna, rickshaw, walk
    line_name: str
    from_hub: str
    to_hub: str
    distance_km: float
    duration_mins: int
    regular_fare_bdt: int
    student_fare_bdt: int
    surge_multiplier: float = 1.0
    landmark_instructions: str
    is_affected_by_alert: bool = False

class RouteOption(BaseModel):
    id: str
    title: str
    title_bn: str
    type_badge: str  # "Fastest", "Cheapest", "Student Pick", "Rain Detour"
    total_duration_mins: int
    total_regular_fare: int
    total_student_fare: int
    transfers: int
    legs: List[RouteLeg]
    is_recommended: bool = False
    is_detour: bool = False
    disruption_warning: Optional[str] = None

class SearchResponse(BaseModel):
    origin: str
    destination: str
    passenger_type: str
    weather_applied: str
    rush_hour_applied: bool
    routes: List[RouteOption]
    active_alerts_in_path: List[StreetAlertModel] = []
    grounding_verified: bool = True

class SimulationState(BaseModel):
    rain_active: bool = False
    rush_hour_active: bool = False
    blocked_hubs: List[str] = []
    waterlogged_hubs: List[str] = []

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, str]] = []
    passenger_type: str = "general"
    current_location: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    reply_bn: Optional[str] = None
    structured_route: Optional[RouteOption] = None
    action_type: Optional[str] = None  # "route_found", "alert_submitted", "fare_info", "general"

class RideSharePost(BaseModel):
    id: str
    hub_origin: str
    destination: str
    vehicle_type: str  # "rickshaw" or "cng"
    total_fare_bdt: int
    seats_available: int
    seats_taken: int
    host_name: str
    contact_phone: str
    departure_time: str
    split_fare_per_person: int
    notes: Optional[str] = None

class CreateRideShareRequest(BaseModel):
    hub_origin: str
    destination: str
    vehicle_type: str
    seats_available: int
    host_name: str
    contact_phone: str
    notes: Optional[str] = None

class FareCalculateRequest(BaseModel):
    origin: str
    destination: str
    distance_km: Optional[float] = None
    passenger_type: str = "general"  # "general" or "student"
    card_type: str = "single_journey"  # "single_journey" or "mrt_pass"
    weather_condition: str = "normal"
    is_rush_hour: bool = False

