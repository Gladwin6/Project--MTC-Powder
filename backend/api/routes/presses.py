from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from api.models.press import PressConfig

router = APIRouter(prefix="/presses", tags=["presses"])


@router.get("/")
def list_presses(db: Session = Depends(get_db)):
    return db.query(PressConfig).order_by(PressConfig.sort_order).all()


@router.get("/{press_id}")
def get_press(press_id: str, db: Session = Depends(get_db)):
    press = db.query(PressConfig).filter(PressConfig.id == press_id).first()
    if not press:
        raise HTTPException(status_code=404, detail="Press not found")
    return press
