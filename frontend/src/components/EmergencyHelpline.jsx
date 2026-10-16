'use client';

import React from 'react';
import { Phone, Shield, LifeBuoy, AlertCircle, Compass } from 'lucide-react';
import { STATIC_EMERGENCY_CONTACTS } from '../data/staticData';
import { I18N } from '../utils/localization';

export default function EmergencyHelpline({ lang = 'bn', isHome = true }) {
  const t = I18N[lang] || I18N.bn;

  if (!isHome) {
    return (
      <footer className="w-full py-8 mt-12 border-t-2 border-[#c69429]/30 text-center font-anek text-xs text-[#dfcfb2] bg-[#14100c]/80">
        <p className="font-rickshaw text-base text-[#f6d16f]">
          {lang === 'bn' ? '© ২০২৬ ঢাকা-পাথ — আইএআইটি জাতীয় আইটি উৎসব হ্যাকাথন। সর্বস্বত্ব সংরক্ষিত।' : '© 2026 DhakaPath — IAIT National IT Fest Hackathon. All rights reserved.'}
        </p>
        <p className="text-[11px] text-[#9e8a76] mt-1 font-mono">
          IAIT National IT Fest 2026 | Theme: Smart City | DhakaPath
        </p>
      </footer>
    );
  }

  return (
    <div className="w-full my-10 space-y-4">
      {/* Emergency Contact Strip */}
      <div className="heritage-card p-5 sm:p-6 border-2 border-[#b83a2e]/60 bg-gradient-to-r from-[#1c1511] via-[#241713] to-[#1c1511] shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#c69429]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b83a2e]/30 border border-[#b83a2e] flex items-center justify-center text-[#f6d16f] shadow-md">
              <Phone className="w-5 h-5 text-[#f6d16f]" />
            </div>
            <div>
              <h3 className="font-rickshaw text-2xl text-[#f6d16f] rickshaw-text-pop">
                {t.emergencyTitle}
              </h3>
              <p className="font-anek text-xs sm:text-sm text-[#dfcfb2]">
                {lang === 'bn' 
                  ? 'সড়ক দুর্ঘটনা, জলজট উদ্ধার, সদরঘাট নদীপথ ও ট্রাফিক সহায়তায় ১-ট্যাপে সরাসরি কল করুন' 
                  : '1-tap phone dialer for traffic emergencies, flood rescue & police assistance'}
              </p>
            </div>
          </div>

          <div className="text-[11px] font-anek font-bold text-[#f6d16f] bg-black/40 px-3 py-1 rounded-xl border border-[#c69429]/40">
            {lang === 'bn' ? '★ ২৪ ঘণ্টা সার্বক্ষণিক সচল' : '★ 24/7 Active Helpline'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {STATIC_EMERGENCY_CONTACTS.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="p-4 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/30 hover:border-[#f6d16f] hover:bg-[#1a1410] transition-all flex flex-col justify-between gap-3.5 group active:scale-95 shadow-md overflow-hidden"
            >
              <div className="min-w-0">
                <div className="font-anek text-sm sm:text-base font-extrabold text-[#fbf8f1] group-hover:text-[#f6d16f] transition-colors leading-snug">
                  {lang === 'bn' ? c.name_bn : c.name}
                </div>
                <div className="font-anek text-xs text-[#dfcfb2] mt-1 line-clamp-1">
                  {c.desc}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#c69429]/20 mt-auto">
                <span className="text-xs font-anek font-bold text-[#c69429] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#b83a2e]" />
                  <span>{lang === 'bn' ? 'সরাসরি কল' : 'Call Now'}</span>
                </span>
                <div className="px-3 py-1 rounded-lg bg-[#b83a2e] text-[#fbf8f1] text-xs sm:text-sm font-mono font-bold tracking-wider group-hover:bg-[#f6d16f] group-hover:text-[#120e0b] transition-all shadow-md shrink-0">
                  {c.phone}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Classic Vintage Postal Card Footer */}
      <footer className="w-full py-8 border-t-2 border-[#c69429]/30 text-center font-anek text-sm text-[#dfcfb2]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🛺</span>
          <span className="font-rickshaw text-2xl text-[#f6d16f] rickshaw-text-pop">
            {lang === 'bn' ? 'ঢাকা-পাথ (DhakaPath)' : 'DhakaPath Urban Transit'}
          </span>
          <span className="text-2xl">🛺</span>
        </div>
        <p className="text-sm text-[#dfcfb2]">
          {lang === 'bn' 
            ? 'পুরান ঢাকার ৪০০ বছরের সাংস্কৃতিক ঐতিহ্য, রিকশা আর্ট ও আধুনিক মেট্রোরেল ট্রানজিট ইন্টেলিজেন্স।' 
            : '400 years of Dhaka cultural heritage, rickshaw art, and modern metro transit intelligence.'}
        </p>
        <p className="text-xs text-[#9e8a76] mt-1 font-mono">
          IAIT National IT Fest 2026 | Theme: Smart City | DhakaPath
        </p>
      </footer>
    </div>
  );
}
