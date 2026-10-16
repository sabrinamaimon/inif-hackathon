export { 
  MRT6_DENSE_POLYLINE, 
  BIKOLPO_DENSE_POLYLINE, 
  UTTARA_BUS_DENSE_POLYLINE, 
  BIKOLPO_STOPS, 
  UTTARA_BUS_STOPS 
} from './denseMapData.js';

// Official MRT-6 Metro Rail Alignment from Map Data transit-data.json & Routemap CSVs
export const MRT6_ALIGNMENT = [
  [23.86967, 90.36763], // 1. Uttara North (উত্তরা উত্তর)
  [23.85981, 90.36516], // 2. Uttara Center (উত্তরা সেন্টার)
  [23.84581, 90.36311], // 3. Uttara South (উত্তরা দক্ষিণ)
  [23.82615, 90.36427], // 4. Pallabi (পল্লবী)
  [23.81924, 90.36527], // 5. Mirpur 11 (মিরপুর ১১)
  [23.80813, 90.36833], // 6. Mirpur 10 (মিরপুর ১০)
  [23.79950, 90.37190], // 7. Kazipara (কাজীপাড়া)
  [23.79095, 90.37553], // 8. Shewrapara (শেওড়াপাড়া)
  [23.77842, 90.38015], // 9. Agargaon (আগারগাঁও)
  [23.76634, 90.38313], // 10. Bijoy Sarani (বিজয় সরণি)
  [23.75903, 90.38635], // 11. Farmgate (ফার্মগেট)
  [23.75154, 90.39266], // 12. Karwan Bazar (কারওয়ান বাজার)
  [23.73958, 90.39601], // 13. Shahbagh (শাহবাগ)
  [23.73142, 90.39702], // 14. Dhaka University (ঢাকা বিশ্ববিদ্যালয়)
  [23.73001, 90.40787], // 15. Bangladesh Secretariat (বাংলাদেশ সচিবালয়)
  [23.72743, 90.42018], // 16. Motijheel (মতিঝিল)
  [23.73180, 90.42550]  // 17. Kamalapur (কমলাপুর)
];

export const MRT6_STATIONS_DATA = [
  { code: "MRT6-UTN", name: "Uttara North", name_bn: "উত্তরা উত্তর (দিয়াবাড়ী)", lat: 23.86967, lng: 90.36763, order: 1 },
  { code: "MRT6-UTC", name: "Uttara Center", name_bn: "উত্তরা সেন্টার", lat: 23.85981, lng: 90.36516, order: 2 },
  { code: "MRT6-UTS", name: "Uttara South", name_bn: "উত্তরা দক্ষিণ", lat: 23.84581, lng: 90.36311, order: 3 },
  { code: "MRT6-PAL", name: "Pallabi", name_bn: "পল্লবী", lat: 23.82615, lng: 90.36427, order: 4 },
  { code: "MRT6-M11", name: "Mirpur 11", name_bn: "মিরপুর ১১", lat: 23.81924, lng: 90.36527, order: 5 },
  { code: "MRT6-M10", name: "Mirpur 10", name_bn: "মিরপুর ১০", lat: 23.80813, lng: 90.36833, order: 6 },
  { code: "MRT6-KAZ", name: "Kazipara", name_bn: "কাজীপাড়া", lat: 23.79950, lng: 90.37190, order: 7 },
  { code: "MRT6-SHW", name: "Shewrapara", name_bn: "শেওড়াপাড়া", lat: 23.79095, lng: 90.37553, order: 8 },
  { code: "MRT6-AGA", name: "Agargaon", name_bn: "আগারগাঁও", lat: 23.77842, lng: 90.38015, order: 9 },
  { code: "MRT6-BJS", name: "Bijoy Sarani", name_bn: "বিজয় সরণি", lat: 23.76634, lng: 90.38313, order: 10 },
  { code: "MRT6-FMG", name: "Farmgate", name_bn: "ফার্মগেট", lat: 23.75903, lng: 90.38635, order: 11 },
  { code: "MRT6-KBZ", name: "Karwan Bazar", name_bn: "কারওয়ান বাজার", lat: 23.75154, lng: 90.39266, order: 12 },
  { code: "MRT6-SHB", name: "Shahbagh", name_bn: "শাহবাগ", lat: 23.73958, lng: 90.39601, order: 13 },
  { code: "MRT6-DU",  name: "Dhaka University", name_bn: "ঢাকা বিশ্ববিদ্যালয়", lat: 23.73142, lng: 90.39702, order: 14 },
  { code: "MRT6-SEC", name: "Bangladesh Secretariat", name_bn: "বাংলাদেশ সচিবালয়", lat: 23.73001, lng: 90.40787, order: 15 },
  { code: "MRT6-MJL", name: "Motijheel", name_bn: "মতিঝিল", lat: 23.72743, lng: 90.42018, order: 16 },
  { code: "MRT6-KMP", name: "Kamalapur", name_bn: "কমলাপুর", lat: 23.73180, lng: 90.42550, order: 17 }
];

