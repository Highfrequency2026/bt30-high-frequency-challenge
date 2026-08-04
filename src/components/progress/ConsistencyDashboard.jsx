import React, { useState, useEffect } from 'react';
import { CalendarCheck, Dumbbell, Flame, Activity, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';
import { workoutDays } from '@/data/challengeData';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function daysAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDateString(date) {
  return date.toISOString().split('T')[0];
}

export default function ConsistencyDashboard() {
  const { completedDays, completedCount } = useWorkoutProgress();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await base44.auth.me();
        const members = await base44.entities.Members.filter({ user_id: user.id });
        const member = members[0];
        if (member) {
          const records = await base44.entities.CheckIns.filter(
            { member_id: member.id, status: 'approved' },
            '-check_in_time',
            50
          );
          if (!cancelled) setCheckIns(records);
        }
      } catch {
        // user may not have a member record yet — show workout-only data
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Build activity map: last 30 days
  const today = new Date();
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getDateString(d);
    const dayCheckIns = checkIns.filter(ci => {
      if (!ci.check_in_time) return false;
      return getDateString(new Date(ci.check_in_time)) === dateStr;
    });
    last30Days.push({ date: d, dateStr, checkInCount: dayCheckIns.length });
  }

  // Calculate streak from check-ins
  let currentStreak = 0;
  for (let i = 0; i < last30Days.length; i++) {
    if (last30Days[i].checkInCount > 0) {
      currentStreak++;
    } else if (i > 0 && last30Days[i - 1].checkInCount > 0) {
      break;
    }
  }

  // Activity feed: merge check-ins and workout milestones
  const workoutMilestones = completedDays
    .filter(d => d <= 30)
    .map(day => {
      const w = workoutDays.find(w => w.day === day);
      return {
        type: 'workout',
        day,
        title: w?.title || `Workout ${day}`,
        week: w?.week || 1,
        sortKey: day,
      };
    });

  const recentCheckIns = checkIns.slice(0, 10).map(ci => ({
    type: 'checkin',
    id: ci.id,
    time: ci.check_in_time,
    location: ci.location,
    method: ci.entry_method,
    sortKey: ci.check_in_time ? new Date(ci.check_in_time).getTime() : 0,
  }));

  const monthCheckIns = checkIns.filter(ci => {
    if (!ci.check_in_time) return false;
    const d = new Date(ci.check_in_time);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;

  const stats = [
    { label: 'Total Check-ins', value: checkIns.length, icon: CalendarCheck },
    { label: 'Gym Days (Month)', value: monthCheckIns, icon: MapPin },
    { label: 'Workouts Done', value: completedCount, icon: Dumbbell },
    { label: 'Day Streak', value: currentStreak, icon: Flame },
  ];

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-teal animate-spin" />
      </div>
    );
  }

  const maxCheckIns = Math.max(...last30Days.map(d => d.checkInCount), 1);

  return (
    <div className="space-y-6">
      {/* Consistency Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-teal" />
              </div>
              <p className="text-3xl font-bold text-white leading-none">{stat.value}</p>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mt-2">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* 30-Day Activity Heatmap */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">30-Day Activity</h3>
        </div>
        <div className="grid grid-cols-10 gap-1.5 mb-3">
          {last30Days.map((d, i) => {
            const intensity = d.checkInCount / maxCheckIns;
            const bg = d.checkInCount === 0
              ? 'bg-muted/30'
              : intensity > 0.66
                ? 'bg-teal'
                : intensity > 0.33
                  ? 'bg-teal/60'
                  : 'bg-teal/30';
            return (
              <div
                key={i}
                title={`${formatDate(d.date)} — ${d.checkInCount} check-in${d.checkInCount !== 1 ? 's' : ''}`}
                className={`aspect-square rounded ${bg} transition-colors hover:ring-2 hover:ring-teal/40`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-600 tracking-widest uppercase font-bold">
          <span>30 days ago</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-muted/30" />
            <div className="w-3 h-3 rounded bg-teal/30" />
            <div className="w-3 h-3 rounded bg-teal/60" />
            <div className="w-3 h-3 rounded bg-teal" />
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>

      {/* Two-column: Activity Feed + Workout Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-white">Recent Activity</h3>
          </div>
          {recentCheckIns.length === 0 && completedDays.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-600 py-8">
              <Activity className="w-8 h-8" />
              <p className="text-xs">No activity yet — check in or complete a workout</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {recentCheckIns.map(item => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">Gym Check-in</p>
                    <p className="text-xs text-zinc-500">
                      {item.location || 'Main Floor'} · {item.method?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-zinc-400">{formatDate(item.time)}</p>
                    <p className="text-[10px] text-zinc-600">{formatTime(item.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BT30 Workout Completion */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-white">BT30™ Completion</h3>
            </div>
            <span className="text-xs text-zinc-500">{completedCount}/30</span>
          </div>
          {completedCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-600 py-8">
              <Dumbbell className="w-8 h-8" />
              <p className="text-xs">Complete your first workout to start tracking</p>
            </div>
          ) : (
            <>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
                <div
                  className="bg-teal h-2 rounded-full transition-all"
                  style={{ width: `${(completedCount / 30) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                  const done = completedDays.includes(day);
                  return (
                    <div
                      key={day}
                      title={`Day ${day}${done ? ' ✓' : ''}`}
                      className={`aspect-square rounded flex items-center justify-center text-[9px] font-bold transition-colors ${
                        done
                          ? 'bg-teal text-white'
                          : 'bg-muted/20 text-zinc-600'
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-3 h-3" /> : day}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}