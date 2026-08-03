import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal/10 border border-teal/30 mb-8">
          <CheckCircle2 className="w-10 h-10 text-teal" />
        </div>
        <span className="text-[10px] tracking-[0.4em] uppercase text-teal font-bold">Payment Complete</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-3 mb-4">Welcome to High Frequency</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Your membership is now active. You have full access to programs, live training, nutrition, and the community. Let's get to work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-teal/90 transition-all">
            Enter the App <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/programs/bt30" className="inline-flex items-center justify-center gap-2 border border-platinum/30 text-platinum font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-white/5 transition-all">
            Start BT30™
          </Link>
        </div>
      </div>
    </div>
  );
}