import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Download, Trash2, AlertTriangle, CheckCircle, XCircle, Loader2, X, RefreshCw, ChevronRight, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const GITHUB_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
const GITHUB_BASE = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/';
const SOURCE_NAME = 'hasaneyldrm/exercises-dataset';
const BATCH_SIZE = 40;

function mapExercise(raw) {
  return {
    source_id: String(raw.id),
    name: raw.name || '',
    category: raw.category || '',
    body_part: raw.body_part || '',
    equipment: raw.equipment || '',
    target: raw.target || '',
    muscle_group: raw.muscle_group || '',
    secondary_muscles: raw.secondary_muscles || [],
    instructions_en: raw.instructions?.en || '',
    instruction_steps_en: raw.instruction_steps?.en || [],
    instructions_es: raw.instructions?.es || '',
    instructions_fr: raw.instructions?.fr || '',
    image_url: raw.image ? GITHUB_BASE + raw.image : '',
    gif_url: raw.gif_url ? GITHUB_BASE + raw.gif_url : '',
    media_id: raw.media_id || '',
    attribution: raw.attribution || '',
    source_created_at: raw.created_at || '',
    source_name: SOURCE_NAME,
    is_active: true,
    is_featured: false,
  };
}

export default function ExerciseImporter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cancelRef = useRef(false);

  const [replaceExisting, setReplaceExisting] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | fetching | importing | completed | error
  const [showConfirm, setShowConfirm] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [lastFailedBatch, setLastFailedBatch] = useState(null);
  const [cachedData, setCachedData] = useState(null);

  const progress = totalBatches > 0 ? Math.round((currentBatch / totalBatches) * 100) : 0;

  // The builder preview runs in an iframe and uses the Test database; the
  // published site runs standalone and uses Production. The backend function
  // accepts a dataEnv param so it writes to the correct environment.
  function detectDataEnv() {
    try {
      return window.self !== window.top ? 'dev' : 'prod';
    } catch {
      return 'dev';
    }
  }

  async function fetchDataset() {
    // Try direct fetch first (GitHub raw supports CORS)
    try {
      const res = await fetch(GITHUB_URL);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.log('Direct fetch failed, using backend function:', err.message);
    }
    // Fallback: backend function
    const response = await base44.functions.invoke('import-exercises', { action: 'fetch' });
    return response.data.exercises;
  }

  async function importBatch(batch, batchIndex) {
    // Legacy per-batch path (kept for the retry-failed-batch flow). Targets the
    // detected environment via the backend function's dataEnv param.
    const dataEnv = detectDataEnv();
    const response = await base44.functions.invoke('import-exercises', {
      action: 'import',
      dataEnv,
      batch,
    });
    return response.data;
  }

  async function startImport() {
    if (replaceExisting) {
      setShowConfirm(true);
      return;
    }
    runImport();
  }

  async function runImport() {
    cancelRef.current = false;
    setShowConfirm(false);
    setStatus('importing');
    setStatusMessage('Importing exercise dataset — this runs server-side and may take a minute...');
    setImportedCount(0);
    setSkippedCount(0);
    setErrorCount(0);
    setCurrentBatch(0);
    setTotalBatches(1);
    setLastFailedBatch(null);

    try {
      const dataEnv = detectDataEnv();
      const response = await base44.functions.invoke('import-exercises', {
        action: 'importAll',
        dataEnv,
        replace: replaceExisting,
      });
      const result = response.data;
      setTotalRecords(result.total);
      setImportedCount(result.imported || 0);
      setSkippedCount(result.skipped || 0);
      setErrorCount(result.errors || 0);
      setCurrentBatch(1);
      setStatus('completed');
      setStatusMessage(`Import complete! ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors.`);
    } catch (err) {
      console.error('Import failed:', err.message);
      setStatus('error');
      setStatusMessage(`Import failed: ${err.message}`);
    }
  }

  async function retryFailedBatch() {
    if (!lastFailedBatch) return;
    setStatus('importing');
    setStatusMessage(`Retrying batch ${lastFailedBatch.index + 1}...`);

    try {
      const result = await importBatch(lastFailedBatch.data, lastFailedBatch.index);
      setImportedCount(prev => prev + (result.imported || 0));
      setSkippedCount(prev => prev + (result.skipped || 0));
      setErrorCount(prev => Math.max(0, prev - (result.imported || 0) - (result.skipped || 0) - (result.errors || 0)) + (result.errors || 0));
      setLastFailedBatch(null);

      // Check if there are more batches to process
      if (lastFailedBatch.index + 1 < totalBatches) {
        // Continue with remaining batches
        const data = cachedData;
        for (let i = lastFailedBatch.index + 1; i < totalBatches; i++) {
          if (cancelRef.current) {
            setStatusMessage('Import cancelled by user.');
            setStatus('error');
            return;
          }
          setCurrentBatch(i + 1);
          const batch = data.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
          setStatusMessage(`Importing batch ${i + 1} of ${totalBatches}...`);
          try {
            const result = await importBatch(batch, i);
            setImportedCount(prev => prev + (result.imported || 0));
            setSkippedCount(prev => prev + (result.skipped || 0));
            setErrorCount(prev => prev + (result.errors || 0));
          } catch (err) {
            setErrorCount(prev => prev + batch.length);
            setLastFailedBatch({ index: i, data: batch });
            setStatusMessage(`Batch ${i + 1} failed: ${err.message}`);
            setStatus('error');
            return;
          }
        }
      }

      setStatus('completed');
      setStatusMessage(`Import complete! ${importedCount} imported, ${skippedCount} skipped, ${errorCount} errors.`);
    } catch (err) {
      setStatus('error');
      setStatusMessage(`Retry failed: ${err.message}`);
    }
  }

  function cancelImport() {
    cancelRef.current = true;
  }

  function reset() {
    setStatus('idle');
    setStatusMessage('');
    setImportedCount(0);
    setSkippedCount(0);
    setErrorCount(0);
    setCurrentBatch(0);
    setTotalBatches(0);
    setTotalRecords(0);
    setLastFailedBatch(null);
    setCachedData(null);
  }

  const isRunning = status === 'fetching' || status === 'importing';

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <h2 className="font-display text-2xl text-white mb-2">Admin Access Required</h2>
        <p className="text-zinc-500 text-sm">You need administrator privileges to access the Exercise Database Importer.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6">
        <button onClick={() => navigate('/admin')} className="hover:text-teal transition-colors">Admin</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-400">Exercise Database Importer</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Database className="w-4 h-4 text-teal" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Admin Tools</span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl text-white mb-2">Exercise Database Importer</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Import the complete exercise dataset from <span className="text-teal font-mono">hasaneyldrm/exercises-dataset</span> into your Exercise entity.
      </p>

      {/* Source info card */}
      <div className="rounded-2xl border border-border bg-card p-5 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold mb-1">Data Source</p>
            <p className="text-sm text-white font-mono break-all">{GITHUB_URL}</p>
            <p className="text-xs text-zinc-500 mt-2">
              Records are imported in batches of {BATCH_SIZE}. Duplicates are automatically skipped based on <span className="text-teal">source_id</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Import controls */}
      {status === 'idle' && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={e => setReplaceExisting(e.target.checked)}
              className="w-5 h-5 rounded border-border accent-teal"
            />
            <div>
              <span className="text-sm font-bold text-white">Replace Existing Database</span>
              <p className="text-xs text-zinc-500 mt-0.5">Deletes all existing exercises before importing. This cannot be undone.</p>
            </div>
          </label>

          <button
            onClick={startImport}
            className="w-full inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl hover:bg-teal/90 transition-all"
          >
            <Download className="w-4 h-4" /> Import Exercise Database
          </button>
        </div>
      )}

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="text-lg font-bold text-white">Confirm Database Replacement</h3>
          </div>
          <p className="text-sm text-zinc-400">
            This will permanently delete <span className="text-destructive font-bold">ALL existing exercise records</span> before importing the new dataset. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={runImport}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-destructive text-white font-bold text-sm uppercase px-4 py-3 rounded-xl hover:bg-destructive/90 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Yes, Replace Everything
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-border text-zinc-400 font-bold text-sm uppercase px-4 py-3 rounded-xl hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Progress section */}
      {(isRunning || status === 'completed' || status === 'error') && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          {/* Status message */}
          <div className="flex items-center gap-2">
            {status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-teal" />
            ) : status === 'error' ? (
              <XCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Loader2 className="w-5 h-5 text-teal animate-spin" />
            )}
            <p className="text-sm text-white font-medium">{statusMessage}</p>
          </div>

          {/* Progress bar */}
          {isRunning && (
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                <span>Batch {currentBatch} of {totalBatches}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Counts */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{totalRecords}</p>
              <p className="text-[10px] text-zinc-500 tracking-wide uppercase">Total</p>
            </div>
            <div className="bg-teal/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-teal">{importedCount}</p>
              <p className="text-[10px] text-zinc-500 tracking-wide uppercase">Imported</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-zinc-400">{skippedCount}</p>
              <p className="text-[10px] text-zinc-500 tracking-wide uppercase">Skipped</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{errorCount}</p>
              <p className="text-[10px] text-zinc-500 tracking-wide uppercase">Errors</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {isRunning && (
              <button
                onClick={cancelImport}
                className="inline-flex items-center gap-2 border border-border text-zinc-400 font-bold text-xs uppercase px-4 py-2.5 rounded-lg hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5" /> Cancel Import
              </button>
            )}
            {status === 'error' && lastFailedBatch && (
              <button
                onClick={retryFailedBatch}
                className="inline-flex items-center gap-2 bg-teal text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Failed Batch
              </button>
            )}
            {(status === 'completed' || (status === 'error' && !lastFailedBatch)) && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 border border-border text-zinc-400 font-bold text-xs uppercase px-4 py-2.5 rounded-lg hover:text-white transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Start New Import
              </button>
            )}
            {status === 'completed' && (
              <button
                onClick={() => navigate('/hf-ai/library')}
                className="inline-flex items-center gap-2 bg-teal text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg hover:bg-teal/90 transition-all"
              >
                View Exercise Library <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}