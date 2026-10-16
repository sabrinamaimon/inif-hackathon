'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, CheckCircle, AlertCircle, Loader2, X, Compass, RefreshCw } from 'lucide-react';
import { getUserCoordinates, findNearestTransitHub, formatDistance } from '../utils/geolocation.js';
import { STATIC_HUBS } from '../data/staticData';

export default function LocationPromptBanner({
  onLocationDetected,
  lang = 'bn'
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [detectedHub, setDetectedHub] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Check if user previously dismissed in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('dhakapath_loc_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    setErrorMessage(null);

    try {
      const coords = await getUserCoordinates();
      const nearest = findNearestTransitHub(coords.lat, coords.lng, STATIC_HUBS);

      if (nearest) {
        const distText = formatDistance(nearest.distanceKm, lang);
        const locInfo = {
          hubName: nearest.name,
          hubNameBn: nearest.name_bn || nearest.name,
          distanceText: distText,
          lat: coords.lat,
          lng: coords.lng,
          accuracy: coords.accuracy
        };

        setDetectedHub(locInfo);

        if (onLocationDetected) {
          onLocationDetected(locInfo);
        }
      } else {
        setErrorMessage(
          lang === 'bn'
            ? 'ঢাকার ট্রানজিট নেটওয়ার্কের আওতায় কোনো নিকটস্থ স্টেশন পাওয়া যায়নি।'
            : 'No nearby Dhaka transit stations found in range.'
        );
      }
    } catch (err) {
      console.warn('Geolocation prompt error:', err);
      let msg = lang === 'bn'
        ? 'লোকেশন পারমিশন পাওয়া যায়নি। আপনি ড্রপডাউন থেকে সরাসরি যেকোনো স্থান বেছে নিতে পারবেন।'
        : 'Location access was not granted. You can select manually from the dropdown.';
      if (err.code === 1) {
        msg = lang === 'bn'
          ? 'লোকেশন অনুমতি ব্লক করা রয়েছে। ব্রাউজারের অনুমতি প্রদান করুন অথবা নিচে ড্রপডাউন থেকে নির্বাচন করুন।'
          : 'Location access denied. Please enable permission or select from the dropdown.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLocating(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dhakapath_loc_dismissed', 'true');
    }
  };

  if (isDismissed && !detectedHub) {
    return null;
  }

  // State: Successfully Detected
  if (detectedHub) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0f291e] border-2 border-[#10b981]/60 shadow-xl relative overflow-hidden mb-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center shrink-0 text-[#10b981] shadow-md">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-anek text-base sm:text-lg font-black text-[#6ee7b7]">
                  {lang === 'bn' ? '✓ নিখুঁত অবস্থান শনাক্ত হয়েছে' : '✓ Precise Location Detected'}
                </span>
                <span className="text-xs font-mono font-bold bg-[#10b981] text-[#042f2e] px-2 py-0.5 rounded-md">
                  {detectedHub.distanceText} {lang === 'bn' ? 'দূরে' : 'away'}
                </span>
              </div>
              <p className="font-anek text-sm sm:text-base text-[#d1fae5] mt-0.5">
                {lang === 'bn' ? (
                  <>
                    আপনার নিকটস্থ হাব <strong>"{detectedHub.hubNameBn}"</strong> স্বয়ংক্রিয়ভাবে <span className="text-[#f6d16f] font-bold">যাত্রা শুরু</span> হিসেবে সেট করা হয়েছে। আপনি চাইলে নিচে ড্রপডাউন থেকে যেকোনো সময় পরিবর্তন করতে পারবেন।
                  </>
                ) : (
                  <>
                    Nearest hub <strong>"{detectedHub.hubName}"</strong> set as <span className="text-[#f6d16f] font-bold">Origin</span>. You can change it anytime via the dropdown.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#134e4a] hover:bg-[#115e59] text-[#6ee7b7] border border-[#10b981]/50 text-xs font-anek font-bold transition-all shadow-sm"
              title="Refresh GPS location"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{lang === 'bn' ? 'পুনরায় মাপুন' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDetectedHub(null)}
              className="p-1.5 rounded-xl bg-[#134e4a]/60 text-[#a7f3d0] hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: Initial Location Request Prompt
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c1511] via-[#2a1d15] to-[#1c1511] border-2 border-[#c69429] shadow-2xl relative overflow-hidden mb-6 animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Decorative Rickshaw Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#e2b448]/20 to-transparent pointer-events-none rounded-bl-full" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#b83a2e] to-[#e2b448] p-0.5 shrink-0 shadow-lg">
            <div className="w-full h-full rounded-[14px] bg-[#1a1410] flex items-center justify-center text-[#f6d16f]">
              <Compass className="w-6 h-6 text-[#f6d16f] animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-rickshaw text-lg sm:text-xl font-bold text-[#f6d16f] tracking-wide rickshaw-text-pop">
                {lang === 'bn' ? '📍 বর্তমান অবস্থান থেকে নিকটস্থ স্টেশন নির্বাচন করবেন?' : '📍 Detect your closest station from current location?'}
              </h4>
              <span className="text-[11px] font-anek font-bold px-2 py-0.5 rounded-full bg-[#15453b] text-[#6ee7b7] border border-[#2a6f62]">
                {lang === 'bn' ? 'স্মার্ট জিপিএস হাব' : 'Smart GPS Hub'}
              </span>
            </div>

            <p className="font-anek text-sm sm:text-base text-[#dfcfb2] mt-1 leading-relaxed">
              {lang === 'bn' ? (
                <>
                  অনুমতি দিলে আপনার নিখুঁত লোকেশন অনুযায়ী নিকটস্থ মেট্রোরেল বা বাস স্টেশনটিকে স্বয়ংক্রিয়ভাবে <strong>"যাত্রা শুরু (হাব)"</strong> হিসেবে সেট করা হবে। আপনি চাইলে যেকোনো সময় নিচে ড্রপডাউন থেকে পরিবর্তন করতে পারবেন।
                </>
              ) : (
                <>
                  With your permission, DhakaPath will pinpoint your closest Metro Rail or Bus station and set it as your <strong>Origin Hub</strong>. You can freely change it anytime from the dropdown.
                </>
              )}
            </p>

            {/* Error Message if permission denied */}
            {errorMessage && (
              <div className="mt-2 text-xs font-anek font-bold text-[#fca5a5] flex items-center gap-1.5 bg-[#b83a2e]/20 p-2 rounded-lg border border-[#b83a2e]/40">
                <AlertCircle className="w-4 h-4 text-[#f87171] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl bg-[#292019] hover:bg-[#382b22] text-[#dfcfb2] hover:text-white font-anek font-bold text-xs sm:text-sm border border-[#c69429]/30 transition-all active:scale-95"
          >
            {lang === 'bn' ? 'নিজে বেছে নেব' : 'Select Manually'}
          </button>

          <button
            type="button"
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-white font-anek font-bold text-xs sm:text-sm shadow-lg shadow-[#059669]/30 border border-[#6ee7b7]/60 active:scale-95 transition-all"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'bn' ? 'অবস্থান শনাক্ত হচ্ছে...' : 'Detecting GPS...'}</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>{lang === 'bn' ? 'হ্যাঁ, অবস্থান অনুমতি দিন' : 'Allow Location'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
