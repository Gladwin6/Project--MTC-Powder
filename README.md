# Hanomi × MTC NNS-HIP Pipeline

Automated near-net-shape HIP pipeline for MTC Powder Solutions AB.  
Compresses 14-day manual engineering workflow to under 1 day.

## Structure

```
/frontend      Next.js app — 6-step Hanomi pipeline panel + Three.js CAD viewport
/backend       FastAPI — param service, job state machine, CAD orchestrator
/cad-service   SolidWorks COM driver — parametric model generation (Windows-only)
/docs          Specs, engineering brief, improvement log
```

## Quick start

```bash
# Backend + Postgres
docker-compose up -d

# Frontend
cd frontend && npm install && npm run dev

# CAD service (Windows only, requires SolidWorks)
cd cad-service && pip install -r requirements.txt && python solidworks_driver.py
```

## Docs

- `docs/BUILD_BRIEF_FOR_ENGINEERING.md` — full product spec
- `docs/IMPROVEMENT_LOG.md` — 13 iterations of mockup design decisions

## Contact

Marco Mascolo · marco@hanomi.ai  
Drishti Bhasin (CTO) · drishti@hanomi.ai
