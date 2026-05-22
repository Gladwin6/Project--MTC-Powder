"""
Pipeline computation engine.
Each run_step_N() function takes the job + alloy + press, computes all
engineering values, writes them into job.step_params, and returns a
human-readable results dict that goes straight back to the frontend.
"""
import math
from dataclasses import dataclass, field
from typing import Any

# ── Geometry constants (mirror frontend constants.ts) ─────────────────────
PIPE_RADIUS        = 12.0   # mm  — nominal pipe outer radius
CAPSULE_WALL_OFF   = 14.0   # mm  — radial clearance (powder + sheet)
FLANGE_R           = 22.0   # mm  — flange outer radius
FLANGE_T           = 6.0    # mm  — flange disc thickness
CAP_DISC_OVERHANG  = 6.0    # mm  — cap overhang beyond flange OD
SHEET_THICK        = 3.0    # mm  — S235JR capsule sheet nominal
PIPE_WALL          = 2.0    # mm  — pipe wall for mass calc
STEEL_DENSITY      = 7850   # kg/m³
PIPE_CURVE_LEN     = 650.0  # mm  — approximate Vetco gooseneck arc length
BRANCH_LEN         = 80.0   # mm  — branch tube arc length
N_FLANGES          = 3

SADDLE_POSITIONS   = [0.05, 0.32, 0.62, 0.93]   # t-values on curve


# ── Alloy shrinkage lookup (midpoint linear pct) ───────────────────────────
SHRINKAGE_MID = {
    "duplex_2507": 0.13,
    "saf_2906":    0.13,
    "inconel_625": 0.14,
    "incoloy_825": 0.13,
    "ss_316l":     0.13,
    "inconel_718": 0.14,
    "ti_6al_4v":   0.11,
}

def _shrinkage(alloy_id: str) -> float:
    return SHRINKAGE_MID.get(alloy_id, 0.13)


# ── Helpers ────────────────────────────────────────────────────────────────
def _cyl_volume_mm3(r_outer: float, r_inner: float, length: float) -> float:
    return math.pi * (r_outer**2 - r_inner**2) * length

def _sphere_cap_volume_mm3(r: float, h: float) -> float:
    """Spherical cap volume V = π h²(3r−h)/3"""
    return math.pi * h**2 * (3*r - h) / 3

def _kg(mm3: float, density_kg_m3: float = STEEL_DENSITY) -> float:
    return mm3 * density_kg_m3 / 1e9   # mm³ → m³ → kg

def _round2(v: float) -> float:
    return round(v, 2)


# ── Step 1: Parse / validate STEP input ───────────────────────────────────
def run_step_1(job, alloy, press) -> dict[str, Any]:
    """
    Analyse the uploaded STEP file.
    We parse byte-level STEP entity counts (no heavy kernel required).
    """
    step_params = job.step_params or {}
    file_path   = step_params.get("step_file_path")
    file_size   = step_params.get("step_file_size_bytes", 0)
    orig_name   = step_params.get("step_original_name", job.step_file_name or "unknown.step")

    b_rep_faces    = 0
    entity_count   = 0
    has_ap214      = False
    has_ap203      = False

    if file_path:
        try:
            with open(file_path, "r", errors="replace") as f:
                for line in f:
                    line = line.strip()
                    if "AP214" in line.upper():   has_ap214 = True
                    if "AP203" in line.upper():   has_ap203 = True
                    if line.startswith("#") and "=" in line:
                        entity_count += 1
                        upper = line.upper()
                        if "ADVANCED_FACE" in upper or "FACE_SURFACE" in upper:
                            b_rep_faces += 1
        except Exception:
            pass

    protocol = "AP214" if has_ap214 else ("AP203" if has_ap203 else "AP242")
    fits_press = (
        job.pipe_radius_mm * 2 < press.bore_diameter_mm * 0.8 and
        PIPE_CURVE_LEN < press.hot_zone_height_mm * 0.85
    )

    result = {
        "file":          orig_name,
        "size":          f"{file_size / 1024:.1f} KB" if file_size < 1e6 else f"{file_size/1e6:.1f} MB",
        "protocol":      protocol,
        "entities":      entity_count or "—",
        "b_rep_faces":   b_rep_faces or "—",
        "alloy":         alloy.name,
        "uns":           alloy.uns,
        "press":         f"{press.name} · {press.model}",
        "press_envelope":f"Ø{press.bore_diameter_mm:.0f} × {press.hot_zone_height_mm:.0f} mm",
        "press_fit":     "OK FITS" if fits_press else "!! CHECK ENVELOPE",
        "codes":         " · ".join(alloy.regulatory_codes),
    }
    return result


