'use client';

import React from 'react';
import { Phone, Shield, LifeBuoy, AlertCircle } from 'lucide-react';
import { STATIC_EMERGENCY_CONTACTS } from '../data/staticData';
import { I18N } from '../utils/localization';

export default function EmergencyHelpline({ lang = 'bn', isHome = true }) {
  const t = I18N[lang] || I18N.bn;

  if (!isHome) {
    // Clean, minimal copyright strip on all inner tabs
    return (
      <footer className="w-full py-8 mt-14 border-t border-slate-800 text-center text-sm text-slate-400">
        <p>© 2026 DhakaPath — INIF National IT Fest Smart City Hackathon. All rights reserved.</p>
        <p className="text-xs text-slate-500 mt-1">
          Open Tech Stack: Next.js 14, FastAPI, NetworkX, Leaflet (OpenStreetMap Free), Google Gemini AI.
        </p>
      </footer>
    );
  }

  // Dedicated emergency contact/helpline strip with 1-tap phone dialer exclusively on Homepage
  return (
    <div className="w-full my-10">
      <div className="glass-panel p-6 sm:p-7 border border-rose-500/40 bg-slate-900/90 shadow-2xl">
        <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{t.emergencyTitle}</h3>
            <p className="text-sm text-slate-300 font-medium">
              {lang === 'bn' ? 'যেকোনো আকস্মিক সড়ক দুর্ঘটনা, জলজট উদ্ধার বা পুলিশি সহায়তায় ১-ট্যাপে কল করুন' : '1-tap phone dialer for traffic emergencies, flood rescue & police assistance'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIC_EMERGENCY_CONTACTS.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/60 hover:bg-rose-950/30 transition-all flex items-center justify-between group active:scale-95 shadow-md"
            >
              <div>
                <div className="text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors">
                  {lang === 'bn' ? c.name_bn : c.name}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">
                  {c.desc}
                </div>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-black shrink-0 ml-3 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                {c.phone}
              </div>
            </a>
          ))}
        </div>
      </div>

      <footer className="w-full py-8 mt-8 border-t border-slate-800 text-center text-sm text-slate-400">
        <p>© 2026 DhakaPath — Live Urban Transit & Route Intelligence. INIF 2026 Smart City Hackathon.</p>
      </footer>
    </div>
  );
}
