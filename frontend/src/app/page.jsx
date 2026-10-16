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
import { X } from 'lucide-react';

import { STATIC_HUBS, STATIC_ALERTS } from '../data/staticData';

export default function Home() {
  const [lang, setLang] = useState('bn');
  const [theme, setTheme] = useState('dark');
  const [currentTab, setCurrentTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Synchronize light/dark theme class on document body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
    }
  }, [theme]);

  // Search parameters
  const [origin, setOrigin] = useState('Mirpur 10');
  const [destination, setDestination] = useState('Motijheel');
  const [passengerType, setPassengerType] = useState('general');
  const [weather, setWeather] = useState('normal');
  const [isRushHour, setIsRushHour] = useState(false);

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

  // Fetch initial alerts & run default search on mount
  useEffect(() => {
    fetchAlerts();
    performSearch('Mirpur 10', 'Motijheel', 'general', 'normal', false);
  }, []);

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

  const handleManualSearch = () => {
    setHasUserSearched(true);
    setIsResultsOpen(true);
    performSearch(origin, destination, passengerType, weather, isRushHour);
  };

  const handleNlpSearch = async (queryText) => {
    setHasUserSearched(true);
    setIsResultsOpen(true);
    setIsLoadingRoutes(true);
    try {
      const res = await fetch('/api/search/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.origin) setOrigin(data.origin);
        if (data.destination) setDestination(data.destination);
        if (data.passenger_type) setPassengerType(data.passenger_type);

        performSearch(
          data.origin || origin,
          data.destination || destination,
          data.passenger_type || passengerType,
          weather,
          isRushHour
        );
        return;
      }
    } catch (e) {
      console.warn('NLP route extraction offline, using fallback');
    }

    // Local parser fallback for Banglish/Bengali
    const lower = queryText.toLowerCase();
    let detectedOrigin = origin;
    let detectedDest = destination;

    if (lower.includes('mirpur') || lower.includes('মিরপুর')) detectedOrigin = 'Mirpur 10';
    if (lower.includes('motijheel') || lower.includes('মতিঝিল')) detectedDest = 'Motijheel';
    if (lower.includes('farmgate') || lower.includes('ফার্মগেট')) detectedOrigin = 'Farmgate';
    if (lower.includes('dhanmondi') || lower.includes('ধানমন্ডি')) detectedDest = 'Dhanmondi';
    if (lower.includes('uttara') || lower.includes('উত্তরা')) detectedOrigin = 'Uttara';
    if (lower.includes('student') || lower.includes('ছাত্র') || lower.includes('হাফ')) setPassengerType('student');

    setOrigin(detectedOrigin);
    setDestination(detectedDest);
    performSearch(detectedOrigin, detectedDest, passengerType, weather, isRushHour);
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
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-anek">
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
          <div className="space-y-8 my-4 w-full">
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
              lang={lang}
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
                  <span>{lang === 'bn' ? `খোঁজা রুটগুলো দেখুন (${routes.length}টি অপশন)` : `View Search Results (${routes.length} options)`}</span>
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
            <TransitCMS lang={lang} />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-sm animate-fadeIn"
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
                    <span className="font-bold text-[#f6d16f]">{origin}</span>
                    <span>➔</span>
                    <span className="font-bold text-[#f6d16f]">{destination}</span>
                    <span className="text-[#c69429]">|</span>
                    <span>{routes.length} {lang === 'bn' ? 'টি বিকল্প রুট পাওয়া গেছে' : 'routes found'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsResultsOpen(false)}
                className="p-2 sm:p-2.5 rounded-xl bg-[#292019] hover:bg-[#b83a2e] text-[#f6d16f] hover:text-white border border-[#c69429]/40 transition-colors cursor-pointer"
                aria-label="Close route results"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
