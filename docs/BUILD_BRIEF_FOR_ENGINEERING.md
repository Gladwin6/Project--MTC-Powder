# Build Brief — Hanomi × MTC NNS-HIP Pipeline
**Prepared 2026-05-20 by Marco Mascolo for the engineering team building the real product.**

---

## TL;DR

We have a **fully working interactive mockup** (`index.html`) that visually demonstrates the 6-step Hanomi NNS-HIP pipeline tailored to MTC Powder Solutions AB. The mockup was iterated **13 times** against critique agents (MTC VP of engineering persona, demo coach, technical accuracy auditor, code review) — every design decision is documented in `IMPROVEMENT_LOG.md`.

> **CRITICAL — read this twice:**
>
> **The background 3D scene is currently a Three.js mock. In the real product it must be _SolidWorks_ (or whichever CAD we standardize on) running parametrically — NOT a random visualizer. Every shape — pipe, blank, capsule body, branch, dished caps, weld bead, fill pipe, degas tube, lifting hooks, jig — must be a parametric model in CAD, driven by typed inputs. Hard-coded numeric values are OK; random geometry is not. The animations (capsule fly-in, sweep, weld bead flash) must be preserved at the same cadence in the real product, whether re-implemented in the CAD viewport or in an animation layer over it.**

---

## What was built (mockup status)

### The 6-step pipeline (in the floating Hanomi panel on the right)

| # | Step | What the user sees |
|---|---|---|
| **1** | Input · STEP File | Vetco-pattern subsea gooseneck (2 long-radius elbows, 2 main flanges, 1 branch DN50 vent tee). Editable parameters: file name, target alloy (7 alloys in dropdown), application, mass post-machining, bounding box, B-rep faces, regulatory codes |
| **2** | Blank + 2D Drawing | 3D blank (orange offset model) on the LEFT half of the viewport + 2D drawing image on the RIGHT half. Editable shrinkage formula, offset rule, machining stock, output filenames |
| **3** | Sheet Metal Capsule | **Hero animation:** body tube sweeps along the pipe centerline (720 ms), branch tube sweeps in at 320 ms delay (480 ms), 3 dished caps snap onto the flange faces with weld bead flash (460 ms each, 140 ms stagger), weld bead torus appears at the branch tee with a brief orange flash. Total ~1.6 s |
| **4** | Ports + Lifting Hooks | Powder fill pipe (welded at curve t=0.92, outlet horizontal run) + degas tube (welded at t=0.08, inlet) + 4 lifting hooks (welded at t=0.04, 0.16, 0.85, 0.97). All anchored ON the capsule surface via `surfacePointAt(t)`, NOT at bounding box corners |
| **5** | Welded Structure Drawing | Exploded view: body tube + branch tube + 3 dished caps + ports + hooks pulled apart with numbered balloon callouts. BOM table overlay |
| **6** | Jig + Final Assembly | Full PM-HIP cradle rig: welded I-beam base frame + 4 V-saddle cradles physically conforming to the capsule curve + 4 vertical posts of variable height (30 mm at inlet → 180 mm at upper run) + 3 diagonal cross-braces + 2 anti-rotation pins + 4 corner lift lugs + 4 foot pads |

After Step 6, "Send to MTC for Approval" opens an email-modal mockup with: file list, deletion + phase 1/2 privacy commitment, pilot terms ("risk on Hanomi"), and an editable Acceptance Criteria panel (CMM, Charpy −46 °C NORSOK M-630, ferrite balance ASTM E562, helium leak, density Archimedes + reviewer sign-off field).

### Material registry (Step 1 dropdown)

7 alloys, each propagating cycle parameters across Steps 1/2/3/6 on selection: **Duplex 2507** (default · MTC primary) · Super-duplex SAF 2906 · Inconel 625 · Incoloy 825 · 316L · Inconel 718 · Ti-6Al-4V. Each alloy carries: HIP temperature, pressure, hold time, cooling regime, weld class, dimensional tolerance class, pickling chemistry, regulatory codes, expected post-HIP mass.

