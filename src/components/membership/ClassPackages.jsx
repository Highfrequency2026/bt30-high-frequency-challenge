import React from 'react';
import { Calendar, Users } from 'lucide-react';

const classPacks = [
  { id: 'single', name: 'Single Class Drop-in', price: '$25', desc: 'One live training session', detail: 'Any live class', icon: Calendar },
  { id: '5pack', name: '5-Class Pack', price: '$110', desc: 'Save $15', detail: 'Valid for 60 days', icon: Users, popular: true },
  { id: '10pack', name: '10-Class Pack', price: '$200', desc: 'Save $50', detail: 'Valid for 90 days', icon: Users },
];

export default function ClassPackages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {classPacks.map((pack) => {
        const Icon = pack.icon;
        return (
          <div key={pack.id} className="relative rounded-2xl border border-border bg-card p-7 hover:border-teal/30 transition-all">
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] uppercase text-white font-bold bg-teal px-3 py-1.5 rounded-full whitespace-nowrap">
                BEST VALUE
              </span>
            )}
            <Icon className="w-7 h-7 text-teal mb-4" />
            <h3 className="font-display text-xl text-white">{pack.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">{pack.desc}</p>
            <div className="flex items-baseline gap-1 mt-4 mb-5">
              <span className="font-display text-4xl text-white">{pack.price}</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6">{pack.detail}</p>
            <button className="w-full inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-white/5 transition-all">
              Book Class
            </button>
          </div>
        );
      })}
    </div>
  );
}