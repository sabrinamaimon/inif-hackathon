import { STATIC_ALERTS, STATIC_HUBS, STATIC_RIDESHARE } from './staticData';

// Global in-memory storage for active session (Next.js server)
let activeAlerts = [...STATIC_ALERTS];
let activeRideShares = [...STATIC_RIDESHARE];
let simulationState = {
  rain_active: false,
  rush_hour_active: false,
  blocked_hubs: [],
  waterlogged_hubs: []
};

export function getAlerts() {
  return activeAlerts;
}

export function addAlert(newAlert) {
  const alertWithDefaults = {
    id: newAlert.id || `alert-${Date.now()}`,
    type: newAlert.type || 'traffic_jam',
    hub: newAlert.hub || 'Shahbagh',
    severity: newAlert.severity || 'moderate',
    title: newAlert.title || 'Live Commuter Alert',
    title_bn: newAlert.title_bn || 'লাইভ ট্রাফিক সতর্কতা',
    description: newAlert.description || '',
    description_bn: newAlert.description_bn || '',
    upvotes: newAlert.upvotes || 1,
    downvotes: newAlert.downvotes || 0,
    trust_score: newAlert.trust_score || 75.0,
    minutes_ago: 1,
    verified: Boolean(newAlert.verified),
    is_active: true
  };
  activeAlerts.unshift(alertWithDefaults);
  return alertWithDefaults;
}

// IP-based voting ledger: key `${alertId}:${clientIp}` -> voteType
const alertIpVotes = new Map();

// Area-specific flood-prone hubs with high waterlogging risk during rain/storm
export const FLOOD_PRONE_HUBS = ['Malibagh', 'Sadarghat', 'Lalbagh', 'Kazipara', 'Mirpur 10'];

export function voteAlert(alertId, voteType, clientIp = '127.0.0.1') {
  const alert = activeAlerts.find(a => a.id === alertId);
  if (!alert) return null;

  const voteKey = `${alertId}:${clientIp}`;
  if (alertIpVotes.has(voteKey)) {
    return {
      already_voted: true,
      user_vote: alertIpVotes.get(voteKey),
      alert
    };
  }

  alertIpVotes.set(voteKey, voteType);

  if (voteType === 'upvote') {
    alert.upvotes += 1;
  } else if (voteType === 'downvote') {
    alert.downvotes += 1;
  }

  // Crowdsourced mathematical trust score calculation:
  // Base formula: (upvotes * 8 - downvotes * 12 + 50)
  // Adjusted with time-decay factor
  const rawScore = alert.upvotes * 8 - alert.downvotes * 12 + 50;
  const decayFactor = Math.max(0.2, 1.0 - (alert.minutes_ago / 180));
  alert.trust_score = Math.min(100, Math.max(0, Math.round(rawScore * decayFactor)));
  alert.verified = alert.trust_score >= 80;

  return {
    already_voted: false,
    user_vote: voteType,
    alert
  };
}

export function getRideShares() {
  return activeRideShares;
}