# ── Step 2: Blank geometry + mass ─────────────────────────────────────────
def run_step_2(job, alloy, press) -> dict[str, Any]:
    """
    Compute NNS blank: offset shell + per-region machining stock +
    shrinkage-compensated envelope.
    """
    shrink = _shrinkage(alloy.id)
    r      = job.pipe_radius_mm

    # Machining stock per region (mm)
    stock_seal    = 3.0   # sealing faces
    stock_bore    = 1.5   # bores
    stock_flange  = 6.0   # flange OD

    # Compensated blank radius (include shrinkage on outer dimension)
    r_blank = (r + stock_bore) * (1 + shrink)

    # Pipe run volume (thick-wall hollow cylinder)
    r_inner_blank = r_blank - PIPE_WALL * (1 + shrink)
    vol_pipe_mm3  = _cyl_volume_mm3(r_blank, r_inner_blank, PIPE_CURVE_LEN * (1 + shrink))

    # Flanges — solid discs (approximation)
    r_flange_blank = (FLANGE_R + stock_flange) * (1 + shrink)
    vol_flange_mm3 = math.pi * r_flange_blank**2 * (FLANGE_T * 1.3) * N_FLANGES

    # Branch
    r_branch_blank = r * 0.78 * (1 + shrink) + stock_bore
    vol_branch_mm3 = _cyl_volume_mm3(r_branch_blank, r_branch_blank - PIPE_WALL * (1 + shrink),
                                      BRANCH_LEN * (1 + shrink))

    total_vol_mm3 = vol_pipe_mm3 + vol_flange_mm3 + vol_branch_mm3
    blank_mass_kg = _kg(total_vol_mm3, density_kg_m3=_alloy_density(alloy.id))

    # Bounding box of compensated blank
    bb_x = (PIPE_CURVE_LEN * (1 + shrink))
    bb_y = 160 * (1 + shrink)   # height
    bb_z = 40 * (1 + shrink)    # depth

    result = {
        "shrinkage_factor":     f"{shrink*100:.1f}%",
        "blank_pipe_radius_mm": f"{r_blank:.2f}",
        "blank_flange_r_mm":    f"{r_flange_blank:.2f}",
        "machining_stock":      f"{stock_seal} mm seal faces · {stock_flange} mm flange OD · {stock_bore} mm bore",
        "blank_mass_kg":        f"{blank_mass_kg:.1f} kg",
        "post_hip_mass_kg":     f"{alloy.post_hip_mass_kg} kg",
        "bounding_box_mm":      f"{bb_x:.0f} × {bb_y:.0f} × {bb_z:.0f}",
        "drawing_std":          "SS-EN ISO 2768 m/K · ISO 5817 B · ISO 13920 AF",
        "output_files":         "blank.step · blank.sldprt · client-approval.pdf",
    }
    return result


