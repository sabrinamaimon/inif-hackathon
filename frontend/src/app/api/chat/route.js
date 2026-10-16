import { NextResponse } from 'next/server';
import { runDijkstraRouting } from '@/utils/dijkstra';
import { getAlerts } from '@/data/inMemoryStore';
import { STATIC_HUBS } from '@/data/staticData';

const BANGLISH_HUBS = [
  { standard: "Uttara", triggers: ["uttara", "utora", "উত্তরা"] },
  { standard: "Mirpur 10", triggers: ["mirpur 10", "mirpur-10", "mirpur10", "mirpur", "মিরপুর ১০", "মিরপুর"] },
  { standard: "Agargaon", triggers: ["agargaon", "agargaun", "agargao", "আগারগাঁও"] },
  { standard: "Farmgate", triggers: ["farmgate", "farmget", "farm gate", "ফার্মগেট"] },
  { standard: "Shahbagh", triggers: ["shahbagh", "shahbag", "sahbag", "sahbagh", "শাহবাগ"] },
  { standard: "Science Lab", triggers: ["science lab", "sciencelab", "science laboratory", "সায়েন্স ল্যাব"] },
  { standard: "Dhanmondi", triggers: ["dhanmondi", "dhanmandi", "ধানমন্ডি"] },
  { standard: "Mohammadpur", triggers: ["mohammadpur", "mohammodpur", "mdpur", "মোহাম্মদপুর"] },
  { standard: "Motijheel", triggers: ["motijheel", "motijhil", "মতিঝিল"] },
  { standard: "Malibagh", triggers: ["malibagh", "malibag", "মালিবাগ"] },
  { standard: "Banasree", triggers: ["banasree", "bonosree", "bonosri", "বনশ্রী"] },
  { standard: "Badda", triggers: ["badda", "বাড্ডা"] },
  { standard: "Mohakhali", triggers: ["mohakhali", "moakhali", "মহাখালী"] },
  { standard: "Jatrabari", triggers: ["jatrabari", "jatrabari", "যাত্রাবাড়ী"] }
];

