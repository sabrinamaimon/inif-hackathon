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
    <div className="my-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>{lang === 'bn' ? 'প্রস্তাবিত মাল্টি-মোডাল রুটসমূহ' : 'Recommended Multi-Modal Routes'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {lang === 'bn' ? `${toBnDigits(routes.length)}টি বিকল্প` : `${routes.length} options`}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? 'সরাসরি গ্রাফ যাচাইকৃত ও বিকল্প ডিট্যুর সংবলিত' : 'Grounded against transit graph with active detour calculation'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteId === route.id || (!selectedRouteId && idx === 0);
          const hasSavings = route.total_regular_fare > route.total_student_fare;
          const savingsAmount = route.total_regular_fare - route.total_student_fare;

          let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          if (route.is_detour) badgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          else if (route.id.includes('cheapest')) badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/40';

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute && onSelectRoute(route)}
              className={`glass-panel p-4 sm:p-5 border transition-all cursor-pointer interactive-card ${
                isSelected 
                  ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-slate-900/90' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${badgeColor}`}>
                    {route.type_badge}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-white">
                    {lang === 'bn' ? route.title_bn : route.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(route.total_duration_mins, lang)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-semibold">
                    <span>{lang === 'bn' ? `${toBnDigits(route.transfers)} বদল` : `${route.transfers} transfers`}</span>
                  </div>
                </div>
              </div>

              {/* Disruption Warning if detour */}
              {route.disruption_warning && (
                <div className="mb-3 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{route.disruption_warning}</span>
                </div>
              )}

              {/* Step-by-Step Multi-Modal Legs */}
              <div className="space-y-2 mb-4">
                {route.legs.map((leg) => {
                  const ModeIcon = getModeIcon(leg.mode);
                  return (
                    <div 
                      key={leg.leg_number}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start sm:items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <ModeIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{leg.line_name}</span>
                            <span className="text-slate-500 font-normal">({leg.from_hub} ➔ {leg.to_hub})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            <span className="text-emerald-400 font-semibold">{t.landmarkInstruction}:</span> {leg.landmark_instructions}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <span className="text-slate-400">{leg.duration_mins}m</span>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400">
                            {passengerType === 'student' ? formatFare(leg.student_fare_bdt, lang) : formatFare(leg.regular_fare_bdt, lang)}
                          </span>
                          {passengerType === 'student' && leg.student_fare_bdt < leg.regular_fare_bdt && (
                            <span className="block text-[10px] text-slate-500 line-through">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                {/* Total Cost Display */}
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {passengerType === 'student' ? t.studentFare : t.regularFare}
                    </span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400">
                      {passengerType === 'student' 
                        ? formatFare(route.total_student_fare, lang) 
                        : formatFare(route.total_regular_fare, lang)}
                    </span>
                  </div>

                  {hasSavings && (
                    <div className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[11px] text-blue-300 font-bold">
                      {t.savings}: {formatFare(savingsAmount, lang)}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onOpenFareBreakdown(route); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition-colors"
                    title={t.viewFareBreakdown}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {/* Bonus Action Buttons: TTS Audio & Download Offline Card */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleAudioBriefing(route); }}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.listenBriefing}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); generateOfflineRouteCard(route, origin, destination, lang); }}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
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
