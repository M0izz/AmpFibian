import os
import json
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..schemas.requests import AssessmentValidationRequest, AssessmentValidationResponse

router = APIRouter()

BASE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data"))

@router.post("/validate", response_model=AssessmentValidationResponse)
def validate_assessment(payload: AssessmentValidationRequest):
    bldg = payload.building
    errors = []
    warnings = []
    missing = []

    # Geometry checks
    geom = bldg.get("geometry", {})
    gross_area = geom.get("gross_roof_area_m2")
    usable_area = geom.get("usable_roof_area_m2")
    access_area = geom.get("clear_access_corridors_m2", 0.0)

    if not gross_area or gross_area <= 0:
        errors.append("Gross roof area must be specified and strictly positive.")
        missing.append("geometry.gross_roof_area_m2")
    if not usable_area or usable_area <= 0:
        errors.append("Usable roof area must be specified and strictly positive.")
        missing.append("geometry.usable_roof_area_m2")
    if gross_area and usable_area and (usable_area + access_area > gross_area + 0.1):
        warnings.append(f"Usable area ({usable_area} m²) plus access corridors ({access_area} m²) exceeds gross roof area ({gross_area} m²).")

    # Demand checks
    demand = bldg.get("water_demand", {})
    daily_demand = demand.get("total_non_potable_demand_liters_day")
    if not daily_demand or daily_demand <= 0:
        errors.append("Daily non-potable water demand must be specified and greater than 0 L/day.")
        missing.append("water_demand.total_non_potable_demand_liters_day")

    # Budget checks
    constraints = bldg.get("constraints_and_budget", {})
    budget_cap = constraints.get("budget_cap_inr")
    if not budget_cap or budget_cap <= 0:
        errors.append("Budget cap in INR must be specified and greater than 0.")
        missing.append("constraints_and_budget.budget_cap_inr")

    # Structural audit warning
    if not constraints.get("structural_audit_certified"):
        warnings.append("Structural audit is uncertified: Heavy green roofs and heavy terrace structures will be hard-filtered.")

    is_valid = len(errors) == 0
    return AssessmentValidationResponse(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings,
        critical_data_missing=missing
    )

@router.get("/example-building")
def get_example_building():
    file_path = os.path.join(BASE_DATA_DIR, "example_buildings", "mumbai_college_hostel.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Example building fixture not found")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/interventions")
def get_interventions():
    file_path = os.path.join(BASE_DATA_DIR, "interventions", "interventions.json")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Interventions catalog not found")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/data-sources")
def get_data_sources():
    rainfall_file = os.path.join(BASE_DATA_DIR, "rainfall", "mumbai_daily_rainfall.json")
    costs_file = os.path.join(BASE_DATA_DIR, "costs", "cost_rates.json")
    
    rainfall_meta = {}
    if os.path.exists(rainfall_file):
        with open(rainfall_file, "r", encoding="utf-8") as f:
            rf = json.load(f)
            rainfall_meta = {
                "location": rf.get("location"),
                "provenance": rf.get("provenance"),
                "available_years": {k: {"label": v["label"], "annual_mm": v["annual_rainfall_mm"], "type": v["type"]} for k, v in rf.get("years", {}).items()}
            }

    costs_meta = {}
    if os.path.exists(costs_file):
        with open(costs_file, "r", encoding="utf-8") as f:
            costs_meta = json.load(f)

    return {
        "engine_version": "1.0.0",
        "rainfall_series": rainfall_meta,
        "cost_schedules": costs_meta,
        "standards": [
            "IS 15797:2008 (Roof Rainwater Harvesting Guidelines)",
            "IS 3792 / ECBC 2017 (Thermal properties of building envelope)",
            "Maharashtra PWD SSR 2023-2024",
            "CRRC (Cool Roof Rating Council) Product Directory"
        ]
    }
