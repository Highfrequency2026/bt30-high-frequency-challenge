import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { programs } from '@/data/challengeData';

export default function Programs() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">High Frequency</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Programs</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Transform your body and mind with programs designed by celebrity trainer Mike T and the High Frequency team.</p>
      </div>

      {/* Featured Program */}
      {programs.filter(p => p.status === 'active').map(prog => (
        <Link key={prog.id} to={`/programs/${prog.id}`} className="group block relative overflow-hidden rounded-2xl border border-border mb-8 hover:border-primary/40 transition-all">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image src={prog.image} alt={prog.title} fittingType="fill" focalPointY={0.3} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-teal font-bold border border-teal/40 px-3 py-1.5 rounded-full mb-4">
              {prog.tag}
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-2">{prog.title}</h2>
            <p className="text-lg text-platinum font-light italic mb-2">{prog.subtitle}</p>
            <p className="text-sm text-zinc-400 mb-4 max-w-md">Featuring <span className="text-white font-semibold">{prog.featured}</span> — {prog.description}</p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 mb-6">
              <span>{prog.duration}</span>
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              <span>{prog.level}</span>
            </div>
            <span className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg group-hover:gap-3 transition-all">
              Start Program <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}

      {/* Coming Soon Grid */}
      <h3 className="font-display text-2xl text-white mb-5 mt-12">More Programs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.filter(p => p.status === 'coming-soon').map(prog => (
          <div key={prog.id} className="group relative overflow-hidden rounded-xl border border-border bg-card cursor-default">
            <div className="relative h-56 overflow-hidden">
              <Image src={prog.image} alt={prog.title} fittingType="fill" className="w-full h-full opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span className="text-[9px] tracking-widest uppercase text-zinc-400 font-bold">Coming Soon</span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-display text-xl text-white mb-1">{prog.title}</h4>
              <p className="text-xs text-platinum italic mb-2">{prog.subtitle}</p>
              <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{prog.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-zinc-600 tracking-wide">
                <span>{prog.duration}</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                <span>{prog.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}