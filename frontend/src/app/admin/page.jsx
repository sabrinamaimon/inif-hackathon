'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  User,
  Bus,
  Train,
  AlertTriangle,
  MapPin,
  DollarSign,
  Check,
  X,
  Plus,
  Trash2,
  Edit2,
  Power,
  LogOut,
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass
} from 'lucide-react';
import { STATIC_HUBS } from '@/data/staticData';
import { toBnDigits } from '@/utils/localization';

export default function AdminPortal() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [lang, setLang] = useState('bn');

  // Admin Dashboard Active Tab: 'routes' | 'alerts' | 'landmarks' | 'fares'
  const [activeTab, setActiveTab] = useState('routes');

  // CMS Data States
  const [transitRoutes, setTransitRoutes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [fareSettings, setFareSettings] = useState({
    bus_rate_per_km: 2.50,
    bus_min_floor_bdt: 10,
    student_discount_percentage: 50,
    cng_base_fare: 40,
    cng_rate_per_km: 12,
    rickshaw_base_fare: 30,
    rickshaw_rain_surge_percent: 50,
    rickshaw_rush_surge_percent: 25
  });

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // New Route Form State
  const [isNewRouteOpen, setIsNewRouteOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    name_bn: '',
    mode: 'bus',
    origin_hub: 'Mirpur 10',
    destination_hub: 'Motijheel',
    distance_km: 12.0,
    duration_mins: 35,
    base_fare_bdt: 10,
    max_fare_bdt: 30,
    student_pass_allowed: true,
    landmarks: ''
  });

  // Emergency Alert Form State
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'waterlogging',
    hub: 'Shahbagh',
    severity: 'severe',
    title: '',
    title_bn: '',
    description: '',
    description_bn: ''
  });

  // Hub Landmarks State
  const [selectedHub, setSelectedHub] = useState('Dhanmondi');
  const [hubLandmarkText, setHubLandmarkText] = useState('');

  // Check persisted admin session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('dhakapath_admin_session');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch live CMS data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    loadTransitRoutes();
    loadAlerts();
    loadFareSettings();
  }, [isAuthenticated]);

  const showNotification = (msg, type = 'success') => {
    setFeedbackMsg({ text: msg, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadTransitRoutes = async () => {
    try {
      const res = await fetch('/api/transit/routes');
      if (res.ok) {
        const data = await res.json();
        setTransitRoutes(data.routes || []);
      }
    } catch (e) {
      console.error('Failed to load transit routes', e);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data || []);
      }
    } catch (e) {
      console.error('Failed to load alerts', e);
    }
  };

  const loadFareSettings = async () => {
    try {
      const res = await fetch('/api/transit/fare-settings');
      if (res.ok) {
        const data = await res.json();
        if (data) setFareSettings(data);
      }
    } catch (e) {
      console.error('Failed to load fare settings', e);
    }
  };

  // Login handler
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    // Hardcoded password: admin (or dhakapath2026)
    if (password === 'admin' || password === 'dhakapath2026') {
      setIsAuthenticated(true);
      setLoginError('');
      if (typeof window !== 'undefined') {
        localStorage.setItem('dhakapath_admin_session', 'true');
      }
      showNotification(lang === 'bn' ? 'সুপার অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে' : 'Logged in successfully as Super Administrator');
    } else {
      setLoginError(lang === 'bn' ? 'ভুল পাসওয়ার্ড! ডেমো পাসওয়ার্ড: admin' : 'Incorrect password! Demo password: admin');
    }
  };

  // Quick 1-click Demo Login
  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin');
    setIsAuthenticated(true);
    setLoginError('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('dhakapath_admin_session', 'true');
    }
    showNotification(lang === 'bn' ? '১-ক্লিক ডেমো লগইন সফল!' : '1-Click Demo Login successful!');
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dhakapath_admin_session');
    }
  };

  // ==========================================
  // TRANSIT NETWORK MANAGEMENT ACTIONS
  // ==========================================
  const handleCreateRoute = async (e) => {
    e.preventDefault();
    if (!newRoute.name || !newRoute.name_bn) {
      showNotification(lang === 'bn' ? 'রুটের নাম বাংলায় ও ইংরেজিতে প্রদান করুন' : 'Provide route name in both languages', 'error');
      return;
    }

    try {
      const res = await fetch('/api/transit/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoute)
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'নতুন ট্রানজিট লিংক যুক্ত হয়েছে' : 'New transit link added successfully');
        setIsNewRouteOpen(false);
        setNewRoute({
          name: '',
          name_bn: '',
          mode: 'bus',
          origin_hub: 'Mirpur 10',
          destination_hub: 'Motijheel',
          distance_km: 12.0,
          duration_mins: 35,
          base_fare_bdt: 10,
          max_fare_bdt: 30,
          student_pass_allowed: true,
          landmarks: ''
        });
        loadTransitRoutes();
      }
    } catch (e) {
      showNotification('Failed to create route', 'error');
    }
  };

  const handleToggleRouteStatus = async (route) => {
    try {
      const res = await fetch('/api/transit/routes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: route.id, is_active: !route.is_active })
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'রুটের স্থিতি আপডেট করা হয়েছে' : 'Route status updated');
        loadTransitRoutes();
      }
    } catch (e) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (!confirm(lang === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই রুটটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this route?')) return;
    try {
      const res = await fetch(`/api/transit/routes?id=${routeId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'রুটটি মুছে ফেলা হয়েছে' : 'Route deleted');
        loadTransitRoutes();
      }
    } catch (e) {
      showNotification('Failed to delete route', 'error');
    }
  };

  // ==========================================
  // STREET ALERTS MODERATION ACTIONS
  // ==========================================
  const handleApproveAlert = async (alertId) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, verified: true, is_active: true, trust_score: 95 })
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'সতর্কতাটি অনুমোদিত এবং লাইভ করা হয়েছে' : 'Alert approved and broadcasted live');
        loadAlerts();
      }
    } catch (e) {
      showNotification('Failed to approve alert', 'error');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, is_active: false })
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'সতর্কতাটি সমাধান করা হয়েছে' : 'Alert marked as resolved');
        loadAlerts();
      }
    } catch (e) {
      showNotification('Failed to resolve alert', 'error');
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const res = await fetch(`/api/alerts?id=${alertId}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'সতর্কতা বাতিল ও মুছে ফেলা হয়েছে' : 'Alert dismissed and deleted');
        loadAlerts();
      }
    } catch (e) {
      showNotification('Failed to delete alert', 'error');
    }
  };

  const handleBroadcastOfficialAlert = async (e) => {
    e.preventDefault();
    if (!newAlert.title) {
      showNotification(lang === 'bn' ? 'সতর্কতার শিরোনাম প্রদান করুন' : 'Provide alert title', 'error');
      return;
    }

    try {
      const payload = {
        type: newAlert.type,
        hub: newAlert.hub,
        severity: newAlert.severity,
        title: newAlert.title,
        title_bn: newAlert.title_bn || newAlert.title,
        description: newAlert.description,
        description_bn: newAlert.description_bn || newAlert.description,
        verified: true,
        trust_score: 100,
        upvotes: 10,
        downvotes: 0,
        is_active: true
      };

      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'জরুরি সড়ক সতর্কতা সফলভাবে লাইভ করা হয়েছে!' : 'Emergency alert broadcasted live!');
        setIsNewAlertOpen(false);
        setNewAlert({
          type: 'waterlogging',
          hub: 'Shahbagh',
          severity: 'severe',
          title: '',
          title_bn: '',
          description: '',
          description_bn: ''
        });
        loadAlerts();
      }
    } catch (e) {
      showNotification('Failed to broadcast alert', 'error');
    }
  };

  // ==========================================
  // FARE ENGINE SETTINGS SAVE
  // ==========================================
  const handleSaveFareSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/transit/fare-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fareSettings)
      });
      if (res.ok) {
        showNotification(lang === 'bn' ? 'বিআরটিএ বেস ভাড়া ও সার্জনীতি আপডেট হয়েছে' : 'Fare settings and BRTA rules updated successfully');
      }
    } catch (e) {
      showNotification('Failed to save fare settings', 'error');
    }
  };

  const allHubNames = Object.keys(STATIC_HUBS);

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (WHEN NOT LOGGED IN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#120e0b] text-[#fbf8f1] flex flex-col items-center justify-center p-4 selection:bg-[#f6d16f] selection:text-[#14100c]">
        {/* Ambient Rickshaw Glows */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#b83a2e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#c69429]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Top Brand Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shadow-2xl mb-3">
              <div className="w-full h-full rounded-[14px] bg-[#1a1410] flex items-center justify-center border border-[#f6d16f]/60">
                <Shield className="w-8 h-8 text-[#f6d16f]" />
              </div>
            </div>
            <h1 className="font-rickshaw text-3xl sm:text-4xl text-[#f6d16f] rickshaw-text-pop tracking-tight">
              {lang === 'bn' ? 'ঢাকা-পাথ অ্যাডমিন পোর্টাল' : 'DhakaPath Admin Portal'}
            </h1>
            <p className="text-xs sm:text-sm font-anek font-bold text-[#dfcfb2] mt-1">
              Part 1: Transit & Street-Status Management (CMS)
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#1a1410]/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border-2 border-[#c69429]/50 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#c69429]/30">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#f6d16f]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#dfcfb2]">
                  {lang === 'bn' ? 'অ্যাডমিন ভেরিফিকেশন' : 'RESTRICTED ADMIN ACCESS'}
                </span>
              </div>
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="text-xs font-anek font-bold px-2.5 py-1 rounded-lg bg-[#292019] border border-[#c69429]/40 text-[#f6d16f]"
              >
                {lang === 'bn' ? 'English' : 'বাংলা'}
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-[#b83a2e]/20 border border-[#b83a2e] text-[#fca5a5] text-xs font-anek font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1.5">
                  {lang === 'bn' ? 'ইউজারনেম' : 'Admin Username'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#c69429] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-[#fbf8f1] focus:border-[#f6d16f] focus:outline-none"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1.5">
                  {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#c69429] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm font-mono text-[#fbf8f1] focus:border-[#f6d16f] focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c69429] hover:text-[#f6d16f]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] via-[#c69429] to-[#b83a2e] hover:opacity-95 text-[#fbf8f1] text-sm font-anek font-extrabold shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border border-[#f6d16f]/60"
              >
                <Shield className="w-4 h-4 text-[#f6d16f]" />
                <span>{lang === 'bn' ? 'অ্যাডমিন লগইন করুন' : 'Authenticate & Enter CMS'}</span>
              </button>
            </form>

            {/* Quick 1-Click Demo Login Button for Judges */}
            <div className="pt-2 border-t border-[#c69429]/30">
              <button
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-[#15453b] hover:bg-[#1b5e50] text-[#6ee7b7] border border-[#2a6f62] text-xs font-anek font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#f6d16f]" />
                <span>{lang === 'bn' ? '⚡ ১-ক্লিক ডেমো লগইন (পাসওয়ার্ড: admin)' : '⚡ Quick 1-Click Login (Pass: admin)'}</span>
              </button>
            </div>

            {/* Return to Public App Link */}
            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-anek font-bold text-[#c69429] hover:text-[#f6d16f] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ওয়েবসাইটে ফিরে যান (পাবলিক পেজ)' : 'Back to Public Route Planner'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD (FULL CMS CONTROL)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#120e0b] text-[#fbf8f1] selection:bg-[#f6d16f] selection:text-[#14100c] pb-20">
      {/* Feedback Toast Notification */}
      {feedbackMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl border-2 flex items-center gap-3 animate-bounce ${
          feedbackMsg.type === 'error'
            ? 'bg-[#b83a2e] text-white border-[#f87171]'
            : 'bg-[#15453b] text-[#6ee7b7] border-[#34d399]'
        }`}>
          {feedbackMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm font-anek font-bold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#16110d]/95 backdrop-blur-md border-b border-[#c69429]/40 shadow-xl px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#292019] border border-[#c69429]/40 text-[#f6d16f] hover:bg-[#3d3026] transition-all"
              title="Return to Main Portal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shadow-md flex items-center justify-center">
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <h1 className="font-rickshaw text-xl text-[#f6d16f] tracking-tight">
                  {lang === 'bn' ? 'ঢাকা-পাথ অ্যাডমিন কন্ট্রোল প্যানেল' : 'DhakaPath Transit Admin CMS'}
                </h1>
                <p className="text-[11px] font-mono text-[#6ee7b7]">
                  Part 1: Transit & Street-Status Management (CMS)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Super Admin Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#15453b]/50 border border-[#2a6f62] text-xs font-anek font-bold text-[#6ee7b7]">
              <span className="w-2 h-2 rounded-full bg-[#6ee7b7] animate-pulse" />
              <span>{lang === 'bn' ? 'সুপার অ্যাডমিন (লেভেল ৩ পারমিশন)' : 'Super Admin (Level 3)'}</span>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-xl bg-[#292019] border border-[#c69429]/40 text-xs font-anek font-bold text-[#f6d16f]"
            >
              {lang === 'bn' ? 'ENG' : 'বাং'}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b83a2e] hover:bg-[#96281e] text-white text-xs font-anek font-bold transition-all shadow-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Role & Permissions Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1a1410] via-[#241a13] to-[#1a1410] border border-[#c69429]/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#f6d16f]" />
              <h2 className="text-sm font-anek font-bold text-[#f6d16f] uppercase tracking-wider">
                {lang === 'bn' ? 'সক্রিয় অ্যাডমিন পারমিশন ও একসেস কন্ট্রোল' : 'Active Admin Permissions & Access Control'}
              </h2>
            </div>
            <p className="text-xs text-[#dfcfb2] font-anek">
              {lang === 'bn'
                ? 'এডমিন হিসেবে আপনি কোর রুট নেটওয়ার্ক আপডেট, সড়ক বিঘ্ন মডারেশন, বোর্ডিং ল্যান্ডমার্ক নোট এবং বিআরটিএ গেজেট ভাড়া পরিচালনা করতে পারেন।'
                : 'Admins manage the core route network and moderate reports, while commuters interact through visual interfaces.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-[#059669]/20 text-[#6ee7b7] border border-[#059669]/40">
              ✓ Route Network Admin
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#059669]/20 text-[#6ee7b7] border border-[#059669]/40">
              ✓ Incident Moderator
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#059669]/20 text-[#6ee7b7] border border-[#059669]/40">
              ✓ BRTA Fare Controller
            </span>
          </div>
        </div>

        {/* 4 CMS Core Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#c69429]/30">
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-anek text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border-2 border-[#f6d16f] shadow-lg'
                : 'bg-[#1a1410] text-[#dfcfb2] hover:bg-[#292019] border border-[#c69429]/30'
            }`}
          >
            <Bus className="w-4 h-4 text-[#f6d16f]" />
            <span>{lang === 'bn' ? '১. ট্রানজিট নেটওয়ার্ক রুট' : '1. Transit Network'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-[#f6d16f] text-[#14100c] font-black">
              {transitRoutes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-anek text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'alerts'
                ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border-2 border-[#f6d16f] shadow-lg'
                : 'bg-[#1a1410] text-[#dfcfb2] hover:bg-[#292019] border border-[#c69429]/30'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{lang === 'bn' ? '২. সড়ক বিঘ্ন ও মডারেশন' : '2. Street Alerts & Moderation'}</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-[#14100c] font-black">
              {alerts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('landmarks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-anek text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'landmarks'
                ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border-2 border-[#f6d16f] shadow-lg'
                : 'bg-[#1a1410] text-[#dfcfb2] hover:bg-[#292019] border border-[#c69429]/30'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#6ee7b7]" />
            <span>{lang === 'bn' ? '৩. বোর্ডিং ল্যান্ডমার্ক নোট' : '3. Boarding Landmarks'}</span>
          </button>

          <button
            onClick={() => setActiveTab('fares')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-anek text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'fares'
                ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border-2 border-[#f6d16f] shadow-lg'
                : 'bg-[#1a1410] text-[#dfcfb2] hover:bg-[#292019] border border-[#c69429]/30'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#e2b448]" />
            <span>{lang === 'bn' ? '৪. বিআরটিএ গেজেট ও ভাড়া চার্ট' : '4. Fare Charts & Surges'}</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: TRANSIT NETWORK MANAGEMENT (CORE ROUTE NETWORK)              */}
        {/* =================================================================== */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1410] p-4 rounded-2xl border border-[#c69429]/40">
              <div>
                <h3 className="font-anek text-lg font-bold text-[#f6d16f]">
                  {lang === 'bn' ? 'পাবলিক ট্রান্সপোর্ট লিংক ম্যানেজমেন্ট' : 'Public Transport Links Directory'}
                </h3>
                <p className="text-xs text-[#dfcfb2] font-anek">
                  {lang === 'bn'
                    ? 'বাস, মেট্রোরেল, লেগুনা এবং কানেক্টর রিকশা সেগমেন্টের রুট, ভাড়া ও হাফ-পাস যোগ্যতা পরিচালনা করুন।'
                    : 'Manage core public transport connections: local bus, MRT-6, leguna, and rickshaw links.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewRouteOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0e3b32] hover:from-[#1b5e50] hover:to-[#15453b] text-[#fbf8f1] border-2 border-[#2a6f62] text-xs font-anek font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#6ee7b7]" />
                <span>{lang === 'bn' ? 'নতুন ট্রানজিট লিংক যুক্ত করুন' : 'Add New Transit Route'}</span>
              </button>
            </div>

            {/* New Transit Route Modal */}
            {isNewRouteOpen && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1e1712] border-2 border-[#f6d16f] shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#c69429]/40">
                  <h4 className="font-anek text-base font-extrabold text-[#f6d16f] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#6ee7b7]" />
                    <span>{lang === 'bn' ? 'নতুন কোর ট্রানজিট রুট তৈরি' : 'Create Core Transit Connection'}</span>
                  </h4>
                  <button
                    onClick={() => setIsNewRouteOpen(false)}
                    className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateRoute} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'রুটের নাম (ইংরেজি)' : 'Route Name (EN)'}
                    </label>
                    <input
                      type="text"
                      value={newRoute.name}
                      onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                      placeholder="Mirpur Super Link"
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'রুটের নাম (বাংলা)' : 'Route Name (BN)'}
                    </label>
                    <input
                      type="text"
                      value={newRoute.name_bn}
                      onChange={(e) => setNewRoute({ ...newRoute, name_bn: e.target.value })}
                      placeholder="মিরপুর সুপার লিংক বাস"
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'পরিবহন মোড' : 'Transport Mode'}
                    </label>
                    <select
                      value={newRoute.mode}
                      onChange={(e) => setNewRoute({ ...newRoute, mode: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      <option value="bus">🚌 Bus (লোকাল সিটি বাস)</option>
                      <option value="metro">🚇 Metro (এমআরটি-৬ মেট্রোরেল)</option>
                      <option value="leguna">🚐 Leguna (লেগুনা হিউম্যান হলার)</option>
                      <option value="rickshaw">🛺 Rickshaw (কানেক্টর রিকশা)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'যাত্রার শুরু (Origin Hub)' : 'Origin Hub'}
                    </label>
                    <select
                      value={newRoute.origin_hub}
                      onChange={(e) => setNewRoute({ ...newRoute, origin_hub: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      {allHubNames.map(h => (
                        <option key={h} value={h}>{STATIC_HUBS[h]?.name_bn || h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'গন্তব্য (Destination Hub)' : 'Destination Hub'}
                    </label>
                    <select
                      value={newRoute.destination_hub}
                      onChange={(e) => setNewRoute({ ...newRoute, destination_hub: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      {allHubNames.map(h => (
                        <option key={h} value={h}>{STATIC_HUBS[h]?.name_bn || h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'দূরত্ব (কিলোমিটার)' : 'Distance (km)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRoute.distance_km}
                      onChange={(e) => setNewRoute({ ...newRoute, distance_km: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'আনুমানিক সময় (মিনিট)' : 'Estimated Duration (mins)'}
                    </label>
                    <input
                      type="number"
                      value={newRoute.duration_mins}
                      onChange={(e) => setNewRoute({ ...newRoute, duration_mins: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'বেস ভাড়া (টাকা)' : 'Base BDT Fare'}
                    </label>
                    <input
                      type="number"
                      value={newRoute.base_fare_bdt}
                      onChange={(e) => setNewRoute({ ...newRoute, base_fare_bdt: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'সর্বোচ্চ ভাড়া (টাকা)' : 'Max Fare (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={newRoute.max_fare_bdt}
                      onChange={(e) => setNewRoute({ ...newRoute, max_fare_bdt: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'বোর্ডিং ল্যান্ডমার্ক নির্দেশনা' : 'Boarding Landmark Notes'}
                    </label>
                    <input
                      type="text"
                      value={newRoute.landmarks}
                      onChange={(e) => setNewRoute({ ...newRoute, landmarks: e.target.value })}
                      placeholder="যেমন: মিরপুর ১০ গোলচত্বর ফায়ার সার্ভিস ➔ ফার্মগেট ফুটওভার"
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="student_pass"
                      checked={newRoute.student_pass_allowed}
                      onChange={(e) => setNewRoute({ ...newRoute, student_pass_allowed: e.target.checked })}
                      className="w-4 h-4 text-[#b83a2e] rounded"
                    />
                    <label htmlFor="student_pass" className="text-xs font-anek font-bold text-[#f6d16f] cursor-pointer">
                      {lang === 'bn' ? 'শিক্ষার্থী হাফ-পাস অনুমোদিত (৫০% ছাড়)' : 'Student Half-Pass Eligible'}
                    </label>
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewRouteOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#292019] text-[#dfcfb2] text-xs font-anek font-bold"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#c69429] text-white text-xs font-anek font-extrabold shadow-md cursor-pointer"
                    >
                      {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Transit Link'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Core Route List Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transitRoutes.map((route) => {
                const isBus = route.mode === 'bus';
                const isMetro = route.mode === 'metro';
                const isLeguna = route.mode === 'leguna';
                return (
                  <div
                    key={route.id}
                    className={`p-5 rounded-2xl border-2 transition-all shadow-md bg-[#1a1410] ${
                      route.is_active ? 'border-[#c69429]/40' : 'border-neutral-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#c69429]/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border font-bold ${
                            isMetro ? 'bg-emerald-950 text-emerald-400 border-emerald-700' :
                            isBus ? 'bg-sky-950 text-sky-400 border-sky-700' :
                            isLeguna ? 'bg-amber-950 text-amber-400 border-amber-700' :
                            'bg-red-950 text-red-400 border-red-700'
                          }`}>
                            {route.mode.toUpperCase()}
                          </span>
                          <span className="font-anek text-base font-extrabold text-[#f6d16f]">
                            {lang === 'bn' ? (route.name_bn || route.name) : route.name}
                          </span>
                        </div>
                        <div className="text-xs font-anek font-bold text-[#dfcfb2] mt-1 flex items-center gap-1.5">
                          <span>{STATIC_HUBS[route.origin_hub]?.name_bn || route.origin_hub}</span>
                          <span className="text-[#b83a2e]">➔</span>
                          <span>{STATIC_HUBS[route.destination_hub]?.name_bn || route.destination_hub}</span>
                        </div>
                      </div>

                      {/* Route Status Toggle & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleRouteStatus(route)}
                          className={`p-1.5 rounded-xl border text-xs font-anek font-bold transition-all ${
                            route.is_active 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-600 hover:bg-emerald-900' 
                              : 'bg-neutral-800 text-neutral-400 border-neutral-600 hover:bg-neutral-700'
                          }`}
                          title={route.is_active ? 'Active (Click to suspend)' : 'Suspended (Click to activate)'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="p-1.5 rounded-xl bg-red-950 text-red-400 border border-red-800 hover:bg-red-900 transition-all"
                          title="Delete Route"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Grid (Mode, Fare, Half-Pass, Time, Distance) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-center">
                      <div className="p-2 rounded-xl bg-[#14100c] border border-[#c69429]/20">
                        <div className="text-[10px] text-[#dfcfb2] uppercase font-mono">Distance</div>
                        <div className="text-xs font-extrabold text-[#6ee7b7]">{route.distance_km} km</div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#14100c] border border-[#c69429]/20">
                        <div className="text-[10px] text-[#dfcfb2] uppercase font-mono">Est. Time</div>
                        <div className="text-xs font-extrabold text-[#f6d16f]">{route.duration_mins} min</div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#14100c] border border-[#c69429]/20">
                        <div className="text-[10px] text-[#dfcfb2] uppercase font-mono">Fare (BDT)</div>
                        <div className="text-xs font-extrabold text-[#38bdf8]">{route.base_fare_bdt} - {route.max_fare_bdt} ৳</div>
                      </div>

                      <div className="p-2 rounded-xl bg-[#14100c] border border-[#c69429]/20">
                        <div className="text-[10px] text-[#dfcfb2] uppercase font-mono">Student Pass</div>
                        <div className={`text-[11px] font-bold ${route.student_pass_allowed ? 'text-emerald-400' : 'text-red-400'}`}>
                          {route.student_pass_allowed ? '✓ ৫০% ছাড়' : '✕ ছাড় নেই'}
                        </div>
                      </div>
                    </div>

                    {route.landmarks && (
                      <div className="mt-3 p-2.5 rounded-xl bg-[#14100c] border border-[#c69429]/20 text-[11px] font-anek text-[#dfcfb2] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#e2b448] shrink-0" />
                        <span className="truncate">{route.landmarks}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: STREET ALERTS & INCIDENT MODERATION                          */}
        {/* =================================================================== */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1a1410] p-4 rounded-2xl border border-[#c69429]/40">
              <div>
                <h3 className="font-anek text-lg font-bold text-[#f6d16f]">
                  {lang === 'bn' ? 'সড়ক বিঘ্ন রিপোর্ট ও অ্যাডমিন মডারেশন' : 'Street Incident Reports & Moderation'}
                </h3>
                <p className="text-xs text-[#dfcfb2] font-anek">
                  {lang === 'bn'
                    ? 'যাত্রীদের সাবমিট করা জলজট, রাস্তা সংস্কার ও ব্যারিকেড রিপোর্ট যাচাই ও অনুমোদন করুন।'
                    : 'Review, moderate, verify, or resolve commuter incident reports in real time.'}
                </p>
              </div>

              <button
                onClick={() => setIsNewAlertOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#96281e] hover:from-[#c84134] text-[#fbf8f1] border-2 border-[#f6d16f] text-xs font-anek font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                <AlertTriangle className="w-4 h-4 text-[#f6d16f]" />
                <span>{lang === 'bn' ? 'জরুরি ডিসরাপশন লাইভ করুন' : 'Broadcast Emergency Disruption'}</span>
              </button>
            </div>

            {/* Emergency Broadcast Modal */}
            {isNewAlertOpen && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1e1712] border-2 border-[#b83a2e] shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#b83a2e]/40">
                  <h4 className="font-anek text-base font-extrabold text-[#f6d16f] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>{lang === 'bn' ? 'অফিসিয়াল ট্রাফিক ডিসরাপশন ব্রডকাস্ট' : 'Broadcast Official Street Disruption'}</span>
                  </h4>
                  <button
                    onClick={() => setIsNewAlertOpen(false)}
                    className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleBroadcastOfficialAlert} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'ঘটনার ধরণ (Incident Type)' : 'Incident Type'}
                    </label>
                    <select
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      <option value="waterlogging">🌧️ Waterlogging (ভারী জলজট)</option>
                      <option value="construction">🚧 Road Construction (রাস্তা সংস্কার)</option>
                      <option value="traffic_jam">🚗 Severe Gridlock (তীব্র যানজট)</option>
                      <option value="blockade">⛔ Intersection Blockade (ব্যারিকেড / অবরোধ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'টার্গেট হাব / মোড়' : 'Affected Hub'}
                    </label>
                    <select
                      value={newAlert.hub}
                      onChange={(e) => setNewAlert({ ...newAlert, hub: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      {allHubNames.map(h => (
                        <option key={h} value={h}>{STATIC_HUBS[h]?.name_bn || h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'তীব্রতা (Severity)' : 'Severity Level'}
                    </label>
                    <select
                      value={newAlert.severity}
                      onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    >
                      <option value="critical">🔴 Critical (চলাচল সম্পূর্ণ বন্ধ)</option>
                      <option value="severe">🟠 Severe (চরম বিঘ্ন ও ধীরগতি)</option>
                      <option value="moderate">🟡 Moderate (মাঝারি যানজট)</option>
                      <option value="minor">🟢 Minor (সামান্য বিলম্ব)</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'সতর্কতার শিরোনাম' : 'Alert Headline'}
                    </label>
                    <input
                      type="text"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value, title_bn: e.target.value })}
                      placeholder="যেমন: শান্তিনগর মোড়ে হাঁটুপানি, বিকল্প রুট ব্যবহারের পরামর্শ"
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                      {lang === 'bn' ? 'বিস্তারিত বিবরণ ও ট্রাফিক গাইডলাইন' : 'Detailed Traffic Advisory'}
                    </label>
                    <textarea
                      rows={2}
                      value={newAlert.description}
                      onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value, description_bn: e.target.value })}
                      placeholder="বৃষ্টির কারণে ড্রেনেজ আটকে প্রধান সড়কে পানি উঠেছে। ছোট যানবাহন চলাচল বন্ধ..."
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-anek text-white"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewAlertOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#292019] text-[#dfcfb2] text-xs font-anek font-bold"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-white text-xs font-anek font-extrabold shadow-md cursor-pointer"
                    >
                      {lang === 'bn' ? '🚨 ব্রডকাস্ট করুন' : '🚨 Broadcast Live'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Alerts Moderation Queue */}
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl bg-[#1a1410] border-2 transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    alert.is_active ? 'border-[#c69429]/40' : 'border-neutral-700 opacity-50'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border font-bold ${
                        alert.severity === 'critical' ? 'bg-red-950 text-red-400 border-red-700' :
                        alert.severity === 'severe' ? 'bg-amber-950 text-amber-400 border-amber-700' :
                        'bg-blue-950 text-blue-400 border-blue-700'
                      }`}>
                        {alert.severity ? alert.severity.toUpperCase() : 'ALERT'}
                      </span>
                      <span className="text-xs font-anek font-extrabold text-[#f6d16f]">
                        📍 {STATIC_HUBS[alert.hub]?.name_bn || alert.hub}
                      </span>
                      {alert.verified ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700">
                          Pending Moderation
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[#dfcfb2]">
                        Trust: {alert.trust_score}% | 👍 {alert.upvotes} | 👎 {alert.downvotes}
                      </span>
                    </div>

                    <h4 className="font-anek text-sm font-bold text-white">
                      {lang === 'bn' ? (alert.title_bn || alert.title) : alert.title}
                    </h4>
                    {alert.description && (
                      <p className="font-anek text-xs text-[#dfcfb2]">
                        {lang === 'bn' ? (alert.description_bn || alert.description) : alert.description}
                      </p>
                    )}
                  </div>

                  {/* Moderation Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!alert.verified && (
                      <button
                        onClick={() => handleApproveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-700 text-xs font-anek font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Approve Report"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                      </button>
                    )}

                    {alert.is_active && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#15453b] hover:bg-[#1b5e50] text-[#6ee7b7] border border-[#2a6f62] text-xs font-anek font-bold transition-all flex items-center gap-1 cursor-pointer"
                        title="Mark Resolved"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'সমাধান' : 'Resolve'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-xs transition-all cursor-pointer"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: BOARDING LANDMARK NOTES MANAGEMENT                           */}
        {/* =================================================================== */}
        {activeTab === 'landmarks' && (
          <div className="space-y-6">
            <div className="bg-[#1a1410] p-4 rounded-2xl border border-[#c69429]/40">
              <h3 className="font-anek text-lg font-bold text-[#f6d16f]">
                {lang === 'bn' ? 'বোর্ডিং ল্যান্ডমার্ক ও কনকোর্স গাইডলাইন' : 'Hub Boarding Landmarks & Concourse Guide'}
              </h3>
              <p className="text-xs text-[#dfcfb2] font-anek">
                {lang === 'bn'
                  ? 'যাত্রীদের সুবিধার্থে প্রধান হাব ও মেট্রো স্টেশনের বোর্ডিং ল্যান্ডমার্ক নোট আপডেট করুন।'
                  : 'Maintain landmark notes and concourse/platform directions across major hubs.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hub Selector */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 bg-[#1a1410] p-4 rounded-2xl border border-[#c69429]/30">
                <div className="text-xs font-mono font-bold text-[#dfcfb2] uppercase mb-2">
                  Select Hub / Station
                </div>
                {allHubNames.map((hub) => {
                  const hubData = STATIC_HUBS[hub];
                  const isSelected = selectedHub === hub;
                  return (
                    <button
                      key={hub}
                      onClick={() => {
                        setSelectedHub(hub);
                        setHubLandmarkText(hubData.landmarks ? hubData.landmarks.join(', ') : '');
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-anek font-bold transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#b83a2e] text-white border border-[#f6d16f] shadow-md' 
                          : 'bg-[#14100c] text-[#dfcfb2] hover:bg-[#292019]'
                      }`}
                    >
                      <span>{hubData.name_bn || hub}</span>
                      {hubData.is_metro_station && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400">MRT</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Landmark Editor Form */}
              <div className="md:col-span-2 p-6 rounded-2xl bg-[#1a1410] border border-[#c69429]/40 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#c69429]/30">
                  <MapPin className="w-5 h-5 text-[#f6d16f]" />
                  <h4 className="font-anek text-lg font-bold text-[#f6d16f]">
                    {STATIC_HUBS[selectedHub]?.name_bn || selectedHub}
                  </h4>
                </div>

                <div className="space-y-3 text-xs font-anek">
                  <div>
                    <span className="text-[#dfcfb2] font-bold">Zone / Corridor: </span>
                    <span className="text-white">{STATIC_HUBS[selectedHub]?.zone || 'Dhaka Metropolitan Corridor'}</span>
                  </div>
                  <div>
                    <span className="text-[#dfcfb2] font-bold">Coordinates: </span>
                    <span className="text-[#6ee7b7] font-mono">{STATIC_HUBS[selectedHub]?.lat}, {STATIC_HUBS[selectedHub]?.lng}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#dfcfb2] mb-1.5">
                      {lang === 'bn' ? 'বোর্ডিং ল্যান্ডমার্ক তালিকা (কমা দিয়ে লিখুন):' : 'Landmark Notes (Comma separated):'}
                    </label>
                    <textarea
                      rows={4}
                      value={hubLandmarkText || (STATIC_HUBS[selectedHub]?.landmarks?.join(', ') || '')}
                      onChange={(e) => setHubLandmarkText(e.target.value)}
                      className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl p-3 text-xs font-anek text-white focus:border-[#f6d16f] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (STATIC_HUBS[selectedHub]) {
                        STATIC_HUBS[selectedHub].landmarks = hubLandmarkText.split(',').map(s => s.trim()).filter(Boolean);
                        showNotification(lang === 'bn' ? 'বোর্ডিং ল্যান্ডমার্ক সফলভাবে আপডেট করা হয়েছে!' : 'Boarding landmarks updated successfully!');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#15453b] hover:bg-[#1b5e50] text-[#6ee7b7] border border-[#2a6f62] font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ল্যান্ডমার্ক সংরক্ষণ করুন' : 'Save Landmark Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: FARE CHARTS & SURGE SETTINGS (BRTA GAZETTE)                  */}
        {/* =================================================================== */}
        {activeTab === 'fares' && (
          <div className="space-y-6">
            <div className="bg-[#1a1410] p-4 rounded-2xl border border-[#c69429]/40">
              <h3 className="font-anek text-lg font-bold text-[#f6d16f]">
                {lang === 'bn' ? 'বিআরটিএ অফিসিয়াল গেজেট ও ভাড়া নীতিমালা' : 'BRTA Gazette Fare Rules & Surge Controls'}
              </h3>
              <p className="text-xs text-[#dfcfb2] font-anek">
                {lang === 'bn'
                  ? 'সিটি বাস, ছাত্র হাফ-পাস, মিটারযুক্ত সিএনজি এবং রিকশার আবহাওয়া ও রাশ-আওয়ার সার্জনীতি।'
                  : 'Configure statutory fare policies, student half-pass discounts, and weather surges.'}
              </p>
            </div>

            <form onSubmit={handleSaveFareSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bus Fare Rules */}
              <div className="p-5 rounded-2xl bg-[#1a1410] border border-[#c69429]/40 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#c69429]/30">
                  <Bus className="w-4 h-4 text-[#38bdf8]" />
                  <h4 className="font-anek text-sm font-bold text-[#38bdf8]">
                    {lang === 'bn' ? 'লোকাল সিটি বাস ভাড়া নীতিমালা' : 'City Bus Fare Rules'}
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'প্রতি কিমি রেট (টাকা / কিমি)' : 'Per Km Rate (BDT/km)'}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={fareSettings.bus_rate_per_km}
                    onChange={(e) => setFareSettings({ ...fareSettings, bus_rate_per_km: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'আইনত সর্বনিম্ন ভাড়া ফ্লোর (টাকা)' : 'Statutory Minimum Floor (BDT)'}
                  </label>
                  <input
                    type="number"
                    value={fareSettings.bus_min_floor_bdt}
                    onChange={(e) => setFareSettings({ ...fareSettings, bus_min_floor_bdt: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'শিক্ষার্থী হাফ-পাস ছাড় (%)' : 'Student Half-Pass Concession (%)'}
                  </label>
                  <input
                    type="number"
                    value={fareSettings.student_discount_percentage}
                    onChange={(e) => setFareSettings({ ...fareSettings, student_discount_percentage: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* CNG & Rickshaw Surges */}
              <div className="p-5 rounded-2xl bg-[#1a1410] border border-[#c69429]/40 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#c69429]/30">
                  <Compass className="w-4 h-4 text-[#e2b448]" />
                  <h4 className="font-anek text-sm font-bold text-[#e2b448]">
                    {lang === 'bn' ? 'সিএনজি ও রিকশা সার্জনীতি' : 'CNG & Rickshaw Surge Settings'}
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'সিএনজি বেস ভাড়া (প্রথম ২ কিমি)' : 'CNG Base Meter Fare (First 2km)'}
                  </label>
                  <input
                    type="number"
                    value={fareSettings.cng_base_fare}
                    onChange={(e) => setFareSettings({ ...fareSettings, cng_base_fare: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'রিকশায় বৃষ্টি ও জলজট সার্জ (%)' : 'Rickshaw Rain/Waterlogging Surge (%)'}
                  </label>
                  <input
                    type="number"
                    value={fareSettings.rickshaw_rain_surge_percent}
                    onChange={(e) => setFareSettings({ ...fareSettings, rickshaw_rain_surge_percent: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-anek font-bold text-[#dfcfb2] mb-1">
                    {lang === 'bn' ? 'রিকশায় পিক-আওয়ার ট্রাফিক সার্জ (%)' : 'Rickshaw Rush Hour Traffic Surge (%)'}
                  </label>
                  <input
                    type="number"
                    value={fareSettings.rickshaw_rush_surge_percent}
                    onChange={(e) => setFareSettings({ ...fareSettings, rickshaw_rush_surge_percent: Number(e.target.value) })}
                    className="w-full bg-[#120e0b] border border-[#c69429]/40 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#c69429] text-white font-anek font-extrabold text-xs shadow-lg transition-all active:scale-[0.99] flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#f6d16f]" />
                  <span>{lang === 'bn' ? 'গেজেট ও ভাড়া নীতিমালা সংরক্ষণ করুন' : 'Apply & Save Fare Policies'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
