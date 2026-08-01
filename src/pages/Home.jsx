import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, TrendingUp, Droplet, ChevronRight, Dumbbell, Brain, Award, MessageCircle, Mic, Radio, Calendar, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG, HF_LOGO, workoutDays } from '@/data/challengeData';

export default function Home() {
  const todayWorkout = workoutDays[0];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <Image src={BRE_IMG} alt="Bre Tiesi" fittingType="fill" focalPointX={0.55} focalPointY={0.22} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/30" />

        {/* Logo — top-right, fully visible, transparent background via blend mode */}
        <img
          src={HF_LOGO}
          alt="High Frequency — Digital Media"
          className="absolute top-3 right-6 md:top-5 md:right-12 z-20 w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain pointer-events-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          style={{ filter: 'invert(1) brightness(1.3) contrast(1.1)', mixBlendMode: 'screen', opacity: 1 }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-16">
          <div className="max-w-2xl">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-teal font-bold mb-3 border border-teal/40 px-3 py-1.5 rounded-full">
              Premium Fitness & Wellness Platform
            </span>
            <p className="text-sm md:text-base text-zinc-300 font-light mb-4 max-w-lg leading-relaxed">
              The operating system for your transformation. Workouts, nutrition, mindset, coaching, and community — all in one premium platform.
            </p>
            <div className="border border-teal/20 bg-teal/5 rounded-xl p-4 mb-4 max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] tracking-[0.3em] uppercase text-teal font-bold bg-teal/10 px-2 py-0.5 rounded-full">Featured Product</span>
                <span className="text-zinc-600 text-xs">•</span>
                <span className="text-xs text-zinc-400">Featuring Bre Tiesi</span>
              </div>
              <h3 className="font-display text-2xl text-white mb-1">BT30™ — The High Frequency Method</h3>
              <p className="text-xs text-zinc-400">30 days. 30 workouts. One transformation.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/programs/bt30" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
                <Play className="w-4 h-4 fill-white" />
                Start BT30™
              </Link>
              <Link to="/programs" className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-white/5 transition-all">
                Explore Platform
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

      {/* High Frequency Ecosystem */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">The Ecosystem</span>
            <h2 className="font-display text-3xl md:text-5xl text-white mt-2 mb-3">One Platform. Total Transformation.</h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">High Frequency brings together every element of your fitness journey — from workouts and nutrition to mindset, coaching, and community.</p>
          </div>

          {/* Platform Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
            {[
              { label: 'Programs', icon: Dumbbell, to: '/programs' },
              { label: 'Nutrition', icon: Droplet, to: '/nutrition' },
              { label: 'Mindset', icon: Brain, to: '/mindset' },
              { label: 'Progress', icon: TrendingUp, to: '/progress' },
              { label: 'Community', icon: MessageCircle, to: '/community' },
              { label: 'Podcast', icon: Mic, to: '/podcast' },
              { label: 'Live Training', icon: Radio, to: '/live' },
              { label: 'Events', icon: Calendar, to: '/events' },
              { label: 'Coaches', icon: Users, to: '/coaches' },
              { label: 'Store', icon: ShoppingBag, to: '/store' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.to} className="group flex flex-col items-center gap-3 bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
                  <Icon className="w-6 h-6 text-teal group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-white">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Featured Products */}
          <div className="text-center mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Products</span>
            <h3 className="font-display text-2xl text-white mt-1">High Frequency Programs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/programs/bt30" className="group relative overflow-hidden rounded-xl border border-teal/30 bg-teal/5 p-6 hover:border-teal/50 transition-all">
              <span className="inline-block text-[9px] tracking-widest uppercase text-teal font-bold bg-teal/10 px-2 py-0.5 rounded-full mb-3">Active Now</span>
              <h4 className="font-display text-2xl text-white mb-1">BT30™</h4>
              <p className="text-xs text-platinum italic mb-2">Featuring Bre Tiesi</p>
              <p className="text-xs text-zinc-400 mb-4">30 days. 30 workouts. The flagship High Frequency program.</p>
              <span className="text-xs font-bold text-teal flex items-center gap-1 group-hover:gap-2 transition-all">Start Now <ArrowRight className="w-3 h-3" /></span>
            </Link>
            {[
              { name: 'BT60™', sub: 'Full Transformation', desc: '60 days to a complete body and mind transformation.' },
              { name: 'Glute Builder', sub: 'Sculpt & Shape', desc: 'Targeted glute and lower body sculpting program.' },
            ].map(prog => (
              <div key={prog.name} className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
                <span className="inline-block text-[9px] tracking-widest uppercase text-zinc-500 font-bold bg-muted/30 px-2 py-0.5 rounded-full mb-3">Coming Soon</span>
                <h4 className="font-display text-2xl text-zinc-400 mb-1">{prog.name}</h4>
                <p className="text-xs text-zinc-500 italic mb-2">{prog.sub}</p>
                <p className="text-xs text-zinc-600">{prog.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}