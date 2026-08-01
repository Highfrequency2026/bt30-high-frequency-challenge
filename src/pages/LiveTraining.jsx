import React, { useState } from 'react';
import { Radio, Play, Calendar, Clock, Users, Check } from 'lucide-react';

const liveClasses = [
  { day: 'Mon', date: 'Aug 4', time: '6:00 AM PST', title: 'Lower Body Burn with Mike T', duration: '45 min', spots: 50, filled: 32 },
  { day: 'Wed', date: 'Aug 6', time: '6:00 AM PST', title: 'HIIT Cardio with Bre Tiesi', duration: '30 min', spots: 50, filled: 41 },
  { day: 'Fri', date: 'Aug 8', time: '6:00 AM PST', title: 'Full Body Conditioning', duration: '50 min', spots: 50, filled: 28 },
  { day: 'Sat', date: 'Aug 9', time: '8:00 AM PST', title: 'Weekend Warrior Challenge', duration: '60 min', spots: 100, filled: 67 },
];

const replays = [
  { title: 'Core Destroyer — July Session', duration: '35 min', date: 'Jul 24' },
  { title: 'Glute Activation Masterclass', duration: '28 min', date: 'Jul 20' },
  { title: 'Upper Body Power Hour', duration: '45 min', date: 'Jul 17' },
  { title: 'Stair Climber Inferno', duration: '30 min', date: 'Jul 13' },
  { title: 'Mobility & Recovery Flow', duration: '25 min', date: 'Jul 10' },
  { title: 'Advanced HIIT Finale', duration: '40 min', date: 'Jul 6' },
];

export default function LiveTraining() {
  const [reserved, setReserved] = useState({});

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Train Live</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Live Training</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Join Mike T and Bre Tiesi for live workouts. Reserve your spot and train in real time.</p>
      </div>

      {/* Live Now Banner */}
      <div className="bg-gradient-to-r from-teal/15 to-transparent border border-teal/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 bg-teal rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-teal rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="font-bold text-white">Next Live Session</h3>
            <p className="text-sm text-zinc-400">Lower Body Burn with Mike T — Monday, Aug 4 at 6:00 AM PST</p>
          </div>
        </div>
        <button className="bg-teal text-white font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-teal/90 transition-all">
          Set Reminder
        </button>
      </div>

      {/* Upcoming Schedule */}
      <h2 className="font-display text-2xl text-white mb-4">Upcoming Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {liveClasses.map((cls, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 text-center bg-muted/30 rounded-lg py-2">
                <p className="text-[10px] tracking-widest uppercase text-teal font-bold">{cls.day}</p>
                <p className="text-xl font-bold text-white leading-none mt-0.5">{cls.date.split(' ')[1]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm">{cls.title}</h3>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cls.time}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{cls.duration}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Users className="w-3 h-3" />{cls.filled}/{cls.spots} reserved</span>
                    <span className="text-[10px] text-teal font-bold">{cls.spots - cls.filled} spots left</span>
                  </div>
                  <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: `${(cls.filled / cls.spots) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setReserved({ ...reserved, [i]: !reserved[i] })}
              className={`w-full mt-4 flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase py-2.5 rounded-lg transition-all ${
                reserved[i] ? 'bg-teal text-white' : 'border border-platinum/30 text-platinum hover:bg-white/5'
              }`}
            >
              {reserved[i] ? <><Check className="w-3.5 h-3.5" /> Spot Reserved</> : 'Reserve Spot'}
            </button>
          </div>
        ))}
      </div>

      {/* Replay Library */}
      <h2 className="font-display text-2xl text-white mb-4">Replay Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {replays.map((replay, i) => (
          <div key={i} className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center group-hover:bg-teal group-hover:border-teal transition-all">
                <Play className="w-4 h-4 fill-teal text-teal group-hover:fill-white group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm leading-snug">{replay.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{replay.duration}</span>
                  <span>{replay.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}