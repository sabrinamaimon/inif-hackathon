'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { STATIC_HUBS } from '../data/staticData';
import { I18N } from '../utils/localization';

export default function AddAlertModal({ isOpen, onClose, onSubmitAlert, lang = 'bn' }) {
  if (!isOpen) return null;
  const t = I18N[lang] || I18N.bn;
  const hubNames = Object.keys(STATIC_HUBS);

  const [hub, setHub] = useState('Malibagh');
  const [type, setType] = useState('waterlogging');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(75);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitAlert({
      hub,
      type,
      title,
      description,
      severity: parseInt(severity, 10),
      affected_modes: ['bus', 'leguna', 'rickshaw']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-5 sm:p-6 border border-emerald-500/40 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-white">
              {lang === 'bn' ? 'রাস্তার নতুন বিঘ্ন বা জলজট রিপোর্ট করুন' : 'Submit Live Street Disruption'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'আক্রান্ত এলাকা / হাব' : 'Affected Hub'}
            </label>
            <select
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
            >
              {hubNames.map((h) => (
                <option key={h} value={h}>
                  {lang === 'bn' ? STATIC_HUBS[h].name_bn : h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'বিঘ্নের ধরন' : 'Incident Type'}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:border-emerald-500 focus:outline-none"
            >
              <option value="waterlogging">{t.waterlogging}</option>
              <option value="blockade">{t.blockade}</option>
              <option value="gridlock">{t.gridlock}</option>
              <option value="construction">{t.construction}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'শিরোনাম' : 'Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: মালিবাগ রেলগেটে পানি জমে বাস আটকে আছে' : 'e.g. Waterlogged at Malibagh'}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'bn' ? 'কোন রাস্তায় সমস্যা হচ্ছে, বিকল্প কোনো রাস্তা খোলা আছে কি না...' : 'Describe road conditions...'}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{lang === 'bn' ? 'তীব্রতা মাত্রা (Severity):' : 'Severity:'}</span>
              <span className="font-bold text-rose-400">{severity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'রিপোর্ট সাবমিট করুন' : 'Submit Street Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
