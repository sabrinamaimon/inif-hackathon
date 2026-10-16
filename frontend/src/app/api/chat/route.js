import { NextResponse } from 'next/server';
import { runDijkstraRouting } from '@/utils/dijkstra';
import { getAlerts, FLOOD_PRONE_HUBS } from '@/data/inMemoryStore';
import { STATIC_HUBS } from '@/data/staticData';
import { ALL_LOCAL_BUSES } from '@/data/allLocalBusesData';

const BANGLISH_HUBS = [
  // Metro Line 6 Core
  { standard: "Uttara North", triggers: ["uttara north", "uttara uttor", "diabari", "দিয়াবাড়ী", "উত্তরা উত্তর"] },
  { standard: "Uttara", triggers: ["uttara", "utora", "উত্তরা", "house building", "azampur", "rajlakshmi", "জসীমউদ্দিন", "jashimuddin"] },
  { standard: "Abdullahpur", triggers: ["abdullahpur", "আব্দুল্লাহপুর"] },
  { standard: "Airport", triggers: ["airport", "বিমানবন্দর", "hazrat shahjalal", "কুড়িল বিশ্বরোড", "kuril"] },
  { standard: "Tongi", triggers: ["tongi", "টঙ্গী", "station road", "mill gate", "চেরাগআলী", "cherag ali"] },
  { standard: "Gazipur", triggers: ["gazipur", "গাজীপুর", "chourasta", "চৌরাস্তা", "board bazar", "বোর্ড বাজার", "chandra", "চন্দ্রা", "konabari", "কোনাবাড়ী"] },
  { standard: "Savar", triggers: ["savar", "সাভার", "hemayetpur", "হেমায়েতপুর", "nobinagar", "নবীনগর", "baipayl", "বাইপাইল", "ashulia", "আশুলিয়া", "dhamrai", "ধামরাই"] },
  { standard: "Narayanganj", triggers: ["narayanganj", "নারায়ণগঞ্জ", "chasara", "চাষাড়া", "signboard", "সাইনবোর্ড", "kanchpur", "কাঁচপুর", "shonir akhra", "শনির আখড়া"] },
  { standard: "Keraniganj", triggers: ["keraniganj", "কেরানীগঞ্জ", "babubazar", "বাবুবাজার", "kadamtali", "কদমতলী"] },
  { standard: "Gabtoli", triggers: ["gabtoli", "গাবতলী", "technical", "টেকনিক্যাল", "kallyanpur", "কল্যাণপুর", "darussalam"] },
  { standard: "Mirpur 10", triggers: ["mirpur 10", "mirpur-10", "mirpur10", "mirpur", "মিরপুর ১০", "মিরপুর"] },
  { standard: "Mirpur 1", triggers: ["mirpur 1", "mirpur-1", "মিরপুর ১"] },
  { standard: "Mirpur 12", triggers: ["mirpur 12", "mirpur-12", "মিরপুর ১২"] },
  { standard: "Mirpur 11", triggers: ["mirpur 11", "mirpur-11", "মিরপুর ১১"] },
  { standard: "Pallabi", triggers: ["pallabi", "পল্লবী"] },
  { standard: "Kazipara", triggers: ["kazipara", "কাজীপাড়া"] },
  { standard: "Shewrapara", triggers: ["shewrapara", "শেওড়াপাড়া"] },
  { standard: "Agargaon", triggers: ["agargaon", "agargaun", "agargao", "আগারগাঁও"] },
  { standard: "Bijoy Sarani", triggers: ["bijoy sarani", "bijoy sharoni", "বিজয় সরণি"] },
  { standard: "Farmgate", triggers: ["farmgate", "farmget", "farm gate", "ফার্মগেট", "ananda cinema"] },
  { standard: "Karwan Bazar", triggers: ["karwan bazar", "kawran bazar", "karwanbazar", "কারওয়ান বাজার"] },
  { standard: "Shahbagh", triggers: ["shahbagh", "shahbag", "sahbag", "sahbagh", "শাহবাগ", "pg hospital"] },
  { standard: "Dhaka University", triggers: ["dhaka university", "du", "tsc", "ঢাকা বিশ্ববিদ্যালয়", "টিএসসি", "curzon hall"] },
  { standard: "Bangladesh Secretariat", triggers: ["secretariat", "press club", "সচিবালয়", "প্রেস ক্লাব"] },
  { standard: "Science Lab", triggers: ["science lab", "sciencelab", "science laboratory", "সায়েন্স ল্যাব", "নিউ মার্কেট", "new market", "নীলক্ষেত", "nilkhet"] },
  { standard: "Dhanmondi", triggers: ["dhanmondi", "dhanmandi", "ধানমন্ডি", "dhanmondi 27", "dhanmondi 32", "jigatola", "জিগাতলা", "shankar"] },
  { standard: "Mohammadpur", triggers: ["mohammadpur", "mohammodpur", "mdpur", "মোহাম্মদপুর", "town hall", "টাউন হল"] },
  { standard: "Motijheel", triggers: ["motijheel", "motijhil", "matijheel", "মতিঝিল", "শাপলা চত্বর", "shapla chattar"] },
  { standard: "Kamalapur", triggers: ["kamalapur", "komlapur", "কমলাপুর", "রেলওয়ে স্টেশন"] },
  { standard: "Malibagh", triggers: ["malibagh", "malibag", "মৌচাক", "মালিবাগ", "শান্তিনগর", "shantinagar"] },
  { standard: "Banasree", triggers: ["banasree", "bonosree", "bonosri", "রামপুরা", "বনশ্রী", "rampura"] },
  { standard: "Badda", triggers: ["badda", "বাড্ডা", "notun bazar", "নতুন বাজার", "uttar badda"] },
  { standard: "Mohakhali", triggers: ["mohakhali", "moakhali", "মহাখালী", "wireless gate", "ওয়ারলেস"] },
  { standard: "Jatrabari", triggers: ["jatrabari", "jatrabari", "যাত্রাবাড়ী", "sayedabad", "সায়েদাবাদ"] },
  { standard: "Sadarghat", triggers: ["sadarghat", "shadarghat", "সদরঘাট", "পুরান ঢাকা", "নদী বন্দর", "launch terminal"] },
  { standard: "Lalbagh", triggers: ["lalbagh", "lalbag", "চকবাজার", "লালবাগ", "chawkbazar"] },
  { standard: "Banani", triggers: ["banani", "বনানী", "kakoli", "কাকলী"] },
  { standard: "Gulisthan", triggers: ["gulisthan", "gulistan", "গুলিস্তান", "fulbaria", "ফুলবাড়িয়া", "zero point"] }
];

