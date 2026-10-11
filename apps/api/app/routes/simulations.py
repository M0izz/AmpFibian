import os
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from ..schemas.requests import SimulationRequest
from ..services.persistence import persistence_service
from ..middleware.auth import get_current_user_id
from packages.climatefit_engine import (
    evaluate_all_packages,
    run_multi_year_robustness_analysis,
    __version__ as ENGINE_VERSION
)

router = APIRouter()

RAINFALL_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/rainfall/mumbai_daily_rainfall.json"))

def load_rainfall_database() -> Dict[str, Any]:
    if not os.path.exists(RAINFALL_FILE):
        raise HTTPException(status_code=500, detail="Rainfall dataset not found")
    with open(RAINFALL_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=List[Dict[str, Any]])
def list_user_simulations(user_id: str = Depends(get_current_user_id)):
    """
    Returns all simulation runs strictly isolated to the authenticated user partition.
    """
    return persistence_service.get_runs_by_user(user_id)

@router.post("")
def create_simulation(req: SimulationRequest, user_id: str = Depends(get_current_user_id)):
    rf_db = load_rainfall_database()
    years = rf_db.get("years", {})
    
    selected_year = req.rainfall_year
    if selected_year not in years:
        selected_year = "2020_median"

    daily_rain = years[selected_year]["daily_mm"]

    # 1. Run deterministic multi-package evaluation for active scenario year
    packages = evaluate_all_packages(req.building, daily_rain)

    # 2. Extract profile recommendations
    profile_recommendations = {
        "balanced": next((p for p in packages if p.profile_type == "balanced"), None),
        "heat_first": next((p for p in packages if p.profile_type == "heat_first"), None),
        "water_first": next((p for p in packages if p.profile_type == "water_first"), None)
    }

    # 3. Optional Multi-Year Robustness Analysis
    multi_year_data = None
    if req.run_all_years:
        multi_year_data = run_multi_year_robustness_analysis(req.building, rf_db)

    # 4. Construct immutable snapshot
    snapshot: Dict[str, Any] = {
        "engine_version": ENGINE_VERSION,
        "schema_version": "1.2.0",
        "rainfall_year": selected_year,
        "rainfall_info": {
            "label": years[selected_year]["label"],
            "annual_rainfall_mm": years[selected_year]["annual_rainfall_mm"],
            "description": years[selected_year]["description"]
        },
        "building_input": req.building.model_dump(),
        "packages": [p.model_dump() for p in packages],
        "profile_recommendations": {k: v.model_dump() if v else None for k, v in profile_recommendations.items()},
        "multi_year_robustness": multi_year_data,
        "notes": req.notes,
        "user_id": user_id,
        "model_limitations": {
            "heat_disclaimer": "Modelled peak heat-gain reduction represents steady-state 1D conductive envelope flux; it does not claim certified indoor air temperature or AC bill guarantees.",
            "water_disclaimer": "Daily storage simulation is based on gridded IMD series and chronological mass balance; extreme instantaneous downpours may cause temporary gutter weir bypass."
        }
    }

    # 5. Persist run snapshot under isolated user partition
    run_id = persistence_service.save_run(snapshot, user_id=user_id)
    snapshot["run_id"] = run_id

    return snapshot

@router.get("/{run_id}")
def get_simulation_run(run_id: str, user_id: str = Depends(get_current_user_id)):
    snapshot = persistence_service.get_run(run_id, user_id=user_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail=f"Simulation run '{run_id}' not found")
    return snapshot
