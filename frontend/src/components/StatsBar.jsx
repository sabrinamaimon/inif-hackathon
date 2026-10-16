'use client';

import React from 'react';
import { MapPin, Zap, Users, AlertCircle } from 'lucide-react';
import { I18N } from '../utils/localization';

export default function StatsBar({ lang }) {
  const t = I18N[lang] || I18N.bn;

  return (
    <div className="w-full my-4 py-2 px-4 rounded-xl bg-[#1a1410] border border-[#c69429]/40 flex flex-wrap items-center justify-between gap-3 text-xs font-anek text-[#dfcfb2] shadow-md">
      <div className="flex items-center gap-2 text-[#f6d16f] font-bold">
        <span className="w-2 h-2 rounded-full bg-[#f6d16f] animate-ping" />
        <span>{lang === 'bn' ? 'ঢাকা লাইভ ট্রানজিট গ্রিড:' : 'Dhaka Live Grid:'}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[12px] font-semibold text-[#fbf8f1]">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#f6d16f]" />
          <span>{lang === 'bn' ? '১৬টি হাব (সদরঘাট-উত্তরা)' : '16 Active Hubs'}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#d6645a]" />
          <span>{lang === 'bn' ? '৪০%+ দ্রুততম স্মার্ট ডিট্যুর' : '40%+ Faster Detours'}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#6ee7b7]" />
          <span>{lang === 'bn' ? 'বাসে ৫০% শিক্ষার্থী হাফ-পাস (১০ ৳ ফ্লোর)' : '50% Student Pass (10 BDT Floor)'}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#7dd3fc]" />
          <span>{lang === 'bn' ? 'যাত্রীভিত্তিক লাইভ অ্যালার্ট' : 'Live Incident Grounding'}</span>
        </span>
      </div>
    </div>
  );
}
