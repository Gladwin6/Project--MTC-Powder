import type { Alloy } from './alloys';
import type { Press } from './presses';

export interface StepParam {
  k: string;
  v: string;
  highlight?: 'orange' | 'green';
}

export interface PipelineStep {
  id: number;
  title: string;
  badge: string;
  desc: string;
  params: StepParam[];
  refCite?: string;
  ctaLabel: string;
}

export function buildSteps(alloy: Alloy, press: Press): PipelineStep[] {
  return [
    {
      id: 1,
      title: 'Input · STEP File',
      badge: 'input',
      desc: 'Vetco-pattern subsea gooseneck — 2 long-radius elbows, 2 main flanges, 1 branch DN50 vent tee. STEP-only upload (.step / .stp). Native CAD files rejected — they carry feature trees and IP.',
      params: [
        { k: 'file', v: 'vetco-gooseneck-demo.step' },
        { k: 'alloy', v: alloy.name },
        { k: 'UNS', v: alloy.uns },
        { k: 'application', v: 'subsea gooseneck · oil & gas' },
        { k: 'mass post-machining', v: alloy.postHipMass },
        { k: 'bounding box', v: '420 × 240 × 180 mm' },
        { k: 'B-rep faces', v: '1,247 (8,432 entities total)' },
        { k: 'codes', v: alloy.codes.join(' · '), highlight: 'orange' },
      ],
      refCite: 'WO2022128356A1 — Vetco Gray Scandinavia · subsea gooseneck HIP NNS',
      ctaLabel: 'Draft Blank →',
    },
    {
      id: 2,
      title: 'Blank + 2D Drawing',
      badge: 'blank',
      desc: 'NNS blank: offset shell with per-region machining stock. Shrinkage compensation applied per alloy. 2D approval drawing auto-generated alongside the 3D blank.',
      params: [
        { k: 'shrinkage', v: alloy.shrinkage },
        { k: 'shrinkage note', v: alloy.shrinkageNote },
        { k: 'offset rule', v: 'rule-based per-feature (US6210633B1) · MTC formula plugs in' },
        { k: 'machining stock', v: '3 mm seal faces · 6 mm flange OD · 1.5 mm bore' },
        { k: 'blank mass', v: '45.6 kg (pre-HIP, pre-powder)' },
        { k: 'output', v: 'blank.sldprt · blank.step · client-approval.pdf' },
        { k: 'drawing std', v: 'SS-EN ISO 2768 m/K · ISO 5817 B · ISO 13920 AF', highlight: 'orange' },
      ],
      refCite: 'US6210633B1 — variable-wall capsule offset rules · Sobhani 2023 MDPI — capsule geometry optimisation',
      ctaLabel: 'Draft Capsule →',
    },
    {
      id: 3,
      title: 'Sheet Metal Capsule',
      badge: 'capsule',
      desc: 'Conformal sheet-metal capsule: rolled tube body offset from pipe centerline + 3 dished end caps welded at flange faces + weld bead at branch tee. NOT a cuboid box.',
      params: [
        { k: 'form factor', v: 'conformal tube offset + 3 dished caps', highlight: 'orange' },
        { k: 'body offset', v: '+14 mm radial clearance (powder + sheet)' },
        { k: 'wall thickness', v: '3–4 mm typical (3 mm nominal S235JR)' },
        { k: 'weld class', v: alloy.weldClass, highlight: 'orange' },
        { k: 'tolerance class', v: alloy.toleranceClass },
        { k: 'pickling', v: alloy.pickling },
        { k: 'leak test', v: '≤ 1×10⁻⁶ mbar·L/s (pre-HIP He test)' },
        { k: 'HIP cycle', v: `${alloy.hipTemp} · ${alloy.hipPressure} · ${alloy.hipHold}` },
        { k: 'cooling', v: alloy.hipCooling, highlight: 'orange' },
        ...(alloy.ferrite ? [{ k: 'ferrite target', v: alloy.ferrite }] : []),
      ],
      refCite: 'US11673191B2 · US11478849B2 (Bodycote) — sheet-metal weldment capsule · Shimoda E-4 — duplex subsea capsule dimensions',
      ctaLabel: 'Draft Ports + Hooks →',
    },
    {
      id: 4,
      title: 'Ports + Lifting Hooks',
      badge: 'ports',
      desc: 'Fill pipe and degas tube welded ON the capsule surface at curve parameters t=0.92 and t=0.08. 4 lifting hooks at t=0.04, 0.16, 0.85, 0.97 — spread for balanced rigging. All anchored via surfacePointAt(t), not bounding-box corners.',
      params: [
        { k: 'fill pipe', v: 'Ø25 × 120 mm · t = 0.92 (outlet run)' },
        { k: 'degas tube', v: 'Ø10 × 100 mm · t = 0.08 (inlet run)' },
        { k: 'hooks', v: '4× EN 1677-1 DIN 580 M16 · t = 0.04, 0.16, 0.85, 0.97' },
        { k: 'hook standard', v: 'EN 1677-1 / DIN 580 · 5:1 design factor (ASME BTH-1 Cat. B)', highlight: 'orange' },
        { k: 'anchor method', v: 'surfacePointAt(t) + radialUpAt(t) — NOT bbox corners', highlight: 'orange' },
      ],
      refCite: 'US20190134710A1 (Sagittite) — diagonally opposed degas + fill tubes · EN 1677-1 below-the-hook lifting',
      ctaLabel: 'Draft Welded Drawing →',
    },
    {
      id: 5,
      title: 'Welded Structure Drawing',
      badge: 'drawing',
      desc: 'Exploded assembly view with balloon BOM callouts. Body tube + branch + 3 dished caps + fill/degas ports + 4 hooks pulled apart with numbered balloons. BOM table auto-populated from assembly.',
      params: [
        { k: 'body tube', v: 'Ø52 rolled · 9.4 kg · S235JR EN 10025' },
        { k: 'branch tube', v: 'Ø42 rolled · 2.1 kg · S235JR' },
        { k: 'dished cap ×3', v: 'Ø56 × 5 mm · 0.95 kg each' },
        { k: 'fill + degas', v: '0.18 kg combined' },
        { k: 'hooks ×4', v: '0.18 kg each · EN 1677-1' },
        { k: 'weldment total', v: '14.8 kg', highlight: 'green' },
        { k: 'capsule material', v: 'S235JR · EN 10025 · 3 mm sheet rolled' },
        { k: 'output', v: 'welded-structure.slddrw · .pdf · .step' },
      ],
      refCite: 'SS-EN ISO 5817 class B · SS-EN ISO 13920 class AF · ISO 2553 weld symbols',
      ctaLabel: 'Draft Jig →',
    },
    {
      id: 6,
      title: 'Jig + Final Assembly',
      badge: 'jig',
      desc: 'Full PM-HIP cradle rig: welded I-beam base + 4 V-saddle cradles conforming to capsule curve + variable-height posts (30 mm at inlet → 180 mm at upper run) + 3 diagonal cross-braces + 2 anti-rotation pins + 4 corner lift lugs + 4 foot pads.',
      params: [
        { k: 'press', v: `${press.name} · ${press.model}`, highlight: 'orange' },
        { k: 'press envelope', v: `Ø ${press.boreDiameterMm} × ${press.hotZoneHeightMm} mm` },
        { k: 'capsule size', v: '800 × 1200 mm · ✓ FITS' },
        { k: 'HIP cycle', v: `${alloy.hipTemp} · ${alloy.hipPressure} · ${alloy.hipHold}` },
        { k: 'jig type', v: '4 V-saddle cradles · 4 vertical posts · 3 cross diagonals', highlight: 'orange' },
        { k: 'support points', v: 't = 0.05 / 0.32 / 0.62 / 0.93' },
        { k: 'jig weight', v: '46.2 kg · S235JR welded steel' },
        { k: 'ROI', v: '60–80 hrs × $180/hr = $11–14K / pipe · 14 days → 6 hrs', highlight: 'green' },
        { k: 'output', v: 'jig.sldasm · jig.step · jig.slddrw' },
      ],
      refCite: 'Shimoda E-4 · MTC Powder Solutions — TeraPi fleet calibration 2026',
      ctaLabel: 'Send to MTC for Approval →',
    },
  ];
}
