'use client';

import React from 'react';
import { I18N } from '../utils/localization';

export default function DhakaCommuteHeritageShowcase({ lang = 'bn' }) {
  const lifelines = [
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
      id: 'rickshaw',
      name: lang === 'bn' ? 'ঢাকার রিকশা' : 'Dhaka Cycle Rickshaw',
      name_en: 'Feeder Transit & Goli Commute',
      tagline: lang === 'bn' ? 'গলি-পথের প্রধান ফিডার বাহন' : 'The Primary Feeder Transit',
      badge: lang === 'bn' ? 'ফিডার বাহন' : 'Feeder Transit',
      badgeColor: 'bg-[#b83a2e] text-[#f6d16f]',
      image: '/assets/rickshaw_art_birds.png',
      fareInfo: lang === 'bn' ? 'নন-মিটার রেট: ২০-১০০ ৳ (বৃষ্টিতে ৫০% বৃদ্ধি)' : 'Non-metered: 20-100 BDT (Rain surge applies)',
      desc: lang === 'bn' 
        ? 'ঢাকার প্রতিটি অলিগলির প্রধান নির্ভরযোগ্য বাহন। মেট্রো স্টেশন ও বাস স্টপ থেকে বাড়ি বা অফিসে শেষ দূরত্বের সংযোগ (লাস্ট-মাইল কানেক্টিভিটি) হিসেবে অপরিহার্য।'
        : 'The indispensable last-mile feeder transit connecting residential alleys to metro stations and bus hubs.'
    },
    {
      id: 'river',
      name: lang === 'bn' ? 'সদরঘাট বুড়িগঙ্গা খেয়া ও লঞ্চ' : 'Sadarghat Buriganga Riverways',
      name_en: 'Historic Waterways Transit',
      tagline: lang === 'bn' ? 'আহসান মঞ্জিল সংলগ্ন ঐতিহ্যবাহী খেয়া ঘাট' : 'Ahsan Manzil River Terminal',
      badge: lang === 'bn' ? 'নদীপথ ট্রানজিট' : 'River Transit',
      badgeColor: 'bg-[#15453b] text-[#f6d16f]',
      image: '/assets/stamp_bangladesh_heritage.jpg',
      fareInfo: lang === 'bn' ? 'খেয়া পারাপার: ৫-১০ ৳' : 'Country Boat Fare: 5-10 BDT',
      desc: lang === 'bn' 
        ? 'ঢাকার ঐতিহ্যবাহী নদীপথ যোগাযোগ। সদরঘাট ও বুড়িগঙ্গা নদীর খেয়া নৌকা এবং লঞ্চ প্রতিদিন কেরানীগঞ্জ ও দক্ষিণাঞ্চলের হাজারো যাত্রীকে নির্বিঘ্নে পারাপার করায়।'
        : 'Dhaka historic riverway transit connecting Sadarghat and Buriganga to Keraniganj and southern regions.'
    }
  ];

  return (
    <section className="my-10 space-y-6">
      {/* Grand Section Header */}
      <div className="heritage-card p-6 border-2 border-[#c69429]/60 bg-gradient-to-br from-[#1b1511] via-[#241a14] to-[#17120e] relative overflow-hidden shadow-2xl">
        <div className="pb-4 border-b border-[#c69429]/30">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-3 py-1 rounded-full bg-[#b83a2e] text-[#f6d16f] font-anek font-bold border border-[#f6d16f] shadow-sm">
              ★ {lang === 'bn' ? 'ঢাকার গণপরিবহন ও ট্রানজিট বাহন' : 'Dhaka Transit Vehicles & Commute Lifelines'} ★
            </span>
            <span className="text-xs font-mono text-[#c69429]">DHAKA TRANSIT DIRECTORY</span>
          </div>
          <h2 className="font-rickshaw text-3xl sm:text-4xl text-[#f6d16f] rickshaw-text-pop tracking-wide">
            {lang === 'bn' ? 'ঢাকার প্রধান গণপরিবহন ও ট্রানজিট বাহনসমূহ' : 'Dhaka Transit Vehicles & Commute Lifelines'}
          </h2>
          <p className="font-anek text-sm sm:text-base text-[#dfcfb2] mt-1.5 max-w-3xl">
            {lang === 'bn' 
              ? 'মেট্রোরেল, মুড়ির টিন ও লোকাল বাস, লেগুনা, রিকশা এবং নদীপথ—ঢাকার প্রতিটি ট্রানজিট বাহনের বিবরণ, সরকারি নিয়মাবলী ও ভাড়া চার্ট।' 
              : 'Metro Rail, Local Buses, Leguna, Rickshaw, and Riverways—official fare charts, routes, and transit regulations.'}
          </p>
        </div>

        {/* JANBAHON TRANSIT VEHICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
          {lifelines.map((item) => (
            <div 
              key={item.id}
              className="rounded-2xl border-2 border-[#c69429]/40 bg-[#16110d]/95 hover:border-[#f6d16f] p-4 sm:p-5 flex flex-col justify-between transition-all interactive-card shadow-lg relative overflow-hidden group"
            >
              <div>
                {/* Image Preview */}
                <div className="w-full h-40 rounded-xl overflow-hidden border border-[#c69429]/30 mb-3 relative bg-black/60">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-xs font-anek font-bold shadow-md border border-white/20" style={{ background: 'rgba(18, 14, 11, 0.85)', color: '#f6d16f' }}>
                    {item.badge}
                  </div>
                </div>

                <h3 className="font-rickshaw text-2xl text-[#f6d16f] mb-1">
                  {item.name}
                </h3>
                <div className="font-anek text-xs font-bold text-[#d6645a] mb-2">
                  {item.tagline}
                </div>

                <p className="font-anek text-sm text-[#dfcfb2] leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#c69429]/30 flex items-center justify-between font-anek text-xs sm:text-sm text-[#fbf8f1]">
                <span className="text-[#c69429] font-bold">ভাড়া চার্ট:</span>
                <span className="font-semibold text-right text-[#f6d16f]">{item.fareInfo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
