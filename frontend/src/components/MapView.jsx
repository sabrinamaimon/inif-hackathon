'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  STATIC_HUBS, 
  MRT6_ALIGNMENT, 
  MRT6_STATIONS_DATA,
  MRT6_DENSE_POLYLINE
} from '../data/staticData';
import { Compass, Train, AlertTriangle, Layers } from 'lucide-react';

export default function MapView({ 
  hubs = STATIC_HUBS, 
  activeAlerts = [], 
  activeRoute = null, 
  userLocation = null,
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
  const userLocationMarkerRef = useRef(null);
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
        if (mapContainerRef.current._leaflet_id) {
          delete mapContainerRef.current._leaflet_id;
        }
        // Center tightly around Dhaka City transit core: Lat 23.7900, Lng 90.3950, Zoom: 12.6
        const map = L.map(mapContainerRef.current, {
          center: [23.7900, 90.3950],
          zoom: 12.6,
          zoomSnap: 0.1,
          minZoom: 11.5,
          maxBounds: [
            [23.6300, 90.2500],
            [23.9500, 90.5500]
          ],
          maxBoundsViscosity: 0.8,
          zoomControl: true,
          attributionControl: false
        });

        // OpenStreetMap Standard Free Tiles (100% Free, Clean & Natural map)
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

      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }

      // =========================================================================
      // 1. MRT-6 METRO RAIL ELEVATED TRACK (Clean subtle emerald green line)
      // =========================================================================
      const metroPoints = (MRT6_DENSE_POLYLINE && MRT6_DENSE_POLYLINE.length > 0) 
        ? MRT6_DENSE_POLYLINE 
        : MRT6_ALIGNMENT;

      if (filterMode === 'all' || filterMode === 'metro_only') {
        const metroTrack = L.polyline(metroPoints, {
          color: '#059669',
          weight: 4,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        const trackTooltip = lang === 'bn' 
          ? `<strong>এমআরটি-৬ মেট্রোরেল উড়ালপথ</strong><br/><span style="font-size: 11px;">উত্তরা উত্তর (দিয়াবাড়ী) ⇄ মতিঝিল ⇄ কমলাপুর</span>`
          : `<strong>MRT-6 Metro Rail Elevated Line</strong><br/><span style="font-size: 11px;">Uttara North (Diabari) ⇄ Motijheel ⇄ Kamalapur</span>`;
        metroTrack.bindTooltip(trackTooltip, { sticky: true, className: 'font-anek' });

        metroTrackLayersRef.current.push(metroTrack);
      }

      // =========================================================================
      // 2. PLOT CLEAN PLACE NAME PINS (NO vehicle emojis, NO order codes)
      // =========================================================================
      Object.entries(hubs).forEach(([name, data]) => {
        const isMetro = Boolean(
          data.is_metro_station || 
          data.type === 'metro' || 
          data.metro_code || 
          MRT6_STATIONS_DATA.some(s => s.name === name || s.name_bn === data.name_bn)
        );
        const isWaterlogged = activeAlerts.some(a => a.hub === name && a.type === 'waterlogging' && a.is_active);
        const isBlockaded = activeAlerts.some(a => a.hub === name && a.type === 'blockade' && a.is_active);

        // Filter check
        if (filterMode === 'metro_only' && !isMetro) return;
        if (filterMode === 'alerts_only' && !isWaterlogged && !isBlockaded) return;

        const placeName = lang === 'bn' ? (data.name_bn || data.name || name) : (data.name || name);
        const stationOrder = data.station_order || (MRT6_STATIONS_DATA.find(s => s.name === name || s.name_bn === data.name_bn)?.order) || 1;
        const isEven = stationOrder % 2 === 0;

        // Visual properties
        const dotColor = isWaterlogged ? '#ef4444' : isBlockaded ? '#f59e0b' : (isMetro ? '#10b981' : '#f59e0b');
        const textColor = isWaterlogged ? '#fca5a5' : isBlockaded ? '#fde047' : (isMetro ? '#34d399' : '#fef08a');
        const borderColor = isWaterlogged ? 'rgba(239, 68, 68, 0.6)' : (isMetro ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.4)');

        // Alternating label side for metro stations along the north-south viaduct to eliminate label overlap
        let labelPositionStyle = '';
        if (isMetro) {
          if (isEven) {
            labelPositionStyle = 'top: -14px; left: 16px;';
          } else {
            labelPositionStyle = 'top: -14px; right: 16px; text-align: right;';
          }
        } else {
          labelPositionStyle = 'top: -11px; left: 10px;';
        }

        const customIcon = L.divIcon({
          className: 'dhaka-clean-place-marker',
          html: `
            <div style="position: relative; width: 0; height: 0; cursor: pointer; user-select: none;">
              ${isMetro ? `
                <!-- Distinctive Metro [M] Sign Badge centered at (0,0) -->
                <div style="
                  position: absolute;
                  top: -11px;
                  left: -11px;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #059669 0%, #047857 100%);
                  border: 2px solid #ffffff;
                  box-shadow: 0 0 10px rgba(5, 150, 105, 0.9), 0 2px 6px rgba(0,0,0,0.65);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: -apple-system, BlinkMacSystemFont, 'Space Grotesk', 'Segoe UI', Roboto, sans-serif;
                  font-size: 12px;
                  font-weight: 900;
                  color: #ffffff;
                  line-height: 1;
                  z-index: 25;
                  letter-spacing: -0.5px;
                ">
                  M
                </div>
              ` : `
                <!-- Standard Pin Dot centered at (0,0) for non-metro hubs -->
                <div style="
                  position: absolute;
                  top: -4px;
                  left: -4px;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background: ${dotColor};
                  border: 1.5px solid #ffffff;
                  box-shadow: 0 0 5px rgba(0,0,0,0.7);
                  z-index: 10;
                "></div>
              `}

              <!-- Clean Place Name Tag with M Badge for Metro -->
              <div style="
                position: absolute;
                ${labelPositionStyle}
                background: rgba(18, 14, 11, 0.94);
                color: ${textColor};
                font-family: 'Anek Bangla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 11px;
                font-weight: 700;
                padding: 2.5px 8px;
                border-radius: 6px;
                border: 1px solid ${borderColor};
                box-shadow: 0 2px 6px rgba(0,0,0,0.55);
                white-space: nowrap;
                letter-spacing: 0.2px;
                z-index: 20;
                pointer-events: auto;
                display: inline-flex;
                align-items: center;
                gap: 5px;
              ">
                ${isMetro ? `
                  <span style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 14px;
                    height: 14px;
                    border-radius: 3px;
                    background: #059669;
                    color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-weight: 900;
                    font-size: 9px;
                    line-height: 1;
                    flex-shrink: 0;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.4);
                  ">M</span>
                ` : ''}
                <span>${placeName}</span>
              </div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          if (onSelectHub) onSelectHub(name);
        });

        const statusText = isWaterlogged 
          ? (lang === 'bn' ? '⚠️ জলজট সতর্কতা: নিচু রাস্তায় যান চলাচল ব্যাহত' : '⚠️ Waterlogging: Surface transport stalled')
          : isBlockaded 
          ? (lang === 'bn' ? '🚫 ব্যারিকেড সতর্কতা: বিকল্প সড়ক বা মেট্রোরেল ব্যবহার করুন' : '🚫 Blockade: Use Metro or detour')
          : isMetro 
          ? (lang === 'bn' ? 'এমআরটি-৬ মেট্রোরেল স্টেশন • প্রতি ৬ মিনিটে ট্রেন' : 'MRT-6 Metro Station • AC Train every 6 mins')
          : (lang === 'bn' ? 'সচল ট্রানজিট স্থান' : 'Active Transit Location');

        marker.bindPopup(`
          <div style="min-width: 210px; font-family: 'Anek Bangla', sans-serif;" class="p-1 text-slate-900">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <span style="font-weight: 900; font-size: 15px; color: ${isMetro ? '#065f46' : '#b83a2e'}; display: inline-flex; align-items: center; gap: 6px;">
                ${isMetro ? `
                  <span style="
                    background: #059669;
                    color: #ffffff;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 900;
                    font-family: sans-serif;
                    flex-shrink: 0;
                  ">M</span>
                ` : ''}
                <span>${placeName}</span>
              </span>
            </div>

            <div style="font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 6px;">
              ${data.zone || (lang === 'bn' ? 'ঢাকা মেট্রোপলিটন এরিয়া' : 'Dhaka Metropolitan Area')}
            </div>

            <div style="font-size: 11px; font-weight: 800; color: ${isMetro ? '#065f46' : '#1e293b'}; background: ${isMetro ? '#ecfdf5' : '#f1f5f9'}; padding: 6px; border-radius: 8px; border: 1px solid ${isMetro ? '#a7f3d0' : '#cbd5e1'}; margin-bottom: 8px;">
              ${statusText}
            </div>

            ${isMetro ? `
              <div style="font-size: 11px; color: #047857; margin-bottom: 8px; line-height: 1.4;">
                ${lang === 'bn' 
                  ? '✦ <strong>ভাড়া:</strong> সর্বনিম্ন ২০ ৳ • র‍্যাপিড পাস বা এমআরটি পাসে ১০% ছাড় (১৮ ৳)<br/>✦ ১০০ মিনিট পেইড এরিয়ায় টিকিট কার্যকর'
                  : '✦ <strong>Fare:</strong> Min 20 BDT • 10% discount on Rapid Pass or MRT Pass (18 BDT)<br/>✦ Valid for 100 mins in paid area'}
              </div>
            ` : ''}

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

      // View Framing
      if (filterMode === 'metro_only' && metroPoints.length > 0) {
        map.fitBounds(L.polyline(metroPoints).getBounds(), { padding: [40, 40] });
      } else if (filterMode === 'all' && (!activeRoute || !activeRoute.legs || activeRoute.legs.length === 0)) {
        map.setView([23.7900, 90.3950], 12.6);
      }

      // =========================================================================
      // 3. DRAW ACTIVE SEARCHED ROUTE POLYLINE (If user executed route plan)
      // =========================================================================
      if (activeRoute && activeRoute.legs && activeRoute.legs.length > 0) {
        const fullRouteLatLngs = [];

        activeRoute.legs.forEach(leg => {
          const fromName = leg.from_hub;
          const toName = leg.to_hub;
          const isMetroLeg = leg.mode === 'metro';

          if (isMetroLeg) {
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
              if (hubs[fromName]) fullRouteLatLngs.push([hubs[fromName].lat, hubs[fromName].lng]);
              if (hubs[toName]) fullRouteLatLngs.push([hubs[toName].lat, hubs[toName].lng]);
            }
          } else {
            if (hubs[fromName]) fullRouteLatLngs.push([hubs[fromName].lat, hubs[fromName].lng]);
            if (hubs[toName]) fullRouteLatLngs.push([hubs[toName].lat, hubs[toName].lng]);
          }
        });

        if (fullRouteLatLngs.length >= 2) {
          activeRoutePolylineRef.current = L.polyline(fullRouteLatLngs, {
            color: '#10b981',
            weight: 5,
            opacity: 0.95
          }).addTo(map);

          map.fitBounds(activeRoutePolylineRef.current.getBounds(), { padding: [60, 60] });
        }
      }

      // =========================================================================
      // 4. USER CURRENT GPS LOCATION PIN
      // =========================================================================
      if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
        const userPinIcon = L.divIcon({
          className: 'user-gps-location-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 12px #38bdf8; display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
                <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              </div>
              <div style="background: #082f49; color: #7dd3fc; font-family: 'Anek Bangla', sans-serif; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 6px; margin-top: 3px; white-space: nowrap; border: 1.5px solid #38bdf8; box-shadow: 0 3px 8px rgba(0,0,0,0.6);">
                ${lang === 'bn' ? '📍 আপনার অবস্থান' : '📍 You are here'}
              </div>
            </div>
          `,
          iconSize: [110, 50],
          iconAnchor: [55, 14]
        });

        const userMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: userPinIcon,
          zIndexOffset: 1200
        }).addTo(map);

        userMarker.bindTooltip(
          lang === 'bn' 
            ? `📍 <strong>আপনার বর্তমান অবস্থান</strong><br/><span style="font-size: 11px; color: #6ee7b7;">নিকটস্থ হাব: ${userLocation.hubNameBn || userLocation.hubName || ''}</span>`
            : `📍 <strong>Your Current Location</strong><br/><span style="font-size: 11px; color: #6ee7b7;">Nearest Hub: ${userLocation.hubName || ''}</span>`,
          { sticky: true }
        );

        userLocationMarkerRef.current = userMarker;
      }

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    });

    return () => {
      isMounted = false;
    };
  }, [isClient, hubs, activeAlerts, activeRoute, filterMode, lang, userLocation]);

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
              <span>{lang === 'bn' ? 'ঢাকা সিটি ট্রানজিট ম্যাপ' : 'Dhaka City Transit Map'}</span>
            </h3>
            <p className="font-anek text-xs sm:text-sm text-[#dfcfb2]">
              {lang === 'bn' 
                ? 'মেট্রোরেল ও প্রধান ট্রানজিট স্থানসমূহ • স্থানে ক্লিক করে সরাসরি রুট প্ল্যান করুন' 
                : 'Metro rail & major transit locations • Click any place to plan your route'}
            </p>
          </div>
        </div>

        {/* View Filter Switcher (Clean & Minimal) */}
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
            {lang === 'bn' ? 'সকল স্থান' : 'All Places'}
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('metro_only')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-anek font-bold transition-all cursor-pointer ${
              filterMode === 'metro_only'
                ? 'bg-[#064e3b] text-[#34d399] border border-[#10b981] shadow-md'
                : 'text-[#dfcfb2] hover:text-[#34d399]'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded bg-[#059669] text-white flex items-center justify-center text-[9px] font-black leading-none shrink-0">M</span>
            <span>{lang === 'bn' ? 'মেট্রোরেল' : 'Metro Rail'}</span>
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
            <span>{lang === 'bn' ? 'সতর্কতা' : 'Disruptions'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height: 'min(82vh, 740px)', minHeight: '580px', width: '100%' }}
        className="rounded-xl border-2 border-[#c69429]/40 overflow-hidden shadow-2xl relative z-0 w-full"
      />
    </div>
  );
}
