# MTC HIP Capsule — Master Reference Library for the Engineering Team

**Date:** 2026-05-20
**Owner:** Marco
**Source:** Deep research synthesis of 8 parallel research agents
**Purpose:** Single canonical reference deck for the Hanomi engineering team building the MTC mockup. Replaces ad-hoc Googling.

---

## TL;DR — The Verdict

There is **no public STEP file for an actual HIP sheet metal capsule** anywhere. Every HIP NNS supplier treats the capsule as proprietary IP. **The capsule is the part Hanomi has to invent** — that is the moat.

What does exist publicly, ranked by usefulness:

1. **One patent matches MTC's bent-pipe subsea use case exactly:** WO2022128356A1 (Vetco Gray Scandinavia, 2021) — HIP gooseneck with API flange, male hub, integrated lifting pad eye.
2. **One joint MTC-group paper has dimensioned capsule drawings:** Shimoda Technical Report E-4 (Shimoda Iron Works + MTC) on duplex subsea valve body PM-HIP.
3. **Two recent Bodycote patents** describe the current sheet-metal weldment capsule construction with dimensional ranges: US11673191B2 and US11478849B2.
4. **Twelve ORNL / EPRI / DOE technical reports** have CAD-reverse-engineerable dimensions.
5. **HIP'17 and HIP'22 conference proceedings** are the single most capsule-image-dense PDFs available (purchase from Materials Research Forum).
6. **The MTC website article archive** is the richest free image library of real PM-NNS capsule progressions.

---

## 1. Recommended Mockup Composition Trio (start here)

For the v1 mockup, build the test case from these three GrabCAD files:

| Role | File | URL |
|---|---|---|
| **Target part (the bent pipe MTC's client sends)** | Bend pipe with flange | https://grabcad.com/library/bend-pipe-with-flange-1 |
| **Enclosure topology (the HIP capsule wrapping the pipe)** | Welded Pressure Vessel + #22 Argon Gas Bottle for port stubs | https://grabcad.com/library/welded-pressure-vessel-1 |
| **Jig (sustaining the capsule during HIP)** | Sand Casting Mold Jig | https://grabcad.com/library/sand-casting-mold-jig-1/files |

Hanomi's automation pipeline then generates the rest of the chain (blank with offset, capsule wrap, jig, drawings).

**Backup target parts** to test pipeline complexity:
- 90 Degree Flanged Pipe Elbow: https://grabcad.com/library/90-degree-flanged-pipe-elbow-1
- Pipe spool: https://grabcad.com/library/pipe-spool-1
- Stainless steel elbow 90 DIN 11852: https://grabcad.com/library/stainless-steel-elbow-90-din-11852-1
- 6 inch gate valve with molds: https://grabcad.com/library/complete-6-inches-gate-valve-design-and-its-molds-1
- Wye pipe: https://grabcad.com/library/wye-pipe-1
- Turbine blisk: https://grabcad.com/library/turbine-blisk-bladed-disk

---

## 2. Patent Gold Mine (highest fidelity public capsule references)

### Direct MTC use case match
- **WO2022128356A1** — Vetco Gray Scandinavia AS, 2021. HIP-manufactured oil & gas gooseneck. Arch-shaped fluid duct, integrated lifting pad eye, male hub, API flange. https://patents.google.com/patent/WO2022128356A1/en

### Sheet metal weldment capsules (most current)
- **US11673191B2** — Bodycote IMT Inc, 2023. Sheet-metal capsule from hydroformed half-shells. Radius 50-1000 mm, sheet 1-5 mm thick. https://patents.google.com/patent/US11673191B2/en
- **US11478849B2** — Bodycote HIP Ltd, 2022. AM core + cylindrical sheet metal liners (2-5 mm). https://patents.google.com/patent/US11478849B2/en
- **US20190134710A1** — Sagittite Ltd, 2017. Sheet-metal body, longitudinally fused, diagonally opposed degas + purge tubes, flanged end caps with "bullet" structures inside ports. https://patents.google.com/patent/US20190134710A1/en

### Endplate dimensions
- **US20130142686A1** — ATI Properties, 2011. Tapered endplate with central bore for fill stem. Outer dia 1-30", chamfer 30-60°, taper 3-15° (typ 8°), corner radius 0.5-3.0" (typ 2.0"), thickness 0.25-1 inch. Most dimensionally explicit endplate patent. https://patents.google.com/patent/US20130142686A1/en

### Swedish lineage (direct MTC ancestors)
- **US4373012A** — Granges Nyby AB, 1979. Spiral-welded tube outer wall, 1.5 mm low-carbon steel, 45° conical front insert, central bore. https://patents.google.com/patent/US4373012
- **US4935198A** — Avesta Nyby Powder AB, 1988. Cylindrical capsule with internal mandrel for forming central bore. https://patents.google.com/patent/US4935198

### Clamshell / variable-wall
- **EP1669144B1** — Rolls-Royce, 2005. Two welded half-shells, aperture for fill pipe, yttria stop-off. https://patents.google.com/patent/EP1669144B1/en
- **US6210633B1** — Lab of New Technologies, 2000. Variable wall thickness (butt:cyl = 5:1) to control radial shrinkage from 12-13% down to 3-4%. https://patents.google.com/patent/US6210633
- **US7261855B2** — Troitski et al., 2004. Toroidal multi-layer inserts make curved cavities. Explicit dimensions: 30" dia × 20" high part, 4.5" toroidal manifold. https://patents.google.com/patent/US7261855

### Kobelco / Japanese capsule manufacturing equipment
- **US5096518A** + **US5147086A** — Kobe Steel, 1990-91. Foil capsules 30-300 μm, 350×500 mm or 100×150 mm envelopes; welding parameters specified (6A pulse, 1150A seam resistance). https://patents.google.com/patent/US5096518A/en

### Foundational reference
- **US4383809A** — MTU Aero Engines, 1981. Ceramic core + outer metal skin + central filler port. Canonical capsule template. https://patents.google.com/patent/US4383809

**Browse the full USPTO HIP class:** https://patents.justia.com/patents-by-us-classification/419/49

---

## 3. Joint MTC / Shimoda Paper (the closest thing to MTC's internal practice)

**Shimoda Technical Report E-4 — A Development of PM-HIP NNS Manufacturing Process for Subsea Valve Bodies Made of Duplex Stainless Steel** (Shimoda Iron Works + MTC Powder Solutions). Dimensioned capsule figures, shrinkage allowances, weld design for capsule shells. **Direct authorship by MTC's parent group — closest public window into how they actually build capsules.**

URL: https://shimoda-flg.co.jp/en/wp-content/uploads/2020/08/E-4.-A-Development-of-PM-HIP-NNS-Manufacturing-Process-for-Subsea-Valve-Bodies-Made-of-Duplex-Stainless-Steel.pdf

---

## 4. ORNL / EPRI / DOE Technical Reports with CAD-Reverse-Engineerable Dimensions

| Report | Why it matters |
|---|---|
| **OSTI 1822264** — Inconel 740H pipe-elbow PM-HIP capsule (EPRI Final, 2021) | **Pipe-elbow geometry = MTC's exact use case**, full dimensions, 50% cost reduction. https://www.osti.gov/servlets/purl/1822264 |
| **OSTI 2311108** — sCO2 NNS HIP (GE/DOE, DOE-GE-08996) | Haynes 282 turbine nozzle ring + casing + bimetallic pipe with pre-HIP capsule drawings, shrinkage maps, post-HIP verification. https://www.osti.gov/biblio/2311108 |
| **OSTI 2586814** — Radial gradient bi-metallic Cu-HEA/Cr capsule (ORNL, 2025) | Multi-material capsule partition geometry, powder-loading mechanism diagrams. https://www.osti.gov/pages/servlets/purl/2586814 |
| **OSTI 2588255** — 316H "rabbit" irradiation capsule (ORNL AMMT, 2025) | Small but fully dimensioned reference. https://www.osti.gov/biblio/2588255 |
| **OSTI 3002595** — AM Integrated Pressure Limiting System | Cylindrical rupture wall + shield + supports, drawing-grade dimensions. https://www.osti.gov/servlets/purl/3002595 |
| **ORNL Pub131869** — HFIR irradiation capsule families | Multi-variant capsule library with dimensioned cross-sections. https://info.ornl.gov/sites/publications/Files/Pub131869.pdf |
| **ORNL/TM-2024/3578** — Large AM canister 2000-lb 410NiMo | Wire-DED + laser-DED capsule wall topology + stiffener placement. https://www.osti.gov/servlets/purl/2474743 |
| **Stack Met / Synertech SMR paper** | 50" upper head, 27 penetrations, 2400 lb HIP capsule, 1200 lb access port still inside its HIP capsule (photo). https://www.stackmet.com/wp-content/uploads/2020/08/small-modular-reactor-vessel-manufacture-stack-metallurgical-group-synertech.pdf |
| **NRC ML20342A377** + **NRC ML19098A197** | NuScale PM-HIP capsule strategy and component dimensions. https://www.nrc.gov/docs/ML2034/ML20342A377.pdf |
| **JAEA — ITER Test Blanket Module HIP** | Fusion-grade RAFM steel HIP capsule, module-scale dimensions. https://www.azom.com/article.aspx?ArticleID=5917 |

---

## 5. Academic Capsule Design Methodology (FEA, optimization, shrinkage)

| Paper | Why useful |
|---|---|
| **MDPI Sobhani 2023 — Design Optimization of HIP Capsules** | FEA + Multi-Objective Genetic Algorithm framework. The clearest public algorithmic blueprint for what Hanomi is building. https://www.mdpi.com/2504-4494/7/1/30 |
| **arXiv 2506.11946 (Sarkar et al., ORNL, 2025)** | Visco-plastic constitutive model for densification + shape prediction. Free preprint. https://arxiv.org/pdf/2506.11946 |
| **Van Nguyen et al. 2020** — DEM + FEM modelling of Ti-6Al-4V HIP | Best DEM→FEM coupling template for non-trivial shapes. https://www.sciencedirect.com/science/article/abs/pii/S0921883119302377 |
| **Sarkar et al. 2026 AIP Advances** — DEM-FEM coupling methodology | Authoritative reference for digital twin. https://pubs.aip.org/aip/adv/article/16/4/040701/3388385 |
| **Lou et al. 2024** — Vibration parameters → initial density gradients | Concrete design heuristic for filling protocols. https://link.springer.com/article/10.1007/s00170-024-14030-8 |
| **Sobhani et al. 2023** — Particle segregation in capsule filling | Design rule: avoid cone tapers. https://www.sciencedirect.com/science/article/abs/pii/S1569190X2300028X |
| **Mashl & Eklund — Subsea Manifolds via HIP PM NNS** | Sandvik Powdermet → MTC lineage industrial case study. https://www.researchgate.net/publication/267609652 |
| **Mashl 2008 — Demanding Environment Applications** | Sandvik survey of NNS HIP 1985-2008. https://www.sciencedirect.com/science/article/abs/pii/S1006706X08600643 |
| **NASA NTRS 20050181957** — Net-Shape HIP PM Rocket Engine Components | Free PDF, sacrificial capsule + insert drawings, full dimensioned cross-sections. https://ntrs.nasa.gov/api/citations/20050181957/downloads/20050181957.pdf |
| **ORNL/Nag 2026** — AM-printed capsule (2000-lb 410NiMo) | Forward path for Hanomi automation target. https://www.ornl.gov/news/advanced-manufacturing-enables-pm-hip-large-critical-parts |
| **Validation of duplex steel HIP** (2022) | Critical for MTC subsea use case (duplex/super-duplex). https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9503689/ |
| **Inconel 625 HIP maps** (2017) | (T, P, t) densification regimes for subsea-grade Ni alloy. https://link.springer.com/article/10.1007/s00170-016-9650-9 |

### Shrinkage rules per material (consolidated from literature)
- **Austenitic / duplex stainless steel**: ~12-14% linear (Mashl 2008, Shimoda E-4)
- **Inconel 625 / 718**: ~13-15% linear (Cai 2017, Sobhani 2023)
- **Ti-6Al-4V**: ~10-12% linear (Van Nguyen 2020)
- Thinner walls accommodate shrinkage better than thicker; avoid sharp tapers

---

## 6. HIP Supplier Publications (richest free image libraries)

### MTC Powder Solutions — articles archive (six articles, 2020-2024)
- **PM NNS HIP — best AM process** (2020-07-13). 6 captioned figures: separator cap (1980s), forging vs HIP blank, subsea manifold, steam chest, multi-material exhaust valve bonding 12 alloys. https://www.mtcpowdersolutions.com/articles/pm-nns-hip-best-additive-manufacturing-process-world/
- **How to reduce costs by implementing NNS HIP from early stage** (2021). https://www.mtcpowdersolutions.com/articles/how-reduce-costs-further-implementing-near-net-shape-hot-isostatic-pressing-nns-hip-early-stage/
- **A glance inside the world leader of PM NNS HIP — Design Team** (2021). https://www.mtcpowdersolutions.com/articles/a-glance-inside-the-world-leader-of-pm-nns-hip-design-team/
- **PM HIP for SMR critical components** (2022). https://www.mtcpowdersolutions.com/articles/how-pm-hip-is-the-enabler-for-commercially-manufacturing-critical-components-for-small-modular-reactors/
- **A new era for NNS HIP** (2020). https://www.mtcpowdersolutions.com/articles/new-era-near-net-shape-hip/
- **Intricate Designs gallery** — https://www.mtcpowdersolutions.com/advantages/intricate-designs/

### Bodycote
- **Powdermet® NNS landing**: https://www.bodycote.com/services/hot-isostatic-pressing/powdermet-technologies/powdermet-near-net-shape-nns/
- **2017 Powdermet brochure (PDF)** — Hybrid + 3DP + NNS + SSNS taxonomy: https://www.bodycote.com/wp-content/uploads/2017/11/Powdermet-brochure-bodycote.pdf
- **Oil & Gas interactive HIP**: https://oil-and-gas-interactive.bodycote.com/processes_hip.php
- **HIP simulation + capsule design**: https://www.bodycote.com/services/hot-isostatic-pressing/hip-supporting-services/simulation-and-analysis/

### Sandvik (pre-2020 legacy → now MTC)
- **Energy Oil & Gas magazine feature** on Sandvik Powdermet: https://energy-oil-gas.com/news/sandvik-powdermet/
- **NNS white paper PDF**: https://www.metalpowder.sandvik/siteassets/metal-powder/products-applications/hot-isostatic-press/advances-in-applications-for-gas-atomised-powders-in-nns-manufacturing.pdf
- **Quad-metal exhaust valve spindle (HIP'14 Stockholm "Parts of Excellence" winner, Berglund & Östlund)**: https://www.metal-powder.tech/sandvik-awarded-for-its-hip-quad-metal-exhaust-valve-spindle/

### Kobelco — single best public capsule dimension envelopes
- **Dr. Capsule machine page** — Φ33 × 50 mm small metal capsules, TIG-welded, vacuum-evacuated, 650 °C heat-seal, 0.14 Pa. https://www.kobelco.co.jp/english/products/ip/product/hip/hip_07.html
- **Metal-foil encapsulation equipment** — Compact 200×200, Standard 400×400, Large 700×700 mm capsule footprints; 100-300 μm foil thickness.

### Carpenter Additive
- **PM-HIP for energy industry** (2023) — Micro-Melt 316LN for CERN LHC end-covers; Micro-Melt 2505 Super Duplex for offshore. https://www.carpenteradditive.com/news-events/pm-hip-near-net-shape-manufacturing-for-the-energy-industry

### Pressure Technology Inc (US service bureau, applications-by-industry gallery)
- HIP applications hub: https://www.pressuretechnology.com/hip-applications.php
- PM gallery (firearms, food, tool steels, medical, oil & gas, paper, railcar wheels, turbine shafts): https://www.pressuretechnology.com/hip-applications-powder.php
- HIP capabilities + furnace dimensions: https://www.pressuretechnology.com/hip-capabilities-equipment.php

### Wallwork Group — 2025 second Quintus HIP photo (fresh public reference)
- https://wallworkht.co.uk/second-hot-isostatic-press/

### Hiperbaric HIP Innovation Center (Burgos) — six processed-components thumbnails
- https://www.hiperbaric.com/en/hip-technology/hip-innovation-center/

---

## 7. HIP Conference Proceedings (the capsule-photograph-densest PDFs you can buy)

**Materials Research Forum Vol. 38 — HIP'22 Proceedings** (ed. Welk / Samarov / Orcutt / Gandy / Fraser). https://mrforum.com/product/hip22/

Capsule-rich papers:
- Shiokawa et al. — HIP-NNS to Large Complex Products Using Super Duplex
- Kitamori et al. — Fabrication of Large 3-D Flow Path Structure Using SS Flexible Tube
- Deng/Kaletsch/Broeckmann — Simulation-Based Manufacturing of NNS Components
- Chung et al. — Modelling of Powder Filling of HIP Canisters
- Sobhani et al. — DEM-FEA Coupling for PM-HIP Capsule Filling
- Seliverstov/Khomyakov/Samarov — HIP Modeling of Large Complex Shape Parts Accounting Capsules Manufacturing Technology
- Bochkov et al. — Capsule Material Strain Hardening on Long Cylindrical Blanks During HIP

**Materials Research Forum — HIP'17 Proceedings**. https://mrforum.com/product/hot-isostatic-pressing/

Capsule-rich papers:
- Eklund/Ahlfors — HIP for Automotive Cast Al Alloys Car Rims
- Shiokawa et al. — HIP Process of Valve Body to NNS Using Grade 91 Powder
- Lapina et al. — Exhaust Valve Spindles for Marine Diesel by HIP
- Deng/Kaletsch/Bezold/Broeckmann — Precise Prediction of NNS HIP via DEM/FEM
- Eklund/Ahlfors — TeraPi 3.5-Meter Hot Zone for Large Components
- Raisson et al. — Modeling Very Large NNS Parts up to 2.5 m diameter
- Gandy et al. — SMR Vessel Manufacture using PM-HIP and EB Welding

**Open-access older HIP edition (free PDF)**: https://mrforum.com/wp-content/uploads/open_access/9781644900031.pdf

**HIP'25 / HIP'26 Aachen (EPMA + RWTH IWM)** — next live conference: https://www.epma.com/event/hip-conference-aachen/

**EPMA Intro to PM-HIP Technology handbook** (capsule images): http://www.cef3d.fr/COSS/wp-content/uploads/2019/02/27/EPMA-Introduction-to-PM-HIP-Technology-English.pdf

---

## 8. Adjacent Process CAD (topology analogs for the capsule)

The HIP capsule topology decomposes into thin-wall welded sheet metal + inlet/outlet ports + lift lugs + internal supports. The following adjacent processes share that topology and have public CAD:

### Topology mapping cheatsheet

| HIP capsule feature | Best analog process | Best CAD model |
|---|---|---|
| Thin-walled welded enclosure | Pressure vessel | Cylindrical Pressure Vessel — https://grabcad.com/library/cylindrical-pressure-vessel-1 |
| Fill / evacuation port | Sand casting sprue | Sand Casting full assembly — https://grabcad.com/library/sand-casting-2 |
| Internal support pillars | MIM ejector pins | Plastic injection mold — https://grabcad.com/library/plastic-injection-mold-41/files |
| External lifting lugs | Pressure vessel + investment tree | Pressure Vessel Assembly — https://grabcad.com/library/pressure-vessel-assembly-1/files |
| Conforming net-shape wrap | Investment shell | Metal Casting Patterns — https://grabcad.com/library/metal-casting-patterns-1 |
| Clamshell weld seam | Cope/drag split + two-plate mold | Sand Casting Mold — https://grabcad.com/library/sand-casting-mold-1 + Injection Molding Two Plate Mold — https://grabcad.com/library/injection-molding-two-plate-mold-1 |
| Single-piece drawn capsule | Deep drawing | Deep Drawing Sheet Metal Part — https://grabcad.com/library/deep-drawing-sheet-metal-part-1 |
| Loading / restraint fixture | Diffusion bonding | Bonding Fixture — https://grabcad.com/library/bonding-fixture-for-automation-machine-1 |
| Lifting hook | Standard ASME lifting | LIFTING LUG — https://grabcad.com/library/lifting-lug-1 + Hatch Cover Lifting Lug — https://grabcad.com/library/hatch-cover-lifting-lug-1/files |
| Furnace charge jig | Welding table / fixture | Welding table 1500x1000 — https://grabcad.com/library/welding-table-1500x1000-d16-1 |

### Closest pressure-vessel weldment analogs (drop-in starting geometry)
- Welded Pressure Vessel: https://grabcad.com/library/welded-pressure-vessel-1
- Pressure Vessel ASME VIII-1: https://grabcad.com/library/pressure-vessel-asme-viii-1
- Vacuum Vessel ITER Project: https://grabcad.com/library/vacuum-vessel-iter-project-1
- Argon Gas Bottle (welded shell + dished bottom + neck/port): https://grabcad.com/library/argon-gas-bottle-1
- Retort 1200 / Autoclave: https://grabcad.com/library/retort-1200-autoclave-1
- Jacketed Vessel: https://grabcad.com/library/jacketed-vessel-2

### Sheet metal weldment topology
- Weld Sheet Metal Box example: https://grabcad.com/library/weld-sheet-metal-box-example-1
- Sheet Metal Box + Drawing (has companion 2D drawing for validation): https://grabcad.com/library/sheet-metal-box-drawing-1
- Sheet Metal Enclosure SolidWorks project: https://grabcad.com/library/sheet-metal-enclosure-solidworks-project-1

### Jig and fixture analogs
- Sand Casting Mold Jig: https://grabcad.com/library/sand-casting-mold-jig-1/files
- Jig and Fixture Assembly: https://grabcad.com/library/jig-and-fixture-assembly-1
- Jig Frame Pipe Tube Manifold: https://grabcad.com/library/jig-frame-pipe-tube-manifold-1
- Rigging Spreader Bar & CamLok Fitting (200 kg+ lifting): https://grabcad.com/library/rigging-spreader-bar-camlok-fitting-1

---

## 9. Target Parts the Capsule Wraps (subsea, valves, blisks, manifolds)

### Bent pipes with flanges (priority)
- Bend pipe with flange: https://grabcad.com/library/bend-pipe-with-flange-1
- 90-Degree Flanged Pipe Elbow: https://grabcad.com/library/90-degree-flanged-pipe-elbow-1
- Stainless Steel Elbow 90 DIN 11852 (with material spec): https://grabcad.com/library/stainless-steel-elbow-90-din-11852-1
- 10" Diameter 90° Elbow Pipe Fitting (large subsea scale): https://grabcad.com/library/10-diameter-90-degree-elbow-pipe-fitting
- Pipe spool (multi-flange jumper): https://grabcad.com/library/pipe-spool-1

### Subsea trees / manifolds
- Subsea tree: https://grabcad.com/library/subsea-tree-1
- Subsea XT (valve-block-heavy): https://print.grabcad.com/library/subsea-xt-1
- GrabCAD subsea tag landing: https://grabcad.com/library?sort=most_downloaded&tags=subsea

### Valve bodies
- 6" Gate Valve + Molds (companion mold = capsule analog already): https://grabcad.com/library/complete-6-inches-gate-valve-design-and-its-molds-1
- 6" Ball Valve: https://grabcad.com/library/6-ball-valve-1
- 2-1/16" API 6A Choke Valve: https://grabcad.com/library/2-1-16-valve-choke-1
- Oil and Gas Valves (4-5 valve bodies in one file): https://grabcad.com/library/oil-and-gas-valves-1

### Pump casings
- End Suction Centrifugal Pump Volute Casing: https://grabcad.com/library/end-suction-centrifugal-pump-volute-casing-1
- Multistage Centrifugal Pump: https://grabcad.com/library/multistage-centrifugal-pump-3

### Aerospace / power gen (blisks, casings, impellers)
- Turbine Blisk (Bladed Disk): https://grabcad.com/library/turbine-blisk-bladed-disk
- Gas Turbine Disc: https://grabcad.com/library/gas-turbine-disc-1
- Jet Engine Inner Casing Assembly: https://grabcad.com/library/jet-engine-inner-casing-assembly-1
- Centrifugal Compressor Impeller: https://cad.grabcad.com/library/centrifugal-compressor-impeller-1

### Wye / tee / block fittings (MTC's stated portfolio)
- Wye Pipe: https://grabcad.com/library/wye-pipe-1
- 5 Stages Manifold Block NG6: https://grabcad.com/library/5-stages-manifold-block-ng6-1
- T Joint Pipe Fitting: https://grabcad.com/library/t-joint-pipe-fitting
- Swivel Joint: https://grabcad.com/library/swivel-joint-3

---

## 10. Engineering Team Action Items

### Week 1 (foundation reading)
1. Read **WO2022128356A1 (Vetco gooseneck)** patent figures — exact MTC use case
2. Read **Shimoda E-4** report — MTC's parent group on duplex subsea valve bodies
3. Read **MDPI Sobhani 2023** — FEA + Genetic Algorithm capsule optimization framework
4. Read **OSTI 1822264** — Inconel 740H pipe-elbow capsule (full dimensions)

### Week 1 (CAD setup)
5. Download GrabCAD trio: bent pipe + welded pressure vessel + sand casting mold jig
6. Manually reconstruct one or two patent capsule cross-sections in SolidWorks as validation reference
7. Stub out the Hanomi capsule generator with the shrinkage rules from §5

### Week 2 (purchase recommended)
8. Buy **HIP'17 + HIP'22 proceedings** from Materials Research Forum (~$200 each) — the densest public capsule image libraries
9. Buy **EPMA Intro to PM-HIP handbook**

### Pre-mockup gates (before showing MTC)
- [ ] Capsule generator output runs end-to-end on the bent pipe trio
- [ ] Output visually matches the Shimoda E-4 capsule style
- [ ] Output applies correct material shrinkage rules (duplex 12-14%, Inconel 13-15%)
- [ ] Output produces both welded shell + ports + lift lugs + jig

---

## 11. Strategic Note for Marco

**The capsule is the moat.** Whoever automates the capsule generation step wins the HIP NNS market — and nobody else is publishing on this. MTC themselves are not publishing capsule dimensions; Bodycote published two patents in 2022-23 (probably defensive, not aggressive); Sandvik exited in 2020 and the IP went to MTC. The remaining suppliers (ATI, Carpenter, Synertech, Sintavia) operate on toll terms and don't publish capsule design either.

When Hanomi ships an automated capsule generator that produces NORSOK-acceptable output, the next 5 wins after MTC come automatically through Aubert & Duval (France), Carpenter Additive (US), Synertech PM (US), PTC Industries (India), and Sintavia (US) — because the same automation runs on the same material rules across the same regulatory codes.

The acquisition path stays alive in parallel: $200-300M in revenue across the Sweden + UK cluster today, $1.4-1.8B enterprise value at 4-5 year horizon if Hanomi automation runs on top.
