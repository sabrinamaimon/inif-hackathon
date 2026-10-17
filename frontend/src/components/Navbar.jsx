'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Navigation, AlertTriangle, Users, Bus, Sun, Moon, Download, Map } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang = 'bn', 
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
    <header className={`w-full sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 select-none ${
      theme === 'light'
        ? 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
        : 'bg-[#16110d]/95 border-b border-[#c69429]/40 text-[#dfcfb2] shadow-xl'
    }`}>
      {/* ================= DESKTOP HEADER (>=1024px) ================= */}
      <div className="hidden lg:flex items-center justify-between gap-2 xl:gap-3 px-3 sm:px-4 lg:px-5 xl:px-8 py-2 w-full max-w-[1920px] mx-auto">
        {/* Authentic Rickshaw Art Brand Logo */}
        <div 
          className="flex items-center gap-2 xl:gap-2.5 cursor-pointer select-none group shrink-0"
          onClick={() => setCurrentTab('home')}
        >
          {/* Rickshaw Art Painted Plate Icon */}
          <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-tr from-[#b83a2e] via-[#e2b448] to-[#15453b] p-0.5 shadow-md group-hover:scale-105 transition-all duration-300 shrink-0">
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#1a1410] border border-[#f6d16f]/80 flex items-center justify-center">
              <img 
                src="/assets/dhakar_poth_logo.jpg" 
                alt={lang === 'bn' ? 'ঢাকার পথ' : 'DhakaPath'} 
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-rickshaw text-2xl xl:text-3xl rickshaw-brand-typography tracking-normal whitespace-nowrap">
              {lang === 'bn' ? 'ঢাকার পথ' : 'DhakaPath'}
            </span>
            <span className="hidden 2xl:inline font-regal text-[10px] text-[#dfcfb2] tracking-[0.2em] font-extrabold uppercase">
              {lang === 'bn' ? 'ট্রানজিট' : 'TRANSIT'}
            </span>
          </div>
        </div>

        {/* Clean, Compact Navigation Tabs */}
        <nav className={`flex items-center gap-1 p-1 rounded-xl shadow-inner shrink-0 ${
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
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-anek font-bold transition-all duration-150 relative whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-white border border-[#f6d16f] shadow-sm' 
                    : (theme === 'light' 
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80' 
                        : 'text-[#dfcfb2] hover:text-[#fbf8f1] hover:bg-[#2a2019]')
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? 'text-[#f6d16f]' : (theme === 'light' ? 'text-slate-500' : 'text-[#c69429]')
                }`} />
                <span className="hidden 2xl:inline">{tab.label}</span>
                <span className="inline 2xl:hidden">{tab.shortLabel || tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`ml-0.5 px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                    theme === 'light' ? 'bg-[#b83a2e] text-white' : 'bg-[#f6d16f] text-[#140e0b]'
                  }`}>
                    {lang === 'bn' ? toBnDigits(tab.badge) : tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Commute Card (Ultra-wide) + Theme Toggle + Language Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Commute Card Download Button (Visible on 2xl screens) */}
          {onDownloadPostcard && (
            <button
              type="button"
              onClick={onDownloadPostcard}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0e3b32] hover:from-[#1b5e50] hover:to-[#15453b] text-[#fbf8f1] text-xs font-anek font-bold border border-[#2a6f62] transition-all active:scale-95 shadow-xs cursor-pointer shrink-0"
              title={lang === 'bn' ? 'কমিউট কার্ড ডাউনলোড করুন' : 'Download Commute Card'}
            >
              <Download className="w-3.5 h-3.5 text-[#6ee7b7] shrink-0" />
              <span className="whitespace-nowrap">
                {lang === 'bn' ? 'কমিউট কার্ড' : 'Commute Card'}
              </span>
            </button>
          )}

          {/* Theme Toggle: [ ☀️ লাইট | 🌙 ডার্ক ] */}
          <div className="navbar-segmented-wrap shrink-0">
            <button
              type="button"
              onClick={() => setTheme && setTheme('light')}
              className={`navbar-btn ${theme === 'light' ? 'navbar-btn-active-sun' : 'navbar-btn-inactive'}`}
              title={lang === 'bn' ? 'লাইট মোড সক্রিয় করুন' : 'Switch to Light Mode'}
            >
              <Sun className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'bn' ? 'লাইট' : 'Light'}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme && setTheme('dark')}
              className={`navbar-btn ${theme === 'dark' ? 'navbar-btn-active-moon' : 'navbar-btn-inactive'}`}
              title={lang === 'bn' ? 'ডার্ক মোড সক্রিয় করুন' : 'Switch to Dark Mode'}
            >
              <Moon className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
            </button>
          </div>

          {/* Language Toggle: [ বাং | EN ] */}
          <div className="navbar-segmented-wrap shrink-0">
            <button
              type="button"
              onClick={() => setLang && setLang('bn')}
              className={`navbar-btn ${lang === 'bn' ? 'navbar-btn-active-bn' : 'navbar-btn-inactive'}`}
              title="বাংলা ভাষা সক্রিয় করুন"
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLang && setLang('en')}
              className={`navbar-btn ${lang === 'en' ? 'navbar-btn-active-en' : 'navbar-btn-inactive'}`}
              title="Switch to English"
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE / TABLET HEADER (<1024px) ================= */}
      <div className={`lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 transition-colors ${
        theme === 'light' ? 'bg-white border-b border-slate-200 shadow-xs' : 'bg-[#17120e] border-b border-[#c69429]/30'
      }`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDrawerOpen && setIsDrawerOpen(true)}
            aria-label="Open Mobile Menu"
            className={`w-9 h-9 flex items-center justify-center rounded-xl border active:scale-95 transition-all shadow-sm cursor-pointer ${
              theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#292019] border-[#c69429]/50 text-[#f6d16f]'
            }`}
          >
            <Menu className="w-5 h-5" strokeWidth={2.4} />
          </button>

          <div 
            className="flex items-center gap-1.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('home')}
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#f6d16f]/80 shrink-0 shadow-sm">
              <img 
                src="/assets/dhakar_poth_logo.jpg" 
                alt={t.brandName} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="font-rickshaw text-xl rickshaw-brand-typography">{t.brandName}</span>
          </div>
        </div>

        {/* Mobile Action Controls: Theme & Language */}
        <div className="flex items-center gap-1.5">
          {/* Mobile Theme Toggle */}
          <div className="navbar-segmented-wrap">
            <button
              type="button"
              onClick={() => setTheme && setTheme('light')}
              className={`navbar-btn px-2 py-1 ${theme === 'light' ? 'navbar-btn-active-sun' : 'navbar-btn-inactive'}`}
              title="Light"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme && setTheme('dark')}
              className={`navbar-btn px-2 py-1 ${theme === 'dark' ? 'navbar-btn-active-moon' : 'navbar-btn-inactive'}`}
              title="Dark"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Language Toggle */}
          <div className="navbar-segmented-wrap">
            <button
              type="button"
              onClick={() => setLang && setLang('bn')}
              className={`navbar-btn px-2 py-1 ${lang === 'bn' ? 'navbar-btn-active-bn' : 'navbar-btn-inactive'}`}
            >
              বাং
            </button>
            <button
              type="button"
              onClick={() => setLang && setLang('en')}
              className={`navbar-btn px-2 py-1 ${lang === 'en' ? 'navbar-btn-active-en' : 'navbar-btn-inactive'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
