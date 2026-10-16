import { NextResponse } from 'next/server';

const HUB_KEYWORDS = [
  { standard: "Uttara", triggers: ["uttara north", "uttara center", "uttara south", "uttara", "utora", "উত্তরা", "দিয়াবাড়ী"] },
  { standard: "Mirpur 10", triggers: ["mirpur 10", "mirpur-10", "mirpur10", "mirpur", "মিরপুর ১০", "মিরপুর"] },
  { standard: "Mirpur 1", triggers: ["mirpur 1", "mirpur-1", "মিরপুর ১"] },
  { standard: "Mirpur 12", triggers: ["mirpur 12", "mirpur-12", "মিরপুর ১২"] },
  { standard: "Mirpur 11", triggers: ["mirpur 11", "mirpur-11", "মিরপুর ১১"] },
  { standard: "Pallabi", triggers: ["pallabi", "পল্লবী"] },
  { standard: "Kazipara", triggers: ["kazipara", "কাজীপাড়া"] },
  { standard: "Shewrapara", triggers: ["shewrapara", "শেওড়াপাড়া"] },
  { standard: "Agargaon", triggers: ["agargaon", "agargaun", "আগারগাঁও"] },
  { standard: "Bijoy Sarani", triggers: ["bijoy sarani", "bijoy sharoni", "বিজয় সরণি"] },
  { standard: "Farmgate", triggers: ["farmgate", "farmget", "farm gate", "ফার্মগেট"] },
  { standard: "Karwan Bazar", triggers: ["karwan bazar", "kawran bazar", "karwanbazar", "কারওয়ান বাজার"] },
  { standard: "Shahbagh", triggers: ["shahbagh", "shahbag", "শাহবাগ"] },
  { standard: "Dhaka University", triggers: ["dhaka university", "du", "tsc", "ঢাকা বিশ্ববিদ্যালয়", "টিএসসি"] },
  { standard: "Bangladesh Secretariat", triggers: ["secretariat", "press club", "সচিবালয়", "প্রেস ক্লাব"] },
  { standard: "Science Lab", triggers: ["science lab", "sciencelab", "science laboratory", "সায়েন্স ল্যাব", "নিউ মার্কেট", "new market"] },
  { standard: "Dhanmondi", triggers: ["dhanmondi", "dhanmandi", "ধানমন্ডি"] },
  { standard: "Mohammadpur", triggers: ["mohammadpur", "mohammodpur", "mdpur", "মোহাম্মদপুর"] },
  { standard: "Motijheel", triggers: ["motijheel", "motijhil", "matijheel", "মতিঝিল", "শাপলা চত্বর"] },
  { standard: "Kamalapur", triggers: ["kamalapur", "komlapur", "কমলাপুর"] },
  { standard: "Malibagh", triggers: ["malibagh", "malibag", "মৌচাক", "মালিবাগ"] },
  { standard: "Banasree", triggers: ["banasree", "bonosree", "bonosri", "রামপুরা", "বনশ্রী"] },
  { standard: "Badda", triggers: ["badda", "বাড্ডা"] },
  { standard: "Mohakhali", triggers: ["mohakhali", "moakhali", "মহাখালী"] },
  { standard: "Jatrabari", triggers: ["jatrabari", "যাত্রাবাড়ী", "যাত্রাবাড়ি"] },
  { standard: "Sadarghat", triggers: ["sadarghat", "shadarghat", "সদরঘাট", "পুরান ঢাকা", "নদী বন্দর"] },
  { standard: "Lalbagh", triggers: ["lalbagh", "lalbag", "চকবাজার", "লালবাগ"] },
  { standard: "Kalyanpur", triggers: ["kalyanpur", "কল্যাণপুর"] },
  { standard: "Shyamoli", triggers: ["shyamoli", "শ্যামলী"] },
  { standard: "Banani", triggers: ["banani", "বনানী"] },
  { standard: "Kuril", triggers: ["kuril", "কুড়িল"] },
  { standard: "Khilkhet", triggers: ["khilkhet", "খিলক্ষেত"] },
  { standard: "Gulisthan", triggers: ["gulisthan", "gulistan", "গুলিস্তান"] }
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
