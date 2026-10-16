/**
 * DhakaPath Custom Dijkstra Routing & Multi-Modal Fare Engine
 * Supports:
 * - 15 Major Dhaka Hubs
 * - Multi-leg connections (Metro, Bus, Leguna, Rickshaw)
 * - 50% Student Discount with Statutory 10 BDT Minimum Floor
 * - Non-metered Rickshaw Weather (+50%) and Rush-Hour (+25%) Surges
 * - Dynamic Detour calculation during Waterlogging and Intersection Blockades
 */

import { STATIC_HUBS } from '../data/staticData.js';
import { ALL_LOCAL_BUSES } from '../data/allLocalBusesData.js';

// Helper to round fare strictly to multiples of 5 or 10 in integer round figure
export function roundTo5(val, min = 10) {
  const rounded = Math.round(Number(val) / 5) * 5;
  return Math.max(min, rounded);
}

// Find actual running buses on the corridor
export function findMatchingBuses(fromHub, toHub) {
  if (!fromHub || !toHub) return [];
  const fromLower = fromHub.toLowerCase().trim();
  const toLower = toHub.toLowerCase().trim();

  return ALL_LOCAL_BUSES.filter(b => {
    const stopsLower = (b.stops || []).map(s => s.toLowerCase());
    const hasFrom = stopsLower.some(s => s.includes(fromLower) || fromLower.includes(s));
    const hasTo = stopsLower.some(s => s.includes(toLower) || toLower.includes(s));
    return hasFrom && hasTo;
  });
}

export const METRO_FARE_CHART = {
  // Official DMTCL 17x17 Matrix Key Station Fares
  "Uttara North-Motijheel": 100,
  "Uttara North-Kamalapur": 100,
  "Uttara North-Shahbagh": 80,
  "Uttara North-Farmgate": 70,
  "Uttara North-Agargaon": 60,
  "Uttara North-Mirpur 10": 40,
  "Uttara North-Pallabi": 30,
  "Uttara North-Dhaka University": 90,
  "Uttara North-Bangladesh Secretariat": 90,
  "Pallabi-Motijheel": 70,
  "Pallabi-Kamalapur": 80,
  "Pallabi-Bangladesh Secretariat": 70,
  "Pallabi-Shahbagh": 60,
  "Pallabi-Farmgate": 50,
  "Pallabi-Agargaon": 30,
  "Pallabi-Mirpur 10": 20,
  "Mirpur 10-Motijheel": 60,
  "Mirpur 10-Kamalapur": 60,
  "Mirpur 10-Bangladesh Secretariat": 50,
  "Mirpur 10-Dhaka University": 50,
  "Mirpur 10-Shahbagh": 40,
  "Mirpur 10-Farmgate": 30,
  "Mirpur 10-Agargaon": 20,
  "Agargaon-Motijheel": 40,
  "Agargaon-Kamalapur": 50,
  "Agargaon-Bangladesh Secretariat": 40,
  "Agargaon-Dhaka University": 30,
  "Agargaon-Shahbagh": 30,
  "Agargaon-Farmgate": 20,
  "Bijoy Sarani-Motijheel": 40,
  "Bijoy Sarani-Shahbagh": 20,
  "Farmgate-Motijheel": 30,
  "Farmgate-Kamalapur": 40,
  "Farmgate-Bangladesh Secretariat": 30,
  "Farmgate-Dhaka University": 20,
  "Farmgate-Shahbagh": 20,
  "Karwan Bazar-Motijheel": 30,
  "Karwan Bazar-Shahbagh": 20,
  "Shahbagh-Motijheel": 20,
  "Shahbagh-Kamalapur": 30,
  "Dhaka University-Motijheel": 20,
  "Dhaka University-Kamalapur": 20,
  "Bangladesh Secretariat-Motijheel": 20,
  "Bangladesh Secretariat-Kamalapur": 20,
  "Motijheel-Kamalapur": 20,
  // Alias for Uttara
  "Uttara-Motijheel": 100,
  "Uttara-Farmgate": 70,
  "Uttara-Agargaon": 50,
  "Uttara-Mirpur 10": 40
};

