import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Dumbbell, Clock, AlertCircle, Check, Play, Sparkles, Youtube } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ExerciseDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Exercise.get(id)
      .then(setExercise)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-zinc-500">Exercise not found.</p>
        <Link to="/hf-ai/library" className="text-teal text-sm mt-2 inline-block">Back to Library</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
        <Link to="/hf-ai" className="hover:text-teal transition-colors">HF AI Trainer</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/hf-ai/library" className="hover:text-teal transition-colors">Exercise Library</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400 truncate">{exercise.name}</span>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">HF AI Trainer</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-white mb-2">{exercise.name}</h1>
        {exercise.target_muscles?.length > 0 && <p className="text-sm text-teal">{exercise.target_muscles.join(' · ')}</p>}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-zinc-400">
          {exercise.muscle_group && <span className="capitalize">📍 {exercise.muscle_group.replace(/_/g, ' ')}</span>}
          {exercise.equipment && <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-teal" /><span className="capitalize">{exercise.equipment.replace(/_/g, ' ')}</span></span>}
          {exercise.difficulty && <span className="capitalize">📊 {exercise.difficulty}</span>}
          {exercise.movement_type && <span className="capitalize">🔄 {exercise.movement_type.replace(/_/g, ' ')}</span>}
          {exercise.workout_location && <span className="capitalize">🏢 {exercise.workout_location}</span>}
        </div>
        {exercise.description && <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{exercise.description}</p>}
      </div>

      {/* Quick Stats */}
      {(exercise.sets_recommended || exercise.reps_recommended || exercise.rest_seconds || exercise.tempo) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {exercise.sets_recommended && <Stat label="Sets" value={exercise.sets_recommended} />}
          {exercise.reps_recommended && <Stat label="Reps" value={exercise.reps_recommended} />}
          {exercise.rest_seconds > 0 && <Stat label="Rest" value={`${exercise.rest_seconds}s`} />}
          {exercise.tempo && <Stat label="Tempo" value={exercise.tempo} />}
        </div>
      )}

      {/* Instructions */}
      {exercise.instructions?.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-4">Step-by-Step Instructions</h2>
          <ol className="space-y-3">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/10 text-teal font-bold text-xs flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-zinc-300 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Form Tips */}
      {exercise.form_tips?.length > 0 && (
        <div className="rounded-2xl border border-teal/20 bg-teal/5 p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-4">Form Tips</h2>
          <ul className="space-y-2">
            {exercise.form_tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <Check className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" /> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {exercise.common_mistakes?.length > 0 && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-destructive font-bold mb-4 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Common Mistakes</h2>
          <ul className="space-y-2">
            {exercise.common_mistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="text-destructive flex-shrink-0">✕</span> {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {exercise.easier_modification && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">Easier Version</h2>
            <p className="text-sm text-zinc-300">{exercise.easier_modification}</p>
          </div>
        )}
        {exercise.harder_progression && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">Advanced Version</h2>
            <p className="text-sm text-zinc-300">{exercise.harder_progression}</p>
          </div>
        )}
      </div>

      {/* Video Reference — always shown */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        {(() => {
          const videoUrl = exercise.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' proper form tutorial')}`;
          const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
          const thumb = ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : exercise.thumbnail_url;
          const isSearch = !exercise.video_url;
          return (
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block group">
              {thumb ? (
                <div className="relative">
                  <img src={thumb} alt={`${exercise.name} tutorial`} className="w-full h-56 md:h-72 object-cover" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-white font-bold bg-black/70 px-2.5 py-1 rounded">
                    {isSearch ? 'Search YouTube' : 'Watch Tutorial'}
                  </span>
                </div>
              ) : (
                <div className="w-full h-28 bg-gradient-to-r from-red-600/20 to-red-900/20 flex items-center justify-center">
                  <Youtube className="w-10 h-10 text-red-500" />
                </div>
              )}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-bold text-white">{isSearch ? `Find "${exercise.name}" on YouTube` : 'Watch Form Tutorial'}</span>
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-teal transition-colors flex items-center gap-1">
                  <Play className="w-3 h-3" /> Play
                </span>
              </div>
            </a>
          );
        })()}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-relaxed bg-muted/30 rounded-lg p-3">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>This information is general fitness education and is not medical advice. Always consult a healthcare professional before starting any exercise program.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-zinc-500 tracking-wide uppercase mt-1">{label}</p>
    </div>
  );
}