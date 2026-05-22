'use client';
import type { StepResults } from '@/lib/api';

interface Props {
  results: StepResults;
  label?: string;
}

const HIGHLIGHT_KEYS = new Set([
  'blank_mass_kg', 'post_hip_mass_kg', 'capsule_sheet_mass_kg', 'jig_weight_kg',
  'weldment_total_kg', 'powder_fill_est_kg', 'total_lift_mass_est_kg',
  'fit_diameter', 'fit_height', 'press_fit', 'roi', 'hip_cycle', 'hook_wll_kg',
]);

export function ComputedResults({ results, label = 'Computed' }: Props) {
  const entries = Object.entries(results);
  if (!entries.length) return null;

  return (
    <div className="computed-box">
      <div className="computed-label">{label}</div>
      <dl className="computed-table">
        {entries.map(([k, v]) => {
          const isGreen = typeof v === 'string' && v.includes('✓');
          const isWarn  = typeof v === 'string' && v.includes('⚠');
          const isBold  = HIGHLIGHT_KEYS.has(k);
          return (
            <div key={k} className="computed-row">
              <dt className="computed-key">{k.replace(/_/g, ' ')}</dt>
              <dd
                className="computed-val"
                style={
                  isGreen ? { color: '#2d8a3f', fontWeight: 700 } :
                  isWarn  ? { color: '#b45309', fontWeight: 700 } :
                  isBold  ? { color: '#e86200', fontWeight: 700 } :
                  undefined
                }
              >
                {String(v)}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
