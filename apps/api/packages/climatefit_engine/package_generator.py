"""
Candidate Package Generator and Multi-Package Evaluator.
Synthesizes discrete retrofit candidate packages across heat, water, and hybrid combinations,
evaluating mass balance, heat transfer, feasibility, and Pareto optimality.
"""
from typing import List, Dict, Any, Optional
from .models import (
    BuildingProfile,
    RetrofitPackage,
    MaterialLayer,
    WaterBalanceSummary,
    HeatModelSummary
)
from .water_balance import simulate_daily_water_balance
from .heat_model import evaluate_roof_heat_performance
from .roof_allocation import allocate_roof_space
from .costs import calculate_package_boq
from .feasibility import check_package_feasibility
from .pareto import filter_pareto_frontier, assign_profile_recommendations

CANDIDATE_CONFIGS = [
    {
        "id": "pkg_baseline",
        "name": "Current Baseline (No Retrofit)",
        "description": "Existing weathered RCC terrace with zero rainwater harvesting and no thermal upgrade.",
        "profile_type": "baseline",
        "interventions": [],
        "storage_capacity_liters": 0.0
    },
    {
        "id": "pkg_cool_roof_only",
        "name": "Cool Roof Coating Only",
        "description": "High-albedo elastomeric reflective coating applied over 520 m² usable terrace.",
        "profile_type": "alternative",
        "interventions": ["cool_roof_coating"],
        "storage_capacity_liters": 0.0
    },
    {
        "id": "pkg_rwh_20kl_bare",
        "name": "20 kL Rainwater Harvesting (Standard Terrace)",
        "description": "RWH filtration system with 20 kL ground tank; no thermal coating.",
        "profile_type": "alternative",
        "interventions": ["rwh_filtration_firstflush", "storage_tank_20kl"],
        "storage_capacity_liters": 20000.0
    },
    {
        "id": "pkg_rwh_40kl_bare",
        "name": "40 kL Rainwater Harvesting (Standard Terrace)",
        "description": "RWH filtration system with 40 kL ground tank; no thermal coating.",
        "profile_type": "alternative",
        "interventions": ["rwh_filtration_firstflush", "storage_tank_40kl"],
        "storage_capacity_liters": 40000.0
    },
    {
        "id": "pkg_rwh_60kl_bare",
        "name": "60 kL Rainwater Harvesting (Standard Terrace)",
        "description": "RWH filtration system with 60 kL ground tank; no thermal coating.",
        "profile_type": "alternative",
        "interventions": ["rwh_filtration_firstflush", "storage_tank_60kl"],
        "storage_capacity_liters": 60000.0
    },
    {
        "id": "pkg_balanced_40kl",
        "name": "Balanced Resilience: Cool Roof + 40 kL RWH",
        "description": "Synergistic cool roof coating paired with 40 kL RWH storage; improved runoff coefficient and 48.3% peak conductive heat-gain reduction into top floor.",
        "profile_type": "balanced",
        "interventions": ["cool_roof_coating", "rwh_filtration_firstflush", "storage_tank_40kl"],
        "storage_capacity_liters": 40000.0
    },
    {
        "id": "pkg_balanced_60kl",
        "name": "Balanced Maximum: Cool Roof + 60 kL RWH",
        "description": "Cool roof coating paired with 60 kL storage for higher monsoon carryover.",
        "profile_type": "alternative",
        "interventions": ["cool_roof_coating", "rwh_filtration_firstflush", "storage_tank_60kl"],
        "storage_capacity_liters": 60000.0
    },
    {
        "id": "pkg_heat_priority",
        "name": "Heat-First Package: Cool Roof + XPS Insulation + 20 kL RWH",
        "description": "Maximum thermal barrier with 50mm XPS over-deck insulation, cool coating, and modest 20 kL water storage.",
        "profile_type": "heat_first",
        "interventions": ["cool_roof_coating", "xps_insulation", "rwh_filtration_firstflush", "storage_tank_20kl"],
        "storage_capacity_liters": 20000.0
    },
    {
        "id": "pkg_water_first_80kl",
        "name": "Water-First Package: Cool Roof + 80 kL Tank Farm",
        "description": "Maximum storage capacity (80,000 L) paired with cool roof coating for peak seasonal water buffering.",
        "profile_type": "water_first",
        "interventions": ["cool_roof_coating", "rwh_filtration_firstflush", "storage_tank_80kl"],
        "storage_capacity_liters": 80000.0
    },
    {
        "id": "pkg_solar_pv_overbudget",
        "name": "Solar Canopy + 40 kL RWH (Infeasible: Budget)",
        "description": "20 kWp solar PV array and 40 kL tank. Evaluated to test budget constraint enforcement.",
        "profile_type": "alternative",
        "interventions": ["rooftop_solar_pv_20kw", "rwh_filtration_firstflush", "storage_tank_40kl"],
        "storage_capacity_liters": 40000.0
    },
    {
        "id": "pkg_green_roof_infeasible",
        "name": "Modular Green Roof Trays (Infeasible: Deadload)",
        "description": "Extensive sedum tray green roof. Evaluated to test structural dead-load audit constraint enforcement.",
        "profile_type": "alternative",
        "interventions": ["green_roof_modular", "storage_tank_40kl"],
        "storage_capacity_liters": 40000.0
    }
]

