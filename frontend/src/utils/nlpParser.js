// DhakaPath Smart Banglish & Bengali NLP Commute Query Parser
// Accurately extracts origin, destination, passenger type, and conditions based on natural phrasing.

export const HUB_KEYWORDS = [
  // MRT-6 Stations & North Sector
  { standard: "Uttara North", triggers: ["uttara north", "uttara uttor", "diabari", "দিয়াবাড়ী", "উত্তরা উত্তর"] },
  { standard: "Uttara Center", triggers: ["uttara center", "uttara centre", "উত্তরা সেন্টার"] },
  { standard: "Uttara South", triggers: ["uttara south", "uttara dokkhin", "উত্তরা দক্ষিণ"] },
  { standard: "Uttara", triggers: ["uttara", "utara", "utora", "উত্তরা", "airport", "বিমানবন্দর", "tongi", "টঙ্গী", "gazipur", "গাজীপুর", "আব্দুল্লাহপুর", "abdullahpur"] },
  { standard: "Pallabi", triggers: ["pallabi", "polbi", "পল্লবী"] },
  { standard: "Mirpur 12", triggers: ["mirpur 12", "mirpur-12", "mirpur12", "m12", "মিরপুর ১২"] },
  { standard: "Mirpur 11", triggers: ["mirpur 11", "mirpur-11", "mirpur11", "m11", "মিরপুর ১১"] },
  { standard: "Mirpur 10", triggers: ["mirpur 10", "mirpur-10", "mirpur10", "m10", "mirpur", "মিরপুর ১০", "মিরপুর গোলচত্বর", "মিরপুর"] },
  { standard: "Mirpur 1", triggers: ["mirpur 1", "mirpur-1", "mirpur1", "মিরপুর ১", "মাজার রোড"] },
  { standard: "Kazipara", triggers: ["kazipara", "kajipara", "কাজীপাড়া", "কাজিপাড়া"] },
  { standard: "Shewrapara", triggers: ["shewrapara", "sewrapara", "শেওড়াপাড়া", "শেওড়াপাড়া"] },
  { standard: "Agargaon", triggers: ["agargaon", "agargaun", "agargon", "আগারগাঁও"] },
  { standard: "Bijoy Sarani", triggers: ["bijoy sarani", "bijoy sharoni", "বিজয় সরণি", "চন্দ্রিমা উদ্যান", "aeroplane mor"] },
  { standard: "Farmgate", triggers: ["farmgate", "farmget", "farm gate", "ফার্মগেট", "framgate", "খামারবাড়ি", "khamarbari"] },
  { standard: "Karwan Bazar", triggers: ["karwan bazar", "kawran bazar", "karwanbazar", "kawranbazar", "কারওয়an বাজার", "কারওয়ান বাজার", "সোনারগাঁও", "pan pacific"] },
  { standard: "Shahbagh", triggers: ["shahbagh", "shahbag", "শাহবাগ", "pg hospital", "বিএসএমএমইউ"] },
  { standard: "Dhaka University", triggers: ["dhaka university", "du", "tsc", "ঢাকা বিশ্ববিদ্যালয়", "টিএসসি", "কার্জন হল", "curzon hall"] },
  { standard: "Bangladesh Secretariat", triggers: ["secretariat", "press club", "সচিবালয়", "বাংলাদেশ সচিবালয়", "প্রেস ক্লাব"] },
  { standard: "Motijheel", triggers: ["motijheel", "motijhil", "matijheel", "matijhil", "মতিঝিল", "শাপলা চত্বর", "shapla chattar"] },
  { standard: "Kamalapur", triggers: ["kamalapur", "komlapur", "কমলাপুর", "kamalapur railway", "কমলাপুর রেলওয়ে"] },

  // South & Central Hubs
  { standard: "Science Lab", triggers: ["science lab", "sciencelab", "science laboratory", "সায়েন্স ল্যাব", "সাইন্সল্যাব", "new market", "নিউ মার্কেট", "নিউমার্কেট", "elephant road", "এলিফ্যান্ট রোড", "nilkhet", "নীলক্ষেত"] },
  { standard: "Dhanmondi", triggers: ["dhanmondi", "dhanmandi", "ধানমন্ডি", "dhanmondi 27", "dhanmondi 32", "jigatola", "জিগাতলা", "shongkor", "শংকর"] },
  { standard: "Mohammadpur", triggers: ["mohammadpur", "mohammodpur", "mdpur", "মোহাম্মদপুর", "শিয়া মসজিদ", "টাউন হল", "town hall"] },
  { standard: "Malibagh", triggers: ["malibagh", "malibag", "মৌচাক", "mouchak", "মালিবাগ", "শান্তিনগর", "shantinagar"] },
  { standard: "Banasree", triggers: ["banasree", "bonosree", "bonosri", "বনশ্রী", "রামপুরা", "rampura", "হাতিরঝিল", "hatirjheel"] },
  { standard: "Badda", triggers: ["badda", "বাড্ডা", "মধ্য বাড্ডা", "উত্তর বাড্ডা", "নদ্দা", "nadda"] },
  { standard: "Mohakhali", triggers: ["mohakhali", "moakhali", "মহাখালী", "মহাখালি", "টিবি গেট", "tb gate"] },
  { standard: "Jatrabari", triggers: ["jatrabari", "যাত্রাবাড়ী", "যাত্রাবাড়ি", "ধোলাইপাড়", "dhalaiper", "sayedabad", "সায়েদাবাদ"] },
  { standard: "Sadarghat", triggers: ["sadarghat", "shadarghat", "সদরঘাট", "পুরান ঢাকা", "old dhaka", "নদী বন্দর", "জগন্নাথ বিশ্ববিদ্যালয়", "jnu", "বাহাদুর শাহ পার্ক"] },
  { standard: "Lalbagh", triggers: ["lalbagh", "lalbag", "চকবাজার", "chawkbazar", "লালবাগ", "লালবাগ কেল্লা"] },
  { standard: "Kalyanpur", triggers: ["kalyanpur", "কল্যানপুর", "কল্যাণপুর", "গাবতলী", "gabtoli", "gabtali", "savar", "সাভার"] },
  { standard: "Shyamoli", triggers: ["shyamoli", "শ্যামলী", "শিশু মেলা", "shishu mela"] },
  { standard: "Banani", triggers: ["banani", "বনানী", "gulshan", "গুলশান", "কাকলী", "kakoli"] },
  { standard: "Kuril", triggers: ["kuril", "কুড়িল", "kuril flyover", "কুড়িল বিশ্বরোড", "bishwa road", "যমুনা ফিউচার পার্ক"] },
  { standard: "Khilkhet", triggers: ["khilkhet", "খিলক্ষেত"] },
  { standard: "Gulisthan", triggers: ["gulisthan", "gulistan", "গুলিস্তান", "ফুটপাত", "গোলাপ শাহ মাজার", "victoria park"] }
];

