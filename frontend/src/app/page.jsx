'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MobileDrawer from '../components/MobileDrawer';
import StatsBar from '../components/StatsBar';
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

import { STATIC_HUBS, STATIC_ALERTS } from '../data/staticData';
import { runDijkstraRouting } from '../utils/dijkstra';

export default function Home() {
  const [lang, setLang] = useState('bn');
  const [theme, setTheme] = useState('dark');
  const [currentTab, setCurrentTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Sync theme with body class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

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

  const performSearch = async (orig, dest, passType, weath, rush, alertsOverride = null) => {
    setIsLoadingRoutes(true);
    const activeAlertsToUse = alertsOverride || alerts;
    try {
      const res = await fetch('/api/search/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: orig,
          destination: dest,
          passenger_type: passType,
          weather_condition: weath,
          is_rush_hour: rush,
          active_alerts: activeAlertsToUse
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRoutes(data.routes);
        setSelectedRoute(data.routes[0] || null);
        return;
      }
    } catch (err) {
      console.warn('API error, using local Dijkstra route generator');
    } finally {
      setIsLoadingRoutes(false);
    }

    // High precision client-side Dijkstra calculation
    const calculatedRoutes = runDijkstraRouting({
      origin: orig,
      destination: dest,
      passengerType: passType,
      weather: weath,
      isRushHour: rush,
      activeAlerts: activeAlertsToUse
    });

    setRoutes(calculatedRoutes);
    setSelectedRoute(calculatedRoutes[0] || null);
  };

  const handleManualSearch = () => {
    performSearch(origin, destination, passengerType, weather, isRushHour);
  };

  const handleNlpSearch = async (queryText) => {
    setIsLoadingRoutes(true);
    try {
      const res = await fetch('/api/search/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      if (res.ok) {
        const parsed = await res.json();
        if (parsed.origin) setOrigin(parsed.origin);
        if (parsed.destination) setDestination(parsed.destination);
        if (parsed.passenger_type) setPassengerType(parsed.passenger_type);
        performSearch(
          parsed.origin || origin,
          parsed.destination || destination,
          parsed.passenger_type || passengerType,
          weather,
          isRushHour
        );
        return;
      }
    } catch (e) {
      console.warn('NLP API unavailable, applying local parsing');
    }

    const low = queryText.toLowerCase();
    const isStudent = low.includes('student') || low.includes('half') || low.includes('হাফ');
    if (isStudent) setPassengerType('student');
    performSearch(origin, destination, isStudent ? 'student' : passengerType, weather, isRushHour);
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
    let updatedAlerts = [...alerts];
    if (nextRain) {
      if (!updatedAlerts.some(a => a.hub === 'Malibagh' && a.type === 'waterlogging')) {
        updatedAlerts = [
          {
            id: `alert-malibagh-flood-${Date.now()}`,
            hub: 'Malibagh',
            type: 'waterlogging',
            severity: 95,
            title: 'Severe Waterlogging at Malibagh Railgate',
            title_bn: 'মালিবাগে তীব্র জলাবদ্ধতা ও যান চলাচল স্থবির',
            description: 'Roads submerged. Alternate routes activated.',
            description_bn: 'মালিবাগ রেলগেটে তীব্র জলাবদ্ধতা। বাস চলাচল বন্ধ।',
            upvotes: 42,
            downvotes: 1,
            is_active: true,
            minutes_ago: 2,
            trust_score: 95.0,
            verified: true
          },
          ...updatedAlerts
        ];
      }
    } else {
      updatedAlerts = updatedAlerts.filter(a => !(a.hub === 'Malibagh' && a.type === 'waterlogging'));
    }

    if (nextBlocked.includes('Shahbagh')) {
      if (!updatedAlerts.some(a => a.hub === 'Shahbagh' && a.type === 'blockade')) {
        updatedAlerts = [
          {
            id: `alert-shahbagh-blockade-${Date.now()}`,
            hub: 'Shahbagh',
            type: 'blockade',
            severity: 98,
            title: 'Intersection Blockade at Shahbagh',
            title_bn: 'শাহবাগ মোড়ে সমাবেশ ও সড়ক অবরোধ',
            description: 'Ground traffic blocked. MRT-6 Metro running overhead.',
            description_bn: 'নিচের সব যান চলাচল বন্ধ। উপর দিয়ে মেট্রোরেল পুরোপুরি সচল।',
            upvotes: 89,
            downvotes: 0,
            is_active: true,
            minutes_ago: 4,
            trust_score: 99.0,
            verified: true
          },
          ...updatedAlerts
        ];
      }
    } else {
      updatedAlerts = updatedAlerts.filter(a => !(a.hub === 'Shahbagh' && a.type === 'blockade'));
    }

    if (action === 'reset') {
      updatedAlerts = STATIC_ALERTS;
    }

    setAlerts(updatedAlerts);
    performSearch(origin, destination, passengerType, nextRain ? 'rain' : 'normal', nextRush, updatedAlerts);

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

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top Navigation Bar with Theme & Language Toggle */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        setIsDrawerOpen={setIsDrawerOpen}
        activeAlertCount={alerts.length}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        activeAlertCount={alerts.length}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Full-Width Laptop Screen Container */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
        {/* Living High-Impact Stats Bar */}
        <StatsBar lang={lang} />

        {/* TAB 1: HOME (Map + Search + Results) */}
        {currentTab === 'home' && (
          <div className="w-full">
            {/* Desktop 2-Column Split: Search/Results (Left) & Sticky Live Map (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-4">
              {/* Left Column: Smart Route Engine, Itineraries & Simulator */}
              <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6">
                {/* Smart Route Search Engine */}
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

                {/* Route Results & Detour Showcase */}
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

                {/* Urban Disruption Scenario Simulator */}
                <ScenarioSimulator
                  simulationState={simulationState}
                  onTriggerScenario={handleTriggerScenario}
                  lang={lang}
                />
              </div>

              {/* Right Column: Full Interactive Leaflet Map (Sticky on Desktop) */}
              <div className="lg:col-span-7 xl:col-span-7 lg:sticky lg:top-20 flex flex-col gap-4">
                <MapView
                  hubs={hubs}
                  activeAlerts={alerts}
                  activeRoute={selectedRoute}
                  lang={lang}
                  onSelectHub={(hubName) => {
                    if (hubName !== origin) setDestination(hubName);
                  }}
                />
              </div>
            </div>

            {/* Emergency Helpline Strip (Exclusively on Home) */}
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

        {/* TAB 3: SCENARIO SIMULATOR TAB */}
        {currentTab === 'simulator' && (
          <div>
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
    </main>
  );
}
