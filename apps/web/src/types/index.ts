export interface MaterialLayer {
  name: string;
  thickness_m: number;
  conductivity_w_mk: number;
}

export interface SurfaceProperties {
  finish: string;
  solar_absorptance: number;
  solar_reflectance: number;
  thermal_emittance: number;
  runoff_coefficient: number;
}

export interface RoofConstruction {
  type: string;
  layers: MaterialLayer[];
  surface: SurfaceProperties;
}

export interface BuildingGeometry {
  gross_roof_area_m2: number;
  clear_access_corridors_m2: number;
  usable_roof_area_m2: number;
  number_of_floors: number;
  top_floor_exposed_ceiling_area_m2: number;
  top_floor_rooms_count: number;
}

export interface WaterDemandProfile {
  occupancy_students: number;
  non_potable_demand_liters_per_capita_day: number;
  total_non_potable_demand_liters_day: number;
  seasonal_profile: string;
  monsoon_demand_reduction_percent: number;
}

export interface BuildingConstraints {
  budget_cap_inr: number;
  max_allowable_roof_deadload_kg_m2: number;
  structural_audit_certified: boolean;
  ground_yard_available_for_tanks_m2: number;
  downspout_interconnection_feasible: boolean;
}

export interface BuildingProfile {
  id: string;
  name: string;
  building_type: string;
  location: {
    city: string;
    neighborhood: string;
    coordinates: { lat: number; lon: number };
  };
  geometry: BuildingGeometry;
  existing_roof_construction: RoofConstruction;
  water_demand: WaterDemandProfile;
  constraints_and_budget: BuildingConstraints;
}

export interface DailyWaterRecord {
  day: number;
  rainfall_mm: number;
  raw_runoff_liters: number;
  first_flush_diverted_liters: number;
  filter_conveyance_loss_liters: number;
  net_inflow_liters: number;
  starting_storage_liters: number;
  demand_liters: number;
  served_demand_liters: number;
  unmet_demand_liters: number;
  overflow_liters: number;
  ending_storage_liters: number;
}

export interface WaterSummary {
  annual_rainfall_mm: number;
  total_raw_runoff_liters: number;
  total_captured_inflow_liters: number;
  total_served_demand_liters: number;
  total_unmet_demand_liters: number;
  total_overflow_liters: number;
  annual_demand_liters: number;
  demand_coverage_percent: number;
  monsoon_coverage_percent: number;
  dry_season_coverage_percent: number;
  empty_tank_days_count: number;
  full_tank_days_count: number;
  storage_capacity_liters: number;
  catchment_area_m2: number;
}

export interface HeatSummary {
  baseline_u_value_w_m2k: number;
  retrofit_u_value_w_m2k: number;
  u_value_reduction_percent: number;
  baseline_solar_absorptance: number;
  retrofit_solar_absorptance: number;
  delta_solar_absorptance: number;
  peak_absorbed_flux_baseline_w_m2: number;
  peak_absorbed_flux_retrofit_w_m2: number;
  peak_absorbed_flux_reduction_w_m2: number;
  sol_air_temperature_delta_celsius: number;
  estimated_peak_heat_flux_reduction_w_m2: number;
  top_floor_peak_conductive_heat_reduction_kw: number;
  modelled_reduction_percent: number;
  uncertainty_bounds: {
    low_bound_heat_flux_reduction_w_m2: number;
    central_heat_flux_reduction_w_m2: number;
    high_bound_heat_flux_reduction_w_m2: number;
    low_bound_top_floor_kw: number;
    high_bound_top_floor_kw: number;
    assumptions: Record<string, string>;
  };
  label_disclaimer: string;
}

export interface BOQItem {
  intervention_id: string;
  name: string;
  quantity: number;
  unit: string;
  unit_rate_inr: number;
  subtotal_inr: number;
  source: string;
  confidence: string;
}

export interface BOQ {
  items: BOQItem[];
  total_cost_inr: number;
  budget_cap_inr: number;
  within_budget: boolean;
  budget_variance_inr: number;
}

export interface RetrofitPackage {
  package_id: string;
  name: string;
  description: string;
  profile_type: "balanced" | "heat_first" | "water_first" | "baseline" | "alternative";
  interventions: string[];
  storage_capacity_liters: number;
  allocated_roof_area_m2: number;
  boq: BOQ;
  water_summary: WaterSummary;
  heat_summary: HeatSummary;
  is_feasible: boolean;
  feasibility_reasons: string[];
  is_pareto_optimal: boolean;
  pareto_rank?: number;
  selection_rationale: string;
  tradeoff_notes: string;
}

export interface SimulationSnapshot {
  run_id: string;
  created_at: string;
  engine_version: string;
  rainfall_year: string;
  rainfall_info: {
    label: string;
    annual_rainfall_mm: number;
    description: string;
  };
  building_input: BuildingProfile;
  packages: RetrofitPackage[];
  profile_recommendations: {
    balanced?: RetrofitPackage;
    heat_first?: RetrofitPackage;
    water_first?: RetrofitPackage;
  };
  multi_year_robustness?: any;
  model_limitations: {
    heat_disclaimer: string;
    water_disclaimer: string;
  };
}
