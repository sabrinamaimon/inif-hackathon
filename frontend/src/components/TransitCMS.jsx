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
    <div className="glass-panel p-6 sm:p-7 border border-emerald-500/30 my-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Bus className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'bn' ? 'ঢাকা ট্রানজিট নেটওয়ার্ক ডিরেক্টরি (CMS)' : 'Dhaka Transit Network Directory (CMS)'}</span>
          </h3>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {lang === 'bn' ? 'মেট্রোরেল, অনুমোদিত বাস লাইন, লেগুনা করিডোর ও হাফ-পাস চার্ট' : 'Verified Metro, Bus, and Leguna transit corridors with student pass eligibility'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-sm">
          {['all', 'metro', 'bus', 'leguna'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl font-extrabold capitalize transition-all ${
                filterType === type 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'বাস বা মেট্রো রুট খুঁজুন (যেমন: বিকল্প, মিরপুর, ফার্মগেট)...' : 'Search routes or hubs...'}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-base placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((route) => (
          <div
            key={route.id}
            className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all interactive-card shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: route.color }} 
                />
                <h4 className="text-base sm:text-lg font-black text-white">
                  {lang === 'bn' ? route.name_bn : route.name}
                </h4>
              </div>

              <span className="text-xs font-black px-3 py-1 rounded-lg bg-slate-800 text-slate-200 uppercase">
                {route.type}
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-4 font-medium">
              {lang === 'bn' ? 'অপারেটর:' : 'Operator:'} <strong className="text-white">{route.operator}</strong> | 
              {lang === 'bn' ? ' ফ্রিকোয়েন্সি:' : ' Frequency:'} <strong className="text-emerald-400">{lang === 'bn' ? `${toBnDigits(route.frequency_mins)} মিনিট পর পর` : `Every ${route.frequency_mins} mins`}</strong>
            </p>

            {/* Hubs pill tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {route.hubs.map((hub, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold"
                >
                  {hub}
                </span>
              ))}
            </div>

            {/* Landmark & Fare Strip */}
            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">{lang === 'bn' ? 'হাফ-পাস:' : 'Student Half-Pass:'}</span>
                {route.student_pass_allowed ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-black">
                    <Check className="w-4 h-4" /> {lang === 'bn' ? 'প্রযোজ্য (৫০%)' : 'Eligible (50%)'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <X className="w-4 h-4" /> {lang === 'bn' ? 'প্রযোজ্য নয়' : 'Not Applicable'}
                  </span>
                )}
              </div>

              <div className="font-black text-base text-emerald-400">
                {formatFare(route.base_fare_bdt, lang)} - {formatFare(route.max_fare_bdt, lang)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