# ── Step 3: Capsule sheet metal ───────────────────────────────────────────
def run_step_3(job, alloy, press) -> dict[str, Any]:
    """
    Design the conformal sheet-metal capsule:
    rolled tube + 3 dished caps + weld bead at branch tee.
    """
    r_cap_body  = job.pipe_radius_mm + CAPSULE_WALL_OFF   # 26 mm
    r_cap_branch= job.pipe_radius_mm * 0.78 + CAPSULE_WALL_OFF  # 23.36 mm
    dome_r      = FLANGE_R + CAP_DISC_OVERHANG            # 28 mm

    # Body tube mass (sheet rolled around pipe)
    r_outer = r_cap_body + SHEET_THICK
    vol_body_mm3 = _cyl_volume_mm3(r_outer, r_cap_body, PIPE_CURVE_LEN)
    mass_body = _kg(vol_body_mm3)

    # Branch tube mass
    r_br_outer = r_cap_branch + SHEET_THICK
    vol_branch_mm3 = _cyl_volume_mm3(r_br_outer, r_cap_branch, BRANCH_LEN)
    mass_branch = _kg(vol_branch_mm3)

    # 3 dished caps — spherical cap (quarter-sphere approx)
    cap_h = dome_r * 0.22   # sagitta of a torispherical cap ≈ 22% of radius
    vol_cap_mm3 = _sphere_cap_volume_mm3(dome_r, cap_h) * SHEET_THICK / cap_h
    mass_cap_each = _kg(vol_cap_mm3 * 3) / 3

    # Powder volume (space inside capsule)
    vol_powder_mm3 = (math.pi * r_cap_body**2 * PIPE_CURVE_LEN +
                      math.pi * r_cap_branch**2 * BRANCH_LEN)
    powder_mass_est = vol_powder_mm3 * 1e-9 * _alloy_loose_density(alloy.id) * 1000

    total_sheet_mass = mass_body + mass_branch + mass_cap_each * 3

    result = {
        "body_tube_OD_mm":       f"{r_cap_body*2:.1f} mm rolled",
        "body_wall_mm":          f"{SHEET_THICK} mm S235JR",
        "branch_tube_OD_mm":     f"{r_cap_branch*2:.1f} mm rolled",
        "cap_OD_mm":             f"Ø{dome_r*2:.0f} × {SHEET_THICK} mm dished",
        "capsule_sheet_mass_kg": f"{total_sheet_mass:.2f} kg",
        "powder_fill_est_kg":    f"{powder_mass_est:.1f} kg (loose fill ~65% TD)",
        "weld_class":            alloy.weld_class,
        "tolerance_class":       alloy.tolerance_class,
        "pickling":              alloy.pickling,
        "leak_test":             "≤ 1×10⁻⁶ mbar·L/s He (pre-HIP)",
        "hip_cycle":             f"{alloy.hip_temp_c}°C ± {alloy.hip_temp_tolerance_c} · {alloy.hip_pressure_mpa} MPa · {alloy.hip_hold_hours} h",
        "cooling":               alloy.hip_cooling,
    }
    if alloy.ferrite_target:
        result["ferrite_target"] = alloy.ferrite_target
    return result


# ── Step 4: Ports + hooks ─────────────────────────────────────────────────
def run_step_4(job, alloy, press) -> dict[str, Any]:
    r_body = job.pipe_radius_mm + CAPSULE_WALL_OFF

    # Fill pipe at t=0.92 (outlet run)
    fill_r    = 4.0;  fill_h = 30.0
    fill_pos  = _curve_approx(0.92)

    # Degas tube at t=0.08 (inlet run)
    degas_r   = 2.5;  degas_h = 24.0
    degas_pos = _curve_approx(0.08)

    # Hook WLL (Working Load Limit) per EN 1677-1
    # Capsule total mass estimate: sheet + powder
    shrink = _shrinkage(alloy.id)
    r_cap_body = r_body + SHEET_THICK
    vol_powder_mm3 = math.pi * r_body**2 * PIPE_CURVE_LEN
    total_mass = (
        _kg(_cyl_volume_mm3(r_cap_body, r_body, PIPE_CURVE_LEN)) +
        _kg(vol_powder_mm3, density_kg_m3=_alloy_loose_density(alloy.id) * 1000) +
        alloy.post_hip_mass_kg * 0.3   # jig estimate
    )
    safety_factor = 5.0
    wll_per_hook  = total_mass * safety_factor / 4   # 4 hooks
    hook_size     = "M16" if wll_per_hook < 2000 else "M20"

    result = {
        "fill_pipe":    f"Ø{fill_r*2:.0f} × {fill_h} mm · t=0.92 (outlet run)",
        "degas_tube":   f"Ø{degas_r*2:.0f} × {degas_h} mm · t=0.08 (inlet run)",
        "fill_pos_mm":  f"x={fill_pos[0]:.1f} y={fill_pos[1]:.1f} z={fill_pos[2]:.1f}",
        "degas_pos_mm": f"x={degas_pos[0]:.1f} y={degas_pos[1]:.1f} z={degas_pos[2]:.1f}",
        "hooks":        f"4× EN 1677-1 DIN 580 {hook_size}",
        "hook_wll_kg":  f"{wll_per_hook:.0f} kg / hook · 5:1 design factor (ASME BTH-1 Cat. B)",
        "hook_t_vals":  "t = 0.04 / 0.16 / 0.85 / 0.97",
        "total_lift_mass_est_kg": f"{total_mass:.0f} kg",
        "anchor_method":"surfacePointAt(t) + radialUpAt(t) — NOT bbox corners",
    }
    return result


