import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, Calendar, Clock, Users, Check, X, Loader2 } from 'lucide-react';

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
  const [activeReplay, setActiveReplay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const openReplay = (replay) => {
    setActiveReplay(replay);
    setLoading(true);
    setIsPlaying(false);
    setProgress(0);
  };

  const closeReplay = () => {
    setActiveReplay(null);
    setLoading(false);
    setIsPlaying(false);
    setProgress(0);
  };

  // Simulate buffer/load, then auto-play
  useEffect(() => {
    if (!activeReplay || !loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      setIsPlaying(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeReplay, loading]);

  // Simulated playback progress
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 100 : p + 0.5);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

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
          <button
            key={i}
            onClick={() => openReplay(replay)}
            className="group w-full text-left bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer"
          >
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
          </button>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeReplay && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeReplay}
        >
          <div
            className="w-full max-w-3xl bg-card border border-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-black" />

              {loading ? (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-teal animate-spin" />
                  <p className="text-xs text-zinc-400 tracking-wide">Loading replay...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-20 h-20 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center hover:bg-teal/30 hover:scale-105 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    )}
                  </button>
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Radio className="w-32 h-32 text-teal/5" />
                    </div>
                  )}
                </>
              )}

              <button
                onClick={closeReplay}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 border border-border flex items-center justify-center hover:bg-black/70 transition-colors z-20"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {!loading && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-white/60 font-medium">{activeReplay.duration}</span>
                  </div>
                </div>
              )}
            </div>
            {/* Info Bar */}
            <div className="p-5">
              <h3 className="font-bold text-white text-lg">{activeReplay.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{activeReplay.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activeReplay.duration}</span>
                <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5" />Recorded Session</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}