### Equipment fleet (Quintus pill, bottom-right of viewport)

3 MTC presses with full envelope data + last calibration date: **TeraPi-A** (Quintus QIH-294, Ø 1600 × 3500 mm — default for big subsea) · TeraPi-B (Quintus QIH-122, Ø 915 × 2200 mm — small batch) · QIH-21 (Ø 406 × 750 mm — R&D / small parts). Selection propagates to Step 6 params.

### Editable parameters everywhere

Every value cell in the parameters table is `contenteditable`. Engineers driving the demo can correct any value live — Hanomi is positioned as a draft generator that expects engineer correction, not an oracle.

---

## What is parametric in the mockup (and must be parametric in the real product)

This is the most important section of this document. **Read every line.**

### The pipe geometry is fully parametric in code today

Every shape in the 3D scene derives from these constants:

```
PIPE_RADIUS         = 12        ← pipe OD/2 (mm)
PIPE_TUBE           = 2         ← wall thickness (mm)
FLANGE_R            = 22        ← flange disc radius (mm)
FLANGE_T            = 6         ← flange thickness (mm)
FLANGE_BOLT_R       = 17        ← bolt circle radius (mm)
FLANGE_BOLTS        = 6         ← bolt count
CAPSULE_WALL_OFFSET = 14        ← radial clearance for powder + sheet (mm)
CAPSULE_TUBE_SEG    = 80        ← tubular segments (sweep animation resolution)
CAPSULE_RAD_SEG     = 24        ← radial segments (capsule roundness)
CAP_DISC_THICK      = 5         ← dished cap apparent thickness (mm)
CAP_DISC_OVERHANG   = 6         ← dished cap radius bonus over flange OD (mm)
```

Plus an array of 8 centerline points:
```
[ (-80, 0, 0), (-30, 0, 0), (0, 20, 0), (25, 60, 0),
  (25, 105, 0), (30, 135, 10), (60, 150, 30), (120, 150, 40) ]
```

And a 4-point branch centerline derived from the main curve at parameter t=0.55.

**The entire pipeline reflows from these constants.** Change `PIPE_RADIUS` and the pipe, the blank (which is `PIPE_RADIUS + 5`), the capsule body (`PIPE_RADIUS + CAPSULE_WALL_OFFSET`), the branch (`PIPE_RADIUS × 0.78 + CAPSULE_WALL_OFFSET`), the jig saddle inner radius, the V-saddle conforming curvature — all update automatically. The blank, the capsule, the exploded view, the jig, the ports — all parametric on `pipeCurve`, `branchCurve`, `flangePositions`.

### The real product MUST be parametric the same way

In SolidWorks (or NX, or whichever CAD we standardize on), the equivalent must hold:

1. **A parametric master model** with the same constants exposed as user parameters (`PIPE_RADIUS`, `CAPSULE_WALL_OFFSET`, `CAP_DISC_THICK`, etc).
2. **A centerline sketch** as a 3D spline with editable control points. Change a control point — the pipe, blank, capsule, jig all rebuild.
3. **Derived features**: capsule body = sweep along centerline at `PIPE_RADIUS + CAPSULE_WALL_OFFSET`. Dished caps = revolved feature parametric on `FLANGE_R + CAP_DISC_OVERHANG`. Jig saddles = swept cut at parameter t-points.
4. **A configuration table** mapping each of the 7 alloys to its HIP cycle parameters. Selecting "Inconel 625" rebuilds the param table, swaps the pickling chemistry, updates the regulatory code line on the title block — all automatically.
5. **Hard-coded values are FINE** — `25 mm` is a value, not "magic." What is NOT fine: free-form modeling that doesn't carry intent. Every dimension must come from a named parameter so an engineer can later say "increase the capsule offset by 2 mm" without re-modeling.

### The mockup is the spec — preserve every parametric decision

