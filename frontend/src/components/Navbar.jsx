'use client';

import React from 'react';
import { Menu, Navigation, AlertTriangle, Cpu, Users, Bus, Globe, MapPin, Activity } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  setIsDrawerOpen, 
  activeAlertCount = 3 
}) {
  const t = I18N[lang] || I18N.bn;

  const navLinks = [
    { id: 'home', label: t.tabHome, icon: Navigation },
    { id: 'alerts', label: t.tabAlerts, icon: AlertTriangle, badge: activeAlertCount },
    { id: 'simulator', label: t.tabSimulator, icon: Cpu },
    { id: 'cms', label: t.tabCMS, icon: Bus },
    { id: 'rideshare', label: t.tabRideShare, icon: Users },
  ];

  return (
    <header className="w-full sticky top-0 z-50 glass-panel" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
      {/* ================= DESKTOP HEADER (>768px) ================= */}
      <div className="hidden md:flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Navigation className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">{t.brandName}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.tagline}</p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {lang === 'bn' ? toBnDigits(tab.badge) : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Location & Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.cityStatus}</span>
          </div>

          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:border-emerald-500"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE HEADER (<768px) ================= */}
      {/* 2-row layout per specifications */}
      <div className="md:hidden flex flex-col px-4 py-2.5 gap-2">
        {/* Row 1: Left Menu Button (38x38px, emerald tint, strokeWidth 2.4), Center Brand, Right Language Pill */}
        <div className="flex items-center justify-between w-full">
          {/* Top-LEFT: 3-line hamburger menu button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Mobile Menu"
            style={{ width: '38px', height: '38px' }}
            className="flex items-center justify-center rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 active:scale-95 transition-all shadow-sm shadow-emerald-500/20"
          >
            <Menu className="w-5 h-5 text-emerald-400" strokeWidth={2.4} />
          </button>

          {/* Brand in CENTER */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight">{t.brandName}</span>
          </div>

          {/* Top-RIGHT: Language Switcher pill */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 border border-emerald-500/40 text-slate-200 text-xs font-bold active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
          </button>
        </div>

        {/* Row 2: Location & Status pill spanning full width */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{t.liveCityStatus}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{t.cityStatus}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
