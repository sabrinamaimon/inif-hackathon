// Official MRT-6 Metro Rail Alignment (17 Stations from Uttara North to Kamalapur)
export const MRT6_ALIGNMENT = [
  [23.8755, 90.3807], // 1. Uttara North (উত্তরা উত্তর)
  [23.8645, 90.3785], // 2. Uttara Center (উত্তরা সেন্টার)
  [23.8540, 90.3752], // 3. Uttara South (উত্তরা দক্ষিণ)
  [23.8340, 90.3660], // 4. Pallabi (পল্লবী)
  [23.8210, 90.3670], // 5. Mirpur 11 (মিরপুর ১১)
  [23.8070, 90.3686], // 6. Mirpur 10 (মিরপুর ১০)
  [23.7950, 90.3720], // 7. Kazipara (কাজীপাড়া)
  [23.7875, 90.3745], // 8. Shewrapara (শেওড়াপাড়া)
  [23.7785, 90.3780], // 9. Agargaon (আগারগাঁও)
  [23.7650, 90.3850], // 10. Bijoy Sarani (বিজয় সরণি)
  [23.7561, 90.3872], // 11. Farmgate (ফার্মগেট)
  [23.7485, 90.3920], // 12. Karwan Bazar (কারওয়ান বাজার)
  [23.7383, 90.3956], // 13. Shahbagh (শাহবাগ)
  [23.7315, 90.3965], // 14. Dhaka University (ঢাকা বিশ্ববিদ্যালয়)
  [23.7290, 90.4075], // 15. Bangladesh Secretariat (বাংলাদেশ সচিবালয়)
  [23.7270, 90.4180], // 16. Motijheel (মতিঝিল)
  [23.7318, 90.4255]  // 17. Kamalapur (কমলাপুর)
];

export const MRT6_STATIONS_DATA = [
  { code: "MRT6-UTN", name: "Uttara North", name_bn: "উত্তরা উত্তর (দিয়াবাড়ী)", lat: 23.8755, lng: 90.3807, order: 1 },
  { code: "MRT6-UTC", name: "Uttara Center", name_bn: "উত্তরা সেন্টার", lat: 23.8645, lng: 90.3785, order: 2 },
  { code: "MRT6-UTS", name: "Uttara South", name_bn: "উত্তরা দক্ষিণ", lat: 23.8540, lng: 90.3752, order: 3 },
  { code: "MRT6-PAL", name: "Pallabi", name_bn: "পল্লবী", lat: 23.8340, lng: 90.3660, order: 4 },
  { code: "MRT6-M11", name: "Mirpur 11", name_bn: "মিরপুর ১১", lat: 23.8210, lng: 90.3670, order: 5 },
  { code: "MRT6-M10", name: "Mirpur 10", name_bn: "মিরপুর ১০", lat: 23.8070, lng: 90.3686, order: 6 },
  { code: "MRT6-KAZ", name: "Kazipara", name_bn: "কাজীপাড়া", lat: 23.7950, lng: 90.3720, order: 7 },
  { code: "MRT6-SHW", name: "Shewrapara", name_bn: "শেওড়াপাড়া", lat: 23.7875, lng: 90.3745, order: 8 },
  { code: "MRT6-AGA", name: "Agargaon", name_bn: "আগারগাঁও", lat: 23.7785, lng: 90.3780, order: 9 },
  { code: "MRT6-BJS", name: "Bijoy Sarani", name_bn: "বিজয় সরণি", lat: 23.7650, lng: 90.3850, order: 10 },
  { code: "MRT6-FMG", name: "Farmgate", name_bn: "ফার্মগেট", lat: 23.7561, lng: 90.3872, order: 11 },
  { code: "MRT6-KBZ", name: "Karwan Bazar", name_bn: "কারওয়ান বাজার", lat: 23.7485, lng: 90.3920, order: 12 },
  { code: "MRT6-SHB", name: "Shahbagh", name_bn: "শাহবাগ", lat: 23.7383, lng: 90.3956, order: 13 },
  { code: "MRT6-DU",  name: "Dhaka University", name_bn: "ঢাকা বিশ্ববিদ্যালয়", lat: 23.7315, lng: 90.3965, order: 14 },
  { code: "MRT6-SEC", name: "Bangladesh Secretariat", name_bn: "বাংলাদেশ সচিবালয়", lat: 23.7290, lng: 90.4075, order: 15 },
  { code: "MRT6-MJL", name: "Motijheel", name_bn: "মতিঝিল", lat: 23.7270, lng: 90.4180, order: 16 },
  { code: "MRT6-KMP", name: "Kamalapur", name_bn: "কমলাপুর", lat: 23.7318, lng: 90.4255, order: 17 }
];