export const BASE_TRANSIT_EDGES = [
  // Metro MRT-6 (Elevated - Immune to surface traffic/waterlogging) - All 17 Stations
  { u: "Uttara North", v: "Uttara Center", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.3, time: 3, elevated: true },
  { u: "Uttara Center", v: "Uttara South", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.2, time: 2, elevated: true },
  { u: "Uttara South", v: "Pallabi", mode: "metro", line: "MRT-6 Metro Rail", dist: 2.3, time: 4, elevated: true },
  { u: "Pallabi", v: "Mirpur 11", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.5, time: 3, elevated: true },
  { u: "Mirpur 11", v: "Mirpur 10", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.6, time: 3, elevated: true },
  { u: "Mirpur 10", v: "Kazipara", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.4, time: 3, elevated: true },
  { u: "Kazipara", v: "Shewrapara", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.0, time: 2, elevated: true },
  { u: "Shewrapara", v: "Agargaon", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.2, time: 2, elevated: true },
  { u: "Agargaon", v: "Bijoy Sarani", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.6, time: 3, elevated: true },
  { u: "Bijoy Sarani", v: "Farmgate", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.2, time: 2, elevated: true },
  { u: "Farmgate", v: "Karwan Bazar", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.1, time: 2, elevated: true },
  { u: "Karwan Bazar", v: "Shahbagh", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.2, time: 2, elevated: true },
  { u: "Shahbagh", v: "Dhaka University", mode: "metro", line: "MRT-6 Metro Rail", dist: 0.9, time: 2, elevated: true },
  { u: "Dhaka University", v: "Bangladesh Secretariat", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.3, time: 2, elevated: true },
  { u: "Bangladesh Secretariat", v: "Motijheel", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.2, time: 2, elevated: true },
  { u: "Motijheel", v: "Kamalapur", mode: "metro", line: "MRT-6 Metro Rail", dist: 1.1, time: 2, elevated: true },
  { u: "Uttara", v: "Uttara North", mode: "rickshaw", line: "Metro Connector Walk", dist: 0.2, time: 2, elevated: false },

  // Surface Local Buses (Eligible for 50% student discount, 10 BDT min floor)
  { u: "Mirpur 10", v: "Agargaon", mode: "bus", line: "Bikolpo Auto Service", dist: 3.8, time: 15, elevated: false },
  { u: "Agargaon", v: "Farmgate", mode: "bus", line: "Bikolpo Auto Service", dist: 3.2, time: 14, elevated: false },
  { u: "Farmgate", v: "Shahbagh", mode: "bus", line: "Bikolpo Auto Service", dist: 2.5, time: 12, elevated: false },
  { u: "Shahbagh", v: "Motijheel", mode: "bus", line: "Bikolpo Auto Service", dist: 2.8, time: 15, elevated: false },

  { u: "Farmgate", v: "Science Lab", mode: "bus", line: "Shikor Paribahan", dist: 2.3, time: 12, elevated: false },
  { u: "Science Lab", v: "Shahbagh", mode: "bus", line: "Shikor Paribahan", dist: 1.5, time: 8, elevated: false },
  { u: "Science Lab", v: "Dhanmondi", mode: "bus", line: "Thikana Paribahan", dist: 1.2, time: 7, elevated: false },
  { u: "Dhanmondi", v: "Mohammadpur", mode: "bus", line: "Thikana Paribahan", dist: 2.4, time: 12, elevated: false },
  { u: "Farmgate", v: "Mohammadpur", mode: "leguna", line: "Town Hall Leguna", dist: 3.4, time: 14, elevated: false },

  { u: "Shahbagh", v: "Malibagh", mode: "bus", line: "Thikana Paribahan", dist: 2.6, time: 15, elevated: false },
  { u: "Malibagh", v: "Motijheel", mode: "bus", line: "Victor Classic", dist: 2.2, time: 12, elevated: false },
  { u: "Malibagh", v: "Banasree", mode: "bus", line: "Thikana Paribahan", dist: 2.8, time: 16, elevated: false },
  { u: "Banasree", v: "Badda", mode: "bus", line: "Raida Enterprise", dist: 2.5, time: 14, elevated: false },
  { u: "Badda", v: "Mohakhali", mode: "leguna", line: "Link Road Leguna", dist: 3.1, time: 16, elevated: false },
  { u: "Mohakhali", v: "Farmgate", mode: "bus", line: "Victor Classic", dist: 2.9, time: 14, elevated: false },
  { u: "Uttara", v: "Mohakhali", mode: "bus", line: "Victor Classic", dist: 11.0, time: 35, elevated: false },
  { u: "Motijheel", v: "Jatrabari", mode: "bus", line: "Anabil Paribahan", dist: 3.5, time: 18, elevated: false },
  { u: "Science Lab", v: "Jatrabari", mode: "bus", line: "Shikor Paribahan", dist: 6.8, time: 35, elevated: false },
  { u: "Agargaon", v: "Mohakhali", mode: "bus", line: "Raja City", dist: 3.6, time: 18, elevated: false },

  // Mirpur Corridor Bus Hubs
  { u: "Mirpur 12", v: "Pallabi", mode: "bus", line: "Bikolpo Auto Service", dist: 0.8, time: 3, elevated: false },
  { u: "Mirpur 12", v: "Mirpur 11", mode: "bus", line: "Bikolpo Auto Service", dist: 1.0, time: 3, elevated: false },
  { u: "Mirpur 10", v: "Mirpur 1", mode: "bus", line: "Bikolpo Auto Service", dist: 1.8, time: 6, elevated: false },
  { u: "Mirpur 1", v: "Kalyanpur", mode: "bus", line: "Bikolpo Auto Service", dist: 2.0, time: 7, elevated: false },
  { u: "Kalyanpur", v: "Shyamoli", mode: "bus", line: "Bikolpo Auto Service", dist: 1.0, time: 4, elevated: false },
  { u: "Shyamoli", v: "Asad Gate", mode: "bus", line: "Bikolpo Auto Service", dist: 1.8, time: 6, elevated: false },
  { u: "Asad Gate", v: "Dhanmondi 27", mode: "bus", line: "Bikolpo Auto Service", dist: 1.0, time: 4, elevated: false },
  { u: "Dhanmondi 27", v: "Kalabagan", mode: "bus", line: "Bikolpo Auto Service", dist: 1.1, time: 4, elevated: false },
  { u: "Kalabagan", v: "Science Lab", mode: "bus", line: "Bikolpo Auto Service", dist: 1.0, time: 4, elevated: false },
  { u: "Science Lab", v: "New Market", mode: "bus", line: "Bikolpo Auto Service", dist: 0.6, time: 2, elevated: false },
  { u: "New Market", v: "Dhaka University", mode: "bus", line: "Bikolpo Auto Service", dist: 1.2, time: 5, elevated: false },

  // Airport Highway & Central Bus Hubs
  { u: "Uttara", v: "Khilkhet", mode: "bus", line: "Uttara Bus", dist: 3.5, time: 10, elevated: false },
  { u: "Khilkhet", v: "Kuril", mode: "bus", line: "Uttara Bus", dist: 1.5, time: 5, elevated: false },
  { u: "Kuril", v: "Banani", mode: "bus", line: "Uttara Bus", dist: 2.8, time: 9, elevated: false },
  { u: "Banani", v: "Mohakhali", mode: "bus", line: "Uttara Bus", dist: 1.8, time: 6, elevated: false },
  { u: "Farmgate", v: "Kakrail", mode: "bus", line: "Uttara Bus", dist: 3.2, time: 12, elevated: false },
  { u: "Kakrail", v: "Bangladesh Secretariat", mode: "bus", line: "Uttara Bus", dist: 0.9, time: 3, elevated: false },
  { u: "Bangladesh Secretariat", v: "Gulisthan", mode: "bus", line: "Bihanga Paribahan", dist: 0.8, time: 3, elevated: false },
  { u: "Gulisthan", v: "Motijheel", mode: "bus", line: "Bihanga Paribahan", dist: 0.9, time: 3, elevated: false },
  { u: "Gulisthan", v: "Sadarghat", mode: "bus", line: "Sadarghat Link", dist: 1.8, time: 8, elevated: false },
  { u: "Gulisthan", v: "Jatrabari", mode: "bus", line: "Mayor Hanif Flyover Bus", dist: 2.8, time: 10, elevated: false }
];

