import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Dumbbell, Filter, X, ChevronRight, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { BODY_AREAS, EQUIPMENT_OPTIONS, EXPERIENCE_LEVELS, MOVEMENT_TYPES, WORKOUT_LOCATIONS } from '@/data/hfAiData';

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [movementType, setMovementType] = useState(null);
  const [workoutLocation, setWorkoutLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    base44.entities.Exercise.list('-created_date', 100)
      .then(setExercises)
      .catch(err => {
        console.error('Failed to load exercises:', err);
        setError('Could not load exercises. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = exercises.filter(ex => {
    if (search) {
      const q = search.toLowerCase();
      const haystack = [
        ex.name,
        ex.description,
        ex.muscle_group,
        ex.equipment,
        ex.movement_type,
        ex.difficulty,
        ...(ex.target_muscles || [])
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (muscleGroup && ex.muscle_group !== muscleGroup) return false;
    if (equipment && ex.equipment !== equipment) return false;
    if (difficulty && ex.difficulty !== difficulty) return false;
    if (movementType && ex.movement_type !== movementType) return false;
    if (workoutLocation && ex.workout_location !== workoutLocation) return false;
    return true;
  });

  const activeFilters = [muscleGroup, equipment, difficulty, movementType, workoutLocation].filter(Boolean);
  const clearFilters = () => {
    setMuscleGroup(null); setEquipment(null); setDifficulty(null); setMovementType(null); setWorkoutLocation(null);
  };

  const FilterSection = ({ title, options, value, onChange }) => (
    <div>
      <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(value === opt.id ? null : opt.id)}
            className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all border ${value === opt.id ? 'bg-teal text-white border-teal' : 'bg-card text-zinc-400 border-border hover:border-teal/30'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/hf-ai" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal transition-colors mb-4">
          <ChevronRight className="w-3 h-3 rotate-180" /> Back to AI Trainer
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-teal" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">HF AI Trainer</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-white">Exercise Library</h1>
        <p className="text-zinc-400 text-sm mt-2">Search and filter our complete database of exercises.</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-teal transition-colors"
        >
          <Filter className="w-3.5 h-3.5" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          {activeFilters.length > 0 && <span className="bg-teal/20 text-teal px-1.5 py-0.5 rounded-full text-[10px]">{activeFilters.length}</span>}
        </button>
        {activeFilters.length > 0 && (
          <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-destructive transition-colors">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 mb-6 animate-fade-in">
          <FilterSection title="Muscle Group" options={BODY_AREAS} value={muscleGroup} onChange={setMuscleGroup} />
          <FilterSection title="Equipment" options={EQUIPMENT_OPTIONS} value={equipment} onChange={setEquipment} />
          <FilterSection title="Difficulty" options={EXPERIENCE_LEVELS} value={difficulty} onChange={setDifficulty} />
          <FilterSection title="Movement Type" options={MOVEMENT_TYPES} value={movementType} onChange={setMovementType} />
          <FilterSection title="Workout Location" options={WORKOUT_LOCATIONS} value={workoutLocation} onChange={setWorkoutLocation} />
        </div>
      )}

      {/* Results */}
      <p className="text-xs text-zinc-500 mb-4">{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => (
            <Link key={ex.id} to={`/hf-ai/exercise/${ex.id}`} className="group rounded-2xl border border-border bg-card p-5 hover:border-teal/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-teal" />
                </div>
                <div className="flex gap-1">
                  {ex.difficulty && <span className="text-[9px] tracking-wide uppercase text-zinc-500 bg-muted px-2 py-0.5 rounded-full capitalize">{ex.difficulty}</span>}
                </div>
              </div>
              <h3 className="font-bold text-white text-base mb-1 group-hover:text-teal transition-colors">{ex.name}</h3>
              {ex.target_muscles?.length > 0 && <p className="text-xs text-teal mb-2">{ex.target_muscles.slice(0, 3).join(' · ')}</p>}
              {ex.description && <p className="text-xs text-zinc-500 line-clamp-2">{ex.description}</p>}
              <div className="flex flex-wrap gap-2 mt-3 text-[10px] text-zinc-600">
                <span className="capitalize">{ex.equipment?.replace(/_/g, ' ')}</span>
                <span>•</span>
                <span className="capitalize">{ex.movement_type?.replace(/_/g, ' ')}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Dumbbell className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No exercises match your filters.</p>
          <p className="text-zinc-600 text-xs mt-1">Try adjusting your search or clearing filters.</p>
        </div>
      )}
    </div>
  );
}