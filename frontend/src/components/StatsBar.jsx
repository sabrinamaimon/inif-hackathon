'use client';

import React from 'react';
import { MapPin, Zap, Users, AlertCircle, Sparkles } from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function StatsBar({ lang }) {
  const t = I18N[lang] || I18N.bn;

  const stats = [
    {
      icon: MapPin,
      value: lang === 'bn' ? '১৬টি হাব' : '16 Hubs',
      value_sub: lang === 'bn' ? 'সদরঘাট ও লালবাগ অন্তর্ভুক্ত' : 'Sadarghat & Lalbagh Grid',
      label: lang === 'bn' ? 'পুরান ঢাকা থেকে উত্তরা' : 'Full City Corridor',
      themeBorder: 'border-[#c69429]/40 hover:border-[#f6d16f]',
      themeBg: 'bg-gradient-to-br from-[#1c1511] to-[#291e17]',
      accentColor: 'text-[#f6d16f]',
      ornament: '🛺'
    },
    {
      icon: Zap,
      value: lang === 'bn' ? '৪০%+ দ্রুত' : '40%+ Faster',
      value_sub: lang === 'bn' ? 'মেট্রো ও স্মার্ট ডিট্যুর' : 'Metro + Smart Detour',
      label: lang === 'bn' ? 'জ্যাম ও জলজট এড়িয়ে পথ' : 'Waterlogging Avoidance',
      themeBorder: 'border-[#b83a2e]/40 hover:border-[#d6645a]',
      themeBg: 'bg-gradient-to-br from-[#1c1511] to-[#341714]',
      accentColor: 'text-[#d6645a]',
      ornament: '⚡'
    },
    {
      icon: Users,
      value: lang === 'bn' ? '৫০% হাফ-পাস' : '50% Half-Pass',
      value_sub: lang === 'bn' ? 'সর্বনিম্ন ১০ ৳ ফ্লোর' : '10 BDT Floor Applied',
      label: lang === 'bn' ? 'বাসের শিক্ষার্থী ছাড়' : 'Student Statutory Rate',
      themeBorder: 'border-[#15453b]/50 hover:border-[#2a6f62]',
      themeBg: 'bg-gradient-to-br from-[#1c1511] to-[#122e26]',
      accentColor: 'text-[#6ee7b7]',
      ornament: '🎓'
    },
    {
      icon: AlertCircle,
      value: lang === 'bn' ? 'লাইভ অ্যালার্ট' : 'Live Alerts',
      value_sub: lang === 'bn' ? 'যাত্রীভিত্তিক যাচাইকরণ' : 'Crowdsourced Grounding',
      label: lang === 'bn' ? 'বিশ্বাসযোগ্যতা স্কোর সহ' : 'Dynamic Trust Decay',
      themeBorder: 'border-[#1c4568]/50 hover:border-[#346894]',
      themeBg: 'bg-gradient-to-br from-[#1c1511] to-[#14283b]',
      accentColor: 'text-[#7dd3fc]',
      ornament: '📢'
    }
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className={`heritage-card p-4 flex flex-col justify-between border ${s.themeBorder} ${s.themeBg} interactive-card relative overflow-hidden group`}
        >
          {/* Subtle Rickshaw corner flourish */}
          <div className="absolute top-1.5 right-2 text-sm opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all select-none">
            {s.ornament}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-black/40 border border-[#c69429]/30 flex items-center justify-center shrink-0 shadow-inner">
              <s.icon className={`w-4 h-4 ${s.accentColor}`} />
            </div>
            <div>
              <div className="font-rickshaw text-lg sm:text-xl font-bold tracking-normal text-[#f6d16f]">
                {s.value}
              </div>
              <div className="font-anek text-[11px] font-bold text-[#fbf8f1] -mt-0.5">
                {s.value_sub}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#c69429]/20 flex items-center justify-between">
            <span className="font-anek text-[11px] text-[#dfcfb2] font-medium">
              {s.label}
            </span>
            <span className="text-[10px] text-[#c69429] font-mono font-bold">
              ✓ VERIFIED
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
