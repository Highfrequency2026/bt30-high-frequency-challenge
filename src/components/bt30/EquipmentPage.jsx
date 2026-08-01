import React from 'react';

const equipment = [
  'Booty Bands (Light to Heavy) resistance',
  'Pair of dumbbells (two light for upper + two heavier for lower)',
  'Barbell Set up if available',
  'Core sliders (ab workouts)',
  'Jump Rope',
  '(2) Ankle Weights (5 - 15 lbs)',
  'Med Ball',
  'Stability Ball',
];

export default function EquipmentPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Image grid */}
      <div className="grid grid-cols-2 h-64">
        <img
          src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80"
          alt="Equipment"
          className="w-full h-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80"
          alt="Dumbbells"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-8 py-10">
        <h1 className="font-black text-5xl italic leading-tight">
          GET PREPARED
          <br />
          <span className="italic text-zinc-500">WITH SIMPLE GEAR</span>
        </h1>

        <p className="text-zinc-600 text-sm mt-6 mb-6 leading-relaxed">
          The equipment listed below is not mandatory, however, it may be used to maximize your workouts in the gym or at home!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {equipment.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-sky-500 font-black mt-0.5">—</span>
              <span className="text-zinc-700 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* Dumbbell icon */}
        <div className="mt-10 text-zinc-200">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="22" width="15" height="16" rx="3" fill="currentColor"/>
            <rect x="18" y="15" width="10" height="30" rx="3" fill="currentColor"/>
            <rect x="26" y="22" width="68" height="16" rx="2" fill="currentColor"/>
            <rect x="92" y="15" width="10" height="30" rx="3" fill="currentColor"/>
            <rect x="100" y="22" width="15" height="16" rx="3" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">7</span>
      </div>
    </div>
  );
}