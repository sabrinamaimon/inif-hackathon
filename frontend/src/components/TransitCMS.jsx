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
    <div className="glass-panel p-5 border border-emerald-500/30 my-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'bn' ? 'ঢাকা ট্রানজিট নেটওয়ার্ক ডিরেক্টরি (CMS)' : 'Dhaka Transit Network Directory (CMS)'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? 'মেট্রোরেল, অনুমোদিত বাস লাইন, লেগুনা করিডোর ও হাফ-পাস চার্ট' : 'Verified Metro, Bus, and Leguna transit corridors with student pass eligibility'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'metro', 'bus', 'leguna'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                filterType === type 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'বাস বা মেট্রো রুট খুঁজুন (যেমন: বিকল্প, মিরপুর, ফার্মগেট)...' : 'Search routes or hubs...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((route) => (
          <div
            key={route.id}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all interactive-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: route.color }} 
                />
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === 'bn' ? route.name_bn : route.name}
                </h4>
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 uppercase">
                {route.type}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              {lang === 'bn' ? 'অপারেটর:' : 'Operator:'} <strong className="text-slate-200">{route.operator}</strong> | 
              {lang === 'bn' ? ' ফ্রিকোয়েন্সি:' : ' Frequency:'} <strong className="text-emerald-400">{lang === 'bn' ? `${toBnDigits(route.frequency_mins)} মিনিট পর পর` : `Every ${route.frequency_mins} mins`}</strong>
            </p>

            {/* Hubs pill tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {route.hubs.map((hub, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium"
                >
                  {hub}
                </span>
              ))}
            </div>

            {/* Landmark & Fare Strip */}
            <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{lang === 'bn' ? 'হাফ-পাস:' : 'Student Half-Pass:'}</span>
                {route.student_pass_allowed ? (
                  <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" /> {lang === 'bn' ? 'প্রযোজ্য (৫০%)' : 'Eligible (50%)'}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-slate-500">
                    <X className="w-3.5 h-3.5" /> {lang === 'bn' ? 'প্রযোজ্য নয়' : 'Not Applicable'}
                  </span>
                )}
              </div>

              <div className="font-bold text-emerald-400">
                {formatFare(route.base_fare_bdt, lang)} - {formatFare(route.max_fare_bdt, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
