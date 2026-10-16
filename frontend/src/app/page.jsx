'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MobileDrawer from '../components/MobileDrawer';
import MapView from '../components/MapView';
import RouteSearch from '../components/RouteSearch';
import RouteResults from '../components/RouteResults';
import FareBreakdownModal from '../components/FareBreakdownModal';
import ScenarioSimulator from '../components/ScenarioSimulator';
import StreetAlertsFeed from '../components/StreetAlertsFeed';
import AddAlertModal from '../components/AddAlertModal';
import TransitCMS from '../components/TransitCMS';
import ChatDrawer from '../components/ChatDrawer';
import RideShareBoard from '../components/RideShareBoard';
import NoticeScanner from '../components/NoticeScanner';
import EmergencyHelpline from '../components/EmergencyHelpline';
import DhakaCommuteHeritageShowcase from '../components/DhakaCommuteHeritageShowcase';
import { generateOfflineRouteCard } from '../utils/offlineCard';
import { toBnDigits } from '../utils/localization';
import { X } from 'lucide-react';

import { STATIC_HUBS, STATIC_ALERTS } from '../data/staticData';
import { parseCommuteQuery } from '../utils/nlpParser';

export default function Home() {
  const [lang, setLang] = useState('bn');
  const [theme, setTheme] = useState('dark');
  const [currentTab, setCurrentTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load saved theme and language on initial client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('dhakapath_theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        const savedLang = localStorage.getItem('dhakapath_lang');
        if (savedLang === 'bn' || savedLang === 'en') {
          setLang(savedLang);
        }
      } catch (err) {
        console.error('Storage access error:', err);
      }
    }
  }, []);

  // Synchronize light/dark theme class on document body and html element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      try {
        localStorage.setItem('dhakapath_theme', theme);
      } catch (err) {}
    }
  }, [theme]);

  // Synchronize language and html lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      try {
        localStorage.setItem('dhakapath_lang', lang);
      } catch (err) {}
    }
  }, [lang]);

  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsResultsOpen(false);
        setFareModalRoute(null);
        setIsAddAlertOpen(false);
        setIsScannerOpen(false);
        setIsChatOpen(false);
        setIsDrawerOpen(false);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Search parameters
  const [origin, setOrigin] = useState('Mirpur 10');
  const [destination, setDestination] = useState('Motijheel');
  const [passengerType, setPassengerType] = useState('general');
  const [weather, setWeather] = useState('normal');
  const [isRushHour, setIsRushHour] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Data states
  const [hubs, setHubs] = useState(STATIC_HUBS);
  const [alerts, setAlerts] = useState(STATIC_ALERTS);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  // Simulation state
  const [simulationState, setSimulationState] = useState({
    rain_active: false,
    rush_hour_active: false,
    blocked_hubs: [],
    waterlogged_hubs: []
  });

  // Modals
  const [fareModalRoute, setFareModalRoute] = useState(null);
  const [isAddAlertOpen, setIsAddAlertOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [hasUserSearched, setHasUserSearched] = useState(false);
  const [liveWeather, setLiveWeather] = useState({
    temperature: 32.5,
    humidity: 55,
    precipitation_mm: 0,
    condition: 'clear',
    condition_bn: 'পরিষ্কার রোদ ও স্বাভাবিক আবহাওয়া',
    is_raining: false,
    icon: '☀️'
  });

  // Fetch initial alerts, live real weather & run default search on mount
  useEffect(() => {
    fetchAlerts();
    fetchLiveWeather().then((autoWeather) => {
      performSearch('Mirpur 10', 'Motijheel', 'general', autoWeather || 'normal', false);
    });

    const weatherTimer = setInterval(fetchLiveWeather, 180000); // 3 mins auto refresh
    return () => clearInterval(weatherTimer);
  }, []);

  const fetchLiveWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const data = await res.json();
        setLiveWeather(data);
        const autoWeather = (data.is_raining || simulationState.rain_active) ? 'rain' : 'normal';
        setWeather(autoWeather);
        return autoWeather;
      }
    } catch (e) {
      console.warn('Real weather API offline');
    }
    return 'normal';
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (e) {
      console.warn('Backend alerts offline, using pre-seeded state.');
    }
  };

  const performSearch = async (orig, dest, passType, weath, rush) => {
    if (!orig || !dest || orig === dest) {
      setRoutes([]);
      setSelectedRoute(null);
      setIsLoadingRoutes(false);
      return;
    }

    setIsLoadingRoutes(true);
    try {
      const res = await fetch('/api/search/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: orig,
          destination: dest,
          passenger_type: passType,
          weather_condition: weath,
          is_rush_hour: rush
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRoutes(data.routes);
        setSelectedRoute(data.routes[0] || null);
        return;
      }
    } catch (err) {
      console.warn('API error, using local fallback route generator');
    } finally {
      setIsLoadingRoutes(false);
    }

    // High quality local fallback route generator
    const isDirectMetro = (orig === 'Mirpur 10' && dest === 'Motijheel') || 
                          (orig === 'Uttara' && dest === 'Motijheel');

    const fallbackRoutes = [
      {
        id: 'opt-fastest',
        title: isDirectMetro ? `MRT-6 Direct Metro Express (${orig} ➔ ${dest})` : `Express Connector (${orig} ➔ ${dest})`,
        title_bn: isDirectMetro ? `এমআরটি-৬ মেট্রোরেল এক্সপ্রেস (${STATIC_HUBS[orig]?.name_bn || orig} ➔ ${STATIC_HUBS[dest]?.name_bn || dest})` : `দ্রুততম এক্সপ্রেস রুট`,
        type_badge: 'Fastest Route',
        total_duration_mins: isDirectMetro ? 24 : 35,
        total_regular_fare: isDirectMetro ? 50 : 60,
        total_student_fare: isDirectMetro ? 50 : 60,
        transfers: isDirectMetro ? 0 : 1,
        is_recommended: true,
        is_detour: false,
        legs: [
          {
            leg_number: 1,
            mode: isDirectMetro ? 'metro' : 'bus',
            line_name: isDirectMetro ? 'MRT-6 Metro Rail' : 'Bikolpo Auto Service',
            from_hub: orig,
            to_hub: dest,
            distance_km: 8.5,
            duration_mins: isDirectMetro ? 24 : 35,
            regular_fare_bdt: isDirectMetro ? 50 : 30,
            student_fare_bdt: isDirectMetro ? 50 : 15,
            surge_multiplier: 1.0,
            landmark_instructions: isDirectMetro 
              ? `Enter ${orig} Metro Station concourse. Alight at ${dest} platform.`
              : `Board bus near ${orig} roundabout.`
          }
        ]
      },
      {
        id: 'opt-cheapest',
        title: `Economy Bus Route (Student Half-Pass) (${orig} ➔ ${dest})`,
        title_bn: `সাশ্রয়ী বাস রুট (শিক্ষার্থী হাফ-পাস)`,
        type_badge: 'Student & Budget Pick',
        total_duration_mins: 42,
        total_regular_fare: 35,
        total_student_fare: 18,
        transfers: 0,
        is_recommended: false,
        is_detour: false,
        legs: [
          {
            leg_number: 1,
            mode: 'bus',
            line_name: 'Shikor Paribahan',
            from_hub: orig,
            to_hub: dest,
            distance_km: 9.2,
            duration_mins: 42,
            regular_fare_bdt: 35,
            student_fare_bdt: 18,
            surge_multiplier: 1.0,
            landmark_instructions: `Board from ${orig} foot-overbridge bus bay.`
          }
        ]
      },
      {
        id: 'opt-scenic',
        title: `Old Dhaka Heritage Connector (${orig} ➔ ${dest})`,
        title_bn: `ঐতিহ্যবাহী পুরান ঢাকা কানেক্টর (রিকশা ও লেগুনা)`,
        type_badge: 'Culture & Rickshaw Art',
        total_duration_mins: 55,
        total_regular_fare: 80,
        total_student_fare: 65,
        transfers: 2,
        is_recommended: false,
        is_detour: false,
        legs: [
          {
            leg_number: 1,
            mode: 'leguna',
            line_name: 'Farmgate - Lalbagh Human Hauler',
            from_hub: orig,
            to_hub: 'Shahbagh',
            distance_km: 4.0,
            duration_mins: 20,
            regular_fare_bdt: 20,
            student_fare_bdt: 20,
            surge_multiplier: 1.0,
            landmark_instructions: 'Take front seat near Khamarbari.'
          },
          {
            leg_number: 2,
            mode: 'rickshaw',
            line_name: 'Traditional Rickshaw Art Ride',
            from_hub: 'Shahbagh',
            to_hub: dest,
            distance_km: 3.2,
            duration_mins: 25,
            regular_fare_bdt: 60,
            student_fare_bdt: 45,
            surge_multiplier: weath === 'rain' ? 1.5 : 1.0,
            landmark_instructions: 'Take colorful hood rickshaw past Curzon Hall & High Court.'
          }
        ]
      }
    ];

    setRoutes(fallbackRoutes);
    setSelectedRoute(fallbackRoutes[0]);
  };

  const handleLocationDetected = (locInfo) => {
    setUserLocation(locInfo);
    if (locInfo && locInfo.hubName) {
      const nearestHub = locInfo.hubName;
      setOrigin(nearestHub);
      let targetDest = destination;
      if (nearestHub === destination) {
        targetDest = nearestHub === 'Motijheel' ? 'Mirpur 10' : 'Motijheel';
        setDestination(targetDest);
      }
      performSearch(nearestHub, targetDest, passengerType, weather, isRushHour);
    }
  };

  const handleManualSearch = () => {
    setHasUserSearched(true);
    setIsResultsOpen(true);
    performSearch(origin, destination, passengerType, weather, isRushHour);
  };

  const handleNlpSearch = async (queryText) => {
    setHasUserSearched(true);
    setIsResultsOpen(true);
    setIsLoadingRoutes(true);

    let localParsed = null;
    try {
      localParsed = parseCommuteQuery(queryText, origin, destination);
    } catch (e) {
      console.warn('Local parse error:', e);
    }

    try {
      const res = await fetch('/api/search/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: queryText,
          fallbackOrigin: origin,
          fallbackDest: destination
        })
      });

      if (res.ok) {
        const data = await res.json();
        const nextOrigin = data.origin || (localParsed && localParsed.origin) || origin;
        const nextDest = data.destination || (localParsed && localParsed.destination) || destination;
        const nextPass = data.passenger_type || (localParsed && localParsed.passenger_type) || passengerType;
        const nextWeather = data.weather_condition === 'rain' ? 'rain' : weather;
        const nextRush = data.is_rush_hour || isRushHour;

        setOrigin(nextOrigin);
        setDestination(nextDest);
        setPassengerType(nextPass);
        if (nextWeather === 'rain') setWeather('rain');
        if (nextRush) setIsRushHour(true);

        performSearch(
          nextOrigin,
          nextDest,
          nextPass,
          nextWeather,
          nextRush
        );
        return;
      }
    } catch (e) {
      console.warn('NLP route extraction API offline, using local parser');
    }

    // High reliability local parser fallback for Banglish/Bengali
    if (localParsed) {
      setOrigin(localParsed.origin);
      setDestination(localParsed.destination);
      setPassengerType(localParsed.passenger_type);
      if (localParsed.weather_condition === 'rain') setWeather('rain');
      if (localParsed.is_rush_hour) setIsRushHour(true);
      performSearch(
        localParsed.origin,
        localParsed.destination,
        localParsed.passenger_type,
        localParsed.weather_condition === 'rain' ? 'rain' : weather,
        localParsed.is_rush_hour || isRushHour
      );
    } else {
      performSearch(origin, destination, passengerType, weather, isRushHour);
    }
  };

  const handleVoteAlert = async (alertId, voteType) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const upvotes = voteType === 'upvote' ? a.upvotes + 1 : a.upvotes;
          const downvotes = voteType === 'downvote' ? a.downvotes + 1 : a.downvotes;
          return {
            ...a,
            upvotes,
            downvotes,
            trust_score: Math.min(100, Math.max(0, a.trust_score + (voteType === 'upvote' ? 3 : -8)))
          };
        }
        return a;
      })
    );

    try {
      await fetch('/api/alerts/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId, vote_type: voteType })
      });
    } catch (e) {
      // Offline mode
    }
  };

  const handleSubmitAlert = async (alertData) => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...alertData,
      upvotes: 1,
      downvotes: 0,
      verified: false,
      minutes_ago: 1,
      is_active: true,
      trust_score: 75.0
    };
    setAlerts([newAlert, ...alerts]);

    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
    } catch (e) {
      // Offline mode
    }
  };

  const handleTriggerScenario = async (payload) => {
    const action = payload.action;
    let nextRain = simulationState.rain_active;
    let nextRush = simulationState.rush_hour_active;
    let nextBlocked = [...simulationState.blocked_hubs];

    if (action === 'toggle_rain') nextRain = !nextRain;
    else if (action === 'toggle_rush') nextRush = !nextRush;
    else if (action === 'block_hub') {
      const h = payload.hub;
      if (nextBlocked.includes(h)) nextBlocked = nextBlocked.filter(x => x !== h);
      else nextBlocked.push(h);
    } else if (action === 'reset') {
      nextRain = false;
      nextRush = false;
      nextBlocked = [];
    }

    const nextState = {
      rain_active: nextRain,
      rush_hour_active: nextRush,
      blocked_hubs: nextBlocked,
      waterlogged_hubs: nextRain ? ['Malibagh'] : []
    };

    setSimulationState(nextState);
    setWeather(nextRain ? 'rain' : 'normal');
    setIsRushHour(nextRush);

    // Immediately recalculate routes to demonstrate live detour!
    performSearch(origin, destination, passengerType, nextRain ? 'rain' : 'normal', nextRush);

    try {
      await fetch('/api/simulation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Offline mode
    }
  };

  // Download Postcard Transit Card (direct from Navbar & Drawer)
  const handleDownloadPostcard = () => {
    const routeToDownload = selectedRoute || (routes && routes.length > 0 ? routes[0] : null);
    if (routeToDownload) {
      generateOfflineRouteCard({
        route: routeToDownload,
        origin: origin || 'Mirpur 10',
        destination: destination || 'Motijheel',
        lang
      });
    } else {
      const defaultRoute = {
        id: 'opt-fastest',
        title: 'MRT-6 Metro Rail Lifeline (Uttara ➔ Motijheel)',
        title_bn: 'এমআরটি-৬ মেট্রোরেল এক্সপ্রেস (উত্তরা ➔ মতিঝিল)',
        type_badge: 'Fastest Route',
        total_duration_mins: 32,
        total_regular_fare: 100,
        total_student_fare: 100,
        transfers: 0,
        legs: [
          {
            leg_number: 1,
            mode: 'metro',
            line_name: 'MRT-6 Metro Rail',
            from_hub: 'Uttara North',
            to_hub: 'Motijheel',
            distance_km: 20.1,
            duration_mins: 32,
            regular_fare_bdt: 100,
            student_fare_bdt: 100,
            landmark_instructions: lang === 'bn' ? 'উত্তরা উত্তর মেট্রোরেল স্টেশন কনকোর্স' : 'Enter Uttara North Station concourse'
          }
        ]
      };
      generateOfflineRouteCard({
        route: defaultRoute,
        origin: lang === 'bn' ? 'উত্তরা উত্তর' : 'Uttara North',
        destination: lang === 'bn' ? 'মতিঝিল' : 'Motijheel',
        lang
      });
    }
  };

  return (
    <main className={`min-h-screen flex flex-col font-anek transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        setIsDrawerOpen={setIsDrawerOpen}
        activeAlertCount={alerts.length}
        onDownloadPostcard={handleDownloadPostcard}
      />

      {/* Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        activeAlertCount={alerts.length}
        onOpenScanner={() => setIsScannerOpen(true)}
        onDownloadPostcard={handleDownloadPostcard}
      />

      {/* Full-Width Laptop Screen Container */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">

        {/* TAB 1: HOME (Focused Smart Transit Search & Itineraries) */}
        {currentTab === 'home' && (
          <div className="space-y-6 my-4 w-full">
            {/* Clean & Modern Live Weather & Fare Status Bar (Adapts to Light & Dark Themes) */}
            {liveWeather && (
              <div className={`p-3 sm:py-3 sm:px-5 rounded-2xl border transition-all duration-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4 ${
                theme === 'light'
                  ? 'bg-white border-amber-200/90 text-slate-800 shadow-xs'
                  : 'bg-[#18130f] border-[#c69429]/40 text-[#dfcfb2] shadow-md'
              }`}>
                {/* Left Side: Icon + Title + Live Dot + Metrics */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                    theme === 'light' ? 'bg-amber-100/70 border border-amber-200' : 'bg-[#241a14] border border-[#c69429]/30'
                  }`}>
                    {liveWeather.icon || (weather === 'rain' ? '🌧️' : '☀️')}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-anek font-bold text-sm sm:text-base ${
                      theme === 'light' ? 'text-slate-900 font-extrabold' : 'text-[#f6d16f]'
                    }`}>
                      {lang === 'bn' ? 'ঢাকা ট্রানজিট আবহাওয়া' : 'Dhaka Transit Weather'}
                    </span>

                    {/* Live Indicator Pill */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {lang === 'bn' ? 'লাইভ' : 'LIVE'}
                    </span>
                  </div>

                  {/* Clean Metrics Badges */}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-anek font-bold flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg border ${
                      theme === 'light' 
                        ? 'bg-amber-50 text-amber-900 border-amber-200' 
                        : 'bg-[#241a14] text-[#fbf8f1] border-[#c69429]/30'
                    }`}>
                      🌡️ {lang === 'bn' ? `${toBnDigits(liveWeather.temperature)}° সে.` : `${liveWeather.temperature}°C`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg border ${
                      theme === 'light' 
                        ? 'bg-sky-50 text-sky-900 border-sky-200' 
                        : 'bg-[#241a14] text-[#7dd3fc] border-[#c69429]/30'
                    }`}>
                      💧 {lang === 'bn' ? `${toBnDigits(liveWeather.humidity)}%` : `${liveWeather.humidity}%`}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg border ${
                      theme === 'light' 
                        ? 'bg-slate-50 text-slate-800 border-slate-200' 
                        : 'bg-[#241a14] text-[#dfcfb2] border-[#c69429]/30'
                    }`}>
                      🌧️ {lang === 'bn' ? `${toBnDigits(liveWeather.precipitation_mm)} মিমি` : `${liveWeather.precipitation_mm}mm`}
                    </span>
                  </div>
                </div>

                {/* Right Side: Clean Transit Impact Status Notice */}
                <div className="flex items-center gap-2 md:justify-end text-xs font-anek">
                  {(liveWeather.is_raining || weather === 'rain') ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 text-rose-600 border border-rose-500/30 font-bold">
                      <span>⚠️</span>
                      <span>
                        {lang === 'bn' 
                          ? 'বৃষ্টি ও জলজট ঝুঁকি • রিকশায় সার্ফ (+৫০%), মেট্রোরেলে সাধারণ ভাড়া' 
                          : 'Rain & Waterlogging Risk • Rickshaws +50% surge, Metro normal'}
                      </span>
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border font-semibold ${
                      theme === 'light' 
                        ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200' 
                        : 'bg-[#15453b]/30 text-[#6ee7b7] border-[#2a6f62]'
                    }`}>
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {lang === 'bn' 
                          ? 'স্বাভাবিক আবহাওয়া • বাস, রিকশা ও মেট্রোরেল নিয়মিত ভাড়ায় সচল' 
                          : 'Clear Weather • Buses, rickshaws & metro running at normal fares'}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Route Query Engine */}
            <RouteSearch
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              passengerType={passengerType}
              setPassengerType={setPassengerType}
              weather={weather}
              setWeather={setWeather}
              isRushHour={isRushHour}
              setIsRushHour={setIsRushHour}
              onSearch={handleManualSearch}
              onNlpSearch={handleNlpSearch}
              isLoading={isLoadingRoutes}
              onLocationDetected={handleLocationDetected}
              userLocation={userLocation}
              lang={lang}
              onOpenScanner={() => setIsScannerOpen(true)}
            />

            {/* View Results Button (Only after user initiates a search) */}
            {hasUserSearched && routes.length > 0 && (
              <div className="flex justify-center -mt-3">
                <button
                  type="button"
                  onClick={() => setIsResultsOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#292019] hover:bg-[#3d3026] text-[#fbf8f1] border-2 border-[#c69429]/60 hover:border-[#f6d16f] font-anek font-extrabold text-sm shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <span className="text-base">🧭</span>
                  <span>{lang === 'bn' ? `খোঁজা রুটগুলো দেখুন (${toBnDigits(routes.length)}টি বিকল্প)` : `View Search Results (${routes.length} options)`}</span>
                </button>
              </div>
            )}

            {/* Dhaka Cultural Heritage & Commute Lifelines Showcase */}
            <DhakaCommuteHeritageShowcase lang={lang} />

            {/* Emergency Helpline Strip */}
            <EmergencyHelpline lang={lang} isHome={true} />
          </div>
        )}

        {/* TAB 2: STREET DISRUPTIONS & WATERLOGGING FEED */}
        {currentTab === 'alerts' && (
          <div>
            <StreetAlertsFeed
              alerts={alerts}
              onVote={handleVoteAlert}
              onOpenReportModal={() => setIsAddAlertOpen(true)}
              lang={lang}
            />
            <EmergencyHelpline lang={lang} isHome={false} />
          </div>
        )}

        {/* TAB 3: SCENARIO SIMULATOR & INTERACTIVE MAP TAB */}
        {currentTab === 'simulator' && (
          <div className="space-y-6">
            <ScenarioSimulator
              simulationState={simulationState}
              onTriggerScenario={handleTriggerScenario}
              lang={lang}
            />
            <MapView
              hubs={hubs}
              activeAlerts={alerts}
              activeRoute={selectedRoute}
              userLocation={userLocation}
              lang={lang}
              onSetOrigin={(name) => setOrigin(name)}
              onSetDestination={(name) => setDestination(name)}
              onSelectHub={(name) => {
                if (!origin) setOrigin(name);
                else setDestination(name);
              }}
            />
            <EmergencyHelpline lang={lang} isHome={false} />
          </div>
        )}

        {/* TAB 4: TRANSIT CMS DIRECTORY */}
        {currentTab === 'cms' && (
          <div>
            <TransitCMS 
              lang={lang} 
              onSelectBusRoute={(fromStop, toStop) => {
                if (fromStop && toStop) {
                  setOrigin(fromStop);
                  setDestination(toStop);
                  setCurrentTab('home');
                  performSearch(fromStop, toStop, passengerType, weather, isRushHour);
                  setHasUserSearched(true);
                  setIsResultsOpen(true);
                }
              }}
            />
            <EmergencyHelpline lang={lang} isHome={false} />
          </div>
        )}

        {/* TAB 5: RIDE-SHARE BOARD (BONUS 3) */}
        {currentTab === 'rideshare' && (
          <div>
            <RideShareBoard lang={lang} />
            <EmergencyHelpline lang={lang} isHome={false} />
          </div>
        )}
      </div>

      {/* Conversational Commute Assistant (Floating Bot) */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        lang={lang}
        onApplyRouteFromChat={(r) => {
          setSelectedRoute(r);
          setIsChatOpen(false);
          setCurrentTab('home');
          setHasUserSearched(true);
          setIsResultsOpen(true);
        }}
      />

      {/* Modals */}
      <FareBreakdownModal
        isOpen={!!fareModalRoute}
        onClose={() => setFareModalRoute(null)}
        route={fareModalRoute}
        lang={lang}
      />

      <AddAlertModal
        isOpen={isAddAlertOpen}
        onClose={() => setIsAddAlertOpen(false)}
        onSubmitAlert={handleSubmitAlert}
        lang={lang}
      />

      <NoticeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lang={lang}
      />

      {/* Route Results Modal (On-Demand Popup) */}
      {isResultsOpen && routes.length > 0 && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsResultsOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#120e0b] border-2 border-[#c69429] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#1a1410] border-b-2 border-[#c69429]/40 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🧭</span>
                <div>
                  <h3 className="font-rickshaw text-lg sm:text-2xl font-bold text-[#f6d16f] tracking-wide">
                    {lang === 'bn' ? 'প্রস্তাবিত রুট ও ভাড়ার তালিকা' : 'Suggested Routes & Fare Details'}
                  </h3>
                  <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] flex items-center gap-1.5">
                    <span className="font-bold text-[#f6d16f]">{STATIC_HUBS[origin]?.name_bn && lang === 'bn' ? STATIC_HUBS[origin].name_bn : origin}</span>
                    <span>➔</span>
                    <span className="font-bold text-[#f6d16f]">{STATIC_HUBS[destination]?.name_bn && lang === 'bn' ? STATIC_HUBS[destination].name_bn : destination}</span>
                    <span className="text-[#c69429]">|</span>
                    <span>{lang === 'bn' ? `${toBnDigits(routes.length)}টি বিকল্প রুট পাওয়া গেছে` : `${routes.length} route options found`}</span>
                  </p>
                </div>
              </div>

              {/* Bold, Unmistakable Close / Exit Button */}
              <button
                type="button"
                onClick={() => setIsResultsOpen(false)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl bg-[#b83a2e] hover:bg-[#96281e] text-white border-2 border-white shadow-xl cursor-pointer active:scale-95 transition-all shrink-0 group"
                aria-label={lang === 'bn' ? 'বন্ধ করুন (Exit)' : 'Close'}
                title={lang === 'bn' ? 'বন্ধ করুন (Exit)' : 'Close Modal'}
              >
                <svg 
                  className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-200" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-2 bg-[#120e0b]">
              <RouteResults
                routes={routes}
                origin={origin}
                destination={destination}
                passengerType={passengerType}
                lang={lang}
                selectedRouteId={selectedRoute?.id}
                onSelectRoute={(r) => setSelectedRoute(r)}
                onOpenFareBreakdown={(r) => setFareModalRoute(r)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
