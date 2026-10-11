from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from packages.climatefit_engine.models import BuildingProfile

class SimulationRequest(BaseModel):
    building: BuildingProfile
    rainfall_year: str = Field(default="2020_median", description="Year key: 2015_dry, 2020_median, 2019_wet")
    run_all_years: bool = Field(default=True, description="Whether to also run multi-year robustness analysis")
    notes: Optional[str] = None

class AssessmentValidationRequest(BaseModel):
    building: Dict[str, Any]

class AssessmentValidationResponse(BaseModel):
    is_valid: bool
    errors: List[str]
    warnings: List[str]
    critical_data_missing: List[str]
