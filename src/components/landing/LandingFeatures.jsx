import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Droplet, Brain, TrendingUp, MessageCircle, Mic, Radio, Calendar, Users, ShoppingBag, ArrowRight } from 'lucide-react';

const features = [
  { label: 'Programs', desc: 'Structured transformations', icon: Dumbbell, to: '/programs' },
  { label: 'Nutrition', desc: 'Meal plans & hydration', icon: Droplet, to: '/nutrition' },
  { label: 'Mindset', desc: 'Affirmations & journaling', icon: Brain, to: '/mindset' },
  { label: 'Progress', desc: 'Track your evolution', icon: TrendingUp, to: '/progress' },
  { label: 'Community', desc: 'Connect & compete', icon: MessageCircle, to: '/community' },
  { label: 'Podcast', desc: 'High Frequency audio', icon: Mic, to: '/podcast' },
  { label: 'Live Training', desc: 'Real-time sessions', icon: Radio, to: '/live' },
  { label: 'Events', desc: 'Retreats & workshops', icon: Calendar, to: '/events' },
  { label: 'Coaches', desc: 'Elite trainers', icon: Users, to: '/coaches' },
  { label: 'Store', desc: 'Premium gear', icon: ShoppingBag, to: '/store' },
];

export default function LandingFeatures() {
  return (
    <section className="relative border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">The Ecosystem</span>
          <h2 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">One Platform. Total Transformation.</h2>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto">
            Step inside the app and discover everything you need to elevate every dimension of your fitness journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} className="group flex flex-col items-center gap-3 bg-card border border-border rounded-xl p-6 hover:border-teal/40 hover:bg-teal/5 transition-all">
                <Icon className="w-7 h-7 text-teal group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <span className="block text-sm font-bold text-white">{item.label}</span>
                  <span className="block text-[10px] text-zinc-500 mt-1">{item.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:gap-3 transition-all">
            Enter the full experience <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}