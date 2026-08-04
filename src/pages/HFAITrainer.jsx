import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, Dumbbell, Loader2, Wand2, AlertCircle, User, Clock, Library, History, Bookmark } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import QuickSelect from '@/components/hf-ai/QuickSelect';
import WorkoutDisplay from '@/components/hf-ai/WorkoutDisplay';
import { FITNESS_GOALS, BODY_AREAS, EQUIPMENT_OPTIONS, EXPERIENCE_LEVELS, DURATION_OPTIONS } from '@/data/hfAiData';

export default function HFAITrainer() {
  const { toast } = useToast();
  const [mode, setMode] = useState('build_workout');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [profile, setProfile] = useState(null);

  // Form state
  const [fitnessGoal, setFitnessGoal] = useState(null);
  const [bodyArea, setBodyArea] = useState(null);
  const [experience, setExperience] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [workoutLocation, setWorkoutLocation] = useState(null);
  const [duration, setDuration] = useState(null);
  const [daysPerWeek, setDaysPerWeek] = useState(null);
  const [injuries, setInjuries] = useState('');
  const [preferences, setPreferences] = useState('');
  const [avoidExercises, setAvoidExercises] = useState('');
  const [customRequest, setCustomRequest] = useState('');

  useEffect(() => {
    base44.entities.FitnessProfile.list()
      .then(profiles => { if (profiles.length > 0) setProfile(profiles[0]); })
      .catch(() => {});
  }, []);

  const buildInput = () => ({
    fitness_goal: fitnessGoal,
    body_area: bodyArea,
    experience_level: experience || profile?.experience_level,
    equipment,
    workout_location: workoutLocation || profile?.training_location,
    duration,
    days_per_week: daysPerWeek,
    injuries: injuries || profile?.injuries_limitations,
    exercise_preferences: preferences,
    exercises_to_avoid: avoidExercises ? avoidExercises.split(',').map(s => s.trim()) : (profile?.exercises_to_avoid || []),
    custom_request: customRequest,
    profile,
  });

  const handleGenerate = async (isRegenerate = false) => {
    if (!customRequest && !fitnessGoal && !bodyArea) {
      toast({ title: 'Please select a goal or describe your request', variant: 'destructive' });
      return;
    }
    const setLoadingState = isRegenerate ? setRegenerating : setLoading;
    setLoadingState(true);
    setWorkout(null);
    try {
      const response = await base44.functions.invoke('hf-ai-trainer', {
        mode,
        input: buildInput()
      });
      setWorkout(response.data);
    } catch (err) {
      toast({ title: 'Failed to generate workout', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingState(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.SavedWorkout.create({
        workout_title: workout.workout_title,
        summary: workout.summary,
        estimated_duration: workout.estimated_duration,
        difficulty: workout.difficulty,
        training_goal: workout.training_goal,
        equipment_needed: workout.equipment_needed || [],
        warmup: workout.warmup,
        exercises: workout.exercises || [],
        finisher: workout.finisher,
        cooldown: workout.cooldown,
        trainer_notes: workout.trainer_notes,
        safety_notes: workout.safety_notes,
        source: 'ai_generated'
      });
      toast({ title: 'Workout saved', description: 'Find it in your Saved Workouts' });
    } catch (err) {
      toast({ title: 'Failed to save', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleReplaceExercise = async (exercise, index) => {
    setReplacingIndex(index);
    try {
      const response = await base44.functions.invoke('hf-ai-trainer', {
        mode: 'replace_exercise',
        input: {
          original_exercise: exercise,
          workout_context: workout.exercises,
          equipment,
          injuries: injuries || profile?.injuries_limitations,
          experience_level: experience || profile?.experience_level,
          exercises_to_avoid: avoidExercises ? avoidExercises.split(',').map(s => s.trim()) : (profile?.exercises_to_avoid || []),
          profile
        }
      });
      const newExercises = [...workout.exercises];
      newExercises[index] = response.data;
      setWorkout({ ...workout, exercises: newExercises });
      toast({ title: 'Exercise replaced', description: response.data.name });
    } catch (err) {
      toast({ title: 'Failed to replace exercise', description: err.message, variant: 'destructive' });
    } finally {
      setReplacingIndex(null);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Powered by AI</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl text-white mb-3">HF AI Trainer</h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">Your intelligent exercise finder and personal workout builder. Tell us your goals and let AI craft the perfect session.</p>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { to: '/hf-ai/library', icon: Library, label: 'Exercises' },
          { to: '/hf-ai/saved', icon: Bookmark, label: 'Saved' },
          { to: '/hf-ai/history', icon: History, label: 'History' },
          { to: '/hf-ai/profile', icon: User, label: 'Profile' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to} className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl py-3 hover:border-teal/30 transition-all">
              <Icon className="w-4 h-4 text-teal" />
              <span className="text-[10px] text-zinc-400 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mode Toggle */}
      <div className="flex p-1 bg-card border border-border rounded-xl mb-8 max-w-md mx-auto">
        <button
          onClick={() => setMode('build_workout')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${mode === 'build_workout' ? 'bg-teal text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Dumbbell className="w-4 h-4" /> Build My Workout
        </button>
        <button
          onClick={() => setMode('find_exercise')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${mode === 'find_exercise' ? 'bg-teal text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Search className="w-4 h-4" /> Find an Exercise
        </button>
      </div>

      {/* Form */}
      {!workout && (
        <div className="space-y-6">
          {/* Custom Request */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2 block">Custom Request <span className="text-zinc-600 normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={customRequest}
              onChange={e => setCustomRequest(e.target.value)}
              placeholder="e.g. I need a 30-minute glute workout using bands and dumbbells. I have sensitive knees."
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50 resize-none"
            />
            <p className="text-[10px] text-zinc-600 mt-2">Or use the quick selections below to specify your preferences.</p>
          </div>

          {/* Goal */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Fitness Goal</label>
            <QuickSelect options={FITNESS_GOALS} value={fitnessGoal} onChange={setFitnessGoal} multi={false} />
          </div>

          {/* Body Area */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Target Body Area</label>
            <QuickSelect options={BODY_AREAS} value={bodyArea} onChange={setBodyArea} multi={false} columns={2} />
          </div>

          {/* Experience */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Experience Level</label>
            <QuickSelect options={EXPERIENCE_LEVELS} value={experience} onChange={setExperience} multi={false} columns={3} />
          </div>

          {/* Equipment */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Available Equipment</label>
            <QuickSelect options={EQUIPMENT_OPTIONS} value={equipment} onChange={setEquipment} multi={true} columns={3} />
          </div>

          {/* Duration */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Workout Duration</label>
            <QuickSelect options={DURATION_OPTIONS} value={duration} onChange={setDuration} multi={false} columns={3} />
          </div>

          {/* Days per week */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-3 block">Workout Days Per Week</label>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => setDaysPerWeek(daysPerWeek === String(n) ? null : String(n))}
                  className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all border ${daysPerWeek === String(n) ? 'bg-teal text-white border-teal' : 'bg-card text-zinc-400 border-border hover:border-teal/30'}`}
                >
                  {n} days
                </button>
              ))}
            </div>
          </div>

          {/* Injuries & Limitations */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2 block">Injuries or Movement Limitations</label>
            <input
              value={injuries}
              onChange={e => setInjuries(e.target.value)}
              placeholder="e.g. sensitive knees, lower back pain, shoulder impingement"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
            />
          </div>

          {/* Preferences & Avoid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2 block">Exercise Preferences</label>
              <input
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                placeholder="e.g. prefer compound movements"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <label className="text-[10px] tracking-widest uppercase text-teal font-bold mb-2 block">Exercises to Avoid</label>
              <input
                value={avoidExercises}
                onChange={e => setAvoidExercises(e.target.value)}
                placeholder="e.g. burpees, box jumps"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-xl hover:bg-teal/90 transition-all disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Wand2 className="w-5 h-5" /> {mode === 'build_workout' ? 'Build My Workout' : 'Find Exercises'}</>}
          </button>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-relaxed bg-muted/30 rounded-lg p-3">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <p>This information is general fitness education and is not medical advice. Always consult a healthcare professional before starting any exercise program.</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !workout && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-border border-t-teal rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-teal absolute inset-0 m-auto" />
          </div>
          <p className="text-sm text-zinc-500 mt-4">Crafting your workout...</p>
        </div>
      )}

      {/* Workout Display */}
      {workout && (
        <WorkoutDisplay
          workout={workout}
          onRegenerate={() => handleGenerate(true)}
          onSave={handleSave}
          saving={saving}
          regenerating={regenerating}
          onReplaceExercise={handleReplaceExercise}
          replacingIndex={replacingIndex}
        />
      )}
    </div>
  );
}