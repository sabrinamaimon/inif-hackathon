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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0705]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="heritage-card w-full max-w-lg p-5 sm:p-6 border-2 border-[#c69429] bg-[#1a130f] shadow-2xl relative rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c69429]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b83a2e]/30 text-[#f6d16f] border border-[#b83a2e] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-rickshaw text-lg font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
                {lang === 'bn' ? 'বাসের সাইনবোর্ড ও ভাড়ার তালিকা স্ক্যান' : 'Signboard & Notice Digitization'}
              </h3>
              <p className="font-anek text-xs text-[#dfcfb2]">
                {lang === 'bn' ? 'বাসের গায়ের স্টপ চার্ট বা ভাড়ার তালিকার ছবি তুলে ডেটাবেজে যুক্ত করুন' : 'Upload photo of bus route board or fare chart to digitize'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white border border-[#c69429]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!extractedData && (
          <label className="border-2 border-dashed border-[#c69429]/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#f6d16f] hover:bg-[#201712] transition-all text-center bg-[#120e0b]">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="w-12 h-12 rounded-2xl bg-[#b83a2e]/20 text-[#f6d16f] border border-[#c69429]/40 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-anek text-sm font-bold text-[#fbf8f1] mb-1">
              {lang === 'bn' ? 'ছবি নির্বাচন বা ক্যামেরা দিয়ে তুলুন' : 'Click or capture photo'}
            </span>
            <span className="font-anek text-xs text-[#dfcfb2]">
              JPEG, PNG, WebP (বাসের সাইড প্যানেল ও বিআরটিএ চার্ট)
            </span>
          </label>
        )}

        {isProcessing && (
          <div className="py-8 flex flex-col items-center justify-center gap-3 font-anek">
            <div className="w-8 h-8 border-3 border-[#f6d16f] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-[#f6d16f]">
              {lang === 'bn' ? 'এআই ভিশন মডেল দিয়ে পাঠোদ্ধার ও প্রসেস করা হচ্ছে...' : 'Extracting stops and fare tiers via AI Vision...'}
            </span>
          </div>
        )}

        {/* Extracted Structured Result */}
        {extractedData && (
          <div className="space-y-3.5 font-anek">
            <div className="p-4 rounded-xl bg-[#16110d] border-2 border-[#c69429]/40 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#dfcfb2] font-semibold">{lang === 'bn' ? 'শনাক্তকৃত বাস:' : 'Detected Bus:'}</span>
                <span className="px-2 py-0.5 rounded bg-[#15453b] text-[#7dd3fc] text-xs font-bold border border-[#2a6f62]">
                  {lang === 'bn' ? `নির্ভুলতা: ${toBnDigits(Math.round(extractedData.confidence * 100))}%` : `Confidence: ${Math.round(extractedData.confidence * 100)}%`}
                </span>
              </div>
              <h4 className="font-rickshaw text-lg font-bold text-[#fbf8f1] mb-3">
                {extractedData.bus_name}
              </h4>

              <div className="text-xs text-[#dfcfb2] mb-3">
                <span className="font-bold text-[#f6d16f] block mb-1">
                  {lang === 'bn' ? 'স্টপসমূহ:' : 'Extracted Stops:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedData.detected_stops.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#201712] border border-[#c69429]/30 text-[11px] text-[#fbf8f1]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#c69429]/20 text-xs">
                <span>{lang === 'bn' ? 'ভাড়ার পরিসীমা:' : 'Fare Range:'} <strong className="font-rickshaw text-base text-[#f6d16f]">{formatFare(extractedData.base_fare_bdt, lang)} - {formatFare(extractedData.max_fare_bdt, lang)}</strong></span>
                <span className="text-[#7dd3fc] font-semibold">✓ {lang === 'bn' ? 'হাফ-পাস সমর্থিত' : 'Student Pass Accepted'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(lang === 'bn' ? 'সফলভাবে ট্রানজিট ডাটাবেজে অন্তর্ভুক্ত হয়েছে!' : 'Route successfully digitized into transit database!');
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-bold text-xs border-2 border-[#f6d16f] shadow-md active:scale-95 transition-all"
            >
              {lang === 'bn' ? 'সিস্টেম ডিরেক্টরিতে অন্তর্ভুক্ত করুন' : 'Import to Transit Directory'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
