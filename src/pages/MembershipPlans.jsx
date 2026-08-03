import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import PlanCard from '@/components/membership/PlanCard';

const steps = ['Account', 'Plan', 'Profile', 'Agreements', 'Photo', 'Payment', 'Activated'];

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('selectedPlanId');
    if (saved) setSelectedId(saved);
    base44.entities.MembershipPlans.filter({ active: true }, 'display_order')
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (plan) => {
    setSelectedId(plan.plan_id);
    localStorage.setItem('selectedPlanId', plan.plan_id);
    localStorage.setItem('selectedPlanName', plan.plan_name);
    toast({
      title: `${plan.plan_name} selected`,
      description: 'Continue to create your account to proceed.',
    });
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
      {/* Progress Indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                  i <= 1 ? 'bg-teal border-teal text-white' : 'border-border text-zinc-600'
                }`}>
                  {i < 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[9px] tracking-wide uppercase font-medium ${i <= 1 ? 'text-teal' : 'text-zinc-600'}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-1 -mt-5 ${i < 1 ? 'bg-teal' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Step 2</span>
        <h1 className="font-display text-3xl md:text-5xl text-white mt-2">Select Your Membership</h1>
        <p className="text-zinc-400 text-sm mt-3 max-w-xl mx-auto">Choose the plan that fits your goals. You can upgrade or change your plan at any time.</p>
      </div>

      {/* Plans */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.plan_id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 text-sm py-12">No plans available yet. Please check back soon.</p>
      )}

      {/* Continue */}
      {selectedId && (
        <div className="mt-10 flex justify-center animate-fade-up">
          <Link
            to="/member-signup"
            className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-10 py-4 rounded-lg hover:bg-teal/90 transition-all"
          >
            Continue to Registration <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Back */}
      <div className="mt-6 text-center">
        <Link to="/join" className="text-xs text-zinc-500 hover:text-teal transition-colors">
          ← Back to overview
        </Link>
      </div>
    </div>
  );
}