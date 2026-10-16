'use client';

import React from 'react';
import { X, Navigation, AlertTriangle, Cpu, Users, Bus, FileScan, ShieldAlert, Globe } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  currentTab, 
  setCurrentTab, 
  lang, 
  setLang,
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
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-emerald-500/30 p-5 flex flex-col justify-between shadow-2xl h-full z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                <Navigation className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">{t.brandName}</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="mt-5 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {lang === 'bn' ? toBnDigits(item.badge) : item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Bonus Signboard OCR Button */}
            <button
              onClick={() => { onClose(); onOpenScanner(); }}
              className="w-full mt-3 flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40"
            >
              <FileScan className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'সাইনর্বোড / ভাড়ার চার্ট স্ক্যান' : 'Scan Bus Signboard (OCR)'}</span>
            </button>
          </nav>
        </div>

        {/* Footer info & language toggle */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>{lang === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold border border-emerald-500/30"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 px-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
            <span>INIF 2026 Smart City Hackathon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
