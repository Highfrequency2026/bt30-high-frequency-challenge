import React from 'react';

export default function SharePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 py-16 print:break-after-page">
      <div className="text-center mb-8">
        <h1 className="text-red-500 font-black text-5xl md:text-7xl leading-none">SHOW ME!</h1>
        <div className="flex items-center gap-3 justify-center">
          <h2 className="text-white font-black text-4xl md:text-6xl leading-none">DON'T TELL ME!</h2>
        </div>
        <p className="text-white font-bold text-xl tracking-widest mt-2 uppercase">S H A R E Y O U R T R A N S F O R M A T I O N</p>
      </div>

      <div className="max-w-xl text-center space-y-4 mb-10">
        <p className="text-zinc-400 text-sm leading-relaxed">
          You are going to be putting in A LOT of work over the next month. Show off how hard you have been working by recording your workouts and posting them on your Instagram accounts!
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Don't forget to tag us in your posts or stories by using the hashtags below so we can follow your amazing transformation.
        </p>
        <p className="text-zinc-400 text-sm leading-relaxed">
          We will be giving out a prize to 3 of the best transformations. Please read our FAQs for full filming and posting requirements.
        </p>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-white font-black text-3xl md:text-5xl tracking-widest">LET'S GET <span className="text-red-500">SOCIAL</span></h3>
        <p className="text-white font-black text-lg tracking-widest"># B T 3 0 D A Y C H A L L E N G E</p>
        <p className="text-white font-bold text-lg tracking-widest">@ B R E T I E S I</p>
        <p className="text-white font-bold text-lg tracking-widest">@ F O R C E F I T N E S S I N C</p>
      </div>

      <div className="flex justify-between items-center w-full mt-16 border-t border-zinc-800 pt-6">
        <span className="text-zinc-600 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-zinc-900 text-white font-black italic text-xl px-4 py-2">6</span>
      </div>
    </div>
  );
}