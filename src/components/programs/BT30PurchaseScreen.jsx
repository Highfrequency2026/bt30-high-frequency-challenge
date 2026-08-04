import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Check, Clock, TrendingUp, Dumbbell } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG } from '@/data/challengeData';
import { base44 } from '@/api/base44Client';
import { useCheckout } from '@/hooks/useCheckout';
import { useAuth } from '@/lib/AuthContext';

export default function BT30PurchaseScreen() {
  const { user } = useAuth();
  const { startCheckout, loadingId } = useCheckout();

  const handlePurchase = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    startCheckout('bt30-preorder');
  };

  const includes = [
    '30 structured daily workouts',
    'Strength, cardio, HIIT & core programming',
    'Adaptive fitness levels — beginner to advanced',
    'Equipment guide & movement standards',
    'Progress tracking & completion badges',
    'Lifetime access — one-time purchase',
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden">
        <Image src={BRE_IMG} alt="BT30" fittingType="fill" focalPointY={0.25} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <Link to="/programs" className="text-xs text-zinc-400 hover:text-teal transition-colors mb-3 inline-flex items-center gap-1">
            ← Programs
          </Link>
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-teal font-bold border border-teal/40 px-3 py-1.5 rounded-full mb-3">
            Pre-order Available
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-none mb-2">BT30™</h1>
          <p className="text-lg text-platinum font-light italic mb-3">The High Frequency Method</p>
          <p className="text-sm text-zinc-300 max-w-lg">Featuring <span className="font-semibold text-white">Bre Tiesi</span> — 30 days of structured training with celebrity trainer Mike T.</p>
        </div>
      </div>

      {/* Purchase Card */}
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <div className="rounded-2xl border border-teal/30 bg-card overflow-hidden">
          {/* Pricing header */}
          <div className="bg-teal/5 px-6 md:px-8 py-8 text-center border-b border-teal/20">
            <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-teal font-bold bg-teal/10 px-3 py-1 rounded-full mb-4">
              Limited Pre-order
            </span>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-zinc-500 line-through text-2xl font-display">$178</span>
              <span className="font-display text-6xl text-teal">$89</span>
            </div>
            <p className="text-xs text-zinc-400">Price doubles when the program goes live. Lock in your pre-order rate today.</p>
          </div>

          {/* What's included */}
          <div className="px-6 md:px-8 py-8">
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-4">What's Included</p>
            <ul className="space-y-3 mb-8">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mb-8 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal" />30 Days</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-teal" />All Levels</span>
              <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-teal" />30 Workouts</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loadingId !== null}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60"
            >
              {loadingId ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout...</>
              ) : (
                <>Pre-order BT30™ for $89 <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-[11px] text-zinc-600 mt-4">
              {user
                ? 'Secure checkout via Stripe. Access granted instantly after payment.'
                : 'You\'ll need to create an account or log in to complete your pre-order.'}
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/programs" className="text-xs text-zinc-500 hover:text-teal transition-colors">
            ← Back to programs
          </Link>
        </div>
      </div>
    </div>
  );
}