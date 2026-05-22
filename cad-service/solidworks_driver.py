"""
SolidWorks COM API driver — Windows only.

Drives SolidWorks parametrically via win32com to:
  - Open/rebuild a master parametric assembly
  - Update named dimensions (PIPE_RADIUS, CAPSULE_WALL_OFFSET, etc.)
  - Generate: blank .SLDPRT, capsule .SLDASM, jig .SLDASM, drawings .SLDDRW + .STEP

Run standalone: python solidworks_driver.py
Run as service:  uvicorn solidworks_driver:app --port 8001
"""
import os
import sys
import logging
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

# ── Constants (mirror the mockup exactly) ────────────────────────────────────
PIPE_RADIUS = 12.0           # mm
PIPE_TUBE = 2.0              # mm wall
FLANGE_R = 22.0              # mm
FLANGE_T = 6.0               # mm
FLANGE_BOLT_R = 17.0         # mm
FLANGE_BOLTS = 6
CAPSULE_WALL_OFFSET = 14.0   # mm
CAP_DISC_THICK = 5.0         # mm
CAP_DISC_OVERHANG = 6.0      # mm

# Gooseneck centerline control points (mm) — Vetco-pattern, 2 long-radius elbows
CENTERLINE_POINTS = [
    (-80, 0, 0), (-30, 0, 0), (0, 20, 0), (25, 60, 0),
    (25, 105, 0), (30, 135, 10), (60, 150, 30), (120, 150, 40),
]

# ── SolidWorks COM wrapper ────────────────────────────────────────────────────
class SolidWorksDriver:
    """
    Thin wrapper around the SolidWorks COM API (win32com).
    All public methods are safe to call — they no-op with a warning if SW is
    not available (e.g. on Linux CI). Check self.available before use.
    """

    def __init__(self):
        self.sw = None
        self.available = False
        self._connect()

    def _connect(self):
        if sys.platform != "win32":
            logger.warning("SolidWorks COM not available on non-Windows platform.")
            return
        try:
            import win32com.client as win32
            self.sw = win32.Dispatch("SldWorks.Application")
            self.sw.Visible = True
            self.available = True
            logger.info("SolidWorks connected. Version: %s", self.sw.RevisionNumber)
        except Exception as exc:
            logger.warning("Could not connect to SolidWorks: %s", exc)

    def open_part(self, path: str):
        if not self.available:
            return None
        errors, warnings = 0, 0
        doc = self.sw.OpenDoc6(
            path, 1, 1, "", errors, warnings  # 1=part, 1=read-write
        )
        return doc

    def set_dimension(self, doc, dim_name: str, value_mm: float) -> bool:
        """Set a named global variable / equation in the model."""
        if not self.available or not doc:
            return False
        eq_mgr = doc.GetEquationMgr
        for i in range(eq_mgr.GetCount):
            if eq_mgr.Name(i) == dim_name:
                eq_mgr.Equation(i, f'"{dim_name}" = {value_mm}mm')
                doc.EditRebuild3()
                return True
        logger.warning("Dimension %s not found in model.", dim_name)
        return False

    def rebuild(self, doc) -> bool:
        if not self.available or not doc:
            return False
        return bool(doc.EditRebuild3())

    def save_as_step(self, doc, output_path: str) -> bool:
        if not self.available or not doc:
            return False
        export_data = self.sw.GetExportFileData(1)  # 1 = STEP
        errors, warnings = 0, 0
        return bool(doc.Extension.SaveAs(output_path, 0, 1, export_data, errors, warnings))

    def save_as_native(self, doc, output_path: str) -> bool:
        if not self.available or not doc:
            return False
        errors, warnings = 0, 0
        return bool(doc.SaveAs4(output_path, 0, 0, errors, warnings))

    def generate_drawing(self, part_path: str, template_path: str, output_path: str) -> bool:
        """Auto-generate a .SLDDRW from a part using MTC drawing template."""
        if not self.available:
            return False
        errors, warnings = 0, 0
        draw_doc = self.sw.OpenDoc6(template_path, 3, 0, "", errors, warnings)  # 3=drawing
        if not draw_doc:
            return False
        sheet = draw_doc.GetCurrentSheet()
        sheet.SetTemplateName(template_path)
        draw_doc.SaveAs4(output_path, 0, 0, errors, warnings)
        return True


# Singleton driver — one COM connection per process
_driver: Optional[SolidWorksDriver] = None


def get_driver() -> SolidWorksDriver:
    global _driver
    if _driver is None:
        _driver = SolidWorksDriver()
    return _driver


# ── FastAPI service ───────────────────────────────────────────────────────────
app = FastAPI(title="Hanomi CAD Service", version="1.0.0")


class GeomParams(BaseModel):
    pipe_radius_mm: float = PIPE_RADIUS
    capsule_wall_offset_mm: float = CAPSULE_WALL_OFFSET
    flange_r_mm: float = FLANGE_R
    alloy_shrinkage_pct: float = 13.0
    output_dir: str = "./output"


@app.get("/health")
def health():
    driver = get_driver()
    return {
        "status": "ok",
        "solidworks_available": driver.available,
        "platform": sys.platform,
    }


@app.post("/generate/blank")
def generate_blank(params: GeomParams):
    """
    Generate the NNS blank: pipe geometry + per-region offset stock + shrinkage.
    Returns paths to .SLDPRT and .STEP outputs.
    """
    driver = get_driver()
    out = Path(params.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    if not driver.available:
        return {
            "status": "stub",
            "message": "SolidWorks not available — returning mock paths.",
            "blank_sldprt": str(out / "blank.sldprt"),
            "blank_step": str(out / "blank.step"),
        }

    # TODO: open master part, set PIPE_RADIUS + shrinkage, rebuild, export
    raise HTTPException(status_code=501, detail="CAD integration pending SolidWorks setup.")


@app.post("/generate/capsule")
def generate_capsule(params: GeomParams):
    """
    Generate conformal sheet-metal capsule: body tube + branch + dished caps + weld bead.
    """
    driver = get_driver()
    out = Path(params.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    if not driver.available:
        return {
            "status": "stub",
            "message": "SolidWorks not available — returning mock paths.",
            "capsule_sldasm": str(out / "capsule.sldasm"),
            "capsule_step": str(out / "capsule.step"),
        }

    raise HTTPException(status_code=501, detail="CAD integration pending SolidWorks setup.")


@app.post("/generate/jig")
def generate_jig(params: GeomParams):
    """
    Generate PM-HIP cradle jig: V-saddles + I-beam + posts + bracing.
    """
    driver = get_driver()
    out = Path(params.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    if not driver.available:
        return {
            "status": "stub",
            "message": "SolidWorks not available — returning mock paths.",
            "jig_sldasm": str(out / "jig.sldasm"),
            "jig_step": str(out / "jig.step"),
        }

    raise HTTPException(status_code=501, detail="CAD integration pending SolidWorks setup.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
