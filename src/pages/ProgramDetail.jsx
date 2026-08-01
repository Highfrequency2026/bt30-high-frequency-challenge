import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Dumbbell, Clock, TrendingUp, ChevronRight, Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG, workoutDays, equipment, fitnessLevels } from '@/data/challengeData';

const weekLabels = ['Week One', 'Week Two', 'Week Three', 'Week Four', 'Final Week'];

export default function ProgramDetail() {
  const { programId } = useParams();
  const [activeWeek, setActiveWeek] = useState(1);
  const [tab, setTab] = useState('workouts');

  const weekDays = workoutDays.filter(d => d.week === activeWeek);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden">
        <Image src={BRE_IMG} alt="BT30" fittingType="fill" focalPointY={0.25} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <Link to="/programs" className="text-xs text-zinc-400 hover:text-teal transition-colors mb-3 inline-flex items-center gap-1">
            ← Programs
          </Link>
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-teal font-bold border border-teal/40 px-3 py-1.5 rounded-full mb-3">
            Featured Program
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-2">BT30™</h1>
          <p className="text-lg text-platinum font-light italic mb-3">The High Frequency Method</p>
          <p className="text-sm text-zinc-300 max-w-lg">Featuring <span className="font-semibold text-white">Bre Tiesi</span> — 30 days of structured training with celebrity trainer Mike T.</p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal" />30 Days</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-teal" />All Levels</span>
            <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-teal" />30 Workouts</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {[
              { key: 'workouts', label: 'Workouts' },
              { key: 'equipment', label: 'Equipment' },
              { key: 'levels', label: 'Fitness Key' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key ? 'text-teal border-teal' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {tab === 'workouts' && (
          <>
            {/* Week selector */}
            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
              {[1, 2, 3, 4, 5].map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWeek(w)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeWeek === w ? 'bg-teal text-white' : 'bg-card text-zinc-400 border border-border hover:text-white'
                  }`}
                >
                  {weekLabels[w - 1]}
                </button>
              ))}
            </div>

            {/* Day cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekDays.map(day => {
                const typeColor = day.type === 'rest' ? 'border-l-zinc-600' : day.type === 'cardio' ? 'border-l-green-500' : 'border-l-teal';
                const typeLabel = day.type === 'rest' ? 'Rest' : day.type === 'cardio' ? 'Cardio' : 'Strength';
                return (
                  <Link
                    key={day.day}
                    to={`/workout/${day.day}`}
                    className={`group flex items-center gap-4 bg-card border border-border ${typeColor} border-l-4 rounded-xl p-5 hover:border-primary/40 transition-all`}
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-muted/30 flex items-center justify-center">
                      <span className="font-display text-2xl text-white">{String(day.day).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] tracking-widest uppercase text-zinc-500 font-bold">{typeLabel}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm truncate">{day.title}</h3>
                      <p className="text-xs text-zinc-500 truncate">{day.focus} · {day.duration}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-teal group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {tab === 'equipment' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipment.map(item => (
              <div key={item.name} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="text-3xl text-teal mb-3">{item.icon}</div>
                <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'levels' && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 mb-6">Choose the level that matches your current fitness. Progress at your own pace.</p>
            {fitnessLevels.map(level => (
              <div key={level.level} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/30 px-6 py-3 border-b border-border">
                  <h4 className="font-display text-xl text-white">{level.level}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">Strength</p>
                    <p className="text-sm text-white">{level.sets} · {level.reps}</p>
                    <p className="text-xs text-zinc-500">{level.weight}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">Cardio</p>
                    <p className="text-sm text-white">{level.cardio}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">HIIT & Core</p>
                    <p className="text-sm text-white">{level.hiit}</p>
                    <p className="text-xs text-zinc-500">{level.core}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}