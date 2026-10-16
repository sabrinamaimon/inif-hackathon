'use client';

import React from 'react';
import { 
  AlertTriangle, ThumbsUp, CheckCircle, Droplets, ShieldAlert, 
  Clock, Plus, Flame, Bus, Bike, Car, Check, Info
} from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';
import { STATIC_HUBS } from '../data/staticData';

export default function StreetAlertsFeed({
  alerts = [],
  onVote,
  onOpenReportModal,
  lang = 'bn'
}) {
  const t = I18N[lang] || I18N.bn;
  const [votedMap, setVotedMap] = React.useState({});
  const [toastMessage, setToastMessage] = React.useState(null);

  // Load user vote records from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('dhakapath_voted_alerts');
      if (stored) {
        setVotedMap(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleVoteClick = (alertId, voteType) => {
    if (votedMap[alertId]) {
      showToast(
        lang === 'bn'
          ? 'ধন্যবাদ! আপনি ইতোমধ্যেই এই সতর্কতায় আপনার মতামত জানিয়েছেন।'
          : 'You have already voted on this alert. Thank you!'
      );
      return;
    }

    // Call parent vote handler
    if (onVote) {
      onVote(alertId, voteType);
    }

    // Record locally so user cannot double-vote
    const nextMap = { ...votedMap, [alertId]: voteType };
    setVotedMap(nextMap);
    try {
      localStorage.setItem('dhakapath_voted_alerts', JSON.stringify(nextMap));
    } catch (e) {}

    showToast(
      lang === 'bn'
        ? 'আপনার মূল্যবান মতামত সফলভাবে গৃহীত হয়েছে। ধন্যবাদ!'
        : 'Your feedback has been recorded. Thank you!'
    );
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case 'waterlogging':
        return { 
          label: t.waterlogging, 
          color: 'text-sky-300 bg-sky-950/80 border-sky-500 font-extrabold', 
          icon: Droplets 
        };
      case 'blockade':
        return { 
          label: t.blockade, 
          color: 'text-rose-300 bg-rose-950/80 border-rose-500 font-extrabold', 
          icon: ShieldAlert 
        };
      case 'gridlock':
        return { 
          label: t.gridlock, 
          color: 'text-amber-300 bg-amber-950/80 border-amber-500 font-extrabold', 
          icon: Flame 
        };
      default:
        return { 
          label: t.construction, 
          color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500 font-extrabold', 
          icon: AlertTriangle 
        };
    }
  };

  return (
    <div className="heritage-card p-6 sm:p-7 border-2 border-[#c69429]/50 my-8 shadow-2xl bg-[#18130f] relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="sticky top-4 z-50 mb-4 p-3.5 rounded-xl bg-gradient-to-r from-[#15453b] to-[#1c5d50] text-[#f6d16f] border-2 border-[#f6d16f] shadow-2xl flex items-center justify-between gap-3 animate-fade-in font-anek font-bold text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#f6d16f] shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="text-xs px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[#fbf8f1]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#c69429]/30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📢</span>
            <h3 className="font-rickshaw text-2xl sm:text-3xl font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
              {t.alertsTitle}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#b83a2e] text-[#fbf8f1] font-anek font-bold border border-[#f6d16f] shadow-md">
              {lang === 'bn' ? `${toBnDigits(alerts.length)}টি সক্রিয়` : `${alerts.length} Active`}
            </span>
          </div>
          <p className="font-anek text-sm text-[#dfcfb2] mt-1">
            {lang === 'bn'
              ? 'যাত্রী ও ট্রাফিক কন্ট্রোল কর্তৃক লাইভ যাচাইকৃত সড়ক স্থিতি (এক ক্লিকে মতামত দিন)'
              : 'Crowdsourced & verified real-time road conditions (1 vote per commuter)'}
          </p>
        </div>

        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c69429] hover:bg-[#d4a338] text-[#120e0b] font-anek font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.reportAlertBtn}</span>
          </button>
        )}
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const badge = getAlertBadge(alert.type);
          const BadgeIcon = badge.icon;
          const trust = alert.trust_score ?? 70;
          const userVoted = votedMap[alert.id];

          return (
            <div
              key={alert.id}
              className="p-5 rounded-xl border-2 border-[#c69429]/30 bg-[#120e0b]/90 hover:border-[#c69429] transition-all shadow-md"
            >
              {/* Alert Header Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border ${badge.color}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-sm font-anek font-black px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#292019] text-slate-900 dark:text-[#fbf8f1] border border-slate-300 dark:border-[#c69429]/30 shadow-sm">
                    📍 {lang === 'bn' ? (STATIC_HUBS[alert.hub]?.name_bn || alert.hub) : alert.hub}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-anek text-[#c69429]">
                    <Clock className="w-4 h-4 text-[#c69429]" />
                    <span>{lang === 'bn' ? `${toBnDigits(alert.minutes_ago)} মিনিট আগে` : `${alert.minutes_ago}m ago`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-black text-[#f6d16f] bg-[#120e0b] px-3 py-1 rounded-lg border border-[#c69429]/30">
                    <span>{t.trustScoreLabel}:</span>
                    <span>{lang === 'bn' ? `${toBnDigits(Math.round(trust))}%` : `${Math.round(trust)}%`}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-rickshaw text-xl sm:text-2xl text-[#fbf8f1] rickshaw-text-pop mb-1.5">
                {lang === 'bn' ? (alert.title_bn || alert.title) : alert.title}
              </h4>
              <p className="font-anek text-sm sm:text-base text-[#dfcfb2] leading-relaxed mb-4 font-normal">
                {lang === 'bn' ? (alert.description_bn || alert.description) : alert.description}
              </p>

              {/* Action Buttons: Confirm & Resolve */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-[#c69429]/20 font-anek text-sm">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {userVoted ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15453b]/80 border-2 border-[#6ee7b7] text-[#6ee7b7] font-bold text-xs sm:text-sm shadow-md">
                      <Check className="w-4 h-4 text-[#6ee7b7]" />
                      <span>
                        {lang === 'bn' 
                          ? `✓ মতামত দেওয়া হয়েছে (${userVoted === 'upvote' ? 'নিশ্চিত' : 'সমাধান'})` 
                          : `✓ Feedback recorded (${userVoted === 'upvote' ? 'Confirmed' : 'Resolved'})`}
                      </span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleVoteClick(alert.id, 'upvote')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e6e41] hover:bg-[#0b5834] text-white font-bold text-sm border border-emerald-600 active:scale-95 transition-all shadow-sm cursor-pointer"
                        title={lang === 'bn' ? 'সতর্কতা নিশ্চিত করুন' : 'Confirm Alert'}
                      >
                        <ThumbsUp className="w-4 h-4 text-white" />
                        <span>{t.confirmBtn} ({lang === 'bn' ? toBnDigits(alert.upvotes) : alert.upvotes})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVoteClick(alert.id, 'downvote')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#292019] dark:hover:bg-[#3d3026] text-slate-800 dark:text-[#dfcfb2] font-bold text-sm border border-slate-300 dark:border-[#c69429]/40 active:scale-95 transition-all shadow-sm cursor-pointer"
                        title={lang === 'bn' ? 'সমস্যা সমাধান হয়ে থাকলে জানান' : 'Report Resolved'}
                      >
                        <CheckCircle className="w-4 h-4 text-amber-600 dark:text-[#d6645a]" />
                        <span>{t.resolveBtn} ({lang === 'bn' ? toBnDigits(alert.downvotes) : alert.downvotes})</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="text-xs font-mono text-[#6ee7b7] font-semibold">
                  {alert.verified ? (lang === 'bn' ? '✓ পুলিশ ও প্রশাসন দ্বারা পরীক্ষিত' : '✓ Verified by Traffic Police') : (lang === 'bn' ? 'যাত্রী কমিউনিটি রিপোর্ট' : 'Commuter Community Report')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
