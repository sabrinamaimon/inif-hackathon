'use client';

import React from 'react';
import { MapPin, Zap, Users, AlertCircle } from 'lucide-react';
import { I18N } from '../utils/localization';

export default function StatsBar({ lang }) {
  const t = I18N[lang] || I18N.bn;

  const stats = [
    {
      icon: MapPin,
      value: t.statHubs,
      label: t.statHubsSub,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/40'
    },
    {
      icon: Zap,
      value: t.statFaster,
      label: t.statFasterSub,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40'
    },
    {
      icon: Users,
      value: t.statPassengers,
      label: t.statPassengersSub,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/40'
    },
    {
      icon: AlertCircle,
      value: t.statAlerts,
      label: t.statAlertsSub,
      color: 'text-rose-400',
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/40'
    }
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-5 flex items-center gap-4 border ${s.border} interactive-card`}
          >
            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center shrink-0 shadow-md`}>
              <Icon className={`w-7 h-7 ${s.color}`} />
            </div>
            <div>
              <div className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-semibold mt-0.5">
                {s.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
