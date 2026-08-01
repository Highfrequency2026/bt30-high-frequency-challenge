import React from 'react';

export default function HFLogo({ compact = false, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 border border-platinum/30 rounded-sm rotate-45" />
        <span className="relative text-teal font-black text-xs tracking-tighter">HF</span>
      </div>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-[8px] tracking-[0.3em] text-zinc-500 font-medium uppercase">High</span>
          <span className="text-sm font-bold tracking-[0.15em] text-white">FREQUENCY</span>
        </div>
      )}
    </div>
  );
}