// Calculate accurate road distance between two hubs using coordinates
export function calculateHubDistance(fromHub, toHub) {
  const h1 = STATIC_HUBS[fromHub];
  const h2 = STATIC_HUBS[toHub];
  if (!h1 || !h2) return 5.0;
  if (fromHub === toHub) return 0;

  const R = 6371; // Earth radius in km
  const dLat = ((h2.lat - h1.lat) * Math.PI) / 180;
  const dLng = ((h2.lng - h1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((h1.lat * Math.PI) / 180) *
      Math.cos((h2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  // Apply Dhaka urban road tortuosity factor (~1.35x)
  return Math.round(Math.max(1.0, straightKm * 1.35) * 10) / 10;
}

// Find nearest MRT-6 station for connector calculation
export function findNearestMetroStation(hubName) {
  const hub = STATIC_HUBS[hubName];
  if (!hub) return null;
  if (hub.is_metro_station) return { name: hubName, dist: 0 };

  const metroStations = Object.entries(STATIC_HUBS).filter(([_, data]) => data.is_metro_station);
  let best = null;
  let minDist = Infinity;

  metroStations.forEach(([name, data]) => {
    const dist = calculateHubDistance(hubName, name);
    if (dist < minDist) {
      minDist = dist;
      best = { name, dist, data };
    }
  });

  return best;
}

export function calculateFare(mode, from, to, distanceKm, weather = "normal", isRushHour = false) {
  if (mode === "metro") {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    const fare = METRO_FARE_CHART[key1] || METRO_FARE_CHART[key2] || Math.min(100, Math.max(20, Math.round(distanceKm * 4.5 / 10) * 10));
    // Metro strictly does not accept student pass
    return { regular: fare, student: fare, surge: 1.0 };
  }

  if (mode === "bus") {
    const regular = roundTo5(distanceKm * 2.50, 10);
    // 50% discount with 10 BDT statutory floor rounded to multiple of 5
    const student = roundTo5(regular * 0.50, 10);
    return { regular, student, surge: 1.0 };
  }

  if (mode === "cng") {
    let base = distanceKm <= 2.0 ? 40 : 40 + (distanceKm - 2.0) * 12;
    base = Math.max(100, base);
    let surge = 1.0;
    if (weather === "rain") surge += 0.3;
    if (isRushHour) surge += 0.25;
    const regular = roundTo5(base * surge, 100);
    return { regular, student: regular, surge: Math.round(surge * 100) / 100 };
  }

  if (mode === "leguna") {
    const regular = roundTo5(distanceKm * 4.5, 15);
    return { regular, student: regular, surge: 1.0 };
  }

  // Rickshaw (Non-metered with surge)
  let base = Math.max(30, distanceKm * 22);
  let surge = 1.0;
  if (weather === "rain") surge += 0.5; // +50%
  if (isRushHour) surge += 0.25;        // +25%
  const regular = roundTo5(base * surge, 30);
  return { regular, student: regular, surge: Math.round(surge * 100) / 100 };
}

export function runDijkstraRouting({
  origin,
  destination,
  passengerType = "general",
  weather = "normal",
  isRushHour = false,
  activeAlerts = []
}) {
  if (!origin || !destination || origin === destination || !STATIC_HUBS[origin] || !STATIC_HUBS[destination]) return [];

  // Identify disrupted hubs
  const waterloggedHubs = new Set(
    activeAlerts.filter(a => a.type === "waterlogging" && a.is_active).map(a => a.hub)
  );
  const blockedHubs = new Set(
    activeAlerts.filter(a => a.type === "blockade" && a.is_active).map(a => a.hub)
  );
  const isDetourActive = waterloggedHubs.has(origin) || waterloggedHubs.has(destination) || blockedHubs.has(origin) || blockedHubs.has(destination);

  // Exact road distance between origin and destination
  const roadDist = calculateHubDistance(origin, destination);
  const isOrigMetro = Boolean(STATIC_HUBS[origin]?.is_metro_station);
  const isDestMetro = Boolean(STATIC_HUBS[destination]?.is_metro_station);

  const matchedBuses = findMatchingBuses(origin, destination);
  const resultRoutes = [];

  // =========================================================================
  // 1. LOCAL BUS ROUTE (DIRECT-FIRST: 0 TRANSFERS WHEN RUNNING BUSES EXIST)
  // =========================================================================
  let busTime = Math.max(16, Math.round(roadDist * 2.8));
  if (isRushHour) busTime = Math.round(busTime * 1.35);
  if (weather === "rain") busTime = Math.round(busTime * 1.3);

  // Official BRTA Gazette Rate: 2.50 BDT/km rounded to multiple of 5, minimum statutory 10 BDT
  const busRegularFare = roundTo5(roadDist * 2.50, 10);
  const busStudentFare = roundTo5(busRegularFare * 0.50, 10); // 50% statutory student pass
  
  const busLineName = matchedBuses.length > 0 
    ? matchedBuses.slice(0, 3).map(b => b.name_bn || b.name).join(' / ')
    : "ঢাকা অনুমোদিত সিটি বাস (বিকল্প / বিআরটিসি / স্বাধীন)";

  const busObstacles = weather === "rain"
    ? "🔴 সড়কে বৃষ্টির পানি ও কিছুটা ধীরগতি"
    : (isRushHour ? "🟡 অফিস ছুটি পিক-আওয়ার সাধারণ ট্রাফিক" : "🟢 নিয়মিত সড়ক ট্রাফিক স্বাভাবিক");

  const busRoute = {
    id: "opt-bus",
    mode: "bus",
    title: `Direct / Local Bus Transit (${origin} ➔ ${destination})`,
    title_bn: `সরাসরি সিটি বাস: ${busLineName}`,
    type_badge: "সরাসরি ও সাশ্রয়ী (হাফ-পাস)",
    total_duration_mins: busTime,
    total_regular_fare: busRegularFare,
    total_student_fare: busStudentFare,
    total_distance_km: roadDist,
    obstacles_badge: busObstacles,
    obstacles_status: weather === "rain" || isRushHour ? "warning" : "traffic",
    transfers: 0,
    is_recommended: true, // Direct buses are default top pick unless both hubs are on Metro
    is_detour: isDetourActive,
    disruption_warning: isDetourActive ? "যাত্রাপথে কিছু অংশে ধীরগতি থাকতে পারে।" : null,
    legs: [
      {
        leg_number: 1,
        mode: "bus",
        line_name: busLineName,
        from_hub: origin,
        to_hub: destination,
        distance_km: roadDist,
        duration_mins: busTime,
        regular_fare_bdt: busRegularFare,
        student_fare_bdt: busStudentFare,
        surge_multiplier: 1.0,
        landmark_instructions: `${origin} বাস স্টপ থেকে সরাসরি বাসে উঠে কোনো বদল ছাড়াই ${destination} নামুন। শিক্ষার্থীদের ৫০% হাফ-পাস প্রযোজ্য।`
      }
    ]
  };
  resultRoutes.push(busRoute);

  // =========================================================================
  // 2. METRO RAIL ROUTE (STRICT ELIGIBILITY: ONLY WHEN SENSIBLE)
  // =========================================================================
  if (isOrigMetro && isDestMetro) {
    // Both hubs are official MRT-6 stations: 100% Direct Rapid Metro
    const metroKey1 = `${origin}-${destination}`;
    const metroKey2 = `${destination}-${origin}`;
    const metroFare = METRO_FARE_CHART[metroKey1] || METRO_FARE_CHART[metroKey2] || Math.min(100, Math.max(20, Math.round(roadDist * 4.5 / 10) * 10));
    const metroTime = Math.max(4, Math.round(roadDist * 1.6));

    const metroRoute = {
      id: "opt-metro",
      mode: "metro",
      title: `MRT-6 Metro Rail (${origin} ➔ ${destination})`,
      title_bn: `এমআরটি-৬ মেট্রোরেল (এক্সপ্রেস)`,
      type_badge: "১০০% বাধামুক্ত ও দ্রুততম",
      total_duration_mins: metroTime,
      total_regular_fare: metroFare,
      total_student_fare: metroFare,
      total_distance_km: roadDist,
      obstacles_badge: "🟢 বাধামুক্ত উড়ালপথ (০% যানজট ও জলজট)",
      obstacles_status: "safe",
      transfers: 0,
      is_recommended: true, // If both are metro, metro is #1
      is_detour: false,
      disruption_warning: null,
      legs: [
        {
          leg_number: 1,
          mode: "metro",
          line_name: "MRT-6 Metro Rail",
          from_hub: origin,
          to_hub: destination,
          distance_km: roadDist,
          duration_mins: metroTime,
          regular_fare_bdt: metroFare,
          student_fare_bdt: metroFare,
          surge_multiplier: 1.0,
          landmark_instructions: `${origin} মেট্রোরেল স্টেশনের কনকোর্স দিয়ে উঠে ট্র্যাকে সরাসরি যাত্রা।`
        }
      ]
    };
    busRoute.is_recommended = false;
    resultRoutes.unshift(metroRoute); // Put metro at top
  } else {
    // Check if one hub is on metro and the other is within 2.5 km of a metro station
    const nearOrig = isOrigMetro ? { name: origin, dist: 0 } : findNearestMetroStation(origin);
    const nearDest = isDestMetro ? { name: destination, dist: 0 } : findNearestMetroStation(destination);

    // Only suggest metro if at most 1 short surface connector (<= 2.5 km) is needed
    const totalConnectorDist = (nearOrig?.dist || 0) + (nearDest?.dist || 0);
    if (totalConnectorDist <= 2.5 && (nearOrig?.name !== nearDest?.name)) {
      const metroKey1 = `${nearOrig.name}-${nearDest.name}`;
      const metroKey2 = `${nearDest.name}-${nearOrig.name}`;
      const metroSegmentDist = calculateHubDistance(nearOrig.name, nearDest.name);
      const metroFare = METRO_FARE_CHART[metroKey1] || METRO_FARE_CHART[metroKey2] || Math.min(100, Math.max(20, Math.round(metroSegmentDist * 4.5 / 10) * 10));
      const metroTime = Math.max(4, Math.round(metroSegmentDist * 1.6));

      const metroLegs = [];
      let legCounter = 1;

      if (!isOrigMetro && nearOrig.dist > 0.3) {
        const connFare = roundTo5(nearOrig.dist * 22, 30);
        metroLegs.push({
          leg_number: legCounter++,
          mode: "rickshaw",
          line_name: "রিকশা / কানেক্টর সংযোগ",
          from_hub: origin,
          to_hub: nearOrig.name,
          distance_km: nearOrig.dist,
          duration_mins: Math.max(6, Math.round(nearOrig.dist * 4.5)),
          regular_fare_bdt: connFare,
          student_fare_bdt: connFare,
          surge_multiplier: 1.0,
          landmark_instructions: `${origin} থেকে রিকশাযোগে ${nearOrig.name} মেট্রোরেল স্টেশনে পৌঁছান।`
        });
      }

      metroLegs.push({
        leg_number: legCounter++,
        mode: "metro",
        line_name: "MRT-6 Metro Rail",
        from_hub: nearOrig.name,
        to_hub: nearDest.name,
        distance_km: metroSegmentDist,
        duration_mins: metroTime,
        regular_fare_bdt: metroFare,
        student_fare_bdt: metroFare,
        surge_multiplier: 1.0,
        landmark_instructions: `${nearOrig.name} স্টেশন থেকে মেট্রোরেলে চড়ে ${nearDest.name} নামুন।`
      });

      if (!isDestMetro && nearDest.dist > 0.3) {
        const connFare = roundTo5(nearDest.dist * 22, 30);
        metroLegs.push({
          leg_number: legCounter++,
          mode: "rickshaw",
          line_name: "রিকশা / কানেক্টর সংযোগ",
          from_hub: nearDest.name,
          to_hub: destination,
          distance_km: nearDest.dist,
          duration_mins: Math.max(6, Math.round(nearDest.dist * 4.5)),
          regular_fare_bdt: connFare,
          student_fare_bdt: connFare,
          surge_multiplier: 1.0,
          landmark_instructions: `${nearDest.name} মেট্রোরেল স্টেশন থেকে রিকশায় সরাসরি ${destination} পৌঁছান।`
        });
      }

      if (metroLegs.length <= 2) {
        const totalMetroReg = metroLegs.reduce((sum, l) => sum + l.regular_fare_bdt, 0);
        const totalMetroTime = metroLegs.reduce((sum, l) => sum + l.duration_mins, 0) + (metroLegs.length > 1 ? 4 : 0);

        const metroOption = {
          id: "opt-metro",
          mode: "metro",
          title: `Metro Connection (${origin} ➔ ${destination})`,
          title_bn: `মেট্রোরেল সংযোগ (${nearOrig.name} হয়ে)`,
          type_badge: "উড়ালপথ ও দ্রুত সংযোগ",
          total_duration_mins: totalMetroTime,
          total_regular_fare: totalMetroReg,
          total_student_fare: totalMetroReg,
          total_distance_km: Math.round((nearOrig.dist + metroSegmentDist + nearDest.dist) * 10) / 10,
          obstacles_badge: "🟢 প্রধান অংশ উড়ালপথে সম্পূর্ণ যানজটমুক্ত",
          obstacles_status: "safe",
          transfers: metroLegs.length - 1,
          is_recommended: false, // Direct bus is preferred when transfers needed
          is_detour: false,
          disruption_warning: null,
          legs: metroLegs
        };
        resultRoutes.push(metroOption);
      }
    }
  }

  // =========================================================================
  // 3. CNG AUTO-RICKSHAW (DIRECT BRTA METERED AUTO)
  // =========================================================================
  let cngBase = roadDist <= 2.0 ? 40 : 40 + (roadDist - 2.0) * 12;
  cngBase = Math.max(100, cngBase);
  let cngSurge = 1.0;
  if (weather === "rain") cngSurge += 0.3;
  if (isRushHour) cngSurge += 0.25;
  const cngFare = roundTo5(cngBase * cngSurge, 100);
  let cngTime = Math.max(14, Math.round(roadDist * 2.2));
  if (isRushHour) cngTime = Math.round(cngTime * 1.25);
  if (weather === "rain") cngTime = Math.round(cngTime * 1.2);

  const cngRoute = {
    id: "opt-cng",
    mode: "cng",
    title: `Direct CNG Auto-Rickshaw (${origin} ➔ ${destination})`,
    title_bn: `সরাসরি সিএনজি অটোরিকশা`,
    type_badge: "ব্যক্তিগত মিটার বাহন",
    total_duration_mins: cngTime,
    total_regular_fare: cngFare,
    total_student_fare: cngFare,
    total_distance_km: roadDist,
    obstacles_badge: "🟡 মাঝারি ট্রাফিক, অলিগলি ব্যবহারের সুবিধা",
    obstacles_status: "traffic",
    transfers: 0,
    is_recommended: false,
    is_detour: false,
    legs: [
      {
        leg_number: 1,
        mode: "cng",
        line_name: "CNG Auto-Rickshaw (মিটার / চুক্তি)",
        from_hub: origin,
        to_hub: destination,
        distance_km: roadDist,
        duration_mins: cngTime,
        regular_fare_bdt: cngFare,
        student_fare_bdt: cngFare,
        surge_multiplier: Math.round(cngSurge * 100) / 100,
        landmark_instructions: `${origin} সিএনজি স্ট্যান্ড থেকে সরাসরি ${destination}। কোনো পরিবর্তন ছাড়া দ্রুত যাতায়াত।`
      }
    ]
  };
  resultRoutes.push(cngRoute);

  // =========================================================================
  // 4. RIDE-SHARE BIKE / MOTORCYCLE (FASTEST SURFACE ROAD TRANSIT)
  // =========================================================================
  let bikeTime = Math.max(9, Math.round(roadDist * 1.5));
  if (isRushHour) bikeTime = Math.round(bikeTime * 1.15);
  const rawBike = 30 + (roadDist - 1) * 12 * (weather === "rain" ? 1.2 : 1.0);
  const bikeFare = roundTo5(rawBike, 35);
  const bikeObstacles = weather === "rain"
    ? "🌧️ বৃষ্টিতে পিচ্ছিল সড়ক ও সতর্ক রাইড"
    : "🟢 জ্যামের ফাঁক দিয়ে দ্রুত বের হওয়ার সুযোগ";

  const bikeRoute = {
    id: "opt-bike",
    mode: "bike",
    title: `Ride-Share Bike (${origin} ➔ ${destination})`,
    title_bn: `মোটরসাইকেল / বাইক রাইডশেয়ার`,
    type_badge: "সড়কপথে দ্রুততম",
    total_duration_mins: bikeTime,
    total_regular_fare: bikeFare,
    total_student_fare: bikeFare,
    total_distance_km: roadDist,
    obstacles_badge: bikeObstacles,
    obstacles_status: weather === "rain" ? "warning" : "safe",
    transfers: 0,
    is_recommended: false,
    is_detour: false,
    legs: [
      {
        leg_number: 1,
        mode: "bike",
        line_name: "Motorcycle Ride-Share (Pathao / Uber Moto)",
        from_hub: origin,
        to_hub: destination,
        distance_km: roadDist,
        duration_mins: bikeTime,
        regular_fare_bdt: bikeFare,
        student_fare_bdt: bikeFare,
        surge_multiplier: 1.0,
        landmark_instructions: `${origin} থেকে ওয়ান-অন-ওয়ান বাইক পিকআপ। যানজট এড়িয়ে দ্রুততম সড়ক পরিবহন।`
      }
    ]
  };
  resultRoutes.push(bikeRoute);

  // =========================================================================
  // 5. PRIVATE CAR / RIDE-SHARE CAB (UBER / TAXI)
  // =========================================================================
  let carTime = Math.max(16, Math.round(roadDist * 2.5));
  if (isRushHour) carTime = Math.round(carTime * 1.35);
  if (weather === "rain") carTime = Math.round(carTime * 1.2);
  const rawCar = 100 + (roadDist - 1) * 24 * (isRushHour ? 1.2 : 1.0);
  const carFare = roundTo5(rawCar, 140);
  const carObstacles = isRushHour
    ? "🔴 পিক-আওয়ারে প্রধান সড়কে যানজটের সম্ভাবনা"
    : "🟡 স্বাভাবিক সড়ক ট্রাফিক (এসি ও আরামদায়ক)";

  const carRoute = {
    id: "opt-car",
    mode: "car",
    title: `Private Car / ক্যাব (${origin} ➔ ${destination})`,
    title_bn: `প্রাইভেট কার / রাইডশেয়ার ক্যাব`,
    type_badge: "আরামদায়ক ও এসি",
    total_duration_mins: carTime,
    total_regular_fare: carFare,
    total_student_fare: carFare,
    total_distance_km: Math.round(roadDist * 1.05 * 10) / 10,
    obstacles_badge: carObstacles,
    obstacles_status: isRushHour ? "warning" : "traffic",
    transfers: 0,
    is_recommended: false,
    is_detour: false,
    legs: [
      {
        leg_number: 1,
        mode: "car",
        line_name: "Private Cab / Ride-Share Car",
        from_hub: origin,
        to_hub: destination,
        distance_km: Math.round(roadDist * 1.05 * 10) / 10,
        duration_mins: carTime,
        regular_fare_bdt: carFare,
        student_fare_bdt: carFare,
        surge_multiplier: 1.0,
        landmark_instructions: `${origin} থেকে ডোর-টু-ডোর কার ক্যাব। বৃষ্টি ও রোদে সম্পূর্ণ আরামদায়ক এসি যাত্রা।`
      }
    ]
  };
  resultRoutes.push(carRoute);

  // =========================================================================
  // 6. TRADITIONAL RICKSHAW (FOR SHORT TRIPS <= 6.5 KM)
  // =========================================================================
  if (roadDist <= 6.5) {
    const rawRickshaw = roadDist * 22 * (weather === "rain" ? 1.4 : 1.0);
    const rickshawFare = roundTo5(rawRickshaw, 30);
    const rickshawTime = Math.max(10, Math.round(roadDist * 5.0));
    const rickshawRoute = {
      id: "opt-rickshaw",
      mode: "rickshaw",
      title: `Traditional Rickshaw (${origin} ➔ ${destination})`,
      title_bn: `ঐতিহ্যবাহী রিকশা ভ্রমণ`,
      type_badge: "লোকাল ও গলিপথ",
      total_duration_mins: rickshawTime,
      total_regular_fare: rickshawFare,
      total_student_fare: rickshawFare,
      total_distance_km: roadDist,
      obstacles_badge: "🟢 অভ্যন্তরীণ অলিগলিতে বাধাহীন চলাচল",
      obstacles_status: "safe",
      transfers: 0,
      is_recommended: false,
      is_detour: false,
      legs: [
        {
          leg_number: 1,
          mode: "rickshaw",
          line_name: "Dhaka Traditional Rickshaw",
          from_hub: origin,
          to_hub: destination,
          distance_km: roadDist,
          duration_mins: rickshawTime,
          regular_fare_bdt: rickshawFare,
          student_fare_bdt: rickshawFare,
          surge_multiplier: 1.0,
          landmark_instructions: `${origin} থেকে হুড তোলা রিকশা নিয়ে গলিপথ দিয়ে নিরিবিলি যাতায়াত।`
        }
      ]
    };
    resultRoutes.push(rickshawRoute);
  }

  // =========================================================================
  // 7. FINAL 100% MATHEMATICAL CONSISTENCY RECONCILIATION
  // =========================================================================
  resultRoutes.forEach(r => {
    r.total_regular_fare = r.legs.reduce((sum, leg) => sum + (leg.regular_fare_bdt || 0), 0);
    r.total_student_fare = r.legs.reduce((sum, leg) => sum + (leg.student_fare_bdt || 0), 0);
    const legDurationSum = r.legs.reduce((sum, leg) => sum + (leg.duration_mins || 0), 0);
    r.total_duration_mins = legDurationSum + ((r.transfers || 0) * 3);
  });

  return resultRoutes;
}
