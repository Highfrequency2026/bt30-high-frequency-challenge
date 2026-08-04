import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight, Check, Clock, TrendingUp, Dumbbell, Lightbulb, Heart, X, Loader2, Radio } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { BRE_IMG, workoutDays } from '@/data/challengeData';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';
import { useBT30Access } from '@/hooks/useBT30Access';

export default function WorkoutDetail() {
  const { day } = useParams();
  const dayNum = parseInt(day) || 1;
  const workout = workoutDays.find(d => d.day === dayNum) || workoutDays[0];
  const { isCompleted, toggleDay } = useWorkoutProgress();
  const { hasAccess, checking } = useBT30Access();
  const completed = isCompleted(dayNum);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const openVideo = () => {
    setShowVideo(true);
    setVideoLoading(true);
    setIsPlaying(false);
    setProgress(0);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setVideoLoading(false);
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    if (!showVideo || !videoLoading) return;
    const timer = setTimeout(() => {
      setVideoLoading(false);
      setIsPlaying(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [showVideo, videoLoading]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 100 : p + 0.5);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-border border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/programs/bt30" replace />;
  }

  const isRest = workout.type === 'rest';
  const prevDay = dayNum > 1 ? dayNum - 1 : null;
  const nextDay = dayNum < 30 ? dayNum + 1 : null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="relative h-[340px] overflow-hidden">
        <Image src={BRE_IMG} alt={workout.title} fittingType="fill" focalPointY={0.25} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-5xl mx-auto">
          <Link to="/programs/bt30" className="text-xs text-zinc-400 hover:text-teal transition-colors mb-3 inline-flex items-center gap-1">
            <ChevronLeft className="w-3 h-3" /> BT30 Program
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-display text-5xl text-white">{String(workout.day).padStart(2, '0')}</span>
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold block">Week {workout.week} · Day {workout.day}</span>
              <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">{workout.title}</h1>
            </div>
          </div>
          <p className="text-sm text-zinc-300 max-w-lg mb-4">{workout.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><Dumbbell className="w-3.5 h-3.5 text-teal" />{workout.focus}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal" />{workout.duration}</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-teal" />{workout.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        {isRest ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-teal" />
            </div>
            <h2 className="font-display text-4xl text-white mb-3">Rest & Recover</h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">{workout.coachTip}</p>
            <button
              onClick={() => toggleDay(dayNum)}
              className={`inline-flex items-center gap-2 font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg transition-all ${
                completed ? 'bg-teal text-white' : 'border border-platinum/30 text-platinum hover:bg-white/5'
              }`}
            >
              {completed ? <><Check className="w-4 h-4" /> Rest Day Complete</> : 'Mark Complete'}
            </button>
          </div>
        ) : (
          <>
            {/* Watch Video Button */}
            <button
              onClick={openVideo}
              className="group w-full flex items-center justify-between gap-4 bg-gradient-to-r from-teal/15 to-transparent border border-teal/30 rounded-xl p-5 mb-8 hover:border-teal/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Video Library</p>
                  <h3 className="font-bold text-white">Watch Day {workout.day} Workout</h3>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-teal group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Exercises */}
            {workout.exercises.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl text-white mb-4">Exercises</h2>
                <div className="space-y-2">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="flex items-center gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
                        <span className="text-xs font-black text-teal">{ex.id}</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white text-sm">{ex.name}</h4>
                        {ex.notes && <p className="text-xs text-zinc-500 mt-0.5">{ex.notes}</p>}
                      </div>
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-[9px] tracking-widest uppercase text-zinc-500">Sets</p>
                          <p className="text-sm font-bold text-white">{ex.sets}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] tracking-widest uppercase text-zinc-500">Reps</p>
                          <p className="text-sm font-bold text-white">{ex.reps}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cardio & Core */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {workout.cardio && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-teal" />
                    <h4 className="text-[10px] tracking-widest uppercase text-zinc-400 font-bold">Post Workout Cardio</h4>
                  </div>
                  <p className="text-sm text-white">{workout.cardio}</p>
                </div>
              )}
              {workout.coreWorkout && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-teal" />
                    <h4 className="text-[10px] tracking-widest uppercase text-zinc-400 font-bold">Core Workout</h4>
                  </div>
                  <p className="text-sm text-white">{workout.coreWorkout}</p>
                </div>
              )}
            </div>

            {/* Coach Tip */}
            <div className="bg-gradient-to-br from-teal/10 to-transparent border border-teal/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-teal font-bold mb-1">Coach Tip · Mike T</h4>
                  <p className="text-sm text-zinc-200 italic leading-relaxed">"{workout.coachTip}"</p>
                </div>
              </div>
            </div>

            {/* Complete Button */}
            <button
              onClick={() => toggleDay(dayNum)}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm tracking-wider uppercase py-4 rounded-lg transition-all ${
                completed ? 'bg-teal text-white' : 'border border-platinum/30 text-platinum hover:bg-white/5'
              }`}
            >
              {completed ? <><Check className="w-4 h-4" /> Workout Complete</> : 'Mark Workout Complete'}
            </button>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          {prevDay ? (
            <Link to={`/workout/${prevDay}`} className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-zinc-500 hover:text-teal transition-colors">
              <ChevronLeft className="w-4 h-4" /> Day {prevDay}
            </Link>
          ) : <span />}
          {nextDay ? (
            <Link to={`/workout/${nextDay}`} className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-zinc-500 hover:text-teal transition-colors">
              Day {nextDay} <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to="/programs/bt30" className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase bg-teal text-white px-4 py-2 rounded-lg">
              Finish 🎉
            </Link>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeVideo}
        >
          <div
            className="w-full max-w-3xl bg-card border border-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-black" />

              {videoLoading ? (
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-teal animate-spin" />
                  <p className="text-xs text-zinc-400 tracking-wide">Loading Day {workout.day} workout...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-20 h-20 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center hover:bg-teal/30 hover:scale-105 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    )}
                  </button>
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Radio className="w-32 h-32 text-teal/5" />
                    </div>
                  )}
                </>
              )}

              <button
                onClick={closeVideo}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 border border-border flex items-center justify-center hover:bg-black/70 transition-colors z-20"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {!videoLoading && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="text-white">
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs text-white/60 font-medium">Day {workout.day}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white text-lg">Day {workout.day}: {workout.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{workout.duration}</span>
                <span className="flex items-center gap-1"><Dumbbell className="w-3.5 h-3.5" />{workout.focus}</span>
                <span className="flex items-center gap-1"><Radio className="w-3.5 h-3.5" />Instructional Video</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}