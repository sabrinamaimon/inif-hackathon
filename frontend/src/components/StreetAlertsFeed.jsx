'use client';

import React from 'react';
import { 
  AlertTriangle, ThumbsUp, CheckCircle, Droplets, ShieldAlert, 
  Clock, Plus, Flame, Bus, Bike, Car 
} from 'lucide-react';
import { I18N, toBnDigits } from '../utils/localization';

export default function StreetAlertsFeed({
  alerts = [],
  onVote,
  onOpenReportModal,
  lang = 'bn'
}) {
  const t = I18N[lang] || I18N.bn;

  const getAlertBadge = (type) => {
    switch (type) {
      case 'waterlogging':
        return { label: t.waterlogging, color: 'text-blue-400 bg-blue-500/20 border-blue-500/40', icon: Droplets };
      case 'blockade':
        return { label: t.blockade, color: 'text-rose-400 bg-rose-500/20 border-rose-500/40', icon: ShieldAlert };
      case 'gridlock':
        return { label: t.gridlock, color: 'text-amber-400 bg-amber-500/20 border-amber-500/40', icon: Flame };
      default:
        return { label: t.construction, color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40', icon: AlertTriangle };
    }
  };

  return (
    <div className="glass-panel p-5 border border-emerald-500/30 my-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>{t.alertsTitle}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
              {lang === 'bn' ? `${toBnDigits(alerts.length)}টি সক্রিয়` : `${alerts.length} Active`}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'bn' ? 'যাত্রীভিত্তিক যাচাই ও টাইম-ডিকে অ্যালগরিদম সক্রিয়' : 'Crowdsourced corroboration with time-decay scoring'}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.submitAlertBtn}</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-3.5">
        {alerts.map((alert) => {
          const badge = getAlertBadge(alert.type);
          const BadgeIcon = badge.icon;
          const trust = alert.trust_score || 80;

          return (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all interactive-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-md bg-slate-800">
                    {alert.hub}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'bn' ? `${toBnDigits(alert.minutes_ago)} মিনিট আগে` : `${alert.minutes_ago}m ago`}</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-emerald-400">
                    <span>{t.trustScoreLabel}:</span>
                    <span>{lang === 'bn' ? `${toBnDigits(Math.round(trust))}%` : `${Math.round(trust)}%`}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                {lang === 'bn' ? (alert.title_bn || alert.title) : alert.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {alert.description}
              </p>

              {/* Affected Modes & Voting Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-850">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="font-semibold">{lang === 'bn' ? 'আক্রান্ত বাহন:' : 'Affected Modes:'}</span>
                  {alert.affected_modes.map((mode, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-medium">
                      {mode.toUpperCase()}
                    </span>
                  ))}
                </div>

                {/* Corroboration Votes */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVote(alert.id, 'upvote')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold active:scale-95 transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{t.confirmBtn} ({lang === 'bn' ? toBnDigits(alert.upvotes) : alert.upvotes})</span>
                  </button>

                  <button
                    onClick={() => onVote(alert.id, 'downvote')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.resolveBtn}</span>
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
