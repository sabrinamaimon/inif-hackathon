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
    <div className="heritage-card p-6 sm:p-7 border-2 border-[#c69429]/50 my-8 shadow-2xl bg-[#18130f]">
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

          <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] mt-1 font-medium">
            {lang === 'bn' ? 'যাত্রীভিত্তিক যাচাই ও টাইম-ডিকে অ্যালগরিদম সক্রিয়' : 'Crowdsourced corroboration with time-decay scoring'}
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-anek font-black text-sm flex items-center gap-2 border-2 border-[#f6d16f] shadow-xl shadow-[#b83a2e]/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-[#f6d16f]" />
          <span>{t.submitAlertBtn}</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const badge = getAlertBadge(alert.type);
          const BadgeIcon = badge.icon;
          const trust = alert.trust_score || 80;

          return (
            <div
              key={alert.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#16110d] border-2 border-[#c69429]/30 hover:border-[#f6d16f] transition-all interactive-card shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`flex items-center gap-1.5 text-sm font-anek font-extrabold px-3.5 py-1.5 rounded-xl border ${badge.color}`}>
                    <BadgeIcon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-sm font-anek font-black px-3.5 py-1.5 rounded-lg bg-[#292019] text-[#fbf8f1] border border-[#c69429]/40 shadow-sm">
                    {alert.hub}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm font-mono text-[#dfcfb2]">
                  <div className="flex items-center gap-1.5 font-anek text-[#dfcfb2]">
                    <Clock className="w-4 h-4 text-[#f6d16f]" />
                    <span>{lang === 'bn' ? `${toBnDigits(alert.minutes_ago)} মিনিট আগে` : `${alert.minutes_ago}m ago`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-black text-[#f6d16f] bg-[#120e0b] px-3 py-1 rounded-lg border border-[#c69429]/40">
                    <span className="text-[#dfcfb2]">{t.trustScoreLabel}:</span>
                    <span>{lang === 'bn' ? `${toBnDigits(Math.round(trust))}%` : `${Math.round(trust)}%`}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description in Light Colors */}
              <h4 className="font-rickshaw text-xl sm:text-2xl text-[#fbf8f1] rickshaw-text-pop mb-1.5">
                {lang === 'bn' ? (alert.title_bn || alert.title) : alert.title}
              </h4>
              <p className="font-anek text-sm sm:text-base text-[#dfcfb2] leading-relaxed mb-4 font-normal">
                {alert.description}
              </p>

              {/* Action Buttons: Confirm & Resolve */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c69429]/20 font-anek text-sm">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onVote(alert.id, 'upvote')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e6e41] hover:bg-[#0b5834] text-white font-bold text-sm border border-emerald-600 active:scale-95 transition-all shadow-sm"
                  >
                    <ThumbsUp className="w-4 h-4 text-white" />
                    <span>{t.confirmBtn} ({toBnDigits(alert.upvotes)})</span>
                  </button>

                  <button
                    onClick={() => onVote(alert.id, 'downvote')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#292019] hover:bg-[#3d3026] text-[#f6d16f] font-bold text-sm border border-[#c69429]/40 active:scale-95 transition-all shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-[#f6d16f]" />
                    <span>{t.resolveBtn} ({toBnDigits(alert.downvotes)})</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-[#6ee7b7] font-semibold">
                  {alert.verified ? '✓ পুলিশ ও প্রশাসন দ্বারা পরীক্ষিত' : 'যাত্রী কমিউনিটি রিপোর্ট'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
