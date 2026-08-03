import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, Shield, Dumbbell, Clock, Users, Heart, Apple, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const benefits = [
  { icon: Clock, title: '24/7 Facility Access', desc: 'Train on your schedule, day or night.' },
  { icon: Dumbbell, title: 'Premium Equipment', desc: 'State-of-the-art strength and cardio gear.' },
  { icon: Users, title: 'Group Classes', desc: 'HIIT, sculpt, yoga, and conditioning sessions.' },
  { icon: Heart, title: 'Personal Training', desc: '1-on-1 coaching with elite High Frequency trainers.' },
  { icon: Apple, title: 'Nutrition Coaching', desc: 'Custom meal plans and macro guidance.' },
  { icon: Sparkles, title: 'Member Events', desc: 'Retreats, workshops, and community challenges.' },
];

export default function Join() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MembershipPlans.filter({ active: true }, 'display_order')
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
          alt="High Frequency gym"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="max-w-xl">
            <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">High Frequency</span>
            <h1 className="font-display text-4xl md:text-6xl text-white mt-3 mb-5 leading-tight">Become a Member</h1>
            <p className="text-sm md:text-base text-zinc-300 font-light mb-8 leading-relaxed max-w-lg">
              More than a gym. High Frequency is a private fitness club built for transformation — elite coaching, premium equipment, and a community that operates at a higher frequency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/plans" className="inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
                Start Membership <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => base44.auth.redirectToLogin('/dashboard')} className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-white/5 transition-all">
                <LogIn className="w-4 h-4" /> Member Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Why Join</span>
          <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Membership Benefits</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="rounded-xl border border-border bg-card p-6 hover:border-teal/30 transition-all">
                <Icon className="w-7 h-7 text-teal mb-4" />
                <h3 className="font-bold text-white text-sm mb-1">{b.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plan Preview */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Plans</span>
            <h2 className="font-display text-3xl md:text-4xl text-white mt-2">Choose Your Membership</h2>
            <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto">Flexible options for every goal. No hidden fees. Cancel anytime on month-to-month plans.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
            </div>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="rounded-xl border border-border bg-card p-6 hover:border-teal/30 transition-all">
                  <h3 className="font-display text-xl text-white mb-1">{plan.plan_name}</h3>
                  <div className="flex items-baseline gap-1.5 mt-3 mb-3">
                    <span className="font-display text-3xl text-white">${plan.monthly_price}</span>
                    {plan.billing_interval !== 'one_time' && <span className="text-xs text-zinc-500">/mo</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mb-4">{plan.description}</p>
                  <Link to="/plans" className="text-xs font-bold text-teal flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500 text-sm py-8">Plans coming soon. Check back shortly.</p>
          )}

          <div className="text-center mt-10">
            <Link to="/plans" className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all">
              View All Plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <Shield className="w-5 h-5 text-zinc-600" />
          <p className="text-xs text-zinc-500">
            By joining, you agree to our <Link to="/plans" className="text-teal hover:underline">Membership Terms</Link> and{' '}
            <Link to="/plans" className="text-teal hover:underline">Cancellation Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}