import React from 'react';
import { MapPin, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

const events = [
  {
    title: 'High Frequency Retreat',
    location: 'Malibu, CA',
    date: 'Oct 10–12, 2026',
    desc: '3-day luxury fitness retreat with Mike T, Bre Tiesi, and the High Frequency team. Daily workouts, nutrition workshops, mindset sessions, and recovery.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80',
    tag: 'FLAGSHIP',
    price: 'From $2,500',
  },
  {
    title: 'BT30 Live Workshop',
    location: 'Los Angeles, CA',
    date: 'Sep 15, 2026',
    desc: 'Half-day intensive workshop covering the BT30 method, form correction, and nutrition planning with Mike T.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    tag: 'WORKSHOP',
    price: 'From $250',
  },
  {
    title: 'Community Meetup',
    location: 'Virtual',
    date: 'Aug 20, 2026',
    desc: 'Monthly virtual meetup with the High Frequency community. Share progress, ask questions, and connect with fellow members.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    tag: 'FREE',
    price: 'Free',
  },
  {
    title: 'Gym Grand Opening',
    location: 'West Hollywood, CA',
    date: 'Nov 2026',
    desc: 'Join us for the grand opening of the first High Frequency Private Fitness Club. Exclusive workouts, demos, and celebration.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    tag: 'EVENT',
    price: 'Invite Only',
  },
];

export default function Events() {
  const [featured, ...rest] = events;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Experience</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Events</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Train in person. Connect with the community. Experience High Frequency live.</p>
      </div>

      {/* Featured Event */}
      <div className="group relative overflow-hidden rounded-2xl border border-border mb-8 hover:border-primary/40 transition-all">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image src={featured.image} alt={featured.title} fittingType="fill" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-teal font-bold border border-teal/40 px-3 py-1.5 rounded-full mb-4">
            {featured.tag}
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-2">{featured.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-300 mb-4">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-teal" />{featured.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-teal" />{featured.date}</span>
            <span className="text-teal font-bold">{featured.price}</span>
          </div>
          <p className="text-sm text-zinc-400 max-w-lg mb-6">{featured.desc}</p>
          <button className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg group-hover:gap-3 transition-all">
            Reserve Spot <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Other Events */}
      <h2 className="font-display text-2xl text-white mb-4">More Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rest.map((event, i) => (
          <div key={i} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer">
            <div className="relative h-44 overflow-hidden">
              <Image src={event.image} alt={event.title} fittingType="fill" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <span className="absolute top-3 left-3 text-[9px] tracking-widest uppercase text-white font-bold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {event.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white text-sm mb-2 leading-snug">{event.title}</h3>
              <div className="space-y-1 mb-3 text-xs text-zinc-500">
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-teal" />{event.location}</p>
                <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-teal" />{event.date}</p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">{event.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-teal">{event.price}</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-teal group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}