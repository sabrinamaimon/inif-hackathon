'use client';

import React, { useState } from 'react';
import { Search, Mic, CloudRain, Clock, GraduationCap, User, ArrowRightLeft, Sparkles } from 'lucide-react';
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
  const hubNames = Object.keys(STATIC_HUBS);

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
    <div className="glass-panel p-4 sm:p-5 border border-emerald-500/30 shadow-xl my-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">{t.searchTitle}</h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'মেট্রোরেল, লোকাল বাস, লেগুনা ও রিকশা ভাড়া বিশ্লেষণ' : 'Metro, Bus, Leguna & Rickshaw intelligence'}
            </p>
          </div>
        </div>

        {/* Passenger Category Badge Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setPassengerType('general')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              passengerType === 'general'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.generalCommuter}</span>
            <span className="sm:hidden">{lang === 'bn' ? 'সাধারণ' : 'General'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPassengerType('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              passengerType === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">{t.studentPass}</span>
            <span className="sm:hidden">{lang === 'bn' ? 'হাফ-পাস' : 'Student'}</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-center mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            {t.originLabel}
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-semibold focus:border-emerald-500 focus:outline-none transition-all"
          >
            {hubNames.map((name) => (
              <option key={name} value={name}>
                {lang === 'bn' ? STATIC_HUBS[name].name_bn : name} ({STATIC_HUBS[name].zone})
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center sm:pt-5">
          <button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-sm"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            {t.destLabel}
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm font-semibold focus:border-emerald-500 focus:outline-none transition-all"
          >
            {hubNames.map((name) => (
              <option key={name} value={name}>
                {lang === 'bn' ? STATIC_HUBS[name].name_bn : name} ({STATIC_HUBS[name].zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Natural Language & Voice Search Input (Banglish / English) */}
      <form onSubmit={handleNlpSubmit} className="relative mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder={isListening ? t.micListening : t.searchPlaceholder}
              className={`w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-900/90 border text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none transition-all ${
                isListening 
                  ? 'border-rose-500 ring-2 ring-rose-500/30' 
                  : 'border-slate-700 focus:border-emerald-500'
              }`}
            />
            <Sparkles className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />

            {/* Voice mic button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              title={t.micTooltip}
              className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all ${
                isListening 
                  ? 'mic-active text-white' 
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            className="hidden sm:flex px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-xs items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Parse</span>
          </button>
        </div>
      </form>

      {/* Weather & Rush Hour Simulation Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Weather Toggle */}
          <button
            type="button"
            onClick={() => setWeather(weather === 'rain' ? 'normal' : 'rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              weather === 'rain'
                ? 'bg-blue-950/70 text-blue-300 border-blue-500/50 shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <CloudRain className={`w-3.5 h-3.5 ${weather === 'rain' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>{weather === 'rain' ? (lang === 'bn' ? 'বৃষ্টি চালু (+৫০% রিকশা)' : 'Rain Active (+50% Surge)') : (lang === 'bn' ? 'স্বাভাবিক আবহাওয়া' : 'Normal Weather')}</span>
          </button>

          {/* Rush Hour Toggle */}
          <button
            type="button"
            onClick={() => setIsRushHour(!isRushHour)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
              isRushHour
                ? 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isRushHour ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{isRushHour ? (lang === 'bn' ? 'পিক আওয়ার (+২৫% যানজট)' : 'Rush Hour Active') : (lang === 'bn' ? 'পিক আওয়ার বন্ধ' : 'Off-Peak')}</span>
          </button>
        </div>

        {/* Main Search Action Button */}
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{lang === 'bn' ? 'গণনা হচ্ছে...' : 'Calculating...'}</span>
            </span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{t.searchBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
