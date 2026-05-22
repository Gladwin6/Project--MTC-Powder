'use client';
import { PRESSES, type Press } from '@/lib/presses';

interface Props {
  selected: Press;
  onChange: (press: Press) => void;
}

export function PressPicker({ selected, onChange }: Props) {
  return (
    <div className="press-row">
      {PRESSES.map(p => (
        <button
          key={p.id}
          className={`press-pill${p.id === selected.id ? ' active' : ''}`}
          onClick={() => onChange(p)}
          aria-pressed={p.id === selected.id}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
