export interface Press {
  id: string;
  name: string;
  model: string;
  boreDiameterMm: number;
  hotZoneHeightMm: number;
  maxLoadKg: number;
  lastCalibration: string;
  notes: string;
  isDefault?: boolean;
}

export const PRESSES: Press[] = [
  {
    id: 'terapi_a',
    name: 'TeraPi-A',
    model: 'Quintus QIH-294',
    boreDiameterMm: 1600,
    hotZoneHeightMm: 3500,
    maxLoadKg: 8500,
    lastCalibration: '2026-04-18',
    notes: 'Primary — large subsea / NNS',
    isDefault: true,
  },
  {
    id: 'terapi_b',
    name: 'TeraPi-B',
    model: 'Quintus QIH-122',
    boreDiameterMm: 915,
    hotZoneHeightMm: 2200,
    maxLoadKg: 2400,
    lastCalibration: '2026-03-22',
    notes: 'Small batch / medium parts',
  },
  {
    id: 'qih_21',
    name: 'QIH-21',
    model: 'Quintus QIH-21',
    boreDiameterMm: 406,
    hotZoneHeightMm: 750,
    maxLoadKg: 180,
    lastCalibration: '2026-05-02',
    notes: 'R&D / small parts / qualification',
  },
];

export function getPressById(id: string): Press {
  return PRESSES.find(p => p.id === id) ?? PRESSES[0];
}
