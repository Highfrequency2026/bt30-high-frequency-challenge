import React from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

export default function PlanCard({ plan, selected, onSelect, loading }) {
  const billingLabel = plan.billing_interval === 'one_time'
    ? 'One-time'
    : plan.billing_interval === 'year'
    ? 'Billed annually'
    : 'Billed monthly';

  const commitmentLabel = plan.commitment_months > 0
    ? `${plan.commitment_months}-month commitment`
    : 'No commitment';

  return (
    <div className={`relative rounded-2xl border p-7 flex flex-col transition-all ${
      selected ? 'border-teal bg-teal/5' : 'border-border bg-card hover:border-teal/30'
    }`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-display text-2xl text-white">{plan.plan_name}</h3>
        {plan.access_level === 'premium' && (
          <span className="text-[9px] tracking-[0.25em] uppercase text-white font-bold bg-teal px-2.5 py-1 rounded-full whitespace-nowrap">
            Popular
          </span>
        )}
      </div>
      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{plan.description}</p>

      <div className="flex items-baseline gap-1.5 mt-5 mb-1">
        <span className="font-display text-4xl text-white">${plan.monthly_price}</span>
        {plan.billing_interval !== 'one_time' && <span className="text-sm text-zinc-500">/mo</span>}
      </div>
      <p className="text-[11px] text-zinc-500 mb-5">{billingLabel}</p>

      <div className="space-y-2 mb-5 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Enrollment fee</span>
          <span className="text-zinc-300">{plan.enrollment_fee && plan.enrollment_fee !== '0' ? `$${plan.enrollment_fee}` : 'Free'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Commitment</span>
          <span className="text-zinc-300">{commitmentLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Access level</span>
          <span className="text-zinc-300 capitalize">{plan.access_level}</span>
        </div>
      </div>

      {plan.included_benefits?.length > 0 && (
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.included_benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <Check className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] text-zinc-600 mb-5 leading-relaxed border-t border-border pt-4">
        {plan.cancellation_terms}
      </p>

      <button
        onClick={() => onSelect(plan)}
        disabled={loading}
        className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-lg transition-all disabled:opacity-60 ${
          selected ? 'bg-teal text-white' : 'border border-platinum/30 text-platinum hover:bg-white/5'
        }`}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : selected ? (
          'Selected'
        ) : (
          <>Select Plan <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );
}