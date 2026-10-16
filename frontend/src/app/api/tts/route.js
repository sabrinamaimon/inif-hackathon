import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Number to fluent Bengali word map (0 to 100)
const BN_WORDS_0_TO_100 = {
  0: 'শূন্য', 1: 'এক', 2: 'দুই', 3: 'তিন', 4: 'চার', 5: 'পাঁচ',
  6: 'ছয়', 7: 'সাত', 8: 'আট', 9: 'নয়', 10: 'দশ',
  11: 'এগারো', 12: 'বারো', 13: 'তেরো', 14: 'চৌদ্দ', 15: 'পনেরো',
  16: 'ষোলো', 17: 'সতেরো', 18: 'আঠারো', 19: 'উনিশ', 20: 'বিশ',
  21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ',
  26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'উনত্রিশ', 30: 'ত্রিশ',
  31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ',
  36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'উনচল্লিশ', 40: 'চল্লিশ',
  41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ',
  46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'উনপঞ্চাশ', 50: 'পঞ্চাশ',
  51: 'একান্ন', 52: 'বায়ান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন',
  56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'উনষাট', 60: 'ষাট',
  61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি',
  66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'উনসত্তর', 70: 'সত্তর',
  71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর',
  76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'উনাশি', 80: 'আশি',
  81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি',
  86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'অষ্টায়ি', 89: 'উননব্বই', 90: 'নব্বই',
  91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই',
  96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই', 100: 'একশো'
};

export function numberToBengaliWords(num) {
  const n = Math.round(Number(num));
  if (isNaN(n)) return '';
  if (BN_WORDS_0_TO_100[n]) return BN_WORDS_0_TO_100[n];
  if (n > 100 && n < 200) {
    const rem = n - 100;
    return `একশো ${BN_WORDS_0_TO_100[rem] || rem}`;
  }
  if (n >= 200 && n < 1000) {
    const hundred = Math.floor(n / 100);
    const rem = n % 100;
    const hText = hundred === 2 ? 'দুশো' : `${BN_WORDS_0_TO_100[hundred] || hundred}শো`;
    return rem === 0 ? hText : `${hText} ${BN_WORDS_0_TO_100[rem] || rem}`;
  }
  return String(n);
}

function sanitizeForSpeech(raw) {
  if (!raw) return '';

  // 1. Convert Bengali numerals (০-৯) to Arabic digits first
  const bnToAr = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  let text = raw.replace(/[০-৯]/g, d => bnToAr[d] || d);

  // 2. Convert decimal numbers (e.g. 3.7 কিমি -> চার কিমি or তিন দশমিক সাত)
  text = text.replace(/(\d+)\.(\d+)/g, (match, p1, p2) => {
    const w1 = numberToBengaliWords(p1);
    const w2 = numberToBengaliWords(p2);
    return `${w1} দশমিক ${w2}`;
  });

  // 3. Convert integer numbers to Bengali words (e.g. 16 মিনিট -> ষোলো মিনিট, 23 টাকা -> তেইশ টাকা)
  text = text.replace(/\b(\d+)\b/g, (match, p1) => {
    return numberToBengaliWords(p1);
  });

  // 4. Strip emojis and special transit symbols
  text = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');
  text = text.replace(/[🟢🔴🟡⏱️💰📏🛡️🚇🚌🚕🏍️🚗🛺🚐✦📍🎓🌧️⚠️👉|~_*#`]/g, ' ');

  // 5. Remove English leak keywords in parentheses like (traffic) or (safe)
  text = text.replace(/\((traffic|safe|warning|gridlock|waterlogging)\)/gi, '');

  // 6. Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}

function chunkText(text, maxLen = 140) {
  const sentences = text.split(/(?<=[।?!,;])\s+/);
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    if (!s) continue;
    if ((current + ' ' + s).trim().length <= maxLen) {
      current = (current ? current + ' ' + s : s).trim();
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s;
      } else {
        // Break long sentence by spaces
        const words = s.split(' ');
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub ? sub + ' ' + w : w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawText = searchParams.get('text') || '';
    const lang = searchParams.get('lang') || 'bn';

    const clean = sanitizeForSpeech(rawText);
    if (!clean) {
      return new NextResponse('Empty text', { status: 400 });
    }

    const chunks = chunkText(clean, 140);
    const audioBuffers = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk.trim())}`;
      const res = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!res.ok) {
        console.warn(`TTS fetch failed for chunk: "${chunk}" with status ${res.status}`);
        continue;
      }

      const buf = await res.arrayBuffer();
      audioBuffers.push(Buffer.from(buf));
    }

    if (audioBuffers.length === 0) {
      return new NextResponse('Failed to generate audio', { status: 502 });
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    return new Response(combinedBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(combinedBuffer.length),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('TTS route error:', error);
    return new NextResponse('Internal TTS Error', { status: 500 });
  }
}
