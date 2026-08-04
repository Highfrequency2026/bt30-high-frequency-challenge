import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Dumbbell, Clock, Flame, ChevronRight, Trash2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import WorkoutDisplay from '@/components/hf-ai/WorkoutDisplay';

export default function SavedWorkouts() {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    setLoading(true);
    base44.entities.SavedWorkout.list('-created_date', 50)
      .then(setWorkouts)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.SavedWorkout.delete(id);
      setWorkouts(workouts.filter(w => w.id !== id));
      if (selected?.id === id) setSelected(null);
      toast({ title: 'Workout deleted' });
    } catch (err) {
      toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' });
    }
  };

  if (selected) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal transition-colors mb-6">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to Saved Workouts
        </button>
        <WorkoutDisplay workout={selected} onReplaceExercise={null} />
      </div>
    );
  }

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
        <h1 className="font-display text-3xl md:text-5xl text-white">Saved Workouts</h1>
        <p className="text-zinc-400 text-sm mt-2">Your collection of AI-generated and saved workouts.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
        </div>
      ) : workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map(w => (
            <div key={w.id} className="rounded-2xl border border-border bg-card p-5 hover:border-teal/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="text-[9px] tracking-widest uppercase text-teal font-bold bg-teal/10 px-2 py-0.5 rounded-full">Saved</span>
                  <h3 className="font-bold text-white text-lg mt-2 group-hover:text-teal transition-colors cursor-pointer" onClick={() => setSelected(w)}>{w.workout_title}</h3>
                </div>
                <button onClick={() => handleDelete(w.id)} className="p-1.5 text-zinc-600 hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {w.summary && <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{w.summary}</p>}
              <div className="flex flex-wrap gap-3 text-[11px] text-zinc-500 mb-4">
                {w.estimated_duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-teal" />{w.estimated_duration}</span>}
                {w.exercises?.length > 0 && <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-teal" />{w.exercises.length} exercises</span>}
                {w.difficulty && <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-teal" /><span className="capitalize">{w.difficulty}</span></span>}
              </div>
              <button onClick={() => setSelected(w)} className="w-full text-center text-xs font-bold tracking-wider uppercase text-teal border border-teal/20 rounded-lg py-2.5 hover:bg-teal/5 transition-all">
                View Workout
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No saved workouts yet.</p>
          <Link to="/hf-ai" className="inline-flex items-center gap-1.5 text-teal text-sm mt-2">
            Generate a workout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}