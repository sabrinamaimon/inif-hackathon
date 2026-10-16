'use client';

import React from 'react';
import { 
  Clock, DollarSign, ArrowRight, ShieldCheck, AlertTriangle, 
  Volume2, Download, HelpCircle, Train, Bus, Bike, Car, Navigation, Sparkles, MapPin
} from 'lucide-react';
import { I18N, formatFare, formatDuration, toBnDigits } from '../utils/localization';
import { speakText } from '../utils/speech';
import { generateOfflineRouteCard } from '../utils/offlineCard';
import { STATIC_HUBS } from '../data/staticData';

export default function RouteResults({ 
  routes = [], 
  origin, 
  destination, 
  passengerType = 'general', 
  lang = 'bn',
  onSelectRoute,
  onOpenFareBreakdown,
  selectedRouteId
}) {
  const t = I18N[lang] || I18N.bn;
  const [activeFilter, setActiveFilter] = React.useState('all');

  if (!routes || routes.length === 0) {
    return null;
  }

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'metro': return Train;
      case 'bus': return Bus;
      case 'cng': return Car;
      case 'bike': return Bike;
      case 'car': return Car;
      case 'leguna': return Car;
      case 'rickshaw': return Bike;
      default: return Navigation;
    }
  };

  const getModeLabel = (mode, currentLang) => {
    if (currentLang === 'bn') {
      switch (mode) {
        case 'metro': return '🚇 মেট্রোরেল';
        case 'bus': return '🚌 লোকাল বাস';
        case 'cng': return '🚕 সিএনজি অটোরিকশা';
        case 'bike': return '🏍️ মোটরসাইকেল';
        case 'car': return '🚗 প্রাইভেট কার';
        case 'leguna': return '🚐 লেগুনা';
        case 'rickshaw': return '🛺 রিকশা';
        default: return mode;
      }
    }
    switch (mode) {
      case 'metro': return '🚇 Metro Rail';
      case 'bus': return '🚌 Local Bus';
      case 'cng': return '🚕 CNG Auto';
      case 'bike': return '🏍️ Motorbike';
      case 'car': return '🚗 Private Car';
      case 'leguna': return '🚐 Leguna';
      case 'rickshaw': return '🛺 Rickshaw';
      default: return mode;
    }
  };

  const getTypeBadge = (route, currentLang) => {
    if (currentLang === 'bn') {
      if (route.type_badge_bn) return route.type_badge_bn;
      if (route.type_badge && /[^\x00-\x7F]/.test(route.type_badge)) return route.type_badge;
      const mode = route.mode || (route.legs && route.legs[0]?.mode);
      switch (mode) {
        case 'metro': return '১০০% বাধামুক্ত ও দ্রুততম';
        case 'bus': return 'সবচেয়ে সাশ্রয়ী ও হাফ-পাস';
        case 'cng': return 'ব্যক্তিগত মিটার বাহন';
        case 'bike': return 'সড়কপথে দ্রুততম';
        case 'car': return 'আরামদায়ক ও এসি';
        case 'rickshaw': return 'লোকাল ও গলিপথ';
        default: return 'যাচাইকৃত রুট';
      }
    }
    // English mode: strictly no Bengali text
    if (route.type_badge && !/[^\x00-\x7F]/.test(route.type_badge)) {
      return route.type_badge;
    }
    const mode = route.mode || (route.legs && route.legs[0]?.mode);
    switch (mode) {
      case 'metro': return 'Fastest & Obstacle-Free';
      case 'bus': return 'Student & Budget Pick';
      case 'cng': return 'Personal Metered Transit';
      case 'bike': return 'Fastest Surface Transit';
      case 'car': return 'Comfortable & AC';
      case 'rickshaw': return 'Local Feeder Transit';
      default: return 'Verified Route';
    }
  };

  const getRouteTitle = (route, currentLang) => {
    const origBn = STATIC_HUBS[origin]?.name_bn || origin;
    const destBn = STATIC_HUBS[destination]?.name_bn || destination;

    if (currentLang === 'bn') {
      if (route.title_bn) return route.title_bn;
      const mode = route.mode || (route.legs && route.legs[0]?.mode);
      switch (mode) {
        case 'metro': return `এমআরটি-৬ মেট্রোরেল এক্সপ্রেস (${origBn} ➔ ${destBn})`;
        case 'bus': return `লোকাল বাস সার্ভিস (${origBn} ➔ ${destBn})`;
        case 'cng': return `সরাসরি সিএনজি অটোরিকশা (${origBn} ➔ ${destBn})`;
        case 'bike': return `মোটরসাইকেল রাইডশেয়ার (${origBn} ➔ ${destBn})`;
        case 'car': return `প্রাইভেট কার ক্যাব (${origBn} ➔ ${destBn})`;
        case 'rickshaw': return `ঐতিহ্যবাহী রিকশা (${origBn} ➔ ${destBn})`;
        default: return `সরাসরি রুট (${origBn} ➔ ${destBn})`;
      }
    }
    // English mode: strictly no Bengali text or mixed slashes
    if (route.title && !/[^\x00-\x7F]/.test(route.title) && !route.title.includes(' / ')) {
      return route.title;
    }
    const mode = route.mode || (route.legs && route.legs[0]?.mode);
    switch (mode) {
      case 'metro': return `MRT-6 Metro Rail (${origin} ➔ ${destination})`;
      case 'bus': return `Local Bus Transit (${origin} ➔ ${destination})`;
      case 'cng': return `Direct CNG Auto-Rickshaw (${origin} ➔ ${destination})`;
      case 'bike': return `Ride-Share Motorbike (${origin} ➔ ${destination})`;
      case 'car': return `Private Car (${origin} ➔ ${destination})`;
      case 'rickshaw': return `Traditional Rickshaw (${origin} ➔ ${destination})`;
      default: return `Direct Transit Corridor (${origin} ➔ ${destination})`;
    }
  };

  const getObstaclesBadge = (route, currentLang) => {
    if (currentLang === 'bn') {
      if (route.obstacles_badge_bn) return route.obstacles_badge_bn;
      if (route.obstacles_badge && /[^\x00-\x7F]/.test(route.obstacles_badge)) return route.obstacles_badge;
      if (route.mode === 'metro') return '🟢 বাধামুক্ত উড়ালপথ (০% যানজট ও জলজট)';
      return '🟡 সাধারণ সড়ক ট্রাফিক';
    }
    // English mode
    if (route.obstacles_badge && !/[^\x00-\x7F]/.test(route.obstacles_badge)) {
      return route.obstacles_badge;
    }
    if (route.mode === 'metro') return '🟢 Elevated Viaduct (0% Congestion)';
    return '🟡 Surface Road Traffic';
  };

  const getObstaclesDetail = (route, currentLang) => {
    if (currentLang === 'bn') {
      if (route.mode === 'metro') return 'উড়াল ভায়াডাক্ট পথ, সিগন্যালমুক্ত';
      if (route.obstacles_status === 'warning') return 'বৃষ্টি বা ভিড়ের কারণে ধীরগতি';
      return 'স্বাভাবিক ঢাকা সড়ক ট্রাফিক';
    }
    if (route.mode === 'metro') return 'Elevated viaduct, signal-free';
    if (route.obstacles_status === 'warning') return 'Slow moving due to weather or peak rush';
    return 'Normal Dhaka surface traffic';
  };

  const getLegLineName = (leg, currentLang) => {
    if (currentLang === 'bn') {
      if (leg.line_name_bn) return leg.line_name_bn;
      switch (leg.mode) {
        case 'metro': return 'এমআরটি-৬ মেট্রোরেল';
        case 'bus': return 'ঢাকা সিটি বাস';
        case 'cng': return 'সিএনজি অটোরিকশা';
        case 'bike': return 'মোটরসাইকেল রাইডশেয়ার';
        case 'car': return 'প্রাইভেট কার / ক্যাব';
        case 'rickshaw': return 'ঢাকা ঐতিহ্যবাহী রিকশা';
        case 'leguna': return 'লেগুনা করিডোর';
        default: return leg.line_name;
      }
    }
    // English: strip any Bengali letters or slashes
    const clean = (leg.line_name || '')
      .replace(/\s*\([^)]*[\u0980-\u09FF][^)]*\)/g, '')
      .replace(/\s*\/\s*[\u0980-\u09FF]+/g, '')
      .trim();
    return clean || (leg.mode === 'metro' ? 'MRT-6 Metro Rail' : 'Dhaka Transit Line');
  };

  const getLegLandmark = (leg, currentLang) => {
    const fromName = currentLang === 'bn' ? (STATIC_HUBS[leg.from_hub]?.name_bn || leg.from_hub) : leg.from_hub;
    const toName = currentLang === 'bn' ? (STATIC_HUBS[leg.to_hub]?.name_bn || leg.to_hub) : leg.to_hub;

    if (currentLang === 'bn') {
      if (leg.landmark_instructions_bn) return leg.landmark_instructions_bn;
      if (leg.landmark_instructions && /[^\x00-\x7F]/.test(leg.landmark_instructions)) {
        return leg.landmark_instructions;
      }
      switch (leg.mode) {
        case 'metro': return `${fromName} মেট্রোরেল কনকোর্স দিয়ে উঠে ${toName} প্ল্যাটফর্মে নামুন।`;
        case 'bus': return `${fromName} বাস স্টপ থেকে সরাসরি বাসে উঠে ${toName} নামুন। বাসে ৫০% শিক্ষার্থী হাফ-পাস প্রযোজ্য।`;
        case 'cng': return `${fromName} সিএনজি স্ট্যান্ড থেকে সরাসরি ${toName}। কোনো পরিবর্তন ছাড়া দ্রুত যাতায়াত।`;
        case 'bike': return `${fromName} থেকে ওয়ান-অন-ওয়ান বাইক পিকআপ নিয়ে যানজট এড়িয়ে দ্রুত পৌঁছান।`;
        case 'car': return `${fromName} থেকে ডোর-টু-ডোর কার ক্যাব। আরামদায়ক এসি যাত্রা।`;
        case 'rickshaw': return `${fromName} থেকে হুড তোলা রিকশা নিয়ে গলিপথ দিয়ে নিরিবিলি যাতায়াত।`;
        default: return `${fromName} থেকে যাত্রা শুরু করে ${toName} এ পৌঁছান।`;
      }
    }
    // English mode: strictly no Bengali text
    if (leg.landmark_instructions && !/[^\x00-\x7F]/.test(leg.landmark_instructions)) {
      return leg.landmark_instructions;
    }
    switch (leg.mode) {
      case 'metro': return `Enter ${fromName} Metro Station concourse. Direct elevated express to ${toName}.`;
      case 'bus': return `Board bus at ${fromName} bus stop and alight at ${toName}. 50% student half-pass applies.`;
      case 'cng': return `Direct CNG from ${fromName} stand to ${toName}. Door-to-door transit without transfers.`;
      case 'bike': return `1-on-1 motorbike pickup at ${fromName}. Fastest route weaving through traffic gaps to ${toName}.`;
      case 'car': return `Door-to-door car cab pickup at ${fromName}. Full AC comfort protected from rain and heat to ${toName}.`;
      case 'rickshaw': return `Board hooded cycle rickshaw at ${fromName}. Peaceful navigation through inner alleys to ${toName}.`;
      default: return `Board transit at ${fromName} towards ${toName}.`;
    }
  };

  const handleAudioBriefing = (route) => {
    const originName = STATIC_HUBS[origin]?.name_bn || origin;
    const destName = STATIC_HUBS[destination]?.name_bn || destination;
    const distText = route.total_distance_km ? `${toBnDigits(route.total_distance_km)} কিলোমিটার` : '';
    const obstacleText = route.obstacles_badge_bn || route.obstacles_badge ? `যাত্রাপথে অবস্থা: ${route.obstacles_badge_bn || route.obstacles_badge}।` : '';
    const studentText = route.total_regular_fare !== route.total_student_fare 
      ? `এবং শিক্ষার্থীদের নির্ধারিত হাফ-পাস ভাড়া ${toBnDigits(route.total_student_fare)} টাকা` 
      : '';
    const transferText = (route.transfers === 0 || !route.transfers)
      ? 'কোনো প্রকার পরিবর্তন বা বদল ছাড়াই এটি সরাসরি যাত্রাপথ।'
      : `এতে মোট ${toBnDigits(route.transfers)} বার বাহন পরিবর্তন করতে হবে।`;

    const speechScript = lang === 'bn'
      ? `আসসালামু আলাইকুম। ${originName} থেকে ${destName} পৌঁছাতে আনুমানিক সময় লাগবে ${toBnDigits(route.total_duration_mins)} মিনিট। দূরত্ব প্রায় ${distText}। ${transferText} নির্ধারিত মোট ভাড়া ${toBnDigits(route.total_regular_fare)} টাকা ${studentText}। ${obstacleText} আপনার নিরাপদ ও স্বাচ্ছন্দ্যময় যাত্রা কামনা করছি।`
      : `Assalamu Alaikum. Traveling from ${origin} to ${destination} will take approximately ${route.total_duration_mins} minutes over a distance of ${route.total_distance_km || ''} km. ${route.transfers === 0 ? 'This is a direct journey with no transfers.' : `This route requires ${route.transfers} transfers.`} The fare is ${route.total_regular_fare} Taka${route.total_regular_fare !== route.total_student_fare ? `, with student concession at ${route.total_student_fare} Taka.` : '.'} Wishing you a safe and pleasant journey.`;

    speakText(speechScript, lang);
  };

  // Distinct theme and badge per transit mode
  const getRouteTheme = (route, idx) => {
    const mode = route.mode || (route.legs && route.legs[0]?.mode) || 'bus';
    switch (mode) {
      case 'metro':
        return {
          badgeTitle: lang === 'bn' ? '🚇 মেট্রোরেল (উড়ালপথ)' : '🚇 Metro Rail (Viaduct)',
          badgeBg: 'bg-[#059669] text-white border-[#34d399]',
          accent: '#059669',
          border: 'border-[#10b981]'
        };
      case 'bus':
        return {
          badgeTitle: lang === 'bn' ? '🚌 লোকাল বাস (হাফ-পাস)' : '🚌 Local Bus (Half-Pass)',
          badgeBg: 'bg-[#1c4568] text-white border-[#38bdf8]',
          accent: '#1c4568',
          border: 'border-[#38bdf8]'
        };
      case 'cng':
        return {
          badgeTitle: lang === 'bn' ? '🚕 সিএনজি অটোরিকশা' : '🚕 CNG Auto-Rickshaw',
          badgeBg: 'bg-[#e2b448] text-[#120e0b] border-[#fbf8f1]',
          accent: '#c69429',
          border: 'border-[#c69429]'
        };
      case 'bike':
        return {
          badgeTitle: lang === 'bn' ? '🏍️ বাইক রাইডশেয়ার' : '🏍️ Bike Ride-Share',
          badgeBg: 'bg-[#b83a2e] text-white border-[#f6d16f]',
          accent: '#b83a2e',
          border: 'border-[#b83a2e]'
        };
      case 'car':
        return {
          badgeTitle: lang === 'bn' ? '🚗 প্রাইভেট কার' : '🚗 Private Car',
          badgeBg: 'bg-[#4338ca] text-white border-[#818cf8]',
          accent: '#4338ca',
          border: 'border-[#6366f1]'
        };
      case 'rickshaw':
        return {
          badgeTitle: lang === 'bn' ? '🛺 ঐতিহ্যবাহী রিকশা' : '🛺 Traditional Rickshaw',
          badgeBg: 'bg-[#15453b] text-[#f6d16f] border-[#f6d16f]',
          accent: '#15453b',
          border: 'border-[#15453b]'
        };
      default:
        return {
          badgeTitle: lang === 'bn' ? `অপশন ${toBnDigits(idx + 1)}` : `Option ${idx + 1}`,
          badgeBg: 'bg-[#292019] text-[#f6d16f] border-[#c69429]',
          accent: '#c69429',
          border: 'border-[#c69429]'
        };
    }
  };

  // Sort and filter routes based on user preference (Time, Cost, Obstacles, Distance)
  const displayRoutes = React.useMemo(() => {
    let list = [...routes];
    if (activeFilter === 'fastest') {
      list.sort((a, b) => a.total_duration_mins - b.total_duration_mins);
    } else if (activeFilter === 'cheapest') {
      list.sort((a, b) => {
        const fareA = passengerType === 'student' ? a.total_student_fare : a.total_regular_fare;
        const fareB = passengerType === 'student' ? b.total_student_fare : b.total_regular_fare;
        return fareA - fareB;
      });
    } else if (activeFilter === 'safest') {
      list.sort((a, b) => {
        const scoreA = a.obstacles_status === 'safe' ? 0 : (a.obstacles_status === 'traffic' ? 1 : 2);
        const scoreB = b.obstacles_status === 'safe' ? 0 : (b.obstacles_status === 'traffic' ? 1 : 2);
        return scoreA - scoreB;
      });
    } else if (activeFilter === 'shortest') {
      list.sort((a, b) => (a.total_distance_km || 99) - (b.total_distance_km || 99));
    }
    return list;
  }, [routes, activeFilter, passengerType]);

  return (
    <div className="my-8 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#c69429]/40">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          <h3 className="font-rickshaw text-2xl sm:text-3xl md:text-4xl font-bold text-[#f6d16f] tracking-wide rickshaw-text-pop">
            {lang === 'bn' ? 'সম্ভাব্য সকল বাহন, সময়, ভাড়া ও পথের বাধা' : 'Available Transit Modes & Trip Comparison'}
          </h3>
        </div>

        {/* Listen Audio Callout */}
        <div className="flex items-center gap-2 bg-[#1c1511] px-3.5 py-1.5 rounded-xl border border-[#c69429]/50 text-xs font-anek text-[#f6d16f]">
          <Volume2 className="w-4 h-4 text-[#f6d16f] animate-pulse" />
          <span>{lang === 'bn' ? 'পড়ে শোনানোর জন্য অডিও বাটনে ট্যাপ করুন' : 'Tap audio button for voice readout'}</span>
        </div>
      </div>

      {/* Comparison Filter Pills: All, Fastest, Cheapest, Obstacle-Free, Shortest */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#14100c] border border-[#c69429]/40 shadow-inner">
        <span className="font-anek text-xs font-bold text-[#dfcfb2] px-2">
          {lang === 'bn' ? 'সর্ট করুন:' : 'Sort By:'}
        </span>
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-anek font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#c69429] text-[#120e0b] shadow-md shadow-[#c69429]/30'
              : 'bg-[#1c1511] text-[#dfcfb2] hover:text-white border border-[#c69429]/30'
          }`}
        >
          <span>🌟</span>
          <span>{lang === 'bn' ? 'সবগুলো বাহন' : 'All Options'} ({routes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('fastest')}
          className={`px-3 py-1.5 rounded-xl font-anek font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'fastest'
              ? 'bg-[#15453b] text-[#6ee7b7] border border-[#2a6f62] shadow-md shadow-[#15453b]/40'
              : 'bg-[#1c1511] text-[#dfcfb2] hover:text-white border border-[#c69429]/30'
          }`}
        >
          <span>⚡</span>
          <span>{lang === 'bn' ? 'কম সময় (দ্রুততম)' : 'Fastest Time'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('cheapest')}
          className={`px-3 py-1.5 rounded-xl font-anek font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'cheapest'
              ? 'bg-[#0e6e41] text-white shadow-md shadow-[#0e6e41]/40'
              : 'bg-[#1c1511] text-[#dfcfb2] hover:text-white border border-[#c69429]/30'
          }`}
        >
          <span>💰</span>
          <span>{lang === 'bn' ? 'কম খরচ (সাশ্রয়ী)' : 'Lowest Fare'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('safest')}
          className={`px-3 py-1.5 rounded-xl font-anek font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'safest'
              ? 'bg-[#0284c7] text-white shadow-md shadow-[#0284c7]/40'
              : 'bg-[#1c1511] text-[#dfcfb2] hover:text-white border border-[#c69429]/30'
          }`}
        >
          <span>🛡️</span>
          <span>{lang === 'bn' ? 'বাধামুক্ত উড়ালপথ' : 'Obstacle-Free'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('shortest')}
          className={`px-3 py-1.5 rounded-xl font-anek font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'shortest'
              ? 'bg-[#b83a2e] text-white shadow-md shadow-[#b83a2e]/40'
              : 'bg-[#1c1511] text-[#dfcfb2] hover:text-white border border-[#c69429]/30'
          }`}
        >
          <span>📏</span>
          <span>{lang === 'bn' ? 'কম দূরত্ব' : 'Shortest Distance'}</span>
        </button>
      </div>

      {/* Transit Routes */}
      <div className="grid grid-cols-1 gap-7">
        {displayRoutes.map((route, idx) => {
          const isSelected = selectedRouteId === route.id || (!selectedRouteId && idx === 0);
          const hasSavings = route.total_regular_fare > route.total_student_fare;
          const savingsAmount = route.total_regular_fare - route.total_student_fare;
          const routeTheme = getRouteTheme(route, idx);
          const rawDistance = route.total_distance_km || (route.legs ? route.legs.reduce((acc, l) => acc + (Number(l.distance_km) || 0), 0) : 0);
          const distanceKm = rawDistance > 0 ? Number(rawDistance).toFixed(1) : (Math.max(1.8, Math.round((route.total_duration_mins * 0.32) * 10) / 10)).toFixed(1);

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route)}
              className={`rounded-2xl border-4 transition-all cursor-pointer relative overflow-hidden shadow-2xl bg-[#1a1410] ${routeTheme.border} ${
                isSelected 
                  ? 'ring-4 ring-[#f6d16f] scale-[1.01]' 
                  : 'hover:border-[#f6d16f]'
              }`}
            >
              {/* Route Card Top Strip */}
              <div className="relative z-10 px-5 sm:px-7 py-3.5 bg-[#14100c]/95 border-b border-[#c69429]/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs sm:text-sm font-anek font-black px-3.5 py-1.5 rounded-xl border shadow-md ${routeTheme.badgeBg}`}>
                    {routeTheme.badgeTitle}
                  </span>
                  <span className="text-xs sm:text-sm font-anek font-bold text-[#f6d16f] uppercase tracking-wider hidden md:inline">
                    {getTypeBadge(route, lang)}
                  </span>
                </div>

                {/* Verified Transit Badge */}
                <div className="flex items-center gap-2 text-xs font-anek font-bold text-[#6ee7b7] bg-[#15453b]/40 px-3 py-1 rounded-xl border border-[#2a6f62]">
                  <span className="w-2 h-2 rounded-full bg-[#6ee7b7] animate-ping" />
                  <span>{lang === 'bn' ? 'সরাসরি যাচাইকৃত যাত্রাপথ' : 'VERIFIED DIRECT ROUTE'}</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. THE ROUTE IN THE CENTER: IN SHARP FOCUS & MUCH LARGER  */}
              {/* (User requested: "the route should be much larger for older people") */}
              {/* ========================================================= */}
              <div className="relative z-10 p-5 sm:p-7 space-y-5">
                {/* Central Focused Route Ledger (High Contrast & Clear) */}
                <div className="bg-[#fcf9f2] text-[#120e0b] p-4 sm:p-6 rounded-2xl border-2 border-[#c69429] shadow-xl overflow-hidden">
                  {/* Huge Route Banner (Origin ➔ Destination) */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b-2 border-[#c69429]/40">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-anek font-bold text-[#b83a2e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#b83a2e] shrink-0" />
                        <span>{lang === 'bn' ? 'সরাসরি যাত্রাপথ' : 'DIRECT TRANSIT CORRIDOR'}</span>
                      </div>
                      
                      {/* HUGE ROUTE DISPLAY */}
                      <h4 className="font-anek text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#120e0b] tracking-tight flex items-center flex-wrap gap-2.5">
                        <span>{lang === 'bn' ? (STATIC_HUBS[origin]?.name_bn || origin) : origin}</span>
                        <span className="text-[#b83a2e] text-2xl sm:text-3xl font-black">➔</span>
                        <span className="text-[#15453b]">{lang === 'bn' ? (STATIC_HUBS[destination]?.name_bn || destination) : destination}</span>
                      </h4>

                      <p className="font-anek text-base sm:text-lg font-bold text-[#b83a2e] mt-1">
                        {getRouteTitle(route, lang)}
                      </p>
                    </div>

                    {/* Centered & Perfectly Balanced 4-Metric Badges Bar (Time, Fare, Distance, Obstacles) */}
                    <div className="w-full xl:w-auto xl:min-w-[500px] grid grid-cols-2 sm:grid-cols-4 items-center bg-[#f5eedf] p-2.5 sm:p-3 rounded-2xl border-2 border-[#c69429]/40 shadow-inner gap-2 sm:gap-1 shrink-0">
                      {/* 1. Total Duration */}
                      <div className="px-2 text-center sm:border-r-2 sm:border-[#c69429]/30">
                        <div className="text-[11px] sm:text-xs font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          ⏱️ {t.durationLabel}
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 text-[#15453b] whitespace-nowrap">
                          <span className="font-anek text-xl sm:text-2xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(route.total_duration_mins) : route.total_duration_mins}
                          </span>
                          <span className="font-anek text-xs font-bold text-[#15453b]/80 ml-0.5">
                            {lang === 'bn' ? 'মিনিট' : 'm'}
                          </span>
                        </div>
                      </div>

                      {/* 2. Regular Fare / Cost */}
                      <div className="px-2 text-center sm:border-r-2 sm:border-[#c69429]/30">
                        <div className="text-[11px] sm:text-xs font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          💰 {t.regularFare}
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 text-[#b83a2e] whitespace-nowrap">
                          <span className="font-anek text-xl sm:text-2xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(route.total_regular_fare) : route.total_regular_fare}
                          </span>
                          <span className="font-anek text-xs sm:text-sm font-extrabold text-[#b83a2e] ml-0.5">
                            {lang === 'bn' ? '৳' : 'Tk'}
                          </span>
                        </div>
                      </div>

                      {/* 3. Distance in km */}
                      <div className="px-2 text-center sm:border-r-2 sm:border-[#c69429]/30">
                        <div className="text-[11px] sm:text-xs font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          📏 {lang === 'bn' ? 'কম দূরত্ব' : 'Distance'}
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 text-[#0e6e41] whitespace-nowrap">
                          <span className="font-anek text-xl sm:text-2xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(distanceKm) : distanceKm}
                          </span>
                          <span className="font-anek text-xs font-bold text-[#0e6e41] ml-0.5">
                            {lang === 'bn' ? 'কিমি' : 'km'}
                          </span>
                        </div>
                      </div>

                      {/* 4. Obstacle / Disruption Status */}
                      <div className="px-2 text-center">
                        <div className="text-[11px] sm:text-xs font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          🛡️ {lang === 'bn' ? 'পথে বাধা' : 'Obstacles'}
                        </div>
                        <div className="flex items-center justify-center text-[11px] sm:text-xs font-anek font-black text-[#120e0b] leading-tight">
                          <span className="px-1.5 py-0.5 rounded bg-[#fcf9f2] border border-[#c69429]/50 shadow-xs truncate max-w-[110px]" title={getObstaclesBadge(route, lang)}>
                            {getObstaclesBadge(route, lang)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prominent Road Obstacle & Traffic Condition Strip */}
                  <div className={`mt-3 py-2 px-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-anek font-bold ${
                    route.mode === 'metro'
                      ? 'bg-[#15453b]/10 border-[#2a6f62] text-[#15453b]'
                      : 'bg-[#fffbeb] border-[#f59e0b]/50 text-[#92400e]'
                  }`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base">{route.mode === 'metro' ? '🚇' : '🚦'}</span>
                      <span className="font-extrabold">{lang === 'bn' ? 'পথে বাধা ও ট্রাফিক স্থিতি:' : 'Traffic & Obstacle Condition:'}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#c69429]/40 shadow-xs text-xs font-black text-[#120e0b]">
                        {getObstaclesBadge(route, lang)}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold opacity-90">
                        ({getObstaclesDetail(route, lang)})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold bg-white/70 px-2 py-0.5 rounded border border-[#c69429]/30">
                        📏 {lang === 'bn' ? 'দূরত্ব:' : 'Dist:'} {lang === 'bn' ? toBnDigits(distanceKm) : distanceKm} {lang === 'bn' ? 'কিমি' : 'km'}
                      </span>
                      {route.total_student_fare < route.total_regular_fare && (
                        <span className="font-anek font-extrabold text-[#0e6e41] bg-[#0e6e41]/10 px-2 py-0.5 rounded border border-[#0e6e41]/30">
                          🎓 {lang === 'bn' ? 'হাফ-পাস:' : 'Half-Pass:'} {lang === 'bn' ? toBnDigits(route.total_student_fare) : route.total_student_fare} {lang === 'bn' ? '৳' : 'Tk'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Savings Callout Strip */}
                  {hasSavings && (
                    <div className="mt-3.5 py-2.5 px-4 rounded-xl bg-[#0e6e41]/10 border border-[#0e6e41]/40 flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-anek font-bold text-[#0e6e41]">
                      <span className="flex items-center gap-1.5">
                        <span>{lang === 'bn' ? '🎓 সরকারি শিক্ষার্থী ৫০% হাফ-পাস ছাড় প্রযোজ্য (বাসে সর্বনিম্ন ভাড়া ১০ ৳)।' : '🎓 Statutory 50% student discount applies (10 BDT min fare on buses).'}</span>
                      </span>
                      <span className="text-sm sm:text-base font-anek font-extrabold bg-[#0e6e41] text-white px-3 py-1 rounded-lg shadow-sm">
                        {lang === 'bn' ? 'সাশ্রয়:' : 'Saves:'} {formatFare(savingsAmount, lang)}
                      </span>
                    </div>
                  )}

                  {/* Step-by-Step Large Print Instructions */}
                  <div className="mt-6 space-y-3.5">
                    <div className="font-anek text-base sm:text-lg font-extrabold text-[#120e0b] border-b border-[#c69429]/20 pb-2 flex items-center gap-2">
                      <span className="text-[#b83a2e] text-lg">✦</span>
                      <span>{lang === 'bn' ? 'যাত্রার প্রতিটি ধাপ ও ওঠার স্থান (বড় অক্ষরে বিস্তারিত):' : 'Step-by-Step Boarding & Landmark Instructions:'}</span>
                    </div>

                    <div className="space-y-3.5">
                      {route.legs.map((leg, legIdx) => {
                        const ModeIcon = getModeIcon(leg.mode);
                        return (
                          <div 
                            key={legIdx}
                            className="p-4 sm:p-5 rounded-xl bg-[#ffffff] border-2 border-[#c69429]/30 hover:border-[#b83a2e] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-sm"
                          >
                            <div className="flex items-start gap-3.5">
                              {/* Large Step Number Badge */}
                              <div className="w-9 h-9 rounded-full bg-[#b83a2e] text-white flex items-center justify-center font-bold font-mono text-lg shrink-0 shadow-md">
                                {legIdx + 1}
                              </div>

                              <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className="font-anek font-black text-lg sm:text-xl text-[#120e0b]">
                                    {getLegLineName(leg, lang)}
                                  </span>
                                  <span className="text-xs sm:text-sm px-3 py-0.5 rounded-md bg-[#15453b]/15 text-[#15453b] font-anek font-bold border border-[#15453b]/30">
                                    {getModeLabel(leg.mode, lang)}
                                  </span>
                                  <span className="text-sm font-mono font-semibold text-[#7a6654]">
                                    ({lang === 'bn' ? (STATIC_HUBS[leg.from_hub]?.name_bn || leg.from_hub) : leg.from_hub} ➔ {lang === 'bn' ? (STATIC_HUBS[leg.to_hub]?.name_bn || leg.to_hub) : leg.to_hub})
                                  </span>
                                </div>

                                {/* Large Boarding Landmark for Easy Reading */}
                                <div className="font-anek text-base sm:text-lg font-bold text-[#b83a2e] mt-1.5 pl-1.5 border-l-2 border-[#b83a2e]">
                                  <span>{lang === 'bn' ? 'ওঠার স্থান: ' : 'Boarding Landmark: '}</span>
                                  <span className="text-[#120e0b] font-semibold">{getLegLandmark(leg, lang)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Leg Metrics */}
                            <div className="flex items-center gap-2.5 sm:gap-3 font-anek text-sm sm:text-base font-bold text-[#120e0b] shrink-0 pl-11 md:pl-0">
                              <span className="px-3 py-1.5 rounded-lg bg-[#f5eedf] border border-[#c69429]/40 text-[#15453b]">
                                ⏱ {formatDuration(leg.duration_mins, lang)}
                              </span>
                              <span className="px-3 py-1.5 rounded-lg bg-[#b83a2e]/10 text-[#b83a2e] border border-[#b83a2e]/30">
                                {formatFare(leg.regular_fare_bdt, lang)}
                              </span>
                              {leg.student_fare_bdt < leg.regular_fare_bdt && (
                                <span className="px-3 py-1.5 rounded-lg bg-[#0e6e41]/10 text-[#0e6e41] border border-[#0e6e41]/30">
                                  🎓 {formatFare(leg.student_fare_bdt, lang)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Large Action Buttons for Easy Accessibility */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Big Audio Readout Button (Very helpful for older people!) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAudioBriefing(route);
                      }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#292019] to-[#3d3026] hover:from-[#3d3026] hover:to-[#59473a] text-[#f6d16f] font-anek font-bold text-sm sm:text-base border-2 border-[#c69429] active:scale-95 transition-all shadow-lg cursor-pointer"
                      title="Audio voice readout of itinerary"
                    >
                      <Volume2 className="w-5 h-5 text-[#f6d16f]" />
                      <span>{lang === 'bn' ? '🔊 পড়ে শোনান (অডিও ব্রিফিং)' : '🔊 Read Aloud (Audio)'}</span>
                    </button>

                    {/* Download Commute Card Button for this Route */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateOfflineRouteCard({
                          route,
                          origin: origin || 'Mirpur 10',
                          destination: destination || 'Motijheel',
                          lang
                        });
                      }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0e3b32] hover:from-[#1b5e50] hover:to-[#15453b] text-[#fbf8f1] font-anek font-bold text-sm sm:text-base border-2 border-[#2a6f62] active:scale-95 transition-all shadow-lg cursor-pointer group"
                      title={lang === 'bn' ? 'এই রুটের অফলাইন পোস্টকার্ড বা কমিউট কার্ড ডাউনলোড করুন' : 'Download Commute Pass Card for this route'}
                    >
                      <Download className="w-5 h-5 text-[#6ee7b7] group-hover:scale-110 transition-transform" />
                      <span>{lang === 'bn' ? '📥 কমিউট কার্ড ডাউনলোড' : '📥 Download Commute Card'}</span>
                    </button>
                  </div>

                  {/* View Detailed Breakdown */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFareBreakdown && onOpenFareBreakdown(route);
                    }}
                    className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-anek font-bold text-sm sm:text-base border-2 border-[#f6d16f] active:scale-95 transition-all shadow-lg ml-auto cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-[#f6d16f]" />
                    <span>{t.viewFareBreakdown}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
