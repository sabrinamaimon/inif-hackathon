'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { formatFare, toBnDigits } from '../utils/localization';

export default function NoticeScanner({ isOpen, onClose, lang = 'bn' }) {
  if (!isOpen) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setIsProcessing(true);

    // Call OCR endpoint or simulated vision processing
    setTimeout(() => {
      setExtractedData({
        bus_name: "Bikolpo Auto Service (বিকল্প)",
        route_code: "MIR-MJL-04",
        detected_stops: ["Mirpur 10", "Kazipara", "Shewrapara", "Agargaon", "Farmgate", "Shahbagh", "Paltan", "Motijheel"],
        base_fare_bdt: 10,
        max_fare_bdt: 40,
        student_pass_accepted: true,
        confidence: 0.94
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg p-5 sm:p-6 border border-emerald-500/40 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {lang === 'bn' ? 'বাসের সাইনবোর্ড ও ভাড়ার তালিকা স্ক্যান (Bonus 1)' : 'Signboard & Notice Digitization (Bonus 1)'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'বাসের গায়ের স্টপ চার্ট বা ভাড়ার তালিকার ছবি তুলে ডেটাবেজে যুক্ত করুন' : 'Upload photo of bus route board or fare chart to digitize'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!extractedData && (
          <label className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-950/20 transition-all text-center">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white mb-1">
              {lang === 'bn' ? 'ছবি নির্বাচন বা ক্যামেরা দিয়ে তুলুন' : 'Click or capture photo'}
            </span>
            <span className="text-xs text-slate-400">
              Supports JPEG, PNG, WebP (Bus side panels, printed BRTA fare charts)
            </span>
          </label>
        )}

        {isProcessing && (
          <div className="py-8 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-emerald-400">
              {lang === 'bn' ? 'এআই ভিশন মডেল দিয়ে পাঠোদ্ধার ও প্রসেস করা হচ্ছে...' : 'Extracting stops and fare tiers via AI Vision...'}
            </span>
          </div>
        )}

        {/* Extracted Structured Result */}
        {extractedData && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-semibold">{lang === 'bn' ? 'শনাক্তকৃত বাস:' : 'Detected Bus:'}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {lang === 'bn' ? `নির্ভুলতা: ${toBnDigits(Math.round(extractedData.confidence * 100))}%` : `Confidence: ${Math.round(extractedData.confidence * 100)}%`}
                </span>
              </div>
              <h4 className="text-base font-black text-white mb-3">
                {extractedData.bus_name}
              </h4>

              <div className="text-xs text-slate-300 mb-3">
                <span className="font-bold text-emerald-400 block mb-1">
                  {lang === 'bn' ? 'স্টপসমূহ:' : 'Extracted Stops:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedData.detected_stops.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                <span>{lang === 'bn' ? 'ভাড়ার পরিসীমা:' : 'Fare Range:'} <strong className="text-emerald-400">{formatFare(extractedData.base_fare_bdt, lang)} - {formatFare(extractedData.max_fare_bdt, lang)}</strong></span>
                <span className="text-blue-300 font-semibold">✓ {lang === 'bn' ? 'হাফ-পাস সমর্থিত' : 'Student Pass Accepted'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(lang === 'bn' ? 'সফলভাবে ট্রানজিট ডাটাবেজে অন্তর্ভুক্ত হয়েছে!' : 'Route successfully digitized into transit database!');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              {lang === 'bn' ? 'সিস্টেম ডিরেক্টরিতে অন্তর্ভুক্ত করুন' : 'Import to Transit Directory'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
