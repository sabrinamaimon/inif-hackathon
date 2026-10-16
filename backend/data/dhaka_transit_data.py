"""
DhakaPath Transit Network & Ground Truth Data
Contains 14 Major Dhaka Hubs, Coordinates, MRT-6 Metro Rail, Local Buses, Legunas, and Connector Rickshaws.
"""

DHAKA_HUBS = {
    # --- MRT-6 Official Stations (Uttara North to Kamalapur) ---
    "Uttara North": {
        "id": "hub-uttara-north",
        "name": "Uttara North",
        "name_bn": "উত্তরা উত্তর (দিয়াবাড়ী)",
        "lat": 23.8755,
        "lng": 90.3807,
        "landmarks": ["Diabari Metro Terminal", "Sector 15 Playground", "DMTCL Depot", "Metro Gate 1 & 2"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-UTN",
        "zone": "MRT-6 North Terminal"
    },
    "Uttara Center": {
        "id": "hub-uttara-center",
        "name": "Uttara Center",
        "name_bn": "উত্তরা সেন্টার",
        "lat": 23.8645,
        "lng": 90.3785,
        "landmarks": ["Sector 16/17 Bridge", "Uttara Sector 17 Avenue", "Metro Gate 1"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-UTC",
        "zone": "MRT-6 Sector 16/17"
    },
    "Uttara South": {
        "id": "hub-uttara-south",
        "name": "Uttara South",
        "name_bn": "উত্তরা দক্ষিণ",
        "lat": 23.8540,
        "lng": 90.3752,
        "landmarks": ["Sector 18 Connector", "Sonargaon Janapath Road", "Metro Gate 2"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-UTS",
        "zone": "MRT-6 Sector 18"
    },
    "Pallabi": {
        "id": "hub-pallabi",
        "name": "Pallabi",
        "name_bn": "পল্লবী",
        "lat": 23.8340,
        "lng": 90.3660,
        "landmarks": ["Purobi Cinema Hall", "Pallabi Thana", "Mirpur 12 Bus Stand", "Metro Gate A"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-PAL",
        "zone": "MRT-6 Mirpur 12"
    },
    "Mirpur 11": {
        "id": "hub-mirpur11",
        "name": "Mirpur 11",
        "name_bn": "মিরপুর ১১",
        "lat": 23.8210,
        "lng": 90.3670,
        "landmarks": ["Avenue 3", "Mirpur 11 Bus Stand", "Bihari Camp Junction", "Metro Gate 1"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-M11",
        "zone": "MRT-6 Mirpur 11"
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
        "zone": "MRT-6 Transit Interchange"
    },
    "Kazipara": {
        "id": "hub-kazipara",
        "name": "Kazipara",
        "name_bn": "কাজীপাড়া",
        "lat": 23.7950,
        "lng": 90.3720,
        "landmarks": ["Kazipara Bus Stand", "Begum Rokeya Sarani", "Metro Gate 2"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-KAZ",
        "zone": "MRT-6 Rokeya Sarani"
    },
    "Shewrapara": {
        "id": "hub-shewrapara",
        "name": "Shewrapara",
        "name_bn": "শেওড়াপাড়া",
        "lat": 23.7875,
        "lng": 90.3745,
        "landmarks": ["West Kafrul Road", "Shewrapara Bazar", "Metro Gate 1"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-SHW",
        "zone": "MRT-6 West Kafrul"
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
        "zone": "MRT-6 Administrative Hub"
    },
    "Bijoy Sarani": {
        "id": "hub-bijoy-sarani",
        "name": "Bijoy Sarani",
        "name_bn": "বিজয় সরণি",
        "lat": 23.7650,
        "lng": 90.3850,
        "landmarks": ["Old Airport Road", "Rangs Bhaban", "Novo Theatre", "Air Force Museum", "Metro Gate A"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-BJS",
        "zone": "MRT-6 Khamarbari / Old Airport"
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
        "zone": "MRT-6 Transit Interchange"
    },
    "Karwan Bazar": {
        "id": "hub-karwan-bazar",
        "name": "Karwan Bazar",
        "name_bn": "কারওয়ান বাজার",
        "lat": 23.7485,
        "lng": 90.3920,
        "landmarks": ["SAARC Fountain", "Pan Pacific Sonargaon", "Petrobangla", "Metro Gate 2"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-KBZ",
        "zone": "MRT-6 Commercial District"
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
        "zone": "MRT-6 University / Medical Hub"
    },
    "Dhaka University": {
        "id": "hub-du",
        "name": "Dhaka University",
        "name_bn": "ঢাকা বিশ্ববিদ্যালয় (টিএসসি)",
        "lat": 23.7315,
        "lng": 90.3965,
        "landmarks": ["TSC (Teacher Student Centre)", "Curzon Hall", "Doyel Chattar", "Central Library", "Metro Gate A"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-DU",
        "zone": "MRT-6 Academic Corridor"
    },
    "Bangladesh Secretariat": {
        "id": "hub-secretariat",
        "name": "Bangladesh Secretariat",
        "name_bn": "বাংলাদেশ সচিবালয় (প্রেস ক্লাব)",
        "lat": 23.7290,
        "lng": 90.4075,
        "landmarks": ["National Press Club", "Cabinet Division", "Abdul Gani Road", "Topkhana Road", "Metro Gate 1"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-SEC",
        "zone": "MRT-6 Government Hub"
    },
    "Motijheel": {
        "id": "hub-motijheel",
        "name": "Motijheel",
        "name_bn": "মতিঝিল",
        "lat": 23.7270,
        "lng": 90.4180,
        "landmarks": ["Shapla Chattar", "Bangladesh Bank HQ", "Sonali Bank HQ", "Metro Exit B"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-MJL",
        "zone": "MRT-6 Commercial Terminal"
    },
    "Kamalapur": {
        "id": "hub-kamalapur",
        "name": "Kamalapur",
        "name_bn": "কমলাপুর",
        "lat": 23.7318,
        "lng": 90.4255,
        "landmarks": ["Kamalapur Central Railway Station", "ICD Container Yard", "Railway Overbridge", "Metro East Terminal"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-KMP",
        "zone": "MRT-6 Central Railway Hub"
    },
    # --- Major Road Transit Hubs ---
    "Uttara": {
        "id": "hub-uttara",
        "name": "Uttara",
        "name_bn": "উত্তরা (আজমপুর / রাজলক্ষ্মী)",
        "lat": 23.8755,
        "lng": 90.3807,
        "landmarks": ["House Building", "Rajlakshmi Complex", "Azampur Bus Stand", "Metro North Station"],
        "is_metro_station": True,
        "metro_station_code": "MRT6-UTN",
        "zone": "North Suburban"
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
    "Jatrabari": {
        "id": "hub-jatrabari",
        "name": "Jatrabari",
        "name_bn": "যাত্রাবাড়ী",
        "lat": 23.7115,
        "lng": 90.4344,
        "landmarks": ["Mayor Hanif Flyover Entry", "Jatrabari Chourasta", "Golapbagh Field", "Donia Mor"],
        "is_metro_station": False,
        "zone": "South-East Entryway"
    },
    "Sadarghat": {
        "id": "hub-sadarghat",
        "name": "Sadarghat",
        "name_bn": "সদরঘাট (পুরান ঢাকা)",
        "lat": 23.7081,
        "lng": 90.4124,
        "landmarks": ["Ahsan Manzil (Pink Palace)", "Sadarghat Launch Terminal", "Bahadur Shah Park"],
        "is_metro_station": False,
        "zone": "Puran Dhaka Heritage / Riverport"
    },
    "Lalbagh": {
        "id": "hub-lalbagh",
        "name": "Lalbagh",
        "name_bn": "লালবাগ কেল্লা (চকবাজার)",
        "lat": 23.7189,
        "lng": 90.3881,
        "landmarks": ["Lalbagh Fort", "Chawkbazar Shahi Masjid", "Shaista Khan Gate"],
        "is_metro_station": False,
        "zone": "Mughal Heritage / Old Dhaka"
    }
}

# Official MRT-6 Station to Station Fares (in BDT) from DMTCL Official Fare Chart
# (Dhaka Mass Transit Company Limited - Road Transport and Highways Division)
# Rules: No student half-pass discount. MRT Pass/Rapid Pass gives 10% discount on each trip.
# Single Journey tickets valid for 100 minutes inside paid area.

MRT6_STATIONS_LIST = [
    {"code": "UTN", "name": "Uttara North", "name_bn": "উত্তরা উত্তর"},
    {"code": "UTC", "name": "Uttara Center", "name_bn": "উত্তরা সেন্টার"},
    {"code": "UTS", "name": "Uttara South", "name_bn": "উত্তরা দক্ষিণ"},
    {"code": "PAL", "name": "Pallabi", "name_bn": "পল্লবী"},
    {"code": "M11", "name": "Mirpur 11", "name_bn": "মিরপুর ১১"},
    {"code": "M10", "name": "Mirpur 10", "name_bn": "মিরপুর ১০"},
    {"code": "KAZ", "name": "Kazipara", "name_bn": "কাজীপাড়া"},
    {"code": "SHW", "name": "Shewrapara", "name_bn": "শেওড়াপাড়া"},
    {"code": "AGA", "name": "Agargaon", "name_bn": "আগারগাঁও"},
    {"code": "BJS", "name": "Bijoy Sarani", "name_bn": "বিজয় সরণি"},
    {"code": "FMG", "name": "Farmgate", "name_bn": "ফার্মগেট"},
    {"code": "KBZ", "name": "Karwan Bazar", "name_bn": "কারওয়ান বাজার"},
    {"code": "SHB", "name": "Shahbagh", "name_bn": "শাহবাগ"},
    {"code": "DU",  "name": "Dhaka University", "name_bn": "ঢাকা বিশ্ববিদ্যালয়"},
    {"code": "SEC", "name": "Bangladesh Secretariat", "name_bn": "বাংলাদেশ সচিবালয়"},
    {"code": "MJL", "name": "Motijheel", "name_bn": "মতিঝিল"},
    {"code": "KMP", "name": "Kamalapur", "name_bn": "কমলাপুর"}
]

MRT6_STATION_ALIASES = {
    "uttara": "Uttara North",
    "uttara north": "Uttara North",
    "uttara center": "Uttara Center",
    "uttara south": "Uttara South",
    "pallabi": "Pallabi",
    "mirpur 11": "Mirpur 11",
    "mirpur 10": "Mirpur 10",
    "kazipara": "Kazipara",
    "shewrapara": "Shewrapara",
    "agargaon": "Agargaon",
    "bijoy sarani": "Bijoy Sarani",
    "farmgate": "Farmgate",
    "karwan bazar": "Karwan Bazar",
    "kawran bazar": "Karwan Bazar",
    "shahbagh": "Shahbagh",
    "shahbag": "Shahbagh",
    "dhaka university": "Dhaka University",
    "du": "Dhaka University",
    "tsc": "Dhaka University",
    "bangladesh secretariat": "Bangladesh Secretariat",
    "secretariat": "Bangladesh Secretariat",
    "press club": "Bangladesh Secretariat",
    "motijheel": "Motijheel",
    "kamalapur": "Kamalapur",
    "kamalapur railway": "Kamalapur"
}

# Hub-level MRT-6 Fare Table for transit graph routing
MRT6_FARE_TABLE = {
    ("Uttara", "Mirpur 10"): 40,
    ("Uttara", "Agargaon"): 50,
    ("Uttara", "Farmgate"): 70,
    ("Uttara", "Shahbagh"): 80,
    ("Uttara", "Motijheel"): 100,
    ("Mirpur 10", "Agargaon"): 20,
    ("Mirpur 10", "Farmgate"): 30,
    ("Mirpur 10", "Shahbagh"): 40,
    ("Mirpur 10", "Motijheel"): 60,
    ("Agargaon", "Farmgate"): 20,
    ("Agargaon", "Shahbagh"): 30,
    ("Agargaon", "Motijheel"): 40,
    ("Farmgate", "Shahbagh"): 20,
    ("Farmgate", "Motijheel"): 30,
    ("Shahbagh", "Motijheel"): 20
}

# Complete 17x17 DMTCL official fare matrix
MRT6_FULL_STATION_FARE_MATRIX = {
    # 0: Uttara North
    ("Uttara North", "Uttara Center"): 20, ("Uttara North", "Uttara South"): 20, ("Uttara North", "Pallabi"): 30,
    ("Uttara North", "Mirpur 11"): 30, ("Uttara North", "Mirpur 10"): 40, ("Uttara North", "Kazipara"): 40,
    ("Uttara North", "Shewrapara"): 50, ("Uttara North", "Agargaon"): 60, ("Uttara North", "Bijoy Sarani"): 60,
    ("Uttara North", "Farmgate"): 70, ("Uttara North", "Karwan Bazar"): 80, ("Uttara North", "Shahbagh"): 80,
    ("Uttara North", "Dhaka University"): 90, ("Uttara North", "Bangladesh Secretariat"): 90,
    ("Uttara North", "Motijheel"): 100, ("Uttara North", "Kamalapur"): 100,

    # 1: Uttara Center
    ("Uttara Center", "Uttara South"): 20, ("Uttara Center", "Pallabi"): 20, ("Uttara Center", "Mirpur 11"): 30,
    ("Uttara Center", "Mirpur 10"): 30, ("Uttara Center", "Kazipara"): 40, ("Uttara Center", "Shewrapara"): 40,
    ("Uttara Center", "Agargaon"): 50, ("Uttara Center", "Bijoy Sarani"): 50, ("Uttara Center", "Farmgate"): 60,
    ("Uttara Center", "Karwan Bazar"): 70, ("Uttara Center", "Shahbagh"): 70, ("Uttara Center", "Dhaka University"): 80,
    ("Uttara Center", "Bangladesh Secretariat"): 80, ("Uttara Center", "Motijheel"): 90, ("Uttara Center", "Kamalapur"): 90,

    # 2: Uttara South
    ("Uttara South", "Pallabi"): 20, ("Uttara South", "Mirpur 11"): 20, ("Uttara South", "Mirpur 10"): 30,
    ("Uttara South", "Kazipara"): 30, ("Uttara South", "Shewrapara"): 40, ("Uttara South", "Agargaon"): 40,
    ("Uttara South", "Bijoy Sarani"): 50, ("Uttara South", "Farmgate"): 60, ("Uttara South", "Karwan Bazar"): 60,
    ("Uttara South", "Shahbagh"): 70, ("Uttara South", "Dhaka University"): 70, ("Uttara South", "Bangladesh Secretariat"): 80,
    ("Uttara South", "Motijheel"): 80, ("Uttara South", "Kamalapur"): 90,

    # 3: Pallabi
    ("Pallabi", "Mirpur 11"): 20, ("Pallabi", "Mirpur 10"): 20, ("Pallabi", "Kazipara"): 20,
    ("Pallabi", "Shewrapara"): 30, ("Pallabi", "Agargaon"): 30, ("Pallabi", "Bijoy Sarani"): 40,
    ("Pallabi", "Farmgate"): 50, ("Pallabi", "Karwan Bazar"): 50, ("Pallabi", "Shahbagh"): 60,
    ("Pallabi", "Dhaka University"): 60, ("Pallabi", "Bangladesh Secretariat"): 70, ("Pallabi", "Motijheel"): 70,
    ("Pallabi", "Kamalapur"): 80,

    # 4: Mirpur 11
    ("Mirpur 11", "Mirpur 10"): 20, ("Mirpur 11", "Kazipara"): 20, ("Mirpur 11", "Shewrapara"): 20,
    ("Mirpur 11", "Agargaon"): 30, ("Mirpur 11", "Bijoy Sarani"): 40, ("Mirpur 11", "Farmgate"): 40,
    ("Mirpur 11", "Karwan Bazar"): 50, ("Mirpur 11", "Shahbagh"): 50, ("Mirpur 11", "Dhaka University"): 60,
    ("Mirpur 11", "Bangladesh Secretariat"): 60, ("Mirpur 11", "Motijheel"): 70, ("Mirpur 11", "Kamalapur"): 70,

    # 5: Mirpur 10
    ("Mirpur 10", "Kazipara"): 20, ("Mirpur 10", "Shewrapara"): 20, ("Mirpur 10", "Agargaon"): 20,
    ("Mirpur 10", "Bijoy Sarani"): 30, ("Mirpur 10", "Farmgate"): 30, ("Mirpur 10", "Karwan Bazar"): 40,
    ("Mirpur 10", "Shahbagh"): 40, ("Mirpur 10", "Dhaka University"): 50, ("Mirpur 10", "Bangladesh Secretariat"): 50,
    ("Mirpur 10", "Motijheel"): 60, ("Mirpur 10", "Kamalapur"): 60,

    # 6: Kazipara
    ("Kazipara", "Shewrapara"): 20, ("Kazipara", "Agargaon"): 20, ("Kazipara", "Bijoy Sarani"): 20,
    ("Kazipara", "Farmgate"): 30, ("Kazipara", "Karwan Bazar"): 30, ("Kazipara", "Shahbagh"): 40,
    ("Kazipara", "Dhaka University"): 40, ("Kazipara", "Bangladesh Secretariat"): 50, ("Kazipara", "Motijheel"): 50,
    ("Kazipara", "Kamalapur"): 60,

    # 7: Shewrapara
    ("Shewrapara", "Agargaon"): 20, ("Shewrapara", "Bijoy Sarani"): 20, ("Shewrapara", "Farmgate"): 20,
    ("Shewrapara", "Karwan Bazar"): 30, ("Shewrapara", "Shahbagh"): 30, ("Shewrapara", "Dhaka University"): 40,
    ("Shewrapara", "Bangladesh Secretariat"): 40, ("Shewrapara", "Motijheel"): 50, ("Shewrapara", "Kamalapur"): 50,

    # 8: Agargaon
    ("Agargaon", "Bijoy Sarani"): 20, ("Agargaon", "Farmgate"): 20, ("Agargaon", "Karwan Bazar"): 20,
    ("Agargaon", "Shahbagh"): 30, ("Agargaon", "Dhaka University"): 30, ("Agargaon", "Bangladesh Secretariat"): 40,
    ("Agargaon", "Motijheel"): 40, ("Agargaon", "Kamalapur"): 50,

    # 9: Bijoy Sarani
    ("Bijoy Sarani", "Farmgate"): 20, ("Bijoy Sarani", "Karwan Bazar"): 20, ("Bijoy Sarani", "Shahbagh"): 20,
    ("Bijoy Sarani", "Dhaka University"): 30, ("Bijoy Sarani", "Bangladesh Secretariat"): 30,
    ("Bijoy Sarani", "Motijheel"): 40, ("Bijoy Sarani", "Kamalapur"): 40,

    # 10: Farmgate
    ("Farmgate", "Karwan Bazar"): 20, ("Farmgate", "Shahbagh"): 20, ("Farmgate", "Dhaka University"): 20,
    ("Farmgate", "Bangladesh Secretariat"): 30, ("Farmgate", "Motijheel"): 30, ("Farmgate", "Kamalapur"): 40,

    # 11: Karwan Bazar
    ("Karwan Bazar", "Shahbagh"): 20, ("Karwan Bazar", "Dhaka University"): 20,
    ("Karwan Bazar", "Bangladesh Secretariat"): 20, ("Karwan Bazar", "Motijheel"): 30, ("Karwan Bazar", "Kamalapur"): 30,

    # 12: Shahbagh
    ("Shahbagh", "Dhaka University"): 20, ("Shahbagh", "Bangladesh Secretariat"): 20,
    ("Shahbagh", "Motijheel"): 20, ("Shahbagh", "Kamalapur"): 30,

    # 13: Dhaka University
    ("Dhaka University", "Bangladesh Secretariat"): 20, ("Dhaka University", "Motijheel"): 20,
    ("Dhaka University", "Kamalapur"): 20,

    # 14: Bangladesh Secretariat
    ("Bangladesh Secretariat", "Motijheel"): 20, ("Bangladesh Secretariat", "Kamalapur"): 20,

    # 15: Motijheel
    ("Motijheel", "Kamalapur"): 20
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
        "hubs": [
            "Uttara North", "Uttara Center", "Uttara South", "Pallabi",
            "Mirpur 11", "Mirpur 10", "Kazipara", "Shewrapara",
            "Agargaon", "Bijoy Sarani", "Farmgate", "Karwan Bazar",
            "Shahbagh", "Dhaka University", "Bangladesh Secretariat",
            "Motijheel", "Kamalapur"
        ],
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
    },
    {
        "id": "route-a101-shikhor",
        "name": "Shikhor Paribahan (A-101)",
        "name_bn": "শিকর পরিবহন (এ-১০১)",
        "type": "bus",
        "operator": "Shikhor Paribahan Ltd",
        "color": "#d97706",
        "student_pass_allowed": True,
        "frequency_mins": 8,
        "hubs": ["Mirpur 10", "Farmgate", "Shahbagh", "Motijheel", "Jatrabari"],
        "landmark_instructions": "Mirpur 10: Roundabout pillar 184. Farmgate: Ananda Cinema. Shahbagh: PG Hospital. Jatrabari: Flyover ramp."
    },
    {
        "id": "route-a102-bihanga",
        "name": "Bihanga Paribahan (A-102)",
        "name_bn": "বিহঙ্গ পরিবহন (এ-১০২)",
        "type": "bus",
        "operator": "Bihanga Transport Ltd",
        "color": "#2563eb",
        "student_pass_allowed": True,
        "frequency_mins": 10,
        "hubs": ["Mirpur 10", "Agargaon", "Farmgate", "Shahbagh"],
        "landmark_instructions": "Pallabi/Mirpur 10 to Sadarghat corridor via Agargaon IDB, Farmgate Khamarbari, Shahbagh National Museum."
    },
    {
        "id": "route-a105-shadhin",
        "name": "Shadhin Paribahan (A-105)",
        "name_bn": "স্বাধীন পরিবহন (এ-১০৫)",
        "type": "bus",
        "operator": "Shadhin Transport",
        "color": "#059669",
        "student_pass_allowed": True,
        "frequency_mins": 12,
        "hubs": ["Mirpur 10", "Agargaon", "Dhanmondi", "Science Lab"],
        "landmark_instructions": "Duaripara/Mirpur 10 to Science Lab via Agargaon, Manik Mia Ave, Dhanmondi 27."
    },
    {
        "id": "route-a115-baishakhi",
        "name": "Baishakhi Paribahan (A-115)",
        "name_bn": "বৈশাখী পরিবহন (এ-১১৫)",
        "type": "bus",
        "operator": "Baishakhi Super Service",
        "color": "#dc2626",
        "student_pass_allowed": True,
        "frequency_mins": 10,
        "hubs": ["Mirpur 10", "Science Lab", "Shahbagh", "Motijheel", "Jatrabari"],
        "landmark_instructions": "Mirpur-1/10 to Jatrabari via Shyamoli, Science Lab Priyangon, Shahbagh, Bangladesh Bank."
    },
    {
        "id": "route-a132-dhakaparibahan",
        "name": "Dhaka Paribahan (A-132)",
        "name_bn": "ঢাকা পরিবহন (এ-১৩২)",
        "type": "bus",
        "operator": "Dhaka Paribahan Ltd",
        "color": "#7c3aed",
        "student_pass_allowed": True,
        "frequency_mins": 12,
        "hubs": ["Uttara", "Mohakhali", "Farmgate", "Shahbagh"],
        "landmark_instructions": "Baipail/Uttara House Building to Sadarghat via Mohakhali Terminal, Farmgate, Shahbagh."
    },
    {
        "id": "route-a141-almekka",
        "name": "Al-Mekka Paribahan (A-141)",
        "name_bn": "আল-মক্কা পরিবহন (এ-১৪১)",
        "type": "bus",
        "operator": "Al-Mekka Transport",
        "color": "#0284c7",
        "student_pass_allowed": True,
        "frequency_mins": 10,
        "hubs": ["Banasree", "Mohakhali", "Agargaon", "Mohammadpur"],
        "landmark_instructions": "Banasree Block C to Mohammadpur Shia Mosque via Rampura, Mohakhali Wireless, Agargaon, Shyamoli."
    },
    {
        "id": "route-a160-midline",
        "name": "Midline Paribahan (A-160)",
        "name_bn": "মিডলাইন পরিবহন (এ-১৬০)",
        "type": "bus",
        "operator": "Midline Express",
        "color": "#ea580c",
        "student_pass_allowed": True,
        "frequency_mins": 12,
        "hubs": ["Mohammadpur", "Science Lab", "Shahbagh", "Motijheel", "Jatrabari"],
        "landmark_instructions": "Mohammadpur Japan Garden City to Postogola via Science Lab City College, Shahbagh, Motijheel, Jatrabari."
    },
    {
        "id": "route-a170-labbaik",
        "name": "Labbaik Paribahan (A-170)",
        "name_bn": "লাব্বাইক পরিবহন (এ-১৭০)",
        "type": "bus",
        "operator": "Labbaik Transport Ltd",
        "color": "#16a34a",
        "student_pass_allowed": True,
        "frequency_mins": 8,
        "hubs": ["Farmgate", "Shahbagh", "Motijheel", "Jatrabari"],
        "landmark_instructions": "Savar/Gabtoli to Narayanganj via Farmgate Ananda Cinema, Shahbagh, Motijheel Shapla Chattar, Jatrabari."
    }
]

# Physical Distance & Baseline Travel Time Between Connected Hubs
# Format: (Origin, Destination): {"distance_km": float, "base_time_mins": int, "rickshaw_base_bdt": int}
TRANSIT_EDGES = {
    # --- MRT-6 Inter-station Elevated Rail Segments ---
    ("Uttara North", "Uttara Center"): {"distance_km": 1.3, "base_time_mins": 3, "rickshaw_base_bdt": 35},
    ("Uttara Center", "Uttara South"): {"distance_km": 1.2, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Uttara South", "Pallabi"): {"distance_km": 2.3, "base_time_mins": 4, "rickshaw_base_bdt": 50},
    ("Pallabi", "Mirpur 11"): {"distance_km": 1.5, "base_time_mins": 3, "rickshaw_base_bdt": 40},
    ("Mirpur 11", "Mirpur 10"): {"distance_km": 1.6, "base_time_mins": 3, "rickshaw_base_bdt": 40},
    ("Mirpur 10", "Kazipara"): {"distance_km": 1.4, "base_time_mins": 3, "rickshaw_base_bdt": 35},
    ("Kazipara", "Shewrapara"): {"distance_km": 1.0, "base_time_mins": 2, "rickshaw_base_bdt": 30},
    ("Shewrapara", "Agargaon"): {"distance_km": 1.2, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Agargaon", "Bijoy Sarani"): {"distance_km": 1.6, "base_time_mins": 3, "rickshaw_base_bdt": 40},
    ("Bijoy Sarani", "Farmgate"): {"distance_km": 1.2, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Farmgate", "Karwan Bazar"): {"distance_km": 1.1, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Karwan Bazar", "Shahbagh"): {"distance_km": 1.2, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Shahbagh", "Dhaka University"): {"distance_km": 0.9, "base_time_mins": 2, "rickshaw_base_bdt": 30},
    ("Dhaka University", "Bangladesh Secretariat"): {"distance_km": 1.3, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Bangladesh Secretariat", "Motijheel"): {"distance_km": 1.2, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Motijheel", "Kamalapur"): {"distance_km": 1.1, "base_time_mins": 2, "rickshaw_base_bdt": 35},
    ("Uttara", "Uttara North"): {"distance_km": 0.2, "base_time_mins": 2, "rickshaw_base_bdt": 20},

    # --- Surface Transit Corridor Hubs ---
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
    ("Agargaon", "Mohakhali"): {"distance_km": 3.6, "base_time_mins": 15, "rickshaw_base_bdt": 70},
    ("Mohammadpur", "Agargaon"): {"distance_km": 3.5, "base_time_mins": 14, "rickshaw_base_bdt": 65},
    ("Mohakhali", "Banasree"): {"distance_km": 4.8, "base_time_mins": 20, "rickshaw_base_bdt": 90},
    ("Shahbagh", "Jatrabari"): {"distance_km": 6.2, "base_time_mins": 25, "rickshaw_base_bdt": 110},
    ("Farmgate", "Jatrabari"): {"distance_km": 9.2, "base_time_mins": 35, "rickshaw_base_bdt": 160},
    ("Farmgate", "Uttara"): {"distance_km": 11.5, "base_time_mins": 38, "rickshaw_base_bdt": 220},
    ("Malibagh", "Mohakhali"): {"distance_km": 4.5, "base_time_mins": 18, "rickshaw_base_bdt": 80},
    ("Agargaon", "Dhanmondi"): {"distance_km": 3.8, "base_time_mins": 15, "rickshaw_base_bdt": 70}
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
