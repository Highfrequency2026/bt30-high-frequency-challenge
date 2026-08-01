import React from 'react';
import { TrendingUp, Scale, Camera, Award, Flame, Target } from 'lucide-react';

const stats = [
  { label: 'Current Weight', value: '—', unit: 'lbs', icon: Scale, change: '' },
  { label: 'Workout Streak', value: '1', unit: 'days', icon: Flame, change: '+1' },
  { label: 'Workouts Done', value: '0', unit: '/ 30', icon: TrendingUp, change: '' },
  { label: 'Achievements', value: '0', unit: 'badges', icon: Award, change: '' },
];

const measurements = [
  { label: 'Chest', value: '—' },
  { label: 'Waist', value: '—' },
  { label: 'Hips', value: '—' },
  { label: 'Right Arm', value: '—' },
  { label: 'Left Arm', value: '—' },
  { label: 'Right Thigh', value: '—' },
  { label: 'Left Thigh', value: '—' },
  { label: 'Body Fat %', value: '—' },
];

export default function Progress() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Your Journey</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Progress</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Track every step of your transformation. What gets measured gets improved.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-teal" />
                {stat.change && <span className="text-[10px] text-teal font-bold">{stat.change}</span>}
              </div>
              <p className="text-3xl font-bold text-white leading-none">
                {stat.value}<span className="text-sm text-zinc-500 ml-1">{stat.unit}</span>
              </p>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mt-2">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress Chart Placeholder */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Weight Trend</h3>
            <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">30 Days</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-teal/40 to-teal/80 rounded-t hover:from-teal/60 hover:to-teal transition-colors"
                style={{ height: `${20 + Math.random() * 60}%`, opacity: i < 1 ? 1 : 0.3 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-zinc-600">
            <span>Day 1</span>
            <span>Day 15</span>
            <span>Day 30</span>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Measurements</h3>
          <div className="grid grid-cols-2 gap-3">
            {measurements.map(m => (
              <div key={m.label} className="flex items-center justify-between bg-muted/20 rounded-lg px-4 py-2.5">
                <span className="text-xs text-zinc-400">{m.label}</span>
                <span className="text-sm font-bold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Photos */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Camera className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Progress Photos</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Before', 'Week 2', 'After'].map(label => (
            <div key={label} className="aspect-[3/4] bg-muted/20 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-teal/40 transition-colors cursor-pointer">
              <Camera className="w-6 h-6 text-zinc-700" />
              <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Step', desc: 'Complete Day 1', unlocked: false },
            { name: 'Week Warrior', desc: 'Finish Week 1', unlocked: false },
            { name: 'Halfway Hero', desc: 'Reach Day 15', unlocked: false },
            { name: 'BT30 Champion', desc: 'Complete all 30 days', unlocked: false },
          ].map(ach => (
            <div key={ach.name} className={`text-center p-4 rounded-xl border transition-all ${ach.unlocked ? 'border-teal/40 bg-teal/5' : 'border-border bg-muted/10'}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${ach.unlocked ? 'bg-teal' : 'bg-muted/30'}`}>
                <Award className={`w-5 h-5 ${ach.unlocked ? 'text-white' : 'text-zinc-700'}`} />
              </div>
              <p className={`text-xs font-bold ${ach.unlocked ? 'text-white' : 'text-zinc-600'}`}>{ach.name}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}