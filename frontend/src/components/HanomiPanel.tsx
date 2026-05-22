'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { CadViewport } from './CadViewport';
import { StepItem } from './StepItem';
import { MaterialPicker } from './MaterialPicker';
import { PressPicker } from './PressPicker';
import { EmailModal } from './EmailModal';
import { buildSteps } from '@/lib/steps';
import { getAlloyById, type Alloy } from '@/lib/alloys';
import { getPressById, type Press } from '@/lib/presses';
import { ORANGE } from '@/lib/constants';
import { api, type Job, type UploadResult, jobStatusToStep } from '@/lib/api';
import type { SceneHandle } from '@/hooks/useScene';

const DEFAULT_ALLOY = getAlloyById('duplex_2507');
const DEFAULT_PRESS = getPressById('terapi_a');

export function HanomiPanel() {
  const [alloy, setAlloy] = useState<Alloy>(DEFAULT_ALLOY);
  const [press, setPress] = useState<Press>(DEFAULT_PRESS);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const sceneRef = useRef<SceneHandle | null>(null);
  const jobCreatingRef = useRef(false);

  const rawSteps = buildSteps(alloy, press);
  const steps = uploadedFile
    ? rawSteps.map(s =>
        s.id === 1
          ? { ...s, params: s.params.map(p => p.k === 'file' ? { ...p, v: uploadedFile } : p) }
          : s
      )
    : rawSteps;

  // Create a job whenever alloy or press changes
  useEffect(() => {
    if (jobCreatingRef.current) return;
    jobCreatingRef.current = true;
    setApiError(null);
    api.createJob({ alloy_id: alloy.id, press_id: press.id })
      .then(j => {
        setJob(j);
        const step = jobStatusToStep(j.status);
        setActiveStep(step);
        sceneRef.current?.showStep(step);
      })
      .catch(err => {
        setApiError((err as Error).message);
      })
      .finally(() => { jobCreatingRef.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alloy.id, press.id]);

  const handleReady = useCallback((handle: SceneHandle) => {
    sceneRef.current = handle;
    handle.showStep(activeStep);
  }, [activeStep]);

  function activateStep(n: number) {
    setActiveStep(n);
    sceneRef.current?.showStep(n);
  }

  async function handleCta(stepId: number) {
    if (stepId === 6) {
      setShowEmailModal(true);
      return;
    }

    setCompletedSteps(prev => new Set(prev).add(stepId));
    const next = stepId + 1;
    activateStep(next);

    // Advance job in backend if we have one
    if (job && !advancing) {
      setAdvancing(true);
      try {
        const updated = await api.advanceJob(job.id);
        setJob(updated);
      } catch (err) {
        setApiError((err as Error).message);
      } finally {
        setAdvancing(false);
      }
    }
  }

  function handleUploaded(r: UploadResult) {
    setUploadedFile(r.file_name);
    // update local job file name immediately
    setJob(prev => prev ? { ...prev, step_file_name: r.file_name } : prev);
  }

  function handleAlloyChange(a: Alloy) {
    setAlloy(a);
    setJob(null);
    setUploadedFile(null);
    setCompletedSteps(new Set());
    setActiveStep(1);
    sceneRef.current?.showStep(1);
  }

  function handlePressChange(p: Press) {
    setPress(p);
    setJob(null);
    setUploadedFile(null);
    setCompletedSteps(new Set());
    setActiveStep(1);
    sceneRef.current?.showStep(1);
  }

  return (
    <div className="app-root">
      <CadViewport onReady={handleReady} />

      <aside className="hanomi-panel">
        {/* Header */}
        <div className="panel-header">
          <div className="logo-block">
            <span className="logo-h">H</span>
            <div className="logo-text">
              <span className="logo-top">HANOMI</span>
              <span className="logo-bottom">AI ENGINEERING</span>
            </div>
          </div>
          <div className="mtc-badge">× MTC POWDER</div>
        </div>

        <h1 className="panel-title">NNS-HIP Pipeline</h1>
        <p className="panel-sub">Vetco gooseneck · subsea · PM-HIP NNS</p>

        {/* Job status chip */}
        {job && (
          <div className="job-chip">
            <span className="job-chip-dot" />
            <span className="job-chip-id">{job.id.slice(0, 8)}</span>
            <span className="job-chip-status">{job.status.replace('_', ' ')}</span>
          </div>
        )}
        {apiError && (
          <div className="api-error">
            <span>⚠ backend offline</span>
            <button onClick={() => setApiError(null)}>×</button>
          </div>
        )}

        {/* Material picker */}
        <div className="section-label">ALLOY</div>
        <div className="alloy-name">
          {alloy.name} <span className="alloy-uns">{alloy.uns}</span>
        </div>
        <MaterialPicker selected={alloy} onChange={handleAlloyChange} />

        {/* Press picker */}
        <div className="section-label" style={{ marginTop: 16 }}>PRESS</div>
        <PressPicker selected={press} onChange={handlePressChange} />

        <div className="divider" />

        {/* Steps */}
        <div className="steps-list">
          {steps.map(step => (
            <StepItem
              key={step.id}
              step={step}
              active={activeStep === step.id}
              completed={completedSteps.has(step.id)}
              onActivate={() => activateStep(step.id)}
              onCta={() => handleCta(step.id)}
              isLast={step.id === 6}
              advancing={advancing && activeStep === step.id}
              jobId={job?.id ?? null}
              onUploaded={handleUploaded}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="panel-footer">
          <span>Hanomi AI · MTC Powder Solutions AB</span>
          <span style={{ color: ORANGE }}>TeraPi fleet · 2026</span>
        </div>
      </aside>

      {showEmailModal && (
        <EmailModal
          alloy={alloy}
          press={press}
          jobId={job?.id ?? null}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}
