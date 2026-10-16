'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { STATIC_HUBS } from '../data/staticData';
import { I18N, toBnDigits } from '../utils/localization';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0705]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="heritage-card w-full max-w-md p-5 sm:p-6 border-2 border-[#b83a2e] bg-[#1a130f] shadow-2xl relative rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c69429]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b83a2e]/30 text-[#f6d16f] border border-[#b83a2e] flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-rickshaw text-lg font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
              {lang === 'bn' ? 'রাস্তার নতুন বিঘ্ন বা জলজট রিপোর্ট' : 'Report Live Street Disruption'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#b83a2e] hover:bg-[#96281e] text-white border-2 border-white shadow-lg cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            title={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <svg className="w-5 h-5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 font-anek">
          <div>
            <label className="block text-xs font-bold text-[#dfcfb2] mb-1">
              {lang === 'bn' ? 'আক্রান্ত এলাকা বা ট্রানজিট হাব' : 'Affected Hub'}
            </label>
            <select
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-xs font-semibold focus:border-[#f6d16f] focus:outline-none"
            >
              {hubNames.map((h) => (
                <option key={h} value={h}>
                  {lang === 'bn' ? STATIC_HUBS[h].name_bn : h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#dfcfb2] mb-1">
              {lang === 'bn' ? 'বিঘ্নের ধরন' : 'Incident Type'}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-xs font-semibold focus:border-[#f6d16f] focus:outline-none"
            >
              <option value="waterlogging">{t.waterlogging}</option>
              <option value="blockade">{t.blockade}</option>
              <option value="gridlock">{t.gridlock}</option>
              <option value="construction">{t.construction}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#dfcfb2] mb-1">
              {lang === 'bn' ? 'শিরোনাম' : 'Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: মালিবাগ রেলগেটে পানি জমে বাস আটকে আছে' : 'e.g. Waterlogged at Malibagh'}
              className="w-full px-3 py-2 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-xs focus:border-[#f6d16f] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#dfcfb2] mb-1">
              {lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'bn' ? 'কোন রাস্তায় সমস্যা হচ্ছে, বিকল্প কোনো রাস্তা খোলা আছে কি না...' : 'Describe road conditions...'}
              className="w-full px-3 py-2 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-xs focus:border-[#f6d16f] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-[#dfcfb2] mb-1">
              <span>{lang === 'bn' ? 'তীব্রতার মাত্রা:' : 'Severity:'}</span>
              <span className="font-bold text-[#f6d16f]">{lang === 'bn' ? `${toBnDigits(severity)}%` : `${severity}%`}</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full accent-[#b83a2e]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-anek font-black text-xs flex items-center justify-center gap-2 border-2 border-[#f6d16f] shadow-lg shadow-[#b83a2e]/30 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#f6d16f]" />
              <span>{lang === 'bn' ? 'রিপোর্ট সাবমিট করুন' : 'Submit Street Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
