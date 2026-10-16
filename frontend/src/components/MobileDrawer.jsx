'use client';

import React from 'react';
import { X, Navigation, AlertTriangle, Cpu, Users, Bus, FileScan, ShieldAlert, Globe, Sun, Moon } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang, 
  theme = 'dark',
  setTheme,
  activeAlertCount = 3,
  onOpenScanner
}) {
  if (!isOpen) return null;
  const t = I18N[lang] || I18N.bn;

  const menuItems = [
    { id: 'home', label: t.tabHome, icon: Navigation },
    { id: 'alerts', label: t.tabAlerts, icon: AlertTriangle, badge: activeAlertCount },
    { id: 'simulator', label: t.tabSimulator, icon: Cpu },
    { id: 'cms', label: t.tabCMS, icon: Bus },
    { id: 'rideshare', label: t.tabRideShare, icon: Users },
  ];

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0a0705]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#18130f] border-r-2 border-[#c69429]/50 p-5 flex flex-col justify-between shadow-2xl h-full z-10 animate-in slide-in-from-left duration-300 font-anek">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#c69429]/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b83a2e] to-[#891e17] border border-[#f6d16f] flex items-center justify-center font-bold text-lg shadow-md">
                🛺
              </div>
              <span className="font-rickshaw text-lg font-bold text-[#f6d16f] rickshaw-text-pop">{t.brandName}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white border border-[#c69429]/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="mt-5 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] font-bold border border-[#f6d16f] shadow-md shadow-[#b83a2e]/30' 
                      : 'text-[#dfcfb2] hover:bg-[#292019] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#f6d16f]' : 'text-[#c69429]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#b83a2e] text-[#fbf8f1] border border-[#f6d16f] animate-pulse">
                      {lang === 'bn' ? toBnDigits(item.badge) : item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Bonus Signboard OCR Button */}
            <button
              onClick={() => { onClose(); onOpenScanner(); }}
              className="w-full mt-3 flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold bg-[#201712] border border-[#c69429]/40 text-[#f6d16f] hover:bg-[#2a1e17]"
            >
              <FileScan className="w-4 h-4 text-[#f6d16f]" />
              <span>{lang === 'bn' ? 'সাইনর্বোড / ভাড়ার চার্ট স্ক্যান' : 'Scan Bus Signboard (OCR)'}</span>
            </button>
          </nav>
        </div>

        {/* Footer info & language/theme toggle */}
        <div className="pt-4 border-t border-[#c69429]/30 space-y-3">
          {/* Theme Selector */}
          <div className="flex items-center justify-between px-1 text-xs text-[#dfcfb2]">
            <span>{lang === 'bn' ? 'থিম নির্বাচন' : 'Theme Mode'}</span>
            <button
              onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#292019] text-[#f6d16f] font-bold border border-[#c69429]/40 active:scale-95 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'লাইট' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
                </>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between px-1 text-xs text-[#dfcfb2]">
            <span>{lang === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#292019] text-[#f6d16f] font-bold border border-[#c69429]/40"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>

          <div className="text-[11px] text-[#8a7258] px-1 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-[#c69429]" />
            <span>INIF 2026 Smart City Hackathon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
