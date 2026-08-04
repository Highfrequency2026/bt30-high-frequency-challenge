import React, { useState, useEffect } from 'react';
import { Scale, Camera, TrendingDown, TrendingUp, Minus, Calendar, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { base44 } from '@/api/base44Client';
import { useWorkoutProgress } from '@/hooks/useWorkoutProgress';

const measurementKeys = [
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'bodyFat', label: 'Body Fat %' },
];

function DeltaBadge({ value, unit = '', invertGood = false }) {
  if (value === null || value === undefined || isNaN(value)) return <span className="text-zinc-600 text-xs">—</span>;
  const num = parseFloat(value);
  const isZero = Math.abs(num) < 0.05;
  const isPositive = num > 0;
  const isGood = isZero ? null : invertGood ? !isPositive : isPositive;
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;
  const color = isZero ? 'text-zinc-500' : isGood ? 'text-teal' : 'text-red-400';
  return (
    <span className={`flex items-center gap-1 text-xs font-bold ${color}`}>
      <Icon className="w-3 h-3" />
      {isZero ? '0' : `${isPositive ? '+' : ''}${num.toFixed(1)}`}{unit}
    </span>
  );
}

export default function TransformationDashboard({ entries, photos }) {
  const { completedCount } = useWorkoutProgress();
  const [photoRecords, setPhotoRecords] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  useEffect(() => {
    base44.entities.ProgressPhoto.list('-created_date', 50)
      .then(records => setPhotoRecords(records))
      .catch(() => {})
      .finally(() => setLoadingPhotos(false));
  }, []);

  const first = entries[entries.length - 1];
  const latest = entries[0];
  const hasData = entries.length >= 1;

  const startWeight = first?.weight;
  const currentWeight = latest?.weight;
  const weightDelta = (startWeight && currentWeight) ? currentWeight - startWeight : null;

  const photoCount = photoRecords.length;
  const daysActive = completedCount > 0 ? completedCount : 0;

  const summaryCards = [
    {
      label: 'Weight Journey',
      icon: Scale,
      start: startWeight ? startWeight.toFixed(1) : '—',
      current: currentWeight ? currentWeight.toFixed(1) : '—',
      unit: 'lbs',
      delta: weightDelta,
      invertGood: true,
    },
    {
      label: 'Workouts Done',
      icon: TrendingUp,
      start: '0',
      current: String(completedCount),
      unit: '',
      delta: null,
    },
    {
      label: 'Progress Photos',
      icon: Camera,
      start: '0',
      current: String(photoCount),
      unit: '',
      delta: null,
    },
    {
      label: 'Entries Logged',
      icon: Calendar,
      start: '0',
      current: String(entries.length),
      unit: '',
      delta: null,
    },
  ];

  // Chronological photo timeline (oldest first)
  const timelinePhotos = [...photoRecords].reverse();

  return (
    <div className="space-y-6">
      {/* Transformation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-teal" />
                {card.delta !== null && card.delta !== undefined && (
                  <DeltaBadge value={card.delta} unit={card.unit ? ` ${card.unit}` : ''} invertGood={card.invertGood} />
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-white">{card.start}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600" />
                <span className="text-2xl font-bold text-teal">{card.current}</span>
                {card.unit && <span className="text-xs text-zinc-500">{card.unit}</span>}
              </div>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Measurement Comparison */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Scale className="w-5 h-5 text-teal" />
            <h3 className="font-bold text-white">Body Measurement Changes</h3>
          </div>
          {!hasData ? (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-600 py-8">
              <Scale className="w-8 h-8" />
              <p className="text-xs">Log entries to track measurement changes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {measurementKeys.map(m => {
                const startVal = first?.[m.key] ? parseFloat(first[m.key]) : null;
                const currentVal = latest?.[m.key] ? parseFloat(latest[m.key]) : null;
                const delta = (startVal !== null && currentVal !== null) ? currentVal - startVal : null;
                return (
                  <div key={m.key} className="flex items-center justify-between bg-muted/20 rounded-lg px-4 py-3">
                    <span className="text-xs font-medium text-zinc-300">{m.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{startVal !== null ? startVal.toFixed(1) : '—'}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-600" />
                      <span className="text-sm font-bold text-white">{currentVal !== null ? currentVal.toFixed(1) : '—'}</span>
                      <div className="w-16 text-right">
                        <DeltaBadge value={delta} unit={m.key === 'bodyFat' ? '%' : '"'} invertGood={m.key === 'waist' || m.key === 'bodyFat'} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Photo Timeline */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-white">Transformation Photos</h3>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
          </div>
          {loadingPhotos ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-teal animate-spin" />
            </div>
          ) : timelinePhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 text-zinc-600 py-8">
              <ImageIcon className="w-8 h-8" />
              <p className="text-xs">Upload progress photos to see your timeline</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {timelinePhotos.map((photo, i) => (
                <div key={photo.id} className="flex-shrink-0 w-32">
                  <div className="relative w-32 h-40 rounded-lg overflow-hidden border border-border">
                    <Image src={photo.photo_url} alt={photo.slot || `Photo ${i + 1}`} fittingType="fill" className="w-full h-full" />
                    <span className="absolute bottom-1 left-1 text-[9px] tracking-widest uppercase text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">
                      {photo.slot || 'Progress'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1.5 text-center">
                    {photo.taken_date
                      ? new Date(photo.taken_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : new Date(photo.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}