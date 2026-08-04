import React, { useState } from 'react';
import { Dumbbell, Clock, RefreshCw, Check, ChevronDown, ChevronUp, Play, AlertCircle } from 'lucide-react';

export default function ExerciseCard({ exercise, index, onReplace, replacing }) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(exercise.completed || false);

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden transition-all ${completed ? 'border-teal/40' : 'border-border'}`}>
      {/* Header */}
      <div className="p-5 flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${completed ? 'bg-teal text-white' : 'bg-muted text-zinc-500'}`}>
          {completed ? <Check className="w-5 h-5" /> : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-lg leading-tight">{exercise.name}</h4>
          {exercise.target_muscles?.length > 0 && (
            <p className="text-xs text-teal mt-0.5">{exercise.target_muscles.join(' · ')}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-zinc-500">
            {exercise.sets && <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{exercise.sets} sets × {exercise.reps}</span>}
            {exercise.rest_seconds > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exercise.rest_seconds}s rest</span>}
            {exercise.equipment && <span className="capitalize">{exercise.equipment.replace(/_/g, ' ')}</span>}
          </div>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-zinc-500 hover:text-zinc-300 border-t border-border transition-colors"
      >
        {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</> : <><ChevronDown className="w-3.5 h-3.5" /> View Details</>}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          {exercise.instructions?.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2">Instructions</p>
              <ol className="space-y-1.5">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-300">
                    <span className="text-teal font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {exercise.form_tips?.length > 0 && (
            <div>
              <p className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2">Form Tips</p>
              <ul className="space-y-1">
                {exercise.form_tips.map((tip, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex gap-2">
                    <span className="text-teal">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.common_mistakes?.length > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
              <p className="text-[10px] tracking-widest uppercase text-destructive font-bold mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Common Mistakes</p>
              <ul className="space-y-1">
                {exercise.common_mistakes.map((mistake, i) => (
                  <li key={i} className="text-sm text-zinc-400 flex gap-2">
                    <span className="text-destructive">•</span> {mistake}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.easier_modification && (
            <div className="flex gap-3 text-sm">
              <div className="flex-1 bg-muted/30 rounded-lg p-3">
                <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">Easier</p>
                <p className="text-zinc-300 text-xs">{exercise.easier_modification}</p>
              </div>
              <div className="flex-1 bg-muted/30 rounded-lg p-3">
                <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">Advanced</p>
                <p className="text-zinc-300 text-xs">{exercise.harder_progression}</p>
              </div>
            </div>
          )}

          {exercise.tempo && (
            <p className="text-xs text-zinc-500">Tempo: <span className="text-zinc-300">{exercise.tempo}</span></p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-muted/20">
        <button
          onClick={() => setCompleted(!completed)}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
            completed ? 'bg-teal/10 text-teal' : 'bg-muted text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Check className="w-3.5 h-3.5" /> {completed ? 'Completed' : 'Mark Complete'}
        </button>
        {exercise.video_url && (
          <a href={exercise.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wide bg-muted text-zinc-400 hover:text-zinc-200 transition-all">
            <Play className="w-3.5 h-3.5" /> Video
          </a>
        )}
        {onReplace && (
          <button
            onClick={() => onReplace(exercise, index)}
            disabled={replacing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wide bg-muted text-zinc-400 hover:text-teal hover:bg-teal/5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${replacing ? 'animate-spin' : ''}`} /> {replacing ? 'Replacing...' : 'Replace'}
          </button>
        )}
      </div>
    </div>
  );
}