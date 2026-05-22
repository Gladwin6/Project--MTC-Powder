from sqlalchemy import Column, String, Float, Integer, Date
from db.database import Base


class PressConfig(Base):
    __tablename__ = "press_configs"

    id = Column(String, primary_key=True)       # e.g. "terapi_a"
    name = Column(String, nullable=False)        # e.g. "TeraPi-A"
    model = Column(String, nullable=False)       # e.g. "Quintus QIH-294"
    bore_diameter_mm = Column(Float, nullable=False)   # 1600
    hot_zone_height_mm = Column(Float, nullable=False) # 3500
    max_load_kg = Column(Float, nullable=False)
    max_pressure_mpa = Column(Float, nullable=False)
    max_temp_c = Column(Float, nullable=False)
    last_calibration = Column(String)            # ISO date string
    notes = Column(String)
    sort_order = Column(Integer, default=0)
    is_default = Column(Integer, default=0)
