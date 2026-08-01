import React from 'react';

export default function CreditsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-sky-500 flex flex-col items-center justify-center px-8 py-16 print:break-after-page">
      <h1 className="text-white font-black text-6xl mb-8 tracking-tight">CREDITS</h1>

      <div className="text-center mb-8">
        <p className="text-white text-sm tracking-widest uppercase mb-2">FEATURING</p>
        <h2 className="text-white font-black text-5xl leading-tight">BRE TIESI</h2>
        <p className="text-white/80 text-lg mt-1">@bretiesi</p>
      </div>

      <div className="text-center mb-8">
        <p className="text-white text-sm tracking-widest uppercase mb-2">CELEBRITY TRAINER</p>
        <h3 className="text-white font-black text-4xl">MIKE T.</h3>
        <p className="text-white/80">@forcefitnessinc</p>
      </div>

      <div className="text-center mb-8">
        <h4 className="text-white font-bold text-xl tracking-widest uppercase mb-4">TEAM BRE FITNESS MODELS</h4>
        <div className="grid grid-cols-2 gap-6 text-center">
          {[
            { name: 'MARIA CASTILLO', handle: '@FLAWEDANDFIT' },
            { name: 'NIKKIE GITTENS', handle: '@FITT.NIKK' },
            { name: 'ROBYN BROWN', handle: '@OFICIALORAFIT' },
            { name: 'ARIANNA LUCIA', handle: '@ARIANNALUCIALA' },
          ].map(m => (
            <div key={m.name}>
              <p className="text-white font-bold text-sm tracking-wider">{m.name}</p>
              <p className="text-white/70 text-xs">{m.handle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-white/30 pt-6 text-center">
        <p className="text-white font-black text-lg tracking-widest">HATTHAWAY & BRIGGS</p>
        <p className="text-white/60 text-xs tracking-wider">ADVERTISING, MARKETING, SOCIAL MEDIA & MORE</p>
        <p className="text-white/60 text-xs mt-1">DESIGN BY HATTHAWAY & BRIGGS</p>
        <p className="text-white/60 text-xs">HATTHAWAYBRIGGS.COM | @LIFEBYDIMA</p>
      </div>

      <button onClick={() => onNavigate('contents')} className="mt-10 bg-white text-sky-600 font-black text-sm tracking-widest uppercase px-8 py-3 rounded hover:bg-sky-50 transition-all print:hidden">
        VIEW CONTENTS →
      </button>
    </div>
  );
}