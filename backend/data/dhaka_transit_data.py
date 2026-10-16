"""
DhakaPath Transit Network & Ground Truth Data
Contains 14 Major Dhaka Hubs, Coordinates, MRT-6 Metro Rail, Local Buses, Legunas, and Connector Rickshaws.
"""

DHAKA_HUBS = {
    "Motijheel": {
        "id": "hub-motijheel",
        "name": "Motijheel",
        "name_bn": "মতিঝিল",
        "lat": 23.7330,
        "lng": 90.4172,
        "landmarks": ["Shapla Chattar", "Bangladesh Bank", "Sonali Bank HQ", "Metro Exit B"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-MJL",
        "zone": "Central Commercial"
    },
    "Banasree": {
        "id": "hub-banasree",
        "name": "Banasree",
        "name_bn": "বনশ্রী",
        "lat": 23.7644,
        "lng": 90.4358,
        "landmarks": ["Rampura Bridge", "Block C Gate", "Faizur Rahman School", "Farazy Hospital"],
        "is_metro_station": False,
        "zone": "East Residential"
    },
    "Malibagh": {
        "id": "hub-malibagh",
        "name": "Malibagh",
        "name_bn": "মালিবাগ",
        "lat": 23.7487,
        "lng": 90.4140,
        "landmarks": ["Malibagh Railgate", "Chowdhurypara", "Abul Hotel", "Mouchak Market"],
        "is_metro_station": False,
        "zone": "Central East"
    },
    "Shahbagh": {
        "id": "hub-shahbagh",
        "name": "Shahbagh",
        "name_bn": "শাহবাগ",
        "lat": 23.7383,
        "lng": 90.3956,
        "landmarks": ["BSMMU (PG Hospital)", "National Museum", "BIRDEM Hospital", "DU Campus Gate", "Metro Exit 1"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-SHB",
        "zone": "Institutional / University"
    },
    "Farmgate": {
        "id": "hub-farmgate",
        "name": "Farmgate",
        "name_bn": "ফার্মগেট",
        "lat": 23.7561,
        "lng": 90.3872,
        "landmarks": ["Ananda Cinema Hall", "Foot-overbridge", "Tejgaon College", "Khamarbari", "Metro Exit A"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-FMG",
        "zone": "Central Transit Hub"
    },
    "Science Lab": {
        "id": "hub-sciencelab",
        "name": "Science Lab",
        "name_bn": "সায়েন্স ল্যাব",
        "lat": 23.7390,
        "lng": 90.3830,
        "landmarks": ["Dhaka City College", "Priyangon Shopping Center", "BCSIR Gate", "New Market Entry"],
        "is_metro_station": False,
        "zone": "Commercial / Educational"
    },
    "Dhanmondi": {
        "id": "hub-dhanmondi",
        "name": "Dhanmondi",
        "name_bn": "ধানমন্ডি",
        "lat": 23.7465,
        "lng": 90.3760,
        "landmarks": ["Dhanmondi 27 (Rapa Plaza)", "Dhanmondi 32 Bridge", "Shimanto Square", "Star Kabab 2"],
        "is_metro_station": False,
        "zone": "West Residential / Commercial"
    },
    "Mohammadpur": {
        "id": "hub-mohammadpur",
        "name": "Mohammadpur",
        "name_bn": "মোহাম্মদপুর",
        "lat": 23.7658,
        "lng": 90.3584,
        "landmarks": ["Mohammadpur Bus Stand", "Town Hall Market", "Allah Karim Mosque", "Shia Mosque"],
        "is_metro_station": False,
        "zone": "West Residential"
    },
    "Mirpur 10": {
        "id": "hub-mirpur10",
        "name": "Mirpur 10",
        "name_bn": "মিরপুর ১০",
        "lat": 23.8070,
        "lng": 90.3686,
        "landmarks": ["Mirpur 10 Roundabout", "Fire Service Station", "Metro Pillar 184", "Benarosi Palli"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-M10",
        "zone": "North Transit Hub"
    },
    "Agargaon": {
        "id": "hub-agargaon",
        "name": "Agargaon",
        "name_bn": "আগারগাঁও",
        "lat": 23.7785,
        "lng": 90.3780,
        "landmarks": ["Passport Office Road", "Election Commission", "IDB Bhaban", "Metro Gate 2"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-AGA",
        "zone": "Administrative / Institutional"
    },
    "Mohakhali": {
        "id": "hub-mohakhali",
        "name": "Mohakhali",
        "name_bn": "মহাখালী",
        "lat": 23.7776,
        "lng": 90.4054,
        "landmarks": ["Mohakhali Inter-district Bus Terminal", "Wireless Gate", "Flyover Roundabout", "ICDDR,B"],
        "is_metro_station": False,
        "zone": "North-Central Hub"
    },
    "Badda": {
        "id": "hub-badda",
        "name": "Badda",
        "name_bn": "বাড্ডা",
        "lat": 23.7806,
        "lng": 90.4267,
        "landmarks": ["Badda Link Road", "Suvastu Nazar Valley", "Uttar Badda Bazar", "Pragati Sarani Bridge"],
        "is_metro_station": False,
        "zone": "North-East Corridor"
    },
    "Uttara": {
        "id": "hub-uttara",
        "name": "Uttara",
        "name_bn": "উত্তরা",
        "lat": 23.8759,
        "lng": 90.3795,
        "landmarks": ["House Building", "Rajlakshmi Complex", "Azampur Bus Stand", "Metro North Station"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-UTN",
        "zone": "North Suburban"
    },
    "Jatrabari": {
        "id": "hub-jatrabari",
        "name": "Jatrabari",
        "name_bn": "যাত্রাবাড়ী",
        "lat": 23.7115,
        "lng": 90.4344,
        "landmarks": ["Mayor Hanif Flyover Entry", "Jatrabari Chourasta", "Golapbagh Field", "Donia Mor"],
        "is_metro_station": False,
        "zone": "South-East Entryway"
    }
}

# Official MRT-6 Station to Station Fares (in BDT)
# Metro rules: No student half-pass discount applies. Fixed distance-based pricing.
MRT6_FARE_TABLE = {
    ("Uttara", "Mirpur 10"): 30,
    ("Uttara", "Agargaon"): 50,
    ("Uttara", "Farmgate"): 60,
    ("Uttara", "Shahbagh"): 80,
    ("Uttara", "Motijheel"): 100,
    ("Mirpur 10", "Agargaon"): 20,
    ("Mirpur 10", "Farmgate"): 30,
    ("Mirpur 10", "Shahbagh"): 40,
    ("Mirpur 10", "Motijheel"): 50,
    ("Agargaon", "Farmgate"): 20,
    ("Agargaon", "Shahbagh"): 30,
    ("Agargaon", "Motijheel"): 40,
    ("Farmgate", "Shahbagh"): 20,
    ("Farmgate", "Motijheel"): 30,
    ("Shahbagh", "Motijheel"): 20
}

# Public Transport Routes
TRANSIT_ROUTES = [
    {
        "id": "route-mrt6",
        "name": "MRT-6 Metro Rail",
        "name_bn": "এমআরটি-৬ মেট্রোরেল",
        "type": "metro",
        "operator": "DMTCL",
        "color": "#059669",
        "student_pass_allowed": False,
        "frequency_mins": 6,
        "hubs": ["Uttara", "Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"],
        "landmark_instructions": "Enter elevated station via concourse level. Use Rapid Pass or single journey ticket at turnstiles. Train has AC and automated voice announcements."
    },
    {
        "id": "route-bikolpo",
        "name": "Bikolpo Auto Service",
        "name_bn": "বিকল্প অটো সার্ভিস",
        "type": "bus",
        "operator": "Bikolpo Transport Ltd",
        "color": "#2563eb",
        "student_pass_allowed": True,
        "frequency_mins": 8,
        "hubs": ["Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"],
        "landmark_instructions": "Mirpur 10: Near roundabout pillar 184. Farmgate: Ananda Cinema hall front. Shahbagh: National Museum front gate."
    },
    {
        "id": "route-shikor",
        "name": "Shikor Paribahan",
        "name_bn": "শিকর পরিবহন",
        "type": "bus",
        "operator": "Shikor Paribahan Co",
        "color": "#d97706",
        "student_pass_allowed": True,
        "frequency_mins": 10,
        "hubs": ["Mirpur 10", "Agargaon", "Science Lab", "Shahbagh", "Jatrabari"],
        "landmark_instructions": "Science Lab: Opposite Dhaka City College. Jatrabari: Below Hanif Flyover ramp."
    },
    {
        "id": "route-thikana",
        "name": "Thikana Paribahan",
        "name_bn": "ঠিকানা পরিবহন",
        "type": "bus",
        "operator": "Thikana Express",
        "color": "#7c3aed",
        "student_pass_allowed": True,
        "frequency_mins": 12,
        "hubs": ["Mohammadpur", "Dhanmondi", "Science Lab", "Shahbagh", "Malibagh", "Banasree"],
        "landmark_instructions": "Mohammadpur: Town Hall bus stop. Dhanmondi: Rapa Plaza. Banasree: Block C entry bridge."
    },
    {
        "id": "route-victor",
        "name": "Victor Classic",
        "name_bn": "ভিক্টর ক্লাসিক",
        "type": "bus",
        "operator": "Victor Transport",
        "color": "#dc2626",
        "student_pass_allowed": True,
        "frequency_mins": 7,
        "hubs": ["Uttara", "Mohakhali", "Malibagh", "Motijheel", "Jatrabari"],
        "landmark_instructions": "Uttara: Azampur bus stand. Mohakhali: Opposite inter-district bus terminal. Malibagh: Railgate crossing."
    },
    {
        "id": "route-raida",
        "name": "Raida Enterprise",
        "name_bn": "রাইদা এন্টারপ্রাইজ",
        "type": "bus",
        "operator": "Raida Paribahan",
        "color": "#0891b2",
        "student_pass_allowed": True,
        "frequency_mins": 9,
        "hubs": ["Uttara", "Badda", "Banasree", "Malibagh", "Motijheel"],
        "landmark_instructions": "Badda: Suvastu Nazar Valley foot-bridge. Banasree: Rampura canal bridge."
    },
    {
        "id": "route-taranga",
        "name": "Taranga Plus",
        "name_bn": "তরঙ্গ প্লাস",
        "type": "bus",
        "operator": "Taranga Transport Co",
        "color": "#4f46e5",
        "student_pass_allowed": True,
        "frequency_mins": 11,
        "hubs": ["Mohammadpur", "Science Lab", "Shahbagh", "Motijheel"],
        "landmark_instructions": "Mohammadpur: Allah Karim Mosque front. Shahbagh: PG Hospital gate."
    },
    {
        "id": "route-leguna-farm-mdpur",
        "name": "Farmgate - Mohammadpur Leguna",
        "name_bn": "ফার্মগেট - মোহাম্মদপুর লেগুনা",
        "type": "leguna",
        "operator": "Dhaka Human Hauler Co-op",
        "color": "#0284c7",
        "student_pass_allowed": False,
        "frequency_mins": 4,
        "hubs": ["Farmgate", "Mohammadpur"],
        "landmark_instructions": "Farmgate: Khamarbari road corner. Mohammadpur: Town Hall front. Fast transit via Manik Mia Avenue."
    },
    {
        "id": "route-leguna-scilab-mdpur",
        "name": "Science Lab - Mohammadpur Leguna",
        "name_bn": "সায়েন্স ল্যাব - মোহাম্মদপুর লেগুনা",
        "type": "leguna",
        "operator": "Dhaka Human Hauler Co-op",
        "color": "#0284c7",
        "student_pass_allowed": False,
        "frequency_mins": 5,
        "hubs": ["Science Lab", "Dhanmondi", "Mohammadpur"],
        "landmark_instructions": "Science Lab: Corner of New Market. Dhanmondi: Satmasjid Road 15. Mohammadpur: Bus stand."
    },
    {
        "id": "route-leguna-mohakhali-badda",
        "name": "Mohakhali - Badda Leguna",
        "name_bn": "মহাখালী - বাড্ডা লেগুনা",
        "type": "leguna",
        "operator": "Dhaka Human Hauler Co-op",
        "color": "#0284c7",
        "student_pass_allowed": False,
        "frequency_mins": 5,
        "hubs": ["Mohakhali", "Badda"],
        "landmark_instructions": "Mohakhali: Wireless gate. Badda: Link road junction."
    },
    {
        "id": "route-leguna-jatrabari-motijheel",
        "name": "Jatrabari - Motijheel Leguna",
        "name_bn": "যাত্রাবাড়ী - মতিঝিল লেগুনা",
        "type": "leguna",
        "operator": "Dhaka Human Hauler Co-op",
        "color": "#0284c7",
        "student_pass_allowed": False,
        "frequency_mins": 4,
        "hubs": ["Jatrabari", "Motijheel"],
        "landmark_instructions": "Jatrabari: Golapbagh bus shed. Motijheel: Dilkusha bank zone."
    }
]

# Physical Distance & Baseline Travel Time Between Connected Hubs
# Format: (Origin, Destination): {"distance_km": float, "base_time_mins": int, "rickshaw_base_bdt": int}
TRANSIT_EDGES = {
    ("Uttara", "Mirpur 10"): {"distance_km": 8.5, "base_time_mins": 25, "rickshaw_base_bdt": 160},
    ("Mirpur 10", "Agargaon"): {"distance_km": 3.8, "base_time_mins": 12, "rickshaw_base_bdt": 70},
    ("Agargaon", "Farmgate"): {"distance_km": 3.2, "base_time_mins": 10, "rickshaw_base_bdt": 60},
    ("Farmgate", "Shahbagh"): {"distance_km": 2.5, "base_time_mins": 10, "rickshaw_base_bdt": 50},
    ("Shahbagh", "Motijheel"): {"distance_km": 2.8, "base_time_mins": 12, "rickshaw_base_bdt": 50},
    ("Farmgate", "Science Lab"): {"distance_km": 2.3, "base_time_mins": 9, "rickshaw_base_bdt": 40},
    ("Science Lab", "Shahbagh"): {"distance_km": 1.5, "base_time_mins": 6, "rickshaw_base_bdt": 30},
    ("Science Lab", "Dhanmondi"): {"distance_km": 1.2, "base_time_mins": 5, "rickshaw_base_bdt": 25},
    ("Dhanmondi", "Mohammadpur"): {"distance_km": 2.4, "base_time_mins": 10, "rickshaw_base_bdt": 45},
    ("Farmgate", "Mohammadpur"): {"distance_km": 3.4, "base_time_mins": 14, "rickshaw_base_bdt": 60},
    ("Shahbagh", "Malibagh"): {"distance_km": 2.6, "base_time_mins": 12, "rickshaw_base_bdt": 50},
    ("Malibagh", "Motijheel"): {"distance_km": 2.2, "base_time_mins": 10, "rickshaw_base_bdt": 40},
    ("Malibagh", "Banasree"): {"distance_km": 2.8, "base_time_mins": 14, "rickshaw_base_bdt": 55},
    ("Banasree", "Badda"): {"distance_km": 2.5, "base_time_mins": 12, "rickshaw_base_bdt": 50},
    ("Badda", "Mohakhali"): {"distance_km": 3.1, "base_time_mins": 15, "rickshaw_base_bdt": 60},
    ("Mohakhali", "Farmgate"): {"distance_km": 2.9, "base_time_mins": 12, "rickshaw_base_bdt": 55},
    ("Uttara", "Mohakhali"): {"distance_km": 11.0, "base_time_mins": 35, "rickshaw_base_bdt": 200},
    ("Uttara", "Badda"): {"distance_km": 12.0, "base_time_mins": 38, "rickshaw_base_bdt": 210},
    ("Motijheel", "Jatrabari"): {"distance_km": 3.5, "base_time_mins": 15, "rickshaw_base_bdt": 65},
    ("Science Lab", "Jatrabari"): {"distance_km": 6.8, "base_time_mins": 30, "rickshaw_base_bdt": 120},
    ("Agargaon", "Mohakhali"): {"distance_km": 3.6, "base_time_mins": 15, "rickshaw_base_bdt": 70}
}

# Pre-seeded Street Disruption Logs
SEED_ALERTS = [
    {
        "id": "alert-malibagh-rain",
        "hub": "Malibagh",
        "type": "waterlogging",
        "title": "Severe Waterlogging at Malibagh Railgate",
        "title_bn": "মালিবাগ রেলগেটে হাঁটু পানি ও জলজট",
        "description": "Knee-deep water accumulating after heavy rainfall. Local buses and legunas stalled. Commuters advised to bypass via Kakrail or Shahbagh.",
        "severity": 85,
        "affected_modes": ["bus", "leguna", "rickshaw"],
        "upvotes": 28,
        "downvotes": 2,
        "verified": True,
        "minutes_ago": 18,
        "is_active": True
    },
    {
        "id": "alert-shahbagh-protest",
        "hub": "Shahbagh",
        "type": "blockade",
        "title": "Student Movement Blockade at Shahbagh Roundabout",
        "title_bn": "শাহবাগ মোড়ে সমাবেশ ও ব্যারিকেড",
        "description": "Shahbagh central intersection occupied by student demonstration. Surface vehicles rerouted. MRT-6 Metro Rail operating normally.",
        "severity": 92,
        "affected_modes": ["bus", "rickshaw"],
        "upvotes": 44,
        "downvotes": 1,
        "verified": True,
        "minutes_ago": 25,
        "is_active": True
    },
    {
        "id": "alert-farmgate-gridlock",
        "hub": "Farmgate",
        "type": "gridlock",
        "title": "Peak Hour Gridlock at Ananda Cinema Crossway",
        "title_bn": "ফার্মগেটে আনন্দ সিনেমা হলের সামনে তীব্র যানজট",
        "description": "Heavy bottle-neck heading towards Science Lab. Metro Rail recommended for North-South transit.",
        "severity": 68,
        "affected_modes": ["bus", "rickshaw"],
        "upvotes": 15,
        "downvotes": 3,
        "verified": True,
        "minutes_ago": 40,
        "is_active": True
    }
]
