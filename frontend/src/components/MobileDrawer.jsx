'use client';

import React from 'react';
import Link from 'next/link';
import { X, Navigation, AlertTriangle, Cpu, Users, Bus, FileScan, ShieldAlert, Globe, Sun, Moon, Download, Map, Shield } from 'lucide-react';
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
  onOpenScanner,
  onDownloadPostcard
}) {
  if (!isOpen) return null;
  const t = I18N[lang] || I18N.bn;

  const menuItems = [
    { id: 'home', label: lang === 'bn' ? 'রুট প্ল্যানার' : 'Route Planner', icon: Navigation },
    { id: 'alerts', label: lang === 'bn' ? 'সড়ক বিঘ্ন' : 'Street Alerts', icon: AlertTriangle, badge: activeAlertCount },
    { id: 'simulator', label: lang === 'bn' ? 'ম্যাপ ও সিমুলেটর' : 'Map & Simulator', icon: Map },
    { id: 'cms', label: lang === 'bn' ? 'বাস রুট ডিরেক্টরি' : 'Bus Directory', icon: Bus, badge: 183 },
    { id: 'rideshare', label: lang === 'bn' ? 'রাইড শেয়ার' : 'Ride Share', icon: Users },
  ];

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
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

            {/* Commute Card Download in Mobile Drawer */}
            <button
              onClick={() => { onClose(); onDownloadPostcard && onDownloadPostcard(); }}
              className="w-full mt-3 flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold bg-[#15453b]/40 border border-[#2a6f62] text-[#6ee7b7] hover:bg-[#15453b]/70 transition-all active:scale-95 shadow-md"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-[#6ee7b7]" />
                <span>{lang === 'bn' ? 'কমিউট কার্ড ডাউনলোড' : 'Download Commute Card'}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#f6d16f] bg-black/40 px-2 py-0.5 rounded border border-[#2a6f62]/50">PNG</span>
            </button>

            {/* Bonus Signboard OCR Button */}
            <button
              onClick={() => { onClose(); onOpenScanner(); }}
              className="w-full mt-2 flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold bg-[#201712] border border-[#c69429]/40 text-[#f6d16f] hover:bg-[#2a1e17]"
            >
              <FileScan className="w-4 h-4 text-[#f6d16f]" />
              <span>{lang === 'bn' ? 'বাসের সাইনবোর্ড ও ভাড়ার তালিকা স্ক্যান' : 'Scan Bus Signboard OCR'}</span>
            </button>

            {/* Admin CMS Portal Link */}
            <Link
              href="/admin"
              onClick={onClose}
              className="w-full mt-2 flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#292019] to-[#1a1410] border border-[#f6d16f]/60 text-[#f6d16f] hover:bg-[#3d3026] transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#f6d16f]" />
                <span>{lang === 'bn' ? 'অ্যাডমিন সিএমএস পোর্টাল' : 'Admin CMS Portal'}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#6ee7b7] bg-[#15453b] px-2 py-0.5 rounded border border-[#2a6f62]">
                /admin
              </span>
            </Link>
          </nav>
        </div>

        {/* Footer info & language/theme toggle */}
        <div className="pt-4 border-t border-[#c69429]/30 space-y-3">
          {/* Theme Selector */}
          <div className="flex items-center justify-between px-1 text-xs text-[#dfcfb2]">
            <span className={theme === 'light' ? 'text-[#140e0b] font-bold' : ''}>{lang === 'bn' ? 'থিম নির্বাচন' : 'Theme Mode'}</span>
            <button
              onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition-all active:scale-95 ${
                theme === 'light'
                  ? 'bg-white text-[#140e0b] border-[#c69429]/40 shadow-sm'
                  : 'bg-[#292019] text-[#f6d16f] border-[#c69429]/40'
              }`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'লাইট' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className={theme === 'light' ? 'text-[#140e0b]' : ''}>{lang === 'bn' ? 'ডার্ক' : 'Dark'}</span>
                </>
              )}
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-between px-1 text-xs text-[#dfcfb2]">
            <span className={theme === 'light' ? 'text-[#140e0b] font-bold' : ''}>{lang === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}</span>
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold border ${
                theme === 'light'
                  ? 'bg-white text-[#140e0b] border-[#c69429]/40 shadow-sm'
                  : 'bg-[#292019] text-[#f6d16f] border-[#c69429]/40'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-[#b83a2e]' : 'text-[#f6d16f]'}`} />
              <span className={theme === 'light' ? 'text-[#140e0b]' : ''}>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
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
