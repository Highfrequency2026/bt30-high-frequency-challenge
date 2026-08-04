import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Scale, Camera, Award, Flame, Target, Plus, X, Loader2 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { base44 } from '@/api/base44Client';
import ConsistencyDashboard from '@/components/progress/ConsistencyDashboard';
import TransformationDashboard from '@/components/progress/TransformationDashboard';

const measurementFields = [
  { key: 'chest', label: 'Chest', unit: '"' },
  { key: 'waist', label: 'Waist', unit: '"' },
  { key: 'hips', label: 'Hips', unit: '"' },
  { key: 'rightArm', label: 'Right Arm', unit: '"' },
  { key: 'leftArm', label: 'Left Arm', unit: '"' },
  { key: 'rightThigh', label: 'Right Thigh', unit: '"' },
  { key: 'leftThigh', label: 'Left Thigh', unit: '"' },
  { key: 'bodyFat', label: 'Body Fat %', unit: '%' },
];

const photoSlots = ['Before', 'Week 2', 'After'];

const samplePhotos = [
  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
];

const allAchievements = [
  { name: 'First Step', desc: 'Log your first entry', check: (e) => e.length >= 1 },
  { name: 'Consistent', desc: 'Log 3 entries', check: (e) => e.length >= 3 },
  { name: 'Halfway Hero', desc: 'Log 5 entries', check: (e) => e.length >= 5 },
  { name: 'BT30 Champion', desc: 'Log 10+ entries', check: (e) => e.length >= 10 },
];

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [photos, setPhotos] = useState({});
  const [photoRecords, setPhotoRecords] = useState({});
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const fileRefs = useRef({});
  const [form, setForm] = useState({ weight: '', chest: '', waist: '', hips: '', rightArm: '', leftArm: '', leftThigh: '', rightThigh: '', bodyFat: '' });

  useEffect(() => {
    base44.entities.ProgressPhoto.list('-created_date', 50)
      .then(records => {
        const photoMap = {};
        const recordMap = {};
        records.forEach(r => {
          if (r.slot && r.photo_url) {
            photoMap[r.slot] = r.photo_url;
            recordMap[r.slot] = r;
          }
        });
        setPhotos(photoMap);
        setPhotoRecords(recordMap);
      })
      .catch(() => {});
  }, []);

  const latest = entries[0] || null;
  const currentWeight = latest?.weight;
  const weightChange = entries.length >= 2 ? (latest.weight - entries[entries.length - 1].weight).toFixed(1) : '';

  const handleFormChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSaveEntry = () => {
    const weightNum = parseFloat(form.weight);
    if (!weightNum) return;
    const entry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: weightNum,
      chest: form.chest || null,
      waist: form.waist || null,
      hips: form.hips || null,
      rightArm: form.rightArm || null,
      leftArm: form.leftArm || null,
      rightThigh: form.rightThigh || null,
      leftThigh: form.leftThigh || null,
      bodyFat: form.bodyFat || null,
    };
    setEntries(prev => [entry, ...prev]);
    setForm({ weight: '', chest: '', waist: '', hips: '', rightArm: '', leftArm: '', rightThigh: '', leftThigh: '', bodyFat: '' });
    setShowForm(false);
  };

  const handlePhotoUpload = async (slot, file) => {
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const record = await base44.entities.ProgressPhoto.create({
        photo_url: file_url,
        slot,
        category: slot === 'Before' ? 'before' : slot === 'After' ? 'after' : 'progress',
        taken_date: new Date().toISOString().split('T')[0]
      });
      setPhotos(prev => ({ ...prev, [slot]: file_url }));
      setPhotoRecords(prev => ({ ...prev, [slot]: record }));
    } catch (e) {
      console.error('Upload failed', e);
    }
    setUploadingSlot(null);
  };

  const firstEmptySlot = () => photoSlots.find(s => !photos[s]) || photoSlots[0];

  const handleSamplePhoto = async (url) => {
    const slot = firstEmptySlot();
    try {
      const record = await base44.entities.ProgressPhoto.create({
        photo_url: url,
        slot,
        category: slot === 'Before' ? 'before' : slot === 'After' ? 'after' : 'progress',
        taken_date: new Date().toISOString().split('T')[0]
      });
      setPhotos(prev => ({ ...prev, [slot]: url }));
      setPhotoRecords(prev => ({ ...prev, [slot]: record }));
    } catch (e) {
      console.error('Failed to save photo', e);
    }
  };

  const handlePhotoUrl = async () => {
    const url = photoUrlInput.trim();
    if (!url) return;
    const slot = firstEmptySlot();
    try {
      const record = await base44.entities.ProgressPhoto.create({
        photo_url: url,
        slot,
        category: slot === 'Before' ? 'before' : slot === 'After' ? 'after' : 'progress',
        taken_date: new Date().toISOString().split('T')[0]
      });
      setPhotos(prev => ({ ...prev, [slot]: url }));
      setPhotoRecords(prev => ({ ...prev, [slot]: record }));
      setPhotoUrlInput('');
    } catch (e) {
      console.error('Failed to save photo', e);
    }
  };

  const handleDeletePhoto = async (slot) => {
    const record = photoRecords[slot];
    if (!record) return;
    try {
      await base44.entities.ProgressPhoto.delete(record.id);
      setPhotos(prev => { const next = { ...prev }; delete next[slot]; return next; });
      setPhotoRecords(prev => { const next = { ...prev }; delete next[slot]; return next; });
    } catch (e) {
      console.error('Failed to delete photo', e);
    }
  };

  const unlockedCount = allAchievements.filter(a => a.check(entries)).length;
  const maxWeight = entries.length ? Math.max(...entries.map(e => e.weight)) : 1;
  const minWeight = entries.length ? Math.min(...entries.map(e => e.weight)) : 0;
  const range = maxWeight - minWeight || 1;

  const stats = [
    { label: 'Current Weight', value: currentWeight ? currentWeight.toFixed(1) : '—', unit: 'lbs', icon: Scale, change: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange}` : '' },
    { label: 'Workout Streak', value: '1', unit: 'days', icon: Flame, change: '+1' },
    { label: 'Entries Logged', value: entries.length, unit: '', icon: TrendingUp, change: '' },
    { label: 'Achievements', value: unlockedCount, unit: 'badges', icon: Award, change: '' },
  ];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-start justify-between mb-10">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Your Journey</span>
          <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Progress</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">Track every step of your transformation. What gets measured gets improved.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-teal text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-lg hover:bg-teal/90 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Log Entry
        </button>
      </div>

      {/* Consistency Dashboard */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Consistency</span>
        </div>
        <ConsistencyDashboard />
      </div>

      {/* Transformation Dashboard */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Your Transformation</span>
        </div>
        <TransformationDashboard entries={entries} photos={photos} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-teal" />
                {stat.change && <span className={`text-[10px] font-bold ${stat.change.startsWith('-') ? 'text-red-400' : 'text-teal'}`}>{stat.change} lbs</span>}
              </div>
              <p className="text-3xl font-bold text-white leading-none">
                {stat.value}<span className="text-sm text-zinc-500 ml-1">{stat.unit}</span>
              </p>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mt-2">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weight Trend Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Weight Trend</h3>
            <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">{entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}</span>
          </div>
          {entries.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-600">
              <TrendingUp className="w-8 h-8" />
              <p className="text-xs">Log an entry to see your weight trend</p>
            </div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-2">
              {[...entries].reverse().map((entry, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-teal font-bold opacity-0 group-hover:opacity-100 transition-opacity">{entry.weight}</span>
                  <div
                    className="w-full bg-gradient-to-t from-teal/40 to-teal/80 rounded-t hover:from-teal/60 hover:to-teal transition-colors"
                    style={{ height: `${30 + ((entry.weight - minWeight) / range) * 60}%` }}
                  />
                  <span className="text-[9px] text-zinc-600">{entry.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Measurements */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Measurements</h3>
          <div className="grid grid-cols-2 gap-3">
            {measurementFields.map(m => (
              <div key={m.key} className="flex items-center justify-between bg-muted/20 rounded-lg px-4 py-2.5">
                <span className="text-xs text-zinc-400">{m.label}</span>
                <span className="text-sm font-bold text-white">
                  {latest?.[m.key] ? `${latest[m.key]}${m.unit}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Photos */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Camera className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Progress Photos</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {photoSlots.map(slot => (
            <div key={slot} className="relative aspect-[3/4] group">
              <input
                ref={el => fileRefs.current[slot] = el}
                type="file"
                accept="image/*"
                data-testid={`photo-upload-${slot.toLowerCase().replace(/\s+/g, '-')}`}
                className={photos[slot] ? "sr-only" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"}
                onChange={(e) => handlePhotoUpload(slot, e.target.files?.[0])}
              />
              {photos[slot] ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
                  <Image src={photos[slot]} alt={slot} fittingType="fill" className="w-full h-full" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileRefs.current[slot]?.click()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal text-white font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg relative z-30"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(slot)}
                      data-testid={`delete-photo-${slot.toLowerCase().replace(/\s+/g, '-')}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-white font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg relative z-30"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] tracking-widest uppercase text-white font-bold bg-black/60 px-2 py-1 rounded">{slot}</span>
                </div>
              ) : (
                <div className="w-full h-full bg-muted/20 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-teal/40 transition-colors pointer-events-none">
                  {uploadingSlot === slot ? (
                    <Loader2 className="w-6 h-6 text-teal animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-zinc-700" />
                  )}
                  <span className="text-[10px] tracking-widest uppercase text-zinc-600 font-bold">{slot}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Add: Samples & URL */}
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-3">Quick Add — No File Dialog Needed</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {samplePhotos.map((url, i) => (
              <button
                key={i}
                onClick={() => handleSamplePhoto(url)}
                data-testid={`sample-photo-${i}`}
                className="w-16 h-20 rounded-lg overflow-hidden border border-border hover:border-teal/50 transition-all flex-shrink-0"
              >
                <img src={url} alt={`Sample ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={photoUrlInput}
              onChange={e => setPhotoUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePhotoUrl()}
              placeholder="Or paste an image URL..."
              data-testid="photo-url-input"
              className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
            />
            <button
              onClick={handlePhotoUrl}
              disabled={!photoUrlInput.trim()}
              data-testid="photo-url-submit"
              className="px-4 py-2 bg-teal text-white font-bold text-[10px] tracking-wider uppercase rounded-lg hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-teal" />
          <h3 className="font-bold text-white">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allAchievements.map(ach => {
            const unlocked = ach.check(entries);
            return (
              <div key={ach.name} className={`text-center p-4 rounded-xl border transition-all ${unlocked ? 'border-teal/40 bg-teal/5' : 'border-border bg-muted/10'}`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${unlocked ? 'bg-teal' : 'bg-muted/30'}`}>
                  <Award className={`w-5 h-5 transition-colors ${unlocked ? 'text-white' : 'text-zinc-700'}`} />
                </div>
                <p className={`text-xs font-bold transition-colors ${unlocked ? 'text-white' : 'text-zinc-600'}`}>{ach.name}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{ach.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Entry Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="font-bold text-white text-lg">Log Progress Entry</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-muted/30 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold mb-1.5 block">Weight (lbs) <span className="text-teal">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={e => handleFormChange('weight', e.target.value)}
                  placeholder="e.g. 145.5"
                  className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {measurementFields.map(m => (
                  <div key={m.key}>
                    <label className="text-xs text-zinc-400 font-bold mb-1.5 block">{m.label}{m.unit !== '%' ? ` (${m.unit})` : ''}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form[m.key]}
                      onChange={e => handleFormChange(m.key, e.target.value)}
                      placeholder="—"
                      className="w-full bg-muted/30 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal/50"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-card">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-xs font-bold tracking-wider uppercase text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button
                onClick={handleSaveEntry}
                disabled={!form.weight}
                className="px-6 py-2.5 bg-teal text-white font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-teal/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}