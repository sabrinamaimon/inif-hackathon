import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message = '', language = 'bn' } = await request.json();
    const low = message.toLowerCase();

    // Check if Gemini API key exists
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
                      text: `You are DhakaPath AI, an expert urban transit and traffic navigation assistant in Dhaka, Bangladesh.
Rules:
- Never hallucinate non-existent metro stations or fake bus routes.
- MRT-6 runs from Uttara North to Motijheel via Mirpur 10, Agargaon, Farmgate, Shahbagh.
- Students receive statutory 50% discount on local buses with a 10 BDT minimum floor. Metro does NOT accept student discount.
- Rickshaws surge +50% in rain and +25% during rush hour.
- Answer in ${language === 'bn' ? 'Bengali (বাংলা)' : 'English'}, concisely and practically.

User message: ${message}`
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
              provider: 'gemini-1.5-flash'
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local grounded knowledge engine.');
      }
    }

    // High quality deterministic grounded transit responder
    let reply = '';
    if (low.includes('student') || low.includes('half') || low.includes('হাফ') || low.includes('ছাত্র')) {
      reply = language === 'bn'
        ? '💡 ঢাকা শহরের লোকাল বাসে শিক্ষার্থীদের জন্য ৫০% হাফ-পাস আইনত বাধ্যতামূলক, যার সর্বনিম্ন ভাড়া ১০ টাকা। তবে এমআরটি-৬ মেট্রোরেলে কোনো হাফ-পাস প্রযোজ্য নয়।'
        : '💡 Students are entitled to a 50% statutory discount on local buses with a 10 BDT floor. However, MRT-6 Metro Rail does not accept student concession.';
    } else if (low.includes('metro') || low.includes('মেট্রো') || low.includes('mrt')) {
      reply = language === 'bn'
        ? '🚇 এমআরটি-৬ মেট্রোরেল উত্তরা থেকে মতিঝিল পর্যন্ত নিয়মিত বিরতিতে চলছে। শাহবাগ বা ফার্মগেটে রাস্তার জ্যাম কিংবা জলাবদ্ধতা থাকলেও ওভারহেড মেট্রোরেল সম্পূর্ণ নিরবচ্ছিন্ন থাকে।'
        : '🚇 MRT-6 Metro Rail operates between Uttara and Motijheel. It remains unaffected by surface waterlogging or street blockades.';
    } else if (low.includes('rain') || low.includes('brishti') || low.includes('বৃষ্টি') || low.includes('জলাবদ্ধ')) {
      reply = language === 'bn'
        ? '🌧️ বৃষ্টি হলে মালিবাগ ও শান্তিনগর এলাকায় রাস্তায় দ্রুত জলাবদ্ধতা তৈরি হয়। রিকশাচালকরা সাধারণত ৫০% অতিরিক্ত ভাড়া দাবি করে। দ্রুত গন্তব্যে পৌঁছাতে মেট্রোরেল ব্যবহারের পরামর্শ দেওয়া হচ্ছে।'
        : '🌧️ Heavy rain triggers quick waterlogging in Malibagh and Shantinagar. Rickshaws apply a +50% surge. Metro is recommended to avoid ground stalls.';
    } else if (low.includes('shahbagh') || low.includes('শাহবাগ')) {
      reply = language === 'bn'
        ? '⚠️ শাহবাগে কোনো সমাবেশ বা কর্মসূচি থাকলে নিচের রাস্তা আটকে যায়। তখন মিরপুর বা উত্তরা থেকে মতিঝিল যেতে সরাসরি মেট্রোরেল ব্যবহার করুন, কোনো যানজট নেই।'
        : '⚠️ Shahbagh ground intersection is prone to gatherings. Take the overhead MRT-6 from Mirpur 10 or Farmgate directly to Motijheel to bypass it.';
    } else {
      reply = language === 'bn'
        ? `ঢাকা পাথ এআই আপনার সেবায় প্রস্তুত। আপনার যাত্রা শুরু এবং গন্তব্য লিখুন (যেমন: 'মিরপুর থেকে মতিঝিল হাফ পাস')। আমি আপনাকে দ্রুততম ও সাশ্রয়ী রুট জানিয়ে দেব।`
        : `DhakaPath AI is ready to help! Enter your origin and destination (e.g. 'Mirpur 10 to Motijheel student') for live optimal routes, fares, and transit tips.`;
    }

    return NextResponse.json({
      reply,
      provider: 'dhakapath-grounded-engine'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