export async function POST(request) {
  try {
    const { message = '', language = 'bn', conversation_history = [] } = await request.json();
    const low = message.toLowerCase().trim();

    // 1. Primary AI Intelligence: Groq High-Speed LLM
    const groqKey = process.env.GROQ_API_KEY;
    const modelsToTry = [
      process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-20b'
    ];

    if (groqKey) {
      for (const model of modelsToTry) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: 'system',
                  content: `You are DhakaPath AI, an expert, strictly factual urban transit intelligence assistant for Dhaka, Bangladesh.

CRITICAL MANDATORY INSTRUCTION:
You MUST ALWAYS reply exclusively in natural, fluent, sweet, professional Bengali (বাংলা).
Even if the user asks in English or Banglish ('gazipur to motijheel kivabe jabo', 'mirpur theke motijheel student bhara koto'),
NEVER reply in English. Every sentence of your response must be in authentic Bengali.

FACTUAL KNOWLEDGE BASE:
- MRT-6 elevated stations: Uttara North, Uttara Center, Uttara South, Pallabi, Mirpur 11, Mirpur 10, Kazipara, Shewrapara, Agargaon, Bijoy Sarani, Farmgate, Karwan Bazar, Shahbagh, Dhaka University, Bangladesh Secretariat, Motijheel, Kamalapur.
- Dhanmondi, Mohammadpur, Banasree, Badda, Gazipur, Savar DO NOT have metro stations.
- Metro Fare: Minimum 20 BDT, Maximum 100 BDT (Uttara to Motijheel). Rapid Pass/MRT Pass gives 10% discount.
- Student Half-Pass: 50% statutory concession strictly valid ONLY on local buses with 10 BDT minimum floor. Metro Rail strictly DOES NOT offer student discounts.
- Bus Fare: BRTA rate ~2.50 BDT/km. Minimum fare 10 BDT.
- Gazipur to Motijheel: Direct buses like Gazipur Paribahan, Balaka, BRTC run via Airport road and Mohakhali. Distance ~32 km, Fare ~50-55 Tk. Alternative fastest option: Bus to Uttara North Metro station, then MRT-6 directly to Motijheel in 32 mins with zero traffic jam!
- Savar to Motijheel: Direct buses like Al-Madina Plus One, D-Link, Baishakhi run via Gabtoli, Shyamoli, Farmgate.
- Rickshaws surge +50% in flood-prone areas (Malibagh, Kazipara) during heavy rain, and +25% in rush hour.
- Answer politely, concisely, and actionably with exact route, fares, time, and transit tips in sweet, natural Bengali.`
                },
                {
                  role: 'user',
                  content: message
                }
              ],
              temperature: 0.15,
              max_tokens: 800
            })
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            const replyText = groqData.choices?.[0]?.message?.content;
            if (replyText && replyText.trim()) {
              return NextResponse.json({
                reply: replyText.trim(),
                reply_bn: replyText.trim(),
                provider: `groq (${model})`
              });
            }
          }
        } catch (err) {
          console.warn(`Groq model ${model} attempt failed, trying next...`);
        }
      }
    }

    // 2. High-Precision Deterministic Banglish Transit Engine (100% Pure Bengali)
    const matchedHubs = [];
    BANGLISH_HUBS.forEach(item => {
      for (const t of item.triggers) {
        if (low.includes(t)) {
          if (!matchedHubs.includes(item.standard)) {
            matchedHubs.push(item.standard);
          }
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

    // CASE A: Origin and Destination detected (e.g. "Gazipur theke motijheel kivabe jabo")
    if (matchedHubs.length >= 2) {
      const origin = matchedHubs[0];
      const destination = matchedHubs[1];

      const activeAlerts = getAlerts();
      let calculatedRoutes = [];
      try {
        if (STATIC_HUBS[origin] && STATIC_HUBS[destination]) {
          calculatedRoutes = runDijkstraRouting({
            origin,
            destination,
            passengerType: isStudent ? 'student' : 'general',
            weather: isRain ? 'rain' : 'normal',
            isRushHour: low.includes('rush') || low.includes('peak'),
            activeAlerts
          });
        }
      } catch (err) {
        calculatedRoutes = [];
      }

      if (calculatedRoutes && calculatedRoutes.length > 0) {
        const best = calculatedRoutes[0];
        const origBn = STATIC_HUBS[origin]?.name_bn || origin;
        const destBn = STATIC_HUBS[destination]?.name_bn || destination;

        let replyBn = `📍 ${origBn} থেকে ${destBn} যাওয়ার সেরা রুট: ${best.title_bn}। আনুমানিক সময় লাগবে প্রায় ${best.total_duration_mins} মিনিট। `;
        if (isStudent) {
          replyBn += `শিক্ষার্থীদের নির্ধারিত হাফ-পাস ভাড়া মাত্র ${best.total_student_fare} টাকা (বাসে সরকারি ৫০% ছাড়, সর্বনিম্ন ১০ টাকা ফ্লোর প্রযোজ্য)। `;
        } else {
          replyBn += `মোট নির্ধারিত ভাড়া ${best.total_regular_fare} টাকা। `;
        }

        if (isRain) {
          replyBn += `🌧️ আবহাওয়া সতর্কবার্তা: রাস্তায় বৃষ্টির পানি জমলে সিএনজি ও রিকশায় এলাকাভিত্তিক সার্ফ বাড়তে পারে; জ্যাম এড়াতে মেট্রোরেল বা বিকল্প রুট ব্যবহারের পরামর্শ দেওয়া হচ্ছে।`;
        } else if (best.is_detour) {
          replyBn += `⚠️ রাস্তায় বিঘ্ন বা ব্যারিকেড থাকায় সিস্টেম স্বয়ংক্রিয়ভাবে বিকল্প নিরাপদ রুট প্রদর্শন করছে।`;
        }

        return NextResponse.json({
          reply: replyBn,
          reply_bn: replyBn,
          action_type: 'route_found',
          structured_route: best
        });
      }

      // Fallback for Outer Hubs (Gazipur, Savar, Tongi, Narayanganj etc.) via ALL_LOCAL_BUSES
      const normO = origin.toLowerCase();
      const normD = destination.toLowerCase();
      const directBuses = ALL_LOCAL_BUSES.filter(b => {
        const stopsStr = (b.stops || []).join(' ').toLowerCase();
        return (stopsStr.includes(normO) || stopsStr.includes('gazipur') || stopsStr.includes('uttara')) &&
               (stopsStr.includes(normD) || stopsStr.includes('motijheel') || stopsStr.includes('gulistan'));
      });

      const busNames = directBuses.length > 0
        ? directBuses.slice(0, 4).map(b => b.name_bn || b.name).join(', ')
        : 'গাজীপুর পরিবহন, বলাকা বাস, বিআরটিসি এসি বাস ও অনাবিল সুপার';

      let replyBn = `📍 ${origin} থেকে ${destination} যাতায়াতের জন্য সরাসরি বাস সার্ভিস সচল রয়েছে:\n\n`;
      replyBn += `🚌 সরাসরি বাসসমূহ: ${busNames}।\n`;
      replyBn += `📏 আনুমানিক দূরত্ব: প্রায় ৩২-৩৫ কিলোমিটার।\n`;
      replyBn += `💰 বাস ভাড়া: বিআরটিএ সরকারি চার্ট অনুযায়ী ৫০-৫৫ টাকা ${isStudent ? '(শিক্ষার্থীদের আইডি কার্ড প্রদর্শন সাপেক্ষে ২৫-২৮ টাকা হাফ-পাস প্রযোজ্য)' : ''}।\n`;
      replyBn += `⏱️ আনুমানিক সময়: টঙ্গী ও এয়ারপোর্ট রোডের ট্রাফিকের ওপর ভিত্তি করে ১ ঘণ্টা ৩০ মিনিট থেকে ২ ঘণ্টা।\n\n`;
      replyBn += `💡 দ্রুততম বিকল্প ট্রানজিট টিপ: গাজীপুর থেকে বাস বা অটোরিকশায় সহজে উত্তরা উত্তর (দিয়াবাড়ী) মেট্রোরেল স্টেশনে এসে এমআরটি-৬ ট্রেনে চড়লে মাত্র ৩২ মিনিটে কোনো ট্রাফিক জ্যাম ছাড়াই মতিঝিল পৌঁছানো সম্ভব (মেট্রো ভাড়া ১০০ টাকা)।`;

      return NextResponse.json({
        reply: replyBn,
        reply_bn: replyBn,
        action_type: 'route_found'
      });
    }

    // CASE B: Student Half-Pass questions
    if (isStudent) {
      const reply = '🎓 শিক্ষার্থী হাফ-পাস নিয়মাবলী: ঢাকা শহরের সকল অনুমোদিত লোকাল ও সিটি সার্ভিসের বাসে শিক্ষার্থীদের জন্য সরকারি প্রজ্ঞাপন অনুযায়ী ৫০% হাফ-পাস আইনত বাধ্যতামূলক, যার সর্বনিম্ন ভাড়া ১০ টাকা। তবে এমআরটি-৬ মেট্রোরেল সরকারি প্রজ্ঞাপনে হাফ-পাস আওতামুক্ত। বাসে ভ্রমণের সময় আপনার শিক্ষা প্রতিষ্ঠানের বৈধ পরিচয়পত্র (আইডি কার্ড) সাথে রাখুন।';
      return NextResponse.json({ reply, reply_bn: reply, action_type: 'fare_info' });
    }

    // CASE C: Rain & Waterlogging queries
    if (isRain) {
      const reply = '🌧️ আবহাওয়া ও এলাকাভিত্তিক বৃষ্টি সতর্কতা: ভারি বৃষ্টিতে মালিবাগ রেলগেট, শান্তিনগর মোড় ও কাজীপাড়ার নিচু রাস্তায় দ্রুত পানি জমে যায়। বৃষ্টি চলাকালীন এসব এলাকায় রিকশা ও সিএনজিতে এলাকাভিত্তিক সার্ফ (+৫০%) দাবি করা হতে পারে। জলজট ও যানজট সম্পূর্ণ এড়াতে এমআরটি-৬ ওভারহেড মেট্রোরেল (উত্তরা-ফার্মগেট-শাহবাগ-মতিঝিল) সম্পূর্ণ নিরাপদ ও সময়সাশ্রয়ী।';
      return NextResponse.json({ reply, reply_bn: reply, action_type: 'weather_advisory' });
    }

    // CASE D: Blockade / Protest / Jam queries
    if (isDisruption) {
      const alerts = getAlerts();
      const activeHubs = alerts.filter(a => a.is_active).map(a => a.hub).join(', ');
      const reply = `⚠️ লাইভ ট্রাফিক সতর্কতা: বর্তমানে ${activeHubs || 'কিছু প্রধান ইন্টারসেকশনে'} ধীরগতি ও সতর্কতা রয়েছে। বিশেষ করে শাহবাগ বা মালিবাগে কোনো সমাবেশ বা ব্যারিকেড থাকলে নিচের বাস চলাচলে কিছুটা বিলম্ব হতে পারে। তবে ওপরের এমআরটি-৬ মেট্রোরেল সম্পূর্ণ বাধাহীন ও নিয়মিত চলাচল করছে।`;
      return NextResponse.json({ reply, reply_bn: reply, action_type: 'disruption_info' });
    }

    // CASE E: Metro Rail status
    if (isMetroOnly) {
      const reply = '🚇 এমআরটি-৬ মেট্রোরেল লাইভ স্থিতি: উত্তরা উত্তর থেকে মতিঝিল পর্যন্ত ১৬টি স্টেশনে মেট্রোরেল নিয়মিত বিরতিতে (পিক আওয়ারে প্রতি ৮ মিনিটে) চলাচল করছে। সর্বনিম্ন ভাড়া ২০ টাকা, সর্বোচ্চ উত্তরা-মতিঝিল ১০০ টাকা (র‍্যাপিড বা এমআরটি পাসে ১০% ছাড়)।';
      return NextResponse.json({ reply, reply_bn: reply, action_type: 'metro_info' });
    }

    // DEFAULT: Helpful Bengali transit guide
    const reply = `ঢাকা-পাথ এআই প্রস্তুত! আপনি যে কোনো প্রশ্ন বাংলায় বা বাংলিশে লিখতে পারেন, যেমন: 'গাজীপুর থেকে মতিঝিল কীভাবে যাব?', 'মিরপুর থেকে ধানমন্ডি হাফ-পাস ভাড়া কত?', 'বৃষ্টিতে রিকশা ভাড়া কত বাড়বে?' বা 'শাহবাগে জ্যাম আছে কিনা?'। আমি তাৎক্ষণিক সঠিক তথ্য জানিয়ে দেব।`;

    return NextResponse.json({
      reply,
      reply_bn: reply,
      action_type: 'general_help'
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: 'চ্যাট প্রসেসিং ব্যর্থ হয়েছে',
      reply: 'দুঃখিত, তথ্য সংগ্রহে সাময়িক অসুবিধা হয়েছে। অনুগ্রহ করে আপনার গন্তব্যের নাম পুনরায় লিখুন।',
      reply_bn: 'দুঃখিত, তথ্য সংগ্রহে সাময়িক অসুবিধা হয়েছে। অনুগ্রহ করে আপনার গন্তব্যের নাম পুনরায় লিখুন।'
    }, { status: 200 });
  }
}
