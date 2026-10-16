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
    <div className="heritage-card p-5 sm:p-6 my-6 border-2 border-[#c69429]/50 shadow-2xl relative overflow-hidden bg-[#18130f]">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-[#c69429]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl sim-warning-icon-inactive flex items-center justify-center shadow-sm">
            <Cpu className="w-5 h-5 text-[#b83a2e]" />
          </div>
          <div>
            <h3 className="font-rickshaw text-2xl sm:text-3xl text-[#f6d16f] rickshaw-text-pop">
              {t.simulatorTitle}
            </h3>
            <p className="font-anek text-xs sm:text-sm text-[#dfcfb2]">
              {lang === 'bn' 
                ? 'আকস্মিক ট্রাফিক বিপর্যয় বা আবহাওয়া পরিবর্তনে রুট ডিট্যুর ও রিকশা ভাড়ার বৃদ্ধি পরীক্ষা করুন' 
                : 'Test dynamic graph rerouting against sudden urban disruptions and rickshaw surges'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onTriggerScenario({ action: 'reset' })}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#292019] hover:bg-[#3d3026] text-[#f6d16f] text-xs font-anek font-bold border border-[#c69429]/50 transition-all active:scale-95 shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#f6d16f]" />
          <span>{t.resetSim}</span>
        </button>
      </div>

      {/* Grid of Simulation Triggers with Rickshaw Art Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scenario 1: Heavy Monsoon Rain & Malibagh Waterlogging */}
        <div 
          onClick={() => onTriggerScenario({ action: 'toggle_rain' })}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer interactive-card ${
            isRain 
              ? 'sim-card-active bg-[#15453b] border-[#6ee7b7] shadow-xl shadow-[#15453b]/40 ring-2 ring-[#6ee7b7]/30' 
              : 'bg-[#1c1511]/90 border-[#c69429]/30 hover:border-[#c69429]'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isRain
                ? 'bg-[#1c4568]/40 border border-[#346894] text-[#7dd3fc]'
                : 'sim-warning-icon-inactive'
            }`}>
              <CloudRain className={`w-4 h-4 ${isRain ? 'text-[#7dd3fc]' : 'text-[#b83a2e]'}`} />
            </div>
            <span className={`text-[11px] font-anek font-black px-2.5 py-0.5 rounded-full border ${
              isRain ? 'bg-[#6ee7b7] text-[#120e0b] border-white animate-pulse' : 'bg-[#292019] text-[#dfcfb2] border-[#c69429]/30'
            }`}>
              {isRain ? (lang === 'bn' ? 'সক্রিয়' : 'ACTIVE') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
            </span>
          </div>

          <h4 
            className={`font-rickshaw text-lg mb-1 transition-colors ${
              isRain ? 'text-white !text-white' : 'text-[#fbf8f1]'
            }`}
            style={isRain ? { color: '#ffffff' } : undefined}
          >
            {lang === 'bn' ? 'মৌসুমী ভারী বৃষ্টি ও মালিবাগে জলজট' : 'Monsoon Rain & Malibagh Flood'}
          </h4>
          <p 
            className={`font-anek text-xs mb-3 leading-relaxed transition-colors ${
              isRain ? 'text-white/95 !text-white' : 'text-[#dfcfb2]'
            }`}
            style={isRain ? { color: 'rgba(255, 255, 255, 0.95)' } : undefined}
          >
            {t.simRainDesc}
          </p>

          <div className={`text-[11px] font-anek font-bold p-2 rounded-lg border transition-all ${
            isRain 
              ? 'bg-black/50 text-white border-[#6ee7b7]/40 shadow-inner' 
              : 'bg-black/40 text-[#6ee7b7] border-[#c69429]/20'
          }`}>
            {isRain ? (
              <span className="text-white font-extrabold" style={{ color: '#ffffff' }}>
                {lang === 'bn' ? 'বাস চলাচল বন্ধ; রিকশায় +৫০% রেইন সার্ঝ' : 'Buses stalled; +50% rickshaw surge'}
              </span>
            ) : (
              <span>➔ {lang === 'bn' ? 'বৃষ্টি বিপর্যয় পরীক্ষা করতে ট্যাপ করুন' : 'Tap to simulate rain flood'}</span>
            )}
          </div>
        </div>

        {/* Scenario 2: Peak 5:30 PM Office Rush Hour */}
        <div 
          onClick={() => onTriggerScenario({ action: 'toggle_rush' })}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer interactive-card ${
            isRush 
              ? 'sim-card-active bg-[#b83a2e] border-[#f6d16f] shadow-xl shadow-[#b83a2e]/40 ring-2 ring-[#f6d16f]/30' 
              : 'bg-[#1c1511]/90 border-[#c69429]/30 hover:border-[#c69429]'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isRush
                ? 'bg-[#b83a2e]/30 border border-[#b83a2e] text-[#f6d16f]'
                : 'sim-warning-icon-inactive'
            }`}>
              <Clock className={`w-4 h-4 ${isRush ? 'text-[#f6d16f]' : 'text-[#b83a2e]'}`} />
            </div>
            <span className={`text-[11px] font-anek font-black px-2.5 py-0.5 rounded-full border ${
              isRush ? 'bg-[#f6d16f] text-[#120e0b] border-white animate-pulse' : 'bg-[#292019] text-[#dfcfb2] border-[#c69429]/30'
            }`}>
              {isRush ? (lang === 'bn' ? 'পিক আওয়ার' : 'PEAK RUSH') : (lang === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
            </span>
          </div>

          <h4 
            className={`font-rickshaw text-lg mb-1 transition-colors ${
              isRush ? 'text-white !text-white' : 'text-[#fbf8f1]'
            }`}
            style={isRush ? { color: '#ffffff' } : undefined}
          >
            {lang === 'bn' ? 'বিকেল ৫:৩০ অফিস ছুটির তীব্র ভিড়' : '5:30 PM Office Rush Hour'}
          </h4>
          <p 
            className={`font-anek text-xs mb-3 leading-relaxed transition-colors ${
              isRush ? 'text-white/95 !text-white' : 'text-[#dfcfb2]'
            }`}
            style={isRush ? { color: 'rgba(255, 255, 255, 0.95)' } : undefined}
          >
            {t.simRushDesc}
          </p>

          <div className={`text-[11px] font-anek font-bold p-2 rounded-lg border transition-all ${
            isRush 
              ? 'bg-black/50 text-white border-[#f6d16f]/40 shadow-inner' 
              : 'bg-black/40 text-[#f6d16f] border-[#c69429]/20'
          }`}>
            {isRush ? (
              <span className="text-white font-extrabold" style={{ color: '#ffffff' }}>
                {lang === 'bn' ? 'ফার্মগেট ও শাহবাগে দ্বিগুণ ভ্রমণ সময় ও ভাড়া বৃদ্ধি' : 'Farmgate & Shahbagh travel time 2x'}
              </span>
            ) : (
              <span>➔ {lang === 'bn' ? 'পিক আওয়ার পরীক্ষা করতে ট্যাপ করুন' : 'Tap to simulate rush hour'}</span>
            )}
          </div>
        </div>

        {/* Scenario 3: Shahbagh Intersection Blockade */}
        <div 
          onClick={() => onTriggerScenario({ action: 'block_hub', hub: 'Shahbagh' })}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer interactive-card ${
            isShahbaghBlocked 
              ? 'sim-card-active bg-[#52110c] border-[#d6645a] shadow-xl shadow-[#52110c]/40 ring-2 ring-[#d6645a]/30' 
              : 'bg-[#1c1511]/90 border-[#c69429]/30 hover:border-[#c69429]'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isShahbaghBlocked
                ? 'bg-[#52110c]/50 border border-[#b83a2e] text-[#d6645a]'
                : 'sim-warning-icon-inactive'
            }`}>
              <AlertOctagon className={`w-4 h-4 ${isShahbaghBlocked ? 'text-[#d6645a]' : 'text-[#b83a2e]'}`} />
            </div>
            <span className={`text-[11px] font-anek font-black px-2.5 py-0.5 rounded-full border ${
              isShahbaghBlocked ? 'bg-[#b83a2e] text-white border-white animate-pulse' : 'bg-[#292019] text-[#dfcfb2] border-[#c69429]/30'
            }`}>
              {isShahbaghBlocked ? (lang === 'bn' ? 'অবরোধ সক্রিয়' : 'BLOCKADE') : (lang === 'bn' ? 'স্বাভাবিক' : 'CLEAR')}
            </span>
          </div>

          <h4 
            className={`font-rickshaw text-lg mb-1 transition-colors ${
              isShahbaghBlocked ? 'text-white !text-white' : 'text-[#fbf8f1]'
            }`}
            style={isShahbaghBlocked ? { color: '#ffffff' } : undefined}
          >
            {lang === 'bn' ? 'শাহবাগ মোড়ে সমাবেশ ও ব্যারিকেড' : 'Shahbagh Protest Blockade'}
          </h4>
          <p 
            className={`font-anek text-xs mb-3 leading-relaxed transition-colors ${
              isShahbaghBlocked ? 'text-white/95 !text-white' : 'text-[#dfcfb2]'
            }`}
            style={isShahbaghBlocked ? { color: 'rgba(255, 255, 255, 0.95)' } : undefined}
          >
            {t.simBlockDesc}
          </p>

          <div className={`text-[11px] font-anek font-bold p-2 rounded-lg border transition-all ${
            isShahbaghBlocked 
              ? 'bg-black/50 text-white border-[#d6645a]/40 shadow-inner' 
              : 'bg-black/40 text-[#d6645a] border-[#c69429]/20'
          }`}>
            {isShahbaghBlocked ? (
              <span className="text-white font-extrabold" style={{ color: '#ffffff' }}>
                {lang === 'bn' ? 'রাস্তা বন্ধ! কেবল মেট্রোরেল এক্সপ্রেস সক্রিয়' : 'Surface blocked! Metro-only detour'}
              </span>
            ) : (
              <span>➔ {lang === 'bn' ? 'সড়ক অবরোধ তৈরি করতে ট্যাপ করুন' : 'Tap to simulate roadblock'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
