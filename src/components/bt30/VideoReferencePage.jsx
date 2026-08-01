import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

const videoSections = [
  {
    title: 'CARDIO',
    subtitle: 'VIDEO REFERENCE | WARM UP & STAIRS',
    moves: [
      '1A. Jog x3 (modify by walking)',
      '1B. Pivot Squat x2 (modify without twist)',
      '1C. Step into Squat (modify without squat)',
      '1D. Long Stride Lunges (modify with short strides)',
    ]
  },
  {
    title: 'HIIT 1',
    subtitle: 'VIDEO REFERENCE | HIIT',
    moves: [
      '1A. Jumping Jacks (modify by lifting knees without jump)',
      '1B. Side to Side Jump Squat (modify without jump)',
      '1C. Crossover Leg Raises',
      '1D. Squat into Side Leg Raise',
      '1E. Twisting Jump Squats (modify without jump)',
      '1F. Heal Kicks into a squat 3 pattern',
      '1G. Explosive Jumps (modify without jump)',
      '1H. Sidestep into Squat',
      '1I. Jumping Jacks (modify by lifting knees without jump)',
      '1J. Triple Pulse Jump Squats (modify without jump)',
    ]
  },
  {
    title: 'HIIT 2',
    subtitle: 'VIDEO REFERENCE | HIIT',
    moves: [
      '1A. Jumping Jacks (modify by lifting knees without jump)',
      '1B. Side to Side Jump Squat (modify without jump)',
      '1C. Triple Pulse Jump Squats (modify without jump)',
      '1D. Heel Kicks into a squat 3 pattern',
      '1E. Stair Run (modify by walking)',
      '1F. Traveling Pivot Squats (Stairs)',
      '1G. Jump Squats x2 (stairs)',
      '1H. Lunge into Squat (Stairs)',
      '1I. Long Stride Lunges x2 (stairs)',
    ]
  },
  {
    title: 'HIIT 3',
    subtitle: 'VIDEO REFERENCE | HIIT',
    moves: [
      '1A. Jumping Jacks', '1B. Side to Side Jump Squat', '1C. Squat into front Kicks',
      '1D. Twisting Jump Squats', '1E. Heel Kicks into a squat 3 pattern',
      '1F. Triple Pulse Jump Squats', '1G. Criss Cross Jacks',
      '1H. Traveling Pivot Squats', '1I. Lunge Jumps', '1J. Squat into Kickback',
      '1K. Jog into Back Pedal', '1L. Broad Jumps', '1M. Alternating Lunge into Squat',
      '1N. Jog', '1O. Squat into Side Leg Raise', '1P. Advanced Burpee',
    ]
  },
  {
    title: 'HIIT 4',
    subtitle: 'VIDEO REFERENCE | HIIT',
    moves: [
      '1A. Jumping Jacks', '1B. Advanced Burpees', '1C. Side Shuffles',
      '1D. Heel Kicks into squat 3 pattern', '1E. 4x1 Mountain Climbers into Hip Raise',
      '1F. Plank Knee Taps + Pike to Shin Taps', '1G. Explosive Jumps into burpee',
      '1H. Broad Jumps', '1I. Lunge jumps', '1J. Front to Back Jog',
      '1K. Rock Back Push Ups', '1L. Pivot Squat', '1M. Traveling Crossover Leg Raises',
      '1N. Advanced Lunge Pattern', '1O. Twisting Jump Squats', '1P. Jog Into Wind Sprints',
    ]
  },
  {
    title: 'CORE SERIES 1',
    subtitle: 'BEGINNER',
    moves: [
      '1A. Leg Raises (modify with bend at knees)',
      '1B. Split Leg Raises (modify with bend at knees)',
      '1C. Alternating Lead Leg Reverse Crunches',
      '1D. Tilt Leg Raises (modify with bend at knees)',
      '1E. Windmill (modify with bend at knees)',
      '1F. Windshield Wipers (modify with bend at knee)',
      '1G. Bicycle x3 (modify without lifting the leg)',
    ]
  },
  {
    title: 'CORE SERIES 2',
    subtitle: 'ADVANCED',
    moves: [
      '1A. Crossovers', '1B. Crossover into Knee Tuck', '1C. Knee Tucks',
      '1D. Leg Raises', '1E. Twisting Leg Raises', '1F. Alternating Knee-Ins',
      '1G. Windmill', '1H. Seated Leg Raise - Variation 1',
      '1I. Seated Leg Raise - Variation 2', '1J. Seated Leg Raise - Variation 3',
    ]
  },
];

export default function VideoReferencePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white print:break-after-page">
      <div className="relative h-40 overflow-hidden">
        <img src={BRE_IMG} alt="Bre Tiesi" className="w-full h-full object-cover object-top opacity-60 bg-black" />
        <div className="absolute inset-0 bg-black/40 flex items-center px-8">
          <div>
            <p className="text-white/60 text-xs tracking-widest uppercase">VIDEO REFERENCE</p>
            <h1 className="text-white font-black text-4xl">WORKOUT GUIDE</h1>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {videoSections.map(section => (
          <div key={section.title} className="border border-zinc-200 rounded">
            <div className="bg-black p-4 flex items-center gap-3">
              <h2 className="text-white font-light text-2xl">{section.title}</h2>
              <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">▶</span>
              </div>
            </div>
            <p className="text-zinc-400 text-xs tracking-widest px-4 pt-3 uppercase">{section.subtitle}</p>
            <ul className="px-4 pb-4 pt-2 space-y-1">
              {section.moves.map((m, i) => (
                <li key={i} className="text-xs text-zinc-700 font-medium leading-relaxed">{m}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200">
        <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
        <span className="bg-black text-white font-black italic text-xl px-4 py-2">10</span>
      </div>
    </div>
  );
}