import React from 'react';
import { Check } from 'lucide-react';

const steps = ['Account', 'Plan', 'Profile', 'Agreements', 'Photo', 'Payment', 'Activated'];

export default function ProgressSteps({ current }) {
  const currentIndex = steps.indexOf(current);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                i <= currentIndex ? 'bg-teal border-teal text-white' : 'border-border text-zinc-600'
              }`}>
                {i < currentIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[9px] tracking-wide uppercase font-medium ${i <= currentIndex ? 'text-teal' : 'text-zinc-600'}`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-1 -mt-5 ${i < currentIndex ? 'bg-teal' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}