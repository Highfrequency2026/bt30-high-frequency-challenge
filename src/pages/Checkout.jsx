import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import ProgressSteps from '@/components/membership/ProgressSteps';
import { useCheckout } from '@/hooks/useCheckout';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isLoadingAuth } = useAuth();
  const { startCheckout, loadingId } = useCheckout();
  const [member, setMember] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    if (user) {
      base44.entities.Members.filter({ user_id: user.id })
        .then(async (members) => {
          if (members.length === 0) { navigate('/member-signup'); return; }
          const m = members[0];
          setMember(m);
          const planId = m.selected_plan_id || localStorage.getItem('selectedPlanId');
          if (!planId) { navigate('/plans'); return; }
          const plans = await base44.entities.MembershipPlans.filter({ plan_id: planId });
          if (plans.length > 0) setPlan(plans[0]);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || loading || !user) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" /></div>;
  }

  if (!plan) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-sm text-zinc-400 mb-4">No plan selected.</p>
        <button onClick={() => navigate('/plans')} className="bg-teal text-white font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg">Choose a Plan</button>
      </div>
    );
  }

  const enrollment = parseFloat(plan.enrollment_fee) || 0;
  const monthly = parseFloat(plan.monthly_price) || 0;
  const tax = 0;
  const totalToday = monthly + enrollment + tax;
  const today = new Date();
  const nextBilling = new Date(today);
  if (plan.billing_interval === 'year') nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  else nextBilling.setMonth(nextBilling.getMonth() + 1);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto px-6 py-12 md:py-16">
      <ProgressSteps current="Payment" />
      <div className="mb-8">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 6</span>
        <h1 className="font-display text-3xl md:text-4xl text-white mt-2">Checkout</h1>
        <p className="text-sm text-zinc-400 mt-2">Review your order and complete payment securely.</p>
      </div>

      {/* Order Summary */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-white">Order Summary</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white">{plan.plan_name}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-zinc-400">Monthly Dues</span><span className="text-zinc-200">${monthly.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Enrollment Fee</span><span className="text-zinc-200">{enrollment > 0 ? `$${enrollment.toFixed(2)}` : 'Free'}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Estimated Tax</span><span className="text-zinc-200">${tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-border pt-2.5">
              <span className="font-bold text-white">Amount Due Today</span>
              <span className="font-display text-2xl text-teal">${totalToday.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-zinc-500">Billing Frequency</span><span className="text-zinc-300 capitalize">{plan.billing_interval === 'one_time' ? 'One-time' : plan.billing_interval}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Next Billing Date</span><span className="text-zinc-300">{plan.billing_interval === 'one_time' ? '—' : nextBilling.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
          </div>
        </div>
      </div>

      {/* Cancellation Terms */}
      <div className="rounded-xl border border-border bg-card p-4 mb-6">
        <p className="text-[10px] tracking-wide uppercase text-zinc-500 font-bold mb-1.5">Cancellation Terms</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{plan.cancellation_terms}</p>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 mb-6 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-teal" />
        <span>Payments are processed securely. We never store your card details.</span>
      </div>

      {/* Pay Button */}
      <button
        onClick={() => startCheckout(plan.product_id)}
        disabled={loadingId !== null}
        className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-60"
      >
        {loadingId ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout...</> : <>Pay ${totalToday.toFixed(2)} & Complete <ArrowRight className="w-4 h-4" /></>}
      </button>

      <p className="text-center text-[11px] text-zinc-600 mt-4">
        After payment is confirmed, your membership will be activated automatically. You'll receive a digital QR access pass.
      </p>
    </div>
  );
}