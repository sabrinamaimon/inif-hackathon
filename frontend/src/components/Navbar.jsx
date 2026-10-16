'use client';

import React from 'react';
import { Menu, Navigation, AlertTriangle, Cpu, Users, Bus, Globe, Sparkles, Sun, Moon, Download, Map } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  theme = 'dark',
  setTheme,
  setIsDrawerOpen, 
  activeAlertCount = 3,
  onDownloadPostcard
}) {
  const t = I18N[lang] || I18N.bn;

  const navLinks = [
    { id: 'home', label: lang === 'bn' ? 'রুট প্ল্যানার' : 'Route Planner', icon: Navigation },
    { id: 'alerts', label: lang === 'bn' ? 'সড়ক বিঘ্ন' : 'Street Alerts', icon: AlertTriangle, badge: activeAlertCount },
    { id: 'simulator', label: lang === 'bn' ? 'ম্যাপ ও সিমুলেটর' : 'Map & Simulator', icon: Map },
    { id: 'cms', label: lang === 'bn' ? 'বাস রুট ডিরেক্টরি' : 'Bus Directory', icon: Bus, badge: 183 },
    { id: 'rideshare', label: lang === 'bn' ? 'রাইড শেয়ার' : 'Ride Share', icon: Users },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#16110d]/95 backdrop-blur-md border-b border-[#c69429]/40 shadow-xl overflow-x-hidden">
      {/* ================= DESKTOP HEADER (>=1024px) ================= */}
      <div className="hidden lg:flex items-center justify-between gap-3 px-3 sm:px-5 lg:px-6 xl:px-8 py-2.5 w-full max-w-[1920px] mx-auto">
        {/* Clean, High-End Brand Logo - Enlarged & Impactful */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[10px] bg-[#1a1410] flex items-center justify-center border border-[#f6d16f]/60">
              <span className="text-2xl">🛺</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-rickshaw text-3xl text-[#f6d16f] rickshaw-text-pop tracking-normal">
              {lang === 'bn' ? 'ঢাকা-পাথ' : 'DhakaPath'}
            </span>
            <span className="font-regal text-sm text-[#dfcfb2] tracking-[0.22em] font-extrabold uppercase">
              TRANSIT
            </span>
          </div>
        </div>

        {/* Clean, Compact Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#1e1712]/90 p-1 rounded-xl border border-[#c69429]/30 shadow-inner shrink">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-[13px] font-anek font-bold transition-all duration-200 relative whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border border-[#f6d16f] shadow-md' 
                    : 'text-[#dfcfb2] hover:text-[#fbf8f1] hover:bg-[#2a2019]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#f6d16f]' : 'text-[#c69429]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black rounded-full bg-[#f6d16f] text-[#14100c]">
                    {lang === 'bn' ? toBnDigits(tab.badge) : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Postcard Download + Shapla Badge + Theme Toggle + Language Switcher (shrink-0 to prevent clipping) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Commute Card Download Button (only on very wide screens to prevent overflow) */}
          {onDownloadPostcard && (
            <button
              onClick={onDownloadPostcard}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0e3b32] hover:from-[#1b5e50] hover:to-[#15453b] text-[#fbf8f1] text-xs font-anek font-bold border-2 border-[#2a6f62] transition-all active:scale-95 shadow-md group cursor-pointer shrink-0"
              title={lang === 'bn' ? 'কমিউট কার্ড ডাউনলোড করুন' : 'Download Commute Card'}
            >
              <Download className="w-3.5 h-3.5 text-[#6ee7b7] group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">
                {lang === 'bn' ? 'কমিউট কার্ড' : 'Commute Card'}
              </span>
            </button>
          )}

          {/* Shapla Chattar Enamel Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#15453b]/40 border border-[#2a6f62] text-xs text-[#f6d16f] font-anek font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#f6d16f] animate-pulse" />
            <span>{lang === 'bn' ? '১৬টি হাব সচল' : '16 Hubs Active'}</span>
          </div>

          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-anek font-bold transition-all active:scale-95 shadow-sm shrink-0 ${
              theme === 'light'
                ? 'bg-[#ffffff] hover:bg-[#fcf9f2] text-[#140e0b] border-2 border-[#c69429]/40 shadow-sm'
                : 'bg-[#2a2019] hover:bg-[#3d3026] text-[#f6d16f] border border-[#c69429]/50 shadow-md'
            }`}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'লাইট' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="hidden sm:inline text-[#140e0b] font-extrabold">{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Language Switcher (Never Clips) */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-anek font-bold transition-all active:scale-95 shadow-sm shrink-0 whitespace-nowrap ${
              theme === 'light'
                ? 'bg-[#ffffff] hover:bg-[#fcf9f2] text-[#140e0b] border-2 border-[#c69429]/40 shadow-sm'
                : 'bg-[#2a2019] hover:bg-[#3d3026] text-[#f6d16f] border border-[#c69429]/50 shadow-md'
            }`}
            title="Toggle Language"
          >
            <Globe className={`w-3.5 h-3.5 shrink-0 ${theme === 'light' ? 'text-[#b83a2e]' : 'text-[#f6d16f]'}`} />
            <span className={theme === 'light' ? 'text-[#140e0b] font-extrabold' : ''}>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE / TABLET HEADER (<1024px) ================= */}
      <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#17120e]">
        <button
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open Mobile Menu"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#292019] border border-[#c69429]/50 text-[#f6d16f] active:scale-95 transition-all shadow-md"
        >
          <Menu className="w-5 h-5 text-[#f6d16f]" strokeWidth={2.4} />
        </button>

        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentTab('home')}
        >
          <span className="text-xl">🛺</span>
          <span className="font-rickshaw text-xl text-[#f6d16f] rickshaw-gold-pop">{t.brandName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile Commute Card Download Button */}
          <button
            onClick={onDownloadPostcard}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#15453b] border border-[#2a6f62] text-[#6ee7b7] active:scale-95 transition-all shadow-md"
            title={lang === 'bn' ? 'কমিউট কার্ড ডাউনলোড' : 'Download Commute Card'}
            aria-label="Download Commute Card"
          >
            <Download className="w-4 h-4 text-[#6ee7b7]" />
          </button>

          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center justify-center w-8 h-8 rounded-full active:scale-95 transition-all ${
              theme === 'light'
                ? 'bg-[#ffffff] border border-[#c69429]/40 text-[#140e0b] shadow-sm'
                : 'bg-[#292019] border border-[#c69429]/50 text-[#f6d16f]'
            }`}
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-anek font-bold active:scale-95 transition-all ${
              theme === 'light'
                ? 'bg-[#ffffff] border border-[#c69429]/40 text-[#140e0b] shadow-sm'
                : 'bg-[#292019] border border-[#c69429]/50 text-[#f6d16f]'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-[#b83a2e]' : 'text-[#f6d16f]'}`} />
            <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
