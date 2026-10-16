import math
import os
import json
from typing import Dict, Any, Tuple, Optional, List
from data.dhaka_transit_data import (
    MRT6_FARE_TABLE, 
    MRT6_FULL_STATION_FARE_MATRIX, 
    MRT6_STATIONS_LIST, 
    MRT6_STATION_ALIASES, 
    TRANSIT_EDGES
)

# Load full 183 local buses dataset
_LOCAL_BUSES_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "all_local_buses.json")
try:
    with open(_LOCAL_BUSES_FILE, "r", encoding="utf-8") as f:
        LOCAL_BUSES_DATA = json.load(f)
except Exception:
    LOCAL_BUSES_DATA = []

HUB_ALIASES = {
    "Mirpur 10": ["mirpur 10", "mirpur-10", "mirpur 10 roundabout", "mirpur10"],
    "Farmgate": ["farmgate", "khamar bari", "ananda cinema"],
    "Shahbagh": ["shahbag", "shahbagh", "pg hospital", "matsya bhaban", "birdem", "bsmmu"],
    "Motijheel": ["motijheel", "dilkusha", "shapla chattar", "bangladesh bank", "kamalapur", "arambagh", "gulistan", "paltan"],
    "Uttara": ["uttara", "house building", "azampur", "rajlakshmi", "jashimuddin", "abdullahpur", "airport"],
    "Science Lab": ["science lab", "city college", "priyangon", "new market", "nilkhet"],
    "Dhanmondi": ["dhanmondi", "dhanmondi 27", "dhanmondi 32", "dhanmondi 15", "kalabagan", "shukrabad", "rapa plaza", "sobhani bagh"],
    "Mohammadpur": ["mohammadpur", "shia masjid", "shia mosque", "town hall", "japan garden city", "asad gate", "ring road"],
    "Mohakhali": ["mohakhali", "wireless", "chairman bari", "titumir college"],
    "Banasree": ["banasree", "rampura bridge", "rampura bazar", "merul", "farazy hospital"],
    "Badda": ["badda", "uttar badda", "madhya badda", "badda link road", "shahjadpur", "bashtola", "notun bazar"],
    "Malibagh": ["malibagh", "mouchak", "malibagh moor", "malibagh railgate", "hazipara", "kakrail", "shantinagar"],
    "Jatrabari": ["jatrabari", "sayedabad", "shonir akhra", "dhupkhola", "postogola", "donia"],
    "Agargaon": ["agargaon", "idb", "taltola", "zia uddyan", "passport office"]
}