export const STATIC_HUBS = {
  // --- All 17 Official MRT-6 Stations ---
  "Uttara North": {
    "id": "hub-uttara-north",
    "name": "Uttara North",
    "name_bn": "উত্তরা উত্তর (দিয়াবাড়ী)",
    "lat": 23.86967,
    "lng": 90.36763,
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
    "lat": 23.85981,
    "lng": 90.36516,
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
    "lat": 23.84581,
    "lng": 90.36311,
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
    "lat": 23.82615,
    "lng": 90.36427,
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
    "lat": 23.81924,
    "lng": 90.36527,
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
    "lat": 23.80813,
    "lng": 90.36833,
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
    "lat": 23.79950,
    "lng": 90.37190,
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
    "lat": 23.79095,
    "lng": 90.37553,
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
    "lat": 23.77842,
    "lng": 90.38015,
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
    "lat": 23.76634,
    "lng": 90.38313,
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
    "lat": 23.75903,
    "lng": 90.38635,
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
    "lat": 23.75154,
    "lng": 90.39266,
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
    "lat": 23.73958,
    "lng": 90.39601,
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
    "lat": 23.73142,
    "lng": 90.39702,
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
    "lat": 23.73001,
    "lng": 90.40787,
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
    "lat": 23.72743,
    "lng": 90.42018,
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
    "lat": 23.73180,
    "lng": 90.42550,
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
    "name_bn": "উত্তরা (আজমপুর ও রাজলক্ষ্মী)",
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
  },
  // --- Major Dhaka Bus Hubs & Stops ---
  "Mirpur 1": {
    "id": "hub-mirpur1",
    "name": "Mirpur 1",
    "name_bn": "মিরপুর ১",
    "lat": 23.795583,
    "lng": 90.353473,
    "landmarks": ["Muktijoddha Market", "Mirpur 1 Roundabout", "Sony Cinema Hall", "Shah Ali Mazar"],
    "is_metro_station": false,
    "zone": "North-West Transit Hub"
  },
  "Mirpur 12": {
    "id": "hub-mirpur12",
    "name": "Mirpur 12",
    "name_bn": "মিরপুর ১২ (বাস টার্মিনাল)",
    "lat": 23.828335,
    "lng": 90.364255,
    "landmarks": ["Mirpur 12 Bus Terminal", "Ceramics Road", "DOHS Gate", "Purobi Cinema"],
    "is_metro_station": false,
    "zone": "North Transit Terminal"
  },
  "Kalyanpur": {
    "id": "hub-kalyanpur",
    "name": "Kalyanpur",
    "name_bn": "কল্যাণপুর",
    "lat": 23.778616,
    "lng": 90.359892,
    "landmarks": ["Kalyanpur Bus Stand", "South Plaza", "Mizan Tower", "Penta Building"],
    "is_metro_station": false,
    "zone": "Mirpur-Gabtoli Highway Corridor"
  },
  "Shyamoli": {
    "id": "hub-shyamoli",
    "name": "Shyamoli",
    "name_bn": "শ্যামলী",
    "lat": 23.774911,
    "lng": 90.365685,
    "landmarks": ["Shyamoli Square", "Dhaka Shishu Hospital", "Mental Hospital Gate", "Foot-overbridge"],
    "is_metro_station": false,
    "zone": "Mirpur-Dhanmondi Highway Hub"
  },
  "Asad Gate": {
    "id": "hub-asadgate",
    "name": "Asad Gate",
    "name_bn": "আসাদ গেট",
    "lat": 23.760112,
    "lng": 90.373094,
    "landmarks": ["Parliament Building West Gate", "Asad Gate Bus Stand", "St. Joseph Higher Secondary School", "Town Hall Connector"],
    "is_metro_station": false,
    "zone": "Mohammadpur-Dhanmondi Junction"
  },
  "Dhanmondi 27": {
    "id": "hub-dhanmondi27",
    "name": "Dhanmondi 27",
    "name_bn": "ধানমন্ডি ২৭",
    "lat": 23.756477,
    "lng": 90.375289,
    "landmarks": ["Rapa Plaza", "Midas Center", "Dhanmondi Lake 27 Ghat", "Subastu Zenim"],
    "is_metro_station": false,
    "zone": "Dhanmondi Commercial Belt"
  },
  "Kalabagan": {
    "id": "hub-kalabagan",
    "name": "Kalabagan",
    "name_bn": "কলাবাগান",
    "lat": 23.747599,
    "lng": 90.380444,
    "landmarks": ["Kalabagan Krira Chakra Field", "Bashiruddin Road", "Dolphin Mor", "Lake Circus"],
    "is_metro_station": false,
    "zone": "Mirpur Road South Corridor"
  },
  "New Market": {
    "id": "hub-newmarket",
    "name": "New Market",
    "name_bn": "নিউ মার্কেট (নীলক্ষেত)",
    "lat": 23.732862,
    "lng": 90.385008,
    "landmarks": ["New Market Main Gate", "Nilkhet Book Market", "Dhaka College", "Gausia Market"],
    "is_metro_station": false,
    "zone": "Old Commercial / Academic Hub"
  },
  "Banani": {
    "id": "hub-banani",
    "name": "Banani",
    "name_bn": "বনানী",
    "lat": 23.794465,
    "lng": 90.401034,
    "landmarks": ["Banani Road 11", "Kakoli Bus Stand", "Chairman Bari", "Sheraton Dhaka"],
    "is_metro_station": false,
    "zone": "Airport Road North-Central Hub"
  },
  "Kuril": {
    "id": "hub-kuril",
    "name": "Kuril",
    "name_bn": "কুড়িল বিশ্বরোড",
    "lat": 23.821667,
    "lng": 90.419038,
    "landmarks": ["Kuril Flyover", "Jamuna Future Park Gate", "Bishwa Road Overbridge", "300 Feet Highway Entry"],
    "is_metro_station": false,
    "zone": "Airport-Purbachal Interchange"
  },
  "Khilkhet": {
    "id": "hub-khilkhet",
    "name": "Khilkhet",
    "name_bn": "খিলক্ষেত",
    "lat": 23.828786,
    "lng": 90.419952,
    "landmarks": ["Khilkhet Foot-overbridge", "Tanpara Road", "Airport Highway Entry", "Nikunja 2 Gate"],
    "is_metro_station": false,
    "zone": "Airport Corridor"
  },
  "Kakrail": {
    "id": "hub-kakrail",
    "name": "Kakrail",
    "name_bn": "কাকরাইল",
    "lat": 23.733836,
    "lng": 90.403085,
    "landmarks": ["Kakrail Mosque", "Rajmoni Cinema Mor", "Chief Justice Official Residence", "Shantinagar Corner"],
    "is_metro_station": false,
    "zone": "Central Administrative Zone"
  },
  "Gulisthan": {
    "id": "hub-gulisthan",
    "name": "Gulisthan",
    "name_bn": "গুলিস্তান (জিরো পয়েন্ট)",
    "lat": 23.7250,
    "lng": 90.4110,
    "landmarks": ["Zero Point", "Fulbaria Bus Stand", "Sundarban Square Market", "Baitul Mukarram National Mosque"],
    "is_metro_station": false,
    "zone": "Central Dhaka Bus Interchange"
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
    description_bn: "ভারী বৃষ্টির পর হাঁটু পানি জমেছে। লোকাল বাস ও লেগুনা চলাচল বিঘ্নিত। যাত্রীদের কাকরাইল বা শাহবাগ হয়ে যাতায়াত করতে পরামর্শ দেওয়া হচ্ছে।",
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
    description_bn: "শাহবাগ মোড়ে সমাবেশের কারণে যান চলাচল ব্যাহত। সড়কপথের যানবাহন ঘুরিয়ে দেওয়া হচ্ছে। এমআরটি-৬ মেট্রোরেল সম্পূর্ণ স্বাভাবিকভাবে সচল।",
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
    description_bn: "সায়েন্স ল্যাবের দিকে তীব্র যানজট। উত্তর-দক্ষিণ রুটে চলাচলে সড়কপথ এড়িয়ে মেট্রোরেল ব্যবহার করার পরামর্শ দেওয়া হচ্ছে।",
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
    description_bn: "সদরঘাট লঞ্চ টার্মিনাল সংলগ্ন এলাকায় পথচারী ও রিকশার অতিরিক্ত চাপ। বাহাদুর শাহ পার্ক থেকে হেঁটে পার হওয়া দ্রুততর।",
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
  { name: "Dhaka Traffic Control", name_bn: "ঢাকা ট্রাফিক কন্ট্রোল রুম", phone: "01713398500", desc: "Live Traffic Updates & Police Assistance", desc_bn: "লাইভ ট্রাফিক আপডেট ও পুলিশ সহায়তা" },
  { name: "DMP Central Helpline", name_bn: "ডিএমপি জরুরি সেবা", phone: "999", desc: "National Emergency Service (Police, Fire, Ambulance)", desc_bn: "জাতীয় জরুরি সেবা (পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স)" },
  { name: "BIWTA Sadarghat Port Safety", name_bn: "বিআইডব্লিউটিএ সদরঘাট রিভার কন্ট্রোল", phone: "01715012345", desc: "Buriganga Riverways, Launch & Ghat Assistance", desc_bn: "বুড়িগঙ্গা নদীপথ, লঞ্চ ও ঘাট সহায়তা" },
  { name: "MRT-6 Metro Helpline", name_bn: "মেট্রোরেল কন্ট্রোল রুম", phone: "16111", desc: "Train schedule, Rapid Pass issues & station assistance", desc_bn: "ট্রেন শিডিউল, র‍্যাপিড পাস ও স্টেশন সহায়তা" }
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

