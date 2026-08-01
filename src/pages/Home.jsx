import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, TrendingUp, Droplet, ChevronRight, Dumbbell, Brain, Award } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG, workoutDays } from '@/data/challengeData';

export default function Home() {
  const todayWorkout = workoutDays[0];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image src={BRE_IMG} alt="Bre Tiesi" fittingType="fill" focalPointY={0.3} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-teal font-bold mb-4 border border-teal/40 px-3 py-1.5 rounded-full">
              BT30™ Founders Edition
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-6">
              The High<br />Frequency<br /><span className="italic text-platinum">Method</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-light mb-2 tracking-wide">
              Featuring <span className="font-semibold text-white">Bre Tiesi</span>
            </p>
            <p className="text-sm text-zinc-400 mb-8 max-w-md leading-relaxed">
              30 days. 30 workouts. One transformation. Train with celebrity trainer Mike T and Bre Tiesi to operate at your highest frequency.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/programs/bt30" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
                <Play className="w-4 h-4 fill-white" />
                Start BT30™
              </Link>
              <Link to="/programs" className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-white/5 transition-all">
                Explore Programs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-pulse">
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
        </div>
      </section>

      {/* Dashboard */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Today</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-1">Your Daily Focus</h2>
          </div>
          <span className="text-sm text-zinc-500">Day 1 of 30</span>
        </div>

        {/* Today's Workout Card */}
        <Link to={`/workout/${todayWorkout.day}`} className="group block relative overflow-hidden rounded-2xl border border-border bg-card mb-8 hover:border-primary/40 transition-all">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
              <Image src={BRE_IMG} alt={todayWorkout.title} fittingType="fill" focalPointY={0.3} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 md:bg-gradient-to-r" />
            </div>
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Today's Workout</span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400">Week {todayWorkout.week} · Day {todayWorkout.day}</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-white mb-2">{todayWorkout.title}</h3>
              <p className="text-sm text-zinc-400 mb-6 max-w-md">{todayWorkout.description}</p>
              <div className="flex flex-wrap gap-4 mb-6 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-300"><Dumbbell className="w-3.5 h-3.5 text-teal" />{todayWorkout.focus}</span>
                <span className="flex items-center gap-1.5 text-zinc-300"><Flame className="w-3.5 h-3.5 text-teal" />{todayWorkout.duration}</span>
                <span className="flex items-center gap-1.5 text-zinc-300"><TrendingUp className="w-3.5 h-3.5 text-teal" />{todayWorkout.difficulty}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-teal group-hover:gap-3 transition-all">
                <Play className="w-4 h-4 fill-teal text-teal" /> Start Workout
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/nutrition" className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-all">
            <Droplet className="w-6 h-6 text-teal mb-4" />
            <h4 className="font-bold text-white mb-1">Nutrition</h4>
            <p className="text-xs text-zinc-500 mb-3">Today's meal plan & hydration</p>
            <span className="text-xs text-teal font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Blueprint <ChevronRight className="w-3 h-3" /></span>
          </Link>
          <Link to="/mindset" className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-all">
            <Brain className="w-6 h-6 text-teal mb-4" />
            <h4 className="font-bold text-white mb-1">Mindset</h4>
            <p className="text-xs text-zinc-500 mb-3">Daily affirmation & journal</p>
            <span className="text-xs text-teal font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Today's Focus <ChevronRight className="w-3 h-3" /></span>
          </Link>
          <Link to="/progress" className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-all">
            <TrendingUp className="w-6 h-6 text-teal mb-4" />
            <h4 className="font-bold text-white mb-1">Progress</h4>
            <p className="text-xs text-zinc-500 mb-3">Track your transformation</p>
            <span className="text-xs text-teal font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Stats <ChevronRight className="w-3 h-3" /></span>
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Day Streak', value: '1', icon: Flame },
            { label: 'Workouts Done', value: '0', icon: Dumbbell },
            { label: 'Water Today', value: '0%', icon: Droplet },
            { label: 'Achievements', value: '0', icon: Award },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3 bg-muted/30 border border-border rounded-lg p-4">
                <Icon className="w-5 h-5 text-teal flex-shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-white leading-none">{stat.value}</p>
                  <p className="text-[10px] text-zinc-500 tracking-wide uppercase mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}