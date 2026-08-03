import React from 'react';
import MembershipTiers from '@/components/membership/MembershipTiers';
import ClassPackages from '@/components/membership/ClassPackages';
import PersonalTraining from '@/components/membership/PersonalTraining';

export default function Membership() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Join High Frequency</span>
        <h1 className="font-display text-4xl md:text-6xl text-white mt-3">Membership</h1>
        <p className="text-zinc-400 text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your journey. From flexible monthly access to elite coaching — unlock world-class programs, live training, and a community that pushes you higher.
        </p>
      </div>

      {/* Membership Tiers */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="font-display text-3xl text-white">Membership Plans</h2>
          <p className="text-sm text-zinc-500 mt-1">Recurring subscriptions — cancel anytime.</p>
        </div>
        <MembershipTiers />
      </section>

      {/* Class Packages */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="font-display text-3xl text-white">Class Packages</h2>
          <p className="text-sm text-zinc-500 mt-1">Pre-paid live training sessions — no membership required.</p>
        </div>
        <ClassPackages />
      </section>

      {/* Personal Training */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="font-display text-3xl text-white">Personal Training</h2>
          <p className="text-sm text-zinc-500 mt-1">Work one-on-one with an elite High Frequency coach.</p>
        </div>
        <PersonalTraining />
      </section>

      {/* FAQ / Trust */}
      <section className="border-t border-border pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Cancel Anytime</h4>
            <p className="text-xs text-zinc-500">No long-term contracts. Pause or cancel whenever.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Secure Payments</h4>
            <p className="text-xs text-zinc-500">Encrypted, industry-standard checkout.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">Instant Access</h4>
            <p className="text-xs text-zinc-500">Start training the moment you sign up.</p>
          </div>
        </div>
      </section>
    </div>
  );
}