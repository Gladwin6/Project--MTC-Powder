from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from api.routes import alloys, presses, jobs
from db.seed import seed

app = FastAPI(
    title="Hanomi MTC NNS-HIP API",
    description="Parametric pipeline backend for MTC Powder Solutions HIP NNS automation.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alloys.router, prefix="/api/v1")
app.include_router(presses.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed()


@app.get("/health")
def health():
    return {"status": "ok", "service": "hanomi-mtc-backend"}
