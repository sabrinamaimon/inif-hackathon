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
        return { label: t.waterlogging, color: 'text-[#7dd3fc] bg-[#1c4568]/40 border-[#346894]', icon: Droplets };
      case 'blockade':
        return { label: t.blockade, color: 'text-[#f6d16f] bg-[#b83a2e]/40 border-[#b83a2e]', icon: ShieldAlert };
      case 'gridlock':
        return { label: t.gridlock, color: 'text-[#f6d16f] bg-[#e2b448]/20 border-[#c69429]', icon: Flame };
      default:
        return { label: t.construction, color: 'text-[#6ee7b7] bg-[#15453b]/40 border-[#2a6f62]', icon: AlertTriangle };
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

          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-xs font-mono text-[#f6d16f] shadow-inner">
            <span className="font-bold text-[#dfcfb2]">Trust Formula:</span>
            <span>Trust = (Upvotes × 8 − Downvotes × 12 + 50) × TimeDecay</span>
          </div>
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
                  <span className={`flex items-center gap-1.5 text-xs font-anek font-bold px-3 py-1 rounded-xl border ${badge.color}`}>
                    <BadgeIcon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs sm:text-sm font-anek font-black text-[#fbf8f1] px-3 py-1 rounded-lg bg-[#292019] border border-[#c69429]/30">
                    {alert.hub}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#dfcfb2]">
                  <div className="flex items-center gap-1.5 font-anek">
                    <Clock className="w-3.5 h-3.5 text-[#c69429]" />
                    <span>{lang === 'bn' ? `${toBnDigits(alert.minutes_ago)} মিনিট আগে` : `${alert.minutes_ago}m ago`}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-black text-[#f6d16f] bg-[#120e0b] px-2.5 py-0.5 rounded-lg border border-[#c69429]/30">
                    <span>{t.trustScoreLabel}:</span>
                    <span>{lang === 'bn' ? `${toBnDigits(Math.round(trust))}%` : `${Math.round(trust)}%`}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h4 className="font-rickshaw text-lg sm:text-xl text-[#fbf8f1] mb-1.5">
                {lang === 'bn' ? (alert.title_bn || alert.title) : alert.title}
              </h4>
              <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] leading-relaxed mb-4">
                {alert.description}
              </p>

              {/* Action Buttons: Confirm & Resolve */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c69429]/20 font-anek text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVote(alert.id, 'upvote')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#15453b] hover:bg-[#1f5e51] text-[#fbf8f1] font-bold border border-[#2a6f62] active:scale-95 transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-[#6ee7b7]" />
                    <span>{t.confirmBtn} ({toBnDigits(alert.upvotes)})</span>
                  </button>

                  <button
                    onClick={() => onVote(alert.id, 'downvote')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#292019] hover:bg-[#3d3026] text-[#dfcfb2] font-bold border border-[#c69429]/30 active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#d6645a]" />
                    <span>{t.resolveBtn} ({toBnDigits(alert.downvotes)})</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#c69429]">
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
