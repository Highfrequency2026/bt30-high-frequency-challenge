import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

export default function CongratulationsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white flex flex-col print:break-after-page">
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: '60vh' }}>
        <img src={BRE_IMG} alt="Bre Tiesi" className="w-full h-full object-cover object-top absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, white 100%)' }}
        />
      </div>

      <div className="bg-black px-8 py-10 text-center">
        {/* Gold confetti dots */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70" style={{ marginTop: `${Math.random() * 12}px` }} />
          ))}
        </div>

        <h1 className="text-white font-black text-4xl md:text-6xl leading-tight uppercase mb-2">
          CONGRATULATIONS!
        </h1>
        <p className="text-white text-sm tracking-widest uppercase font-bold">
          YOU'VE COMPLETED THE HIGH FREQUENCY BT30 DAY CHALLENGE!
        </p>

        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {['#BT30DAYCHALLENGE', '@BRETIESI', '@FORCEFITNESSINC'].map(tag => (
            <span key={tag} className="bg-sky-600 text-white font-bold text-xs px-4 py-2 rounded-full tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onNavigate('cover')}
          className="mt-8 bg-white text-black font-black text-sm tracking-widest uppercase px-8 py-3 rounded hover:bg-sky-50 transition-all print:hidden"
        >
          ← BACK TO START
        </button>
      </div>
    </div>
  );
}