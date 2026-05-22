# MTC Powder Solutions — Engineering Brief for Mockup

**Audience:** Hanomi engineering team
**Owner:** Marco
**Date:** 2026-05-20
**Goal:** Build a mockup that convinces MTC the end to end HIP automation chain is real, gets them to commit to KPI alignment, and unlocks the paid pilot.
**Reference materials:** `/Users/marcomascolo/Downloads/[PERSONAL]Planning/end to end automation/` (13 reference screenshots from their workflow)
**Pitch deck:** `hanomi_mtc.html` / `hanomi_mtc.pdf` in this folder

---

## 1. Who they are

**Company:** MTC Powder Solutions AB
**HQ:** Surahammar, Sweden (also Hallstahammar facility)
**Ownership:** Part of Metal Technology Co (Japan)
**Process:** Hot Isostatic Pressing (HIP), near net shape (NNS)
**Equipment:** Quintus HIP units, recently expanded with a super-sized 1.6 × 3.5 m press
**Industries served:** Nuclear, aerospace, oil and gas, chemical, power generation, medical
**CAD stack:** SolidWorks
**Standards on drawings:** SS-EN ISO 2768 m/K (general tolerances), SS-EN ISO 5817 class B (weld quality), SS-EN ISO 13920 class AF (weld dimensions), HIP dimensional variation approx ±2% min ±4 mm

**Discovery call attendees:** Johan Fahlborg, Tonie Edlund (both on the SolidWorks screen-share)

---

## 2. What they actually do (the business in one paragraph)

Their clients in nuclear / aerospace / energy need a high precision pipe in expensive specialty material (e.g. nickel alloys, duplex stainless, etc.), with curved geometry, machined from a single solid piece. Welding is not allowed (stress concentration). The client cannot buy a block of material and machine the whole thing because the material is too expensive and unrecyclable. So they contract MTC to deliver a **near net shape blank**: an oversized, offset version of the final pipe with extra material around the geometry that the client then finish-machines into the final part. MTC produces the blank via HIP: powder + capsule + heat + isostatic pressure → fully dense solid metal in near-final geometry.

The client almost never shares the 3D model (IP protection). Almost always they send a 2D PDF drawing. Sometimes a STEP file. MTC's engineering team takes that PDF and runs the full design chain to set up the HIP run.

---

## 3. The current manual workflow (8 steps, 1 to 2 weeks of senior engineer per pipe)

Each step today is done manually by a senior mechanical engineer in SolidWorks.

| # | Step | What happens | Tool |
|---|------|--------------|------|
| 1 | **Client intake** | Receive 2D PDF drawing of the desired final pipe from the client. Sometimes STEP. | Email / PDF |
| 2 | **Reverse engineering** | Rebuild the 3D model of the final pipe in SolidWorks from the 2D PDF. | SolidWorks |
| 3 | **Blank generation** | Offset the geometry per internal rules (more offset around bends, etc) to produce the near net shape blank. Output is a fatter 3D version of the pipe with no holes or features. | SolidWorks |
| 4 | **Client approval drawing** | Generate a 2D drawing showing the blank cross section with the final part overlaid inside. Send to client. Iterate if client wants more offset around specific features. | SolidWorks drawing |
| 5 | **Enclosure design** | Design the sheet metal capsule that contains the powder during HIP. Multiple bent and welded panels. Sized for shrinkage using their internal formula (off limits to us). Includes powder inlet holes and lifting hooks (~200 kg parts). | SolidWorks sheet metal |
| 6 | **Enclosure drawings** | Produce the enclosure assembly drawing, the balloon BOM drawing (used for welding), and welding instructions. Standards: SS-EN ISO 5817 class B, SS-EN ISO 13920 class AF. | SolidWorks drawing |
| 7 | **Jig design** | Design the supporting jig that holds the enclosure during powder fill and HIP cycle. | SolidWorks |
| 8 | **Manufacturing handoff** | Hand drawings to shop. Weld enclosure, pour powder, HIP cycle, blank shrinks and solidifies, ship to client. (Not our scope.) | Shop floor |

