import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Dumbbell, Filter, X, ChevronRight, Sparkles, Dumbbell as DumbbellIcon, Play, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getExerciseImage } from '@/data/exerciseImages';

const PAGE_SIZE = 24;

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [equipment, setEquipment] = useState('');
  const [target, setTarget] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [bodyweightOnly, setBodyweightOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    base44.entities.Exercise.list('-created_date', 1000)
      .then(data => {
        setExercises(data || []);
      })
      .catch(err => {
        console.error('Failed to load exercises:', err);
        setError('Could not load exercises. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract filter options
  const filterOptions = useMemo(() => {
    const extract = (field) => {
      const vals = exercises.map(e => e[field]).filter(Boolean);
      return [...new Set(vals)].sort();
    };
    return {
      bodyParts: extract('body_part'),
      equipment: extract('equipment'),
      targets: extract('target'),
      muscleGroups: extract('muscle_group'),
    };
  }, [exercises]);

  // Apply filters
  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      if (search) {
        const q = search.toLowerCase();
        if (!(ex.name || '').toLowerCase().includes(q)) return false;
      }
      if (bodyPart && ex.body_part !== bodyPart) return false;
      if (equipment && ex.equipment !== equipment) return false;
      if (target && ex.target !== target) return false;
      if (muscleGroup && ex.muscle_group !== muscleGroup) return false;
      if (bodyweightOnly && ex.equipment !== 'body weight') return false;
      if (featuredOnly && !ex.is_featured) return false;
      return true;
    });
  }, [exercises, search, bodyPart, equipment, target, muscleGroup, bodyweightOnly, featuredOnly]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const activeFilters = [bodyPart, equipment, target, muscleGroup, bodyweightOnly ? 'bodyweight' : '', featuredOnly ? 'featured' : ''].filter(Boolean);

  function clearFilters() {
    setBodyPart('');
    setEquipment('');
    setTarget('');
    setMuscleGroup('');
    setBodyweightOnly(false);
    setFeaturedOnly(false);
    setSearch('');
  }

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, bodyPart, equipment, target, muscleGroup, bodyweightOnly, featuredOnly]);

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
          placeholder="Search by exercise name..."
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
        />
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setBodyweightOnly(!bodyweightOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            bodyweightOnly ? 'bg-teal text-white border-teal' : 'bg-card text-zinc-400 border-border hover:border-teal/30'
          }`}
        >
          Bodyweight Only
        </button>
        <button
          onClick={() => setFeaturedOnly(!featuredOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            featuredOnly ? 'bg-teal text-white border-teal' : 'bg-card text-zinc-400 border-border hover:border-teal/30'
          }`}
        >
          Featured
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border bg-card text-zinc-400 border-border hover:border-teal/30 transition-all"
        >
          <Filter className="w-3 h-3" /> {showFilters ? 'Hide' : 'Show'} Filters
          {activeFilters.length > 0 && <span className="bg-teal/20 text-teal px-1.5 rounded-full text-[10px]">{activeFilters.length}</span>}
        </button>
        {activeFilters.length > 0 && (
          <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-destructive transition-colors">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Detailed filters */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
          <FilterDropdown label="Body Part" value={bodyPart} options={filterOptions.bodyParts} onChange={setBodyPart} />
          <FilterDropdown label="Equipment" value={equipment} options={filterOptions.equipment} onChange={setEquipment} />
          <FilterDropdown label="Target Muscle" value={target} options={filterOptions.targets} onChange={setTarget} />
          <FilterDropdown label="Muscle Group" value={muscleGroup} options={filterOptions.muscleGroups} onChange={setMuscleGroup} />
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-zinc-500 mb-4">{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
              <div className="h-40 bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <X className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-teal text-sm">Try again</button>
        </div>
      ) : visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visible.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="inline-flex items-center gap-2 border border-border text-zinc-400 font-bold text-xs uppercase px-6 py-3 rounded-lg hover:text-teal hover:border-teal/30 transition-all"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <DumbbellIcon className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No exercises match your filters.</p>
          <p className="text-zinc-600 text-xs mt-1">Try adjusting your search or clearing filters.</p>
        </div>
      )}
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
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function ExerciseCard({ exercise }) {
  const imgSrc = getExerciseImage(exercise);

  return (
    <Link
      to={`/hf-ai/exercise/${exercise.id}`}
      className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-teal/30 transition-all"
    >
      {/* Media */}
      <div className="relative h-40 bg-muted overflow-hidden">
        <img
          src={imgSrc}
          alt={exercise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {exercise.is_featured && (
          <span className="absolute top-2 right-2 text-[9px] tracking-wide uppercase text-white bg-teal px-2 py-0.5 rounded-full font-bold">Featured</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white text-sm mb-1 group-hover:text-teal transition-colors line-clamp-1 capitalize">{exercise.name}</h3>
        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 mb-2">
          {exercise.body_part && <span className="capitalize">{exercise.body_part}</span>}
          {exercise.equipment && (
            <>
              <span>•</span>
              <span className="capitalize">{exercise.equipment}</span>
            </>
          )}
        </div>
        {exercise.target && (
          <p className="text-xs text-teal mb-2 capitalize">Target: {exercise.target}</p>
        )}
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 group-hover:text-teal transition-colors">
          <Eye className="w-3 h-3" /> View Exercise
        </div>
      </div>
    </Link>
  );
}