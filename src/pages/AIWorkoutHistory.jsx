import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Dumbbell, Clock, ChevronRight, Sparkles, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIWorkoutHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    base44.entities.AIWorkoutHistory.list('-created_date', 50)
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter(h =>
    !search || h.workout_title?.toLowerCase().includes(search.toLowerCase()) || h.request_summary?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/hf-ai" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal transition-colors mb-4">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to AI Trainer
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">HF AI Trainer</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-white">AI Workout History</h1>
        <p className="text-zinc-400 text-sm mt-2">Every workout you've generated with HF AI Trainer.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search history..."
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(h => (
            <div key={h.id} className="rounded-2xl border border-border bg-card p-5 hover:border-teal/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 rounded-full ${h.mode === 'build_workout' ? 'bg-teal/10 text-teal' : 'bg-blue-500/10 text-blue-400'}`}>
                      {h.mode === 'build_workout' ? 'Workout' : 'Exercise Finder'}
                    </span>
                    {h.difficulty && <span className="text-[9px] tracking-wide uppercase text-zinc-500 bg-muted px-2 py-0.5 rounded-full capitalize">{h.difficulty}</span>}
                    {h.training_goal && <span className="text-[9px] text-zinc-600 capitalize">{h.training_goal.replace(/_/g, ' ')}</span>}
                  </div>
                  <h3 className="font-bold text-white text-base">{h.workout_title}</h3>
                  {h.summary && <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{h.summary}</p>}
                  {h.request_summary && (
                    <p className="text-[10px] text-zinc-600 mt-2 italic">Request: {h.request_summary}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-zinc-500">
                    {h.estimated_duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal" />{h.estimated_duration}</span>}
                    {h.exercises?.length > 0 && <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-teal" />{h.exercises.length} exercises</span>}
                    <span>{formatDate(h.created_date)}</span>
                  </div>
                </div>
              </div>
              {h.exercises?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-1.5">
                  {h.exercises.slice(0, 5).map((ex, i) => (
                    <span key={i} className="text-[10px] text-zinc-500 bg-muted/50 px-2 py-1 rounded-md">{ex.name}</span>
                  ))}
                  {h.exercises.length > 5 && <span className="text-[10px] text-zinc-600 px-2 py-1">+{h.exercises.length - 5} more</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <History className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No AI workouts generated yet.</p>
          <Link to="/hf-ai" className="inline-flex items-center gap-1.5 text-teal text-sm mt-2">
            Generate your first workout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}