'use client';

import React, { useEffect, useRef, useState } from 'react';
import { STATIC_HUBS, MRT6_ALIGNMENT, MRT6_STATIONS_DATA } from '../data/staticData';
import { Compass, Train, Navigation, AlertTriangle, Layers, Filter } from 'lucide-react';
import { toBnDigits } from '../utils/localization';

export default function MapView({ 
  hubs = STATIC_HUBS, 
  activeAlerts = [], 
  activeRoute = null, 
  lang = 'bn',
  onSelectHub,
  onSetOrigin,
  onSetDestination
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const metroTrackLayersRef = useRef([]);
  const activeRoutePolylineRef = useRef(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'metro_only', 'alerts_only'
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Expose popup button callbacks to window for Leaflet DOM clicks
  useEffect(() => {
    window.dhakaPathSetOrigin = (hubName) => {
      if (onSetOrigin) onSetOrigin(hubName);
      else if (onSelectHub) onSelectHub(hubName);
    };
    window.dhakaPathSetDestination = (hubName) => {
      if (onSetDestination) onSetDestination(hubName);
      else if (onSelectHub) onSelectHub(hubName);
    };

    return () => {
      delete window.dhakaPathSetOrigin;
      delete window.dhakaPathSetDestination;
    };
  }, [onSetOrigin, onSetDestination, onSelectHub]);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet safely on the client
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Center around Dhaka center: Lat 23.7850, Lng 90.3950, Zoom: 12
        const map = L.map(mapContainerRef.current, {
          center: [23.7850, 90.3950],
          zoom: 12,
          zoomControl: true,
          attributionControl: false
        });

        // OpenStreetMap Standard Free Tiles (100% Free, No Watermarks)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c'],
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers & tracks
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      metroTrackLayersRef.current.forEach((layer) => layer.remove());
      metroTrackLayersRef.current = [];

      if (activeRoutePolylineRef.current) {
        activeRoutePolylineRef.current.remove();
        activeRoutePolylineRef.current = null;
      }

      // =========================================================================
      // 1. DRAW PERMANENT ELEVATED MRT-6 METRO RAIL TRACK (All 17 Stations)
      // =========================================================================
      if (filterMode === 'all' || filterMode === 'metro_only') {
        // Track viaduct outer casing (concrete deck)
        const viaductCasing = L.polyline(MRT6_ALIGNMENT, {
          color: '#064e3b',
          weight: 9,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Track elevated rail surface (emerald green line)
        const viaductInner = L.polyline(MRT6_ALIGNMENT, {
          color: '#10b981',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Illuminated track centerline dash
        const viaductDash = L.polyline(MRT6_ALIGNMENT, {
          color: '#ffffff',
          weight: 1.5,
          opacity: 0.9,
          dashArray: '6, 10'
        }).addTo(map);

        const trackTooltip = `🚇 <strong>এমআরটি-৬ মেট্রোরেল এলিভেটেড লাইন</strong><br/><span style="font-size: 11px;">উত্তরা উত্তর (দিয়াবাড়ী) ⇄ মতিঝিল ⇄ কমলাপুর • ১৭টি স্টেশন</span>`;
        viaductInner.bindTooltip(trackTooltip, { sticky: true, className: 'font-anek' });

        metroTrackLayersRef.current.push(viaductCasing, viaductInner, viaductDash);
      }

      // =========================================================================
      // 2. PLOT STATION & HUB MARKERS
      // =========================================================================
      Object.entries(hubs).forEach(([name, data]) => {
        const isMetro = Boolean(data.is_metro_station);
        const isWaterlogged = activeAlerts.some(a => a.hub === name && a.type === 'waterlogging' && a.is_active);
        const isBlockaded = activeAlerts.some(a => a.hub === name && a.type === 'blockade' && a.is_active);

        // Apply view filter
        if (filterMode === 'metro_only' && !isMetro) return;
        if (filterMode === 'alerts_only' && !isWaterlogged && !isBlockaded) return;

        const isRiverport = name === 'Sadarghat';
        const isLalbagh = name === 'Lalbagh';

        // Badge styling
        let badgeBg = isWaterlogged 
          ? '#b83a2e' 
          : isBlockaded 
          ? '#e2b448' 
          : isMetro 
          ? '#059669' 
          : isRiverport 
          ? '#1c4568' 
          : '#292019';

        let badgeIcon = isWaterlogged ? '💧' : isBlockaded ? '⚠️' : isMetro ? '🚇' : isRiverport ? '⛵' : isLalbagh ? '🏛️' : '🛺';
        let pulseClass = (isWaterlogged || isBlockaded) ? 'animate-ping' : '';

        // Order badge for metro stations (M-01, M-02, ..., M-17)
        const stationOrder = data.station_order || (MRT6_STATIONS_DATA.find(s => s.name === name || s.name_bn === data.name_bn)?.order);
        const orderPill = stationOrder ? `M-${String(stationOrder).padStart(2, '0')}` : '';

        const customIcon = L.divIcon({
          className: 'custom-hub-icon',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              ${(isWaterlogged || isBlockaded) ? `
                <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${badgeBg}; opacity: 0.45;" class="${pulseClass}"></div>
              ` : ''}
              
              <div style="position: relative; background: ${badgeBg}; color: white; width: ${isMetro ? '32px' : '28px'}; height: ${isMetro ? '32px' : '28px'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: ${isMetro ? '15px' : '13px'}; font-weight: bold; border: 2.5px solid ${isMetro ? '#34d399' : '#f6d16f'}; box-shadow: 0 4px 14px rgba(0,0,0,0.65);">
                ${badgeIcon}
                ${orderPill ? `
                  <div style="position: absolute; top: -8px; right: -12px; background: #064e3b; color: #34d399; font-family: monospace; font-size: 9px; font-weight: 900; padding: 1px 4px; border-radius: 6px; border: 1px solid #10b981; box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
                    ${orderPill}
                  </div>
                ` : ''}
              </div>

              <div style="background: #14100c; color: ${isMetro ? '#34d399' : '#f6d16f'}; font-family: 'Anek Bangla', sans-serif; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 8px; margin-top: 3px; white-space: nowrap; border: 1.5px solid ${isMetro ? '#10b981' : '#c69429'}; box-shadow: 0 3px 8px rgba(0,0,0,0.6);">
                ${lang === 'bn' ? (data.name_bn || data.name) : data.name}
              </div>
            </div>
          `,
          iconSize: [110, 56],
          iconAnchor: [55, 28]
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
          ? (lang === 'bn' ? `🚇 এমআরটি-৬ মেট্রোরেল স্টেশন ${orderPill ? `(${orderPill})` : ''} • প্রতি ৬ মিনিটে ট্রেন` : `MRT-6 Metro Station ${orderPill ? `(${orderPill})` : ''} • AC Train every 6 mins`)
          : isRiverport
          ? (lang === 'bn' ? '⛵ সদরঘাট লঞ্চ ও বুড়িগঙ্গা খেয়া ঘাট' : 'Sadarghat Launch & Riverport')
          : (lang === 'bn' ? 'সচল রোড ট্রানজিট হাব' : 'Surface Road Transit Hub');

        const metroCodeText = data.metro_code || data.metro_station_code || '';

        marker.bindPopup(`
          <div style="min-width: 220px; font-family: 'Anek Bangla', sans-serif;" class="p-1 text-slate-900">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="font-weight: 900; font-size: 15px; color: ${isMetro ? '#065f46' : '#b83a2e'};">
                ${lang === 'bn' ? (data.name_bn || data.name) : data.name}
              </span>
              ${orderPill ? `
                <span style="font-size: 10px; font-weight: 900; background: #064e3b; color: #a7f3d0; padding: 2px 6px; border-radius: 6px;">
                  ${orderPill}
                </span>
              ` : ''}
            </div>

            <div style="font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 6px;">
              ${data.zone || 'Dhaka Metropolitan Area'} ${metroCodeText ? `• ${metroCodeText}` : ''}
            </div>

            <div style="font-size: 11px; font-weight: 800; color: ${isMetro ? '#065f46' : '#1e293b'}; background: ${isMetro ? '#ecfdf5' : '#f1f5f9'}; padding: 6px; border-radius: 8px; border: 1px solid ${isMetro ? '#a7f3d0' : '#cbd5e1'}; margin-bottom: 8px;">
              ${statusText}
            </div>

            ${isMetro ? `
              <div style="font-size: 11px; color: #047857; margin-bottom: 8px; line-height: 1.4;">
                ✦ <strong>ভাড়া:</strong> সর্বনিম্ন ২০ ৳ • র‍্যাপিড পাস/MRT Pass-এ ১০% ছাড় (১৮ ৳)<br/>
                ✦ ১০০ মিনিট পেইড এরিয়ায় টিকিট কার্যকর
              </div>
            ` : ''}

            <div style="font-size: 11px; color: #334155; margin-bottom: 10px;">
              <strong>${lang === 'bn' ? 'ল্যান্ডমার্ক:' : 'Landmarks:'}</strong> ${data.landmarks ? data.landmarks.join(', ') : 'Main Road'}
            </div>

            <!-- Set as Origin / Destination Actions -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1;">
              <button 
                onclick="window.dhakaPathSetOrigin && window.dhakaPathSetOrigin('${name}')"
                style="background: #0f766e; color: white; border: none; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; text-align: center;"
              >
                ${lang === 'bn' ? '📍 যাত্রা শুরু' : '📍 Set Origin'}
              </button>
              <button 
                onclick="window.dhakaPathSetDestination && window.dhakaPathSetDestination('${name}')"
                style="background: #b45309; color: white; border: none; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; cursor: pointer; text-align: center;"
              >
                ${lang === 'bn' ? '🏁 গন্তব্য' : '🏁 Set Destination'}
              </button>
            </div>
          </div>
        `);

        markersRef.current[name] = marker;
      });

      // =========================================================================
      // 3. DRAW ACTIVE ROUTE POLYLINE (Follows True Metro Viaduct Curve)
      // =========================================================================
      if (activeRoute && activeRoute.legs && activeRoute.legs.length > 0) {
        const fullRouteLatLngs = [];

        activeRoute.legs.forEach(leg => {
          const fromName = leg.from_hub;
          const toName = leg.to_hub;
          const isMetroLeg = leg.mode === 'metro';

          if (isMetroLeg) {
            // Find indices of from_hub and to_hub along the 17-station alignment
            const idx1 = MRT6_STATIONS_DATA.findIndex(s => s.name === fromName || s.name_bn === fromName);
            const idx2 = MRT6_STATIONS_DATA.findIndex(s => s.name === toName || s.name_bn === toName);

            if (idx1 !== -1 && idx2 !== -1) {
              if (idx1 <= idx2) {
                for (let i = idx1; i <= idx2; i++) {
                  fullRouteLatLngs.push(MRT6_ALIGNMENT[i]);
                }
              } else {
                for (let i = idx1; i >= idx2; i--) {
                  fullRouteLatLngs.push(MRT6_ALIGNMENT[i]);
                }
              }
            } else {
              // Fallback to hub coordinates if index missing
              if (hubs[fromName]) fullRouteLatLngs.push([hubs[fromName].lat, hubs[fromName].lng]);
              if (hubs[toName]) fullRouteLatLngs.push([hubs[toName].lat, hubs[toName].lng]);
            }
          } else {
            // Surface legs (bus, leguna, rickshaw)
            if (hubs[fromName]) fullRouteLatLngs.push([hubs[fromName].lat, hubs[fromName].lng]);
            if (hubs[toName]) fullRouteLatLngs.push([hubs[toName].lat, hubs[toName].lng]);
          }
        });

        if (fullRouteLatLngs.length >= 2) {
          activeRoutePolylineRef.current = L.polyline(fullRouteLatLngs, {
            color: activeRoute.is_detour ? '#dc2626' : '#f59e0b',
            weight: 6,
            opacity: 0.95,
            dashArray: activeRoute.is_detour ? '8, 8' : null
          }).addTo(map);

          map.fitBounds(activeRoutePolylineRef.current.getBounds(), { padding: [60, 60] });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isClient, hubs, activeAlerts, activeRoute, filterMode, lang]);

  return (
    <div className="heritage-card p-4 sm:p-5 my-6 border-2 border-[#c69429]/50 shadow-2xl relative overflow-hidden bg-[#18130f]">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#c69429]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#059669] to-[#c69429] p-0.5 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#1a1410] flex items-center justify-center text-[#f6d16f]">
              <Compass className="w-5 h-5 text-[#34d399]" />
            </div>
          </div>
          <div>
            <h3 className="font-rickshaw text-xl sm:text-2xl text-[#f6d16f] rickshaw-text-pop flex items-center gap-2">
              <span>{lang === 'bn' ? 'ঢাকা লাইভ ট্রানজিট ও মেট্রোরেল এমআরটি-৬ ম্যাপ' : 'Dhaka Transit & MRT-6 Metro Rail Alignment'}</span>
              <span className="text-xs font-mono font-black bg-[#064e3b] text-[#34d399] px-2.5 py-0.5 rounded-lg border border-[#10b981]/40">
                {lang === 'bn' ? '১৭টি স্টেশন সম্পূর্ণ' : '17 Stations'}
              </span>
            </h3>
            <p className="font-anek text-xs sm:text-sm text-[#dfcfb2]">
              {lang === 'bn' 
                ? 'উত্তরা উত্তর (দিয়াবাড়ী) থেকে মতিঝিল ও কমলাপুর পর্যন্ত সুনির্দিষ্ট জিপিএস কোঅর্ডিনেটসে এলিভেটেড লাইন ও রোড নেটওয়ার্ক' 
                : 'Accurate elevated viaduct alignment from Uttara North (Diabari) to Kamalapur with connected bus/rickshaw hubs'}
            </p>
          </div>
        </div>

        {/* View Filter Switcher */}
        <div className="flex items-center gap-1.5 bg-[#120e0b] p-1 rounded-2xl border border-[#c69429]/40 shadow-inner">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-anek font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-[#2a2019] text-[#fbf8f1] border border-[#c69429] shadow-md'
                : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
            }`}
          >
            {lang === 'bn' ? 'সকল নোড' : 'All Hubs'}
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('metro_only')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-anek font-bold transition-all ${
              filterMode === 'metro_only'
                ? 'bg-[#064e3b] text-[#34d399] border border-[#10b981] shadow-md'
                : 'text-[#dfcfb2] hover:text-[#34d399]'
            }`}
          >
            <span>🚇</span>
            <span>{lang === 'bn' ? 'মেট্রোরেল ১৭ স্টেশন' : 'MRT-6 Only'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('alerts_only')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-anek font-bold transition-all ${
              filterMode === 'alerts_only'
                ? 'bg-[#b83a2e]/40 text-[#fca5a5] border border-[#b83a2e] shadow-md'
                : 'text-[#dfcfb2] hover:text-[#fca5a5]'
            }`}
          >
            <span>⚠️</span>
            <span>{lang === 'bn' ? 'সতর্কতা' : 'Disruptions'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height: '420px', width: '100%' }}
        className="rounded-xl border border-[#c69429]/30 overflow-hidden shadow-inner relative z-0"
      />

      {/* Bottom Map Legend & Metro Pass Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#c69429]/20 text-xs font-anek text-[#dfcfb2]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#34d399] font-bold">
            <span className="w-3 h-3 rounded-full bg-[#059669] border border-[#34d399]" />
            <span>🚇 এমআরটি-৬ মেট্রোরেল (১৭টি স্টেশন)</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#f6d16f] font-bold">
            <span className="w-3 h-3 rounded-full bg-[#292019] border border-[#f6d16f]" />
            <span>🛺 রোড বাস / রিকশা নোড</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#7dd3fc] font-bold">
            <span className="w-3 h-3 rounded-full bg-[#1c4568] border border-[#7dd3fc]" />
            <span>⛵ সদরঘাট লঞ্চ পোর্ট</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#fca5a5] font-bold">
            <span className="w-3 h-3 rounded-full bg-[#b83a2e] border border-[#fca5a5]" />
            <span>💧 জলজট / ব্যারিকেড</span>
          </span>
        </div>

        <div className="text-[11px] font-mono text-[#a7f3d0] bg-[#064e3b]/40 px-3 py-1 rounded-lg border border-[#10b981]/30">
          ✦ ডিএমটিসিএল প্রজ্ঞাপন: সর্বনিম্ন ২০ ৳ • Rapid Pass-এ ১০% ছাড় • ১০০ মিনিট বৈধ
        </div>
      </div>
    </div>
  );
}
