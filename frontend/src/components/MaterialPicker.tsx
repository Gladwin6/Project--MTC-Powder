'use client';
import { ALLOYS, type Alloy } from '@/lib/alloys';

interface Props {
  selected: Alloy;
  onChange: (alloy: Alloy) => void;
}

export function MaterialPicker({ selected, onChange }: Props) {
  return (
    <div className="mat-picker">
      {ALLOYS.map(a => (
        <button
          key={a.id}
          className={`mat-swatch${a.id === selected.id ? ' active' : ''}`}
          style={{ background: a.swatch }}
          title={a.name}
          onClick={() => onChange(a)}
          aria-label={a.name}
          aria-pressed={a.id === selected.id}
        />
      ))}
    </div>
  );
}