# ── Step 5: Welded structure BOM ──────────────────────────────────────────
def run_step_5(job, alloy, press) -> dict[str, Any]:
    r_body   = job.pipe_radius_mm + CAPSULE_WALL_OFF
    r_branch = job.pipe_radius_mm * 0.78 + CAPSULE_WALL_OFF
    dome_r   = FLANGE_R + CAP_DISC_OVERHANG

    mass_body   = _kg(_cyl_volume_mm3(r_body + SHEET_THICK, r_body, PIPE_CURVE_LEN))
    mass_branch = _kg(_cyl_volume_mm3(r_branch + SHEET_THICK, r_branch, BRANCH_LEN))
    cap_h = dome_r * 0.22
    vol_cap_shell = math.pi * ((dome_r + SHEET_THICK)**2 - dome_r**2) * cap_h * 0.5
    mass_cap_each = _kg(vol_cap_shell)
    mass_ports    = 0.18   # fill + degas combined (kg)
    mass_hooks    = 0.18 * 4  # 4 hooks

    total = mass_body + mass_branch + mass_cap_each * 3 + mass_ports + mass_hooks

    result = {
        "body_tube":        f"Ø{(r_body)*2:.0f} rolled · {mass_body:.1f} kg · S235JR EN 10025",
        "branch_tube":      f"Ø{(r_branch)*2:.0f} rolled · {mass_branch:.2f} kg · S235JR",
        "dished_cap_x3":    f"Ø{dome_r*2:.0f} × {SHEET_THICK} mm · {mass_cap_each:.2f} kg each",
        "fill_degas":       f"{mass_ports:.2f} kg combined",
        "hooks_x4":         f"{mass_hooks/4:.2f} kg each · EN 1677-1",
        "weldment_total_kg":f"{total:.1f} kg",
        "capsule_material": "S235JR · EN 10025 · 3 mm sheet rolled",
        "weld_standard":    "SS-EN ISO 5817 class B · ISO 13920 AF · ISO 2553",
        "output_files":     "welded-structure.slddrw · .pdf · .step",
    }
    return result


