import os
import sys
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure root workspace is on python path so packages.climatefit_engine is importable
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from packages.climatefit_engine import __version__ as ENGINE_VERSION
from .routes.assessment import router as assessment_router
from .routes.simulations import router as simulations_router

app = FastAPI(
    title="AmpFibian (ClimateFit RoofLab) API",
    description="Constrained roof-retrofit decision engine for balanced heat and water resilience.",
    version=ENGINE_VERSION
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AmpFibian Engine API",
        "engine_version": ENGINE_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Register sub-routers with and without /api prefix
app.include_router(assessment_router, prefix="/assessments", tags=["Assessment"])
app.include_router(simulations_router, prefix="/simulations", tags=["Simulations"])
app.include_router(assessment_router, prefix="/api/assessments", tags=["Assessment"])
app.include_router(simulations_router, prefix="/api/simulations", tags=["Simulations"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