**Pain quote from Marco's call:** "they spend one or two weeks of an engineer ... they have a small design team ... they want to use those experienced people not to make these stupid things."

---

## 4. Mockup scope — what we are building

**The mockup must demonstrate the FULL chain end to end on ONE representative pipe.** A partial demo (e.g. only step 2-3) will not land — they need to see the chain works because the entire pain is the chain, not any single step.

### 4.1 Input the mockup must accept

- A 2D PDF drawing of a bent / non-trivial pipe (we pick the test case from the reference images provided)
- Optional: a STEP file of the final pipe (we will demonstrate both paths)
- Reference: drawing in image `11.png` is a good candidate target — bent pipe with flanges

### 4.2 Outputs the mockup must produce

End to end, one batch, one click ideally:

1. **3D model of the final pipe** (the reverse engineered solid) — SolidWorks part file
2. **3D model of the HIP blank** (the offset oversized version) — SolidWorks part file, applying the offset rules we infer from their reference drawings
3. **Client approval drawing** — 2D drawing showing the blank cross section with the final pipe overlaid inside, dimensioned, ready to send to MTC's client for sign off
4. **3D model of the sheet metal enclosure** — bent sheet metal assembly that wraps the blank, with powder inlet holes and lifting hooks
5. **Enclosure assembly drawing** — full SolidWorks drawing with views, dimensions, BOM
6. **Enclosure balloon drawing** — the welding drawing they use on the shop floor, with ballooned BOM items
7. **3D model of the supporting jig** — holds the enclosure during the HIP cycle
8. **Jig drawing** — SolidWorks drawing for the jig

Bonus if achievable in the mockup window: SolidWorks native file outputs (.SLDPRT, .SLDASM, .SLDDRW) so they can open everything in their stack without conversion.

### 4.3 What we explicitly do NOT have to do in the mockup

- Their internal shrinkage formula (they own it, off limits, hard coded for the mockup is fine — call it out as a configurable parameter)
- The actual HIP process simulation (densification, shrinkage prediction) — not our scope
- Welding sequence simulation — not our scope
- BOM cost roll up — not our scope

---

## 5. Standards and constraints to encode in the output

The mockup output must visibly conform to these standards (drawing title block notes, tolerance callouts, weld symbols):

- **General tolerances:** SS-EN ISO 2768 m / K
- **Weld quality:** SS-EN ISO 5817 class B
- **Weld dimensions:** SS-EN ISO 13920 class AF
- **HIP dimensional variation:** approx ±2%, min ±4 mm
- **Title block format:** match the format visible in reference image `99.png` (their BOM table format)
- **CAD output target:** SolidWorks native (or DXF / PDF in the very first mockup, with native files queued as a fast follow up)

---

## 6. KPIs Marco committed to align on with MTC after they see the mockup

Marco told them: "after the mockup we jump on a call, you tell us clearly what are your KPIs, what is that you care about."

We do not need to hit final KPIs in the mockup, but the mockup should be benchmark-able against likely KPIs:

- **Time per pipe** (today 1 to 2 weeks → target hours, demonstrate compression on the test case)
- **Standards compliance rate** (how often the generated drawings match SS-EN ISO standards without manual correction)
- **Geometric correctness** (blank offset matches their internal rules within ±X mm)
- **Drawing readability** (views, sections, balloon numbering, weld callouts — does an MTC engineer accept the drawing as-is)
- **Engineer touch time vs total time** (how much of the 1-2 weeks is reclaimed)

The mockup should output a comparison artifact: "MTC engineer would normally spend N hours on this. Hanomi did the chain in M minutes."

---

## 7. Commercial framing the engineering team should know

Marco committed to the prospect:

- **Risk is on our side.** MTC does not pay for the mockup development.
- **First call after the mockup is a KPI alignment session**, not a sales pitch.
- **After KPI alignment, the path is a small paid pilot**, then subscription as usage scales.
- **They went out of the call excited**, possibly thinking Marco was over-promising. Mockup quality decides whether that read flips.
- **There are other companies that do this same workflow.** A solid mockup unlocks not just MTC but a vertical we can replicate.

