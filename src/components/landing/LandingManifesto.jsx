import React from 'react';
import { Image } from '@/components/ui/image';
import { BRE_IMG } from '@/data/challengeData';

const pillars = [
  { title: 'Train', desc: 'Structured programs engineered by celebrity trainers to transform your body.' },
  { title: 'Fuel', desc: 'Nutrition blueprints and hydration tracking to power every session.' },
  { title: 'Focus', desc: 'Daily affirmations and journaling to forge an unbreakable mindset.' },
  { title: 'Transform', desc: 'Track your evolution with progress metrics, photos, and achievements.' },
];

export default function LandingManifesto() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">The Philosophy</span>
            <h2 className="font-display text-4xl md:text-5xl text-white mt-3 leading-tight">
              Excellence is a daily practice.
            </h2>
            <p className="text-zinc-400 text-base mt-6 leading-relaxed max-w-lg">
              High Frequency is more than a fitness app. It's a lifestyle operating system — uniting world-class coaching, structured programs, mindful nutrition, and an elite community under one roof. Every feature is designed to keep you operating at your highest frequency.
            </p>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed max-w-lg italic">
              Featuring Bre Tiesi and the BT30™ Method — 30 days, 30 workouts, one transformation.
            </p>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border">
              <Image src={BRE_IMG} alt="High Frequency lifestyle" fittingType="fill" focalPointX={0.5} focalPointY={0.25} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
          {pillars.map((p, i) => (
            <div key={p.title} className="group relative bg-card border border-border rounded-xl p-6 hover:border-teal/40 transition-all">
              <span className="font-display text-5xl text-teal/20 absolute top-4 right-4">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-2xl text-white mb-2">{p.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}