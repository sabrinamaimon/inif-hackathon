'use client';

import React from 'react';
import { X, CheckCircle, Info, DollarSign, AlertCircle } from 'lucide-react';
import { formatFare, toBnDigits } from '../utils/localization';

export default function FareBreakdownModal({ isOpen, onClose, route, lang = 'bn' }) {
  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0a0705]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="heritage-card w-full max-w-lg p-5 sm:p-6 border-2 border-[#c69429] bg-[#1a130f] shadow-2xl relative rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c69429]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b83a2e]/30 text-[#f6d16f] border border-[#b83a2e] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-rickshaw text-lg font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
                {lang === 'bn' ? 'ভাড়ার বিস্তারিত ও সরকারি নিয়মাবলী' : 'Fare Breakdown & Statutory Rules'}
              </h3>
              <p className="font-anek text-xs text-[#dfcfb2]">
                {lang === 'bn' ? 'বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (বিআরটিএ) ও ডিএমটিসিএল নিয়মানুযায়ী' : 'BRTA & DMTCL Government Regulations'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white border border-[#c69429]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breakdown Items per Leg */}
        <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto pr-1 font-anek">
          {route.legs.map((leg) => {
            const legTitleText = lang === 'bn' ? (leg.line_name_bn || leg.line_name) : leg.line_name;
            const legModeTag = lang === 'bn' 
              ? (leg.mode === 'metro' ? 'মেট্রোরেল' : leg.mode === 'bus' ? 'বাস' : leg.mode === 'cng' ? 'সিএনজি' : leg.mode === 'bike' ? 'বাইক' : leg.mode === 'car' ? 'প্রাইভেট কার' : 'রিকশা')
              : leg.mode.toUpperCase();
            return (
            <div key={leg.leg_number} className="p-3.5 rounded-xl bg-[#16110d] border border-[#c69429]/30">
              <div className="flex items-center justify-between font-bold text-sm text-[#fbf8f1] mb-1.5">
                <span>{lang === 'bn' ? `পর্ব ${toBnDigits(leg.leg_number)}` : `Leg ${leg.leg_number}`}: {legTitleText} ({legModeTag})</span>
                <span className="font-rickshaw text-base text-[#f6d16f] font-bold">{formatFare(leg.regular_fare_bdt, lang)}</span>
              </div>

              <div className="text-xs text-[#dfcfb2] space-y-1">
                <div className="flex items-center justify-between">
                  <span>{lang === 'bn' ? 'সাধারণ ভাড়া:' : 'Regular Fare:'}</span>
                  <span className="font-semibold text-[#fbf8f1]">{formatFare(leg.regular_fare_bdt, lang)}</span>
                </div>

                <div className="flex items-center justify-between text-[#7dd3fc] font-semibold">
                  <span>{lang === 'bn' ? 'শিক্ষার্থী হাফ-পাস ভাড়া:' : 'Student Half-Pass Fare:'}</span>
                  <span className="font-bold">{formatFare(leg.student_fare_bdt, lang)}</span>
                </div>

                {leg.mode === 'bus' && (
                  <p className="text-[11px] text-[#7dd3fc] pt-1.5 border-t border-[#c69429]/20 font-medium">
                    {lang === 'bn' 
                      ? '✓ বাসে ৫০% শিক্ষার্থী ছাড় প্রযোজ্য (সর্বনিম্ন সরকারি ভাড়া ফ্লোর ১০ টাকা)।' 
                      : '✓ 50% student discount applied with statutory 10 BDT minimum floor.'}
                  </p>
                )}

                {leg.mode === 'metro' && (
                  <p className="text-[11px] text-[#f6d16f] pt-1.5 border-t border-[#c69429]/20 font-medium">
                    {lang === 'bn'
                      ? 'ℹ মেট্রোরেলে (এমআরটি-৬) শিক্ষার্থীদের হাফ-পাস প্রযোজ্য নয়। দূরত্বভিত্তিক ফিক্সড টিকিট।'
                      : 'ℹ MRT-6 Metro has no student discount. Distance-based fixed ticket.'}
                  </p>
                )}

                {leg.mode === 'cng' && (
                  <p className="text-[11px] text-[#fbbf24] pt-1.5 border-t border-[#c69429]/20 font-medium">
                    {lang === 'bn'
                      ? '🚕 বিআরটিএ সিএনজি মিটার রেট (প্রথম ২ কিমি ৪০ ৳, পরবর্তী প্রতি কিমি ১২ ৳) ও সর্বনিম্ন চুক্তি ১০০ ৳।'
                      : '🚕 BRTA CNG meter rate (first 2 km 40 BDT, subsequent 12 BDT/km) with 100 BDT minimum contract floor.'}
                  </p>
                )}

                {leg.mode === 'rickshaw' && leg.surge_multiplier > 1.0 && (
                  <p className="text-[11px] text-[#f87171] pt-1.5 border-t border-[#c69429]/20 font-medium">
                    {lang === 'bn'
                      ? `⚡ আবহাওয়া বা ভিড়ের কারণে সার্জযুক্ত (+${toBnDigits(Math.round((leg.surge_multiplier - 1) * 100))}% সার্জ)।`
                      : `⚡ Weather or congestion surge rate applied (+${Math.round((leg.surge_multiplier - 1) * 100)}% surge).`}
                  </p>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Total Comparison Box */}
        <div className="p-3.5 rounded-xl bg-[#201712] border-2 border-[#c69429]/40 flex items-center justify-between font-anek">
          <div>
            <span className="text-xs text-[#dfcfb2] block">{lang === 'bn' ? 'সর্বমোট সাধারণ ভাড়া' : 'Total Regular Fare'}</span>
            <span className="font-rickshaw text-2xl font-bold text-[#f6d16f] rickshaw-text-pop">{formatFare(route.total_regular_fare, lang)}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#7dd3fc] block font-bold">{lang === 'bn' ? 'সর্বমোট হাফ-পাস ভাড়া' : 'Total Student Fare'}</span>
            <span className="font-rickshaw text-2xl font-bold text-[#7dd3fc]">{formatFare(route.total_student_fare, lang)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-[#292019] hover:bg-[#382b22] text-[#dfcfb2] hover:text-[#fbf8f1] font-anek font-bold text-xs border border-[#c69429]/30 transition-colors"
        >
          {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
        </button>
      </div>
    </div>
  );
}
