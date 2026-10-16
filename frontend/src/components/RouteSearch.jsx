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
    <div className="glass-panel p-6 sm:p-7 border border-emerald-500/30 shadow-2xl my-0">
      {/* Title & Category Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{t.searchTitle}</h2>
            <p className="text-sm text-slate-300 font-medium">
              {lang === 'bn' ? 'মেট্রোরেল, লোকাল বাস, লেগুনা ও রিকশা ভাড়া বিশ্লেষণ' : 'Metro, Bus, Leguna & Rickshaw intelligence'}
            </p>
          </div>
        </div>

        {/* Passenger Category Badge Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setPassengerType('general')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              passengerType === 'general'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>{t.generalCommuter}</span>
          </button>

          <button
            type="button"
            onClick={() => setPassengerType('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
              passengerType === 'student'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-300" />
            <span>{t.studentPass}</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-5">
        <div>
          <label className="block text-sm font-extrabold text-slate-200 mb-1.5">
            {t.originLabel}
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-bold focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
          >
            {hubNames.map((name) => (
              <option key={name} value={name}>
                {lang === 'bn' ? STATIC_HUBS[name].name_bn : name} ({STATIC_HUBS[name].zone})
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center sm:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-md"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-slate-200 mb-1.5">
            {t.destLabel}
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-bold focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
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
      <form onSubmit={handleNlpSubmit} className="relative mb-5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder={isListening ? t.micListening : t.searchPlaceholder}
              className={`w-full pl-12 pr-14 py-3.5 rounded-2xl bg-slate-900 border text-white text-base placeholder:text-slate-500 focus:outline-none transition-all shadow-inner ${
                isListening 
                  ? 'border-rose-500 ring-2 ring-rose-500/40' 
                  : 'border-slate-700 focus:border-emerald-500'
              }`}
            />
            <Sparkles className="w-5 h-5 text-emerald-400 absolute left-4 top-4" />

            {/* Voice mic button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              title={t.micTooltip}
              className={`absolute right-2.5 top-2.5 p-2 rounded-xl transition-all ${
                isListening 
                  ? 'mic-active text-white' 
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button
            type="submit"
            className="hidden sm:flex px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-extrabold text-sm items-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Parse</span>
          </button>
        </div>
      </form>

      {/* Weather & Rush Hour Simulation Toggles & Main Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Weather Toggle */}
          <button
            type="button"
            onClick={() => setWeather(weather === 'rain' ? 'normal' : 'rain')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all ${
              weather === 'rain'
                ? 'bg-blue-950/80 text-blue-300 border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <CloudRain className={`w-4 h-4 ${weather === 'rain' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span>{weather === 'rain' ? (lang === 'bn' ? 'বৃষ্টি চালু (+৫০% রিকশা ভাড়া)' : 'Rain Active (+50% Surge)') : (lang === 'bn' ? 'স্বাভাবিক আবহাওয়া' : 'Normal Weather')}</span>
          </button>

          {/* Rush Hour Toggle */}
          <button
            type="button"
            onClick={() => setIsRushHour(!isRushHour)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold transition-all ${
              isRushHour
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Clock className={`w-4 h-4 ${isRushHour ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{isRushHour ? (lang === 'bn' ? 'পিক আওয়ার (+২৫% যানজট)' : 'Rush Hour Active') : (lang === 'bn' ? 'পিক আওয়ার বন্ধ' : 'Off-Peak')}</span>
          </button>
        </div>

        {/* Main Search Action Button */}
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2.5">
              <span className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{lang === 'bn' ? 'গণনা হচ্ছে...' : 'Calculating...'}</span>
            </span>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>{t.searchBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
