'use client';

import React, { useEffect, useRef, useState } from 'react';
import { STATIC_HUBS } from '../data/staticData';
import { MapPin, Navigation, Droplets, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toBnDigits } from '../utils/localization';

export default function MapView({ 
  hubs = STATIC_HUBS, 
  activeAlerts = [], 
  activeRoute = null, 
  lang = 'bn',
  onSelectHub
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet safely on the client
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Center around Dhaka center: Lat 23.777176, Lng 90.399452, Zoom: 12
        const map = L.map(mapContainerRef.current, {
          center: [23.7772, 90.3995],
          zoom: 12,
          zoomControl: true,
          attributionControl: false
        });

        // OpenStreetMap free tile server (100% free, no API key required)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      // Plot Hub Markers
      Object.entries(hubs).forEach(([name, data]) => {
        const isWaterlogged = activeAlerts.some(a => a.hub === name && a.type === 'waterlogging' && a.is_active);
        const isBlockaded = activeAlerts.some(a => a.hub === name && a.type === 'blockade' && a.is_active);
        const isMetro = data.is_metro_station;

        let badgeBg = isWaterlogged ? '#ef4444' : isBlockaded ? '#f59e0b' : isMetro ? '#059669' : '#2563eb';
        let pulseClass = (isWaterlogged || isBlockaded) ? 'animate-ping' : '';

        const customIcon = L.divIcon({
          className: 'custom-hub-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              ${(isWaterlogged || isBlockaded) ? `
                <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${badgeBg}; opacity: 0.4;" class="${pulseClass}"></div>
              ` : ''}
              <div style="background: ${badgeBg}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                ${isMetro ? 'M' : isWaterlogged ? '💧' : isBlockaded ? '⚠️' : '●'}
              </div>
              <div style="background: rgba(15, 23, 42, 0.9); color: #f8fafc; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; margin-top: 3px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
                ${lang === 'bn' ? data.name_bn : data.name}
              </div>
            </div>
          `,
          iconSize: [80, 48],
          iconAnchor: [40, 24]
        });

        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          if (onSelectHub) onSelectHub(name);
        });

        const statusText = isWaterlogged 
          ? (lang === 'bn' ? '⚠️ জলজট সতর্কতা: নিচু গাড়ি চলাচল বন্ধ' : '⚠️ Waterlogging: Surface transport stalled')
          : isBlockaded 
          ? (lang === 'bn' ? '🚫 ব্যারিকেড সতর্কতা: মেট্রোরেল চালু' : '🚫 Blockade: Metro operational')
          : isMetro 
          ? (lang === 'bn' ? 'মেট্রোরেল (MRT-6) স্টেশন সংযুক্ত' : 'MRT-6 Metro Station Connected')
          : (lang === 'bn' ? 'স্বাভাবিক ট্রানজিট প্রবাহ' : 'Normal Transit Flow');

        marker.bindPopup(`
          <div style="padding: 4px;">
            <div style="font-weight: 800; font-size: 14px; color: #10b981; margin-bottom: 2px;">
              ${lang === 'bn' ? data.name_bn : data.name}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">
              ${data.zone}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #f8fafc; margin-bottom: 6px;">
              ${statusText}
            </div>
            <div style="font-size: 10px; color: #cbd5e1;">
              <strong>${lang === 'bn' ? 'ল্যান্ডমার্ক:' : 'Landmarks:'}</strong> ${data.landmarks ? data.landmarks.join(', ') : 'Main Intersection'}
            </div>
          </div>
        `);

        markersRef.current[name] = marker;
      });

      // Draw Route Polyline if an active itinerary is selected
      if (activeRoute && activeRoute.legs && activeRoute.legs.length > 0) {
        const latlngs = [];
        activeRoute.legs.forEach(leg => {
          if (hubs[leg.from_hub]) {
            latlngs.push([hubs[leg.from_hub].lat, hubs[leg.from_hub].lng]);
          }
          if (hubs[leg.to_hub]) {
            latlngs.push([hubs[leg.to_hub].lat, hubs[leg.to_hub].lng]);
          }
        });

        if (latlngs.length >= 2) {
          polylineRef.current = L.polyline(latlngs, {
            color: activeRoute.is_detour ? '#ef4444' : '#10b981',
            weight: 5,
            opacity: 0.9,
            dashArray: activeRoute.is_detour ? '8, 8' : undefined
          }).addTo(map);

          map.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isClient, hubs, activeAlerts, activeRoute, lang]);

  return (
    <div className="relative w-full h-[440px] sm:h-[540px] lg:h-[620px] glass-panel overflow-hidden border border-emerald-500/30 my-6 shadow-2xl">
      {/* Map Header Strip */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-sm text-white shadow-xl">
        <Navigation className="w-4 h-4 text-emerald-400" />
        <span className="font-extrabold">{lang === 'bn' ? 'ঢাকা লাইভ ট্রানজিট গ্রিড' : 'Dhaka Live Transit Grid'}</span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
          OpenStreetMap Free
        </span>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-wrap items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 text-xs sm:text-sm text-slate-200 shadow-xl max-w-[95%]">
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>{lang === 'bn' ? 'মেট্রোরেল (MRT-6)' : 'MRT-6 Metro'}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>{lang === 'bn' ? 'বাস ও লেগুনা' : 'Bus & Leguna'}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-rose-300">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <span>{lang === 'bn' ? 'জলজট' : 'Waterlogging'}</span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-amber-300">
          <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <span>{lang === 'bn' ? 'ব্যারিকেড' : 'Blockade'}</span>
        </div>
      </div>

      {/* Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
