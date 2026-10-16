'use client';

import React, { useState } from 'react';
import { Users, Bike, Car, Plus, Phone, Clock, DollarSign, MapPin } from 'lucide-react';
import { formatFare, toBnDigits } from '../utils/localization';
import { STATIC_HUBS } from '../data/staticData';

export default function RideShareBoard({ lang = 'bn' }) {
  const [rides, setRides] = useState([
    {
      id: "ride-001",
      hub_origin: "Farmgate",
      destination: "Dhanmondi",
      vehicle_type: "rickshaw",
      total_fare_bdt: 60,
      seats_available: 1,
      seats_taken: 1,
      host_name: "Sadia (DU Student)",
      contact_phone: "01711-234567",
      departure_time: "Now (Next 10 mins)",
      split_fare_per_person: 30,
      notes: "Waiting near Ananda Cinema foot-overbridge. Need 1 co-rider to split rickshaw."
    },
    {
      id: "ride-002",
      hub_origin: "Agargaon",
      destination: "Mohakhali",
      vehicle_type: "cng",
      total_fare_bdt: 200,
      seats_available: 2,
      seats_taken: 2,
      host_name: "Fahim (Office Commuter)",
      contact_phone: "01822-987654",
      departure_time: "6:15 PM",
      split_fare_per_person: 67,
      notes: "CNG heading to Mohakhali Wireless. Metro gate 2 pickup."
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [hubOrigin, setHubOrigin] = useState('Farmgate');
  const [destination, setDestination] = useState('Dhanmondi');
  const [vehicleType, setVehicleType] = useState('rickshaw');
  const [hostName, setHostName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [notes, setNotes] = useState('');

  const hubNames = Object.keys(STATIC_HUBS);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!hostName || !contactPhone) return;

    const totalEst = vehicleType === 'rickshaw' ? 60 : 200;
    const totalPeople = parseInt(seatsAvailable, 10) + 1;
    const split = Math.round(totalEst / totalPeople);

    const newRide = {
      id: `ride-${Date.now()}`,
      hub_origin: hubOrigin,
      destination,
      vehicle_type: vehicleType,
      total_fare_bdt: totalEst,
      seats_available: parseInt(seatsAvailable, 10),
      seats_taken: 1,
      host_name: hostName,
      contact_phone: contactPhone,
      departure_time: "In 10 mins",
      split_fare_per_person: split,
      notes: notes || "Sharing ride to split fare"
    };

    setRides([newRide, ...rides]);
    setShowModal(false);
    setHostName('');
    setContactPhone('');
  };

  return (
    <div className="heritage-card p-6 sm:p-7 border-2 border-[#c69429]/50 my-8 shadow-2xl bg-[#18130f]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#c69429]/30">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛺</span>
            <h3 className="font-rickshaw text-2xl sm:text-3xl font-bold text-[#f6d16f] rickshaw-text-pop tracking-wide">
              {lang === 'bn' ? 'যাত্রী রাইড-শেয়ার ও ভাড়া ভাগাভাগি বোর্ড' : 'Commuter Ride-Share & Fare-Split Board'}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#b83a2e] text-[#fbf8f1] font-anek font-bold border border-[#f6d16f] shadow-md">
              {lang === 'bn' ? 'রিকশা ও সিএনজি' : 'Rickshaw & CNG'}
            </span>
          </div>
          <p className="font-anek text-xs sm:text-sm text-[#dfcfb2] mt-1 font-medium">
            {lang === 'bn' ? 'একই ট্রানজিট হাবের যাত্রীদের সাথে রিকশা বা সিএনজি শেয়ার করে যানজট ও ভাড়া কমান' : 'Coordinate with fellow commuters at the same hub to share a rickshaw or CNG'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] font-anek font-black text-sm flex items-center gap-2 border-2 border-[#f6d16f] shadow-xl shadow-[#b83a2e]/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-[#f6d16f]" />
          <span>{lang === 'bn' ? 'নতুন রাইড শেয়ার পোস্ট করুন' : 'Post Ride-Share'}</span>
        </button>
      </div>

      {/* Ride-Share Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#16110d] border-2 border-[#c69429]/30 hover:border-[#f6d16f] transition-all interactive-card shadow-lg relative overflow-hidden"
          >
            {/* Subtle vintage stamp watermark */}
            <div className="absolute top-2 right-2 opacity-10 pointer-events-none select-none text-5xl">
              {ride.vehicle_type === 'rickshaw' ? '🛺' : '🚕'}
            </div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border-2 ${
                  ride.vehicle_type === 'rickshaw'
                    ? 'bg-[#b83a2e]/20 border-[#b83a2e] text-[#f6d16f]'
                    : 'bg-[#15453b]/40 border-[#2a6f62] text-[#7dd3fc]'
                }`}>
                  {ride.vehicle_type === 'rickshaw' ? '🛺' : '🚕'}
                </div>
                <div>
                  <h4 className="font-anek text-lg font-black text-[#fbf8f1] flex items-center gap-1.5">
                    <span>{ride.hub_origin}</span>
                    <span className="text-[#f6d16f]">➔</span>
                    <span>{ride.destination}</span>
                  </h4>
                  <span className="inline-block text-[11px] font-anek font-bold px-2 py-0.5 rounded bg-[#201712] border border-[#c69429]/30 text-[#dfcfb2] uppercase mt-0.5">
                    {ride.vehicle_type === 'rickshaw' ? (lang === 'bn' ? 'রিকশা শেয়ার' : 'Rickshaw Share') : (lang === 'bn' ? 'সিএনজি শেয়ার' : 'CNG Share')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-anek text-xs text-[#dfcfb2] block font-medium">
                  {lang === 'bn' ? 'জনপ্রতি ভাড়া:' : 'Per Person:'}
                </span>
                <span className="font-rickshaw text-2xl sm:text-3xl font-bold text-[#f6d16f] rickshaw-text-pop">
                  {formatFare(ride.split_fare_per_person, lang)}
                </span>
              </div>
            </div>

            <p className="font-anek text-sm text-[#dfcfb2] leading-relaxed mb-4 bg-[#1e1712] p-3.5 rounded-xl border border-[#c69429]/20 font-medium italic">
              "{ride.notes}"
            </p>

            <div className="pt-3 border-t border-[#c69429]/20 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 font-anek text-xs sm:text-sm text-[#dfcfb2] font-semibold">
                <Clock className="w-4 h-4 text-[#c69429]" />
                <span>{ride.departure_time}</span>
              </div>

              <a
                href={`tel:${ride.contact_phone}`}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#292019] hover:bg-[#b83a2e] text-[#f6d16f] hover:text-[#fbf8f1] border border-[#c69429]/40 font-anek font-bold text-xs active:scale-95 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#f6d16f]" />
                <span>{ride.host_name}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Post New Ride-Share */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0705]/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="heritage-card w-full max-w-lg p-6 sm:p-7 border-2 border-[#c69429] bg-[#1a130f] shadow-2xl relative rounded-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#c69429]/30">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛺</span>
                <h3 className="font-rickshaw text-xl font-bold text-[#f6d16f] rickshaw-text-pop">
                  {lang === 'bn' ? 'যাত্রী রাইড-শেয়ার আহ্বান করুন' : 'Post Ride-Share Invitation'}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-[#292019] text-[#dfcfb2] hover:text-white border border-[#c69429]/30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 font-anek">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                    {lang === 'bn' ? 'যাত্রা শুরুর হাব' : 'Origin Hub'}
                  </label>
                  <select
                    value={hubOrigin}
                    onChange={(e) => setHubOrigin(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm font-semibold focus:border-[#f6d16f] focus:outline-none"
                  >
                    {hubNames.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                    {lang === 'bn' ? 'গন্তব্য' : 'Destination'}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm font-semibold focus:border-[#f6d16f] focus:outline-none"
                  >
                    {hubNames.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                  {lang === 'bn' ? 'বাহনের ধরন' : 'Vehicle'}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVehicleType('rickshaw')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      vehicleType === 'rickshaw' 
                        ? 'bg-[#b83a2e] text-[#fbf8f1] border-[#f6d16f] shadow-md' 
                        : 'bg-[#120e0b] text-[#dfcfb2] border-[#c69429]/30 hover:border-[#c69429]'
                    }`}
                  >
                    {lang === 'bn' ? '🛺 রিকশা (আনুমানিক ৬০ ৳)' : '🛺 Rickshaw (~60 BDT)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('cng')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      vehicleType === 'cng' 
                        ? 'bg-[#15453b] text-[#fbf8f1] border-[#7dd3fc] shadow-md' 
                        : 'bg-[#120e0b] text-[#dfcfb2] border-[#c69429]/30 hover:border-[#c69429]'
                    }`}
                  >
                    {lang === 'bn' ? '🚕 সিএনজি (আনুমানিক ২০০ ৳)' : '🚕 CNG (~200 BDT)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                  {lang === 'bn' ? 'আপনার নাম ও পরিচয়' : 'Host Name'}
                </label>
                <input
                  type="text"
                  required
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: সাদিয়া (ঢাকা বিশ্ববিদ্যালয় শিক্ষার্থী)' : 'e.g. Sadia (DU Student)'}
                  className="w-full p-3 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm focus:border-[#f6d16f] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="01711-xxxxxx"
                  className="w-full p-3 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm focus:border-[#f6d16f] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#dfcfb2] block mb-1.5">
                  {lang === 'bn' ? 'অপেক্ষার স্থান ও বিবরণ' : 'Pickup Landmark & Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: আনন্দ সিনেমা হলের ওভারব্রিজের নিচে দাঁড়িয়ে আছি' : 'e.g. Waiting near Ananda Cinema foot-overbridge'}
                  className="w-full p-3 rounded-xl bg-[#120e0b] border border-[#c69429]/40 text-[#fbf8f1] text-sm focus:border-[#f6d16f] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-[#292019] hover:bg-[#382b22] text-[#dfcfb2] text-sm font-bold border border-[#c69429]/30"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#b83a2e] to-[#891e17] hover:from-[#d6645a] hover:to-[#b83a2e] text-[#fbf8f1] text-sm font-black border-2 border-[#f6d16f] shadow-lg shadow-[#b83a2e]/40"
                >
                  {lang === 'bn' ? 'পোস্ট করুন' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
