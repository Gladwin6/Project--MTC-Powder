'use client';
import type { StepParam } from '@/lib/steps';

export function ParamsTable({ params }: { params: StepParam[] }) {
  return (
    <dl className="params-table">
      {params.map(({ k, v, highlight }) => (
        <div key={k} className="params-row">
          <dt className="params-key">{k}</dt>
          <dd
            className="params-val"
            style={
              highlight === 'orange'
                ? { color: '#e86200', fontWeight: 600 }
                : highlight === 'green'
                ? { color: '#2d8a3f', fontWeight: 600 }
                : undefined
            }
          >
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
