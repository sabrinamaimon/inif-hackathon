/**
 * DhakaPath Natural Bengali Voice & Speech Recognition Engine
 * Streams authentic, fluent native Google Bangla audio for natural pronunciation,
 * with seamless fallback to browser Web Speech API.
 */

let activeAudio = null;

export function stopSpeech() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (e) {}
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

export function isSpeechPlaying() {
  return activeAudio && !activeAudio.paused && !activeAudio.ended;
}

export function startSpeechRecognition({ lang = 'bn-BD', onResult, onError, onEnd }) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    if (onResult) onResult(text);
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
    if (onError) onError(err);
    return null;
  }
}

function fallbackSpeechSynthesis(text, lang = 'bn', onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    if (lang === 'bn') {
      const bnVoice = voices.find(v => 
        v.lang === 'bn-BD' || 
        v.lang === 'bn_BD' || 
        v.lang.startsWith('bn') || 
        v.name.toLowerCase().includes('bangla') || 
        v.name.toLowerCase().includes('bengali')
      );
      if (bnVoice) utterance.voice = bnVoice;
    } else {
      const enVoice = voices.find(v => 
        (v.lang === 'en-US' || v.lang === 'en-GB') && 
        (v.name.includes('Natural') || v.name.includes('Google'))
      );
      if (enVoice) utterance.voice = enVoice;
    }
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function speakText(text, lang = 'bn', { onStart, onEnd } = {}) {
  if (!text || typeof window === 'undefined') return;

  // Stop any ongoing playback first
  stopSpeech();

  // Try natural Google Bangla stream via /api/tts
  try {
    const ttsUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang === 'bn' ? 'bn' : 'en'}`;
    const audio = new Audio(ttsUrl);
    activeAudio = audio;

    if (onStart) onStart();

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (e) => {
      console.warn('Natural TTS stream error, falling back to Web Speech API:', e);
      activeAudio = null;
      fallbackSpeechSynthesis(text, lang, onEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Audio play failed (autoplay policy?), falling back to Web Speech:', err);
        fallbackSpeechSynthesis(text, lang, onEnd);
      });
    }
  } catch (err) {
    fallbackSpeechSynthesis(text, lang, onEnd);
  }
}
