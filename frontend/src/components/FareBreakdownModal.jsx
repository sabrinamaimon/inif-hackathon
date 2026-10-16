'use client';

import React from 'react';
import { X, CheckCircle, Info, DollarSign, AlertCircle } from 'lucide-react';
import { formatFare, toBnDigits } from '../utils/localization';

export default function FareBreakdownModal({ isOpen, onClose, route, lang = 'bn' }) {
  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg p-5 sm:p-6 border border-emerald-500/40 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {lang === 'bn' ? 'ভাড়ার বিস্তারিত ও সরকারি নিয়মাবলী' : 'Fare Breakdown & Statutory Rules'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA) ও DMTCL নিয়মানুযায়ী' : 'BRTA & DMTCL Government Regulations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breakdown Items per Leg */}
        <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto pr-1">
          {route.legs.map((leg) => (
            <div key={leg.leg_number} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between font-bold text-sm text-white mb-1">
                <span>Leg {leg.leg_number}: {leg.line_name} ({leg.mode.toUpperCase()})</span>
                <span className="text-emerald-400">{formatFare(leg.regular_fare_bdt, lang)}</span>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>{lang === 'bn' ? 'সাধারণ ভাড়া:' : 'Regular Fare:'}</span>
                  <span>{formatFare(leg.regular_fare_bdt, lang)}</span>
                </div>

                <div className="flex items-center justify-between text-blue-300 font-semibold">
                  <span>{lang === 'bn' ? 'শিক্ষার্থী হাফ-পাস ভাড়া:' : 'Student Half-Pass Fare:'}</span>
                  <span>{formatFare(leg.student_fare_bdt, lang)}</span>
                </div>

                {leg.mode === 'bus' && (
                  <p className="text-[11px] text-emerald-400/90 pt-1 border-t border-slate-800/80">
                    {lang === 'bn' 
                      ? '✓ বাসে ৫০% শিক্ষার্থী ছাড় প্রযোজ্য (সর্বনিম্ন সরকারি ভাড়া ফ্লোর ১০ টাকা)।' 
                      : '✓ 50% student discount applied with statutory 10 BDT minimum floor.'}
                  </p>
                )}

                {leg.mode === 'metro' && (
                  <p className="text-[11px] text-amber-400/90 pt-1 border-t border-slate-800/80">
                    {lang === 'bn'
                      ? 'ℹ মেট্রোরেলে (MRT-6) শিক্ষার্থীদের হাফ-পাস প্রযোজ্য নয়। দূরত্নভিত্তিক ফিক্সড টিকিট।'
                      : 'ℹ MRT-6 Metro has no student discount. Distance-based fixed ticket.'}
                  </p>
                )}

                {leg.mode === 'rickshaw' && leg.surge_multiplier > 1.0 && (
                  <p className="text-[11px] text-rose-400/90 pt-1 border-t border-slate-800/80">
                    {lang === 'bn'
                      ? `⚡ আবহাওয়া বা ভিড়ের কারণে সার্জনযুক্ত (+${toBnDigits(Math.round((leg.surge_multiplier - 1) * 100))}% সার্জ)।`
                      : `⚡ Weather / congestion surge rate applied (+${Math.round((leg.surge_multiplier - 1) * 100)}% surge).`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Comparison Box */}
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">{lang === 'bn' ? 'সর্বমোট সাধারণ ভাড়া' : 'Total Regular Fare'}</span>
            <span className="text-lg font-black text-white">{formatFare(route.total_regular_fare, lang)}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-300 block font-bold">{lang === 'bn' ? 'সর্বমোট হাফ-পাস ভাড়া' : 'Total Student Fare'}</span>
            <span className="text-lg font-black text-blue-400">{formatFare(route.total_student_fare, lang)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
        >
          {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
        </button>
      </div>
    </div>
  );
}
