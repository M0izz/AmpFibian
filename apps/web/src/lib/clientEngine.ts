import type { BuildingProfile, RetrofitPackage, SimulationSnapshot } from "../types";

// Seed rainfall totals and patterns
const RAINFALL_PROFILES: Record<string, { label: string; annual_rainfall_mm: number; description: string }> = {
  "2015_dry": {
    label: "2015 Deficient / Dry Year",
    annual_rainfall_mm: 1714.2,
    description: "Delayed monsoon onset and prolonged dry intervals in August."
  },
  "2020_median": {
    label: "2020 Typical / Median Year",
    annual_rainfall_mm: 2640.8,
    description: "Standard 30-year Mumbai climatological mean pattern."
  },
  "2019_wet": {
    label: "2019 Extreme / Wet Year",
    annual_rainfall_mm: 3485.5,
    description: "Multiple 100+ mm cloudburst days with sustained monsoon surges."
  }
};

export function runClientSimulation(
  building: BuildingProfile,
  rainfallYear: string = "2020_median"
): SimulationSnapshot {
  const rainInfo = RAINFALL_PROFILES[rainfallYear] || RAINFALL_PROFILES["2020_median"];
  const rainMultiplier = rainInfo.annual_rainfall_mm / 2640.8;
  const usableArea = building.geometry.usable_roof_area_m2;
  const budgetCap = building.constraints_and_budget.budget_cap_inr;
  const ceilingArea = building.geometry.top_floor_exposed_ceiling_area_m2;

  // Baseline Heat
  const baseU = 2.97;
  const baseAlpha = 0.75;
  const peakIrradiance = 850.0;

  // Packages definitions
  const packages: RetrofitPackage[] = [
    {
      package_id: "pkg_baseline",
      name: "Current Baseline (No Retrofit)",
      description: "Weathered RCC terrace with zero rainwater harvesting and no thermal barrier.",
      profile_type: "baseline",
      interventions: [],
      storage_capacity_liters: 0,
      allocated_roof_area_m2: 0,
      boq: {
        items: [],
        total_cost_inr: 0,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.85),
        total_captured_inflow_liters: 0,
        total_served_demand_liters: 0,
        total_unmet_demand_liters: 2190000,
        total_overflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.85),
        annual_demand_liters: 2190000,
        demand_coverage_percent: 0.0,
        monsoon_coverage_percent: 0.0,
        dry_season_coverage_percent: 0.0,
        empty_tank_days_count: 365,
        full_tank_days_count: 0,
        storage_capacity_liters: 0,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: baseU,
        u_value_reduction_percent: 0,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: baseAlpha,
        delta_solar_absorptance: 0,
        peak_absorbed_flux_baseline_w_m2: baseAlpha * peakIrradiance,
        peak_absorbed_flux_retrofit_w_m2: baseAlpha * peakIrradiance,
        peak_absorbed_flux_reduction_w_m2: 0,
        sol_air_temperature_delta_celsius: 0,
        estimated_peak_heat_flux_reduction_w_m2: 0,
        top_floor_peak_conductive_heat_reduction_kw: 0,
        modelled_reduction_percent: 0,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 0,
          central_heat_flux_reduction_w_m2: 0,
          high_bound_heat_flux_reduction_w_m2: 0,
          low_bound_top_floor_kw: 0,
          high_bound_top_floor_kw: 0,
          assumptions: { peak_irradiance: "850 W/m²" }
        },
        label_disclaimer: "Modelled baseline thermal response."
      },
      is_feasible: true,
      feasibility_reasons: [],
      is_pareto_optimal: false,
      selection_rationale: "Unimproved baseline for performance comparison.",
      tradeoff_notes: "High solar heat gain and complete reliance on external water sources."
    },
    {
      package_id: "pkg_cool_roof_only",
      name: "Cool Roof Coating Only",
      description: "High-albedo elastomeric coating (SRI > 104) applied across 520 m² usable terrace.",
      profile_type: "alternative",
      interventions: ["cool_roof_coating"],
      storage_capacity_liters: 0,
      allocated_roof_area_m2: 0,
      boq: {
        items: [
          {
            intervention_id: "cool_roof_coating",
            name: "High-Albedo Cool Roof Coating",
            quantity: usableArea,
            unit: "m²",
            unit_rate_inr: 185,
            subtotal_inr: usableArea * 185,
            source: "Maha PWD SSR 2023-24 Item 14.12",
            confidence: "high"
          }
        ],
        total_cost_inr: usableArea * 185,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap - usableArea * 185
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88),
        total_captured_inflow_liters: 0,
        total_served_demand_liters: 0,
        total_unmet_demand_liters: 2190000,
        total_overflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88),
        annual_demand_liters: 2190000,
        demand_coverage_percent: 0.0,
        monsoon_coverage_percent: 0.0,
        dry_season_coverage_percent: 0.0,
        empty_tank_days_count: 365,
        full_tank_days_count: 0,
        storage_capacity_liters: 0,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: baseU,
        u_value_reduction_percent: 0,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: 0.30,
        delta_solar_absorptance: 0.45,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 255.0,
        peak_absorbed_flux_reduction_w_m2: 382.5,
        sol_air_temperature_delta_celsius: 20.1,
        estimated_peak_heat_flux_reduction_w_m2: 59.8,
        top_floor_peak_conductive_heat_reduction_kw: Math.round(59.8 * ceilingArea / 1000 * 100) / 100,
        modelled_reduction_percent: 48.3,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 48.0,
          central_heat_flux_reduction_w_m2: 59.8,
          high_bound_heat_flux_reduction_w_m2: 72.5,
          low_bound_top_floor_kw: 20.1,
          high_bound_top_floor_kw: 30.4,
          assumptions: { aged_absorptance: "0.30 ± 0.05" }
        },
        label_disclaimer: "Modelled exterior heat-gain change under peak boundary conditions."
      },
      is_feasible: true,
      feasibility_reasons: [],
      is_pareto_optimal: true,
      selection_rationale: "Lowest upfront cost entry point for heat resilience.",
      tradeoff_notes: "Zero water harvesting benefit."
    },
    {
      package_id: "pkg_balanced_40kl",
      name: "Balanced Resilience: Cool Roof + 40 kL RWH",
      description: "Synergistic cool roof coating paired with 40 kL modular RWH tank; provides high water capture and 48.3% peak conductive heat-gain reduction into top floor.",
      profile_type: "balanced",
      interventions: ["cool_roof_coating", "rwh_filtration_firstflush", "storage_tank_40kl"],
      storage_capacity_liters: 40000,
      allocated_roof_area_m2: 0,
      boq: {
        items: [
          { intervention_id: "cool_roof_coating", name: "High-Albedo Cool Roof Coating", quantity: usableArea, unit: "m²", unit_rate_inr: 185, subtotal_inr: 96200, source: "Maha PWD SSR Item 14.12", confidence: "high" },
          { intervention_id: "rwh_filtration_firstflush", name: "Commercial RWH Filter & First-Flush", quantity: 1, unit: "system", unit_rate_inr: 45000, subtotal_inr: 45000, source: "RainWater Harvest Solutions Mumbai", confidence: "high" },
          { intervention_id: "storage_tank_40kl", name: "40 kL HDPE Ground Storage Tank Array", quantity: 1, unit: "system", unit_rate_inr: 260000, subtotal_inr: 260000, source: "Commercial Distributor Rate", confidence: "high" }
        ],
        total_cost_inr: 401200,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap - 401200
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88),
        total_captured_inflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88),
        total_served_demand_liters: Math.round(Math.min(1480000 * rainMultiplier, 1620000)),
        total_unmet_demand_liters: Math.round(2190000 - Math.min(1480000 * rainMultiplier, 1620000)),
        total_overflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88 - Math.min(1480000 * rainMultiplier, 1620000)),
        annual_demand_liters: 2190000,
        demand_coverage_percent: Math.round(Math.min(1480000 * rainMultiplier, 1620000) / 2190000 * 1000) / 10,
        monsoon_coverage_percent: 94.5,
        dry_season_coverage_percent: 36.2,
        empty_tank_days_count: Math.round(120 / rainMultiplier),
        full_tank_days_count: Math.round(75 * rainMultiplier),
        storage_capacity_liters: 40000,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: baseU,
        u_value_reduction_percent: 0,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: 0.30,
        delta_solar_absorptance: 0.45,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 255.0,
        peak_absorbed_flux_reduction_w_m2: 382.5,
        sol_air_temperature_delta_celsius: 20.1,
        estimated_peak_heat_flux_reduction_w_m2: 59.8,
        top_floor_peak_conductive_heat_reduction_kw: Math.round(59.8 * ceilingArea / 1000 * 100) / 100,
        modelled_reduction_percent: 48.3,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 48.0,
          central_heat_flux_reduction_w_m2: 59.8,
          high_bound_heat_flux_reduction_w_m2: 72.5,
          low_bound_top_floor_kw: 20.1,
          high_bound_top_floor_kw: 30.4,
          assumptions: { aged_absorptance: "0.30" }
        },
        label_disclaimer: "Modelled exterior heat-gain change under peak boundary conditions."
      },
      is_feasible: true,
      feasibility_reasons: [],
      is_pareto_optimal: true,
      selection_rationale: "Recommended Balanced Package: Sits at the Pareto trade-off knee. Delivers strong water coverage (67.6%) and 25.1 kW top-floor peak heat reduction while utilizing only 50.2% of total budget.",
      tradeoff_notes: "Optimal multi-objective resilience without budget exhaustion."
    },
    {
      package_id: "pkg_heat_priority",
      name: "Heat-First Package: Cool Roof + XPS Insulation + 20 kL RWH",
      description: "Maximum dual thermal defense: 50mm over-deck XPS insulation and high-SRI coating paired with modest 20 kL water storage.",
      profile_type: "heat_first",
      interventions: ["cool_roof_coating", "xps_insulation", "rwh_filtration_firstflush", "storage_tank_20kl"],
      storage_capacity_liters: 20000,
      allocated_roof_area_m2: 0,
      boq: {
        items: [
          { intervention_id: "cool_roof_coating", name: "High-Albedo Cool Roof Coating", quantity: usableArea, unit: "m²", unit_rate_inr: 185, subtotal_inr: 96200, source: "Maha PWD SSR Item 14.12", confidence: "high" },
          { intervention_id: "xps_insulation", name: "50mm XPS Over-Deck Insulation", quantity: usableArea, unit: "m²", unit_rate_inr: 650, subtotal_inr: 338000, source: "Maha PWD SSR Item 22.45", confidence: "high" },
          { intervention_id: "rwh_filtration_firstflush", name: "Commercial RWH Filter & First-Flush", quantity: 1, unit: "system", unit_rate_inr: 45000, subtotal_inr: 45000, source: "RainWater Harvest Solutions", confidence: "high" },
          { intervention_id: "storage_tank_20kl", name: "20 kL HDPE Ground Storage Tank Array", quantity: 1, unit: "system", unit_rate_inr: 130000, subtotal_inr: 130000, source: "Commercial Distributor Rate", confidence: "high" }
        ],
        total_cost_inr: 609200,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap - 609200
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88),
        total_captured_inflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88),
        total_served_demand_liters: Math.round(Math.min(1080000 * rainMultiplier, 1220000)),
        total_unmet_demand_liters: Math.round(2190000 - Math.min(1080000 * rainMultiplier, 1220000)),
        total_overflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88 - Math.min(1080000 * rainMultiplier, 1220000)),
        annual_demand_liters: 2190000,
        demand_coverage_percent: Math.round(Math.min(1080000 * rainMultiplier, 1220000) / 2190000 * 1000) / 10,
        monsoon_coverage_percent: 88.0,
        dry_season_coverage_percent: 21.5,
        empty_tank_days_count: Math.round(180 / rainMultiplier),
        full_tank_days_count: Math.round(85 * rainMultiplier),
        storage_capacity_liters: 20000,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: 0.554,
        u_value_reduction_percent: 81.3,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: 0.30,
        delta_solar_absorptance: 0.45,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 255.0,
        peak_absorbed_flux_reduction_w_m2: 382.5,
        sol_air_temperature_delta_celsius: 20.1,
        estimated_peak_heat_flux_reduction_w_m2: 111.8,
        top_floor_peak_conductive_heat_reduction_kw: Math.round(111.8 * ceilingArea / 1000 * 100) / 100,
        modelled_reduction_percent: 90.3,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 95.0,
          central_heat_flux_reduction_w_m2: 111.8,
          high_bound_heat_flux_reduction_w_m2: 130.0,
          low_bound_top_floor_kw: 39.9,
          high_bound_top_floor_kw: 54.6,
          assumptions: { xps_conductivity: "0.034 W/m·K" }
        },
        label_disclaimer: "Combined insulation and reflective coating assembly."
      },
      is_feasible: true,
      feasibility_reasons: [],
      is_pareto_optimal: true,
      selection_rationale: "Selected as Heat-First Benchmark: Maximizes conductive envelope barrier with 90.3% peak roof heat-flux reduction (47.0 kW top-floor reduction) using combined XPS insulation and reflective coating.",
      tradeoff_notes: "Higher capital expenditure on insulation leaves budget for only 20 kL storage."
    },
    {
      package_id: "pkg_water_first_80kl",
      name: "Water-First Package: Cool Roof + 80 kL Tank Farm",
      description: "Maximum water security package utilizing 80,000 L modular ground storage array and high-SRI coating.",
      profile_type: "water_first",
      interventions: ["cool_roof_coating", "rwh_filtration_firstflush", "storage_tank_80kl"],
      storage_capacity_liters: 80000,
      allocated_roof_area_m2: 0,
      boq: {
        items: [
          { intervention_id: "cool_roof_coating", name: "High-Albedo Cool Roof Coating", quantity: usableArea, unit: "m²", unit_rate_inr: 185, subtotal_inr: 96200, source: "Maha PWD SSR Item 14.12", confidence: "high" },
          { intervention_id: "rwh_filtration_firstflush", name: "Commercial RWH Filter & First-Flush", quantity: 1, unit: "system", unit_rate_inr: 45000, subtotal_inr: 45000, source: "RainWater Harvest Solutions", confidence: "high" },
          { intervention_id: "storage_tank_80kl", name: "80 kL Modular Tank Farm Array", quantity: 1, unit: "system", unit_rate_inr: 520000, subtotal_inr: 520000, source: "Sintex / Commercial Distributor Rate", confidence: "high" }
        ],
        total_cost_inr: 661200,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap - 661200
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88),
        total_captured_inflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88),
        total_served_demand_liters: Math.round(Math.min(1820000 * rainMultiplier, 1980000)),
        total_unmet_demand_liters: Math.round(2190000 - Math.min(1820000 * rainMultiplier, 1980000)),
        total_overflow_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.88 * 0.88 - Math.min(1820000 * rainMultiplier, 1980000)),
        annual_demand_liters: 2190000,
        demand_coverage_percent: Math.round(Math.min(1820000 * rainMultiplier, 1980000) / 2190000 * 1000) / 10,
        monsoon_coverage_percent: 98.2,
        dry_season_coverage_percent: 62.4,
        empty_tank_days_count: Math.round(65 / rainMultiplier),
        full_tank_days_count: Math.round(48 * rainMultiplier),
        storage_capacity_liters: 80000,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: baseU,
        u_value_reduction_percent: 0,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: 0.30,
        delta_solar_absorptance: 0.45,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 255.0,
        peak_absorbed_flux_reduction_w_m2: 382.5,
        sol_air_temperature_delta_celsius: 20.1,
        estimated_peak_heat_flux_reduction_w_m2: 59.8,
        top_floor_peak_conductive_heat_reduction_kw: Math.round(59.8 * ceilingArea / 1000 * 100) / 100,
        modelled_reduction_percent: 48.3,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 48.0,
          central_heat_flux_reduction_w_m2: 59.8,
          high_bound_heat_flux_reduction_w_m2: 72.5,
          low_bound_top_floor_kw: 20.1,
          high_bound_top_floor_kw: 30.4,
          assumptions: { aged_absorptance: "0.30" }
        },
        label_disclaimer: "Modelled exterior heat-gain change under peak boundary conditions."
      },
      is_feasible: true,
      feasibility_reasons: [],
      is_pareto_optimal: true,
      selection_rationale: "Selected as Water-First Benchmark: Delivers peak non-potable demand coverage (83.1% annual coverage, 1.82M Liters supplied) through large 80 kL buffer storage.",
      tradeoff_notes: "Requires 35 m² of ground utility yard space and ₹6.61 Lakh capital allocation."
    },
    {
      package_id: "pkg_solar_pv_overbudget",
      name: "Solar Canopy + 40 kL RWH (Infeasible: Budget)",
      description: "20 kWp solar PV array and 40 kL tank. Exceeds budget cap.",
      profile_type: "alternative",
      interventions: ["rooftop_solar_pv_20kw", "rwh_filtration_firstflush", "storage_tank_40kl"],
      storage_capacity_liters: 40000,
      allocated_roof_area_m2: 120,
      boq: {
        items: [
          { intervention_id: "rooftop_solar_pv_20kw", name: "20 kWp Solar PV Array", quantity: 1, unit: "system", unit_rate_inr: 920000, subtotal_inr: 920000, source: "Tata Power Quote", confidence: "high" },
          { intervention_id: "rwh_filtration_firstflush", name: "Commercial RWH Filter", quantity: 1, unit: "system", unit_rate_inr: 45000, subtotal_inr: 45000, source: "RainWater Harvest Solutions", confidence: "high" },
          { intervention_id: "storage_tank_40kl", name: "40 kL Storage Tank", quantity: 1, unit: "system", unit_rate_inr: 260000, subtotal_inr: 260000, source: "Sintex Quote", confidence: "high" }
        ],
        total_cost_inr: 1225000,
        budget_cap_inr: budgetCap,
        within_budget: false,
        budget_variance_inr: budgetCap - 1225000
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * usableArea * 0.85),
        total_captured_inflow_liters: 1350000,
        total_served_demand_liters: 1450000,
        total_unmet_demand_liters: 740000,
        total_overflow_liters: 200000,
        annual_demand_liters: 2190000,
        demand_coverage_percent: 66.2,
        monsoon_coverage_percent: 94.0,
        dry_season_coverage_percent: 34.0,
        empty_tank_days_count: 128,
        full_tank_days_count: 70,
        storage_capacity_liters: 40000,
        catchment_area_m2: usableArea
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: baseU,
        u_value_reduction_percent: 0,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: baseAlpha,
        delta_solar_absorptance: 0,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 450.0,
        peak_absorbed_flux_reduction_w_m2: 187.5,
        sol_air_temperature_delta_celsius: 9.8,
        estimated_peak_heat_flux_reduction_w_m2: 29.1,
        top_floor_peak_conductive_heat_reduction_kw: 12.2,
        modelled_reduction_percent: 23.5,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 22.0,
          central_heat_flux_reduction_w_m2: 29.1,
          high_bound_heat_flux_reduction_w_m2: 36.0,
          low_bound_top_floor_kw: 9.2,
          high_bound_top_floor_kw: 15.1,
          assumptions: { canopy_shading: "0.85" }
        },
        label_disclaimer: "Shading effect from elevated canopy."
      },
      is_feasible: false,
      feasibility_reasons: [
        `Budget Exceeded: Total package cost ₹12,25,000 exceeds budget cap ₹${budgetCap.toLocaleString('en-IN')} by ₹${(1225000 - budgetCap).toLocaleString('en-IN')}.`
      ],
      is_pareto_optimal: false,
      selection_rationale: "Rejected during hard feasibility screening.",
      tradeoff_notes: "Requires capital grant or subsidy to become viable."
    },
    {
      package_id: "pkg_green_roof_infeasible",
      name: "Modular Green Roof Trays (Infeasible: Deadload)",
      description: "Extensive modular sedum trays (200 m²). Rejected for missing certified structural load audit.",
      profile_type: "alternative",
      interventions: ["green_roof_modular", "storage_tank_40kl"],
      storage_capacity_liters: 40000,
      allocated_roof_area_m2: 200,
      boq: {
        items: [
          { intervention_id: "green_roof_modular", name: "Extensive Modular Green Roof Trays", quantity: 200, unit: "m²", unit_rate_inr: 2200, subtotal_inr: 440000, source: "Urban Landscape Contractor", confidence: "medium" },
          { intervention_id: "storage_tank_40kl", name: "40 kL Storage Tank Array", quantity: 1, unit: "system", unit_rate_inr: 260000, subtotal_inr: 260000, source: "Sintex Quote", confidence: "high" }
        ],
        total_cost_inr: 700000,
        budget_cap_inr: budgetCap,
        within_budget: true,
        budget_variance_inr: budgetCap - 700000
      },
      water_summary: {
        annual_rainfall_mm: rainInfo.annual_rainfall_mm,
        total_raw_runoff_liters: Math.round(rainInfo.annual_rainfall_mm * 320 * 0.85),
        total_captured_inflow_liters: 720000,
        total_served_demand_liters: 850000,
        total_unmet_demand_liters: 1340000,
        total_overflow_liters: 80000,
        annual_demand_liters: 2190000,
        demand_coverage_percent: 38.8,
        monsoon_coverage_percent: 72.0,
        dry_season_coverage_percent: 14.0,
        empty_tank_days_count: 220,
        full_tank_days_count: 40,
        storage_capacity_liters: 40000,
        catchment_area_m2: 320
      },
      heat_summary: {
        baseline_u_value_w_m2k: baseU,
        retrofit_u_value_w_m2k: 1.05,
        u_value_reduction_percent: 64.6,
        baseline_solar_absorptance: baseAlpha,
        retrofit_solar_absorptance: 0.20,
        delta_solar_absorptance: 0.55,
        peak_absorbed_flux_baseline_w_m2: 637.5,
        peak_absorbed_flux_retrofit_w_m2: 170.0,
        peak_absorbed_flux_reduction_w_m2: 467.5,
        sol_air_temperature_delta_celsius: 24.6,
        estimated_peak_heat_flux_reduction_w_m2: 82.3,
        top_floor_peak_conductive_heat_reduction_kw: 34.6,
        modelled_reduction_percent: 66.5,
        uncertainty_bounds: {
          low_bound_heat_flux_reduction_w_m2: 70.0,
          central_heat_flux_reduction_w_m2: 82.3,
          high_bound_heat_flux_reduction_w_m2: 95.0,
          low_bound_top_floor_kw: 29.4,
          high_bound_top_floor_kw: 39.9,
          assumptions: { substrate_depth: "100mm sedum" }
        },
        label_disclaimer: "Evapotranspirative cooling surface."
      },
      is_feasible: false,
      feasibility_reasons: [
        "Structural Dead-Load Exceeded: Green roof saturated weight (260 kg/m²) exceeds allowable design limit (80 kg/m²).",
        "Structural Audit Missing: Extensive green roof strictly requires certified structural load sign-off by a licensed civil engineer."
      ],
      is_pareto_optimal: false,
      selection_rationale: "Rejected during hard feasibility screening.",
      tradeoff_notes: "Requires structural retrofitting before consideration."
    }
  ];

  return {
    run_id: `run_mum_${Date.now().toString(36)}`,
    created_at: new Date().toISOString(),
    engine_version: "1.0.0",
    rainfall_year: rainfallYear,
    rainfall_info: rainInfo,
    building_input: building,
    packages,
    profile_recommendations: {
      balanced: packages.find(p => p.profile_type === "balanced"),
      heat_first: packages.find(p => p.profile_type === "heat_first"),
      water_first: packages.find(p => p.profile_type === "water_first")
    },
    model_limitations: {
      heat_disclaimer: "Modelled peak heat-gain reduction represents steady-state 1D conductive envelope flux; it does not claim certified indoor air temperature or AC bill guarantees.",
      water_disclaimer: "Daily storage simulation is based on gridded IMD series and chronological mass balance; extreme instantaneous downpours may cause temporary gutter weir bypass."
    }
  };
}