export async function POST(request) {
  try {
    const { message = '', language = 'bn', conversation_history = [] } = await request.json();
    const low = message.toLowerCase().trim();

    // 1. Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are DhakaPath AI, an expert transit intelligence assistant for Dhaka, Bangladesh.
CRITICAL: You MUST understand Banglish (Bengali written using English alphabet like 'mirpur theke motijheel kivabe jabo', 'student bhara koto', 'brishti hoile rickshaw fare koto barbe', 'shahbagh e jam ache kina').
Rules:
- Never hallucinate non-existent metro stations or fake bus lines.
- MRT-6 runs: Uttara ➔ Mirpur 10 ➔ Agargaon ➔ Farmgate ➔ Shahbagh ➔ Motijheel.
- Statutory 50% student discount applies to local buses with a 10 BDT minimum statutory floor.
- Metro strictly does NOT accept student half-pass.
- Rickshaws surge +50% in rain and +25% in rush hour.
- Reply politely in Bengali or English based on the question. Keep advice actionable and concise.

User query (may be in Banglish, Bengali, or English): "${message}"`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              reply_bn: replyText,
              provider: 'gemini-1.5-flash'
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, using high-precision Banglish transit NLP parser.');
      }
    }

    // 2. High-Precision Deterministic Banglish Transit Engine
    // Detect Hubs
    const matchedHubs = [];
    BANGLISH_HUBS.forEach(item => {
      for (const t of item.triggers) {
        if (low.includes(t)) {
          matchedHubs.push(item.standard);
          break;
        }
      }
    });

    // Detect Student Concession intent
    const isStudent = (
      low.includes('student') ||
      low.includes('half') ||
      low.includes('haf') ||
      low.includes('chhatro') ||
      low.includes('ছাত্র') ||
      low.includes('হাফ') ||
      low.includes('id card')
    );

    // Detect Weather / Rain intent
    const isRain = (
      low.includes('rain') ||
      low.includes('brishti') ||
      low.includes('bristi') ||
      low.includes('pani') ||
      low.includes('jol') ||
      low.includes('waterlog') ||
      low.includes('flood') ||
      low.includes('বৃষ্টি') ||
      low.includes('জলজট')
    );

    // Detect Traffic Jam / Blockade intent
    const isDisruption = (
      low.includes('jam') ||
      low.includes('traffic') ||
      low.includes('block') ||
      low.includes('blockade') ||
      low.includes('andolon') ||
      low.includes('michil') ||
      low.includes('oborodh') ||
      low.includes('protest') ||
      low.includes('bhir') ||
      low.includes('rush') ||
      low.includes('জ্যাম') ||
      low.includes('অবরোধ')
    );

    // Detect Metro Specific Query
    const isMetroOnly = (
      (low.includes('metro') || low.includes('metrorail') || low.includes('mrt') || low.includes('মেট্রো')) &&
      matchedHubs.length < 2
    );

    // CASE A: Origin and Destination detected (e.g. "Mirpur theke motijheel kivabe jabo")
    if (matchedHubs.length >= 2) {
      const origin = matchedHubs[0];
      const destination = matchedHubs[1];

      const activeAlerts = getAlerts();
      const calculatedRoutes = runDijkstraRouting({
        origin,
        destination,
        passengerType: isStudent ? 'student' : 'general',
        weather: isRain ? 'rain' : 'normal',
        isRushHour: low.includes('rush') || low.includes('peak'),
        activeAlerts
      });

      const best = calculatedRoutes[0];
      const origBn = STATIC_HUBS[origin]?.name_bn || origin;
      const destBn = STATIC_HUBS[destination]?.name_bn || destination;

      let replyBn = `📍 ${origBn} থেকে ${destBn} যাওয়ার সেরা রুট: ${best.title_bn}। আনুমানিক সময় ${best.total_duration_mins} মিনিট। `;
      if (isStudent) {
        replyBn += `শিক্ষার্থীদের হাফ-পাস ভাড়া মাত্র ${best.total_student_fare} টাকা (বাসে ৫০% ছাড়, সর্বনিম্ন ১০ টাকা ফ্লোর প্রযোজ্য)। `;
      } else {
        replyBn += `মোট ভাড়া ${best.total_regular_fare} টাকা। `;
      }

      if (isRain) {
        replyBn += `🌧️ বৃষ্টির কারণে রাস্তায় যানজট ও রিকশায় অতিরিক্ত ভাড়া হতে পারে; মেট্রোরেল ব্যবহারের পরামর্শ দেওয়া হচ্ছে।`;
      } else if (best.is_detour) {
        replyBn += `⚠️ রাস্তায় জলজট বা ব্যারিকেড থাকায় সিস্টেম স্বয়ংক্রিয়ভাবে নিরাপদ ডিট্যুর রুট বেছে নিয়েছে।`;
      }

      return NextResponse.json({
        reply: replyBn,
        reply_bn: replyBn,
        action_type: 'route_found',
        structured_route: best
      });
    }

    // CASE B: Student Half-Pass questions (e.g. "student bhara koto", "half pass ki cholbe?")
    if (isStudent) {
      const reply = language === 'bn'
        ? '🎓 শিক্ষার্থী হাফ-পাস নিয়মাবলী: ঢাকা শহরের সকল লোকাল বাসে শিক্ষার্থীদের জন্য ৫০% হাফ-পাস আইনত বাধ্যতামূলক, যার সর্বনিম্ন ভাড়া ১০ টাকা। তবে এমআরটি-৬ মেট্রোরেলে কোনো হাফ-পাস প্রযোজ্য নয়। বাসে ভ্রমণের সময় শিক্ষা প্রতিষ্ঠানের বৈধ আইডি কার্ড সাথে রাখুন।'
        : '🎓 Student Concession Rules: A 50% statutory discount applies to all Dhaka city local buses with a 10 BDT minimum floor. However, MRT-6 Metro Rail does NOT offer student discounts. Always carry your valid student ID card.';

      return NextResponse.json({ reply, reply_bn: reply, action_type: 'fare_info' });
    }

    // CASE C: Rain & Waterlogging queries (e.g. "brishti hoile rickshaw fare koto barbe?")
    if (isRain) {
      const reply = language === 'bn'
        ? '🌧️ আবহাওয়া ও বৃষ্টি সতর্কতা: ভারী বৃষ্টিতে মালিবাগ, শান্তিনগর ও কাজীপাড়ার নিচু রাস্তায় দ্রুত পানি জমে যায়। বৃষ্টি চলাকালীন রিকশাচালকরা সাধারণত ৫০% অতিরিক্ত সার্ফ ভাড়া দাবি করে। জলজট এড়াতে ওভারহেড মেট্রোরেল (উত্তরা-মিরপুর-ফার্মগেট-মতিঝিল) সম্পূর্ণ নিরাপদ ও নিরবচ্ছিন্ন।'
        : '🌧️ Rain & Flood Advisory: Heavy rain causes severe waterlogging in Malibagh and Shantinagar. Rickshaws surge by +50%. Use the elevated MRT-6 Metro Rail to bypass surface waterlogging without delays.';

      return NextResponse.json({ reply, reply_bn: reply, action_type: 'weather_advisory' });
    }

    // CASE D: Blockade / Protest / Jam queries (e.g. "shahbagh e ki jam ache?")
    if (isDisruption) {
      const alerts = getAlerts();
      const activeHubs = alerts.filter(a => a.is_active).map(a => a.hub).join(', ');

      const reply = language === 'bn'
        ? `⚠️ লাইভ ট্রাফিক সতর্কতা: বর্তমানে ${activeHubs || 'কিছু প্রধান ইন্টারসেকশনে'} ধীরগতি ও সতর্কতা রয়েছে। বিশেষ করে শাহবাগ বা মালিবাগে কোনো অবরোধ বা জলজট থাকলে নিচের বাস চলাচলে দেরি হতে পারে। কিন্তু উপর দিয়ে এমআরটি-৬ মেট্রোরেল সম্পূর্ণ সচল রয়েছে।`
        : `⚠️ Traffic Advisory: Active street disruptions reported near ${activeHubs || 'major corridors'}. When surface intersections like Shahbagh are blocked, MRT-6 Metro elevated trains run unimpeded.`;

      return NextResponse.json({ reply, reply_bn: reply, action_type: 'disruption_info' });
    }

    // CASE E: Metro Rail status (e.g. "ajke ki metro rail khola ache?", "mrt schedule")
    if (isMetroOnly) {
      const reply = language === 'bn'
        ? '🚇 এমআরটি-৬ মেট্রোরেল লাইভ স্ট্যাটাস: উত্তরা উত্তর থেকে মতিঝিল পর্যন্ত ১৬টি স্টেশনে মেট্রোরেল নিয়মিত বিরতিতে (পিক আওয়ারে প্রতি ৮ মিনিটে) চলাচল করছে। সর্বনিম্ন ভাড়া ২০ টাকা, সর্বোচ্চ উত্তরা-মতিঝিল ১০০ টাকা।'
        : '🚇 MRT-6 Metro Rail Status: Operating normally between Uttara North and Motijheel every 8-10 minutes. Fares range from 20 BDT to 100 BDT.';

      return NextResponse.json({ reply, reply_bn: reply, action_type: 'metro_info' });
    }

    // DEFAULT: Helpful Banglish-friendly transit guide
    const reply = language === 'bn'
      ? `ঢাকা-পাথ এআই প্রস্তুত! আপনি বাংলিশে লিখতে পারেন, যেমন: 'mirpur theke motijheel student bhara koto?', 'shahbagh e jam ache kina?', অথবা 'brishti hoile rickshaw fare koto barbe?'। আমি তাৎক্ষণিক সঠিক তথ্য জানিয়ে দেব।`
      : `DhakaPath AI is ready! You can write in Banglish (e.g. 'mirpur theke motijheel student bhara koto?', 'shahbagh e jam ache?'). I will provide instant route and fare intelligence.`;

    return NextResponse.json({
      reply,
      reply_bn: reply,
      action_type: 'general_help'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat processing failed' }, { status: 500 });
  }
}
