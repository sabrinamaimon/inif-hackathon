from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from data.dhaka_transit_data import DHAKA_HUBS, TRANSIT_ROUTES
from models.schemas import HubModel, TransitRouteModel

router = APIRouter(prefix="/api/transit", tags=["Transit CMS"])

# In-memory store for dynamic additions during the session
routes_store = list(TRANSIT_ROUTES)

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
