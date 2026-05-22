from sqlalchemy import Column, String, Float, Integer, JSON
from db.database import Base


class AlloyConfig(Base):
    __tablename__ = "alloy_configs"

    id = Column(String, primary_key=True)  # e.g. "duplex_2507"
    name = Column(String, nullable=False)  # e.g. "Duplex 2507"
    uns = Column(String)                   # e.g. "S32750"

    # HIP cycle
    hip_temp_c = Column(Float, nullable=False)
    hip_temp_tolerance_c = Column(Float, nullable=False)
    hip_pressure_mpa = Column(Float, nullable=False)
    hip_hold_hours = Column(Float, nullable=False)
    hip_cooling = Column(String, nullable=False)  # e.g. "rapid gas-quench >200°C/min"

    # Metallurgy
    weld_class = Column(String, nullable=False)   # e.g. "ISO 5817 class B"
    tolerance_class = Column(String, nullable=False)  # e.g. "ISO 13920 class AF"
    pickling = Column(String, nullable=False)
    ferrite_target = Column(String)  # e.g. "35–55% per ASTM E562"

    # Shrinkage
    shrinkage_linear_pct = Column(String, nullable=False)  # e.g. "12–14%"
    shrinkage_note = Column(String)

    # Regulatory
    regulatory_codes = Column(JSON, nullable=False)  # list of strings

    # Mass estimates
    post_hip_mass_kg = Column(Float)

    # Display
    sort_order = Column(Integer, default=0)
    is_default = Column(Integer, default=0)
