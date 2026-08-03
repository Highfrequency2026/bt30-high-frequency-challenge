import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG } from '@/data/challengeData';

export default function LandingHero() {
  return (
    <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
      <Image src={BRE_IMG} alt="High Frequency" fittingType="fill" focalPointX={0.5} focalPointY={0.2} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      <img
        src="https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/12a4b6940_ChatGPTImageAug1202608_03_36AM.png"
        alt="BT — Bre Tiesi × High Frequency"
        className="absolute top-2 right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 z-20 w-56 h-72 md:w-72 md:h-[26rem] lg:w-96 lg:h-[33rem] object-contain object-top pointer-events-none"
        style={{ mixBlendMode: 'screen', filter: 'brightness(1.12) contrast(1.15) hue-rotate(-22deg) saturate(1.4) drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Welcome to</span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white mt-3 leading-[0.95]">
            High<br />Frequency
          </h1>
          <p className="text-base md:text-lg text-zinc-300 font-light mt-6 max-w-xl leading-relaxed">
            A premium ecosystem built to elevate your health, your mindset, your performance, and your life — through world-class coaching, transformative programs, and an elite community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/" className="group inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-10 py-4 rounded-lg hover:bg-teal/90 transition-all">
              Enter the App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/programs" className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-10 py-4 rounded-lg hover:bg-white/5 transition-all">
              Explore Programs
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 animate-pulse">
        <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Scroll</span>
        <ChevronDown className="w-4 h-4 text-zinc-500" />
      </div>
    </section>
  );
}