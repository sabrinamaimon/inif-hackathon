'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, Bot, User, Sparkles, Navigation } from 'lucide-react';
import { I18N } from '../utils/localization';
import { startSpeechRecognition, speakText } from '../utils/speech';

export default function ChatDrawer({ 
  isOpen, 
  onClose, 
  onToggle, 
  lang = 'bn',
  onApplyRouteFromChat 
}) {
  const t = I18N[lang] || I18N.bn;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: lang === 'bn' 
        ? 'আসসালামু আলাইকুম! আমি ঢাকা-পাথ এআই সহকারী। আপনি বাংলা বা বাংলিশে যে কোনো ট্রানজিট রুট, ছাত্র হাফ-পাস ভাড়া, বা মালিবাগ/শাহবাগের লাইভ জ্যাম পরিস্থিতি জানতে পারেন।'
        : 'Hello! I am your DhakaPath AI Transit Assistant. Ask about routes, student half-pass rules, or live waterlogging and roadblock updates in English or Banglish.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_history: messages.map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const botMsg = {
        sender: 'bot',
        text: lang === 'bn' && data.reply_bn ? data.reply_bn : data.reply,
        structured_route: data.structured_route
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // Local fallback reply
      const fallbackReply = lang === 'bn'
        ? 'মিরপুর ১০ থেকে মতিঝিল পর্যন্ত দ্রুততম রুট হলো এমআরটি-৬ মেট্রোরেল (ভাড়া ৫০ টাকা, সময় ২৫ মিনিট)। ফার্মগেট হয়ে যাওয়ার বিকল্প বাসে ছাত্র হাফ-পাস ভাড়া ১৫ টাকা।'
        : 'The fastest transit from Mirpur 10 to Motijheel is MRT-6 Metro Rail (50 BDT, 25 mins). Local buses via Farmgate accept student half-pass at 15 BDT.';

      setMessages((prev) => [...prev, { sender: 'bot', text: fallbackReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicInput = () => {
    if (isListening) return;
    setIsListening(true);

    startSpeechRecognition({
      lang: lang === 'bn' ? 'bn-BD' : 'en-US',
      onResult: (transcript) => {
        setIsListening(false);
        handleSend(transcript);
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border border-emerald-300"
          title="Open DhakaPath AI Commute Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 absolute -top-1 -right-1 animate-ping" />
          </div>
          <span className="text-xs font-black pr-1 hidden sm:inline">
            {lang === 'bn' ? 'ঢাকা এআই সহকারী' : 'AI Commute Assistant'}
          </span>
        </button>
      )}

      {/* Slide-Up Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[460px] h-[600px] max-h-[92vh] z-50 glass-panel border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{t.chatTitle}</h3>
                <p className="text-xs text-emerald-400 font-semibold">
                  {lang === 'bn' ? 'বাংলা ও বাংলিশ সমর্থিত' : 'English & Banglish Ready'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/70">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[88%]">
                    {isBot && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isBot
                          ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                          : 'bg-emerald-600 text-white font-medium rounded-tr-sm shadow-md'
                      }`}
                    >
                      <p>{m.text}</p>

                      {/* Action for structured route */}
                      {m.structured_route && (
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                          <span className="font-bold text-emerald-300 text-xs">
                            {m.structured_route.title}
                          </span>
                          <button
                            onClick={() => onApplyRouteFromChat && onApplyRouteFromChat(m.structured_route)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs"
                          >
                            {lang === 'bn' ? 'ম্যাপে দেখুন' : 'View on Map'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audio playback button for Bot replies */}
                  {isBot && (
                    <button
                      onClick={() => speakText(m.text, lang)}
                      className="ml-9 mt-1.5 text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
                      title={t.audioPrompt}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t.listenBriefing}</span>
                    </button>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce delay-150" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce delay-300" />
                <span>{lang === 'bn' ? 'উত্তর তৈরি হচ্ছে...' : 'Generating reply...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3.5 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? t.micListening : t.chatPlaceholder}
                  className={`w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border text-white text-sm placeholder:text-slate-500 focus:outline-none ${
                    isListening ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleMicInput}
                  className={`absolute right-2 top-2 p-1.5 rounded-lg ${
                    isListening ? 'mic-active text-white' : 'text-slate-400 hover:text-emerald-400'
                  }`}
                  title={t.micTooltip}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
