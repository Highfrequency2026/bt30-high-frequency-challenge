import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Dumbbell, AlertCircle, Check, Play, Sparkles, Heart, Plus, Youtube } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { getExerciseImage } from '@/data/exerciseImages';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToWorkout, setAddingToWorkout] = useState(false);

  useEffect(() => {
    base44.entities.Exercise.get(id)
      .then(setExercise)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Check favorite status from localStorage
  useEffect(() => {
    if (!exercise) return;
    try {
      const favorites = JSON.parse(localStorage.getItem('hf_exercise_favorites') || '[]');
      setIsFavorite(favorites.includes(exercise.id));
    } catch {}
  }, [exercise]);

  function toggleFavorite() {
    try {
      const favorites = JSON.parse(localStorage.getItem('hf_exercise_favorites') || '[]');
      const idx = favorites.indexOf(exercise.id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        setIsFavorite(false);
        toast({ title: 'Removed from favorites' });
      } else {
        favorites.push(exercise.id);
        setIsFavorite(true);
        toast({ title: 'Added to favorites' });
      }
      localStorage.setItem('hf_exercise_favorites', JSON.stringify(favorites));
    } catch {
      toast({ title: 'Could not update favorites', variant: 'destructive' });
    }
  }

  async function addToWorkout() {
    setAddingToWorkout(true);
    try {
      await base44.entities.SavedWorkout.create({
        workout_title: exercise.name,
        exercises: [{
          name: exercise.name,
          target_muscles: [exercise.target, ...(exercise.secondary_muscles || [])].filter(Boolean),
          equipment: exercise.equipment,
          instructions: exercise.instruction_steps_en || [],
          video_url: exercise.gif_url || '',
          thumbnail_url: getExerciseImage(exercise),
        }],
        source: 'manual',
      });
      toast({ title: 'Added to your saved workouts!' });
    } catch (err) {
      toast({ title: 'Could not save workout', description: err.message, variant: 'destructive' });
    } finally {
      setAddingToWorkout(false);
    }
  }

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

  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.name + ' proper form tutorial')}`;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
        <Link to="/hf-ai" className="hover:text-teal transition-colors">HF AI Trainer</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/hf-ai/library" className="hover:text-teal transition-colors">Exercise Library</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400 truncate capitalize">{exercise.name}</span>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-background p-6 md:p-8 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">HF AI Trainer</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-white mb-2 capitalize">{exercise.name}</h1>
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-zinc-400">
          {exercise.target && <span className="capitalize">📍 Target: {exercise.target}</span>}
          {exercise.muscle_group && <span className="capitalize">💪 {exercise.muscle_group}</span>}
          {exercise.equipment && <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3 text-teal" /><span className="capitalize">{exercise.equipment}</span></span>}
          {exercise.body_part && <span className="capitalize">🦵 {exercise.body_part}</span>}
        </div>
      </div>

      {/* Animated demonstration */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        <div className="relative h-64 md:h-80 bg-muted flex items-center justify-center">
          <img
            src={getExerciseImage(exercise)}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
          {exercise.attribution && (
            <span className="absolute bottom-2 right-2 text-[9px] text-zinc-500 bg-black/60 px-2 py-1 rounded">
              {exercise.attribution}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addToWorkout}
          disabled={addingToWorkout}
          className="inline-flex items-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-teal/90 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> {addingToWorkout ? 'Adding...' : 'Add to Workout'}
        </button>
        <button
          onClick={toggleFavorite}
          className={`inline-flex items-center gap-2 font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg border transition-all ${
            isFavorite ? 'bg-teal/10 text-teal border-teal/30' : 'border-border text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-teal' : ''}`} /> {isFavorite ? 'Favorited' : 'Favorite'}
        </button>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-border text-zinc-400 font-bold text-sm tracking-wider uppercase px-6 py-3 rounded-lg hover:text-red-400 hover:border-red-400/30 transition-all"
        >
          <Youtube className="w-4 h-4" /> Video
        </a>
      </div>

      {/* Secondary muscles */}
      {exercise.secondary_muscles?.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3">Secondary Muscles</h2>
          <div className="flex flex-wrap gap-2">
            {exercise.secondary_muscles.map((muscle, i) => (
              <span key={i} className="text-xs text-zinc-300 bg-muted px-3 py-1 rounded-full capitalize">{muscle}</span>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {exercise.instruction_steps_en?.length > 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-4">Step-by-Step Instructions</h2>
          <ol className="space-y-3">
            {exercise.instruction_steps_en.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal/10 text-teal font-bold text-xs flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-zinc-300 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : exercise.instructions_en && (
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-4">Instructions</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">{exercise.instructions_en}</p>
        </div>
      )}

      {/* Multilingual instructions */}
      {(exercise.instructions_es || exercise.instructions_fr) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {exercise.instructions_es && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">Español</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">{exercise.instructions_es}</p>
            </div>
          )}
          {exercise.instructions_fr && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">Français</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">{exercise.instructions_fr}</p>
            </div>
          )}
        </div>
      )}

      {/* Attribution */}
      {exercise.attribution && (
        <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-relaxed bg-muted/30 rounded-lg p-3 mb-6">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>Media attribution: {exercise.attribution}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-relaxed bg-muted/30 rounded-lg p-3">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>This information is general fitness education and is not medical advice. Always consult a healthcare professional before starting any exercise program.</p>
      </div>
    </div>
  );
}