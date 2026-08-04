import React from 'react';
import { Check } from 'lucide-react';

export default function QuickSelect({ options, value, onChange, multi = false, columns = 'auto' }) {
  const isSelected = (id) => multi ? (value || []).includes(id) : value === id;

  const handleClick = (id) => {
    if (multi) {
      const current = value || [];
      onChange(isSelected(id) ? current.filter(v => v !== id) : [...current, id]);
    } else {
      onChange(isSelected(id) ? null : id);
    }
  };

  const gridClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'flex flex-wrap';

  return (
    <div className={`grid ${gridClass} gap-2`}>
      {options.map(opt => {
        const selected = isSelected(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleClick(opt.id)}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all border ${
              selected
                ? 'bg-teal text-white border-teal'
                : 'bg-card text-zinc-400 border-border hover:border-teal/30 hover:text-zinc-200'
            }`}
          >
            {selected && !multi && <Check className="w-3 h-3" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}