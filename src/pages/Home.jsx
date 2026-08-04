import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, TrendingUp, Droplet, ChevronRight, Dumbbell, Brain, Award, MessageCircle, Mic, Radio, Users, ShoppingBag, ArrowRight, Bot } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG, workoutDays } from '@/data/challengeData';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';

const HF_LOGO = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/dfd8f711f_ChatGPTImageJun30202601_30_25PM.png";

const BT_COLLAB_LOGO = "https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/12a4b6940_ChatGPTImageAug1202608_03_36AM.png";

export default function Home() {
  const { completedCount, isCompleted } = useWorkoutProgress();
  const todayWorkout = workoutDays.find(d => !isCompleted(d.day)) || workoutDays[0];
  const currentDay = completedCount + 1;

  return (
    <div className="animate-fade-in">
      {/* ===== HERO — High Frequency Brand ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background: dark with subtle teal radial glow */}
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(69, 177, 179, 0.10) 0%, transparent 70%)' }}
        />
        {/* Subtle bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-20 pb-12">
          {/* HF Logo — the hero centerpiece (black bg blends to transparent via screen mode) */}
          <img
            src={HF_LOGO}
            alt="High Frequency — Private Fitness Club"
            className="w-80 md:w-[30rem] lg:w-[40rem] h-auto mb-8 object-contain"
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 50px rgba(69, 179, 179, 0.3))' }}
          />

          <p className="text-sm md:text-base text-zinc-400 font-light max-w-xl leading-relaxed mb-2">
            A premium ecosystem built to elevate your health, your mindset, your performance, and your life.
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold mb-8">
            World-Class Coaching · Transformative Programs · Elite Community
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/programs" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
              Explore Programs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/programs/bt30" className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-white/5 transition-all">
              <Play className="w-4 h-4 fill-teal text-teal" />
              Start BT30™
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-pulse">
          <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
        </div>
      </section>

      {/* ===== BT30 — Featured Product (Bre Tiesi × High Frequency) ===== */}
      <section className="relative overflow-hidden border-t border-border">
        {/* Bre Tiesi background image */}
        <Image src={BRE_IMG} alt="Bre Tiesi" fittingType="fill" focalPointX={0.55} focalPointY={0.2} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />

        {/* BT Collaboration Logo — top right of this section */}
        <img
          src={BT_COLLAB_LOGO}
          alt="Bre Tiesi × High Frequency — BT30"
          className="absolute top-4 right-4 md:top-6 md:right-8 z-10 w-40 md:w-52 lg:w-60 h-auto object-contain pointer-events-none"
          style={{ filter: 'brightness(1.1) contrast(1.1) drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 min-h-[600px] flex items-center">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] tracking-[0.3em] uppercase text-teal font-bold bg-teal/10 px-3 py-1 rounded-full">Featured Program</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-2">BT30™</h2>
            <p className="text-sm text-platinum italic mb-4">The High Frequency Method — Featuring Bre Tiesi</p>
            <p className="text-sm md:text-base text-zinc-300 font-light mb-6 leading-relaxed">
              30 days. 30 workouts. One transformation. Train alongside Bre Tiesi with the flagship High Frequency program designed to reshape your body and elevate your mindset in just one month.
            </p>
            <div className="flex flex-wrap gap-4 mb-6 text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300"><Dumbbell className="w-3.5 h-3.5 text-teal" />30 Workouts</span>
              <span className="flex items-center gap-1.5 text-zinc-300"><Flame className="w-3.5 h-3.5 text-teal" />4 Weeks</span>
              <span className="flex items-center gap-1.5 text-zinc-300"><TrendingUp className="w-3.5 h-3.5 text-teal" />All Levels</span>
            </div>
            <Link to="/programs/bt30" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
              <Play className="w-4 h-4 fill-white" />
              {completedCount > 0 ? `Continue — Day ${currentDay}` : 'Start the Challenge'}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Today's Workout Quick Access ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Today</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-1">Your Daily Focus</h2>
          </div>
          <span className="text-sm text-zinc-500">Day {currentDay} of 30</span>
        </div>

        <Link to={`/workout/${todayWorkout.day}`} className="group block relative overflow-hidden rounded-2xl border border-border bg-card mb-8 hover:border-primary/40 transition-all">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
              <Image src="https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/3e63c1b5c_images-1.jpeg" alt={todayWorkout.title} fittingType="fit" focalPointY={0.2} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
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

        {/* Quick Access + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Day Streak', value: completedCount > 0 ? String(completedCount) : '0', icon: Flame },
            { label: 'Workouts Done', value: String(completedCount), icon: Dumbbell },
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

      {/* ===== The Ecosystem ===== */}
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
              { label: 'HF AI Trainer', icon: Bot, to: '/hf-ai' },
              { label: 'Nutrition', icon: Droplet, to: '/nutrition' },
              { label: 'Mindset', icon: Brain, to: '/mindset' },
              { label: 'Progress', icon: TrendingUp, to: '/progress' },
              { label: 'Community', icon: MessageCircle, to: '/community' },
              { label: 'Podcast', icon: Mic, to: '/podcast' },
              { label: 'Live Training', icon: Radio, to: '/live' },
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

          {/* All Programs */}
          <div className="text-center mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Programs</span>
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