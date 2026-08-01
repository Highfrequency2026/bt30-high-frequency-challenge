import React, { useState } from 'react';
import { Brain, Sunrise, Moon, PenLine, Target } from 'lucide-react';
import { mindsetContent } from '@/data/challengeData';

export default function Mindset() {
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState('');

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % mindsetContent.affirmations.length);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">High Frequency</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Mindset</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Fitness is the vehicle. Transformation is the destination. Train your mind as hard as your body.</p>
      </div>

      {/* Daily Affirmation */}
      <div className="relative bg-gradient-to-br from-teal/15 via-card to-card border border-teal/20 rounded-2xl p-8 md:p-12 mb-8 overflow-hidden">
        <div className="absolute top-4 right-4">
          <Brain className="w-8 h-8 text-teal/20" />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold mb-4 block">Daily Affirmation</span>
        <p className="font-display text-2xl md:text-4xl text-white leading-tight italic mb-6">
          "{mindsetContent.affirmations[affirmationIndex]}"
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">{affirmationIndex + 1} of {mindsetContent.affirmations.length}</span>
          <button
            onClick={nextAffirmation}
            className="text-xs font-bold tracking-wider uppercase text-teal border border-teal/30 px-4 py-2 rounded-lg hover:bg-teal/10 transition-all"
          >
            Next Affirmation →
          </button>
        </div>
      </div>

      {/* Morning Routine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sunrise className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-white">Morning Routine</h3>
          </div>
          <div className="space-y-3">
            {mindsetContent.morningRoutine.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-xs font-bold text-teal flex-shrink-0 w-16">{item.time}</span>
                <span className="text-xs text-zinc-300">{item.task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-white">Weekly Reflection</h3>
          </div>
          <div className="space-y-2.5">
            {mindsetContent.weeklyReflection.map((prompt, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-teal text-xs flex-shrink-0">—</span>
                <span className="text-xs text-zinc-300 leading-relaxed">{prompt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journal */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <PenLine className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Today's Journal</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-3 italic">{mindsetContent.journalPrompts[0]}</p>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full bg-muted/20 border border-border rounded-lg p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/40 transition-colors min-h-[120px] resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] text-zinc-600">{journalEntry.length} characters</span>
          <button className="text-xs font-bold tracking-wider uppercase text-teal border border-teal/30 px-4 py-2 rounded-lg hover:bg-teal/10 transition-all">
            Save Entry
          </button>
        </div>
      </div>

      {/* Evening Reflection */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Evening Reflection</h3>
        </div>
        <div className="space-y-2.5">
          {mindsetContent.journalPrompts.slice(1).map((prompt, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-teal text-xs flex-shrink-0">—</span>
              <span className="text-xs text-zinc-300 leading-relaxed">{prompt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}