// Helper to extract non-overlapping matches with their character indices
export function extractHubMatches(text) {
  if (!text || typeof text !== 'string') return [];
  const low = text.toLowerCase();
  const matches = [];

  for (const item of HUB_KEYWORDS) {
    for (const trigger of item.triggers) {
      let idx = low.indexOf(trigger);
      while (idx !== -1) {
        // Boundary check: ensure word boundaries or spaces around match if short ASCII
        const before = idx > 0 ? low[idx - 1] : ' ';
        const after = idx + trigger.length < low.length ? low[idx + trigger.length] : ' ';
        const isLetterBefore = /[a-z0-9]/i.test(before);
        const isLetterAfter = /[a-z0-9]/i.test(after);

        // For ASCII words shorter than 4 chars (e.g. "du", "m10"), require boundaries
        const requireBoundary = trigger.length <= 3 && /^[a-z0-9]+$/i.test(trigger);
        if (!requireBoundary || (!isLetterBefore && !isLetterAfter)) {
          matches.push({
            hub: item.standard,
            trigger,
            startIndex: idx,
            endIndex: idx + trigger.length
          });
        }
        idx = low.indexOf(trigger, idx + 1);
      }
    }
  }

  // Sort matches so longer triggers win in overlapping regions (e.g. "mirpur 10" > "mirpur")
  matches.sort((a, b) => {
    const aLen = a.endIndex - a.startIndex;
    const bLen = b.endIndex - b.startIndex;
    if (a.startIndex < b.endIndex && b.startIndex < a.endIndex) {
      return bLen - aLen;
    }
    return a.startIndex - b.startIndex;
  });

  const nonOverlapping = [];
  for (const m of matches) {
    const overlaps = nonOverlapping.some(
      existing => m.startIndex < existing.endIndex && existing.startIndex < m.endIndex
    );
    if (!overlaps) {
      nonOverlapping.push(m);
    }
  }

  // Sort final matched hubs in reading order (left to right)
  nonOverlapping.sort((a, b) => a.startIndex - b.startIndex);
  return nonOverlapping;
}

/**
 * Intelligent Commute Parser
 * Resolves origin & destination with natural Bengali & Banglish semantics.
 */
