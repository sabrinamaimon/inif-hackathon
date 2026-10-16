'use client';

import React from 'react';
import { 
  Clock, DollarSign, ArrowRight, ShieldCheck, AlertTriangle, 
  Volume2, Download, HelpCircle, Train, Bus, Bike, Car, Navigation
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
      ? `${origin} থেকে ${destination} পৌঁছাতে আনুমানিক সময় লাগবে ${route.total_duration_mins} মিনিট। মোট সাধারণ ভাড়া ${route.total_regular_fare} টাকা, শিক্ষার্থীদের হাফ-পাস ভাড়া ${route.total_student_fare} টাকা। যাত্রাপথে ${route.legs.length}টি অংশ রয়েছে। প্রথম বাহন: ${route.legs[0].line_name}। ল্যান্ডমার্ক: ${route.legs[0].landmark_instructions}।`
      : `Transit plan from ${origin} to ${destination}. Estimated duration is ${route.total_duration_mins} minutes. Total regular fare is ${route.total_regular_fare} BDT, student half-pass is ${route.total_student_fare} BDT. Step one: board ${route.legs[0].line_name} at ${route.legs[0].from_hub}. Landmark: ${route.legs[0].landmark_instructions}.`;

    speakText(speechScript, lang);
  };

  return (
    <div className="my-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <span>{lang === 'bn' ? 'প্রস্তাবিত মাল্টি-মোডাল রুটসমূহ' : 'Recommended Multi-Modal Routes'}</span>
            <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              {lang === 'bn' ? `${toBnDigits(routes.length)}টি বিকল্প` : `${routes.length} options`}
            </span>
          </h3>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {lang === 'bn' ? 'সরাসরি গ্রাফ যাচাইকৃত ও বিকল্প ডিট্যুর সংবলিত' : 'Grounded against transit graph with active detour calculation'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteId === route.id || (!selectedRouteId && idx === 0);
          const hasSavings = route.total_regular_fare > route.total_student_fare;
          const savingsAmount = route.total_regular_fare - route.total_student_fare;

          let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
          if (route.is_detour) badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/50';
          else if (route.id.includes('cheapest')) badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/50';

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route)}
              className={`glass-panel p-5 sm:p-7 border transition-all cursor-pointer interactive-card ${
                isSelected 
                  ? 'border-emerald-400 ring-4 ring-emerald-500/30 bg-slate-900/95' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${badgeColor}`}>
                    {route.type_badge}
                  </span>
                  <h4 className="text-base sm:text-xl font-black text-white">
                    {lang === 'bn' ? route.title_bn : route.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 font-black text-emerald-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(route.total_duration_mins, lang)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 font-bold">
                    <span>{lang === 'bn' ? `${toBnDigits(route.transfers)} বদল` : `${route.transfers} transfers`}</span>
                  </div>
                </div>
              </div>

              {/* Disruption Warning if detour */}
              {route.disruption_warning && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-sm text-rose-300 flex items-center gap-2.5 font-medium">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{route.disruption_warning}</span>
                </div>
              )}

              {/* Step-by-Step Multi-Modal Legs */}
              <div className="space-y-3 mb-5">
                {route.legs.map((leg) => {
                  const ModeIcon = getModeIcon(leg.mode);
                  return (
                    <div 
                      key={leg.leg_number}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <ModeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-white text-base">
                            <span>{leg.line_name}</span>
                            <span className="text-slate-400 text-sm font-normal">({leg.from_hub} ➔ {leg.to_hub})</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                            <strong className="text-emerald-400">{t.landmarkInstruction}:</strong> {leg.landmark_instructions}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <span className="text-slate-400 font-medium">{leg.duration_mins}m</span>
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-400">
                            {passengerType === 'student' ? formatFare(leg.student_fare_bdt, lang) : formatFare(leg.regular_fare_bdt, lang)}
                          </span>
                          {passengerType === 'student' && leg.student_fare_bdt < leg.regular_fare_bdt && (
                            <span className="block text-xs text-slate-500 line-through">
                              {formatFare(leg.regular_fare_bdt, lang)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fare Summary & Action Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
                {/* Total Cost Display */}
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs sm:text-sm text-slate-400 font-semibold block">
                      {passengerType === 'student' ? t.studentFare : t.regularFare}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      {passengerType === 'student' 
                        ? formatFare(route.total_student_fare, lang) 
                        : formatFare(route.total_regular_fare, lang)}
                    </span>
                  </div>

                  {hasSavings && (
                    <div className="px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-xs sm:text-sm text-blue-300 font-black">
                      {t.savings}: {formatFare(savingsAmount, lang)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onOpenFareBreakdown(route); }}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                    title={t.viewFareBreakdown}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Bonus Action Buttons: TTS Audio & Download Offline Card */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleAudioBriefing(route); }}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.listenBriefing}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); generateOfflineRouteCard(route, origin, destination, lang); }}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-300 text-sm font-bold border border-emerald-500/50 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>{t.offlineCardBtn}</span>
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
