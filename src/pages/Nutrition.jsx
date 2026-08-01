import React, { useState } from 'react';
import { Droplet, Apple, ShoppingBag, Calculator, Plus, Check, X, Flame } from 'lucide-react';
import { nutritionCategories, sampleMeals, dietaryFilters } from '@/data/challengeData';

const HYDRATION_GOAL = 128;
const OZ_PER_BUTTON = 16;

export default function Nutrition() {
  const [hydrationCount, setHydrationCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [dailyLog, setDailyLog] = useState([]);

  const hydrationOz = hydrationCount * OZ_PER_BUTTON;
  const hydrationPct = Math.round((hydrationOz / HYDRATION_GOAL) * 100);

  const toggleHydration = (idx) => {
    setHydrationCount(prev => prev === idx + 1 ? idx : idx + 1);
  };

  const filteredMeals = activeFilter === 'All'
    ? sampleMeals
    : sampleMeals.filter(m => m.tags.includes(activeFilter));

  const addToLog = (meal) => {
    setDailyLog(prev => [...prev, meal]);
    setSelectedMeal(null);
  };

  const removeFromLog = (idx) => {
    setDailyLog(prev => prev.filter((_, i) => i !== idx));
  };

  const totalCalories = dailyLog.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = dailyLog.reduce((sum, m) => sum + parseInt(m.protein), 0);

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
              <p className="text-xs text-zinc-500">{hydrationOz} oz of {HYDRATION_GOAL} oz</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-teal">{hydrationPct}%</span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${hydrationPct}%` }} />
        </div>
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => toggleHydration(i)}
              className={`flex-1 h-10 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                i < hydrationCount
                  ? 'border-teal bg-teal/20 text-teal'
                  : 'border-teal/20 bg-muted/20 text-zinc-600 hover:border-teal/40'
              }`}
            >
              {i < hydrationCount ? <Check className="w-4 h-4" /> : i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {dietaryFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
              activeFilter === filter
                ? 'bg-teal text-white'
                : 'bg-card border border-border text-zinc-400 hover:border-teal/40 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Meal Plan */}
      <h2 className="font-display text-2xl text-white mb-4">
        Recipes {activeFilter !== 'All' && <span className="text-sm text-zinc-500 font-body">· {activeFilter}</span>}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {filteredMeals.map((meal, i) => (
          <button
            key={i}
            onClick={() => setSelectedMeal(meal)}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center">
              <Apple className="w-5 h-5 text-teal" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] tracking-widest uppercase text-zinc-500 font-bold">{meal.time}</p>
              <h4 className="font-bold text-white text-sm">{meal.name}</h4>
              <p className="text-xs text-zinc-500 truncate">{meal.desc}</p>
              <div className="flex gap-1 mt-1">
                {meal.tags.map(tag => (
                  <span key={tag} className="text-[8px] tracking-wide text-teal bg-teal/10 px-1.5 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-white">{meal.calories}</p>
              <p className="text-[10px] text-teal">cal</p>
            </div>
          </button>
        ))}
        {filteredMeals.length === 0 && (
          <p className="text-sm text-zinc-500 col-span-2 text-center py-8">No meals match this filter.</p>
        )}
      </div>

      {/* Daily Log */}
      {dailyLog.length > 0 && (
        <div className="bg-card border border-teal/20 rounded-xl p-5 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Today's Daily Log</h3>
            <div className="flex gap-4 text-xs">
              <span className="text-zinc-400">{totalCalories} <span className="text-zinc-600">cal</span></span>
              <span className="text-zinc-400">{totalProtein}g <span className="text-zinc-600">protein</span></span>
            </div>
          </div>
          <div className="space-y-2">
            {dailyLog.map((meal, i) => (
              <div key={i} className="flex items-center justify-between bg-muted/20 rounded-lg px-4 py-2">
                <div>
                  <p className="text-xs font-bold text-white">{meal.name}</p>
                  <p className="text-[10px] text-zinc-500">{meal.calories} cal · {meal.protein} protein</p>
                </div>
                <button onClick={() => removeFromLog(i)} className="text-zinc-600 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Coming Soon */}
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

      {/* Recipe Detail Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMeal(null)}>
          <div className="w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative p-6 pb-4">
              <button onClick={() => setSelectedMeal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-muted/30 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
              <p className="text-[10px] tracking-widest uppercase text-teal font-bold mb-1">{selectedMeal.time}</p>
              <h3 className="font-display text-2xl text-white mb-2">{selectedMeal.name}</h3>
              <p className="text-sm text-zinc-400">{selectedMeal.desc}</p>
              <div className="flex gap-1.5 mt-3">
                {selectedMeal.tags.map(tag => (
                  <span key={tag} className="text-[9px] tracking-wide text-teal bg-teal/10 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="px-6 pb-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-lg font-bold text-white">{selectedMeal.calories}</p>
                  <p className="text-[9px] tracking-wide uppercase text-zinc-500">Calories</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-lg font-bold text-teal">{selectedMeal.protein}</p>
                  <p className="text-[9px] tracking-wide uppercase text-zinc-500">Protein</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-lg font-bold text-white">{selectedMeal.carbs}</p>
                  <p className="text-[9px] tracking-wide uppercase text-zinc-500">Carbs</p>
                </div>
                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-lg font-bold text-white">{selectedMeal.fat}</p>
                  <p className="text-[9px] tracking-wide uppercase text-zinc-500">Fat</p>
                </div>
              </div>
            </div>
            <div className="p-6 pt-2 border-t border-border">
              <button
                onClick={() => addToLog(selectedMeal)}
                className="w-full flex items-center justify-center gap-2 bg-teal text-white font-bold text-xs tracking-wider uppercase py-3 rounded-lg hover:bg-teal/90 transition-all"
              >
                <Plus className="w-4 h-4" /> Add to Daily Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}