import React from 'react';

const keyData = [
  {
    title: 'SETS, REPETITION & WEIGHT/RESISTANCE KEY',
    rows: [
      { level: 'BEGINNER', desc: '2 Sets of 5 to 10 Reps using light weight/resistance' },
      { level: 'INTERMEDIATE', desc: '3 Sets of 10 to 15 Reps using medium weight/resistance' },
      { level: 'ADVANCED', desc: '4 Sets of 15 to 20 Reps using med. to heavy weight/resistance' },
    ]
  },
  {
    title: 'CARDIO WORKOUT KEY',
    rows: [
      { level: 'BEGINNER', desc: '30 min to 45 min' },
      { level: 'INTERMEDIATE', desc: '45 min to 1 hr' },
      { level: 'ADVANCED', desc: '1 hr to 1 hr 20 min' },
    ]
  },
  {
    title: 'POST WORKOUT CARDIO KEY',
    rows: [
      { level: 'BEGINNER', desc: '20 m P.W.C.' },
      { level: 'INTERMEDIATE', desc: '30 m P.W.C.' },
      { level: 'ADVANCED', desc: '60 m P.W.C.' },
    ]
  },
  {
    title: 'HIIT WORKOUT KEY',
    rows: [
      { level: 'BEGINNER', desc: '2 Sets of 20 seconds interval - 30 to 60 seconds rest' },
      { level: 'INTERMEDIATE', desc: '4 Sets of 45 seconds - interval 30 seconds rest' },
      { level: 'ADVANCED', desc: '5 Sets of 60 seconds interval - 20 to 30 seconds rest' },
    ]
  },
  {
    title: 'CORE WORKOUT KEY',
    rows: [
      { level: 'BEGINNER', desc: '1 Set 5-8 Reps follow w/ 20m P.W.C.' },
      { level: 'INTERMEDIATE', desc: '2/3 Sets 10-12 Reps follow w/ 30m P.W.C.' },
      { level: 'ADVANCED', desc: '3/4 Sets 15-20 Reps follow w/ 60m P.W.C.' },
    ]
  },
];

export default function FitnessKeyPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 px-8 py-10">
          <h1 className="font-light text-5xl leading-tight mb-2">
            MOVEMENTS &<br />
            <span className="font-black">FITNESS LEVEL KEY</span>
          </h1>
          <p className="text-zinc-500 text-sm mb-8">Use the Keys below as a guide and choose one that corresponds best with your level of fitness.</p>

          <div className="space-y-8">
            {keyData.map(section => (
              <div key={section.title}>
                <h3 className="font-black text-sm tracking-wider uppercase border-b-2 border-black pb-1 mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.rows.map(row => (
                    <div key={row.level} className="flex gap-4">
                      <span className="text-xs font-black w-28 text-zinc-800 flex-shrink-0">{row.level}</span>
                      <span className="text-xs text-zinc-600">{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-72 bg-zinc-900 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"
            alt="Trainer"
            className="w-full h-full object-cover opacity-60"
            style={{ minHeight: '300px' }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-6 text-center">
            <p className="text-white text-xs leading-relaxed">These exercises increase in difficulty. Choose the one that best fits your current fitness level or physical ability.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">9</span>
      </div>
    </div>
  );
}