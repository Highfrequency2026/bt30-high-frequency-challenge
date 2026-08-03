import React from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';

const tiers = [
  {
    id: 'membership-monthly',
    name: 'Monthly All-Access',
    price: '$49',
    period: '/month',
    tagline: 'Flexible month-to-month',
    features: [
      'Full access to BT30™ & all programs',
      'Daily workout tracking & progress',
      'Nutrition blueprint & meal logging',
      'Mindset affirmations & journaling',
      'Community access & leaderboard',
      'Cancel anytime',
    ],
    highlighted: false,
  },
  {
    id: 'membership-annual',
    name: 'Annual All-Access',
    price: '$499',
    period: '/year',
    tagline: 'Save 15% — best value',
    features: [
      'Everything in Monthly All-Access',
      'Priority access to new programs',
      'Exclusive member-only live training',
      'Early access to events & retreats',
      '10% off all High Frequency store gear',
      'Save $89 vs. monthly',
    ],
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'membership-elite',
    name: 'Elite Annual',
    price: '$899',
    period: '/year',
    tagline: 'The full transformation experience',
    features: [
      'Everything in Annual All-Access',
      '2 personal training sessions / month',
      '1-on-1 strategy call with a coach',
      'Custom nutrition & training plan',
      'Free High Frequency welcome kit',
      'VIP event access',
    ],
    highlighted: false,
    badge: 'PREMIUM',
  },
];

export default function MembershipTiers() {
  const { startCheckout, loadingId } = useCheckout();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {tiers.map((tier) => {
        const isLoading = loadingId === tier.id;
        return (
          <div
            key={tier.id}
            className={`relative rounded-2xl border p-7 flex flex-col transition-all ${
              tier.highlighted ? 'border-teal/40 bg-card' : 'border-border bg-card'
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] uppercase text-white font-bold bg-teal px-3 py-1.5 rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}
            <h3 className="font-display text-2xl text-white">{tier.name}</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-5">{tier.tagline}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-5xl text-white">{tier.price}</span>
              <span className="text-sm text-zinc-500">{tier.period}</span>
            </div>
            <ul className="space-y-3 mb-7 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => startCheckout(tier.id)}
              disabled={loadingId !== null}
              className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-lg transition-all disabled:opacity-60 ${
                tier.highlighted ? 'bg-teal text-white hover:bg-teal/90' : 'border border-platinum/30 text-platinum hover:bg-white/5'
              }`}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <>Choose Plan <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}