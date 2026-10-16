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
    <div className="glass-panel p-6 sm:p-7 border border-emerald-500/30 my-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'bn' ? 'যাত্রী রাইড-শেয়ার ও ভাড়া ভাগাভাগি বোর্ড (Bonus Task 3)' : 'Commuter Ride-Share & Fare-Split Board (Bonus 3)'}</span>
          </h3>
          <p className="text-sm text-slate-300 font-medium mt-1">
            {lang === 'bn' ? 'একই ট্রানজিট হাবের যাত্রীদের সাথে রিকশা বা সিএনজি শেয়ার করে ভাড়া কমান' : 'Coordinate with fellow commuters at the same hub to share a rickshaw or CNG'}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? 'নতুন রাইড শেয়ার পোস্ট করুন' : 'Post Ride-Share'}</span>
        </button>
      </div>

      {/* Ride-Share Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all interactive-card shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  {ride.vehicle_type === 'rickshaw' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    {ride.hub_origin} ➔ {ride.destination}
                  </h4>
                  <span className="text-xs text-slate-400 uppercase font-bold">
                    {ride.vehicle_type}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">{lang === 'bn' ? 'জনপ্রতি ভাড়া:' : 'Per Person:'}</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  {formatFare(ride.split_fare_per_person, lang)}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-850 font-medium">
              "{ride.notes}"
            </p>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{ride.departure_time}</span>
              </div>

              <a
                href={`tel:${ride.contact_phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-bold active:scale-95 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{ride.host_name}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Post New Ride-Share */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-7 border border-emerald-500/40 shadow-2xl relative">
            <h3 className="text-xl font-black text-white mb-4">
              {lang === 'bn' ? 'যাত্রী রাইড-শেয়ার আহ্বান করুন' : 'Post Ride-Share Invitation'}
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {lang === 'bn' ? 'যাত্রা শুরুর হাব' : 'Origin'}
                  </label>
                  <select
                    value={hubOrigin}
                    onChange={(e) => setHubOrigin(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold"
                  >
                    {hubNames.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {lang === 'bn' ? 'গন্তব্য' : 'Destination'}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold"
                  >
                    {hubNames.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  {lang === 'bn' ? 'বাহন' : 'Vehicle'}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVehicleType('rickshaw')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                      vehicleType === 'rickshaw' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {lang === 'bn' ? 'রিকশা (৬০ ৳)' : 'Rickshaw (60 BDT)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('cng')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                      vehicleType === 'cng' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {lang === 'bn' ? 'সিএনজি (২০০ ৳)' : 'CNG (200 BDT)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  {lang === 'bn' ? 'আপনার নাম ও পরিচয়' : 'Host Name'}
                </label>
                <input
                  type="text"
                  required
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Tanvir (BUET Student)"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  {lang === 'bn' ? 'অপেক্ষার স্থান ও বিবরণ' : 'Pickup Landmark & Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. In front of Ananda Cinema"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30"
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
