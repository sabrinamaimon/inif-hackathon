'use client';

import React from 'react';
import { Menu, Navigation, AlertTriangle, Cpu, Users, Bus, Globe, Sparkles, Sun, Moon } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  theme = 'dark',
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

  return (
    <header className="w-full sticky top-0 z-50 bg-[#16110d]/95 backdrop-blur-md border-b border-[#c69429]/40 shadow-xl">
      {/* ================= DESKTOP HEADER (>768px) ================= */}
      <div className="hidden md:flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 py-3 w-full max-w-[1920px] mx-auto">
        {/* Clean, High-End Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[10px] bg-[#1a1410] flex items-center justify-center border border-[#f6d16f]/60">
              <span className="text-xl">🛺</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-rickshaw text-2xl text-[#f6d16f] rickshaw-text-pop tracking-normal">
              {lang === 'bn' ? 'ঢাকা-পাথ' : 'DhakaPath'}
            </span>
            <span className="font-regal text-xs text-[#dfcfb2] tracking-widest uppercase">
              TRANSIT
            </span>
          </div>
        </div>

        {/* Clean, Spacious Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#1e1712]/90 p-1.5 rounded-2xl border border-[#c69429]/30 shadow-inner">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-anek font-bold transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#b83a2e] to-[#96281e] text-[#fbf8f1] border border-[#f6d16f] shadow-md' 
                    : 'text-[#dfcfb2] hover:text-[#fbf8f1] hover:bg-[#2a2019]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#f6d16f]' : 'text-[#c69429]'}`} />
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

        {/* Right Action Controls: Shapla Badge + Theme Toggle + Language Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Shapla Chattar Enamel Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#15453b]/40 border border-[#2a6f62] text-xs text-[#f6d16f] font-anek font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#f6d16f] animate-pulse" />
            <span>{lang === 'bn' ? '১৬টি হাব সচল' : '16 Hubs Active'}</span>
          </div>

          {/* Theme Toggle Button (Dark / Light Mode) */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2019] hover:bg-[#3d3026] text-[#f6d16f] text-xs font-anek font-bold border border-[#c69429]/50 transition-all active:scale-95 shadow-md"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'লাইট' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2019] hover:bg-[#3d3026] text-[#f6d16f] text-xs font-anek font-bold border border-[#c69429]/50 transition-all active:scale-95 shadow-md"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#f6d16f]" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* ================= MOBILE HEADER (<768px) ================= */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[#17120e]">
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
          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#292019] border border-[#c69429]/50 text-[#f6d16f] active:scale-95 transition-all"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-400" />
            )}
          </button>

          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#292019] border border-[#c69429]/50 text-[#f6d16f] text-xs font-anek font-bold active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#f6d16f]" />
            <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
