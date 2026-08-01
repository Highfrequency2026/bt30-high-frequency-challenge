import React from 'react';

const BRE_IMG = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/9c7469afa_bre_tiesi_7d9eee9a48b34dc4b86475e32d9fe89d.jpg";

const workouts = {
  1: {
    week: 1, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 1 DAY 1', video: true, moves: [
          '1A. Squats with Close base (modify using dumbbells, barbell or any resistance avail.)',
          '1B. Squats with Wide base (modify using dumbbells, barbell or any resistance avail.) — Repeat (refer to Set/Rep Key)',
          '2A. Alternating Lunges + Bicep Curl (modify using resistance bands) — Repeat',
          '3A. Split Squat + Lateral Raise (modify using resistance bands) — Repeat',
          '4A. Curtsy Lunge (modify without weights) — Repeat',
          '5A. Reverse Lunge + Shoulder Press (modify using resistance bands) — Repeat',
          '6A. Alternating Lunge Pattern (modify without weights) — Repeat',
          '7A. Deadlift into Squat Combo (modify without weights) — Repeat',
          '8A. Glute Bridge + Abduction (modify without bands)',
          '8B. Glute Bridge + Abduction 5 Pulse (modify without bands)',
          '8C. Single Leg Glute Bridge (modify without bands) — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat (refer to Core Set/Rep Key)'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  2: {
    week: 1, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 1 DAY 2', video: true, moves: [
          '1A. Jumping Jacks (modified)',
          '1B. Ski Squat into Sumo Squat (modified) — Repeat',
          '2A. Walkout into Plank Jack (modify without plank jack)',
          '2B. Mountain Climbers into Hip Raises — Repeat',
          '3A. Lunge Jumps into Squat (modify without jumping) — Repeat',
          '4A. Chest Press on Stability Ball (modify by performing on mat)',
          '4B. Chest Fly on Stability Ball (modify by performing on mat) — Repeat',
          '5A. Triceps Overhead Press (modify performing triceps kickback) — Repeat',
          '6A. Alternating Biceps Curls (modify using resistance bands)',
          '6B. Double Biceps Curl (modify using resistance bands)',
          '6C. Biceps Curl into Shoulder Press (modify using resistance bands) — Repeat',
          '7A. Shoulder Press (modify using resistance bands) — Repeat',
          '8A. Triceps Dominant Push Ups — Repeat',
          '9A. Stability Ball Push Ups (modify by performing on mat) — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat (refer to Core Set/Rep Key)'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  3: {
    week: 1, type: 'cardio',
    sections: [
      {
        label: 'A) WEEK 1 DAY 3 — CARDIO OR HIIT VIDEO', video: true, moves: [
          'Treadmill, Elliptical, Stairmaster, Exercise Bike',
          '(hike or jog/walk in the neighborhood if at home)',
          'Choose HIIT Level 1, 2, 3 or 4',
        ]
      },
    ]
  },
  4: {
    week: 1, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 1 DAY 4', video: true, moves: [
          '1A. Squat into Side Knee Raise', '1B. Squat into front Kicks', '1C. Heel Kicks into a squat 3 pattern — Repeat',
          '2A. Twisting Jump Squats', '2B. Plank Walkout — Repeat',
          '3A. Stability Ball Shoulder Press', '3B. Stability Ball Lateral Raise (2 Sets)',
          '3C. Stability Ball Bicep Curl + Shoulder Press Combo',
          '3D. Advanced Front Delt Raises (2 SETS)', '3E. Shoulder Fly — Repeat',
          '4A. Stability Ball Bicep Curl + Shoulder Press Combo',
          '4B. Advanced Front Delt Raises 3', '4C. Shoulder Fly 2 — Repeat',
          '5A. Crossover Glute Kickbacks w Resistance', '5B. Bent Knee Crossover Kickbacks w Resistance',
          '5C. Right Angle Glute Kickbacks w Resistance — Repeat',
          '6A–6F. Lying Hip Abduction Variations + Fire Hydrant + Pulse — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat (refer to Core Set/Rep Key)'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  5: { week: 1, type: 'rest', sections: [] },
  6: {
    week: 2, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 2 DAY 6', video: true, moves: [
          '1A. Jumping Jacks', '1B. Squat into front Kicks', '1C. Side to side jumps — Repeat',
          '2A. Advanced Burpees', '2B. Plank Walkout into Knees Crossover — Repeat',
          '3A. Plie Squat', '3B. Deadlift Squat Combo', '3C. Triple Pulse Squat — Repeat',
          '4A. Reverse Lunges — Repeat',
          '5A. Glute Bridge', '5B. Glute Bridge with Abduction', '5C. Single Leg Glute Bridge — Repeat',
          '6A. Fire Hydrant', '6B. Clam Shells — Repeat',
          '7A. Plank Tilt', '7B. Alternating Lead Leg Reverse Crunches', '7C. Split Leg Raises', '7D. Windmill — Repeat',
        ]
      },
      { label: 'C) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  7: {
    week: 2, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 2 DAY 7', video: true, moves: [
          '1A. Squat into Overhead Press (modify without medicine ball)',
          '1B. Deadlift into Overhead Raise', '1C. Side to Side Squat into Overhead Press — Repeat',
          '2A. Reverse Lunge Shoulder Press Combo', '2B. Lateral Ball Toss — Repeat',
          '3A. Jump Squat into Shoulder Press — Repeat',
          '4A. Advanced Burpee into Shoulder Press', '4B. Plank Walkout into Knee Crossover — Repeat',
          '5A. Bicep Curls', '5B. Bicep Curls into Shoulder Press', '5C. Lateral Raise into Front Delt Raise — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat (refer to Core Set/Rep Key)'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  8: { week: 2, type: 'cardio', sections: [{ label: 'A) WEEK 2 DAY 8 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  9: {
    week: 2, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 2 DAY 9', video: true, moves: [
          '1A. Chest Press on Stability Ball', '1B. Chest Fly on Stability Ball — Repeat',
          '2A. Bicep Curl into Shoulder Press on Stability Ball — Repeat',
          '3A. Glute Bridge on Stability Ball', '3B. Glute Bridge Hold', '3C. Glute Bridge with Hamstring Curl — Repeat',
          '4A. Push Ups on Stability Ball x2 — Repeat',
          '5A–5D. Hip Abduction Variations — Repeat',
          '6A. Straight Leg Crossover Kickback', '6B. Bent Knee Crossover Kickback', '6C. Bent knee kickback — Repeat',
          '7A. Reverse Crunch / Leg Raise', '7B. Crossover Sit ups', '7C. Windshield Wipers', '7D. Windmills', '7E. Bicycles x3 — Repeat',
        ]
      },
      { label: 'C) Post Workout Cardio', moves: ['(refer to Level Key)'] },
    ]
  },
  10: {
    week: 2, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 2 DAY 10', video: true, moves: [
          '1A. Landmine Squat / Deadlift', '1B. Bent Over Row', '1C. Rear Delt Fly / Torso Twist x2 — Repeat',
          '2A. Squat into Shoulder Press', '2B. Single Arm Row / Lateral Raises — Repeat',
          '3A. Bicep Curls 3x3', '3B. Hike — Repeat',
          '4A. Jog', '4B. Stair Pivot Squat', '4C. Long Stride Lunge — Repeat',
          '5A. Partner Sit Ups', '5B. Bicycle x3 — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat (refer to Core Set/Rep Key)'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  11: {
    week: 2, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 2 DAY 11', video: true, moves: [
          '1A. Torso Twist n Toss', '1B. Pivot Squats — Repeat',
          '2A. Long Stride Lunge and Press', '2B. Advancing Jump Squats — Repeat',
          '3A. Deadlift to Side Hop', '3B. Partner Lateral Movement drill — Repeat',
          '4A. Sprint — Repeat',
          '5A–5C. Battle rope variations — Repeat',
          '6A–6E. Partner Sit-ups + Bicycles — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  12: { week: 2, type: 'rest', sections: [] },
  13: {
    week: 3, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 3 DAY 13', video: true, moves: [
          '1A. Lat Pulldown', '1B. Reverse Grip Lat Pulldown', '1C. Seated Row — Repeat',
          '2A. Lateral Raise', '2B. Biceps Curl into Shoulder Press', '2C. Triceps Overhead Press — Repeat',
          '3A. Front Delt Raises', '3B. Advanced Front Delt Raises — Repeat',
          '4A. Barbell Chest Press', '4B. Dumbbell Chest Press', '4C. Dumbbell Chest Fly — Repeat',
          '5A–5B. Triceps Pushdown — Repeat',
          '6A. Dumbbell Biceps Curl', '6B. Barbell Biceps Curl — Repeat',
          '7A. Push-Ups — Repeat',
          '8A. Bent Over Row into Back Extension', '8B. Single Arm Bent Over Row — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 1 VIDEO BEGINNER', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  14: {
    week: 3, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 3 DAY 14', video: true, moves: [
          '1A. Landmine Squat to Press', '1B. Landmine Squat to Jump Press — Repeat',
          '2A. Deadlift to Squat Combo', '2B. Front & Reverse Curtsy Lunges — Repeat',
          '3A. Weighted Hip Thrust', '3B. Cable Pull Through — Repeat',
          '4A–4D. Hip Abduction / Glute Kickback variations — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 2 VIDEO ADVANCED', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  15: { week: 3, type: 'cardio', sections: [{ label: 'A) WEEK 3 DAY 15 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  16: {
    week: 3, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 3 DAY 16', video: true, moves: [
          '1A. Pulsing Deep Squats', '1B. Lateral Squats — Repeat',
          '2A. Jumping Jacks', '2B. Criss Cross Jumping jacks', '2C. Lateral Jump Squats', '2D. Heel Kicks into Squat — Repeat',
          '3A. Crossover Knee Raises', '3B. Side Knee Raises — Repeat',
          '4A. Pivot Squats', '4B. Long Stride Lunges — Repeat',
          '5A. Overhead Sit-Ups', '5B. Twisting Sit-Ups', '5C. Leg Raises', '5D. Tilt Leg Raises',
        ]
      },
      { label: 'C) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  17: { week: 3, type: 'cardio', sections: [{ label: 'A) WEEK 3 DAY 17 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  18: {
    week: 3, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 3 DAY 18', video: true, moves: [
          '1A. Deep Squats Wide Base', '1B. Deep Squats Narrow Base', '1C. Lateral Squats — Repeat',
          '2A. Alternating Lunges — Repeat',
          '3A. Deadlifts', '3B. Deadlift Squat Combo — Repeat',
          '4A. Abduction x2 — Repeat', '5A. Kickbacks x2 — Repeat',
          '6A. Leg Press', '6B. Leg Curl x2 — Repeat',
          '7A. Kneeling Kickback', '7B. Lying Leg Curl 7x7x7 — Repeat',
        ]
      },
      { label: 'C) Post Workout Cardio', moves: ['(refer to Level Key)'] },
    ]
  },
  19: { week: 3, type: 'rest', sections: [] },
  20: {
    week: 4, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 4 DAY 20', video: true, moves: [
          '1A. Overhead Squat', '1B. Triple Pulse Squat — Repeat',
          '2A. Side to Side Squat', '2B. Jump Squat / Weighted Deep Squat — Repeat',
          '3A. Straight Leg Crossover Kickback', '3B. Bent Knee Crossover Kickback', '3C. Bent knee kickback — Repeat',
          '4A. Hip Abduction', '4B. Standing Glute Kickback — Repeat',
          '5A. Deep Squat', '5B. Triple Pulse Deep Squat', '5C. Plie Squat', '5D. Romanian Deadlift — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 2 VIDEO ADVANCED', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  21: {
    week: 4, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 4 DAY 21', video: true, moves: [
          '1A. Chest Press', '1B. Chest Fly — Repeat',
          '2A. Biceps Curl', '2B. Triceps Dips', '2C. Triceps Dips 2 — Repeat',
          '3A–3B. Triceps Press down — Repeat',
          '4A. Seated Curls', '4B. Shoulder Press — Repeat',
          '5A. Partner Push Ups — Repeat',
          '6A–6B. Lat PullDown — Repeat',
          '7A–7E. Partner Sit Ups + Bicycle — Repeat',
        ]
      },
      { label: 'C) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  22: { week: 4, type: 'cardio', sections: [{ label: 'A) WEEK 4 DAY 22 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  23: {
    week: 4, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 4 DAY 23', video: true, moves: [
          '1A. Pivot Squats', '1B. Pivot Squats with Pulse — Repeat',
          '2A. Advancing Step n Squats', '2B. Side Shuffles — Repeat',
          '3A. Torso Twist N Toss', '3B. Torso Twist — Repeat',
          '4A. Pulsing Torso Twist', '4B. Rock back Push Ups — Repeat',
          '5A–5B. Pushups — Repeat',
          '6A. Bicep Curls 7x7x7', '6B. Biceps Curl inside Grip — Repeat',
          '7A. Lateral Raises', '7B. Advanced Front Delt Raises', '7C. Shoulder Fly — Repeat',
          '8A. Leg Raises', '8B. Crossover Leg Raises — Repeat',
          '9A–9C. Bicycle variations — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 2 VIDEO ADVANCED', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  24: { week: 4, type: 'cardio', sections: [{ label: 'A) WEEK 4 DAY 24 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  25: {
    week: 4, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 4 DAY 25', video: true, moves: [
          '1A. Glute Bridge', '1B. Glute Bridge (Pulse)', '1C. Single Leg Glute Bridge — Repeat',
          '2A–2D. Hip Abduction Variations — Repeat',
          '6A. Straight Leg Crossover Kickback', '6B. Bent Knee Crossover Kickback', '6C. Right Angle Kickback — Repeat',
          '7A. Fire Hydrant — Repeat',
          '8A–8G. Core Sequence: Alternating Knee Ins, Leg Raises, Reverse Crunches, Crossover Leg Raises, Windmill, Bicycles — Repeat',
        ]
      },
      { label: 'C) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  26: { week: 4, type: 'rest', sections: [] },
  27: {
    week: 5, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 5 DAY 27', video: true, moves: [
          '1A–1C. Lat Pulldown + Seated Row — Repeat',
          '2A–2B. Shoulder Press Full / Short press — Repeat',
          '3A. Advanced Front Delt Raises', '3B–3C. Lateral Raises — Repeat',
          '4A–4B. Biceps Curls — Repeat',
          '5A–5B. Triceps Overhead press — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 2 VIDEO ADVANCED', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  28: {
    week: 5, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 5 DAY 28', video: true, moves: [
          '1A. Jumping Jacks', '1B. Criss Cross Jumping jacks — Repeat',
          '2A. Squat into Shoulder Press / Bicep curls', '2B. Shoulder Press Bicep Curl Combo — Repeat',
          '3A. Front Squat / alternating lunges', '3B. Walkout into plank', '3C. Mountain Climbers — Repeat',
          '4A. Crossover Mountain Climbers', '4B. Glute Bridge — Repeat',
          '5A–5D. Glute Bridge Circuit — Repeat',
          '6A. Fire Hydrant', '6B. Traveling Pivot Squats', '6C. Jog into Back Pedal — Repeat',
          '7A–7B. Knee Ins — Repeat',
          '8A–8E. Core: Crossover Sit-Ups, Reverse Crunches, Bicycles — Repeat',
        ]
      },
      { label: 'C) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
  29: { week: 5, type: 'cardio', sections: [{ label: 'A) WEEK 5 DAY 29 — CARDIO OR HIIT VIDEO', video: true, moves: ['Treadmill, Elliptical, Stairmaster, Exercise Bike', 'Choose HIIT Level 1, 2, 3 or 4'] }] },
  30: {
    week: 5, type: 'workout',
    sections: [
      { label: 'A) WARM-UP', moves: [] },
      {
        label: 'B) WEEK 5 DAY 30', video: true, moves: [
          '1A. Walkout into Plank Jack', '1B. Rock back Push Ups', '1C. Push Ups — Repeat',
          '2A. Dumbbell Chest Press', '2B. Dumbbell Fly — Repeat',
          '3A–3B. Bicep Curls 3x3 — Repeat',
          '4A. Shoulder Press', '4B. Lateral Raise', '4C. Advanced Front Delt Raises — Repeat',
          '5A. Bent Over Row + Back Extension', '5B–5C. Triceps Press down — Repeat',
          '6A. Seated Row', '6B. Lat Pulldown — Repeat',
        ]
      },
      { label: 'C) CORE SERIES 2 VIDEO ADVANCED', moves: ['Repeat'] },
      { label: 'D) POST WORKOUT CARDIO', moves: ['(refer to Level Key)'] },
    ]
  },
};

const typeColors = {
  workout: 'bg-sky-600',
  cardio: 'bg-green-600',
  rest: 'bg-zinc-700',
};

const typeLabels = {
  workout: 'WORKOUT',
  cardio: 'CARDIO',
  rest: 'REST DAY',
};

export default function DailyWorkoutsPage({ onNavigate, selectedDay, setSelectedDay }) {
  const day = workouts[selectedDay];
  const isRest = day?.type === 'rest';

  return (
    <div className="min-h-screen bg-white print:break-after-page">
      {/* Day selector grid */}
      <div className="bg-black px-4 py-4 print:hidden">
        <p className="text-zinc-400 text-xs tracking-widest uppercase mb-3 text-center">SELECT YOUR DAY</p>
        <div className="grid grid-cols-10 gap-1 max-w-2xl mx-auto">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
            const w = workouts[d];
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`rounded text-xs font-black py-2 transition-all ${selectedDay === d ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'} ${w ? typeColors[w.type] : 'bg-zinc-700'} text-white`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-3">
          {Object.entries(typeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-zinc-400 text-xs uppercase">{typeLabels[type]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day header */}
      <div className="flex flex-col md:flex-row">
        <div className="bg-black p-8 md:w-48 flex-shrink-0 flex flex-col items-center justify-center">
          <span className="text-zinc-500 text-sm tracking-widest uppercase">DAY</span>
          <span className="text-white font-black text-7xl leading-none">{String(selectedDay).padStart(2, '0')}</span>
          <span className={`mt-2 text-white text-xs font-bold tracking-widest px-3 py-1 rounded ${day ? typeColors[day.type] : 'bg-zinc-700'}`}>
            {day ? typeLabels[day.type] : ''}
          </span>
          {day?.week && (
            <span className="text-zinc-500 text-xs mt-2 tracking-wider">WEEK {day.week}</span>
          )}
        </div>

        <div className="flex-1">
          {isRest ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <h2 className="font-black text-7xl text-black tracking-tight uppercase">REST DAY</h2>
              <p className="text-zinc-400 text-sm">#BT30DAYCHALLENGE</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 px-8 py-8">
                {day?.sections.map((section, si) => (
                  <div key={si} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-black text-sm tracking-wider uppercase text-black">{section.label}</h3>
                      {section.video && (
                        <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">▶</span>
                        </div>
                      )}
                    </div>
                    {section.moves.length > 0 && (
                      <ul className="space-y-1.5 ml-2">
                        {section.moves.map((move, mi) => (
                          <li key={mi} className="text-sm text-zinc-700 leading-relaxed">
                            <span className={move.startsWith('Repeat') || move.startsWith('(refer') ? 'font-bold italic text-zinc-500' : ''}>{move}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <p className="font-black text-sky-500 text-sm tracking-widest mt-4">#BT30DAYCHALLENGE</p>
              </div>

              <div className="md:w-56 overflow-hidden">
                <img
                  src={BRE_IMG}
                  alt="Bre Tiesi"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-8 py-4 border-t border-zinc-200 print:hidden">
        <button
          onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
          disabled={selectedDay === 1}
          className="text-xs font-bold tracking-wider uppercase text-zinc-500 hover:text-black disabled:opacity-30 transition-colors"
        >
          ← PREV DAY
        </button>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 text-xs tracking-wider">BT30DAYCHALLENGE FT BRE TIESI</span>
          <span className="bg-black text-white font-black italic text-lg px-3 py-1">{10 + selectedDay}</span>
        </div>
        {selectedDay < 30 ? (
          <button
            onClick={() => setSelectedDay(Math.min(30, selectedDay + 1))}
            className="text-xs font-bold tracking-wider uppercase text-zinc-500 hover:text-black transition-colors"
          >
            NEXT DAY →
          </button>
        ) : (
          <button
            onClick={() => onNavigate('congrats')}
            className="text-xs font-bold tracking-wider uppercase bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-500 transition-colors"
          >
            FINISH 🎉
          </button>
        )}
      </div>
    </div>
  );
}