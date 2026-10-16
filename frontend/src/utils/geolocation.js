import { toBnDigits } from './localization.js';

/**
 * Calculates Great-Circle distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance cleanly in Bangla or English
 */
export function formatDistance(distanceKm, lang = 'bn') {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return lang === 'bn' ? `${toBnDigits(meters)} মিটার` : `${meters} m`;
  }
  const km = distanceKm.toFixed(1);
  return lang === 'bn' ? `${toBnDigits(km)} কিমি` : `${km} km`;
}

/**
 * Finds the closest transit hub/station to given GPS coordinates
 */
export function findNearestTransitHub(userLat, userLng, hubs) {
  if (!hubs || typeof userLat !== 'number' || typeof userLng !== 'number') return null;

  let nearestHub = null;
  let minDistance = Infinity;

  Object.entries(hubs).forEach(([name, hub]) => {
    if (typeof hub.lat === 'number' && typeof hub.lng === 'number') {
      const dist = calculateDistanceKm(userLat, userLng, hub.lat, hub.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestHub = { ...hub, name, distanceKm: dist };
      }
    }
  });

  return nearestHub;
}

/**
 * Prompts user for geolocation and returns position promise
 */
export function getUserCoordinates(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
        ...options
      }
    );
  });
}
