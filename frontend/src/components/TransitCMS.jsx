'use client';

import React, { useState } from 'react';
import { Bus, Train, Car, Bike, Check, X, Search, Clock, DollarSign, MapPin } from 'lucide-react';
import { I18N, formatFare, toBnDigits } from '../utils/localization';

export const STATIC_TRANSIT_ROUTES = [
  {
    id: "route-mrt6",
    name: "MRT-6 Metro Rail",
    name_bn: "এমআরটি-৬ মেট্রোরেল",
    type: "metro",
    operator: "DMTCL",
    color: "#059669",
    student_pass_allowed: false,
    frequency_mins: 6,
    hubs: ["Uttara", "Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"],
    base_fare_bdt: 20,
    max_fare_bdt: 100,
    landmark_instructions: "Elevated concourse turnstiles. Rapid Pass or single journey ticket."
  },
  {
    id: "route-bikolpo",
    name: "Bikolpo Auto Service",
    name_bn: "বিকল্প অটো সার্ভিস",
    type: "bus",
    operator: "Bikolpo Transport Ltd",
    color: "#2563eb",
    student_pass_allowed: true,
    frequency_mins: 8,
    hubs: ["Mirpur 10", "Agargaon", "Farmgate", "Shahbagh", "Motijheel"],
    base_fare_bdt: 10,
    max_fare_bdt: 40,
    landmark_instructions: "Mirpur 10 roundabout, Farmgate Ananda Cinema, Shahbagh Museum gate."
  },
  {
    id: "route-shikor",
    name: "Shikor Paribahan",
    name_bn: "শিকর পরিবহন",
    type: "bus",
    operator: "Shikor Paribahan Co",
    color: "#d97706",
    student_pass_allowed: true,
    frequency_mins: 10,
    hubs: ["Mirpur 10", "Agargaon", "Science Lab", "Shahbagh", "Jatrabari"],
    base_fare_bdt: 10,
    max_fare_bdt: 45,
    landmark_instructions: "Opposite Dhaka City College, under Hanif Flyover ramp."
  },
  {
    id: "route-thikana",
    name: "Thikana Paribahan",
    name_bn: "ঠিকানা পরিবহন",
    type: "bus",
    operator: "Thikana Express",
    color: "#7c3aed",
    student_pass_allowed: true,
    frequency_mins: 12,
    hubs: ["Mohammadpur", "Dhanmondi", "Science Lab", "Shahbagh", "Malibagh", "Banasree"],
    base_fare_bdt: 10,
    max_fare_bdt: 35,
    landmark_instructions: "Mohammadpur Town Hall, Dhanmondi Rapa Plaza, Banasree Block C."
  },
  {
    id: "route-leguna-farm-mdpur",
    name: "Farmgate - Mohammadpur Leguna",
    name_bn: "ফার্মগেট - মোহাম্মদপুর লেগুনা",
    type: "leguna",
    operator: "Dhaka Human Hauler Co-op",
    color: "#0284c7",
    student_pass_allowed: false,
    frequency_mins: 4,
    hubs: ["Farmgate", "Mohammadpur"],
    base_fare_bdt: 20,
    max_fare_bdt: 20,
    landmark_instructions: "Khamarbari road corner & Town Hall market."
  }
];

