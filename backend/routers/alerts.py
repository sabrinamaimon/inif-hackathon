import uuid
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from data.dhaka_transit_data import SEED_ALERTS
from models.schemas import StreetAlertModel, AlertCreateRequest, AlertVoteRequest
from services.validation import TransitValidator

router = APIRouter(prefix="/api/alerts", tags=["Street Alerts"])

# In-memory alert database initialized with realistic seed incidents
alerts_store: List[Dict[str, Any]] = [dict(a) for a in SEED_ALERTS]

@router.get("", response_model=List[StreetAlertModel])
def get_active_alerts():
    """Returns live street alerts with mathematical time-decay and trust scores applied"""
    results = []
    for alert in alerts_store:
        processed = TransitValidator.calculate_alert_decay(alert)
        if processed.get("is_active", True):
            results.append(StreetAlertModel(**processed))
    # Sort highest severity first
    results.sort(key=lambda x: x.severity, reverse=True)
    return results

@router.post("", response_model=StreetAlertModel)
def submit_street_alert(request: AlertCreateRequest):
    """Commuter crowdsourcing endpoint to report roadblocks or waterlogging"""
    is_valid, error_msg = TransitValidator.sanity_check_report(
        request.hub, request.type, request.severity
    )
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    alert_id = f"alert-{uuid.uuid4().hex[:8]}"
    new_alert = {
        "id": alert_id,
        "hub": request.hub,
        "type": request.type,
        "title": request.title,
        "title_bn": request.title,  # default to title
        "description": request.description,
        "severity": request.severity,
        "affected_modes": request.affected_modes,
        "upvotes": 1,
        "downvotes": 0,
        "verified": False,
        "minutes_ago": 1,
        "is_active": True,
        "trust_score": 60.0
    }
    alerts_store.insert(0, new_alert)
    return StreetAlertModel(**new_alert)

@router.post("/vote", response_model=StreetAlertModel)
def vote_on_alert(request: AlertVoteRequest):
    """Allows commuters to corroborate ('upvote') or mark resolved ('downvote')"""
    for alert in alerts_store:
        if alert["id"] == request.alert_id:
            if request.vote_type == "upvote":
                alert["upvotes"] = alert.get("upvotes", 0) + 1
            elif request.vote_type == "downvote":
                alert["downvotes"] = alert.get("downvotes", 0) + 1
            # Recompute decay and trust
            processed = TransitValidator.calculate_alert_decay(alert)
            alert.update(processed)
            return StreetAlertModel(**processed)
    raise HTTPException(status_code=404, detail="Alert not found")