export function addRideShare(newRide) {
  const ride = {
    id: `ride-${Date.now()}`,
    ...newRide,
    created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  activeRideShares.unshift(ride);
  return ride;
}

export function updateAlert(alertId, updates) {
  const index = activeAlerts.findIndex(a => a.id === alertId);
  if (index === -1) return null;
  activeAlerts[index] = { ...activeAlerts[index], ...updates };
  return activeAlerts[index];
}

export function deleteAlert(alertId) {
  const index = activeAlerts.findIndex(a => a.id === alertId);
  if (index === -1) return false;
  activeAlerts.splice(index, 1);
  return true;
}

// Admin Core Transit Route Network (Part 1 CMS Requirement)
let activeTransitRoutes = [
  {
    id: "route-mrt6",
    name: "MRT-6 Metro Rail",
    name_bn: "এমআরটি-৬ মেট্রোরেল (এক্সপ্রেস)",
    mode: "metro",
    origin_hub: "Uttara North",
    destination_hub: "Kamalapur",
    distance_km: 21.2,
    duration_mins: 38,
    base_fare_bdt: 20,
    max_fare_bdt: 100,
    student_pass_allowed: false,
    landmarks: "Uttara North Diabari Concourse ➔ Motijheel Exit B",
    is_active: true
  },
  {
    id: "route-bikolpo",
    name: "Bikolpo Auto Service",
    name_bn: "বিকল্প অটো সার্ভিস",
    mode: "bus",
    origin_hub: "Mirpur 12",
    destination_hub: "Motijheel",
    distance_km: 14.5,
    duration_mins: 45,
    base_fare_bdt: 10,
    max_fare_bdt: 35,
    student_pass_allowed: true,
    landmarks: "Purobi Cinema ➔ Farmgate Ananda ➔ Shapla Chattar",
    is_active: true
  },
  {
    id: "route-savar",
    name: "Savar Paribahan",
    name_bn: "সাভার পরিবহন",
    mode: "bus",
    origin_hub: "Dhanmondi",
    destination_hub: "Sadarghat",
    distance_km: 7.6,
    duration_mins: 22,
    base_fare_bdt: 10,
    max_fare_bdt: 20,
    student_pass_allowed: true,
    landmarks: "Rapa Plaza 27 ➔ Science Lab ➔ Bahadur Shah Park",
    is_active: true
  },
  {
    id: "route-thikana",
    name: "Thikana Paribahan",
    name_bn: "ঠিকানা পরিবহন",
    mode: "bus",
    origin_hub: "Mohammadpur",
    destination_hub: "Banasree",
    distance_km: 12.0,
    duration_mins: 40,
    base_fare_bdt: 10,
    max_fare_bdt: 30,
    student_pass_allowed: true,
    landmarks: "Town Hall ➔ Science Lab ➔ Shahbagh ➔ Rampura Bridge",
    is_active: true
  },
  {
    id: "route-townhall-leguna",
    name: "Town Hall Leguna Stand",
    name_bn: "টাউন হল লেগুনা",
    mode: "leguna",
    origin_hub: "Mohammadpur",
    destination_hub: "Farmgate",
    distance_km: 3.4,
    duration_mins: 14,
    base_fare_bdt: 15,
    max_fare_bdt: 20,
    student_pass_allowed: false,
    landmarks: "Town Hall Market Stand ➔ Khamarbari ➔ Farmgate ফুটওভার",
    is_active: true
  },
  {
    id: "route-dhanmondi-rickshaw",
    name: "Dhanmondi Connector Rickshaw",
    name_bn: "কানেক্টর রিকশা সেগমেন্ট",
    mode: "rickshaw",
    origin_hub: "Dhanmondi",
    destination_hub: "Farmgate",
    distance_km: 2.3,
    duration_mins: 12,
    base_fare_bdt: 40,
    max_fare_bdt: 50,
    student_pass_allowed: false,
    landmarks: "Dhanmondi 27 ➔ মানিক মিয়া এভিনিউ ➔ ফার্মগেট মেট্রো গেইট",
    is_active: true
  }
];

export function getTransitRoutes() {
  return activeTransitRoutes;
}

export function addTransitRoute(route) {
  const newRoute = {
    id: route.id || `route-${Date.now()}`,
    name: route.name || 'Custom Transit Link',
    name_bn: route.name_bn || 'নতুন ট্রানজিট রুট',
    mode: route.mode || 'bus',
    origin_hub: route.origin_hub || 'Mirpur 10',
    destination_hub: route.destination_hub || 'Motijheel',
    distance_km: Number(route.distance_km) || 5.0,
    duration_mins: Number(route.duration_mins) || 20,
    base_fare_bdt: Number(route.base_fare_bdt) || 10,
    max_fare_bdt: Number(route.max_fare_bdt) || 30,
    student_pass_allowed: Boolean(route.student_pass_allowed),
    landmarks: route.landmarks || 'স্ট্যান্ড ও বোর্ডিং নির্দেশিকা',
    is_active: true
  };
  activeTransitRoutes.unshift(newRoute);
  return newRoute;
}

export function updateTransitRoute(routeId, updates) {
  const index = activeTransitRoutes.findIndex(r => r.id === routeId);
  if (index === -1) return null;
  activeTransitRoutes[index] = { ...activeTransitRoutes[index], ...updates };
  return activeTransitRoutes[index];
}

export function deleteTransitRoute(routeId) {
  const index = activeTransitRoutes.findIndex(r => r.id === routeId);
  if (index === -1) return false;
  activeTransitRoutes.splice(index, 1);
  return true;
}

// BRTA Base Fare Gazette & Surge Settings (Part 1 CMS Requirement)
let baseFareSettings = {
  bus_rate_per_km: 2.50,
  bus_min_floor_bdt: 10,
  student_discount_percentage: 50,
  cng_base_fare: 40,
  cng_rate_per_km: 12,
  rickshaw_base_fare: 30,
  rickshaw_rain_surge_percent: 50,
  rickshaw_rush_surge_percent: 25
};

export function getBaseFareSettings() {
  return baseFareSettings;
}

export function updateBaseFareSettings(updates) {
  baseFareSettings = { ...baseFareSettings, ...updates };
  return baseFareSettings;
}

export function getSimulationState() {
  return simulationState;
}

export function setSimulationState(newState) {
  simulationState = { ...simulationState, ...newState };
  return simulationState;
}
