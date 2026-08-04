import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Save, ChevronRight, Sparkles, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import QuickSelect from '@/components/hf-ai/QuickSelect';
import { FITNESS_GOALS, EXPERIENCE_LEVELS, EQUIPMENT_OPTIONS, AGE_RANGES, DAYS_OF_WEEK, WORKOUT_LOCATIONS } from '@/data/hfAiData';

export default function FitnessProfile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    age_range: null,
    height: '',
    weight: '',
    primary_goal: null,
    experience_level: null,
    preferred_training_days: [],
    available_equipment: [],
    training_location: null,
    injuries_limitations: '',
    favorite_exercises: [],
    exercises_to_avoid: [],
  });

  const [favoriteInput, setFavoriteInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');

  useEffect(() => {
    base44.entities.FitnessProfile.list()
      .then(profiles => {
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setForm({
            first_name: profiles[0].first_name || '',
            age_range: profiles[0].age_range || null,
            height: profiles[0].height || '',
            weight: profiles[0].weight || '',
            primary_goal: profiles[0].primary_goal || null,
            experience_level: profiles[0].experience_level || null,
            preferred_training_days: profiles[0].preferred_training_days || [],
            available_equipment: profiles[0].available_equipment || [],
            training_location: profiles[0].training_location || null,
            injuries_limitations: profiles[0].injuries_limitations || '',
            favorite_exercises: profiles[0].favorite_exercises || [],
            exercises_to_avoid: profiles[0].exercises_to_avoid || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.first_name || !form.primary_goal || !form.experience_level) {
      toast({ title: 'Please fill in required fields', description: 'Name, primary goal, and experience level are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (profile) {
        await base44.entities.FitnessProfile.update(profile.id, form);
      } else {
        await base44.entities.FitnessProfile.create(form);
      }
      toast({ title: 'Profile saved', description: 'Your fitness profile has been updated.' });
    } catch (err) {
      toast({ title: 'Failed to save', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addFavorite = () => {
    if (favoriteInput.trim()) {
      update('favorite_exercises', [...form.favorite_exercises, favoriteInput.trim()]);
      setFavoriteInput('');
    }
  };

  const addAvoid = () => {
    if (avoidInput.trim()) {
      update('exercises_to_avoid', [...form.exercises_to_avoid, avoidInput.trim()]);
      setAvoidInput('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50";

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/hf-ai" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal transition-colors mb-4">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to AI Trainer
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">HF AI Trainer</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-white">Fitness Profile</h1>
        <p className="text-zinc-400 text-sm mt-2">Your profile helps the AI generate personalized workouts.</p>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold">Basic Information</h2>
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">First Name <span className="text-teal">*</span></label>
            <input value={form.first_name} onChange={e => update('first_name', e.target.value)} placeholder="Your name" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Age Range</label>
              <select value={form.age_range || ''} onChange={e => update('age_range', e.target.value || null)} className={inputClass}>
                <option value="">Select...</option>
                {AGE_RANGES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Height</label>
              <input value={form.height} onChange={e => update('height', e.target.value)} placeholder="e.g. 5'8&quot;" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Weight</label>
              <input value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="e.g. 165 lbs" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Goals & Experience */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold">Goals & Experience</h2>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Primary Goal <span className="text-teal">*</span></label>
            <QuickSelect options={FITNESS_GOALS} value={form.primary_goal} onChange={v => update('primary_goal', v)} />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Experience Level <span className="text-teal">*</span></label>
            <QuickSelect options={EXPERIENCE_LEVELS} value={form.experience_level} onChange={v => update('experience_level', v)} columns={3} />
          </div>
        </div>

        {/* Training Preferences */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold">Training Preferences</h2>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Training Location</label>
            <QuickSelect options={WORKOUT_LOCATIONS} value={form.training_location} onChange={v => update('training_location', v)} columns={3} />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Available Equipment</label>
            <QuickSelect options={EQUIPMENT_OPTIONS} value={form.available_equipment} onChange={v => update('available_equipment', v)} multi columns={3} />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-2 block">Preferred Training Days</label>
            <QuickSelect options={DAYS_OF_WEEK} value={form.preferred_training_days} onChange={v => update('preferred_training_days', v)} multi />
          </div>
        </div>

        {/* Health & Safety */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold">Health & Safety</h2>
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Injuries or Movement Limitations</label>
            <textarea value={form.injuries_limitations} onChange={e => update('injuries_limitations', e.target.value)} placeholder="e.g. sensitive knees, lower back pain, shoulder impingement" rows={3} className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Exercise Preferences */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-[10px] tracking-widest uppercase text-teal font-bold">Exercise Preferences</h2>
          {/* Favorite Exercises */}
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Favorite Exercises</label>
            <div className="flex gap-2">
              <input value={favoriteInput} onChange={e => setFavoriteInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFavorite())} placeholder="Add an exercise..." className={inputClass} />
              <button onClick={addFavorite} className="px-4 bg-teal text-white rounded-lg text-sm font-bold hover:bg-teal/90 transition-all">Add</button>
            </div>
            {form.favorite_exercises.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.favorite_exercises.map((ex, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-teal/10 text-teal text-xs px-2.5 py-1 rounded-full">
                    {ex}
                    <button onClick={() => update('favorite_exercises', form.favorite_exercises.filter((_, idx) => idx !== i))} className="hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Exercises to Avoid */}
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Exercises to Avoid</label>
            <div className="flex gap-2">
              <input value={avoidInput} onChange={e => setAvoidInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAvoid())} placeholder="Add an exercise..." className={inputClass} />
              <button onClick={addAvoid} className="px-4 bg-teal text-white rounded-lg text-sm font-bold hover:bg-teal/90 transition-all">Add</button>
            </div>
            {form.exercises_to_avoid.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.exercises_to_avoid.map((ex, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-destructive/10 text-destructive text-xs px-2.5 py-1 rounded-full">
                    {ex}
                    <button onClick={() => update('exercises_to_avoid', form.exercises_to_avoid.filter((_, idx) => idx !== i))} className="hover:text-foreground">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-[10px] text-zinc-600 leading-relaxed bg-muted/30 rounded-lg p-3">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>This information is general fitness education and is not medical advice. We never diagnose medical conditions. Always consult a healthcare professional before starting any exercise program.</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-xl hover:bg-teal/90 transition-all disabled:opacity-60"
        >
          {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Profile</>}
        </button>
      </div>
    </div>
  );
}