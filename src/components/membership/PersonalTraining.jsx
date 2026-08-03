import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';

const ptPackages = [
  { id: 'pt-single', name: '1-on-1 Single Session', price: '$120', duration: '60 min', desc: 'A focused single session with an elite High Frequency coach to assess, correct, and accelerate your progress.', features: ['Movement assessment', 'Form correction', 'Custom workout design', 'Coach follow-up notes'] },
  { id: 'pt-4pack', name: '4-Session Package', price: '$440', duration: '4 × 60 min', desc: 'A structured four-session block to build momentum and dial in your training and nutrition strategy.', features: ['Personalized program design', 'Nutrition guidance', 'Progress check-ins', 'Priority scheduling'] },
  { id: 'pt-8pack', name: '8-Session Transformation', price: '$800', duration: '8 × 60 min', desc: 'The complete personal training experience — a full transformation guided by a dedicated coach.', features: ['Full custom training plan', 'Custom nutrition blueprint', 'Weekly check-ins', 'Body composition tracking', 'Free welcome kit'] },
];

export default function PersonalTraining() {
  const { startCheckout, loadingId } = useCheckout();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {ptPackages.map((pkg) => {
        const isLoading = loadingId === pkg.id;
        return (
          <div key={pkg.id} className="rounded-2xl border border-border bg-card p-7 hover:border-teal/30 transition-all flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">{pkg.duration}</span>
            <h3 className="font-display text-xl text-white mt-2">{pkg.name}</h3>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{pkg.desc}</p>
            <div className="flex items-baseline gap-1 mt-4 mb-5">
              <span className="font-display text-4xl text-white">{pkg.price}</span>
            </div>
            <ul className="space-y-2.5 mb-7 flex-1">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="w-1 h-1 bg-teal rounded-full flex-shrink-0 mt-1.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => startCheckout(pkg.id)}
              disabled={loadingId !== null}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <>Book Sessions <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}