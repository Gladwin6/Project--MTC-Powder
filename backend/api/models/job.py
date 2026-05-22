import enum
from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from db.database import Base


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    STEP_1 = "step_1"   # Input loaded
    STEP_2 = "step_2"   # Blank drafted
    STEP_3 = "step_3"   # Capsule drafted
    STEP_4 = "step_4"   # Ports + hooks drafted
    STEP_5 = "step_5"   # Welded drawing drafted
    STEP_6 = "step_6"   # Jig drafted
    COMPLETE = "complete"
    FAILED = "failed"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False)

    # Input
    step_file_name = Column(String)
    alloy_id = Column(String, ForeignKey("alloy_configs.id"), nullable=False)
    press_id = Column(String, ForeignKey("press_configs.id"))

    # Geometry params (overridable per-job)
    pipe_radius_mm = Column(Float, default=12.0)
    capsule_wall_offset_mm = Column(Float, default=14.0)
    flange_r_mm = Column(Float, default=22.0)
    mass_post_machining_kg = Column(Float)
    bounding_box = Column(JSON)  # {x, y, z} in mm

    # Derived outputs (file paths on the CAD server)
    blank_step_path = Column(String)
    blank_drawing_path = Column(String)
    capsule_step_path = Column(String)
    capsule_drawing_path = Column(String)
    jig_step_path = Column(String)
    jig_drawing_path = Column(String)

    # Acceptance criteria
    acceptance_criteria = Column(JSON)  # list of {label, value, unit, pass_threshold}

    # Audit
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    error_message = Column(String)

    # Editable params snapshot per step (engineer overrides)
    step_params = Column(JSON, default={})
