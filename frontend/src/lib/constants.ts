// Geometry constants — mirror mockup exactly. Change here = everything reflows.
export const PIPE_RADIUS = 12;
export const PIPE_TUBE = 2;
export const FLANGE_R = 22;
export const FLANGE_T = 6;
export const FLANGE_BOLT_R = 17;
export const FLANGE_BOLTS = 6;
export const CAPSULE_WALL_OFFSET = 14;
export const CAPSULE_TUBE_SEG = 80;
export const CAPSULE_RAD_SEG = 24;
export const CAP_DISC_THICK = 5;
export const CAP_DISC_OVERHANG = 6;

// Vetco gooseneck centerline — 2 long-radius elbows, R/D ≈ 2
export const CENTERLINE_POINTS: [number, number, number][] = [
  [-80, 0, 0],
  [-30, 0, 0],
  [0, 20, 0],
  [25, 60, 0],
  [25, 105, 0],
  [30, 135, 10],
  [60, 150, 30],
  [120, 150, 40],
];

// Hanomi brand
export const ORANGE = '#e86200';
export const GREEN = '#2d8a3f';
