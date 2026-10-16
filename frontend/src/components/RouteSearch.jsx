'use client';

import React, { useState } from 'react';
import { Search, Mic, Camera, CloudRain, Clock, GraduationCap, User, ArrowRightLeft, MapPin, AlertCircle } from 'lucide-react';
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
  lang,
  onOpenScanner
}) {
  const t = I18N[lang] || I18N.bn;

  // Metro Stations (Sorted M-01 to M-17)
  const metroStations = Object.keys(STATIC_HUBS)
    .filter(name => STATIC_HUBS[name]?.is_metro_station && name !== 'Uttara')
    .sort((a, b) => (STATIC_HUBS[a]?.station_order || 99) - (STATIC_HUBS[b]?.station_order || 99));

  // Major Bus Hubs & Stops
  const busStopsAndHubs = [
    "Mirpur 1", "Mirpur 10", "Mirpur 11", "Mirpur 12", "Pallabi",
    "Kalyanpur", "Shyamoli", "Asad Gate", "Dhanmondi 27", "Kalabagan",
    "Science Lab", "New Market", "Farmgate", "Karwan Bazar", "Shahbagh",
    "Dhaka University", "Kakrail", "Bangladesh Secretariat", "Gulisthan",
    "Motijheel", "Mohakhali", "Banani", "Kuril", "Khilkhet", "Uttara"
  ].filter(name => STATIC_HUBS[name]);

  // Major Residential / CNG / Rickshaw Connector Hubs
  const connectorZones = [
    "Dhanmondi", "Mohammadpur", "Banasree", "Badda", "Malibagh",
    "Jatrabari", "Sadarghat", "Lalbagh"
  ].filter(name => STATIC_HUBS[name]);

  const [naturalQuery, setNaturalQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Prevention check: Never travel from self to self
  const isSameLocation = origin && destination && origin === destination;

  const handleOriginChange = (val) => {
    setOrigin(val);
    if (val === destination) {
      // Pick a safe fallback destination
      const fallback = val === 'Motijheel' ? 'Mirpur 10' : 'Motijheel';
      setDestination(fallback);
    }
  };

  const handleDestinationChange = (val) => {
    setDestination(val);
    if (val === origin) {
      // Pick a safe fallback origin
      const fallback = val === 'Mirpur 10' ? 'Motijheel' : 'Mirpur 10';
      setOrigin(fallback);
    }
  };

  const handleSwap = () => {
    if (isSameLocation) return;
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
                ? 'মেট্রোরেল, লোকাল বাস, সিএনজি অটোরিকশা ও রিকশা ভাড়া এবং দ্রুততম রুট' 
                : 'Metro Rail, Local Bus, CNG Auto-Rickshaw & Multi-Modal Transit'}
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
      <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-3 items-center mb-4">
        {/* Origin Selector */}
        <div>
          <label className="block font-anek text-sm font-bold text-[#f6d16f] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#b83a2e]" />
            <span>{t.originLabel}</span>
          </label>
          <select
            value={origin}
            onChange={(e) => handleOriginChange(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/40 text-[#fbf8f1] text-base font-anek font-bold focus:border-[#f6d16f] focus:outline-none transition-all shadow-inner"
          >
            <optgroup label={lang === 'bn' ? '🚇 এমআরটি-৬ মেট্রোরেল (১৭টি স্টেশন)' : '🚇 MRT-6 Metro Rail (17 Stations)'} className="bg-[#14100c] text-[#34d399] font-bold">
              {metroStations.map((name) => {
                const isSelectedAsDest = name === destination;
                return (
                  <option 
                    key={name} 
                    value={name} 
                    disabled={isSelectedAsDest}
                    className={isSelectedAsDest ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsDest ? '🚫 [গন্তব্যে নির্বাচিত] ' : ''}
                    {STATIC_HUBS[name]?.station_order ? `[M-${String(STATIC_HUBS[name].station_order).padStart(2, '0')}] ` : ''}
                    {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>

            <optgroup label={lang === 'bn' ? '🚌 প্রধান বাস রুট ও স্টপেজ' : '🚌 Major Bus Routes & Stops'} className="bg-[#14100c] text-[#60a5fa] font-bold">
              {busStopsAndHubs.map((name) => {
                const isSelectedAsDest = name === destination;
                return (
                  <option 
                    key={`bus-${name}`} 
                    value={name} 
                    disabled={isSelectedAsDest}
                    className={isSelectedAsDest ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsDest ? '🚫 [গন্তব্যে নির্বাচিত] ' : ''}
                    🚌 {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>

            <optgroup label={lang === 'bn' ? '🚕 সিএনজি ও 🛺 রিকশা কানেক্টর জোন' : '🚕 CNG & 🛺 Rickshaw Connector Zones'} className="bg-[#14100c] text-[#f6d16f] font-bold">
              {connectorZones.map((name) => {
                const isSelectedAsDest = name === destination;
                return (
                  <option 
                    key={`conn-${name}`} 
                    value={name} 
                    disabled={isSelectedAsDest}
                    className={isSelectedAsDest ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsDest ? '🚫 [গন্তব্যে নির্বাচিত] ' : ''}
                    🛺 {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>

        {/* Swap Button with Rickshaw Bell Accent */}
        <div className="flex justify-center sm:pt-6">
          <button
            type="button"
            onClick={handleSwap}
            disabled={isSameLocation}
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-md active:rotate-180 duration-300 ${
              isSameLocation 
                ? 'bg-[#1c1511] text-[#7a6654] border-[#7a6654]/40 cursor-not-allowed'
                : 'bg-[#292019] border-[#c69429] hover:border-[#f6d16f] text-[#f6d16f] hover:bg-[#3d3026]'
            }`}
            title={lang === 'bn' ? 'শুরু ও গন্তব্য অদল-বদল করুন' : 'Swap Origin and Destination'}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block font-anek text-sm font-bold text-[#f6d16f] mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#15453b]" />
            <span>{t.destLabel}</span>
          </label>
          <select
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-[#120e0b] border-2 border-[#c69429]/40 text-[#fbf8f1] text-base font-anek font-bold focus:border-[#f6d16f] focus:outline-none transition-all shadow-inner"
          >
            <optgroup label={lang === 'bn' ? '🚇 এমআরটি-৬ মেট্রোরেল (১৭টি স্টেশন)' : '🚇 MRT-6 Metro Rail (17 Stations)'} className="bg-[#14100c] text-[#34d399] font-bold">
              {metroStations.map((name) => {
                const isSelectedAsOrig = name === origin;
                return (
                  <option 
                    key={name} 
                    value={name} 
                    disabled={isSelectedAsOrig}
                    className={isSelectedAsOrig ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsOrig ? '🚫 [শুরুতে নির্বাচিত] ' : ''}
                    {STATIC_HUBS[name]?.station_order ? `[M-${String(STATIC_HUBS[name].station_order).padStart(2, '0')}] ` : ''}
                    {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>

            <optgroup label={lang === 'bn' ? '🚌 প্রধান বাস রুট ও স্টপেজ' : '🚌 Major Bus Routes & Stops'} className="bg-[#14100c] text-[#60a5fa] font-bold">
              {busStopsAndHubs.map((name) => {
                const isSelectedAsOrig = name === origin;
                return (
                  <option 
                    key={`bus-${name}`} 
                    value={name} 
                    disabled={isSelectedAsOrig}
                    className={isSelectedAsOrig ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsOrig ? '🚫 [শুরুতে নির্বাচিত] ' : ''}
                    🚌 {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>

            <optgroup label={lang === 'bn' ? '🚕 সিএনজি ও 🛺 রিকশা কানেক্টর জোন' : '🚕 CNG & 🛺 Rickshaw Connector Zones'} className="bg-[#14100c] text-[#f6d16f] font-bold">
              {connectorZones.map((name) => {
                const isSelectedAsOrig = name === origin;
                return (
                  <option 
                    key={`conn-${name}`} 
                    value={name} 
                    disabled={isSelectedAsOrig}
                    className={isSelectedAsOrig ? "bg-[#1a1410] text-[#7a6654] italic" : "bg-[#1a1410] text-[#fbf8f1]"}
                  >
                    {isSelectedAsOrig ? '🚫 [শুরুতে নির্বাচিত] ' : ''}
                    🛺 {STATIC_HUBS[name]?.name_bn ? `${STATIC_HUBS[name].name_bn} (${name})` : name}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Warning Alert if Origin === Destination (Cannot travel to self) */}
      {isSameLocation && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#b83a2e]/20 border-2 border-[#b83a2e] text-[#fca5a5] font-anek text-sm font-bold flex items-center gap-2.5 animate-pulse">
          <AlertCircle className="w-5 h-5 text-[#f87171] shrink-0" />
          <span>
            {lang === 'bn' 
              ? '⚠️ যাত্রা শুরু এবং গন্তব্য একই স্থান হতে পারে না! অনুগ্রহ করে ভিন্ন একটি গন্তব্য নির্বাচন করুন।' 
              : '⚠️ Origin and destination cannot be identical. Please select different locations.'}
          </span>
        </div>
      )}

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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-anek font-extrabold transition-all border ${
              weather === 'rain'
                ? 'bg-[#1c4568] text-white border-[#346894] shadow-md shadow-[#1c4568]/40 animate-pulse'
                : 'bg-[#292019] text-[#fbf8f1] border-[#c69429]/60 hover:border-[#f6d16f]'
            }`}
          >
            <CloudRain className={`w-4 h-4 ${weather === 'rain' ? 'text-[#7dd3fc]' : 'text-[#f6d16f]'}`} />
            <span>{weather === 'rain' ? (lang === 'bn' ? 'মৌসুমী ভারী বৃষ্টি (জলজট)' : 'Monsoon Rain Active') : (lang === 'bn' ? 'স্বাভাবিক আবহাওয়া' : 'Normal Weather')}</span>
          </button>

          {/* Rush Hour Toggle */}
          <button
            type="button"
            onClick={() => setIsRushHour(!isRushHour)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-anek font-extrabold transition-all border ${
              isRushHour
                ? 'bg-[#b83a2e] text-white border-[#f6d16f] shadow-md shadow-[#b83a2e]/40'
                : 'bg-[#292019] text-[#fbf8f1] border-[#c69429]/60 hover:border-[#f6d16f]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isRushHour ? 'text-[#f6d16f]' : 'text-[#f6d16f]'}`} />
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
            title={t.micTooltip || (lang === 'bn' ? 'ভয়েসের মাধ্যমে সার্চ করুন' : 'Search with voice')}
            className={`p-2.5 rounded-xl transition-all ${
              isListening
                ? 'bg-[#b83a2e] text-white animate-pulse shadow-lg'
                : 'bg-[#292019] text-[#f6d16f] hover:bg-[#3d3026] border border-[#c69429]/40'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Camera Notice & Schedule Scanner */}
          <button
            type="button"
            onClick={() => onOpenScanner && onOpenScanner()}
            title={lang === 'bn' ? 'ক্যামেরা দিয়ে ট্রানজিট নোটিশ বা ভাড়ার চার্ট স্ক্যান করুন' : 'Scan transit notice or fare schedule with camera'}
            className="p-2.5 rounded-xl bg-[#292019] hover:bg-[#3d3026] text-[#f6d16f] border border-[#c69429]/40 transition-all cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Main Action Search Button */}
      <button
        type="button"
        onClick={() => {
          if (!isSameLocation && onSearch) onSearch();
        }}
        disabled={isLoading || isSameLocation}
        className={`w-full py-4 rounded-xl font-anek font-black text-lg sm:text-xl border-2 transition-all flex items-center justify-center gap-2.5 tracking-wide uppercase shadow-xl ${
          isSameLocation 
            ? 'bg-[#292019] text-[#7a6654] border-[#7a6654]/40 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-[#b83a2e] via-[#c69429] to-[#b83a2e] text-[#120e0b] border-[#f6d16f] shadow-[#b83a2e]/30 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        <span className="text-xl">{isSameLocation ? '⚠️' : '🛺'}</span>
        <span>
          {isSameLocation 
            ? (lang === 'bn' ? 'ভিন্ন গন্তব্য নির্বাচন করুন' : 'Select Different Locations')
            : isLoading 
            ? (lang === 'bn' ? 'রুট যাচাই ও হিসাব হচ্ছে...' : 'Calculating Routes...') 
            : t.searchBtn}
        </span>
      </button>
    </div>
  );
}
