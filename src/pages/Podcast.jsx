import React, { useState } from 'react';
import { Play, Pause, Mic, Clock, ChevronRight } from 'lucide-react';

const episodes = [
  { id: 1, title: 'Operating at a Higher Frequency', desc: 'Mike T breaks down the philosophy behind High Frequency and why mindset matters more than mechanics.', duration: '42 min', date: 'Aug 1', category: 'Philosophy', featured: true },
  { id: 2, title: 'Bre Tiesi on Discipline & Motherhood', desc: 'How Bre balances fitness, business, and being a mom while staying in peak shape.', duration: '38 min', date: 'Jul 28', category: 'Interview' },
  { id: 3, title: 'The Science of HIIT', desc: 'Understanding high-intensity interval training and why it works for fat loss.', duration: '29 min', date: 'Jul 25', category: 'Education' },
  { id: 4, title: 'Nutrition Myths Debunked', desc: 'Common nutrition myths and what actually works for body transformation.', duration: '35 min', date: 'Jul 21', category: 'Education' },
  { id: 5, title: 'Building Unbreakable Habits', desc: 'The psychology of habit formation and how to make fitness automatic.', duration: '31 min', date: 'Jul 18', category: 'Mindset' },
  { id: 6, title: 'Recovery & Sleep Optimization', desc: 'Why rest is your secret weapon for transformation.', duration: '27 min', date: 'Jul 14', category: 'Wellness' },
];

const categories = ['All', 'Philosophy', 'Interview', 'Education', 'Mindset', 'Wellness'];

export default function Podcast() {
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? episodes : episodes.filter(e => e.category === filter);
  const featured = episodes.find(e => e.featured);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Listen</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">High Frequency Podcast</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Conversations on fitness, mindset, business, and operating at your highest level.</p>
      </div>

      {/* Featured Episode */}
      <div className="relative bg-gradient-to-br from-teal/15 via-card to-card border border-teal/20 rounded-2xl p-8 md:p-10 mb-8 overflow-hidden">
        <div className="absolute top-6 right-6">
          <Mic className="w-12 h-12 text-teal/20" />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold mb-3 block">Featured Episode</span>
        <h2 className="font-display text-3xl md:text-4xl text-white mb-3 leading-tight">{featured.title}</h2>
        <p className="text-sm text-zinc-300 max-w-xl mb-6 leading-relaxed">{featured.desc}</p>
        <div className="flex items-center gap-4 mb-6 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal" />{featured.duration}</span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span>{featured.date}</span>
          <span className="w-1 h-1 bg-zinc-600 rounded-full" />
          <span>{featured.category}</span>
        </div>
        <button
          onClick={() => setPlaying(playing === featured.id ? null : featured.id)}
          className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-teal/90 transition-all"
        >
          {playing === featured.id ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Play Episode</>}
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
              filter === cat ? 'bg-teal text-white' : 'bg-card text-zinc-400 border border-border hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Episode List */}
      <div className="space-y-3">
        {filtered.filter(e => !e.featured).map(ep => (
          <div key={ep.id} className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
            <button
              onClick={() => setPlaying(playing === ep.id ? null : ep.id)}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center hover:bg-teal hover:border-teal transition-all"
            >
              {playing === ep.id ? <Pause className="w-4 h-4 text-teal group-hover:text-white" /> : <Play className="w-4 h-4 fill-teal text-teal group-hover:fill-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] tracking-widest uppercase text-teal font-bold">{ep.category}</span>
              <h3 className="font-bold text-white text-sm truncate">{ep.title}</h3>
              <p className="text-xs text-zinc-500 truncate">{ep.desc}</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-zinc-500 flex-shrink-0">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ep.duration}</span>
              <span>{ep.date}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-teal transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}