export function parseCommuteQuery(query, fallbackOrigin = 'Mirpur 10', fallbackDest = 'Motijheel') {
  if (!query || typeof query !== 'string') {
    return {
      origin: fallbackOrigin,
      destination: fallbackDest,
      passenger_type: 'general',
      weather_condition: 'normal',
      is_rush_hour: false,
      confidence: 0
    };
  }

  const low = query.toLowerCase().trim();
  const matchedHubs = extractHubMatches(low);

  let origin = null;
  let destination = null;

  if (matchedHubs.length >= 2) {
    const first = matchedHubs[0];
    const second = matchedHubs[1];

    // Check for reverse semantic pattern: "X jabo Y theke" or "to X from Y"
    const between = low.slice(first.endIndex, second.startIndex);
    const beforeFirst = low.slice(0, first.startIndex);
    const afterSecond = low.slice(second.endIndex);

    const hasFromNearSecond = 
      between.includes('from') || 
      between.includes('theke') || 
      between.includes('থেকে') || 
      between.includes('হতে');

    const hasDestNearFirst = 
      beforeFirst.includes('to') || 
      between.includes('jabo') || 
      between.includes('যাব') || 
      between.includes('পৌঁছাব');

    if (hasFromNearSecond && hasDestNearFirst) {
      // Reverse: first is destination, second is origin
      origin = second.hub;
      destination = first.hub;
    } else {
      // Normal direct order: "motijheel to uttara", "motijheel theke uttara", "motijheel -> uttara"
      origin = first.hub;
      destination = second.hub;
    }
  } else if (matchedHubs.length === 1) {
    const single = matchedHubs[0];
    const before = low.slice(0, single.startIndex);
    const after = low.slice(single.endIndex);

    const isOriginContext = 
      before.includes('from') || 
      after.includes('theke') || 
      after.includes('থেকে') || 
      after.includes('হতে');

    const isDestContext = 
      before.includes('to') || 
      after.includes('jabo') || 
      after.includes('যাব') || 
      after.includes('পৌঁছাব');

    if (isOriginContext) {
      origin = single.hub;
      destination = fallbackDest === single.hub ? (single.hub === 'Motijheel' ? 'Mirpur 10' : 'Motijheel') : fallbackDest;
    } else if (isDestContext) {
      destination = single.hub;
      origin = fallbackOrigin === single.hub ? (single.hub === 'Motijheel' ? 'Mirpur 10' : 'Motijheel') : fallbackOrigin;
    } else {
      // Default: assume the single place is destination unless already there
      if (fallbackOrigin === single.hub) {
        destination = single.hub === 'Motijheel' ? 'Mirpur 10' : 'Motijheel';
        origin = single.hub;
      } else {
        destination = single.hub;
        origin = fallbackOrigin;
      }
    }
  }

  // Fallbacks if not detected
  if (!origin) origin = fallbackOrigin || 'Mirpur 10';
  if (!destination) destination = fallbackDest || 'Motijheel';

  // Prevent same origin and destination
  if (origin === destination) {
    destination = origin === 'Motijheel' ? 'Uttara' : 'Motijheel';
  }

  // Detect Passenger Type
  let passenger_type = 'general';
  if (
    low.includes('student') ||
    low.includes('half') ||
    low.includes('chhatro') ||
    low.includes('chatro') ||
    low.includes('ছাত্র') ||
    low.includes('হাফ') ||
    low.includes('পাস') ||
    low.includes('শিক্ষার্থী') ||
    low.includes('varsity') ||
    low.includes('college')
  ) {
    passenger_type = 'student';
  }

  // Detect Weather Condition
  let weather_condition = 'normal';
  if (
    low.includes('rain') ||
    low.includes('brishti') ||
    low.includes('bristy') ||
    low.includes('বৃষ্টি') ||
    low.includes('বর্ষা') ||
    low.includes('পানি') ||
    low.includes('জলজট') ||
    low.includes('flood')
  ) {
    weather_condition = 'rain';
  }

  // Detect Rush Hour
  let is_rush_hour = false;
  if (
    low.includes('rush') ||
    low.includes('peak') ||
    low.includes('jam') ||
    low.includes('traffic') ||
    low.includes('জ্যাম') ||
    low.includes('ভিড়') ||
    low.includes('ব্যস্ত') ||
    low.includes('ছুটি')
  ) {
    is_rush_hour = true;
  }

  return {
    original_query: query,
    origin,
    destination,
    passenger_type,
    weather_condition,
    is_rush_hour,
    confidence: matchedHubs.length >= 2 ? 0.98 : (matchedHubs.length === 1 ? 0.8 : 0.4)
  };
}
