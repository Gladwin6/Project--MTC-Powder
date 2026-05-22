"""Seed alloy registry and press fleet. Run once after migrations."""
from db.database import SessionLocal
from api.models.alloy import AlloyConfig
from api.models.press import PressConfig


ALLOYS = [
    AlloyConfig(
        id="duplex_2507",
        name="Duplex 2507",
        uns="S32750",
        hip_temp_c=1140, hip_temp_tolerance_c=10,
        hip_pressure_mpa=118, hip_hold_hours=4,
        hip_cooling="rapid gas-quench >200°C/min through 1040–650°C",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ 10% / HF 2% (duplex-safe — no HCl)",
        ferrite_target="35–55% per ASTM E562",
        shrinkage_linear_pct="12–14%",
        shrinkage_note="anisotropic; radial ~13%, axial ~14–16%. MTC private formula plugs in (Phase 2).",
        regulatory_codes=["NORSOK M-650", "NORSOK M-630", "API 6A", "NACE MR0175"],
        post_hip_mass_kg=37.8,
        sort_order=0, is_default=1,
    ),
    AlloyConfig(
        id="saf_2906",
        name="Super-duplex SAF 2906",
        uns="S39274",
        hip_temp_c=1140, hip_temp_tolerance_c=10,
        hip_pressure_mpa=118, hip_hold_hours=4,
        hip_cooling="rapid gas-quench >250°C/min",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ 10% / HF 2%",
        ferrite_target="35–55% per ASTM E562",
        shrinkage_linear_pct="12–14%",
        shrinkage_note="Sandvik-spec; MTC primary for North Sea Vetco jobs.",
        regulatory_codes=["NORSOK M-650", "NORSOK M-630", "API 17D", "NACE MR0175 Cl⁻ severe"],
        post_hip_mass_kg=38.2,
        sort_order=1, is_default=0,
    ),
    AlloyConfig(
        id="inconel_625",
        name="Inconel 625",
        uns="N06625",
        hip_temp_c=1175, hip_temp_tolerance_c=10,
        hip_pressure_mpa=118, hip_hold_hours=4,
        hip_cooling="gas-quench",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ / HF per AMS 2700",
        ferrite_target=None,
        shrinkage_linear_pct="13–15%",
        shrinkage_note="per Cai 2017 / Sobhani 2023.",
        regulatory_codes=["ASME B&PV Sec II", "ASTM B443", "NACE MR0175"],
        post_hip_mass_kg=40.1,
        sort_order=2, is_default=0,
    ),
    AlloyConfig(
        id="incoloy_825",
        name="Incoloy 825",
        uns="N08825",
        hip_temp_c=1150, hip_temp_tolerance_c=10,
        hip_pressure_mpa=103, hip_hold_hours=4,
        hip_cooling="stabilize anneal 930°C / WQ",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ / HF",
        ferrite_target=None,
        shrinkage_linear_pct="12–14%",
        shrinkage_note="chemical / FGD scrubber / marine accounts.",
        regulatory_codes=["ASME B&PV Sec II", "ASTM B564", "NACE MR0175"],
        post_hip_mass_kg=39.4,
        sort_order=3, is_default=0,
    ),
    AlloyConfig(
        id="ss_316l",
        name="316L",
        uns="S31603",
        hip_temp_c=1150, hip_temp_tolerance_c=15,
        hip_pressure_mpa=103, hip_hold_hours=3,
        hip_cooling="gas-cool",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ 15% / HF 3%",
        ferrite_target=None,
        shrinkage_linear_pct="12–14%",
        shrinkage_note="per ASTM A988 baseline.",
        regulatory_codes=["ASTM A988", "ASME B&PV", "ISO 9001"],
        post_hip_mass_kg=37.2,
        sort_order=4, is_default=0,
    ),
    AlloyConfig(
        id="inconel_718",
        name="Inconel 718",
        uns="N07718",
        hip_temp_c=1175, hip_temp_tolerance_c=10,
        hip_pressure_mpa=150, hip_hold_hours=4,
        hip_cooling="2-stage age: 720°C/8h + 620°C/8h",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ / HF per AMS 2700",
        ferrite_target=None,
        shrinkage_linear_pct="13–15%",
        shrinkage_note="aerospace / power gen grade.",
        regulatory_codes=["AMS 5662", "ASTM B637", "NORSOK M-650"],
        post_hip_mass_kg=41.8,
        sort_order=5, is_default=0,
    ),
    AlloyConfig(
        id="ti_6al_4v",
        name="Ti-6Al-4V",
        uns="R56400",
        hip_temp_c=920, hip_temp_tolerance_c=10,
        hip_pressure_mpa=103, hip_hold_hours=2,
        hip_cooling="furnace-cool",
        weld_class="ISO 5817 class B",
        tolerance_class="ISO 13920 class AF",
        pickling="HNO₃ / HF (titanium-safe)",
        ferrite_target=None,
        shrinkage_linear_pct="10–12%",
        shrinkage_note="per Van Nguyen 2020.",
        regulatory_codes=["AMS 4928", "ASTM B265", "NADCAP"],
        post_hip_mass_kg=22.6,
        sort_order=6, is_default=0,
    ),
]


PRESSES = [
    PressConfig(
        id="terapi_a",
        name="TeraPi-A",
        model="Quintus QIH-294",
        bore_diameter_mm=1600, hot_zone_height_mm=3500,
        max_load_kg=8500,
        max_pressure_mpa=200, max_temp_c=1400,
        last_calibration="2026-04-18",
        notes="Primary press for large subsea / NNS jobs.",
        sort_order=0, is_default=1,
    ),
    PressConfig(
        id="terapi_b",
        name="TeraPi-B",
        model="Quintus QIH-122",
        bore_diameter_mm=915, hot_zone_height_mm=2200,
        max_load_kg=2400,
        max_pressure_mpa=200, max_temp_c=1400,
        last_calibration="2026-03-22",
        notes="Small batch / medium parts.",
        sort_order=1, is_default=0,
    ),
    PressConfig(
        id="qih_21",
        name="QIH-21",
        model="Quintus QIH-21",
        bore_diameter_mm=406, hot_zone_height_mm=750,
        max_load_kg=180,
        max_pressure_mpa=200, max_temp_c=1400,
        last_calibration="2026-05-02",
        notes="R&D / small parts / qualification samples.",
        sort_order=2, is_default=0,
    ),
]


def seed():
    db = SessionLocal()
    try:
        if db.query(AlloyConfig).count() == 0:
            db.bulk_save_objects(ALLOYS)
            print(f"Seeded {len(ALLOYS)} alloys.")
        if db.query(PressConfig).count() == 0:
            db.bulk_save_objects(PRESSES)
            print(f"Seeded {len(PRESSES)} presses.")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
