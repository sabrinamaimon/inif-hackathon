import { NextResponse } from 'next/server';

const HUB_KEYWORDS = [
  { standard: "Uttara", triggers: ["uttara", "utora", "উত্তরা"] },
  { standard: "Mirpur 10", triggers: ["mirpur 10", "mirpur-10", "mirpur", "মিরপুর ১০", "মিরপুর"] },
  { standard: "Agargaon", triggers: ["agargaon", "agargaun", "আগারগাঁও"] },
  { standard: "Farmgate", triggers: ["farmgate", "farmget", "ফার্মগেট"] },
  { standard: "Shahbagh", triggers: ["shahbagh", "shahbag", "শাহবাগ"] },
  { standard: "Science Lab", triggers: ["science lab", "sciencelab", "সায়েন্স ল্যাব"] },
  { standard: "Dhanmondi", triggers: ["dhanmondi", "ধানমন্ডি"] },
  { standard: "Mohammadpur", triggers: ["mohammadpur", "mohammodpur", "মোহাম্মদপুর"] },
  { standard: "Motijheel", triggers: ["motijheel", "motijhil", "মতিঝিল"] },
  { standard: "Malibagh", triggers: ["malibagh", "malibag", "মালিবাগ"] },
  { standard: "Banasree", triggers: ["banasree", "bonosree", "বনশ্রী"] },
  { standard: "Badda", triggers: ["badda", "বাড্ডা"] },
  { standard: "Mohakhali", triggers: ["mohakhali", "moakhali", "মহাখালী"] },
  { standard: "Jatrabari", triggers: ["jatrabari", "যাত্রাবাড়ী", "যাত্রাবাড়ি"] }
];

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Missing query string' }, { status: 400 });
    }

    const low = query.toLowerCase();

    // Detect hubs mentioned in query
    const detected = [];
    HUB_KEYWORDS.forEach(item => {
      for (const t of item.triggers) {
        if (low.includes(t)) {
          detected.push(item.standard);
          break;
        }
      }
    });

    let origin = null;
    let destination = null;

    if (detected.length >= 2) {
      origin = detected[0];
      destination = detected[1];
    } else if (detected.length === 1) {
      origin = detected[0];
      destination = detected[0] === 'Motijheel' ? 'Mirpur 10' : 'Motijheel';
    }

    // Detect passenger type
    let passenger_type = 'general';
    if (
      low.includes('student') ||
      low.includes('half') ||
      low.includes('chhatro') ||
      low.includes('ছাত্র') ||
      low.includes('হাফ') ||
      low.includes('পাস')
    ) {
      passenger_type = 'student';
    }

    // Detect weather
    let weather_condition = 'normal';
    if (
      low.includes('rain') ||
      low.includes('brishti') ||
      low.includes('bristy') ||
      low.includes('বৃষ্টি') ||
      low.includes('বর্ষা')
    ) {
      weather_condition = 'rain';
    }

    // Detect rush hour
    let is_rush_hour = false;
    if (
      low.includes('rush') ||
      low.includes('peak') ||
      low.includes('jam') ||
      low.includes('traffic') ||
      low.includes('জ্যাম') ||
      low.includes('ব্যস্ত')
    ) {
      is_rush_hour = true;
    }

    return NextResponse.json({
      original_query: query,
      origin: origin || 'Mirpur 10',
      destination: destination || 'Motijheel',
      passenger_type,
      weather_condition,
      is_rush_hour,
      confidence: detected.length >= 2 ? 0.95 : 0.75
    });
  } catch (error) {
    return NextResponse.json({ error: 'NLP parsing error' }, { status: 500 });
  }
}
