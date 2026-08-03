import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG } from '@/data/challengeData';

export default function LandingCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <Image src={BRE_IMG} alt="BT30™" fittingType="fill" focalPointX={0.5} focalPointY={0.3} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-40">
        <div className="max-w-xl">
          <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-teal font-bold border border-teal/40 px-3 py-1.5 rounded-full mb-6">
            Featured Program
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-white leading-[0.95]">BT30™</h2>
          <p className="text-lg text-platinum font-light italic mt-2">The High Frequency Method — Featuring Bre Tiesi</p>
          <p className="text-zinc-300 text-base mt-6 max-w-md leading-relaxed">
            30 days. 30 workouts. One transformation. Begin the flagship program that started it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/programs/bt30" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-10 py-4 rounded-lg hover:bg-teal/90 transition-all">
              <Play className="w-4 h-4 fill-white" />
              Start BT30™
            </Link>
            <Link to="/" className="group inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-10 py-4 rounded-lg hover:bg-white/5 transition-all">
              Enter the App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}