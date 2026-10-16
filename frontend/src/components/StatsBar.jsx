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
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    },
    {
      icon: Zap,
      value: t.statFaster,
      label: t.statFasterSub,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    },
    {
      icon: Users,
      value: t.statPassengers,
      label: t.statPassengersSub,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30'
    },
    {
      icon: AlertCircle,
      value: t.statAlerts,
      label: t.statAlertsSub,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30'
    }
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 my-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-3.5 flex items-center gap-3.5 border ${s.border} interactive-card`}
          >
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <div className={`text-base sm:text-lg font-black tracking-tight ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {s.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
