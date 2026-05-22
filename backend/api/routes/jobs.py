import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from db.database import get_db
from api.models.job import Job, JobStatus

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Step advance order
STEP_ORDER = [
    JobStatus.PENDING,
    JobStatus.STEP_1,
    JobStatus.STEP_2,
    JobStatus.STEP_3,
    JobStatus.STEP_4,
    JobStatus.STEP_5,
    JobStatus.STEP_6,
    JobStatus.COMPLETE,
]


class JobCreate(BaseModel):
    alloy_id: str
    press_id: Optional[str] = "terapi_a"
    step_file_name: Optional[str] = "vetco-gooseneck-demo.step"
    pipe_radius_mm: Optional[float] = 12.0
    capsule_wall_offset_mm: Optional[float] = 14.0
    flange_r_mm: Optional[float] = 22.0
    mass_post_machining_kg: Optional[float] = None
    bounding_box: Optional[dict] = None


class JobAdvance(BaseModel):
    step_params: Optional[dict] = None


@router.post("/", status_code=201)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    job = Job(
        id=str(uuid.uuid4()),
        status=JobStatus.STEP_1,
        alloy_id=payload.alloy_id,
        press_id=payload.press_id,
        step_file_name=payload.step_file_name,
        pipe_radius_mm=payload.pipe_radius_mm,
        capsule_wall_offset_mm=payload.capsule_wall_offset_mm,
        flange_r_mm=payload.flange_r_mm,
        mass_post_machining_kg=payload.mass_post_machining_kg,
        bounding_box=payload.bounding_box or {"x": 420, "y": 240, "z": 180},
        step_params={},
        acceptance_criteria=_default_acceptance_criteria(payload.alloy_id),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


@router.get("/")
def list_jobs(db: Session = Depends(get_db)):
    return db.query(Job).order_by(Job.created_at.desc()).limit(50).all()


@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/{job_id}/advance")
def advance_job(job_id: str, payload: JobAdvance, db: Session = Depends(get_db)):
    """Advance the job to the next step in the pipeline."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status == JobStatus.COMPLETE:
        raise HTTPException(status_code=400, detail="Job already complete")
    if job.status == JobStatus.FAILED:
        raise HTTPException(status_code=400, detail="Job failed — cannot advance")

    current_idx = STEP_ORDER.index(job.status)
    next_status = STEP_ORDER[current_idx + 1]
    job.status = next_status

    if payload.step_params:
        existing = job.step_params or {}
        existing.update(payload.step_params)
        job.step_params = existing

    db.commit()
    db.refresh(job)
    return job


@router.patch("/{job_id}/params")
def update_params(job_id: str, params: dict, db: Session = Depends(get_db)):
    """Live-update editable params (engineer corrections)."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    existing = job.step_params or {}
    existing.update(params)
    job.step_params = existing
    db.commit()
    db.refresh(job)
    return job


def _default_acceptance_criteria(alloy_id: str) -> list:
    base = [
        {"label": "CMM tolerance — sealing faces", "value": "≤0.05 mm", "standard": "ISO 2768 f"},
        {"label": "CMM tolerance — machining-stock surfaces", "value": "≤0.20 mm", "standard": "ISO 2768 m"},
        {"label": "Charpy V-notch at −46 °C", "value": "≥45 J avg / ≥35 J single", "standard": "NORSOK M-630"},
        {"label": "Helium leak rate", "value": "≤1×10⁻⁶ mbar·L/s", "standard": "pre-HIP capsule"},
        {"label": "Density — Archimedes", "value": "≥99.8% theoretical", "standard": "ASTM B311"},
    ]
    if alloy_id in ("duplex_2507", "saf_2906"):
        base.insert(3, {
            "label": "Ferrite/austenite balance",
            "value": "35–55% ferrite",
            "standard": "ASTM E562",
        })
    return base
