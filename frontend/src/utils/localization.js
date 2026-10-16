export const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnDigits(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

export function roundToNearest5(value, minimum = 0) {
  const num = Number(value) || 0;
  const rounded5 = Math.round(num / 5) * 5;
  return Math.max(minimum, rounded5);
}

export function formatFare(amount, lang = 'bn') {
  const rounded = roundToNearest5(amount, 0);
  if (lang === 'bn') {
    return `${toBnDigits(rounded)} ৳`;
  }
  return `${rounded} BDT`;
}

export function formatDuration(mins, lang = 'bn') {
  if (lang === 'bn') {
    return `${toBnDigits(mins)} মিনিট`;
  }
  return `${mins} mins`;
}

export const I18N = {
  en: {
    brandName: "DhakaPath",
    tagline: "Live Urban Transit & Route Intelligence",
    cityStatus: "14 Hubs Monitored",
    liveCityStatus: "Dhaka Live Grid: Normal Flow",
    statHubs: "14 Hubs",
    statHubsSub: "Major Node Coverage",
    statFaster: "40%+ Faster",
    statFasterSub: "Intelligent Detours",
    statPassengers: "1.2 Lakh+",
    statPassengersSub: "Daily Commuters Served",
    statAlerts: "Real-Time",
    statAlertsSub: "Crowdsourced Reports",

    // Tabs
    tabHome: "Live Map & Routes",
    tabAlerts: "Street Disruptions",
    tabCMS: "Transit Directory",
    tabSimulator: "Scenario Simulator",
    tabRideShare: "Commuter Ride-Share",

    // Search
    searchTitle: "Plan Multi-Modal Journey",
    originLabel: "From",
    destLabel: "To",
    passengerType: "Passenger Category",
    generalCommuter: "General Commuter",
    studentPass: "Student (50% Half-Pass)",
    searchPlaceholder: "Type journey details (e.g., 'Farmgate to Motijheel avoiding Shahbagh')",
    searchBtn: "Find Smart Routes",
    micListening: "Listening... speak now",
    micTooltip: "Search with Voice",

    // Route Cards
    recommended: "Fastest Recommendation",
    studentPick: "Student Half-Pass Optimal",
    detourBadge: "Disruption Detour",
    transfersLabel: "Transfers",
    durationLabel: "Duration",
    regularFare: "Regular Fare",
    studentFare: "Student Fare",
    savings: "Half-Pass Saves",
    listenBriefing: "Listen Audio",
    offlineCardBtn: "Save Offline Card",
    viewFareBreakdown: "Fare Breakdown",
    landmarkInstruction: "Boarding Landmark",

    // Alerts
    alertsTitle: "Active Street Incidents & Waterlogging",
    submitAlertBtn: "Report New Incident",
    confirmBtn: "Confirm",
    resolveBtn: "Mark Resolved",
    trustScoreLabel: "Trust Score",
    waterlogging: "Waterlogging",
    blockade: "Intersection Blockade",
    gridlock: "Severe Gridlock",
    construction: "Road Construction",

    // Simulation
    simulatorTitle: "Urban Disruption Simulator",
    simRainDesc: "Simulate sudden monsoon rainfall & waterlogged choke-points",
    simRushDesc: "Simulate 5:30 PM office peak hour congestion & rickshaw surge",
    simBlockDesc: "Simulate student movement or strike at key intersections",
    triggerRain: "Toggle Monsoon Rain",
    triggerRush: "Toggle Peak Rush Hour",
    resetSim: "Reset to Normal Grid",

    // Emergency
    emergencyTitle: "Dhaka Emergency & Transit Helplines",
    tapToCall: "Tap to Call Instantly",

    // Assistant
    chatTitle: "DhakaPath Commute Assistant",
    chatPlaceholder: "Type here...",
    chatSend: "Send",
    audioPrompt: "Listen to audio response"
  },
  bn: {
    brandName: "ঢাকার পথ",
    tagline: "লাইভ আরবান ট্রানজিট ও রুট ইন্টেলিজেন্স",
    cityStatus: "১৪টি প্রধান হাব সংযুক্ত",
    liveCityStatus: "ঢাকা লাইভ গ্রিড: স্বাভাবিক চলাচল",
    statHubs: "১৪টি হাব",
    statHubsSub: "প্রধান ট্রানজিট পয়েন্ট",
    statFaster: "৪০%+ দ্রুততম",
    statFasterSub: "বিকল্প রুট সমাধান",
    statPassengers: "১.২ লাখ+",
    statPassengersSub: "দৈনিক সেবাগ্রহীতা",
    statAlerts: "লাইভ অ্যালার্ট",
    statAlertsSub: "যাত্রীভিত্তিক প্রতিবেদন",

    // Tabs
    tabHome: "লাইভ ম্যাপ ও রুট",
    tabAlerts: "রাস্তার বিঘ্ন ও জলজট",
    tabCMS: "ট্রানজিট ডিরেক্টরি",
    tabSimulator: "পরিস্থিতি সিমুলেটর",
    tabRideShare: "রাইড-শেয়ার বোর্ড",

    // Search
    searchTitle: "স্মার্ট মাল্টি-মোডাল ভ্রমণ পরিকল্পনা",
    originLabel: "শুরু",
    destLabel: "শেষ",
    passengerType: "যাত্রীর ধরন",
    generalCommuter: "সাধারণ যাত্রী",
    studentPass: "শিক্ষার্থী (৫০% হাফ-পাস)",
    searchPlaceholder: "যাত্রার বিবরণ লিখুন (যেমন: 'মিরপুর থেকে মতিঝিল হাফ-পাস')",
    searchBtn: "রুট খুঁজুন",
    micListening: "শুনছি... কথা বলুন",
    micTooltip: "ভয়েস দিয়ে খুঁজুন",

    // Route Cards
    recommended: "দ্রুততম রিকমেন্ডেশন",
    studentPick: "শিক্ষার্থী হাফ-পাস সেরা রুট",
    detourBadge: "বিকল্প পথ (ডিট্যুর)",
    transfersLabel: "পরিবহন বদল",
    durationLabel: "সময়",
    regularFare: "সাধারণ ভাড়া",
    studentFare: "শিক্ষার্থী ভাড়া",
    savings: "হাফ-পাসে সাশ্রয়",
    listenBriefing: "সংক্ষেপ শুনুন",
    offlineCardBtn: "অফলাইন কার্ড ডাউনলোড",
    viewFareBreakdown: "ভাড়ার বিস্তারিত",
    landmarkInstruction: "ওঠার স্থান",

    // Alerts
    alertsTitle: "চলতি রাস্তার বিঘ্ন ও জলজট",
    submitAlertBtn: "নতুন সতর্কবার্তা দিন",
    confirmBtn: "নিশ্চিত করুন",
    resolveBtn: "সমাধান হয়েছে",
    trustScoreLabel: "নির্ভরযোগ্যতা স্কোর",
    waterlogging: "জলজট",
    blockade: "রাস্তা অবরোধ ও ব্যারিকেড",
    gridlock: "তীব্র ট্রাফিক জ্যাম",
    construction: "রাস্তা মেরামত কাজ",

    // Simulation
    simulatorTitle: "শহরের ট্রাফিক বিপর্যয় সিমুলেটর",
    simRainDesc: "ভারী বৃষ্টি ও নিচু রাস্তায় জলজট তৈরি করে বিকল্প রুট দেখুন",
    simRushDesc: "বিকেল ৫:৩০ এর অফিস ছুটির ভিড় ও রিকশা ভাড়া বৃদ্ধি পরীক্ষা করুন",
    simBlockDesc: "শাহবাগ বা ফার্মগেটে আকস্মিক সড়ক অবরোধ তৈরি করে মেট্রোরেল রুট দেখুন",
    triggerRain: "ভারী বৃষ্টি ও জলজট চালু",
    triggerRush: "অফিস পিক আওয়ার চালু",
    resetSim: "স্বাভাবিক অবস্থায় ফেরান",

    // Emergency
    emergencyTitle: "জরুরি সেবা ও ট্রানজিট হেল্পলাইন",
    tapToCall: "সরাসরি কল করতে ট্যাপ করুন",

    // Assistant
    chatTitle: "ঢাকা-পাথ এআই সহকারী",
    chatPlaceholder: "লিখুন...",
    chatSend: "পাঠান",
    audioPrompt: "অডিও ব্রিফিং শুনুন"
  }
};
