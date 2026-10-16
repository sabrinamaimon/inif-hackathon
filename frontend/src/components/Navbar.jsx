'use client';

import React from 'react';
import { Menu, Navigation, AlertTriangle, Cpu, Users, Bus, Globe, MapPin, Sun, Moon } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  theme,
  setTheme,
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="w-full sticky top-0 z-50 glass-panel" style={{ borderRadius: '0 0 24px 24px', borderTop: 'none' }}>
      {/* ================= DESKTOP HEADER (>768px) ================= */}
      <div className="hidden md:flex items-center justify-between px-6 sm:px-10 py-4 max-w-[1700px] mx-auto w-full">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer select-none"
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Navigation className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black tracking-tight text-white">{t.brandName}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/40">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{t.tagline}</p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md shadow-emerald-600/30 font-extrabold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                    {lang === 'bn' ? toBnDigits(tab.badge) : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Location, Theme & Language Switchers */}
        <div className="flex items-center gap-3">
          {/* Live City Status Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.cityStatus}</span>
          </div>

          {/* Theme Switcher Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:border-emerald-500"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">{lang === 'bn' ? 'লাইট মোড' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span className="hidden lg:inline">{lang === 'bn' ? 'ডার্ক মোড' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Language Switcher Button (বাংলা / English) */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:border-emerald-500"
            title="Toggle Language"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE HEADER (<768px) ================= */}
      <div className="md:hidden flex flex-col px-4 py-3 gap-2.5">
        {/* Row 1: Left Menu Button, Center Brand, Right Theme + Language Pills */}
        <div className="flex items-center justify-between w-full">
          {/* Top-LEFT: 3-line hamburger menu button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Mobile Menu"
            style={{ width: '42px', height: '42px' }}
            className="flex items-center justify-center rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 active:scale-95 transition-all shadow-sm"
          >
            <Menu className="w-6 h-6 text-emerald-400" strokeWidth={2.4} />
          </button>

          {/* Brand in CENTER */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">{t.brandName}</span>
          </div>

          {/* Top-RIGHT: Theme & Language Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 active:scale-95 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-emerald-500/40 text-slate-200 text-xs font-bold active:scale-95 transition-all"
            >
              <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Location & Status pill spanning full width */}
        <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.liveCityStatus}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.cityStatus}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
