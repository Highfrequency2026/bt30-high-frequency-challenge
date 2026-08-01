import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'bt30_completed_workouts';

function readCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useWorkoutProgress() {
  const [completedDays, setCompletedDays] = useState(readCompleted);

  useEffect(() => {
    const handler = () => setCompletedDays(readCompleted());
    window.addEventListener('storage', handler);
    window.addEventListener('bt30-progress-changed', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('bt30-progress-changed', handler);
    };
  }, []);

  const toggleDay = useCallback((dayNum) => {
    const current = readCompleted();
    const next = current.includes(dayNum)
      ? current.filter(d => d !== dayNum)
      : [...current, dayNum];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCompletedDays(next);
    window.dispatchEvent(new Event('bt30-progress-changed'));
  }, []);

  const isCompleted = useCallback((dayNum) => completedDays.includes(dayNum), [completedDays]);

  return { completedDays, completedCount: completedDays.length, toggleDay, isCompleted };
}