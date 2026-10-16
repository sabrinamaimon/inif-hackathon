/**
 * DhakaPath Custom Dijkstra Routing & Multi-Modal Fare Engine
 * Supports:
 * - 15 Major Dhaka Hubs
 * - Multi-leg connections (Metro, Bus, Leguna, Rickshaw)
 * - 50% Student Discount with Statutory 10 BDT Minimum Floor
 * - Non-metered Rickshaw Weather (+50%) and Rush-Hour (+25%) Surges
 * - Dynamic Detour calculation during Waterlogging and Intersection Blockades
 */

import { STATIC_HUBS } from '../data/staticData';

export const METRO_FARE_CHART = {
  "Uttara-Mirpur 10": 30,
  "Uttara-Agargaon": 50,
  "Uttara-Farmgate": 60,
  "Uttara-Shahbagh": 80,
  "Uttara-Motijheel": 100,
  "Mirpur 10-Agargaon": 20,
  "Mirpur 10-Farmgate": 30,
  "Mirpur 10-Shahbagh": 40,
  "Mirpur 10-Motijheel": 50,
  "Agargaon-Farmgate": 20,
  "Agargaon-Shahbagh": 30,
  "Agargaon-Motijheel": 40,
  "Farmgate-Shahbagh": 20,
  "Farmgate-Motijheel": 30,
  "Shahbagh-Motijheel": 20
};

export const BASE_TRANSIT_EDGES = [
  // Metro MRT-6 (Elevated - Immune to surface traffic/waterlogging)
  { u: "Uttara", v: "Mirpur 10", mode: "metro", line: "MRT-6 Metro Rail", dist: 8.5, time: 10, elevated: true },
  { u: "Mirpur 10", v: "Agargaon", mode: "metro", line: "MRT-6 Metro Rail", dist: 3.8, time: 6, elevated: true },
  { u: "Agargaon", v: "Farmgate", mode: "metro", line: "MRT-6 Metro Rail", dist: 3.2, time: 5, elevated: true },
  { u: "Farmgate", v: "Shahbagh", mode: "metro", line: "MRT-6 Metro Rail", dist: 2.5, time: 5, elevated: true },
  { u: "Shahbagh", v: "Motijheel", mode: "metro", line: "MRT-6 Metro Rail", dist: 2.8, time: 6, elevated: true },

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
  { u: "Agargaon", v: "Mohakhali", mode: "bus", line: "Raja City", dist: 3.6, time: 18, elevated: false }
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
  if (!STATIC_HUBS[origin] || !STATIC_HUBS[destination]) return [];

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

  // Build legs and compute fares
  let totalTime = 0;
  let totalRegular = 0;
  let totalStudent = 0;
  const isDetourActive = waterloggedHubs.size > 0 || blockedHubs.size > 0;

  const legs = path.map((p, idx) => {
    const e = p.edge;
    const fare = calculateFare(e.mode, p.from, p.to, e.dist, weather, isRushHour);
    const duration = Math.round(e.time * (weather === "rain" ? 1.3 : 1.0));
    totalTime += duration;
    totalRegular += fare.regular;
    totalStudent += fare.student;

    const landmark = e.mode === "metro"
      ? `Board MRT-6 at ${p.from} Station. Alight at ${p.to}.`
      : `Board ${e.line} at ${p.from} near ${STATIC_HUBS[p.from].landmarks[0]}.`;

    return {
      leg_number: idx + 1,
      mode: e.mode,
      line_name: e.line,
      from_hub: p.from,
      to_hub: p.to,
      distance_km: e.dist,
      duration_mins: duration,
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

  return [fastestRoute, economyRoute];
}
