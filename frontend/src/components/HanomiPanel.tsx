'use client';
import { useState, useRef, useCallback } from 'react';
import { CadViewport } from './CadViewport';
import { StepItem } from './StepItem';
import { MaterialPicker } from './MaterialPicker';
import { PressPicker } from './PressPicker';
import { EmailModal } from './EmailModal';
import { buildSteps } from '@/lib/steps';
import { getAlloyById, ALLOYS, type Alloy } from '@/lib/alloys';
import { getPressById, type Press } from '@/lib/presses';
import { ORANGE } from '@/lib/constants';
import type { SceneHandle } from '@/hooks/useScene';

const DEFAULT_ALLOY = getAlloyById('duplex_2507');
const DEFAULT_PRESS = getPressById('terapi_a');

export function HanomiPanel() {
  const [alloy, setAlloy] = useState<Alloy>(DEFAULT_ALLOY);
  const [press, setPress] = useState<Press>(DEFAULT_PRESS);
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const sceneRef = useRef<SceneHandle | null>(null);

  const steps = buildSteps(alloy, press);

  const handleReady = useCallback((handle: SceneHandle) => {
    sceneRef.current = handle;
    handle.showStep(1);
  }, []);

  function activateStep(n: number) {
    setActiveStep(n);
    sceneRef.current?.showStep(n);
  }

  function handleCta(stepId: number) {
    if (stepId === 6) {
      setShowEmailModal(true);
      return;
    }
    setCompletedSteps(prev => new Set(prev).add(stepId));
    const next = stepId + 1;
    activateStep(next);
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

        {/* Material picker */}
        <div className="section-label">ALLOY</div>
        <div className="alloy-name">{alloy.name} <span className="alloy-uns">{alloy.uns}</span></div>
        <MaterialPicker selected={alloy} onChange={a => { setAlloy(a); }} />

        {/* Press picker */}
        <div className="section-label" style={{ marginTop: 16 }}>PRESS</div>
        <PressPicker selected={press} onChange={setPress} />

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
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}
