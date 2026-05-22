'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { api, type UploadResult } from '@/lib/api';

interface Props {
  jobId: string | null;
  onUploaded: (result: UploadResult) => void;
}

type State = 'waiting-job' | 'idle' | 'dragging' | 'uploading' | 'done' | 'error';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function StepFileUpload({ jobId, onUploaded }: Props) {
  const [state, setState] = useState<State>(jobId ? 'idle' : 'waiting-job');
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // hold a file that arrived while job was still being created
  const pendingFileRef = useRef<File | null>(null);

  // When jobId arrives (async), auto-upload any pending file
  useEffect(() => {
    if (!jobId) {
      setState(s => s === 'done' ? s : 'waiting-job');
      return;
    }
    if (state === 'waiting-job' || state === 'idle') {
      setState('idle');
    }
    if (pendingFileRef.current) {
      const f = pendingFileRef.current;
      pendingFileRef.current = null;
      upload(f, jobId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const upload = useCallback(async (file: File, jid: string) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'step' && ext !== 'stp') {
      setError(`Wrong file type ".${ext ?? '?'}" — only .step / .stp accepted`);
      setState('error');
      return;
    }

    setState('uploading');
    setError(null);
    setProgress(0);

    const ticker = setInterval(() => setProgress(p => Math.min(p + 9, 88)), 120);
    try {
      const r = await api.uploadStep(jid, file);
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
  }, [onUploaded]);

  function handleFile(file: File) {
    if (!jobId) {
      // Job not ready yet — queue the file and show uploading immediately
      pendingFileRef.current = file;
      setState('uploading');
      setProgress(0);
      return;
    }
    upload(file, jobId);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('idle');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, upload]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, upload]);

  if (state === 'done' && result) {
    return (
      <div className="upload-done">
        <div className="upload-done-icon">✓</div>
        <div className="upload-done-info">
          <span className="upload-done-name">{result.file_name}</span>
          <span className="upload-done-meta">{formatBytes(result.size_bytes)} · uploaded to job</span>
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

  const isUploading = state === 'uploading';
  const isWaiting = state === 'waiting-job';
  const isDragging = state === 'dragging';
  const isError = state === 'error';

  return (
    <div
      className={[
        'upload-zone',
        isDragging ? 'dragging' : '',
        isUploading ? 'uploading' : '',
        isError ? 'upload-err' : '',
        isWaiting ? 'upload-waiting' : '',
      ].filter(Boolean).join(' ')}
      onDragEnter={e => { e.preventDefault(); e.stopPropagation(); if (!isUploading) setState('dragging'); }}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); if (!isUploading) setState('dragging'); }}
      onDragLeave={e => {
        e.preventDefault();
        // only leave if we left the zone entirely (not entering a child)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setState(s => s === 'dragging' ? 'idle' : s);
        }
      }}
      onDrop={onDrop}
      onClick={() => !isUploading && !isWaiting && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && !isUploading && !isWaiting && inputRef.current?.click()}
      aria-label="Upload STEP file"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".step,.stp"
        className="upload-input-hidden"
        onChange={onFileChange}
      />

      {isUploading && (
        <>
          <div className="upload-spinner" />
          <span className="upload-label">Uploading…</span>
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}

      {isWaiting && (
        <>
          <div className="upload-spinner upload-spinner-slow" />
          <span className="upload-label">Starting job…</span>
          <span className="upload-hint">Drop your file — it will upload automatically</span>
        </>
      )}

      {!isUploading && !isWaiting && (
        <>
          <div className="upload-icon">
            {isError ? '⚠' : isDragging ? '↓' : '↑'}
          </div>
          <span className="upload-label">
            {isError
              ? error
              : isDragging
              ? 'Drop to upload'
              : 'Drop .step / .stp or click to browse'}
          </span>
          {!isError && (
            <span className="upload-hint">STEP-only · max 512 MB · no native CAD files</span>
          )}
          {isError && (
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