def evaluate_all_packages(
    building: BuildingProfile,
    daily_rainfall_mm: List[float]
) -> List[RetrofitPackage]:
    """
    Evaluates all candidate packages against building profile and rainfall series.
    """
    packages: List[RetrofitPackage] = []

    # XPS insulation layer definition
    xps_layer = MaterialLayer(
        name="Extruded Polystyrene (XPS) Insulation",
        thickness_m=0.05,
        conductivity_w_mk=0.034
    )

    for cfg in CANDIDATE_CONFIGS:
        pkg_id = cfg["id"]
        interventions = cfg["interventions"]
        storage_cap = cfg["storage_capacity_liters"]

        # 1. Roof Allocation
        allocation = allocate_roof_space(
            geometry=building.geometry,
            constraints=building.constraints_and_budget,
            selected_intervention_ids=interventions,
            baseline_runoff_coeff=building.existing_roof_construction.surface.runoff_coefficient
        )

        # 2. Upfront BOQ Cost
        boq = calculate_package_boq(
            intervention_ids=interventions,
            geometry=building.geometry,
            constraints=building.constraints_and_budget
        )

        # 3. Feasibility Filter
        is_feasible, rejection_reasons = check_package_feasibility(
            selected_intervention_ids=interventions,
            allocation=allocation,
            boq=boq,
            constraints=building.constraints_and_budget
        )

        # 4. Water Balance
        if storage_cap > 0 and allocation.eligible_rwh_catchment_m2 > 0:
            _, water_sum = simulate_daily_water_balance(
                daily_rainfall_mm=daily_rainfall_mm,
                catchment_area_m2=allocation.eligible_rwh_catchment_m2,
                runoff_coefficient=allocation.effective_runoff_coefficient,
                storage_capacity_liters=storage_cap,
                daily_demand_liters=building.water_demand.total_non_potable_demand_liters_day
            )
        else:
            # Zero capture
            _, water_sum = simulate_daily_water_balance(
                daily_rainfall_mm=daily_rainfall_mm,
                catchment_area_m2=building.geometry.usable_roof_area_m2,
                runoff_coefficient=building.existing_roof_construction.surface.runoff_coefficient,
                storage_capacity_liters=0.0,
                daily_demand_liters=building.water_demand.total_non_potable_demand_liters_day
            )

        # 5. Heat Performance
        has_cool = "cool_roof_coating" in interventions
        has_xps = "xps_insulation" in interventions

        active_layers = list(building.existing_roof_construction.layers)
        if has_xps:
            active_layers.append(xps_layer)

        retro_absorptance = 0.30 if has_cool else building.existing_roof_construction.surface.solar_absorptance

        heat_sum = evaluate_roof_heat_performance(
            baseline_construction=building.existing_roof_construction,
            retrofit_layers=active_layers,
            retrofit_solar_absorptance=retro_absorptance,
            top_floor_area_m2=building.geometry.top_floor_exposed_ceiling_area_m2
        )

        packages.append(RetrofitPackage(
            package_id=pkg_id,
            name=cfg["name"],
            description=cfg["description"],
            profile_type=cfg["profile_type"],
            interventions=interventions,
            storage_capacity_liters=storage_cap,
            allocated_roof_area_m2=allocation.exclusive_occupied_area_m2,
            boq=boq,
            water_summary=water_sum,
            heat_summary=heat_sum,
            is_feasible=is_feasible,
            feasibility_reasons=rejection_reasons,
            is_pareto_optimal=True
        ))

    # Apply Pareto filtering
    packages = filter_pareto_frontier(packages)
    # Assign winning profiles
    assign_profile_recommendations(packages)

    return packages
