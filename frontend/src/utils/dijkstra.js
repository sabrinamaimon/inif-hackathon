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

export function calculateFare(mode, from, to, distanceKm, weather = "normal", isRushHour = false) {
  if (mode === "metro") {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    const fare = METRO_FARE_CHART[key1] || METRO_FARE_CHART[key2] || 30;
    // Metro strictly does not accept student pass
    return { regular: fare, student: fare, surge: 1.0 };
  }

  if (mode === "bus") {
    const raw = distanceKm * 2.5;
    const regular = Math.max(10, Math.ceil(raw));
    // 50% discount with 10 BDT statutory floor
    const student = Math.max(10, Math.ceil(regular * 0.5));
    return { regular, student, surge: 1.0 };
  }

  if (mode === "cng") {
    let base = distanceKm <= 2.0 ? 40 : 40 + Math.ceil((distanceKm - 2.0) * 12);
    base = Math.max(100, base);
    let surge = 1.0;
    if (weather === "rain") surge += 0.3;
    if (isRushHour) surge += 0.25;
    const regular = Math.ceil(base * surge);
    return { regular, student: regular, surge: Math.round(surge * 100) / 100 };
  }

  if (mode === "leguna") {
    const fare = Math.max(15, Math.min(30, Math.round(distanceKm * 4.5)));
    return { regular: fare, student: fare, surge: 1.0 };
  }

  // Rickshaw (Non-metered with surge)
  let base = Math.max(30, Math.round(distanceKm * 20));
  let surge = 1.0;
  if (weather === "rain") surge += 0.5; // +50%
  if (isRushHour) surge += 0.25;        // +25%
  const regular = Math.ceil(base * surge);
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
  const hubs = Object.keys(STATIC_HUBS);
  if (!origin || !destination || origin === destination || !STATIC_HUBS[origin] || !STATIC_HUBS[destination]) return [];

  // Identify disrupted hubs
  const waterloggedHubs = new Set(
    activeAlerts.filter(a => a.type === "waterlogging" && a.is_active).map(a => a.hub)
  );
  const blockedHubs = new Set(
    activeAlerts.filter(a => a.type === "blockade" && a.is_active).map(a => a.hub)
  );

  // Build adjacency graph
  const graph = {};
  hubs.forEach(h => { graph[h] = []; });

  BASE_TRANSIT_EDGES.forEach(edge => {
    let weight = edge.time;

    // Surface traffic disruptions
    if (!edge.elevated) {
      if (waterloggedHubs.has(edge.u) || waterloggedHubs.has(edge.v)) {
        weight *= 4.5; // Severe waterlogging delay
      }
      if (blockedHubs.has(edge.u) || blockedHubs.has(edge.v)) {
        weight = 99999; // Road impassable
      }
      if (isRushHour) {
        weight *= 1.35;
      }
      if (weather === "rain") {
        weight *= 1.4;
      }
    } else {
      // Metro Viaduct remains immune to ground protests & water!
      weight *= 0.6; // Speed priority
    }

    graph[edge.u].push({ ...edge, to: edge.v, weight });
    graph[edge.v].push({ ...edge, to: edge.u, weight });
  });

  // Shortest path via Dijkstra
  const distances = {};
  const prev = {};
  const edgeUsed = {};
  const pq = [origin];

  hubs.forEach(h => { distances[h] = Infinity; });
  distances[origin] = 0;

  while (pq.length > 0) {
    pq.sort((a, b) => distances[a] - distances[b]);
    const curr = pq.shift();

    if (curr === destination) break;

    (graph[curr] || []).forEach(edge => {
      const alt = distances[curr] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        prev[edge.to] = curr;
        edgeUsed[edge.to] = edge;
        if (!pq.includes(edge.to)) pq.push(edge.to);
      }
    });
  }

  // Reconstruct path
  const path = [];
  let step = destination;
  while (prev[step]) {
    path.unshift({ from: prev[step], to: step, edge: edgeUsed[step] });
    step = prev[step];
  }

  if (path.length === 0) {
    // Fallback direct route
    const fallbackFare = calculateFare("rickshaw", origin, destination, 6.0, weather, isRushHour);
    return [
      {
        id: "opt-fastest",
        title: `Direct Connector (${origin} ➔ ${destination})`,
        title_bn: `সরাসরি সংযোগ (${STATIC_HUBS[origin].name_bn} ➔ ${STATIC_HUBS[destination].name_bn})`,
        type_badge: "Direct Route",
        total_duration_mins: 30,
        total_regular_fare: fallbackFare.regular,
        total_student_fare: fallbackFare.student,
        transfers: 0,
        is_recommended: true,
        is_detour: false,
        legs: [
          {
            leg_number: 1,
            mode: "rickshaw",
            line_name: "Connector Rickshaw",
            from_hub: origin,
            to_hub: destination,
            distance_km: 6.0,
            duration_mins: 30,
            regular_fare_bdt: fallbackFare.regular,
            student_fare_bdt: fallbackFare.student,
            surge_multiplier: fallbackFare.surge,
            landmark_instructions: `Board connector near ${STATIC_HUBS[origin].landmarks[0]}.`
          }
        ]
      }
    ];
  }

  // Consolidate consecutive legs of same line/mode (especially MRT-6)
  const consolidated = [];
  path.forEach((p) => {
    const e = p.edge;
    const duration = Math.round(e.time * (weather === "rain" && !e.elevated ? 1.3 : 1.0));
    if (consolidated.length > 0 && consolidated[consolidated.length - 1].mode === e.mode && consolidated[consolidated.length - 1].line === e.line) {
      const last = consolidated[consolidated.length - 1];
      last.to = p.to;
      last.dist += e.dist;
      last.duration += duration;
      last.intermediate.push(p.from);
    } else {
      consolidated.push({
        from: p.from,
        to: p.to,
        mode: e.mode,
        line: e.line,
        dist: e.dist,
        duration: duration,
        intermediate: []
      });
    }
  });

  let totalTime = 0;
  let totalRegular = 0;
  let totalStudent = 0;
  const isDetourActive = waterloggedHubs.size > 0 || blockedHubs.size > 0;

  const legs = consolidated.map((c, idx) => {
    const fare = calculateFare(c.mode, c.from, c.to, c.dist, weather, isRushHour);
    totalTime += c.duration;
    totalRegular += fare.regular;
    totalStudent += fare.student;

    let landmark = c.mode === "metro"
      ? `Board MRT-6 at ${c.from} Station. Alight at ${c.to} Platform.`
      : `Board ${c.line} at ${c.from} near ${STATIC_HUBS[c.from]?.landmarks?.[0] || 'Bus Stop'}.`;

    if (c.intermediate.length > 0) {
      landmark += ` (${c.intermediate.length} intermediate stops via ${c.intermediate.slice(0, 3).join(', ')}${c.intermediate.length > 3 ? '...' : ''})`;
    }

    return {
      leg_number: idx + 1,
      mode: c.mode,
      line_name: c.line,
      from_hub: c.from,
      to_hub: c.to,
      distance_km: Math.round(c.dist * 10) / 10,
      duration_mins: c.duration,
      regular_fare_bdt: fare.regular,
      student_fare_bdt: fare.student,
      surge_multiplier: fare.surge,
      landmark_instructions: landmark
    };
  });

  const fastestRoute = {
    id: "opt-fastest",
    title: isDetourActive ? `Dynamic Detour (${origin} ➔ ${destination})` : `Express Route (${origin} ➔ ${destination})`,
    title_bn: isDetourActive ? `নিরাপদ বিকল্প রুট (${STATIC_HUBS[origin].name_bn} ➔ ${STATIC_HUBS[destination].name_bn})` : `দ্রুততম এক্সপ্রেস রুট`,
    type_badge: isDetourActive ? "Safe Detour" : "Fastest Route",
    total_duration_mins: totalTime,
    total_regular_fare: totalRegular,
    total_student_fare: totalStudent,
    transfers: Math.max(0, path.length - 1),
    is_recommended: true,
    is_detour: isDetourActive,
    disruption_warning: isDetourActive ? "Route automatically avoids flooded or blockaded intersections." : null,
    legs
  };

  // Student Economy alternative
  const economyRoute = {
    id: "opt-cheapest",
    title: `Student Half-Pass Economy (${origin} ➔ ${destination})`,
    title_bn: `শিক্ষার্থী সাশ্রয়ী হাফ-পাস রুট`,
    type_badge: "Student Pick",
    total_duration_mins: Math.round(totalTime * 1.25),
    total_regular_fare: Math.max(20, Math.round(totalRegular * 0.7)),
    total_student_fare: Math.max(10, Math.round(totalStudent * 0.5)),
    transfers: Math.max(0, path.length - 1),
    is_recommended: false,
    is_detour: false,
    legs
  };

  // Direct CNG Auto-Rickshaw alternative
  const cngDist = Math.max(2.0, legs.reduce((acc, l) => acc + l.distance_km, 0) || 5.0);
  let cngBase = cngDist <= 2.0 ? 40 : 40 + Math.ceil((cngDist - 2.0) * 12);
  cngBase = Math.max(100, cngBase);
  let cngSurge = 1.0;
  if (weather === "rain") cngSurge += 0.3;
  if (isRushHour) cngSurge += 0.25;
  const cngFare = Math.ceil(cngBase * cngSurge);
  let cngTime = Math.max(12, Math.round(cngDist * 2.3));
  if (isRushHour) cngTime = Math.round(cngTime * 1.3);
  if (weather === "rain") cngTime = Math.round(cngTime * 1.25);

  const cngRoute = {
    id: "opt-cng",
    title: `Direct CNG Auto-Rickshaw (${origin} ➔ ${destination})`,
    title_bn: `সরাসরি সিএনজি অটোরিকশা (${STATIC_HUBS[origin]?.name_bn || origin} ➔ ${STATIC_HUBS[destination]?.name_bn || destination})`,
    type_badge: "Direct & Private",
    total_duration_mins: cngTime,
    total_regular_fare: cngFare,
    total_student_fare: cngFare,
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
        distance_km: Math.round(cngDist * 10) / 10,
        duration_mins: cngTime,
        regular_fare_bdt: cngFare,
        student_fare_bdt: cngFare,
        surge_multiplier: Math.round(cngSurge * 100) / 100,
        landmark_instructions: `${origin} সিএনজি স্ট্যান্ড থেকে সরাসরি ${destination}। কোনো পরিবর্তন ছাড়া দ্রুত যাতায়াত।`
      }
    ]
  };

  return [fastestRoute, economyRoute, cngRoute];
}
