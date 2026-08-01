import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

export default function CoverPage({ onNavigate }) {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden print:break-after-page">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BRE_IMG})`, filter: 'brightness(0.75)' }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-start justify-between p-6">
        <p className="text-white text-xs font-light tracking-widest uppercase opacity-80">BT30DAYCHALLENGE.COM</p>
      </div>

      {/* Name overlay top right */}
      <div className="absolute top-8 right-6 z-10 text-right">
        <h1 className="text-white font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', letterSpacing: '-2px', textShadow: '2px 2px 20px rgba(0,0,0,0.5)' }}>
          BRE
        </h1>
        <h2 className="text-white font-light text-2xl tracking-widest" style={{ textShadow: '1px 1px 10px rgba(0,0,0,0.5)' }}>
          TIESI
        </h2>
        <div className="mt-1 h-0.5 bg-white w-32 ml-auto opacity-60" />
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-sky-600 p-6 max-w-xs">
          <h3 className="text-white font-black text-2xl leading-tight uppercase tracking-wider">
            HIGH FREQUENCY<br />
            <span className="text-4xl">BT30-DAY</span><br />
            FITNESS<br />
            CHALLENGE
          </h3>
        </div>
        <div className="bg-black px-6 py-3 flex items-center justify-between max-w-xs">
          <div>
            <p className="text-zinc-400 text-xs tracking-wider">Powered by</p>
            <p className="text-white font-bold text-sm tracking-widest">FORCE <span className="font-black">FITNESS</span> INC.</p>
          </div>
        </div>
        <div className="absolute right-6 bottom-6 text-right">
          <p className="text-white font-black text-lg tracking-wider">MIKE T.</p>
          <p className="text-sky-400 text-sm font-bold">@FORCEFITNESSINC</p>
          <p className="text-white italic text-xs mt-1 opacity-80">working out with greatness.<br />30 days to change your life.</p>
        </div>
      </div>

      {/* Scroll prompt */}
      <button
        onClick={() => onNavigate('contents')}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold tracking-widest uppercase px-6 py-2 rounded-full transition-all print:hidden"
      >
        VIEW GUIDE ↓
      </button>
    </div>
  );
}