import React from 'react';
import { Droplet, Apple, ShoppingBag, Calculator } from 'lucide-react';
import { nutritionCategories, sampleMeals } from '@/data/challengeData';

export default function Nutrition() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">BT30™ Blueprint</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Nutrition</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Fuel your transformation. Clean eating isn't a diet — it's a frequency.</p>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-gradient-to-r from-teal/10 to-transparent border border-teal/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Droplet className="w-6 h-6 text-teal" />
            <div>
              <h3 className="font-bold text-white">Daily Hydration</h3>
              <p className="text-xs text-zinc-500">Goal: 1 gallon (128 oz)</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-teal">0%</span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all" style={{ width: '0%' }} />
        </div>
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 h-10 rounded-lg border border-teal/20 bg-muted/20 flex items-center justify-center text-xs text-zinc-600">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Sample Meal Plan */}
      <h2 className="font-display text-2xl text-white mb-4">Sample Daily Meal Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {sampleMeals.map((meal, i) => (
          <div key={i} className="flex items-center gap-4 bg-card border border-border rounded-xl p-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
              <Apple className="w-5 h-5 text-teal" />
            </div>
            <div className="flex-1">
              <p className="text-[9px] tracking-widest uppercase text-zinc-500 font-bold">{meal.time}</p>
              <h4 className="font-bold text-white text-sm">{meal.name}</h4>
              <p className="text-xs text-zinc-500">{meal.desc}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">{meal.calories}</p>
              <p className="text-[10px] text-teal">{meal.protein} protein</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grocery Guide */}
      <h2 className="font-display text-2xl text-white mb-4">Grocery Guide</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {nutritionCategories.map(cat => (
          <div key={cat.name} className="bg-card border border-border rounded-xl p-5">
            <h4 className="font-bold text-white text-sm mb-3 pb-2 border-b border-border">{cat.name}</h4>
            <ul className="space-y-1.5">
              {cat.items.map(item => (
                <li key={item} className="text-xs text-zinc-400 flex items-center gap-2">
                  <span className="w-1 h-1 bg-teal rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Macro Calculator Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Macro Calculator</h4>
            <p className="text-xs text-zinc-500 mt-0.5">Calculate your daily macros based on your goals.</p>
          </div>
          <span className="ml-auto text-[10px] tracking-widest uppercase text-zinc-600 font-bold">Soon</span>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Restaurant Guide</h4>
            <p className="text-xs text-zinc-500 mt-0.5">Eat smart when dining out.</p>
          </div>
          <span className="ml-auto text-[10px] tracking-widest uppercase text-zinc-600 font-bold">Soon</span>
        </div>
      </div>
    </div>
  );
}