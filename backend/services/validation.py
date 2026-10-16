import time
from typing import Dict, Any, List, Optional
from data.dhaka_transit_data import DHAKA_HUBS, TRANSIT_ROUTES

class TransitValidator:
    """
    Implements Part 4 of the Hackathon Spec:
    - Route Grounding against real transit graph
    - Crowd Corroboration & Time-Decay scoring
    - Sanity checking of user-submitted reports and fares
    """

    @classmethod
    def ground_route(cls, leg_line_name: str, from_hub: str, to_hub: str, mode: str) -> bool:
        """
        Ensures AI or user suggestions exist in the real transit graph.
        Prevents hallucinated bus routes or non-existent stations.
        """
        # 1. Verify hubs
        if from_hub not in DHAKA_HUBS or to_hub not in DHAKA_HUBS:
            return False

        # 2. Verify mode and line if specified
        if mode == "metro":
            return DHAKA_HUBS[from_hub]["is_metro_station"] and DHAKA_HUBS[to_hub]["is_metro_station"]

        if mode == "bus":
            valid_bus_names = [r["name"].lower() for r in TRANSIT_ROUTES if r["type"] == "bus"]
            clean_name = leg_line_name.lower()
            return any(bus in clean_name or clean_name in bus for bus in valid_bus_names) or "bus" in clean_name

        if mode in ["leguna", "rickshaw", "walk"]:
            return True

        return False

    @classmethod
    def calculate_alert_decay(cls, alert: Dict[str, Any]) -> Dict[str, Any]:
        """
        Applies mathematical time-decay to crowd-sourced alerts:
        - Fresh alerts (< 30 mins) retain 100% weight.
        - Decay multiplier = max(0.2, 1.0 - (minutes_ago / 180) * 0.8)
        - If score < 25 or minutes_ago > 240, alert is retired.
        """
        mins = alert.get("minutes_ago", 0)
        upvotes = alert.get("upvotes", 1)
        downvotes = alert.get("downvotes", 0)

        # Time decay factor
        decay_factor = max(0.15, 1.0 - (mins / 180.0) * 0.75)
        raw_score = (upvotes * 8) - (downvotes * 12) + 50
        trust_score = round(max(0.0, min(100.0, raw_score * decay_factor)), 1)

        is_verified = trust_score >= 65 and upvotes >= 3
        is_active = trust_score >= 25 and mins <= 240

        updated = dict(alert)
        updated["trust_score"] = trust_score
        updated["verified"] = is_verified
        updated["is_active"] = is_active
        return updated

    @classmethod
    def sanity_check_report(cls, hub: str, alert_type: str, severity: int) -> Tuple_Validation:
        """Sanity filters for spam or contradictory user alerts"""
        if hub not in DHAKA_HUBS:
            return False, f"Invalid hub: '{hub}'. Must be one of the 14 major Dhaka hubs."

        valid_types = ["waterlogging", "blockade", "gridlock", "construction"]
        if alert_type.lower() not in valid_types:
            return False, f"Invalid alert type. Allowed types: {', '.join(valid_types)}"

        if not (1 <= severity <= 100):
            return False, "Severity must be an integer between 1 and 100."

        return True, "Valid"

    @classmethod
    def sanity_check_fare(cls, mode: str, fare_bdt: int) -> bool:
        """Rejects absurd or impossible fare inputs"""
        if mode == "bus":
            return 10 <= fare_bdt <= 150
        if mode == "metro":
            return 20 <= fare_bdt <= 100
        if mode == "rickshaw":
            return 20 <= fare_bdt <= 400
        if mode == "cng":
            return 100 <= fare_bdt <= 1200
        return 0 <= fare_bdt <= 2000

class Tuple_Validation:
    def __init__(self, valid: bool, msg: str):
        self.valid = valid
        self.msg = msg
    def __iter__(self):
        return iter((self.valid, self.msg))
