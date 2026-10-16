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

export function voteAlert(alertId, voteType) {
  const alert = activeAlerts.find(a => a.id === alertId);
  if (!alert) return null;

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

  return alert;
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

export function getSimulationState() {
  return simulationState;
}

export function setSimulationState(newState) {
  simulationState = { ...simulationState, ...newState };
  return simulationState;
}
