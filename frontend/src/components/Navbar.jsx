'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Navigation, AlertTriangle, Users, Bus, Globe, Sun, Moon, Download, Map, Shield } from 'lucide-react';
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
    { 
      id: 'home', 
      label: lang === 'bn' ? 'রুট প্ল্যানার' : 'Route Planner', 
      shortLabel: lang === 'bn' ? 'প্ল্যানার' : 'Planner', 
      icon: Navigation 
    },
    { 
      id: 'alerts', 
      label: lang === 'bn' ? 'সড়ক বিঘ্ন' : 'Street Alerts', 
      shortLabel: lang === 'bn' ? 'বিঘ্ন' : 'Alerts', 
      icon: AlertTriangle, 
      badge: activeAlertCount 
    },
    { 
      id: 'simulator', 
      label: lang === 'bn' ? 'ম্যাপ ও সিমুলেটর' : 'Map & Simulator', 
      shortLabel: lang === 'bn' ? 'সিমুলেটর' : 'Simulator', 
      icon: Map 
    },
    { 
      id: 'cms', 
      label: lang === 'bn' ? 'বাস ডিরেক্টরি' : 'Bus Directory', 
      shortLabel: lang === 'bn' ? 'ডিরেক্টরি' : 'Directory', 
      icon: Bus,
      badge: 183
    },
    { 
      id: 'rideshare', 
      label: lang === 'bn' ? 'রাইড শেয়ার' : 'Ride Share', 
      shortLabel: lang === 'bn' ? 'রাইড' : 'Rides', 
      icon: Users 
    },
  ];

  return (
    <header className={`w-full sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
        : 'bg-[#16110d]/95 border-b border-[#c69429]/40 text-[#dfcfb2] shadow-xl'
    }`}>
      {/* ================= DESKTOP HEADER (>=1024px) ================= */}
      <div className="hidden lg:flex items-center justify-between gap-2 xl:gap-3 px-2 sm:px-4 lg:px-4 xl:px-6 2xl:px-8 py-2.5 w-full max-w-[1920px] mx-auto">
        {/* Authentic Rickshaw Art Brand Logo */}
        <div 
          className="flex items-center gap-2 xl:gap-2.5 cursor-pointer select-none group shrink-0"
          onClick={() => setCurrentTab('home')}
        >
          {/* Rickshaw Art Painted Plate Icon */}
          <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-gradient-to-tr from-[#b83a2e] via-[#e2b448] to-[#15453b] p-0.5 shadow-lg group-hover:scale-105 transition-all duration-300 shrink-0">
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#1a1410] border border-[#f6d16f]/80 flex items-center justify-center">
              <img 
                src="/assets/dhakar_poth_logo.jpg" 
                alt={lang === 'bn' ? 'ঢাকার পথ' : 'DhakaPath'} 
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 xl:gap-2">
            <span className="font-rickshaw text-3xl sm:text-[34px] xl:text-[38px] rickshaw-brand-typography tracking-normal whitespace-nowrap">
              {lang === 'bn' ? 'ঢাকার পথ' : 'DhakaPath'}
            </span>
            <span className="hidden 2xl:inline font-regal text-xs text-[#dfcfb2] tracking-[0.22em] font-extrabold uppercase">
              {lang === 'bn' ? 'ট্রানজিট' : 'TRANSIT'}
            </span>
          </div>
        </div>

        {/* Clean, Compact Navigation Tabs */}
        <nav className={`flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl shadow-inner shrink-0 ${
          theme === 'light' ? 'bg-slate-100 border border-slate-200' : 'bg-[#1e1712]/90 border border-[#c69429]/30'
        }`}>
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1 xl:gap-1.5 px-2 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-anek font-bold transition-all duration-200 relative whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border border-[#f6d16f] shadow-md' 
                    : (theme === 'light' 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' 
                        : 'text-[#dfcfb2] hover:text-[#fbf8f1] hover:bg-[#2a2019]')
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-[#f6d16f]' : (theme === 'light' ? 'text-slate-500' : 'text-[#c69429]')
                }`} />
                <span className="hidden xl:inline">{tab.label}</span>
                <span className="inline xl:hidden">{tab.shortLabel || tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-0.5 xl:ml-1 px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                    theme === 'light' ? 'bg-[#b83a2e] text-white' : 'bg-[#f6d16f] text-[#140e0b]'
                  }`}>
                    {lang === 'bn' ? toBnDigits(tab.badge) : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Postcard Download + Shapla Badge + Theme Toggle + Language Switcher (shrink-0 to prevent clipping) */}
        <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
          {/* Commute Card Download Button */}
          {onDownloadPostcard && (
            <button
              type="button"
              onClick={onDownloadPostcard}
              className="hidden xl:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0e3b32] hover:from-[#1b5e50] hover:to-[#15453b] text-[#fbf8f1] text-xs font-anek font-bold border-2 border-[#2a6f62] transition-all active:scale-95 shadow-md group cursor-pointer shrink-0"
              title={lang === 'bn' ? 'কমিউট কার্ড ডাউনলোড করুন' : 'Download Commute Card'}
            >
              <Download className="w-3.5 h-3.5 text-[#6ee7b7] group-hover:scale-110 transition-transform shrink-0" />
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

          {/* Explicit Theme Segmented Control: [ ☀️ লাইট | 🌙 ডার্ক ] */}
          <div className={`flex items-center p-0.5 rounded-xl border text-xs font-anek font-bold transition-all shadow-sm shrink-0 ${
            theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#1e1712] border-[#c69429]/40'
          }`}>
            <button
              type="button"
              onClick={() => setTheme && setTheme('light')}
              className={`flex items-center gap-1 px-2 xl:px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-[#dfcfb2] hover:text-white hover:bg-[#2a2019]'
              }`}
              title={lang === 'bn' ? 'লাইট মোড সক্রিয় করুন' : 'Switch to Light Mode'}
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{lang === 'bn' ? 'লাইট' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme && setTheme('dark')}
              className={`flex items-center gap-1 px-2 xl:px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#b83a2e] text-[#fbf8f1] font-black border border-[#f6d16f] shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
              }`}
              title={lang === 'bn' ? 'ডার্ক মোড সক্রিয় করুন' : 'Switch to Dark Mode'}
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#f6d16f]' : 'text-slate-600'}`} />
              <span className="hidden sm:inline">{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
            </button>
          </div>

          {/* Explicit Language Segmented Control: [ বাং | ENG ] */}
          <div className={`flex items-center p-0.5 rounded-xl border text-xs font-anek font-bold transition-all shadow-sm shrink-0 ${
            theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#1e1712] border-[#c69429]/40'
          }`}>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-2 xl:px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer ${
                lang === 'bn'
                  ? (theme === 'light' 
                      ? 'bg-[#b83a2e] text-white font-black shadow-sm' 
                      : 'bg-[#b83a2e] text-[#fbf8f1] font-black border border-[#f6d16f] shadow-sm')
                  : (theme === 'light' 
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200' 
                      : 'text-[#dfcfb2] hover:text-white hover:bg-[#2a2019]')
              }`}
              title="বাংলা ভাষায় ব্যবহার করুন"
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 xl:px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer ${
                lang === 'en'
                  ? (theme === 'light' 
                      ? 'bg-[#15453b] text-white font-black shadow-sm' 
                      : 'bg-[#15453b] text-[#fbf8f1] font-black border border-[#34d399] shadow-sm')
                  : (theme === 'light' 
                      ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-200' 
                      : 'text-[#dfcfb2] hover:text-white hover:bg-[#2a2019]')
              }`}
              title="Switch to English"
            >
              ENG
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET HEADER (<1024px) ================= */}
      <div className={`lg:hidden flex items-center justify-between px-3 sm:px-4 py-2.5 transition-colors ${
        theme === 'light' ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-[#17120e]'
      }`}>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Open Mobile Menu"
          className={`w-9 h-9 flex items-center justify-center rounded-xl border active:scale-95 transition-all shadow-md cursor-pointer ${
            theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#292019] border-[#c69429]/50 text-[#f6d16f]'
          }`}
        >
          <Menu className="w-5 h-5" strokeWidth={2.4} />
        </button>

        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#f6d16f]/80 shrink-0 shadow-md">
            <img 
              src="/assets/dhakar_poth_logo.jpg" 
              alt={t.brandName} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <span className="font-rickshaw text-2xl rickshaw-brand-typography">{t.brandName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile Admin Link */}
          <Link
            href="/admin"
            className={`flex items-center justify-center w-8 h-8 rounded-lg border active:scale-95 transition-all shadow-sm ${
              theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#292019] border-[#c69429]/60 text-[#f6d16f]'
            }`}
            title="Admin CMS"
            aria-label="Admin CMS"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile Theme Segmented Toggle */}
          <div className={`flex items-center p-0.5 rounded-lg border text-xs font-anek font-bold ${
            theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#1e1712] border-[#c69429]/40'
          }`}>
            <button
              type="button"
              onClick={() => setTheme && setTheme('light')}
              className={`p-1 rounded-md transition-all active:scale-95 cursor-pointer ${
                theme === 'light' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-[#dfcfb2]'
              }`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme && setTheme('dark')}
              className={`p-1 rounded-md transition-all active:scale-95 cursor-pointer ${
                theme === 'dark' ? 'bg-[#b83a2e] text-[#fbf8f1] shadow-sm' : 'text-slate-600'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Language Segmented Toggle */}
          <div className={`flex items-center p-0.5 rounded-lg border text-xs font-anek font-bold ${
            theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#1e1712] border-[#c69429]/40'
          }`}>
            <button
              type="button"
              onClick={() => setLang('bn')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                lang === 'bn'
                  ? (theme === 'light' ? 'bg-[#b83a2e] text-white font-black' : 'bg-[#b83a2e] text-[#fbf8f1] font-black')
                  : (theme === 'light' ? 'text-slate-600' : 'text-[#dfcfb2]')
              }`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                lang === 'en'
                  ? (theme === 'light' ? 'bg-[#15453b] text-white font-black' : 'bg-[#15453b] text-[#fbf8f1] font-black')
                  : (theme === 'light' ? 'text-slate-600' : 'text-[#dfcfb2]')
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
