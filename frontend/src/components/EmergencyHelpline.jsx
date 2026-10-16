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
          © ২০২৬ ঢাকা-পাথ — আইএআইটি জাতীয় আইটি উৎসব হ্যাকাথন। সর্বস্বত্ব সংরক্ষিত।
        </p>
        <p className="text-[11px] text-[#9e8a76] mt-1 font-mono">
          Open Tech Stack: Next.js 14, Leaflet.js (OpenStreetMap Free), FastAPI, Google Gemini AI.
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
            ★ ২৪ ঘণ্টা সার্বক্ষণিক সচল
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {STATIC_EMERGENCY_CONTACTS.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="p-4 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/30 hover:border-[#f6d16f] hover:bg-[#1a1410] transition-all flex items-center justify-between group active:scale-95 shadow-md"
            >
              <div>
                <div className="font-anek text-sm font-extrabold text-[#fbf8f1] group-hover:text-[#f6d16f] transition-colors">
                  {lang === 'bn' ? c.name_bn : c.name}
                </div>
                <div className="font-anek text-[11px] text-[#dfcfb2] mt-0.5 line-clamp-1">
                  {c.desc}
                </div>
              </div>

              <div className="px-3 py-1 rounded-lg bg-[#b83a2e] text-[#fbf8f1] text-xs font-mono font-black shrink-0 ml-2 group-hover:bg-[#f6d16f] group-hover:text-[#120e0b] transition-all shadow-md">
                {c.phone}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Classic Vintage Postal Card Footer */}
      <footer className="w-full py-8 border-t-2 border-[#c69429]/30 text-center font-anek text-xs text-[#dfcfb2]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🛺</span>
          <span className="font-rickshaw text-xl text-[#f6d16f] rickshaw-text-pop">
            ঢাকা-পাথ (DhakaPath)
          </span>
          <span className="text-xl">🛺</span>
        </div>
        <p className="text-xs text-[#dfcfb2]">
          পুরান ঢাকার ৪০০ বছরের সাংস্কৃতিক ঐতিহ্য, রিকশা আর্ট ও আধুনিক মেট্রোরেল ট্রানজিট ইন্টেলিজেন্স।
        </p>
        <p className="text-[11px] text-[#9e8a76] mt-1 font-mono">
          IAIT National IT Fest 2026 | Theme: Smart City | DhakaPath
        </p>
      </footer>
    </div>
  );
}
