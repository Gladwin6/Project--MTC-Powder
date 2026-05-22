'use client';
import { useState, useRef, useCallback } from 'react';
import { api, type UploadResult } from '@/lib/api';

interface Props {
  jobId: string | null;
  onUploaded: (result: UploadResult) => void;
}

type State = 'idle' | 'dragging' | 'uploading' | 'done' | 'error';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function StepFileUpload({ jobId, onUploaded }: Props) {
  const [state, setState] = useState<State>('idle');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'step' && ext !== 'stp') {
      setError(`Wrong file type: .${ext ?? '?'} — only .step / .stp accepted`);
      setState('error');
      return;
    }
    if (!jobId) {
      setError('No job active — select an alloy first');
      setState('error');
      return;
    }

    setState('uploading');
    setError(null);
    setProgress(0);

    // Fake progress while real upload runs (XHR would give real progress,
    // but fetch is simpler and this is a small file in practice)
    const ticker = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 120);
    try {
      const r = await api.uploadStep(jobId, file);
      clearInterval(ticker);
      setProgress(100);
      setResult(r);
      setState('done');
      onUploaded(r);
    } catch (err) {
      clearInterval(ticker);
      setError((err as Error).message);
      setState('error');
    }
  }, [jobId, onUploaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  }, [upload]);

  if (state === 'done' && result) {
    return (
      <div className="upload-done">
        <span className="upload-done-icon">✓</span>
        <div className="upload-done-info">
          <span className="upload-done-name">{result.file_name}</span>
          <span className="upload-done-meta">{formatBytes(result.size_bytes)} · uploaded</span>
        </div>
        <button
          className="upload-replace"
          onClick={() => { setState('idle'); setResult(null); }}
        >
          Replace
        </button>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone${state === 'dragging' ? ' dragging' : ''}${state === 'uploading' ? ' uploading' : ''}${state === 'error' ? ' upload-err' : ''}`}
      onDragEnter={e => { e.preventDefault(); setState('dragging'); }}
      onDragOver={e => { e.preventDefault(); setState('dragging'); }}
      onDragLeave={e => { e.preventDefault(); setState(s => s === 'dragging' ? 'idle' : s); }}
      onDrop={onDrop}
      onClick={() => state !== 'uploading' && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".step,.stp"
        className="upload-input-hidden"
        onChange={onFileChange}
      />

      {state === 'uploading' ? (
        <>
          <div className="upload-spinner" />
          <span className="upload-label">Uploading…</span>
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      ) : (
        <>
          <div className="upload-icon">
            {state === 'error' ? '⚠' : state === 'dragging' ? '↓' : '↑'}
          </div>
          <span className="upload-label">
            {state === 'error'
              ? error
              : state === 'dragging'
              ? 'Drop to upload'
              : 'Drop .step / .stp or click to browse'}
          </span>
          {state !== 'error' && (
            <span className="upload-hint">STEP-only · max 512 MB · no native CAD files</span>
          )}
          {state === 'error' && (
            <button
              className="upload-retry"
              onClick={e => { e.stopPropagation(); setState('idle'); setError(null); }}
            >
              Try again
            </button>
          )}
        </>
      )}
    </div>
  );
}