# ── Step 6: Jig sizing + press fit check ─────────────────────────────────
def run_step_6(job, alloy, press) -> dict[str, Any]:
    r_cap     = job.pipe_radius_mm + CAPSULE_WALL_OFF + SHEET_THICK + 3   # cradle R
    n_saddles = len(SADDLE_POSITIONS)

    # Post height range: min at inlet (t=0.05, y≈0) → max at upper run (t=0.62, y≈150)
    post_h_min = max(8.0, 0 - r_cap - (-28))
    post_h_max = max(8.0, 150 - r_cap - (-28))

    # Jig base beams
    beam_mass = _kg(240 * 8 * 6 * 2)   # 2 × I-beams
    # Saddles (half-shell cylinders) mass
    saddle_mass = _kg(math.pi * r_cap * 18 * SHEET_THICK * 0.5) * n_saddles
    # Posts
    post_mass = sum(_kg(math.pi * 3**2 * h) for h in
                    [post_h_min, post_h_min * 1.5, post_h_max * 0.8, post_h_max])
    # Misc hardware
    misc = 4.0
    jig_total = beam_mass + saddle_mass + post_mass + misc

    # Press envelope fit
    cap_diameter = (job.pipe_radius_mm + CAPSULE_WALL_OFF + SHEET_THICK) * 2
    cap_height   = PIPE_CURVE_LEN + 2 * (FLANGE_T + 10)   # with caps
    fits_dia     = cap_diameter < press.bore_diameter_mm * 0.82
    fits_height  = cap_height   < press.hot_zone_height_mm * 0.90

    # ROI calc
    manual_hrs   = 14 * 8    # 14 days × 8 hrs
    automated_hrs = 6
    rate_per_hr  = 180       # USD
    roi_low  = (manual_hrs - automated_hrs) * rate_per_hr * 0.8
    roi_high = (manual_hrs - automated_hrs) * rate_per_hr * 1.1

    result = {
        "press":              f"{press.name} · {press.model}",
        "press_envelope":     f"Ø{press.bore_diameter_mm:.0f} × {press.hot_zone_height_mm:.0f} mm",
        "capsule_diameter_mm":f"{cap_diameter:.0f} mm",
        "capsule_height_mm":  f"{cap_height:.0f} mm",
        "fit_diameter":       "OK FITS" if fits_dia else "!! TOO WIDE",
        "fit_height":         "OK FITS" if fits_height else "!! TOO TALL",
        "jig_type":           f"{n_saddles} V-saddle cradles · {n_saddles} vertical posts · 3 cross diagonals",
        "saddle_positions":   "t = " + " / ".join(f"{t:.2f}" for t in SADDLE_POSITIONS),
        "post_height_range":  f"{post_h_min:.0f}–{post_h_max:.0f} mm",
        "jig_weight_kg":      f"{jig_total:.1f} kg · S235JR welded steel",
        "hip_cycle":          f"{alloy.hip_temp_c}°C ± {alloy.hip_temp_tolerance_c} · {alloy.hip_pressure_mpa} MPa · {alloy.hip_hold_hours} h",
        "roi":                f"${roi_low/1000:.0f}–${roi_high/1000:.0f}K saved · 14 days → {automated_hrs} hrs",
        "output_files":       "jig.sldasm · jig.step · jig.slddrw",
    }
    return result


# ── Curve helper (Catmull-Rom approximation at key t-values) ──────────────
_CENTERLINE = [
    (-80,0,0), (-30,0,0), (0,20,0), (25,60,0),
    (25,105,0), (30,135,10), (60,150,30), (120,150,40),
]

def _curve_approx(t: float) -> tuple[float, float, float]:
    """Linear interpolation along control points as a rough position."""
    n = len(_CENTERLINE) - 1
    idx = min(int(t * n), n - 1)
    frac = t * n - idx
    p0 = _CENTERLINE[idx]
    p1 = _CENTERLINE[min(idx + 1, n)]
    return (
        p0[0] + (p1[0] - p0[0]) * frac,
        p0[1] + (p1[1] - p0[1]) * frac,
        p0[2] + (p1[2] - p0[2]) * frac,
    )


# ── Alloy density lookup (g/cm³ → kg/m³) ──────────────────────────────────
_DENSITY = {
    "duplex_2507": 7800, "saf_2906": 7800,
    "inconel_625": 8440, "incoloy_825": 8140,
    "ss_316l":     7990, "inconel_718": 8190,
    "ti_6al_4v":   4430,
}
def _alloy_density(alloy_id: str) -> float:
    return _DENSITY.get(alloy_id, 7900)

def _alloy_loose_density(alloy_id: str) -> float:
    """Loose powder density ≈ 60-65% of theoretical (g/cm³)."""
    return _alloy_density(alloy_id) * 0.62 / 1000  # → g/cm³
