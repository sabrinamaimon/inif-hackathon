'use client';

import React, { useState } from 'react';
import { Search, Mic, CloudRain, Clock, GraduationCap, User, ArrowRightLeft, Sparkles, MapPin } from 'lucide-react';
import { I18N } from '../utils/localization';
import { STATIC_HUBS } from '../data/staticData';
import { startSpeechRecognition } from '../utils/speech';

export default function RouteSearch({
  origin,
  setOrigin,
  destination,
  setDestination,
  passengerType,
  setPassengerType,
  weather,
  setWeather,
  isRushHour,
  setIsRushHour,
  onSearch,
  onNlpSearch,
  isLoading,
  lang
}) {
  const t = I18N[lang] || I18N.bn;
  const metroStations = Object.keys(STATIC_HUBS)
    .filter(name => STATIC_HUBS[name]?.is_metro_station && name !== 'Uttara')
    .sort((a, b) => (STATIC_HUBS[a]?.station_order || 99) - (STATIC_HUBS[b]?.station_order || 99));

  const roadHubs = Object.keys(STATIC_HUBS)
    .filter(name => !STATIC_HUBS[name]?.is_metro_station || name === 'Uttara');

  const [naturalQuery, setNaturalQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);

    startSpeechRecognition({
      lang: lang === 'bn' ? 'bn-BD' : 'en-US',
      onResult: (transcript) => {
        setNaturalQuery(transcript);
        setIsListening(false);
        if (onNlpSearch) onNlpSearch(transcript);
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  const handleNlpSubmit = (e) => {
    e.preventDefault();
    if (naturalQuery.trim() && onNlpSearch) {
      onNlpSearch(naturalQuery);
    }
  };

  return (
    <div className="heritage-card p-4 sm:p-6 my-6 border-2 border-[#c69429]/50 shadow-2xl relative overflow-hidden bg-[#18130f]">
      {/* Top Rickshaw Paint Arch & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#c69429]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-[#1a1410] flex items-center justify-center">
              <Search className="w-5 h-5 text-[#f6d16f]" />
            </div>
          </div>
          <div>
            <h2 className="font-rickshaw text-3xl sm:text-4xl font-bold text-[#f6d16f] tracking-wide rickshaw-text-pop">
              {t.searchTitle}
            </h2>
            <p className="font-anek text-sm sm:text-base text-[#dfcfb2] mt-0.5">
              {lang === 'bn' 
                ? 'মেট্রোরেল, মুড়ির টিন ও লোকাল বাস, লেগুনা এবং কানেক্টর রিকশা ভাড়া বিশ্লেষণ' 
                : 'Metro Rail, Local Bus, Leguna & Connector Rickshaw Fare Intelligence'}
            </p>
          </div>
        </div>

        {/* Passenger Category Badge Toggle (General vs Student Half-Pass) */}
        <div className="flex items-center gap-1.5 bg-[#120e0b] p-1.5 rounded-2xl border border-[#c69429]/40 shadow-inner">
          <button
            type="button"
            onClick={() => setPassengerType('general')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-anek font-bold transition-all ${
              passengerType === 'general'
                ? 'bg-[#2a2019] text-[#fbf8f1] border border-[#c69429] shadow-md'
                : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
            }`}
          >
            <User className="w-4 h-4 text-[#f6d16f]" />
            <span>{t.generalCommuter}</span>
          </button>

          <button
            type="button"
            onClick={() => setPassengerType('student')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-anek font-bold transition-all ${
              passengerType === 'student'
                ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] border border-[#f6d16f] shadow-lg shadow-[#b83a2e]/40'
                : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#f6d16f]" />
            <span>{t.studentPass}</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Selectors with Swap Button */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-center mb-5">
        <div>
          <label className="block font-anek text-sm font-bold text-[#f6d16f] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#b83a2e]" />
            <span>{t.originLabel}</span>
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/40 text-[#fbf8f1] text-base font-anek font-bold focus:border-[#f6d16f] focus:outline-none transition-all shadow-inner"
          >
            <optgroup label={lang === 'bn' ? '🚇 এমআরটি-৬ মেট্রোরেল (১৭টি স্টেশন ক্রমানুসারে)' : '🚇 MRT-6 Metro Rail (17 Stations in Order)'} className="bg-[#14100c] text-[#34d399] font-bold">
              {metroStations.map((name) => (
                <option key={name} value={name} className="bg-[#1a1410] text-[#fbf8f1]">
                  {STATIC_HUBS[name]?.station_order ? `[M-${String(STATIC_HUBS[name].station_order).padStart(2, '0')}] ` : ''}
                  {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                </option>
              ))}
            </optgroup>
            <optgroup label={lang === 'bn' ? '🛺 রোড বাস ও ট্রানজিট হাব' : '🛺 Road Bus & Transit Hubs'} className="bg-[#14100c] text-[#f6d16f] font-bold">
              {roadHubs.map((name) => (
                <option key={name} value={name} className="bg-[#1a1410] text-[#fbf8f1]">
                  {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Swap Button with Rickshaw Bell Accent */}
        <div className="flex justify-center sm:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            className="w-11 h-11 rounded-full bg-[#292019] border-2 border-[#c69429] hover:border-[#f6d16f] text-[#f6d16f] hover:bg-[#3d3026] flex items-center justify-center transition-all shadow-md active:rotate-180 duration-300"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block font-anek text-sm font-bold text-[#f6d16f] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#15453b]" />
            <span>{t.destLabel}</span>
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/40 text-[#fbf8f1] text-base font-anek font-bold focus:border-[#f6d16f] focus:outline-none transition-all shadow-inner"
          >
            <optgroup label={lang === 'bn' ? '🚇 এমআরটি-৬ মেট্রোরেল (১৭টি স্টেশন ক্রমানুসারে)' : '🚇 MRT-6 Metro Rail (17 Stations in Order)'} className="bg-[#14100c] text-[#34d399] font-bold">
              {metroStations.map((name) => (
                <option key={name} value={name} className="bg-[#1a1410] text-[#fbf8f1]">
                  {STATIC_HUBS[name]?.station_order ? `[M-${String(STATIC_HUBS[name].station_order).padStart(2, '0')}] ` : ''}
                  {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                </option>
              ))}
            </optgroup>
            <optgroup label={lang === 'bn' ? '🛺 রোড বাস ও ট্রানজিট হাব' : '🛺 Road Bus & Transit Hubs'} className="bg-[#14100c] text-[#f6d16f] font-bold">
              {roadHubs.map((name) => (
                <option key={name} value={name} className="bg-[#1a1410] text-[#fbf8f1]">
                  {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Conditions Toggle Pills: Weather & Rush Hour */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#120e0b] border border-[#c69429]/30 mb-5">
        <div className="flex items-center gap-2">
          <span className="font-anek text-sm font-bold text-[#dfcfb2]">
            {lang === 'bn' ? 'সড়কের আবহাওয়া ও সময়:' : 'Road Condition & Time:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Monsoon Rain Toggle */}
          <button
            type="button"
            onClick={() => setWeather(weather === 'rain' ? 'normal' : 'rain')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-anek font-bold transition-all border ${
              weather === 'rain'
                ? 'bg-[#1c4568] text-[#fbf8f1] border-[#346894] shadow-md shadow-[#1c4568]/40 animate-pulse'
                : 'bg-[#1c1511] text-[#dfcfb2] border-[#c69429]/30 hover:border-[#c69429]'
            }`}
          >
            <CloudRain className={`w-4 h-4 ${weather === 'rain' ? 'text-[#7dd3fc]' : 'text-[#dfcfb2]'}`} />
            <span>{weather === 'rain' ? (lang === 'bn' ? 'মৌসুমী ভারী বৃষ্টি (জলজট)' : 'Monsoon Rain Active') : (lang === 'bn' ? 'স্বাভাবিক আবহাওয়া' : 'Normal Weather')}</span>
          </button>

          {/* Rush Hour Toggle */}
          <button
            type="button"
            onClick={() => setIsRushHour(!isRushHour)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-anek font-bold transition-all border ${
              isRushHour
                ? 'bg-[#b83a2e] text-[#fbf8f1] border-[#f6d16f] shadow-md shadow-[#b83a2e]/40'
                : 'bg-[#1c1511] text-[#dfcfb2] border-[#c69429]/30 hover:border-[#c69429]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isRushHour ? 'text-[#f6d16f]' : 'text-[#dfcfb2]'}`} />
            <span>{isRushHour ? (lang === 'bn' ? 'বিকেল ৫:৩০ অফিস ছুটি (পিক আওয়ার)' : 'Peak Rush Hour Active') : (lang === 'bn' ? 'অফ-পিক সময়' : 'Off-Peak Time')}</span>
          </button>
        </div>
      </div>

      {/* Natural Language Query Bar with Voice Mic */}
      <form onSubmit={handleNlpSubmit} className="relative mb-5">
        <input
          type="text"
          value={naturalQuery}
          onChange={(e) => setNaturalQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-4 pr-24 py-4 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/50 text-[#fbf8f1] placeholder-[#7a6654] text-sm sm:text-base font-anek font-semibold focus:border-[#f6d16f] focus:outline-none transition-all shadow-inner"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={handleVoiceInput}
            title={t.micTooltip}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-[#b83a2e] text-white animate-pulse shadow-lg'
                : 'bg-[#292019] text-[#f6d16f] hover:bg-[#3d3026] border border-[#c69429]/40'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* NLP Submit */}
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#15453b] hover:bg-[#1f5e51] text-[#f6d16f] border border-[#2a6f62] transition-all"
            title="Search with AI"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Main Action Search Button */}
      <button
        type="button"
        onClick={onSearch}
        disabled={isLoading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#b83a2e] via-[#c69429] to-[#b83a2e] text-[#120e0b] font-anek font-black text-lg sm:text-xl border-2 border-[#f6d16f] shadow-xl shadow-[#b83a2e]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 tracking-wide uppercase"
      >
        <span className="text-xl">🛺</span>
        <span>{isLoading ? (lang === 'bn' ? 'রুট যাচাই ও হিসাব হচ্ছে...' : 'Calculating Routes...') : t.searchBtn}</span>
      </button>
    </div>
  );
}
