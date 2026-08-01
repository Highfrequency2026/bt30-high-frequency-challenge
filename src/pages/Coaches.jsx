import React from 'react';
import { Instagram, Award, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { coaches } from '@/data/challengeData';

export default function Coaches() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">The Team</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Coaches</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Train with the best. Our coaches are here to guide your transformation every step of the way.</p>
      </div>

      <div className="space-y-6">
        {coaches.map(coach => (
          <div key={coach.id} className="group grid grid-cols-1 md:grid-cols-3 gap-0 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
            {/* Image */}
            <div className="relative h-72 md:h-full overflow-hidden">
              <Image src={coach.image} alt={coach.name} fittingType="fill" focalPointX={0.5} focalPointY={0.18} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 md:bg-gradient-to-r" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent md:bg-none" />
            </div>

            {/* Content */}
            <div className="md:col-span-2 p-8 flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold mb-2">{coach.role}</span>
              <h2 className="font-display text-3xl md:text-4xl text-white mb-2">{coach.name}</h2>
              <p className="text-sm text-platinum italic mb-4 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" /> {coach.handle}
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-lg">{coach.bio}</p>

              <div className="flex flex-wrap gap-2">
                {coach.specialties.map(spec => (
                  <span key={spec} className="text-[10px] tracking-wide text-zinc-300 bg-muted/30 border border-border px-3 py-1.5 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-6">
                <button className="inline-flex items-center gap-2 bg-teal text-white font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-teal/90 transition-all">
                  View Programs <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="inline-flex items-center gap-2 border border-platinum/30 text-platinum font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-white/5 transition-all">
                  Follow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Future Coaches */}
      <div className="mt-12">
        <h3 className="font-display text-2xl text-white mb-5">Coming Soon</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Nick Cannon', 'Hovik', 'More to Come'].map(name => (
            <div key={name} className="bg-muted/10 border border-dashed border-border rounded-xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-muted/20 mx-auto mb-3 flex items-center justify-center">
                <Award className="w-6 h-6 text-zinc-700" />
              </div>
              <p className="text-sm font-bold text-zinc-500">{name}</p>
              <p className="text-[10px] text-zinc-600 mt-1 tracking-wide uppercase">Coming Soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}