Implication for the engineering team: **the mockup deserves real care, not a stub demo.** This is the first end to end engineering automation use case (not just 2D drawings) — winning MTC opens a new product line.

---

## 8. Reference materials (already collected)

All in `/Users/marcomascolo/Downloads/[PERSONAL]Planning/end to end automation/`:

| File | What it shows |
|------|---------------|
| `11.png` | Final client pipe drawing (the input we get from their client) |
| `22.png` | Workflow context |
| `33.png` | Workflow context |
| `44.png` | Workflow context |
| `55 - client.png` | MTC's HIP blank drawing (with MTC branding visible) |
| `66.png` | 3D HIP blank model (the offset oversized pipe) |
| `77.png`, `77 - enclosure.png`, `77 - detail.png` | Sheet metal enclosure wrapping the blank |
| `88.png` | Workflow detail |
| `99.png` | BOM / parts list with standards callouts (use this as the title block format reference) |
| `100.png` | Full assembly: blank inside enclosure on the jig |
| `101.png` | Sheet metal enclosure detail |

The HIP blank in image `66.png` and the enclosure in `100.png` are the canonical visual outputs the mockup must reproduce. Match the visual style.

---

## 9. Open questions to flag back to Marco before starting

These are things we should clarify with MTC during the KPI alignment call (after the mockup), not block the mockup on:

1. **Offset rules.** Do they have a written rulebook for how much material to add per geometric feature (bend radius, flange, straight section)? If not, we infer from the reference drawings.
2. **Shrinkage formula.** They said it is internal. Confirm they keep it private and we leave it as a configurable input parameter in our tool, not something we try to derive.
3. **Enclosure hole placement.** They said it is "experience based, no simulation." How much variability is acceptable for the mockup version — can we use rules of thumb derived from their reference enclosures, or do we need their input on every pipe class?
4. **Drawing template (.DRWDOT).** Do they have a standard SolidWorks drawing template they want the output anchored to? Ask in the KPI alignment call (per learnings R23).
5. **STEP availability.** They said clients sometimes share STEP. For the mockup, do they want us to demonstrate the STEP path or the PDF reverse engineering path as the primary flow?
6. **Pipe class scope.** Mockup on ONE pipe class first. Do we pick a representative bent pipe with flanges (per `11.png`) or do they have a specific archetype they want us to use?

---

## 10. Definition of done for the mockup

The mockup is ready to ship to MTC when:

- [ ] It runs end to end on at least one bent pipe test case (input PDF → all 8 outputs)
- [ ] The HIP blank visually matches the style of `66.png`
- [ ] The enclosure visually matches the style of `100.png` / `101.png`
- [ ] All drawings carry SS-EN ISO 2768 / 5817 / 13920 callouts in the title block
- [ ] At least one output is delivered as a SolidWorks native file (or there is a clear story why not)
- [ ] We have a side by side comparison artifact (time, touch points) we can show on the KPI alignment call
- [ ] The mockup is screen recordable end to end in under 5 minutes so it can also be shared async if the call slips

---

## 11. Next steps for the engineering team

1. **Pick the test case pipe.** Look at the reference images and propose which pipe geometry we run the mockup on. Marco's preference is the bent pipe in `11.png` — confirm or counter-propose.
2. **Sketch the pipeline.** Map the 8 manual steps to the Hanomi internal modules (which existing capabilities cover which step, what is the new build).
3. **Estimate effort.** Rough days-per-step estimate so Marco can sequence the KPI alignment call timing with MTC. Target: mockup ready for review within 2 to 3 weeks.
4. **Identify the biggest unknowns.** Reverse engineering from PDF (without STEP) is probably the hardest step. Flag it early.
5. **Share progress weekly.** Marco will pace MTC accordingly so they do not go cold.

---

**Bottom line for the team:** This is a higher leverage account than a standard drawing-generation client. The pain is the entire 1-to-2-week chain. Winning here means proving Hanomi can do end to end engineering automation, not just drawings. The mockup is the lever. Build it like it matters.