If the mockup says "capsule body radius = `PIPE_RADIUS + CAPSULE_WALL_OFFSET` = 12 + 14 = 26 mm," then the real product capsule is parametric on PIPE_RADIUS and CAPSULE_WALL_OFFSET. Not 26. The two underlying constants.

If the mockup says "saddle inner radius = `PIPE_RADIUS + CAPSULE_WALL_OFFSET + 3` mm clearance" — the +3 is intentional, the rest is derived. Replicate exactly.

The `IMPROVEMENT_LOG.md` has the rationale for every constant choice. Read it before changing one.

---

## The animations are the engineering story — preserve every one

The mockup uses a custom `tween()` utility with easing functions (`easeOutCubic`, `easeOutBack`, `easeInCubic`, `linear`). Every animation below must be replicated in the real product, whether by:
- A SolidWorks Motion Study (deterministic playback)
- A SolidWorks Composer animation export
- A scripted CAD viewport overlay
- An HTML/Canvas animation layered over the CAD viewport

| Animation | Duration | Easing | What it shows |
|---|---|---|---|
| Section accordion expand | 280 ms | easeOutCubic | Section opens smoothly |
| Section checkmark morph | 480 + 320 ms | spring + stroke | Step completes with a satisfying "tick" |
| Active step pulse | 1.2 s | infinite | Orange box-shadow pulses on the current step |
| Capsule body tube sweep (Step 3 entry) | 720 ms | easeOutCubic | Tube grows along the pipe centerline from start to end |
| Branch tube sweep (Step 3 entry) | 480 ms + 320 ms delay | easeOutCubic | Branch tube grows in after the body is mostly built |
| Dished cap fly-in (Step 3 entry) | 460 ms × 3, 140 ms stagger, 520 ms first delay | easeOutBack | 3 caps swing in from exploded positions to weld onto the flange faces |
| Weld bead flash on caps | 320 ms | linear triangle wave | Edge color: dark gray → hot orange (#ff6a18) → dark gray |
| Branch tee weld bead | 280 ms opacity + 360 ms flash, 760 ms delay | linear | Torus at branch junction fades in + briefly glows orange |
| Drawing-sheet slide-in (Step 2) | 280 ms | ease | 2D drawing image fades onto the right half of the viewport |

These are not decorative. The capsule fly-in is the demo's **hero moment** per the demo coach — it communicates "this is how a real engineering pipeline assembles." Replicate at the same cadence.

---

## What is currently a mock — and what to build for real

| Element | Mockup implementation | Real product target |
|---|---|---|
| **Pipe + blank + capsule + jig 3D scene** | Three.js BufferGeometry generated procedurally from constants | **SolidWorks parametric assembly** driven by the same constants. Animations via SolidWorks Motion Study or Composer |
| **Material registry** | JS object with 7 alloys, each carrying cycle params | SolidWorks design table OR a backend service feeding the CAD via API |
| **Press selector (Quintus fleet)** | Hardcoded 3-press registry, click pill to switch | Backend service returning the customer's actual press fleet from a config repo |
| **Editable parameters** | `contenteditable` DOM cells with `step.params` mutation | UI control posting param updates to the CAD API → CAD rebuild → re-render |
| **Capsule fly-in animation** | Three.js `tween()` utility, `setDrawRange` for sweep | SolidWorks Motion Study OR animated overlay (HTML/Canvas) sitting on top of the CAD viewport |
| **STEP file upload** | (Removed in iter 10 — see log) | Real STEP-only upload (.step / .stp). Native CAD files (.sldprt, .x_t, .ipt) rejected — they carry feature trees and IP |
| **Email modal "Send for approval"** | Mockup overlay with placeholder addresses | Real email send via the customer's SMTP / Microsoft Graph / Gmail API, with the Acceptance Criteria as a signed PDF attachment |
| **Drawing-sheet 2D pane** | Static PNG image overlaid on the right half of the viewport | **SolidWorks drawing view (.SLDDRW)** auto-generated from the 3D model, embedded in the right-half pane via SolidWorks Web API or eDrawings viewer |
| **Acceptance Criteria** | 6 default rows + free-form "+ Add criterion" | Same UI on top of a real database of acceptance criteria templates per alloy/customer |

**In short: the mockup is a visual + interaction spec. Everything in it has a real engineering counterpart — none of it is throwaway.**

---

## Architecture sketch for the real product

```
┌─────────────────────────────────────────────────────────────────────┐
│  CLIENT (engineer's browser)                                        │
│                                                                     │
│  ┌──────────────────────────┐  ┌─────────────────────────────────┐ │
│  │  Hanomi floating panel   │  │  CAD viewport                   │ │
│  │  (React/Vue/whatever)    │  │  (SolidWorks Web API embed)     │ │
│  │                          │  │                                 │ │
│  │  • Material picker       │  │  Real 3D model — parametric     │ │
│  │  • Editable params       │──┼─▶ assembly with the same        │ │
│  │  • 6-step state machine  │  │  constants from the mockup      │ │
│  │  • Press selector        │  │                                 │ │
│  │  • Acceptance Criteria   │  │  + 2D drawing pane (right half  │ │
│  │  • "Send for approval"   │  │    of viewport) showing the     │ │
│  └────────────┬─────────────┘  │    auto-gen .SLDDRW             │ │
│               │                 └─────────────────────────────────┘ │
│               │                                                     │
└───────────────┼─────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND                                                            │
│                                                                     │
│  ┌────────────────────┐  ┌───────────────────┐  ┌───────────────┐  │
│  │ Param service      │  │ CAD orchestrator  │  │ Animation     │  │
│  │ (alloys, presses,  │  │ (SolidWorks API,  │  │ orchestrator  │  │
│  │ acceptance         │  │ rebuild on param  │  │ (Motion Study │  │
│  │ criteria)          │  │ change, generate  │  │ trigger on    │  │
│  │                    │  │ .SLDDRW + .step)  │  │ step entry)   │  │
│  └────────────────────┘  └───────────────────┘  └───────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## What engineers MUST preserve from the mockup

1. **Frosted-glass floating panel** — `rgba(255,255,255,0.93)` + `backdrop-filter: blur(20px) saturate(1.8)` + `border-radius: 14px`. Matches the real Hanomi Overlay App aesthetic.
2. **CAD viewport background** — light gray (`#f2f2f2`) + subtle grid floor. NOT black. Matches SolidWorks / NX default backdrop.
3. **STEP-only upload boundary** — `.step` / `.stp` accepted. Native CAD files rejected with an explicit IP-protection message.
4. **Editable parameters everywhere.** Every value in the params table is correctable inline by the engineer driving the demo. "· DRAFT" pill appears on cells that have been changed.
5. **Conformal capsule geometry** — the capsule is a tube-offset shell that follows the pipe centerline, with dished caps at the flange faces and a weld bead at the branch tee. NOT a cuboid box. Iters 8 + 9 + 10.
6. **V-saddle PM-HIP jig** — saddle cradles physically conform to the capsule diameter at 4 points along the pipe curve. Welded I-beam base + vertical posts + diagonal bracing + corner lift lugs. Iter 12.
7. **Auxiliary parts on the curve, not the bounding box.** Ports + hooks + saddles anchor on `pipeCurve.getPoint(t)` + `surfacePointAt(t)`, never at bbox corners. Iter 11.
8. **The 6 step buttons say "Draft X →"**, not "Generate X →". "Draft" is the engineering voice; "Generate" reads as AI-slop.
9. **All FEA/GA claims explicitly framed as deferred.** "Rule-based per-feature offset (US6210633B1) · MTC formula plugs in." Phase 1 uses generic ASTM A988 / NORSOK baseline. Phase 2 onward is the customer-hosted module with the customer's private shrinkage formula.
10. **Acceptance Criteria + Pilot terms** in the email modal. Pilot is "risk on Hanomi · pay on acceptance" — concrete deliverables + measurable bars, not marketing.

---

## What engineers should change / build next (deferred from the mockup)

Highest-priority deferred items (full list in `IMPROVEMENT_LOG.md` → DEFERRED sections):

1. **Step 0 PDF intake** — 60-90 % of MTC's real jobs start from a 2D PDF, not a STEP file. Vision pipeline extracts views, dimensions, GD&T, title block, reconstructs a parametric STEP. Full implementation spec exists in the iter-4 agent transcripts (ask Marco).
2. **Real CAD integration** — replace Three.js with SolidWorks (or NX / CATIA via their APIs). The mockup's Three.js scene is the spec for what the parametric CAD model must produce.
3. **Step 7: post-HIP machining stage** — current pipeline ends at the HIP-ready assembly. The actual deliverable to MTC's customer is the machined NNS forging. Add a final step covering: capsule removal, HNO₃/HF pickling, CMM verification, machining stock removal.
4. **Hastelloy C-276 + CoCr alloys** — round out the material registry. Add to the alloy dropdown with cycle parameters.
5. **"Why this isn't GPT" first-load tooltip** — three rows explaining what is and isn't LLM-driven: "Shrinkage: rule-based + your private formula (not LLM)" / "Offset: deterministic per-feature rules (not LLM)" / "Drawings: SolidWorks API + ISO templates (not LLM)." LLM is used ONLY for: reading client PDFs, drafting weld notes for engineer review.
6. **Backend services** — parameter service, CAD orchestrator, animation orchestrator (see architecture sketch above).

---

## What success looks like

A live demo where the user:

1. Opens the Hanomi panel, expands "3D Design for NNS HIP," clicks "Launch MTC Pipeline →"
2. **Step 1**: Sees the actual MTC client part loaded in SolidWorks. Clicks the alloy dropdown, picks Super-duplex SAF 2906 — the title block, pickling chemistry, and HIP cycle params all update in the CAD model. Edits "mass post-machining" inline, the value persists.
3. **Step 2**: Clicks "Draft Blank →" — SolidWorks generates the parametric NNS blank with the appropriate offset stock + shrinkage compensation. The auto-generated .SLDDRW appears in the right-half pane of the viewport, alongside the 3D blank on the left.
4. **Step 3**: Clicks "Draft Capsule →" — SolidWorks generates the conformal sheet-metal capsule (tube body + branch + dished caps + weld bead), and an animation (Motion Study or overlay) plays the assembly: body sweeps along the centerline, branch grows in, caps fly onto the flange faces with the weld bead flashing.
5. **Step 4**: Ports + hooks welded on the capsule surface at the correct curve points, all conforming to the gooseneck geometry.
6. **Step 5**: Exploded view auto-generated as a SolidWorks drawing. BOM table populated from the actual assembly.
7. **Step 6**: Jig generated parametrically — V-saddles conforming to the capsule at 4 points, on a welded steel frame.
8. Final email to the customer with the .SLDDRW, .SLDASM, .STEP and the Acceptance Criteria PDF — all generated from the parametric model.

**Total engineer touch on a new pipe job: under 1 day. MTC baseline today: 14 days.**

That is the product.

---

## Contact

Marco Mascolo · marco@hanomi.ai · +1 628 303 4045
Drishti Bhasin (CTO) · +1 448 231 7765

Read order for engineers picking this up:
1. **This document** (`BUILD_BRIEF_FOR_ENGINEERING.md`)
2. `README.md` (orientation + invariants + 10 hard rules)
3. `IMPROVEMENT_LOG.md` (13 iterations of design decisions + rationale)
4. `MTC-engineering-brief.md` (technical brief for MTC specifically)
5. `MTC-hip-capsule-reference-library.md` (research references — Vetco patent, Bodycote patent, MDPI papers, OSTI reports)
6. `index.html` — open in any modern browser, click through, study the parametric architecture in the source
