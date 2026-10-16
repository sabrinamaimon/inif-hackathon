/**
 * Browser-Native Web Speech API Helpers
 * Completely free, zero API keys, runs directly in browser.
 */

export function startSpeechRecognition({ lang = 'bn-BD', onResult, onError, onEnd }) {
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

export function speakText(text, lang = 'bn') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Attempt to select the most natural voice
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

  window.speechSynthesis.speak(utterance);
}
