'use client';
import type { PipelineStep } from '@/lib/steps';
import type { UploadResult, StepResults } from '@/lib/api';
import { ParamsTable } from './ParamsTable';
import { StepFileUpload } from './StepFileUpload';
import { ComputedResults } from './ComputedResults';

interface Props {
  step: PipelineStep;
  active: boolean;
  completed: boolean;
  onActivate: () => void;
  onCta: () => void;
  isLast: boolean;
  advancing?: boolean;
  jobId?: string | null;
  onUploaded?: (r: UploadResult) => void;
  computedResults?: StepResults;
}

const BADGE_LABELS: Record<string, string> = {
  input: 'input',
  blank: 'blank',
  capsule: 'capsule',
  ports: 'ports',
  drawing: 'drawing',
  jig: 'jig',
};

export function StepItem({
  step, active, completed, onActivate, onCta, isLast, advancing, jobId, onUploaded, computedResults,
}: Props) {
  return (
    <div
      className={`step-item${active ? ' step-active' : ''}${completed ? ' step-done' : ''}`}
      onClick={!active ? onActivate : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onActivate()}
    >
      <div className="step-header">
        <span className="step-num">{String(step.id).padStart(2, '0')}</span>
        <span className="step-title">{step.title}</span>
        <span className={`step-badge badge-${step.badge}`}>
          {BADGE_LABELS[step.badge] ?? step.badge}
        </span>
        {completed && <span className="step-check">✓</span>}
      </div>

      {active && (
        <div className="step-body">
          <p className="step-desc">{step.desc}</p>

          {step.id === 1 && (
            <StepFileUpload
              jobId={jobId ?? null}
              onUploaded={r => onUploaded?.(r)}
            />
          )}

          <ParamsTable params={step.params} />

          {computedResults && Object.keys(computedResults).length > 0 && (
            <ComputedResults results={computedResults} label="Engine output" />
          )}

          {step.refCite && (
            <p className="step-ref">{step.refCite}</p>
          )}
          <button
            className={`step-cta${isLast ? ' cta-send' : ''}${advancing ? ' cta-loading' : ''}`}
            onClick={e => { e.stopPropagation(); onCta(); }}
            disabled={advancing}
          >
            {advancing ? 'Saving…' : step.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}
