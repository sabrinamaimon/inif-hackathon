export const STATIC_HUBS = {
  "Motijheel": {
    "id": "hub-motijheel",
    "name": "Motijheel",
    "name_bn": "মতিঝিল",
    "lat": 23.7330,
    "lng": 90.4172,
    "landmarks": ["Shapla Chattar", "Bangladesh Bank", "Metro Exit B"],
    "is_metro_station": true,
    "zone": "Central Commercial"
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
  "Shahbagh": {
    "id": "hub-shahbagh",
    "name": "Shahbagh",
    "name_bn": "শাহবাগ",
    "lat": 23.7383,
    "lng": 90.3956,
    "landmarks": ["BSMMU (PG Hospital)", "National Museum", "Metro Exit 1"],
    "is_metro_station": true,
    "zone": "University / Central"
  },
  "Farmgate": {
    "id": "hub-farmgate",
    "name": "Farmgate",
    "name_bn": "ফার্মগেট",
    "lat": 23.7561,
    "lng": 90.3872,
    "landmarks": ["Ananda Cinema Hall", "Foot-overbridge", "Metro Exit A"],
    "is_metro_station": true,
    "zone": "Central Transit Hub"
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
  "Mirpur 10": {
    "id": "hub-mirpur10",
    "name": "Mirpur 10",
    "name_bn": "মিরপুর ১০",
    "lat": 23.8070,
    "lng": 90.3686,
    "landmarks": ["Mirpur 10 Roundabout", "Metro Pillar 184", "Benarosi Palli"],
    "is_metro_station": true,
    "zone": "North Transit Hub"
  },
  "Agargaon": {
    "id": "hub-agargaon",
    "name": "Agargaon",
    "name_bn": "আগারগাঁও",
    "lat": 23.7785,
    "lng": 90.3780,
    "landmarks": ["Passport Office Road", "IDB Bhaban", "Metro Gate 2"],
    "is_metro_station": true,
    "zone": "Administrative Hub"
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
  "Uttara": {
    "id": "hub-uttara",
    "name": "Uttara",
    "name_bn": "উত্তরা",
    "lat": 23.8759,
    "lng": 90.3795,
    "landmarks": ["House Building", "Rajlakshmi Complex", "Metro North Station"],
    "is_metro_station": true,
    "zone": "North Suburban"
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
  }
];

export const STATIC_EMERGENCY_CONTACTS = [
  { name: "Dhaka Traffic Control", name_bn: "ঢাকা ট্রাফিক কন্ট্রোল রুম", phone: "01713398500", desc: "Live Traffic Updates & Police Assistance" },
  { name: "DMP Central Helpline", name_bn: "ডিএমপি জরুরি সেবা", phone: "999", desc: "National Emergency Service (Police, Fire, Ambulance)" },
  { name: "Fire Service Emergency", name_bn: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স", phone: "16163", desc: "Flood evacuation, water rescue & fires" },
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

