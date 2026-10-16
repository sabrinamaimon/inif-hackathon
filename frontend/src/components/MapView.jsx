'use client';

import React, { useEffect, useRef, useState } from 'react';
import { STATIC_HUBS } from '../data/staticData';
import { MapPin, Navigation, Droplets, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';
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
          center: [23.7550, 90.4050],
          zoom: 12,
          zoomControl: true,
          attributionControl: false
        });

        // CartoDB Voyager (free, no API key required, vintage cartography aesthetic)
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
        const isRiverport = name === 'Sadarghat';
        const isLalbagh = name === 'Lalbagh';

        let badgeBg = isWaterlogged ? '#b83a2e' : isBlockaded ? '#e2b448' : isMetro ? '#0e6e41' : isRiverport ? '#1c4568' : '#292019';
        let badgeIcon = isWaterlogged ? '💧' : isBlockaded ? '⚠️' : isMetro ? '🚇' : isRiverport ? '⛵' : isLalbagh ? '🏛️' : '🛺';
        let pulseClass = (isWaterlogged || isBlockaded) ? 'animate-ping' : '';

        const customIcon = L.divIcon({
          className: 'custom-hub-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              ${(isWaterlogged || isBlockaded) ? `
                <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${badgeBg}; opacity: 0.45;" class="${pulseClass}"></div>
              ` : ''}
              <div style="background: ${badgeBg}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; border: 2.5px solid #f6d16f; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
                ${badgeIcon}
              </div>
              <div style="background: #18130f; color: #f6d16f; font-family: 'Anek Bangla', sans-serif; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 8px; margin-top: 3px; white-space: nowrap; border: 1.5px solid #c69429; box-shadow: 0 3px 8px rgba(0,0,0,0.5);">
                ${lang === 'bn' ? (data.name_bn || data.name) : data.name}
              </div>
            </div>
          `,
          iconSize: [90, 52],
          iconAnchor: [45, 26]
        });

        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          if (onSelectHub) onSelectHub(name);
        });

        const statusText = isWaterlogged 
          ? (lang === 'bn' ? '⚠️ জলজট সতর্কতা: নিচু রাস্তায় যান চলাচল ব্যাহত' : '⚠️ Waterlogging: Surface transport stalled')
          : isBlockaded 
          ? (lang === 'bn' ? '🚫 ব্যারিকেড সতর্কতা: মেট্রোরেল বা গলিপথে রিকশা চালু' : '🚫 Blockade: Metro & Rickshaws operational')
          : isMetro 
          ? (lang === 'bn' ? '🚇 এমআরটি-৬ মেট্রোরেল স্টেশন সংযুক্ত' : 'MRT-6 Metro Station Connected')
          : isRiverport
          ? (lang === 'bn' ? '⛵ সদরঘাট লঞ্চ ও বুড়িগঙ্গা খেয়া ঘাট' : 'Sadarghat Launch & Riverport')
          : (lang === 'bn' ? 'সচল ট্রানজিট করিডোর' : 'Normal Transit Corridor');

        marker.bindPopup(`
          <div style="padding: 6px; font-family: 'Hind Siliguri', sans-serif;">
            <div style="font-weight: 800; font-size: 15px; color: #f6d16f; margin-bottom: 2px;">
              ${lang === 'bn' ? (data.name_bn || data.name) : data.name}
            </div>
            <div style="font-size: 11px; color: #dfcfb2; margin-bottom: 6px;">
              ${data.zone}
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #fbf8f1; margin-bottom: 6px;">
              ${statusText}
            </div>
            <div style="font-size: 11px; color: #cbb692;">
              <strong>${lang === 'bn' ? 'ল্যান্ডমার্ক:' : 'Landmarks:'}</strong> ${data.landmarks ? data.landmarks.join(', ') : 'Main Road'}
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
            color: activeRoute.is_detour ? '#b83a2e' : '#f6d16f',
            weight: 5,
            opacity: 0.9,
            dashArray: activeRoute.is_detour ? '8, 8' : null
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
    <div className="heritage-card p-4 my-6 border-2 border-[#c69429]/50 shadow-2xl relative overflow-hidden bg-[#18130f]">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-[#c69429]/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#b83a2e]/30 border border-[#b83a2e] flex items-center justify-center text-[#f6d16f]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-rickshaw text-xl text-[#f6d16f] rickshaw-text-pop">
              {lang === 'bn' ? 'ঢাকা লাইভ ট্রানজিট ও হেরিটেজ ম্যাপ' : 'Dhaka Live Transit & Heritage Map'}
            </h3>
            <p className="font-anek text-xs text-[#dfcfb2]">
              {lang === 'bn' ? 'কার্টোগ্রাফিক ও স্যাটেলাইট গ্রিডে ১৬টি নোড ও রুট প্রদর্শন' : 'Interactive node graph covering 16 major Dhaka hubs'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-anek font-bold text-[#dfcfb2] bg-[#120e0b] px-3 py-1.5 rounded-xl border border-[#c69429]/40">
          <span className="flex items-center gap-1 text-[#6ee7b7]">
            <span>🚇</span>
            <span>মেট্রোরেল</span>
          </span>
          <span className="flex items-center gap-1 text-[#f6d16f]">
            <span>🛺</span>
            <span>বাস/রিকশা</span>
          </span>
          <span className="flex items-center gap-1 text-[#7dd3fc]">
            <span>⛵</span>
            <span>সদরঘাট খেয়া</span>
          </span>
          <span className="flex items-center gap-1 text-[#d6645a]">
            <span>💧</span>
            <span>জলজট</span>
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height: '380px', width: '100%' }}
        className="rounded-xl border border-[#c69429]/30 overflow-hidden shadow-inner"
      />
    </div>
  );
}
