'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Compass, Award, ExternalLink, ChevronRight, Info } from 'lucide-react';
import { I18N } from '../utils/localization';

export default function DhakaCommuteHeritageShowcase({ lang = 'bn' }) {
  const [activeTab, setActiveTab] = useState('lifelines'); // 'lifelines' | 'rickshawArt' | 'culturalSpots'

  const lifelines = [
    {
      id: 'rickshaw',
      name: lang === 'bn' ? 'ঢাকার রিকশা (ইউনেস্কো হেরিটেজ)' : 'Dhaka Cycle Rickshaw',
      name_en: 'UNESCO Intangible Cultural Heritage',
      tagline: lang === 'bn' ? 'ঢাকার অলংকার ও গলি-পথের রাজা' : 'The King of Dhaka Golis',
      badge: lang === 'bn' ? 'ইউনেস্কো বিশ্ব ঐতিহ্য' : 'UNESCO Heritage',
      badgeColor: 'bg-[#b83a2e] text-[#f6d16f]',
      image: '/assets/rickshaw_art_birds.png',
      fareInfo: lang === 'bn' ? 'নন-মিটার রেট: ২০-১০০ ৳ (বৃষ্টিতে ৫০% বৃদ্ধি)' : 'Non-metered: 20-100 BDT (Rain surge applies)',
      desc: lang === 'bn' 
        ? 'ঢাকার ঐতিহ্যবাহী রিকশা আর্ট ২০২৩ সালে ইউনেস্কোর বিশ্ব অধরা সাংস্কৃতিক ঐতিহ্য হিসেবে স্বীকৃতি লাভ করেছে। প্রতিটি রিকশার পেছনের টিনের পাতে হাত দিয়ে আঁকা ময়ূর, প্রেমী পাখি, ফুল ও সিনেমার দৃশ্য শহরের জীবন্ত ক্যানভাস।'
        : 'Dhaka Rickshaw Art is recognized by UNESCO as Intangible Cultural Heritage of Humanity. Every back plate is a hand-painted masterpiece of folk art, birds, florals, and vibrant cultural symbolism.'
    },
    {
      id: 'metro',
      name: lang === 'bn' ? 'এমআরটি-৬ মেট্রোরেল' : 'MRT-6 Metro Rail',
      name_en: 'Modern Elevated Transit Spine',
      tagline: lang === 'bn' ? 'উত্তরা থেকে মতিঝিল মাত্র ৩২ মিনিটে' : 'Uttara to Motijheel in 32 mins',
      badge: lang === 'bn' ? '১০০% যানজটমুক্ত' : 'Traffic Immune',
      badgeColor: 'bg-[#15453b] text-[#6ee7b7]',
      image: '/assets/dhaka_commute_fine_line.jpg',
      fareInfo: lang === 'bn' ? 'ডিএমটিসিএল সরকারি ভাড়া: ২০-১০০ ৳ (র‌্যাপিড পাস ১০% ছাড়)' : 'Fixed DMTCL: 20-100 BDT (Rapid Pass 10% off)',
      desc: lang === 'bn' 
        ? 'ঢাকার আধুনিক গণপরিবহনের মেরুদণ্ড। ১৬টি বিশ্বমানের স্টেশন দিয়ে উত্তরা থেকে পুরান ঢাকার সীমানা মতিঝিল পর্যন্ত বিস্তৃত। সাধারণ যাত্রী ও অফিসগামীদের জন্য প্রতিদিন লাখো কর্মঘণ্টা সাশ্রয় করে।'
        : 'The modern elevated lifeline of Dhaka connecting northern Uttara to central Motijheel. Fully air-conditioned, zero-traffic, and integrated with feeder rickshaws.'
    },
    {
      id: 'bus',
      name: lang === 'bn' ? 'মুড়ির টিন ও লোকাল বাস' : 'Local Buses & BRTC Double-Decker',
      name_en: 'Dhaka Bus Transit & Murir Tin',
      tagline: lang === 'bn' ? '৫০% শিক্ষার্থী হাফ-পাস (১০ ৳ ফ্লোর)' : '50% Student Half-Pass Eligible',
      badge: lang === 'bn' ? 'হাফ-পাস প্রযোজ্য' : 'Student Half-Pass',
      badgeColor: 'bg-[#b83a2e] text-[#fbf8f1]',
      image: '/assets/dhaka_city_of_life_collage.jpg',
      fareInfo: lang === 'bn' ? 'বিআরটিএ রেট: সর্বনিম্ন ১০ ৳ ফ্লোর, প্রতি কিমি ২.৫০ ৳' : 'BRTA: Min 10 BDT floor, 2.50 BDT/km',
      desc: lang === 'bn' 
        ? 'ঐতিহাসিক "মুড়ির টিন" থেকে আজকের বিআরটিসি লাল ডাবল-ডেকার এবং বিকল্প-বিহঙ্গ বাস। শিক্ষার্থীদের জন্য পরিচয়পত্র প্রদর্শন সাপেক্ষে সরকারি ৫০% হাফ-পাস প্রযোজ্য (সর্বনিম্ন সরকারি ভাড়া ১০ টাকা)।'
        : 'From vintage wooden Murir Tin to modern red BRTC double-deckers. Statutory 50% half-pass discount for students with valid school/college IDs.'
    },
    {
      id: 'leguna',
      name: lang === 'bn' ? 'লেগুনা / হিউম্যান হলার' : 'Leguna (Human Hauler)',
      name_en: 'High-Speed Goli Arterial Connectors',
      tagline: lang === 'bn' ? 'চকবাজার-গুলিস্তান ও ফার্মগেট কানেক্টর' : 'Chawkbazar & Farmgate Feeder',
      badge: lang === 'bn' ? 'দ্রুততম সংযোগ' : 'Fast Feeder',
      badgeColor: 'bg-[#1c4568] text-[#7dd3fc]',
      image: '/assets/shapla_chattar_motijheel.jpg',
      fareInfo: lang === 'bn' ? 'পয়েন্ট-টু-পয়েন্ট ফিক্সড: ১৫-৩০ ৳' : 'Point-to-Point: 15-30 BDT',
      desc: lang === 'bn' 
        ? 'ঢাকার সংকীর্ণ মোড় ও ফ্লাইওভারের নিচের দ্রুততম ছোট বাহন। ফার্মগেট-মোহাম্মদপুর এবং চকবাজার-গুলিস্তান রুটে প্রতিদিন হাজারো যাত্রী কম খরচে দ্রুত পারাপার হন।'
        : 'Gritty, energetic, and ultra-fast transit haulers connecting narrow alleyways, commercial hubs, and metro stations where large buses cannot enter.'
    },
    {
      id: 'river',
      name: lang === 'bn' ? 'সদরঘাট বুড়িগঙ্গা খেয়া ও লঞ্চ' : 'Sadarghat Buriganga Riverways',
      name_en: '400-Year Historic Waterport',
      tagline: lang === 'bn' ? 'আহসান মঞ্জিল সংলগ্ন ঐতিহ্যবাহী খেয়া ঘাট' : 'Ahsan Manzil River Terminal',
      badge: lang === 'bn' ? 'নদীপথ ট্রানজিট' : 'River Transit',
      badgeColor: 'bg-[#15453b] text-[#f6d16f]',
      image: '/assets/stamp_bangladesh_heritage.jpg',
      fareInfo: lang === 'bn' ? 'খেয়া পারাপার: ৫-১০ ৳' : 'Country Boat Fare: 5-10 BDT',
      desc: lang === 'bn' 
        ? 'মুঘল আমল থেকে ৪ শতক ধরে ঢাকার প্রাণ বুড়িগঙ্গা নদী। ঐতিহ্যবাহী ডিঙ্গি নৌকার খেয়া ও সদরঘাট লঞ্চ টার্মিনাল দক্ষিণ বাংলার সাথে ঢাকাকে যুক্ত করেছে।'
        : 'Since the Mughal era, Buriganga has been the soul of Dhaka. Wooden country boats (Dingi) and launch terminals carry commuters from Ahsan Manzil to southern districts.'
    }
  ];

  const rickshawArtHighlights = [
    {
      title: lang === 'bn' ? 'তোমাকে বুঝিনা প্রিয়' : 'Tomake Bujhina Priyo',
      image: '/assets/rickshaw_art_birds.png',
      badge: lang === 'bn' ? 'প্রেমী জোড়া টিয়া ও গোলাপ' : 'Lovebirds & Roses',
      desc: lang === 'bn' ? 'ঐতিহ্যবাহী রিকশার পেছনের পাতে উজ্জ্বল হলুদ-নীল রঙে আঁকা প্রেমের রূপক ও মনকাড়া ফুলের লতাপাতা।' : 'Vibrant lovebirds perching under a sunset halo with hand-painted roses.'
    },
    {
      title: lang === 'bn' ? 'ফোক ফেস্ট ও রয়্যাল বেঙ্গল টাইগার' : 'Folk Fest & Bengal Tigers',
      image: '/assets/rickshaw_art_folk_fest.png',
      badge: lang === 'bn' ? 'মুঘল মেহরাব ও বাঘ' : 'Mughal Arch & Tigers',
      desc: lang === 'bn' ? 'আহসান মঞ্জিলের লাল ইটের মেহরাব নকশা, বাংলার গর্ব সুন্দরবনের বাঘ এবং লোকজ পাখির যুগলবন্দি।' : 'Ahsan Manzil crimson polylobed arch flanked by twin Royal Bengal Tigers and folk birds.'
    },
    {
      title: lang === 'bn' ? 'মামা চিনি বোস!' : 'Mama Chini Boss!',
      image: '/assets/rickshaw_art_mama_chini.png',
      badge: lang === 'bn' ? 'ঢাকার স্ট্রিট স্লোগান ও টাইপোগ্রাফি' : 'Dhaka Street Lettering',
      desc: lang === 'bn' ? 'ঢাকার চালকদের স্বভাবসুলভ রসিকতা, ত্রিমাত্রিক ড্রপ শ্যাডো ও উজ্জ্বল হলুদ-লাল স্টিকার নকশা।' : 'Iconic Dhaka slang crafted in multi-layered gradient 3D lettering and floral rosettes.'
    },
    {
      title: lang === 'bn' ? 'খাড়াও!!! আইতাছি' : 'Khadao!!! Aaytachi',
      image: '/assets/rickshaw_art_khadao.png',
      badge: lang === 'bn' ? 'সূর্যরশ্মি ও পদ্ম মেডেলিয়ন' : 'Sunbeam Lotus Medallion',
      desc: lang === 'bn' ? 'লাল ও সোনালী রঙে আঁকা ঢাকাই ডায়ালগ, চারপাশের সূর্যরশ্মি ও পদ্মকলির অপূর্ব মিশ্রণ।' : 'Deep crimson oval medallion with blazing sunbeams, lotus petals, and bold vernacular typography.'
    }
  ];

  const heritageSpots = [
    {
      name: lang === 'bn' ? 'আহসান মঞ্জিল (রোজ প্যালেস)' : 'Ahsan Manzil (Pink Palace)',
      nearestHub: lang === 'bn' ? 'সদরঘাট হাব (৭ মিনিট হাঁটা)' : 'Sadarghat Hub (7 min walk)',
      rickshawFare: '২০ ৳',
      metroLink: lang === 'bn' ? 'মতিঝিল মেট্রো থেকে রিকশায় ১৫ মিনিট' : '15 mins by rickshaw from Motijheel Metro',
      delight: lang === 'bn' ? 'কাছের খাবার: বিউটি লাচ্ছি ও বাকরখানি' : 'Near Beauty Lassi & Bakarkhani',
      image: '/assets/stamp_bangladesh_heritage.jpg'
    },
    {
      name: lang === 'bn' ? 'লালবাগ কেল্লা ও পরীবিবির মাজার' : 'Lalbagh Fort & Pari Bibi Tomb',
      nearestHub: lang === 'bn' ? 'লালবাগ কেল্লা হাব (সরাসরি)' : 'Lalbagh Fort Hub (Direct)',
      rickshawFare: '১৫ ৳',
      metroLink: lang === 'bn' ? 'শাহবাগ বা মতিঝিল থেকে লেগুনা/রিকশা' : 'Leguna/Rickshaw from Shahbagh or Motijheel',
      delight: lang === 'bn' ? 'কাছের খাবার: হাজী বিরিয়ানি ও কাশ্মীরি চা' : 'Near Haji Biryani & Kashmiri Tea',
      image: '/assets/dhaka_commute_fine_line.jpg'
    },
    {
      name: lang === 'bn' ? 'শাপলা চত্বর ও মতিঝিল কমার্শিয়াল এরিয়া' : 'Shapla Chattar & Motijheel Hub',
      nearestHub: lang === 'bn' ? 'মতিঝিল মেট্রো স্টেশন এক্সিট-বি' : 'Motijheel Metro Station Exit B',
      rickshawFare: '২০ ৳',
      metroLink: lang === 'bn' ? 'মেট্রোরেলের দক্ষিণ প্রান্তিক টার্মিনাস' : 'MRT-6 Southern Terminus Station',
      delight: lang === 'bn' ? 'কাছের খাবার: ঘরোয়া ভুনা খিচুড়ি' : 'Near Ghorowa Khichuri & Cha',
      image: '/assets/shapla_chattar_motijheel.jpg'
    },
    {
      name: lang === 'bn' ? 'শাঁখারীবাজার ও তারা মসজিদ' : 'Shakhari Bazar & Tara Masjid',
      nearestHub: lang === 'bn' ? 'সদরঘাট / ভিক্টোরিয়া পার্ক' : 'Sadarghat / Victoria Park',
      rickshawFare: '২৫ ৳',
      metroLink: lang === 'bn' ? 'মতিঝিল থেকে রিকশা ১০ মিনিট' : '10 min rickshaw from Motijheel',
      delight: lang === 'bn' ? 'কাছের খাবার: মরণচাঁদ গ্র্যান্ড সুইটস' : 'Moron Chand Sweets & Jhalmuri',
      image: '/assets/dhaka_city_of_life_collage.jpg'
    }
  ];

  return (
    <section className="my-10 space-y-6">
      {/* Grand Section Header with Postage & Rickshaw Art Framing */}
      <div className="heritage-card p-6 border-2 border-[#c69429]/60 bg-gradient-to-br from-[#1b1511] via-[#241a14] to-[#17120e] relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c69429]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#b83a2e] text-[#f6d16f] font-anek font-bold border border-[#f6d16f] shadow-sm">
                ★ {lang === 'bn' ? 'পুরান ঢাকা হেরিটেজ শো-কেস' : 'Old Dhaka Cultural Heritage'} ★
              </span>
              <span className="text-xs font-mono text-[#c69429]">DHAKA 1610 — 2026</span>
            </div>
            <h2 className="font-rickshaw text-3xl sm:text-4xl text-[#f6d16f] rickshaw-text-pop tracking-wide">
              {lang === 'bn' ? 'ঢাকার ঐতিহ্যবাহী পঞ্চ-বাহন ও সংস্কৃতি' : 'The Living Commute Heritage of Dhaka'}
            </h2>
            <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] mt-1 max-w-2xl">
              {lang === 'bn' 
                ? 'ইউনেস্কো স্বীকৃত রিকশা আর্ট, চারশত বছরের বুড়িগঙ্গা খেয়া ঘাট, লোকাল বাসের হাফ-পাস ও আধুনিক মেট্রোরেল—এক নজরে ঢাকার প্রাণ।' 
                : 'UNESCO Rickshaw Art, 400-year-old Buriganga waterways, student half-pass buses, and modern MRT-6 Metro Rail.'}
            </p>
          </div>

          {/* Navigation Pill Switches */}
          <div className="flex items-center gap-1.5 bg-[#120e0b] p-1.5 rounded-2xl border border-[#c69429]/40 shadow-inner shrink-0">
            <button
              onClick={() => setActiveTab('lifelines')}
              className={`px-3.5 py-2 rounded-xl text-xs font-anek font-bold transition-all ${
                activeTab === 'lifelines'
                  ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] border border-[#f6d16f] shadow-md'
                  : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
              }`}
            >
              {lang === 'bn' ? '🛺 ঢাকার পঞ্চ-বাহন' : 'Transit Lifelines'}
            </button>

            <button
              onClick={() => setActiveTab('rickshawArt')}
              className={`px-3.5 py-2 rounded-xl text-xs font-anek font-bold transition-all ${
                activeTab === 'rickshawArt'
                  ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] border border-[#f6d16f] shadow-md'
                  : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
              }`}
            >
              {lang === 'bn' ? '🎨 রিকশা আর্ট গ্যালারি' : 'Rickshaw Art'}
            </button>

            <button
              onClick={() => setActiveTab('culturalSpots')}
              className={`px-3.5 py-2 rounded-xl text-xs font-anek font-bold transition-all ${
                activeTab === 'culturalSpots'
                  ? 'bg-gradient-to-r from-[#b83a2e] to-[#891e17] text-[#fbf8f1] border border-[#f6d16f] shadow-md'
                  : 'text-[#dfcfb2] hover:text-[#fbf8f1]'
              }`}
            >
              {lang === 'bn' ? '🏛️ হেরিটেজ ও খাবার' : 'Heritage & Spots'}
            </button>
          </div>
        </div>

        {/* TAB 1: THE 5 COMMUTE LIFELINES */}
        {activeTab === 'lifelines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
            {lifelines.map((item) => (
              <div 
                key={item.id}
                className="rounded-2xl border border-[#c69429]/40 bg-[#16110d]/95 hover:border-[#f6d16f] p-4 flex flex-col justify-between transition-all interactive-card shadow-lg relative overflow-hidden group"
              >
                <div>
                  {/* Image Preview with Rickshaw Art Frame */}
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#c69429]/30 mb-3 relative bg-black/60">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-anek font-bold shadow-md border border-white/20" style={{ background: 'rgba(18, 14, 11, 0.85)', color: '#f6d16f' }}>
                      {item.badge}
                    </div>
                  </div>

                  <h3 className="font-rickshaw text-xl text-[#f6d16f] mb-0.5">
                    {item.name}
                  </h3>
                  <div className="font-anek text-[11px] font-bold text-[#d6645a] mb-2">
                    {item.tagline}
                  </div>

                  <p className="font-anek text-xs text-[#dfcfb2] leading-relaxed mb-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#c69429]/25 flex items-center justify-between font-mono text-[11px] text-[#fbf8f1]">
                  <span className="font-anek text-[10px] text-[#c69429] font-bold">ভাড়া চার্ট:</span>
                  <span className="font-semibold text-right">{item.fareInfo}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: RICKSHAW ART GALLERY (User's Exact Uploaded Pictures) */}
        {activeTab === 'rickshawArt' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
            {rickshawArtHighlights.map((art, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border-2 border-[#c69429]/50 bg-[#17120e] hover:border-[#f6d16f] p-3 flex flex-col justify-between transition-all interactive-card shadow-xl group"
              >
                <div>
                  <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-[#c69429]/40 mb-3 bg-black relative">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#b83a2e] text-[#f6d16f] text-[9px] font-anek font-bold border border-[#f6d16f]">
                      {art.badge}
                    </div>
                  </div>

                  <h4 className="font-rickshaw text-lg text-[#f6d16f] mb-1">
                    {art.title}
                  </h4>
                  <p className="font-anek text-xs text-[#dfcfb2] leading-relaxed">
                    {art.desc}
                  </p>
                </div>

                <div className="pt-2 mt-3 border-t border-[#c69429]/25 flex items-center justify-between text-[10px] text-[#f6d16f] font-anek">
                  <span>ইউনেস্কো ঐতিহ্যবাহী শিল্প</span>
                  <span>✓ পুরান ঢাকা</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PURAN DHAKA CULTURAL SPOTS & FOOD TRAILS */}
        {activeTab === 'culturalSpots' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
            {heritageSpots.map((spot, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-[#c69429]/40 bg-[#16110d] hover:border-[#f6d16f] p-3.5 flex flex-col justify-between transition-all interactive-card shadow-lg"
              >
                <div>
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-[#c69429]/30 mb-3 bg-black/50">
                    <img 
                      src={spot.image} 
                      alt={spot.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h4 className="font-rickshaw text-lg text-[#f6d16f] mb-1">
                    {spot.name}
                  </h4>
                  
                  <div className="space-y-1.5 font-anek text-xs text-[#dfcfb2] mt-2">
                    <div className="flex items-center gap-1.5 text-[#fbf8f1]">
                      <MapPin className="w-3.5 h-3.5 text-[#b83a2e] shrink-0" />
                      <span>{spot.nearestHub}</span>
                    </div>
                    <div className="text-[11px] text-[#6ee7b7]">
                      <span>🛺 রিকশা ভাড়া: {spot.rickshawFare}</span>
                    </div>
                    <div className="text-[11px] text-[#dfcfb2]">
                      <span>🚇 {spot.metroLink}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-3 border-t border-[#c69429]/25 text-[11px] font-anek font-semibold text-[#f6d16f] bg-[#120e0b] p-2 rounded-lg">
                  {spot.delight}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
