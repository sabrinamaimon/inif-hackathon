'use client';

import React from 'react';
import { Cpu, CloudRain, Clock, AlertOctagon, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';
import { I18N } from '../utils/localization';

export default function ScenarioSimulator({
  simulationState,
  onTriggerScenario,
  lang = 'bn'
}) {
  const t = I18N[lang] || I18N.bn;

  const isRain = simulationState.rain_active;
  const isRush = simulationState.rush_hour_active;
  const isShahbaghBlocked = simulationState.blocked_hubs.includes('Shahbagh');

  return (
    <div className="glass-panel p-5 sm:p-6 border border-emerald-500/30 my-0 shadow-2xl">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">{t.simulatorTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {lang === 'bn' ? 'আকস্মিক ট্রাফিক বিপর্যয়ে লাইভ ডিট্যুর পরীক্ষা করুন' : 'Test dynamic graph rerouting against disruptions'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onTriggerScenario({ action: 'reset' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all active:scale-95 shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.resetSim}</span>
        </button>
      </div>

      {/* Grid of Simulation Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Scenario 1: Heavy Monsoon Rain & Malibagh Waterlogging */}
        <div 
          onClick={() => onTriggerScenario({ action: 'toggle_rain' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer interactive-card ${
            isRain 
              ? 'bg-blue-950/70 border-blue-500 shadow-xl shadow-blue-500/30' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              isRain ? 'bg-blue-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
            }`}>
              {isRain ? (lang === 'bn' ? 'সক্রিয়' : 'ACTIVE') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
            </span>
          </div>

          <h4 className="text-base font-extrabold text-white mb-1.5">
            {lang === 'bn' ? 'মৌসুমী ভারী বৃষ্টি ও মালিবাগে জলজট' : 'Monsoon Rain & Malibagh Flood'}
          </h4>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {t.simRainDesc}
          </p>

          <div className="text-xs sm:text-sm text-blue-300 font-bold">
            {isRain ? (
              <span>⚡ {lang === 'bn' ? 'বাস স্থগিত; রিকশায় +৫০% ভাড়া বৃদ্ধি' : 'Buses stalled; +50% rickshaw surge'}</span>
            ) : (
              <span>➔ {lang === 'bn' ? 'বৃষ্টি বিপর্যয় পরীক্ষা করতে ট্যাপ করুন' : 'Tap to simulate rain flood'}</span>
            )}
          </div>
        </div>

        {/* Scenario 2: Peak 5:30 PM Office Rush Hour */}
        <div 
          onClick={() => onTriggerScenario({ action: 'toggle_rush' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer interactive-card ${
            isRush 
              ? 'bg-amber-950/70 border-amber-500 shadow-xl shadow-amber-500/30' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              isRush ? 'bg-amber-500 text-slate-950 font-black animate-pulse' : 'bg-slate-800 text-slate-300'
            }`}>
              {isRush ? (lang === 'bn' ? 'পিক আওয়ার' : 'PEAK RUSH') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
            </span>
          </div>

          <h4 className="text-base font-extrabold text-white mb-1.5">
            {lang === 'bn' ? 'বিকেল ৫:৩০ অফিস ছুটির তীব্র ভিড়' : '5:30 PM Office Rush Hour'}
          </h4>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {t.simRushDesc}
          </p>

          <div className="text-xs sm:text-sm text-amber-300 font-bold">
            {isRush ? (
              <span>⚡ {lang === 'bn' ? 'ফার্মগেট ও শাহবাগে দ্বিগুণ ভ্রমণ সময়' : 'Farmgate & Shahbagh travel time 2x'}</span>
            ) : (
              <span>➔ {lang === 'bn' ? 'অফিস ছুটির যানজট পরীক্ষা করুন' : 'Tap to simulate rush hour'}</span>
            )}
          </div>
        </div>

        {/* Scenario 3: Shahbagh Intersection Blockade */}
        <div 
          onClick={() => onTriggerScenario({ action: 'block_hub', hub: 'Shahbagh' })}
          className={`p-5 rounded-2xl border transition-all cursor-pointer interactive-card ${
            isShahbaghBlocked 
              ? 'bg-rose-950/70 border-rose-500 shadow-xl shadow-rose-500/30' 
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              isShahbaghBlocked ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'
            }`}>
              {isShahbaghBlocked ? (lang === 'bn' ? 'রাস্তা বন্ধ' : 'BLOCKED') : (lang === 'bn' ? 'খোলা' : 'OPEN')}
            </span>
          </div>

          <h4 className="text-base font-extrabold text-white mb-1.5">
            {lang === 'bn' ? 'শাহবাগ মোড়ে ছাত্র সমাবেশ ও ব্যারিকেড' : 'Shahbagh Protest Blockade'}
          </h4>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {t.simBlockDesc}
          </p>

          <div className="text-xs sm:text-sm text-rose-300 font-bold">
            {isShahbaghBlocked ? (
              <span>🛡️ {lang === 'bn' ? 'সড়ক পথ বন্ধ, কিন্তু মেট্রোরেল চালু!' : 'Surface blocked; Metro operational!'}</span>
            ) : (
              <span>➔ {lang === 'bn' ? 'শাহবাগ ব্যারিকেড পরীক্ষা করুন' : 'Tap to simulate blockade'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
