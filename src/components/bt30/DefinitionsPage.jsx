import React from 'react';

const defs = [
  { term: 'SETS', def: 'A group of consecutive repetitions.' },
  { term: 'REPETITION', def: 'One complete motion of an exercise.' },
  { term: 'POST WORKOUT CARDIO', def: 'Assigned cardio workout after successful completion of your primary workout.' },
  { term: 'H.I.I.T.', def: 'High-intensity interval training (HIIT) is a form of exercise in which you alternate between very intense anaerobic periods and slower recovery periods for a shorter, more efficient workout.' },
  { term: 'BMR', def: 'The number of calories your body needs to accomplish its most basic (basal) life-sustaining functions.' },
  { term: 'MHR', def: 'Is the rhythm that the human heart of a given person reaches during a very intense sporting effort (e.g. sprint to the maximum possible). At rest, the HRmax is about 40 to 80 beats per minute depending on the individual.' },
  { term: 'TRAINING ZONE', def: 'A heart rate training zone is a range that defines the upper and lower limits of training intensities. Training above 85% of MHR is anaerobic exercise.' },
];

export default function DefinitionsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
          alt="Gym"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="bg-black p-8 md:w-64 flex-shrink-0 flex flex-col justify-center">
          <h1 className="text-white font-light text-4xl leading-tight">
            TERMS &<br />
            <span className="font-black">DEFINITIONS</span>
          </h1>
          <div className="h-px bg-white/30 my-4 w-16" />
          <p className="text-zinc-400 text-xs tracking-widest uppercase leading-relaxed">GET FAMILIAR WITH THESE WORDS</p>
        </div>

        <div className="flex-1 px-8 py-8">
          <p className="text-zinc-500 text-sm mb-6">There may be some words or terminology used that you may not be familiar with. Below is a guide to those terms.</p>
          <div className="space-y-4">
            {defs.map(({ term, def }) => (
              <div key={term}>
                <span className="font-black text-black text-sm">{term}</span>
                <span className="text-zinc-600 text-sm"> - {def}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">8</span>
      </div>
    </div>
  );
}