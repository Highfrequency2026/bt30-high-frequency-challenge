import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Dumbbell, X, Filter, Eye, Loader2, Library } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getExerciseImage } from '@/data/exerciseImages';

export default function FindExercisePanel() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [equipment, setEquipment] = useState('');
  const [target, setTarget] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [bodyweightOnly, setBodyweightOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    base44.entities.Exercise.list('-created_date', 1000)
      .then(data => setExercises(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filterOptions = useMemo(() => {
    const extract = (field) => [...new Set(exercises.map(e => e[field]).filter(Boolean))].sort();
    return {
      bodyParts: extract('body_part'),
      equipment: extract('equipment'),
      targets: extract('target'),
      muscleGroups: extract('muscle_group'),
    };
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      if (search && !(ex.name || '').toLowerCase().includes(search.toLowerCase())) return false;
      if (bodyPart && ex.body_part !== bodyPart) return false;
      if (equipment && ex.equipment !== equipment) return false;
      if (target && ex.target !== target) return false;
      if (muscleGroup && ex.muscle_group !== muscleGroup) return false;
      if (bodyweightOnly && ex.equipment !== 'body weight') return false;
      return true;
    });
  }, [exercises, search, bodyPart, equipment, target, muscleGroup, bodyweightOnly]);

  const activeFilters = [bodyPart, equipment, target, muscleGroup, bodyweightOnly ? 'bodyweight' : ''].filter(Boolean);

  function clearFilters() {
    setBodyPart(''); setEquipment(''); setTarget(''); setMuscleGroup(''); setBodyweightOnly(false); setSearch('');
  }

  return (
    <div className="space-y-5">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for an exercise by name..."
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
        />
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setBodyweightOnly(!bodyweightOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${bodyweightOnly ? 'bg-teal text-white border-teal' : 'bg-card text-zinc-400 border-border hover:border-teal/30'}`}
        >
          Bodyweight Only
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-card text-zinc-400 border-border hover:border-teal/30 transition-all"
        >
          <Filter className="w-3 h-3" /> {showFilters ? 'Hide' : 'More'} Filters
          {activeFilters.length > 0 && <span className="bg-teal/20 text-teal px-1.5 rounded-full text-[10px]">{activeFilters.length}</span>}
        </button>
        {activeFilters.length > 0 && (
          <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-destructive transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Detailed filters */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
          <FilterDropdown label="Body Part" value={bodyPart} options={filterOptions.bodyParts} onChange={setBodyPart} />
          <FilterDropdown label="Equipment" value={equipment} options={filterOptions.equipment} onChange={setEquipment} />
          <FilterDropdown label="Target Muscle" value={target} options={filterOptions.targets} onChange={setTarget} />
          <FilterDropdown label="Muscle Group" value={muscleGroup} options={filterOptions.muscleGroups} onChange={setMuscleGroup} />
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-zinc-500">{loading ? 'Loading...' : `${filtered.length} exercise${filtered.length !== 1 ? 's' : ''} found`}</p>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
              <div className="h-36 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => <ExerciseResultCard key={ex.id} exercise={ex} />)}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No exercises match your search.</p>
          <p className="text-zinc-600 text-xs mt-1">Try adjusting your filters.</p>
        </div>
      )}

      {/* Browse full library link */}
      <div className="text-center pt-2">
        <Link to="/hf-ai/library" className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors">
          <Library className="w-3.5 h-3.5" /> Browse full Exercise Library
        </Link>
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }) {
  return (
    <div>
      <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-2">{label}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal/50"
      >
        <option value="">All</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ExerciseResultCard({ exercise }) {
  const imgSrc = getExerciseImage(exercise);

  return (
    <Link
      to={`/hf-ai/exercise/${exercise.id}`}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-teal/30 transition-all"
    >
      <div className="relative h-36 bg-muted overflow-hidden">
        <img src={imgSrc} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-sm mb-1 group-hover:text-teal transition-colors line-clamp-1 capitalize">{exercise.name}</h3>
        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 mb-2">
          {exercise.body_part && <span className="capitalize">{exercise.body_part}</span>}
          {exercise.equipment && <><span>•</span><span className="capitalize">{exercise.equipment}</span></>}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 group-hover:text-teal transition-colors">
          <Eye className="w-3 h-3" /> View Details
        </div>
      </div>
    </Link>
  );
}