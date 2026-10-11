"""
Core domain models and schemas for ClimateFit RoofLab (Roofwise).
All physical units are documented and strictly typed.
"""
from typing import List, Dict, Optional, Any, Literal
from pydantic import BaseModel, Field

class MaterialLayer(BaseModel):
    name: str
    thickness_m: float = Field(..., gt=0, description="Layer thickness in meters (m)")
    conductivity_w_mk: float = Field(..., gt=0, description="Thermal conductivity k in W/m·K")

    @property
    def thermal_resistance(self) -> float:
        """R-value of layer: d / k (m²·K/W)"""
        return self.thickness_m / self.conductivity_w_mk

class SurfaceProperties(BaseModel):
    finish: str
    solar_absorptance: float = Field(..., ge=0.0, le=1.0, description="Dimensionless solar absorptance α")
    solar_reflectance: float = Field(..., ge=0.0, le=1.0, description="Dimensionless solar reflectance ρ (ρ = 1 - α)")
    thermal_emittance: float = Field(default=0.90, ge=0.0, le=1.0, description="Thermal emittance ε")
    runoff_coefficient: float = Field(..., ge=0.0, le=1.0, description="Dimensionless runoff coefficient C")

class RoofConstruction(BaseModel):
    type: str
    layers: List[MaterialLayer]
    surface: SurfaceProperties

class BuildingGeometry(BaseModel):
    gross_roof_area_m2: float = Field(..., gt=0)
    clear_access_corridors_m2: float = Field(default=0.0, ge=0)
    usable_roof_area_m2: float = Field(..., gt=0)
    number_of_floors: int = Field(default=4, ge=1)
    top_floor_exposed_ceiling_area_m2: float = Field(..., gt=0)
    top_floor_rooms_count: int = Field(default=16, ge=1)

class WaterDemandProfile(BaseModel):
    occupancy_students: int = Field(..., ge=1)
    non_potable_demand_liters_per_capita_day: float = Field(default=40.0, gt=0)
    total_non_potable_demand_liters_day: float = Field(..., gt=0)
    seasonal_profile: str = "academic_year_active"
    monsoon_demand_reduction_percent: float = 0.0

class BuildingConstraints(BaseModel):
    budget_cap_inr: float = Field(..., gt=0)
    max_allowable_roof_deadload_kg_m2: float = Field(default=80.0, ge=0)
    structural_audit_certified: bool = False
    ground_yard_available_for_tanks_m2: float = Field(default=40.0, ge=0)
    downspout_interconnection_feasible: bool = True

class BuildingProfile(BaseModel):
    id: str
    name: str
    building_type: str = "college_hostel"
    location: Dict[str, Any]
    geometry: BuildingGeometry
    existing_roof_construction: RoofConstruction
    water_demand: WaterDemandProfile
    constraints_and_budget: BuildingConstraints
    provenance: Optional[Dict[str, Any]] = None

class InterventionItem(BaseModel):
    id: str
    name: str
    category: Literal["heat", "water", "hybrid", "energy_shading"]
    description: str
    unit: str
    cost_per_unit_inr: float
    cost_source: str
    cost_confidence: Literal["high", "medium", "low"]
    exclusive_roof_occupancy: bool = False
    roof_area_occupied_m2: float = 0.0
    requires_ground_area_m2: float = 0.0
    compatible_with_rwh: bool = True
    capacity_liters: float = 0.0
    thermal_effects: Optional[Dict[str, Any]] = None
    water_effects: Optional[Dict[str, Any]] = None
    structural_requirements: Optional[Dict[str, Any]] = None
    site_constraints: Optional[List[str]] = None

class DailyWaterBalanceRecord(BaseModel):
    day: int = Field(..., ge=1, le=366)
    rainfall_mm: float
    raw_runoff_liters: float
    first_flush_diverted_liters: float
    filter_conveyance_loss_liters: float
    net_inflow_liters: float
    starting_storage_liters: float
    demand_liters: float
    served_demand_liters: float
    unmet_demand_liters: float
    overflow_liters: float
    ending_storage_liters: float

class WaterBalanceSummary(BaseModel):
    annual_rainfall_mm: float
    total_raw_runoff_liters: float
    total_captured_inflow_liters: float
    total_served_demand_liters: float
    total_unmet_demand_liters: float
    total_overflow_liters: float
    annual_demand_liters: float
    demand_coverage_percent: float = Field(..., description="Annual water reliability %")
    monsoon_coverage_percent: float
    dry_season_coverage_percent: float
    empty_tank_days_count: int
    full_tank_days_count: int
    storage_capacity_liters: float
    catchment_area_m2: float

class HeatModelSummary(BaseModel):
    baseline_u_value_w_m2k: float
    retrofit_u_value_w_m2k: float
    u_value_reduction_percent: float
    baseline_solar_absorptance: float
    retrofit_solar_absorptance: float
    delta_solar_absorptance: float
    peak_absorbed_flux_baseline_w_m2: float
    peak_absorbed_flux_retrofit_w_m2: float
    peak_absorbed_flux_reduction_w_m2: float
    sol_air_temperature_delta_celsius: float
    estimated_peak_heat_flux_reduction_w_m2: float
    top_floor_peak_conductive_heat_reduction_kw: float
    modelled_reduction_percent: float
    uncertainty_bounds: Dict[str, Any]
    label_disclaimer: str = "Modelled exterior heat-flow change under peak boundary conditions; does not guarantee indoor air temperature reduction."

class PackageCostBOQItem(BaseModel):
    intervention_id: str
    name: str
    quantity: float
    unit: str
    unit_rate_inr: float
    subtotal_inr: float
    source: str
    confidence: str

class PackageCostBOQ(BaseModel):
    items: List[PackageCostBOQItem]
    total_cost_inr: float
    budget_cap_inr: float
    within_budget: bool
    budget_variance_inr: float

class RetrofitPackage(BaseModel):
    package_id: str
    name: str
    description: str
    profile_type: Literal["balanced", "heat_first", "water_first", "baseline", "alternative"]
    interventions: List[str]
    storage_capacity_liters: float
    allocated_roof_area_m2: float
    boq: PackageCostBOQ
    water_summary: WaterBalanceSummary
    heat_summary: HeatModelSummary
    is_feasible: bool
    feasibility_reasons: List[str] = Field(default_factory=list)
    is_pareto_optimal: bool = True
    pareto_rank: int = 1
    selection_rationale: str = ""
    tradeoff_notes: str = ""