export const STATIC_HUBS = {
  // --- All 17 Official MRT-6 Stations ---
  "Uttara North": {
    "id": "hub-uttara-north",
    "name": "Uttara North",
    "name_bn": "উত্তরা উত্তর (দিয়াবাড়ী)",
    "lat": 23.8755,
    "lng": 90.3807,
    "landmarks": ["Diabari Metro Terminal", "Sector 15 Playground", "DMTCL Depot", "Metro Gate 1 & 2"],
    "is_metro_station": true,
    "metro_code": "MRT6-UTN",
    "station_order": 1,
    "zone": "MRT-6 North Terminal"
  },
  "Uttara Center": {
    "id": "hub-uttara-center",
    "name": "Uttara Center",
    "name_bn": "উত্তরা সেন্টার",
    "lat": 23.8645,
    "lng": 90.3785,
    "landmarks": ["Sector 16/17 Bridge", "Uttara Sector 17 Avenue", "Metro Gate 1"],
    "is_metro_station": true,
    "metro_code": "MRT6-UTC",
    "station_order": 2,
    "zone": "MRT-6 Sector 16/17"
  },
  "Uttara South": {
    "id": "hub-uttara-south",
    "name": "Uttara South",
    "name_bn": "উত্তরা দক্ষিণ",
    "lat": 23.8540,
    "lng": 90.3752,
    "landmarks": ["Sector 18 Connector", "Sonargaon Janapath Road", "Metro Gate 2"],
    "is_metro_station": true,
    "metro_code": "MRT6-UTS",
    "station_order": 3,
    "zone": "MRT-6 Sector 18"
  },
  "Pallabi": {
    "id": "hub-pallabi",
    "name": "Pallabi",
    "name_bn": "পল্লবী",
    "lat": 23.8340,
    "lng": 90.3660,
    "landmarks": ["Purobi Cinema Hall", "Pallabi Thana", "Mirpur 12 Bus Stand", "Metro Gate A"],
    "is_metro_station": true,
    "metro_code": "MRT6-PAL",
    "station_order": 4,
    "zone": "MRT-6 Mirpur 12"
  },
  "Mirpur 11": {
    "id": "hub-mirpur11",
    "name": "Mirpur 11",
    "name_bn": "মিরপুর ১১",
    "lat": 23.8210,
    "lng": 90.3670,
    "landmarks": ["Avenue 3", "Mirpur 11 Bus Stand", "Bihari Camp Junction", "Metro Gate 1"],
    "is_metro_station": true,
    "metro_code": "MRT6-M11",
    "station_order": 5,
    "zone": "MRT-6 Mirpur 11"
  },
  "Mirpur 10": {
    "id": "hub-mirpur10",
    "name": "Mirpur 10",
    "name_bn": "মিরপুর ১০",
    "lat": 23.8070,
    "lng": 90.3686,
    "landmarks": ["Mirpur 10 Roundabout", "Fire Service Station", "Metro Pillar 184", "Benarosi Palli"],
    "is_metro_station": true,
    "metro_code": "MRT6-M10",
    "station_order": 6,
    "zone": "MRT-6 Mirpur Hub"
  },
  "Kazipara": {
    "id": "hub-kazipara",
    "name": "Kazipara",
    "name_bn": "কাজীপাড়া",
    "lat": 23.7950,
    "lng": 90.3720,
    "landmarks": ["Kazipara Bus Stand", "Begum Rokeya Sarani", "Metro Gate 2"],
    "is_metro_station": true,
    "metro_code": "MRT6-KAZ",
    "station_order": 7,
    "zone": "MRT-6 Rokeya Sarani"
  },
  "Shewrapara": {
    "id": "hub-shewrapara",
    "name": "Shewrapara",
    "name_bn": "শেওড়াপাড়া",
    "lat": 23.7875,
    "lng": 90.3745,
    "landmarks": ["West Kafrul Road", "Shewrapara Bazar", "Metro Gate 1"],
    "is_metro_station": true,
    "metro_code": "MRT6-SHW",
    "station_order": 8,
    "zone": "MRT-6 West Kafrul"
  },
  "Agargaon": {
    "id": "hub-agargaon",
    "name": "Agargaon",
    "name_bn": "আগারগাঁও",
    "lat": 23.7785,
    "lng": 90.3780,
    "landmarks": ["Passport Office Road", "Election Commission", "IDB Bhaban", "Metro Gate 2"],
    "is_metro_station": true,
    "metro_code": "MRT6-AGA",
    "station_order": 9,
    "zone": "MRT-6 Administrative Hub"
  },
  "Bijoy Sarani": {
    "id": "hub-bijoy-sarani",
    "name": "Bijoy Sarani",
    "name_bn": "বিজয় সরণি",
    "lat": 23.7650,
    "lng": 90.3850,
    "landmarks": ["Old Airport Road", "Rangs Bhaban", "Novo Theatre", "Air Force Museum", "Metro Gate A"],
    "is_metro_station": true,
    "metro_code": "MRT6-BJS",
    "station_order": 10,
    "zone": "MRT-6 Khamarbari / Airport Rd"
  },
  "Farmgate": {
    "id": "hub-farmgate",
    "name": "Farmgate",
    "name_bn": "ফার্মগেট",
    "lat": 23.7561,
    "lng": 90.3872,
    "landmarks": ["Ananda Cinema Hall", "Foot-overbridge", "Tejgaon College", "Khamarbari", "Metro Exit A"],
    "is_metro_station": true,
    "metro_code": "MRT6-FMG",
    "station_order": 11,
    "zone": "MRT-6 Central Transit Hub"
  },
  "Karwan Bazar": {
    "id": "hub-karwan-bazar",
    "name": "Karwan Bazar",
    "name_bn": "কারওয়ান বাজার",
    "lat": 23.7485,
    "lng": 90.3920,
    "landmarks": ["SAARC Fountain", "Pan Pacific Sonargaon", "Petrobangla", "Metro Gate 2"],
    "is_metro_station": true,
    "metro_code": "MRT6-KBZ",
    "station_order": 12,
    "zone": "MRT-6 Commercial District"
  },
  "Shahbagh": {
    "id": "hub-shahbagh",
    "name": "Shahbagh",
    "name_bn": "শাহবাগ",
    "lat": 23.7383,
    "lng": 90.3956,
    "landmarks": ["BSMMU (PG Hospital)", "National Museum", "BIRDEM Hospital", "DU Campus Gate", "Metro Exit 1"],
    "is_metro_station": true,
    "metro_code": "MRT6-SHB",
    "station_order": 13,
    "zone": "MRT-6 University / Medical"
  },
  "Dhaka University": {
    "id": "hub-du",
    "name": "Dhaka University",
    "name_bn": "ঢাকা বিশ্ববিদ্যালয় (টিএসসি)",
    "lat": 23.7315,
    "lng": 90.3965,
    "landmarks": ["TSC (Teacher Student Centre)", "Curzon Hall", "Doyel Chattar", "Central Library", "Metro Gate A"],
    "is_metro_station": true,
    "metro_code": "MRT6-DU",
    "station_order": 14,
    "zone": "MRT-6 Academic Corridor"
  },
  "Bangladesh Secretariat": {
    "id": "hub-secretariat",
    "name": "Bangladesh Secretariat",
    "name_bn": "বাংলাদেশ সচিবালয় (প্রেস ক্লাব)",
    "lat": 23.7290,
    "lng": 90.4075,
    "landmarks": ["National Press Club", "Cabinet Division", "Abdul Gani Road", "Topkhana Road", "Metro Gate 1"],
    "is_metro_station": true,
    "metro_code": "MRT6-SEC",
    "station_order": 15,
    "zone": "MRT-6 Government Hub"
  },
  "Motijheel": {
    "id": "hub-motijheel",
    "name": "Motijheel",
    "name_bn": "মতিঝিল",
    "lat": 23.7270,
    "lng": 90.4180,
    "landmarks": ["Shapla Chattar", "Bangladesh Bank HQ", "Sonali Bank HQ", "Metro Exit B"],
    "is_metro_station": true,
    "metro_code": "MRT6-MJL",
    "station_order": 16,
    "zone": "MRT-6 Commercial Terminal"
  },
  "Kamalapur": {
    "id": "hub-kamalapur",
    "name": "Kamalapur",
    "name_bn": "কমলাপুর",
    "lat": 23.7318,
    "lng": 90.4255,
    "landmarks": ["Kamalapur Central Railway Station", "ICD Container Yard", "Railway Overbridge", "Metro East Terminal"],
    "is_metro_station": true,
    "metro_code": "MRT6-KMP",
    "station_order": 17,
    "zone": "MRT-6 Central Railway Hub"
  },

  // --- Major Non-Metro Road Transit Hubs ---
  "Uttara": {
    "id": "hub-uttara",
    "name": "Uttara",
    "name_bn": "উত্তরা (আজমপুর / রাজলক্ষ্মী)",
    "lat": 23.8755,
    "lng": 90.3807,
    "landmarks": ["House Building", "Rajlakshmi Complex", "Azampur Bus Stand", "Metro North Station"],
    "is_metro_station": true,
    "metro_code": "MRT6-UTN",
    "station_order": 1,
    "zone": "North Suburban"
  },
  "Banasree": {
    "id": "hub-banasree",
    "name": "Banasree",
    "name_bn": "বনশ্রী",
    "lat": 23.7644,
    "lng": 90.4358,
    "landmarks": ["Rampura Bridge", "Block C Gate", "Farazy Hospital"],
    "is_metro_station": false,
    "zone": "East Residential"
  },
  "Malibagh": {
    "id": "hub-malibagh",
    "name": "Malibagh",
    "name_bn": "মালিবাগ",
    "lat": 23.7487,
    "lng": 90.4140,
    "landmarks": ["Malibagh Railgate", "Chowdhurypara", "Mouchak Market"],
    "is_metro_station": false,
    "zone": "Central East"
  },
  "Science Lab": {
    "id": "hub-sciencelab",
    "name": "Science Lab",
    "name_bn": "সায়েন্স ল্যাব",
    "lat": 23.7390,
    "lng": 90.3830,
    "landmarks": ["Dhaka City College", "Priyangon Shopping Center", "New Market Entry"],
    "is_metro_station": false,
    "zone": "Commercial / Educational"
  },
  "Dhanmondi": {
    "id": "hub-dhanmondi",
    "name": "Dhanmondi",
    "name_bn": "ধানমন্ডি",
    "lat": 23.7465,
    "lng": 90.3760,
    "landmarks": ["Dhanmondi 27 (Rapa Plaza)", "Dhanmondi 32 Bridge", "Shimanto Square"],
    "is_metro_station": false,
    "zone": "West Commercial / Residential"
  },
  "Mohammadpur": {
    "id": "hub-mohammadpur",
    "name": "Mohammadpur",
    "name_bn": "মোহাম্মদপুর",
    "lat": 23.7658,
    "lng": 90.3584,
    "landmarks": ["Mohammadpur Bus Stand", "Town Hall Market", "Allah Karim Mosque"],
    "is_metro_station": false,
    "zone": "West Residential"
  },
  "Mohakhali": {
    "id": "hub-mohakhali",
    "name": "Mohakhali",
    "name_bn": "মহাখালী",
    "lat": 23.7776,
    "lng": 90.4054,
    "landmarks": ["Inter-district Bus Terminal", "Wireless Gate", "ICDDR,B"],
    "is_metro_station": false,
    "zone": "North-Central Hub"
  },
  "Badda": {
    "id": "hub-badda",
    "name": "Badda",
    "name_bn": "বাড্ডা",
    "lat": 23.7806,
    "lng": 90.4267,
    "landmarks": ["Badda Link Road", "Suvastu Nazar Valley", "Uttar Badda Bazar"],
    "is_metro_station": false,
    "zone": "North-East Corridor"
  },
  "Jatrabari": {
    "id": "hub-jatrabari",
    "name": "Jatrabari",
    "name_bn": "যাত্রাবাড়ী",
    "lat": 23.7115,
    "lng": 90.4344,
    "landmarks": ["Mayor Hanif Flyover Entry", "Jatrabari Chourasta", "Golapbagh Field"],
    "is_metro_station": false,
    "zone": "South-East Entryway"
  },
  "Sadarghat": {
    "id": "hub-sadarghat",
    "name": "Sadarghat",
    "name_bn": "সদরঘাট (পুরান ঢাকা)",
    "lat": 23.7081,
    "lng": 90.4124,
    "landmarks": ["Ahsan Manzil (Pink Palace)", "Sadarghat Launch Terminal", "Bahadur Shah Park"],
    "is_metro_station": false,
    "zone": "Puran Dhaka Heritage / Riverport"
  },
  "Lalbagh": {
    "id": "hub-lalbagh",
    "name": "Lalbagh",
    "name_bn": "লালবাগ কেল্লা (চকবাজার)",
    "lat": 23.7189,
    "lng": 90.3881,
    "landmarks": ["Lalbagh Fort", "Chawkbazar Shahi Masjid", "Shaista Khan Gate"],
    "is_metro_station": false,
    "zone": "Mughal Heritage / Old Dhaka"
  }
};