export default function TransitCMS({ lang = 'bn' }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = STATIC_TRANSIT_ROUTES.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.hubs.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="heritage-card p-6 sm:p-7 border-2 border-[#c69429]/50 my-8 shadow-2xl bg-[#18130f]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#c69429]/30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚌</span>
            <h3 className="font-rickshaw text-2xl sm:text-3xl font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
              {lang === 'bn' ? 'ঢাকা ট্রানজিট নেটওয়ার্ক ডিরেক্টরি' : 'Dhaka Transit Network Directory'}
            </h3>
            <span 
              className="transit-verified-badge text-xs px-3 py-1 rounded-full bg-[#15453b] font-anek font-extrabold border border-[#2a6f62] shadow-md tracking-wide"
              style={{ color: '#a5f3fc' }}
            >
              {lang === 'bn' ? 'BRTA ও DMTCL অনুমোদিত' : 'Verified BRTA & DMTCL'}
            </span>
          </div>
          <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] mt-1 font-medium">
            {lang === 'bn' ? 'মেট্রোরেল, অনুমোদিত বাস লাইন, লেগুনা করিডোর ও হাফ-পাস ভাড়ার পূর্ণাঙ্গ তালিকা' : 'Verified Metro, Bus, and Leguna transit corridors with student pass eligibility'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#120e0b] p-1.5 rounded-xl border border-[#c69429]/40 font-anek text-xs sm:text-sm">
          {[
            { id: 'all', label: lang === 'bn' ? 'সব রুট' : 'All Routes' },
            { id: 'metro', label: lang === 'bn' ? '🚇 মেট্রোরেল' : 'Metro' },
            { id: 'bus', label: lang === 'bn' ? '🚌 বাস সার্ভিস' : 'Bus' },
            { id: 'leguna', label: lang === 'bn' ? '🚐 লেগুনা' : 'Leguna' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                filterType === item.id 
                  ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] border border-[#f6d16f] shadow-md' 
                  : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <div className="relative font-anek">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'বাস বা মেট্রো রুট খুঁজুন (যেমন: বিকল্প, মিরপুর, ফার্মগেট, মতিঝিল)...' : 'Search routes or hubs...'}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm sm:text-base placeholder:text-[#8a7258] focus:outline-none focus:border-[#f6d16f] shadow-inner"
          />
          <Search className="w-5 h-5 text-[#c69429] absolute left-4 top-4" />
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-anek">
        {filtered.map((route) => (
          <div
            key={route.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#16110d] border-2 border-[#c69429]/30 hover:border-[#f6d16f] transition-all interactive-card shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-4 h-4 rounded-full border border-[#f6d16f]/60 shadow-sm" 
                  style={{ backgroundColor: route.color }} 
                />
                <h4 className="font-rickshaw text-lg sm:text-xl font-bold text-[#fbf8f1] tracking-wide">
                  {lang === 'bn' ? route.name_bn : route.name}
                </h4>
              </div>

              <span 
                className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase border tracking-wider ${
                  route.type === 'metro'
                    ? 'transit-metro-badge bg-[#15453b] border-[#2a6f62]'
                    : route.type === 'bus'
                    ? 'bg-[#292019] text-[#f6d16f] border-[#c69429]/40'
                    : 'transit-leguna-badge bg-[#ffe4e6] border-[#b83a2e]'
                }`}
                style={
                  route.type === 'metro' 
                    ? { color: '#a5f3fc' } 
                    : route.type === 'leguna' 
                    ? { color: '#7f1d1d' } 
                    : undefined
                }
              >
                {route.type}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#dfcfb2] mb-3 font-medium">
              <span>{lang === 'bn' ? 'অপারেটর:' : 'Operator:'}</span> <strong className="text-[#fbf8f1]">{route.operator}</strong> | 
              <span>{lang === 'bn' ? ' ফ্রিকোয়েন্সি:' : ' Frequency:'}</span> <strong className="text-[#f6d16f]">{lang === 'bn' ? `${toBnDigits(route.frequency_mins)} মিনিট পর পর` : `Every ${route.frequency_mins} mins`}</strong>
            </p>

            {/* Hubs pill tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {route.hubs.map((hub, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#201712] border border-[#c69429]/25 text-xs text-[#dfcfb2] font-semibold"
                >
                  {hub}
                </span>
              ))}
            </div>

            {/* Landmark & Fare Strip */}
            <div className="pt-3 border-t border-[#c69429]/20 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#a89078] font-medium">{lang === 'bn' ? 'হাফ-পাস:' : 'Student Half-Pass:'}</span>
                {route.student_pass_allowed ? (
                  <span className="flex items-center gap-1 text-[#7dd3fc] bg-[#15453b]/40 px-2 py-0.5 rounded border border-[#2a6f62] font-bold text-xs">
                    <Check className="w-3.5 h-3.5 text-[#7dd3fc]" /> {lang === 'bn' ? 'প্রযোজ্য (৫০%)' : 'Eligible (50%)'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#a89078] font-medium text-xs">
                    <X className="w-3.5 h-3.5" /> {lang === 'bn' ? 'প্রযোজ্য নয়' : 'Not Applicable'}
                  </span>
                )}
              </div>

              <div className="font-rickshaw text-lg sm:text-xl font-bold text-[#f6d16f] rickshaw-text-pop">
                {formatFare(route.base_fare_bdt, lang)} - {formatFare(route.max_fare_bdt, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
