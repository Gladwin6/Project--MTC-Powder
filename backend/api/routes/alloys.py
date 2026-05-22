from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from api.models.alloy import AlloyConfig

router = APIRouter(prefix="/alloys", tags=["alloys"])


@router.get("/")
def list_alloys(db: Session = Depends(get_db)):
    return db.query(AlloyConfig).order_by(AlloyConfig.sort_order).all()


@router.get("/{alloy_id}")
def get_alloy(alloy_id: str, db: Session = Depends(get_db)):
    alloy = db.query(AlloyConfig).filter(AlloyConfig.id == alloy_id).first()
    if not alloy:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Alloy not found")
    return alloy
