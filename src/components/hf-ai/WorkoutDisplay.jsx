import React, { useState } from 'react';
import { Play, Save, RefreshCw, Share2, Calendar, Printer, Clock, Dumbbell, AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import ExerciseCard from './ExerciseCard';

export default function WorkoutDisplay({ workout, onRegenerate, onSave, saving, regenerating, onReplaceExercise, replacingIndex }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      await onSave();
      setSaved(true);
    }
  };

  const handleShare = async () => {
    const text = `${workout.workout_title}\n${workout.summary}\n${(workout.exercises || []).map((e, i) => `${i + 1}. ${e.name} — ${e.sets}×${e.reps}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({ title: workout.workout_title, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const handlePrint = () => window.print();

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(workout.workout_title);
    const details = encodeURIComponent(workout.summary || '');
    const dates = `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(Date.now() + (parseInt(workout.estimated_duration) || 30) * 60000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Workout Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold bg-teal/10 px-2.5 py-1 rounded-full">AI Generated</span>
              {workout.difficulty && (
                <span className="text-[10px] tracking-widest uppercase text-zinc-500 bg-muted px-2.5 py-1 rounded-full capitalize">{workout.difficulty}</span>
              )}
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-2">{workout.workout_title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">{workout.summary}</p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-zinc-400">
              {workout.estimated_duration && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal" />{workout.estimated_duration}</span>}
              {workout.training_goal && <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-teal" />{workout.training_goal}</span>}
              {workout.equipment_needed?.length > 0 && (
                <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-teal" />{workout.equipment_needed.join(', ')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button className="inline-flex items-center gap-1.5 bg-teal text-white font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-teal/90 transition-all">
            <Play className="w-3.5 h-3.5 fill-white" /> Start Workout
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="inline-flex items-center gap-1.5 border border-border bg-card font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:border-teal/30 transition-all disabled:opacity-60"
          >
            {saved ? <><CheckCircle2 className="w-3.5 h-3.5 text-teal" /> Saved</> : saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...</> : <><Save className="w-3.5 h-3.5" /> Save</>}
          </button>
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 border border-border bg-card font-bold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:border-teal/30 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} /> Regenerate
          </button>
          <button onClick={handleShare} className="inline-flex items-center gap-1.5 border border-border bg-card font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg hover:border-teal/30 transition-all">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={handleAddToCalendar} className="inline-flex items-center gap-1.5 border border-border bg-card font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg hover:border-teal/30 transition-all">
            <Calendar className="w-3.5 h-3.5" /> Calendar
          </button>
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 border border-border bg-card font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg hover:border-teal/30 transition-all">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Warmup */}
      {workout.warmup && (
        <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5">
          <p className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2">Warm-Up</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{workout.warmup}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-white">Exercises</h3>
          <span className="text-xs text-zinc-500">{workout.exercises?.length || 0} exercises</span>
        </div>
        {workout.exercises?.map((exercise, i) => (
          <ExerciseCard
            key={i}
            exercise={exercise}
            index={i}
            onReplace={onReplaceExercise}
            replacing={replacingIndex === i}
          />
        ))}
      </div>

      {/* Finisher */}
      {workout.finisher && (
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
          <p className="text-[10px] tracking-widest uppercase text-orange-400 font-bold mb-2">Finisher</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{workout.finisher}</p>
        </div>
      )}

      {/* Cooldown */}
      {workout.cooldown && (
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <p className="text-[10px] tracking-widest uppercase text-blue-400 font-bold mb-2">Cool-Down</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{workout.cooldown}</p>
        </div>
      )}

      {/* Trainer Notes */}
      {workout.trainer_notes && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2">Trainer Notes</p>
          <p className="text-sm text-zinc-400 leading-relaxed">{workout.trainer_notes}</p>
        </div>
      )}

      {/* Safety Notes */}
      {workout.safety_notes && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
          <p className="text-[10px] tracking-widest uppercase text-destructive font-bold mb-2 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Safety Notes</p>
          <p className="text-sm text-zinc-400 leading-relaxed">{workout.safety_notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center py-4">
        <p className="text-[10px] text-zinc-600 leading-relaxed max-w-2xl mx-auto">
          This information is general fitness education and is not medical advice. Always consult a healthcare professional before starting any exercise program, especially if you have injuries or medical conditions.
        </p>
      </div>
    </div>
  );
}