export const STATIC_ALERTS = [
  {
    id: "alert-malibagh-rain",
    hub: "Malibagh",
    type: "waterlogging",
    title: "Severe Waterlogging at Malibagh Railgate",
    title_bn: "মালিবাগ রেলগেটে হাঁটু পানি ও জলজট",
    description: "Knee-deep water accumulating after heavy rainfall. Local buses and legunas stalled. Commuters advised to bypass via Kakrail or Shahbagh.",
    severity: 85,
    affected_modes: ["bus", "leguna", "rickshaw"],
    upvotes: 28,
    downvotes: 2,
    verified: true,
    minutes_ago: 18,
    is_active: true,
    trust_score: 92.4
  },
  {
    id: "alert-shahbagh-protest",
    hub: "Shahbagh",
    type: "blockade",
    title: "Student Movement Blockade at Shahbagh Roundabout",
    title_bn: "শাহবাগ মোড়ে সমাবেশ ও ব্যারিকেড",
    description: "Shahbagh central intersection occupied by student demonstration. Surface vehicles rerouted. MRT-6 Metro Rail operating normally.",
    severity: 92,
    affected_modes: ["bus", "rickshaw"],
    upvotes: 44,
    downvotes: 1,
    verified: true,
    minutes_ago: 25,
    is_active: true,
    trust_score: 95.8
  },
  {
    id: "alert-farmgate-gridlock",
    hub: "Farmgate",
    type: "gridlock",
    title: "Peak Hour Gridlock at Ananda Cinema Crossway",
    title_bn: "ফার্মগেটে আনন্দ সিনেমা হলের সামনে তীব্র যানজট",
    description: "Heavy bottle-neck heading towards Science Lab. Metro Rail recommended for North-South transit.",
    severity: 68,
    affected_modes: ["bus", "rickshaw"],
    upvotes: 15,
    downvotes: 3,
    verified: true,
    minutes_ago: 40,
    is_active: true,
    trust_score: 74.2
  },
  {
    id: "alert-sadarghat-rush",
    hub: "Sadarghat",
    type: "gridlock",
    title: "Old Dhaka Heritage Goli Gridlock near Ahsan Manzil",
    title_bn: "আহসান মঞ্জিল ও শাঁখারীবাজার গলিতে রিকশা জট",
    description: "Heavy pedestrian and connector rickshaw movement near Sadarghat Ghat. Walking recommended from Bahadur Shah Park.",
    severity: 62,
    affected_modes: ["rickshaw", "leguna"],
    upvotes: 31,
    downvotes: 1,
    verified: true,
    minutes_ago: 12,
    is_active: true,
    trust_score: 94.0
  }
];

