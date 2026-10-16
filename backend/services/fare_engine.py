import math
from typing import Dict, Any, Tuple
from data.dhaka_transit_data import MRT6_FARE_TABLE, TRANSIT_EDGES

class DhakaFareEngine:
    """
    Implements legal Dhaka transit fare rules:
    - Bus: 50% student discount subject to minimum 10 BDT floor
    - Metro Rail (MRT-6): Official DMTCL distance chart, NO student discount
    - Leguna: Fixed local corridor fare, NO student discount
    - Connector Rickshaw/CNG: Distance base + Weather/Rush surges, NO student discount
    """

    MINIMUM_BUS_FARE = 10  # Statutory minimum bus fare floor in BDT
    BUS_PER_KM_RATE = 2.45 # BDT per km

    @classmethod
    def calculate_metro_fare(cls, from_hub: str, to_hub: str) -> int:
        pair1 = (from_hub, to_hub)
        pair2 = (to_hub, from_hub)
        if pair1 in MRT6_FARE_TABLE:
            return MRT6_FARE_TABLE[pair1]
        if pair2 in MRT6_FARE_TABLE:
            return MRT6_FARE_TABLE[pair2]
        # Default minimum metro ticket if between intermediate stations
        return 20

    @classmethod
    def calculate_bus_fare(cls, distance_km: float) -> Tuple[int, int]:
        """
        Returns: (regular_fare_bdt, student_fare_bdt)
        Rule: Regular = max(10, round(distance * 2.45))
              Student = max(10, round(regular * 0.50))
        """
        raw_fare = distance_km * cls.BUS_PER_KM_RATE
        regular = max(cls.MINIMUM_BUS_FARE, int(math.ceil(raw_fare)))
        # 50% discount with 10 BDT statutory minimum floor
        student = max(cls.MINIMUM_BUS_FARE, int(math.ceil(regular * 0.50)))
        return regular, student

    @classmethod
    def calculate_leguna_fare(cls, from_hub: str, to_hub: str, distance_km: float) -> Tuple[int, int]:
        """Legunas have flat corridor pricing (15 - 30 BDT), no student discount"""
        base = max(15, min(30, int(round(distance_km * 4.5))))
        return base, base

    @classmethod
    def calculate_rickshaw_fare(
        cls, 
        from_hub: str, 
        to_hub: str, 
        distance_km: float, 
        weather: str = "normal", 
        is_rush_hour: bool = False
    ) -> Tuple[int, int, float]:
        """
        Non-metered connector rickshaw.
        Returns: (regular_fare, student_fare, surge_multiplier)
        """
        pair1 = (from_hub, to_hub)
        pair2 = (to_hub, from_hub)
        base_rate = 40
        if pair1 in TRANSIT_EDGES:
            base_rate = TRANSIT_EDGES[pair1].get("rickshaw_base_bdt", 40)
        elif pair2 in TRANSIT_EDGES:
            base_rate = TRANSIT_EDGES[pair2].get("rickshaw_base_bdt", 40)
        else:
            base_rate = max(30, int(distance_km * 20))

        surge = 1.0
        if weather == "rain":
            surge += 0.50  # +50%
        elif weather == "heavy_monsoon":
            surge += 0.80  # +80%

        if is_rush_hour:
            surge += 0.25  # +25%

        final_fare = int(math.ceil(base_rate * surge))
        # Rickshaws do not give student half-pass discounts
        return final_fare, final_fare, round(surge, 2)
