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
      <footer className="w-full py-6 mt-12 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 DhakaPath — INIF National IT Fest Smart City Hackathon. All rights reserved.</p>
        <p className="text-[11px] text-slate-600 mt-1">
          Open Tech Stack: Next.js 14, FastAPI, NetworkX, Leaflet (OpenStreetMap Free), Google Gemini AI.
        </p>
      </footer>
    );
  }

  // Dedicated emergency contact/helpline strip with 1-tap phone dialer exclusively on Homepage
  return (
    <div className="w-full my-8">
      <div className="glass-panel p-5 border border-rose-500/30 bg-slate-900/80">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">{t.emergencyTitle}</h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'যেকোনো আকস্মিক সড়ক দুর্ঘটনা, জলজট উদ্ধার বা পুলিশি সহায়তায় ১-ট্যাপে কল করুন' : '1-tap phone dialer for traffic emergencies, flood rescue & police assistance'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STATIC_EMERGENCY_CONTACTS.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 transition-all flex items-center justify-between group active:scale-95"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  {lang === 'bn' ? c.name_bn : c.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {c.desc}
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-black shrink-0 ml-2 group-hover:bg-rose-500 group-hover:text-white transition-all">
                {c.phone}
              </div>
            </a>
          ))}
        </div>
      </div>

      <footer className="w-full py-6 mt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>© 2026 DhakaPath — Live Urban Transit & Route Intelligence. INIF 2026 Smart City Hackathon.</p>
      </footer>
    </div>
  );
}