export const STATIC_EMERGENCY_CONTACTS = [
  { name: "Dhaka Traffic Control", name_bn: "ঢাকা ট্রাফিক কন্ট্রোল রুম", phone: "01713398500", desc: "Live Traffic Updates & Police Assistance" },
  { name: "DMP Central Helpline", name_bn: "ডিএমপি জরুরি সেবা", phone: "999", desc: "National Emergency Service (Police, Fire, Ambulance)" },
  { name: "BIWTA Sadarghat Port Safety", name_bn: "বিআইডব্লিউটিএ সদরঘাট রিভার কন্ট্রোল", phone: "01715012345", desc: "Buriganga Riverways, Launch & Ghat Assistance" },
  { name: "MRT-6 Metro Helpline", name_bn: "মেট্রোরেল কন্ট্রোল রুম", phone: "16111", desc: "Train schedule, Rapid Pass issues & station assistance" }
];

export const STATIC_RIDESHARE = [
  {
    id: "ride-001",
    hub_origin: "Farmgate",
    destination: "Dhanmondi",
    vehicle_type: "rickshaw",
    total_fare_bdt: 60,
    seats_available: 1,
    seats_taken: 1,
    host_name: "Sadia (DU Student)",
    contact_phone: "01711-234567",
    departure_time: "Now (Next 10 mins)",
    split_fare_per_person: 30,
    notes: "Waiting near Ananda Cinema foot-overbridge. Need 1 co-rider to split rickshaw."
  },
  {
    id: "ride-002",
    hub_origin: "Agargaon",
    destination: "Mohakhali",
    vehicle_type: "cng",
    total_fare_bdt: 200,
    seats_available: 2,
    seats_taken: 2,
    host_name: "Fahim (Office Commuter)",
    contact_phone: "01822-987654",
    departure_time: "6:15 PM",
    split_fare_per_person: 67,
    notes: "CNG heading to Mohakhali Wireless. Metro gate 2 pickup."
  }
];

