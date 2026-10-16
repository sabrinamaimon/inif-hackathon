'use client';

import React from 'react';
import { 
  Clock, DollarSign, ArrowRight, ShieldCheck, AlertTriangle, 
  Volume2, Download, HelpCircle, Train, Bus, Bike, Car, Navigation, Sparkles, MapPin
} from 'lucide-react';
import { I18N, formatFare, formatDuration, toBnDigits } from '../utils/localization';
import { speakText } from '../utils/speech';
import { generateOfflineRouteCard } from '../utils/offlineCard';

export default function RouteResults({ 
  routes = [], 
  origin, 
  destination, 
  passengerType = 'general', 
  lang = 'bn',
  onSelectRoute,
  onOpenFareBreakdown,
  selectedRouteId
}) {
  const t = I18N[lang] || I18N.bn;

  if (!routes || routes.length === 0) {
    return null;
  }

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'metro': return Train;
      case 'bus': return Bus;
      case 'leguna': return Car;
      case 'rickshaw': return Bike;
      default: return Navigation;
    }
  };

  const handleAudioBriefing = (route) => {
    const speechScript = lang === 'bn'
      ? `${origin} থেকে ${destination} পৌঁছাতে আনুমানিক সময় লাগবে ${route.total_duration_mins} মিনিট। মোট সাধারণ ভাড়া ${route.total_regular_fare} টাকা, শিক্ষার্থীদের হাফ-পাস ভাড়া ${route.total_student_fare} টাকা। যাত্রাপথে মোট ${route.legs.length}টি অংশ রয়েছে। প্রথম বাহন: ${route.legs[0].line_name}। ল্যান্ডমার্ক: ${route.legs[0].landmark_instructions}। সাবধানে চলাচল করুন।`
      : `Transit itinerary from ${origin} to ${destination}. Estimated duration is ${route.total_duration_mins} minutes. Total regular fare is ${route.total_regular_fare} BDT, student half-pass is ${route.total_student_fare} BDT. Step one: board ${route.legs[0].line_name} at ${route.legs[0].from_hub}. Landmark: ${route.legs[0].landmark_instructions}. Have a safe journey.`;

    speakText(speechScript, lang);
  };

  // Select vintage postcard artwork corresponding to destinations / route types
  const getPostcardTheme = (route, idx) => {
    if (idx === 0) {
      return {
        bgImage: '/assets/postcard_shapla_motijheel.jpg',
        badgeTitle: lang === 'bn' ? 'রুট ১' : 'Route 1',
        badgeBg: 'bg-[#e2b448] text-[#120e0b] border-[#fbf8f1]',
        accent: '#c69429',
        border: 'border-[#c69429]'
      };
    } else if (idx === 1 || route.type_badge?.toLowerCase().includes('student')) {
      return {
        bgImage: '/assets/postcard_lalbagh_fort.jpg',
        badgeTitle: lang === 'bn' ? 'রুট ২' : 'Route 2',
        badgeBg: 'bg-[#b83a2e] text-[#fbf8f1] border-[#f6d16f]',
        accent: '#b83a2e',
        border: 'border-[#b83a2e]'
      };
    } else {
      return {
        bgImage: '/assets/postcard_ahsan_manzil.jpg',
        badgeTitle: lang === 'bn' ? 'রুট ৩' : 'Route 3',
        badgeBg: 'bg-[#15453b] text-[#f6d16f] border-[#f6d16f]',
        accent: '#15453b',
        border: 'border-[#15453b]'
      };
    }
  };

  return (
    <div className="my-8 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-[#c69429]/40">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✉️</span>
          <h3 className="font-rickshaw text-2xl sm:text-3xl md:text-4xl font-bold text-[#f6d16f] tracking-wide rickshaw-text-pop">
            {lang === 'bn' ? 'বাংলাদেশ পোস্টকার্ড ট্রানজিট কার্ড' : 'Bangladesh Postcard Commute Cards'}
          </h3>
        </div>

        {/* Listen Audio Callout */}
        <div className="flex items-center gap-2 bg-[#1c1511] px-3.5 py-1.5 rounded-xl border border-[#c69429]/50 text-xs font-anek text-[#f6d16f]">
          <Volume2 className="w-4 h-4 text-[#f6d16f] animate-pulse" />
          <span>{lang === 'bn' ? 'পড়ে শোনানোর জন্য অডিও বাটনে ট্যাপ করুন' : 'Tap audio button for voice readout'}</span>
        </div>
      </div>

      {/* Commute Postcards */}
      <div className="grid grid-cols-1 gap-7">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteId === route.id || (!selectedRouteId && idx === 0);
          const hasSavings = route.total_regular_fare > route.total_student_fare;
          const savingsAmount = route.total_regular_fare - route.total_student_fare;
          const postcardTheme = getPostcardTheme(route, idx);

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route)}
              className={`rounded-2xl border-4 transition-all cursor-pointer relative overflow-hidden shadow-2xl bg-[#1a1410] ${postcardTheme.border} ${
                isSelected 
                  ? 'ring-4 ring-[#f6d16f] scale-[1.01]' 
                  : 'hover:border-[#f6d16f]'
              }`}
            >
              {/* ========================================================= */}
              {/* 1. ARTWORK IN THE BACKGROUND WITH LOWERED TRANSPARENCY    */}
              {/* (User requested: "lower transparency of art in background") */}
              {/* ========================================================= */}
              <div 
                className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${postcardTheme.bgImage})`,
                  opacity: 0.18, // Lowered transparency so the route stays in sharp, crystal-clear focus!
                  filter: 'saturate(120%) contrast(110%)'
                }}
              />

              {/* Inner vintage air mail perforated border dash */}
              <div className="absolute inset-2 border-2 border-dashed border-[#c69429]/30 rounded-xl pointer-events-none" />

              {/* Postcard Top Strip */}
              <div className="relative z-10 px-5 sm:px-7 py-3.5 bg-[#14100c]/90 border-b border-[#c69429]/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs sm:text-sm font-anek font-black px-3.5 py-1 rounded-xl border shadow-md ${postcardTheme.badgeBg}`}>
                    {postcardTheme.badgeTitle}
                  </span>
                  <span className="text-xs font-regal tracking-widest text-[#dfcfb2] uppercase hidden md:inline">
                    BANGLADESH POSTAGE • ISSUE 2026
                  </span>
                </div>

                {/* Circular Postal Seal Stamp on Card */}
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#f6d16f] bg-black/50 px-3 py-1 rounded-xl border border-[#c69429]/40">
                  <span className="w-2 h-2 rounded-full bg-[#f6d16f] animate-ping" />
                  <span>{lang === 'bn' ? 'সরাসরি যাচাইকৃত রুট' : 'GROUNDED GRAPH ROUTE'}</span>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. THE ROUTE IN THE CENTER: IN SHARP FOCUS & MUCH LARGER  */}
              {/* (User requested: "the route should be much larger for older people") */}
              {/* ========================================================= */}
              <div className="relative z-10 p-5 sm:p-7 space-y-5">
                {/* Central Focused Route Ledger (High Contrast & Clear) */}
                <div className="bg-[#fcf9f2] text-[#120e0b] p-4 sm:p-6 rounded-2xl border-2 border-[#c69429] shadow-xl overflow-hidden">
                  {/* Huge Route Banner (Origin ➔ Destination) */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b-2 border-[#c69429]/40">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-anek font-bold text-[#b83a2e] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#b83a2e] shrink-0" />
                        <span>{lang === 'bn' ? 'সরাসরি যাত্রাপথ' : 'DIRECT TRANSIT CORRIDOR'}</span>
                      </div>
                      
                      {/* HUGE ROUTE DISPLAY */}
                      <h4 className="font-anek text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#120e0b] tracking-tight flex items-center flex-wrap gap-2.5">
                        <span>{origin}</span>
                        <span className="text-[#b83a2e] text-2xl sm:text-3xl font-black">➔</span>
                        <span className="text-[#15453b]">{destination}</span>
                      </h4>

                      <p className="font-anek text-base sm:text-lg font-bold text-[#b83a2e] mt-1">
                        {lang === 'bn' ? route.title_bn : route.title}
                      </p>
                    </div>

                    {/* Resized & Responsive Metric Badges Bar */}
                    <div className="w-full xl:w-auto flex items-center justify-around sm:justify-end gap-2 sm:gap-3 bg-[#f5eedf] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border-2 border-[#c69429]/40 shadow-inner shrink-0">
                      {/* Total Duration */}
                      <div className="px-2.5 sm:px-3.5 text-center border-r-2 border-[#c69429]/30 flex-1 sm:flex-initial">
                        <div className="text-xs sm:text-sm font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          {t.durationLabel}
                        </div>
                        <div className="flex items-baseline justify-center gap-1 text-[#15453b] whitespace-nowrap">
                          <span className="font-anek text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(route.total_duration_mins) : route.total_duration_mins}
                          </span>
                          <span className="font-anek text-xs sm:text-sm font-bold text-[#15453b]/80">
                            {lang === 'bn' ? 'মিনিট' : 'mins'}
                          </span>
                        </div>
                      </div>

                      {/* Regular Fare */}
                      <div className="px-2.5 sm:px-3.5 text-center border-r-2 border-[#c69429]/30 flex-1 sm:flex-initial">
                        <div className="text-xs sm:text-sm font-anek font-bold text-[#7a6654] uppercase tracking-wider mb-0.5">
                          {t.regularFare}
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 text-[#b83a2e] whitespace-nowrap">
                          <span className="font-anek text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(route.total_regular_fare) : route.total_regular_fare}
                          </span>
                          <span className="font-anek text-sm sm:text-base font-extrabold text-[#b83a2e] ml-0.5">
                            {lang === 'bn' ? '৳' : 'BDT'}
                          </span>
                        </div>
                      </div>

                      {/* Student Half-Pass Fare */}
                      <div className="px-2.5 sm:px-3.5 text-center flex-1 sm:flex-initial">
                        <div className="text-xs sm:text-sm font-anek font-extrabold text-[#0e6e41] uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 whitespace-nowrap">
                          <span>🎓 {t.studentFare}</span>
                        </div>
                        <div className="flex items-baseline justify-center gap-0.5 text-[#0e6e41] whitespace-nowrap">
                          <span className="font-anek text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {lang === 'bn' ? toBnDigits(route.total_student_fare) : route.total_student_fare}
                          </span>
                          <span className="font-anek text-sm sm:text-base font-extrabold text-[#0e6e41] ml-0.5">
                            {lang === 'bn' ? '৳' : 'BDT'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Savings Callout Strip */}
                  {hasSavings && (
                    <div className="mt-3.5 py-2.5 px-4 rounded-xl bg-[#0e6e41]/10 border border-[#0e6e41]/40 flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-anek font-bold text-[#0e6e41]">
                      <span className="flex items-center gap-1.5">
                        <span>🎓 সরকারি শিক্ষার্থী ৫০% হাফ-পাস ছাড় প্রযোজ্য (বাসে সর্বনিম্ন ভাড়া ১০ ৳)।</span>
                      </span>
                      <span className="text-sm sm:text-base font-anek font-extrabold bg-[#0e6e41] text-white px-3 py-1 rounded-lg shadow-sm">
                        সাশ্রয়: {formatFare(savingsAmount, lang)}
                      </span>
                    </div>
                  )}

                  {/* Step-by-Step Large Print Instructions */}
                  <div className="mt-6 space-y-3.5">
                    <div className="font-anek text-base sm:text-lg font-extrabold text-[#120e0b] border-b border-[#c69429]/20 pb-2 flex items-center gap-2">
                      <span className="text-[#b83a2e] text-lg">✦</span>
                      <span>{lang === 'bn' ? 'যাত্রার প্রতিটি ধাপ ও ওঠার স্থান (বড় অক্ষরে বিস্তারিত):' : 'Step-by-Step Boarding & Landmark Instructions:'}</span>
                    </div>

                    <div className="space-y-3.5">
                      {route.legs.map((leg, legIdx) => {
                        const ModeIcon = getModeIcon(leg.mode);
                        return (
                          <div 
                            key={legIdx}
                            className="p-4 sm:p-5 rounded-xl bg-[#ffffff] border-2 border-[#c69429]/30 hover:border-[#b83a2e] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-sm"
                          >
                            <div className="flex items-start gap-3.5">
                              {/* Large Step Number Badge */}
                              <div className="w-9 h-9 rounded-full bg-[#b83a2e] text-white flex items-center justify-center font-bold font-mono text-lg shrink-0 shadow-md">
                                {legIdx + 1}
                              </div>

                              <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <span className="font-anek font-black text-lg sm:text-xl text-[#120e0b]">
                                    {leg.line_name}
                                  </span>
                                  <span className="text-xs sm:text-sm px-3 py-0.5 rounded-md bg-[#15453b]/15 text-[#15453b] font-anek font-bold border border-[#15453b]/30 uppercase">
                                    {leg.mode}
                                  </span>
                                  <span className="text-sm font-mono font-semibold text-[#7a6654]">
                                    ({leg.from_hub} ➔ {leg.to_hub})
                                  </span>
                                </div>

                                {/* Large Boarding Landmark for Easy Reading */}
                                <div className="font-anek text-base sm:text-lg font-bold text-[#b83a2e] mt-1.5 pl-1.5 border-l-2 border-[#b83a2e]">
                                  <span>ওঠার স্থান / ল্যান্ডমার্ক: </span>
                                  <span className="text-[#120e0b] font-semibold">{leg.landmark_instructions}</span>
                                </div>
                              </div>
                            </div>

                            {/* Leg Metrics */}
                            <div className="flex items-center gap-2.5 sm:gap-3 font-anek text-sm sm:text-base font-bold text-[#120e0b] shrink-0 pl-11 md:pl-0">
                              <span className="px-3 py-1.5 rounded-lg bg-[#f5eedf] border border-[#c69429]/40 text-[#15453b]">
                                ⏱ {formatDuration(leg.duration_mins, lang)}
                              </span>
                              <span className="px-3 py-1.5 rounded-lg bg-[#b83a2e]/10 text-[#b83a2e] border border-[#b83a2e]/30">
                                {formatFare(leg.regular_fare_bdt, lang)}
                              </span>
                              {leg.student_fare_bdt < leg.regular_fare_bdt && (
                                <span className="px-3 py-1.5 rounded-lg bg-[#0e6e41]/10 text-[#0e6e41] border border-[#0e6e41]/30">
                                  🎓 {formatFare(leg.student_fare_bdt, lang)}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Large Action Buttons for Easy Accessibility */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Big Audio Readout Button (Very helpful for older people!) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAudioBriefing(route);
                      }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#292019] to-[#3d3026] hover:from-[#3d3026] hover:to-[#59473a] text-[#f6d16f] font-anek font-bold text-sm sm:text-base border-2 border-[#c69429] active:scale-95 transition-all shadow-lg"
                      title="Audio voice readout of itinerary"
                    >
                      <Volume2 className="w-5 h-5 text-[#f6d16f]" />
                      <span>{lang === 'bn' ? '🔊 পড়ে শোনান (অডিও ব্রিফিং)' : '🔊 Read Aloud (Audio)'}</span>
                    </button>

                    {/* Download Large-Print Offline Postcard */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateOfflineRouteCard({ route, origin, destination, lang });
                      }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#15453b] to-[#0d342c] hover:from-[#1f5e51] hover:to-[#15453b] text-[#fbf8f1] font-anek font-bold text-sm sm:text-base border-2 border-[#2a6f62] active:scale-95 transition-all shadow-lg"
                      title="Download offline commute card"
                    >
                      <Download className="w-5 h-5 text-[#6ee7b7]" />
                      <span>{lang === 'bn' ? '💾 অফলাইন রুট কার্ড ডাউনলোড' : '💾 Save Offline Commute Card'}</span>
                    </button>
                  </div>

                  {/* View Detailed Breakdown */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFareBreakdown && onOpenFareBreakdown(route);
                    }}
                    className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-anek font-bold text-sm sm:text-base border-2 border-[#f6d16f] active:scale-95 transition-all shadow-lg ml-auto"
                  >
                    <HelpCircle className="w-4 h-4 text-[#f6d16f]" />
                    <span>{t.viewFareBreakdown}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