class DhakaFareEngine:
    """
    Implements legal Dhaka transit fare rules:
    
    1. Bus: 
       - Official BRTA Gazette Notification (প্রজ্ঞাপন নং-৩৫.০০.০০০০.০২০.২৬.০০৫.১৬-৫৪০):
         - Rate: 2.70 BDT per passenger per km
         - Statutory minimum fare floor: 10.00 BDT
         - Student Half-Pass: 50% discount with 10.00 BDT statutory minimum floor
           Formula: Student Fare = max(10, ceil(Regular Fare * 0.50))
    2. Metro Rail (MRT-6): 
       - Official DMTCL Fare Chart (Road Transport & Highways Division):
         - 17 stations: Uttara North to Kamalapur
         - Base minimum fare: 20 BDT, maximum: 100 BDT
         - MRT Pass / Rapid Pass: 10% discount on every trip (e.g. 100 -> 90, 40 -> 36, 20 -> 18)
         - Single Journey ticket: Valid for 100 minutes inside paid area
         - Special discounts: Disabled Freedom Fighters free, Children under 90cm free, Special needs 15% discount
         - Student pass: NOT applicable on MRT-6 (DMTCL official policy)
    3. Leguna (Human Haulers): 
       - Fixed local corridor fares (15 - 30 BDT)
       - NO student half-pass discount
    4. Connector Rickshaw/CNG: 
       - Distance base + Weather/Rush surges (+50% rain, +80% monsoon, +25% rush hour)
       - NO student discount
    """

    MINIMUM_BUS_FARE = 10     # Statutory minimum bus fare floor in BDT
    BUS_PER_KM_RATE = 2.70    # Official Gazette rate in BDT per passenger-km
    BRTA_GAZETTE_REF = "প্রজ্ঞাপন নং-৩৫.০০.০০০০.০২০.২৬.০০৫.১৬-৫৪০ (ঢাকা মেট্রো যাত্রী ও পণ্য পরিবহন কমিটি)"
    DMTCL_REF = "ঢাকা ম্যাস ট্রানজিট কোম্পানি লিমিটেড (ডিএমটিসিএল) - সড়ক পরিবহন ও মহাসড়ক বিভাগ"

    # Official point-to-point benchmark bus fare table from BRTA Gazette charts
    OFFICIAL_BUS_FARE_TABLE = {
        ("Mirpur 10", "Farmgate"): 18,
        ("Mirpur 10", "Shahbagh"): 24,
        ("Mirpur 10", "Motijheel"): 32,
        ("Mirpur 10", "Jatrabari"): 41,
        ("Mirpur 10", "Agargaon"): 10,
        ("Mirpur 10", "Science Lab"): 22,
        ("Mirpur 10", "Dhanmondi"): 20,
        ("Mirpur 10", "Mohammadpur"): 16,
        ("Mirpur 10", "Mohakhali"): 18,
        ("Mirpur 10", "Uttara"): 23,
        ("Mirpur 10", "Banasree"): 28,
        ("Mirpur 10", "Badda"): 25,
        ("Mirpur 10", "Malibagh"): 26,

        ("Agargaon", "Farmgate"): 10,
        ("Agargaon", "Shahbagh"): 16,
        ("Agargaon", "Motijheel"): 24,
        ("Agargaon", "Mohakhali"): 10,
        ("Agargaon", "Science Lab"): 14,
        ("Agargaon", "Dhanmondi"): 12,
        ("Agargaon", "Mohammadpur"): 10,

        ("Farmgate", "Shahbagh"): 10,
        ("Farmgate", "Motijheel"): 15,
        ("Farmgate", "Science Lab"): 10,
        ("Farmgate", "Mohammadpur"): 10,
        ("Farmgate", "Mohakhali"): 10,
        ("Farmgate", "Jatrabari"): 25,
        ("Farmgate", "Dhanmondi"): 10,
        ("Farmgate", "Malibagh"): 12,
        ("Farmgate", "Banasree"): 20,
        ("Farmgate", "Uttara"): 28,

        ("Science Lab", "Shahbagh"): 10,
        ("Science Lab", "Motijheel"): 13,
        ("Science Lab", "Mohammadpur"): 10,
        ("Science Lab", "Dhanmondi"): 10,
        ("Science Lab", "Jatrabari"): 20,
        ("Science Lab", "Malibagh"): 14,
        ("Science Lab", "Banasree"): 22,

        ("Shahbagh", "Motijheel"): 10,
        ("Shahbagh", "Jatrabari"): 18,
        ("Shahbagh", "Malibagh"): 10,
        ("Shahbagh", "Mohammadpur"): 15,
        ("Shahbagh", "Dhanmondi"): 12,
        ("Shahbagh", "Uttara"): 33,
        ("Shahbagh", "Banasree"): 18,

        ("Dhanmondi", "Mohammadpur"): 10,
        ("Dhanmondi", "Motijheel"): 18,
        ("Dhanmondi", "Malibagh"): 16,
        ("Dhanmondi", "Banasree"): 24,

        ("Mohammadpur", "Banasree"): 28,
        ("Mohammadpur", "Motijheel"): 20,
        ("Mohammadpur", "Mohakhali"): 18,
        ("Mohammadpur", "Jatrabari"): 28,
        ("Mohammadpur", "Malibagh"): 22,

        ("Banasree", "Malibagh"): 10,
        ("Banasree", "Badda"): 10,
        ("Banasree", "Mohakhali"): 15,
        ("Banasree", "Motijheel"): 16,
        ("Banasree", "Jatrabari"): 22,
        ("Banasree", "Uttara"): 30,

        ("Malibagh", "Motijheel"): 10,
        ("Malibagh", "Mohakhali"): 12,
        ("Malibagh", "Badda"): 14,
        ("Malibagh", "Jatrabari"): 15,
        ("Malibagh", "Uttara"): 30,

        ("Mohakhali", "Badda"): 10,
        ("Mohakhali", "Uttara"): 23,
        ("Mohakhali", "Motijheel"): 20,
        ("Mohakhali", "Jatrabari"): 28,

        ("Badda", "Uttara"): 24,
        ("Badda", "Motijheel"): 22,
        ("Badda", "Jatrabari"): 30,

        ("Motijheel", "Jatrabari"): 10,
        ("Uttara", "Motijheel"): 38,
        ("Uttara", "Jatrabari"): 46
    }

    @classmethod
    def resolve_metro_station(cls, name: str) -> Optional[str]:
        """Resolves colloquial or English/Bengali names to canonical MRT-6 station name"""
        normalized = name.strip().lower()
        if normalized in MRT6_STATION_ALIASES:
            return MRT6_STATION_ALIASES[normalized]
        for st in MRT6_STATIONS_LIST:
            if normalized == st["name"].lower() or normalized == st["name_bn"].lower() or normalized == st["code"].lower():
                return st["name"]
        return None

    @classmethod
    def calculate_metro_fare(
        cls, 
        from_hub: str, 
        to_hub: str, 
        card_type: str = "single_journey"
    ) -> Optional[int]:
        """
        Calculates official MRT-6 fare according to DMTCL official Fare Chart:
        - Checks full 17-station DMTCL matrix
        - If card_type is 'mrt_pass' or 'rapid_pass', applies statutory 10% discount
        - Returns BDT integer, or None if the corridor is not an MRT-6 station pair.
        """
        st1 = cls.resolve_metro_station(from_hub) or from_hub
        st2 = cls.resolve_metro_station(to_hub) or to_hub

        fare = None
        # Check full station matrix
        pair1 = (st1, st2)
        pair2 = (st2, st1)
        if pair1 in MRT6_FULL_STATION_FARE_MATRIX:
            fare = MRT6_FULL_STATION_FARE_MATRIX[pair1]
        elif pair2 in MRT6_FULL_STATION_FARE_MATRIX:
            fare = MRT6_FULL_STATION_FARE_MATRIX[pair2]
        elif pair1 in MRT6_FARE_TABLE:
            fare = MRT6_FARE_TABLE[pair1]
        elif pair2 in MRT6_FARE_TABLE:
            fare = MRT6_FARE_TABLE[pair2]

        if fare is None:
            # Check if both are recognized metro stations
            metro_hubs = {"Uttara", "Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"}
            if from_hub in metro_hubs and to_hub in metro_hubs:
                fare = 20

        if fare is not None:
            # MRT Pass / Rapid Pass 10% discount
            if card_type in ["mrt_pass", "rapid_pass"]:
                fare = int(math.ceil(fare * 0.90))
            return fare

        return None

    @classmethod
    def calculate_bus_fare(
        cls, 
        distance_km: float, 
        from_hub: Optional[str] = None, 
        to_hub: Optional[str] = None
    ) -> Tuple[int, int]:
        """
        Calculates Bus fare strictly following Dhaka Metro Transport Committee Gazette rules:
        - Checks exact Gazette table for from_hub <-> to_hub pair first.
        - Otherwise computes: max(10, ceil(distance_km * 2.70)).
        - Computes student half-pass: max(10, ceil(regular_fare * 0.50)).
        
        Returns: (regular_fare_bdt, student_fare_bdt)
        """
        regular = None
        if from_hub and to_hub:
            pair1 = (from_hub, to_hub)
            pair2 = (to_hub, from_hub)
            if pair1 in cls.OFFICIAL_BUS_FARE_TABLE:
                regular = cls.OFFICIAL_BUS_FARE_TABLE[pair1]
            elif pair2 in cls.OFFICIAL_BUS_FARE_TABLE:
                regular = cls.OFFICIAL_BUS_FARE_TABLE[pair2]

        if regular is None:
            raw_fare = distance_km * cls.BUS_PER_KM_RATE
            regular = max(cls.MINIMUM_BUS_FARE, int(math.ceil(raw_fare)))

        # 50% half-pass discount with statutory 10 BDT floor
        student = max(cls.MINIMUM_BUS_FARE, int(math.ceil(regular * 0.50)))
        return regular, student

    @classmethod
    def find_direct_buses(cls, from_hub: str, to_hub: str) -> List[Dict[str, Any]]:
        """
        Finds all local buses in Dhaka that serve both from_hub and to_hub.
        Uses stop aliases to match colloquial names.
        """
        aliases_u = HUB_ALIASES.get(from_hub, [from_hub.lower()])
        aliases_v = HUB_ALIASES.get(to_hub, [to_hub.lower()])

        matching_buses = []
        for bus in LOCAL_BUSES_DATA:
            route_str = bus.get("route_summary", "").lower()
            u_found = any(a in route_str for a in aliases_u)
            v_found = any(a in route_str for a in aliases_v)
            if u_found and v_found:
                matching_buses.append({
                    "name": bus.get("name"),
                    "name_bn": bus.get("name_bn"),
                    "route_summary": bus.get("route_summary"),
                    "bus_type": bus.get("bus_type", "Semi-Sitting"),
                    "image_url": bus.get("image_url")
                })
        return matching_buses

    @classmethod
    def calculate_leguna_fare(cls, from_hub: str, to_hub: str, distance_km: float) -> Tuple[int, int]:
        """Legunas have flat corridor pricing (15 - 30 BDT), NO student discount"""
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

    @classmethod
    def calculate_multimodal_breakdown(
        cls,
        from_hub: str,
        to_hub: str,
        distance_km: float,
        weather: str = "normal",
        is_rush_hour: bool = False,
        passenger_type: str = "general",
        card_type: str = "single_journey"
    ) -> Dict[str, Any]:
        """
        Produces an all-in-one multi-modal fare breakdown comparing Bus, Metro, Leguna, and Rickshaw.
        Includes statutory citations, exact DMTCL rules, and list of direct buses serving the route.
        """
        # Bus
        bus_reg, bus_stud = cls.calculate_bus_fare(distance_km, from_hub, to_hub)
        bus_selected = bus_stud if passenger_type == "student" else bus_reg
        direct_buses = cls.find_direct_buses(from_hub, to_hub)

        # Metro (Single Journey and MRT Pass)
        metro_single = cls.calculate_metro_fare(from_hub, to_hub, card_type="single_journey")
        metro_pass = cls.calculate_metro_fare(from_hub, to_hub, card_type="mrt_pass")
        metro_selected = metro_pass if card_type in ["mrt_pass", "rapid_pass"] else metro_single

        # Leguna
        leguna_reg, leguna_stud = cls.calculate_leguna_fare(from_hub, to_hub, distance_km)

        # Rickshaw
        rick_reg, rick_stud, surge = cls.calculate_rickshaw_fare(
            from_hub, to_hub, distance_km, weather=weather, is_rush_hour=is_rush_hour
        )

        modes = {
            "bus": {
                "available": True,
                "regular_fare_bdt": bus_reg,
                "student_fare_bdt": bus_stud,
                "selected_fare_bdt": bus_selected,
                "student_discount_applied": (passenger_type == "student" and bus_stud < bus_reg),
                "rate_formula": f"{cls.BUS_PER_KM_RATE} BDT/km with 10 BDT statutory minimum floor",
                "gazette_reference": cls.BRTA_GAZETTE_REF,
                "direct_buses_count": len(direct_buses),
                "direct_buses_names": [b["name"] for b in direct_buses[:8]],
                "note": "Student half-pass (50%) valid with minimum 10 BDT statutory floor per BRTA Gazette."
            },
            "metro": {
                "available": metro_single is not None,
                "single_journey_fare_bdt": metro_single if metro_single is not None else 0,
                "mrt_pass_fare_bdt": metro_pass if metro_pass is not None else 0,
                "regular_fare_bdt": metro_single if metro_single is not None else 0,
                "student_fare_bdt": metro_single if metro_single is not None else 0,
                "selected_fare_bdt": metro_selected if metro_selected is not None else 0,
                "student_discount_applied": False,
                "mrt_pass_discount_applied": (card_type in ["mrt_pass", "rapid_pass"]),
                "mrt_pass_discount_percent": 10,
                "ticket_validity": "Single journey ticket valid for 100 minutes inside paid area",
                "gazette_reference": cls.DMTCL_REF,
                "note": "MRT-6 operates under DMTCL; student half-pass discount is NOT applicable. MRT Pass/Rapid Pass holders receive a 10% discount on every trip."
            },
            "leguna": {
                "available": True,
                "regular_fare_bdt": leguna_reg,
                "student_fare_bdt": leguna_stud,
                "selected_fare_bdt": leguna_reg,
                "student_discount_applied": False,
                "rate_formula": "Fixed Corridor Rate (15 - 30 BDT)",
                "note": "Private human-haulers do not accept student concession."
            },
            "rickshaw": {
                "available": True,
                "regular_fare_bdt": rick_reg,
                "student_fare_bdt": rick_stud,
                "selected_fare_bdt": rick_reg,
                "student_discount_applied": False,
                "rate_formula": f"Base distance + surge ({surge}x)",
                "note": f"Weather={weather}, RushHour={is_rush_hour}. Rickshaws do not give student half-pass."
            }
        }

        # Determine cheapest and student recommended
        available_modes = {k: v for k, v in modes.items() if v["available"]}
        cheapest_mode = min(available_modes.keys(), key=lambda k: available_modes[k]["selected_fare_bdt"])
        student_recommended = "bus" if modes["bus"]["available"] else cheapest_mode

        return {
            "from_hub": from_hub,
            "to_hub": to_hub,
            "distance_km": round(distance_km, 1),
            "passenger_type": passenger_type,
            "card_type": card_type,
            "official_gazette": cls.BRTA_GAZETTE_REF,
            "dmtcl_reference": cls.DMTCL_REF,
            "modes": modes,
            "direct_buses": direct_buses[:10],
            "cheapest_mode": cheapest_mode,
            "student_recommended_mode": student_recommended
        }
