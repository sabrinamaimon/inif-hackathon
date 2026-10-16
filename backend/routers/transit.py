import math
from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from data.dhaka_transit_data import (
    DHAKA_HUBS, 
    TRANSIT_ROUTES, 
    TRANSIT_EDGES,
    MRT6_STATIONS_LIST,
    MRT6_FULL_STATION_FARE_MATRIX
)
from models.schemas import HubModel, TransitRouteModel, FareCalculateRequest
from services.fare_engine import DhakaFareEngine, LOCAL_BUSES_DATA

router = APIRouter(prefix="/api/transit", tags=["Transit CMS & Fare Engine"])

# In-memory store for dynamic additions during the session
routes_store = list(TRANSIT_ROUTES)

def _estimate_distance(u: str, v: str) -> float:
    """Returns distance between u and v from TRANSIT_EDGES or coordinates"""
    if (u, v) in TRANSIT_EDGES:
        return TRANSIT_EDGES[(u, v)]["distance_km"]
    if (v, u) in TRANSIT_EDGES:
        return TRANSIT_EDGES[(v, u)]["distance_km"]
    
    if u in DHAKA_HUBS and v in DHAKA_HUBS:
        lat1, lon1 = DHAKA_HUBS[u]["lat"], DHAKA_HUBS[u]["lng"]
        lat2, lon2 = DHAKA_HUBS[v]["lat"], DHAKA_HUBS[v]["lng"]
        # Haversine formula
        r = 6371.0
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        a = math.sin(delta_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(r * c * 1.35, 1)  # 1.35 road winding factor in Dhaka
    
    return 5.0

@router.get("/hubs", response_model=Dict[str, HubModel])
def get_all_hubs():
    """Returns the 14 major Dhaka transit hubs with coordinates, landmarks, and zones"""
    return {k: HubModel(**v) for k, v in DHAKA_HUBS.items()}

@router.get("/routes", response_model=List[TransitRouteModel])
def get_all_routes():
    """Returns all active transit routes (Metro, Buses, Leguna, Rickshaw)"""
    return [TransitRouteModel(**r) for r in routes_store]

@router.post("/routes", response_model=TransitRouteModel)
def add_new_route(new_route: TransitRouteModel):
    """Admin CMS endpoint to publish a new transit link"""
    route_dict = new_route.dict()
    routes_store.append(route_dict)
    return new_route

@router.post("/fare/calculate")
def calculate_fare(req: FareCalculateRequest):
    """
    Official Multi-Modal Fare Calculation Engine:
    - Bus: BRTA Gazette Rate (2.70 BDT/km, min 10 BDT, 50% student discount)
    - Metro: DMTCL Official Chart (17 stations, 20-100 BDT, MRT Pass 10% discount, NO student discount)
    - Leguna: Fixed corridor rates (15-30 BDT)
    - Rickshaw: Distance base + weather/rush surges
    - Lists direct local buses connecting origin and destination
    """
    dist = req.distance_km if req.distance_km and req.distance_km > 0 else _estimate_distance(req.origin, req.destination)
    
    breakdown = DhakaFareEngine.calculate_multimodal_breakdown(
        from_hub=req.origin,
        to_hub=req.destination,
        distance_km=dist,
        weather=req.weather_condition,
        is_rush_hour=req.is_rush_hour,
        passenger_type=req.passenger_type,
        card_type=req.card_type
    )
    return breakdown

@router.get("/fare/metro-chart")
def get_metro_fare_chart():
    """
    Returns official DMTCL MRT Line-6 Fare Chart:
    - Complete 17-station list (Uttara North to Kamalapur)
    - Full 17x17 station-to-station fare matrix
    - MRT Pass / Rapid Pass 10% discount rules
    - Ticket validity (100 mins inside paid area) and exemption policies
    """
    matrix_formatted = [
        {"from": u, "to": v, "fare_bdt": fare, "mrt_pass_fare_bdt": int(math.ceil(fare * 0.90))}
        for (u, v), fare in MRT6_FULL_STATION_FARE_MATRIX.items()
    ]
    return {
        "authority": "Dhaka Mass Transit Company Limited (DMTCL)",
        "ministry": "Road Transport and Highways Division",
        "line": "MRT Line-6",
        "minimum_fare_bdt": 20,
        "maximum_fare_bdt": 100,
        "ticket_validity_minutes": 100,
        "discounts": {
            "mrt_pass_rapid_pass": "10% discount on every journey",
            "disabled_freedom_fighters": "Free with valid ID",
            "children_under_90cm": "Free with guardian",
            "special_needs": "15% discount with valid ID",
            "student_half_pass": "NOT applicable on MRT-6"
        },
        "stations_count": len(MRT6_STATIONS_LIST),
        "stations": MRT6_STATIONS_LIST,
        "fare_matrix": matrix_formatted
    }

@router.get("/fare/bus-chart")
def get_bus_fare_chart():
    """
    Returns official BRTA Dhaka Metro Committee Bus Fare rules & benchmark table:
    - Official rate: 2.70 BDT per passenger per km
    - Statutory minimum fare floor: 10.00 BDT
    - Student half-pass discount: 50% discount with 10 BDT minimum floor
    """
    table_formatted = [
        {"from": u, "to": v, "regular_fare_bdt": fare, "student_fare_bdt": max(10, int(math.ceil(fare * 0.50)))}
        for (u, v), fare in DhakaFareEngine.OFFICIAL_BUS_FARE_TABLE.items()
    ]
    return {
        "authority": "ঢাকা মেট্রো যাত্রী ও পণ্য পরিবহন কমিটি (BRTA)",
        "gazette_notification": "প্রজ্ঞাপন নং-৩৫.০০.০০০০.০২০.২৬.০০৫.১৬-৫৪০",
        "rate_per_km_bdt": DhakaFareEngine.BUS_PER_KM_RATE,
        "minimum_fare_bdt": DhakaFareEngine.MINIMUM_BUS_FARE,
        "student_discount": "50% half-pass with minimum 10 BDT statutory floor",
        "benchmark_routes": table_formatted
    }

@router.get("/buses")
def search_local_buses(
    origin: Optional[str] = Query(None, description="Origin hub name"),
    destination: Optional[str] = Query(None, description="Destination hub name"),
    query: Optional[str] = Query(None, description="Bus name or stop search query")
):
    """
    Search Dhaka local buses from the comprehensive 183-bus dataset.
    Can filter by origin & destination hubs, or search by bus company name.
    """
    if origin and destination:
        matching = DhakaFareEngine.find_direct_buses(origin, destination)
        return {
            "origin": origin,
            "destination": destination,
            "direct_buses_count": len(matching),
            "buses": matching
        }
    
    results = LOCAL_BUSES_DATA
    if query:
        q = query.lower()
        results = [
            b for b in results 
            if q in b.get("name", "").lower() or q in b.get("name_bn", "") or q in b.get("route_summary", "").lower()
        ]
    
    return {
        "total_buses": len(results),
        "buses": results[:50]  # Paginated limit for performance
    }
