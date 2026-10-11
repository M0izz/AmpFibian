"""
Pareto Multi-Objective Frontier Filter and Profile Selector.
Eliminates dominated retrofit alternatives without arbitrary score distortion,
then classifies explainable Heat-First, Water-First, and Balanced recommendations.
"""
import math
from typing import List, Tuple, Dict, Any
from .models import RetrofitPackage

def filter_pareto_frontier(packages: List[RetrofitPackage]) -> List[RetrofitPackage]:
    """
    Evaluates Pareto dominance across all feasible packages.
    Objectives:
        - Cost: Minimize
        - Heat Flux Reduction: Maximize
        - Water Demand Coverage: Maximize
    """
    # Baseline or infeasible packages are handled separately
    feasible_candidates = [p for p in packages if p.is_feasible and p.package_id != "pkg_baseline"]

    for i, p_a in enumerate(feasible_candidates):
        cost_a = p_a.boq.total_cost_inr
        heat_a = p_a.heat_summary.top_floor_peak_conductive_heat_reduction_kw
        water_a = p_a.water_summary.demand_coverage_percent

        is_dominated = False
        dominating_pkg_name = ""

        for j, p_b in enumerate(feasible_candidates):
            if i == j:
                continue
            cost_b = p_b.boq.total_cost_inr
            heat_b = p_b.heat_summary.top_floor_peak_conductive_heat_reduction_kw
            water_b = p_b.water_summary.demand_coverage_percent

            # B dominates A if B is no worse than A in all 3, and strictly better in at least one
            no_worse = (cost_b <= cost_a) and (heat_b >= heat_a) and (water_b >= water_a)
            strictly_better = (cost_b < cost_a) or (heat_b > heat_a) or (water_b > water_a)

            if no_worse and strictly_better:
                is_dominated = True
                dominating_pkg_name = p_b.name
                break

        if is_dominated:
            p_a.is_pareto_optimal = False
            p_a.tradeoff_notes = f"Dominated by '{dominating_pkg_name}' (offers equal or superior heat/water resilience at equal or lower capital cost)."
        else:
            p_a.is_pareto_optimal = True

    return packages

def assign_profile_recommendations(packages: List[RetrofitPackage]) -> Dict[str, RetrofitPackage]:
    """
    Selects explainable Heat-First, Water-First, and Balanced packages from Pareto frontier.
    """
    pareto_set = [p for p in packages if p.is_feasible and p.is_pareto_optimal and p.package_id != "pkg_baseline"]

    if not pareto_set:
        # Fallback to any feasible package
        pareto_set = [p for p in packages if p.is_feasible and p.package_id != "pkg_baseline"]

    if not pareto_set:
        return {}

    # 1. Heat-First Winner: Maximize heat reduction, tie-break on lower cost
    heat_first_pkg = max(
        pareto_set,
        key=lambda p: (p.heat_summary.top_floor_peak_conductive_heat_reduction_kw, -p.boq.total_cost_inr)
    )
    heat_first_pkg.profile_type = "heat_first"
    heat_first_pkg.selection_rationale = (
        f"Selected as Heat-First Benchmark: Delivers maximum modeled top-floor conductive heat reduction "
        f"({heat_first_pkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW peak reduction) "
        f"within the allowable budget."
    )

    # 2. Water-First Winner: Maximize water reliability %, tie-break on lower cost
    water_first_pkg = max(
        pareto_set,
        key=lambda p: (p.water_summary.demand_coverage_percent, -p.boq.total_cost_inr)
    )
    water_first_pkg.profile_type = "water_first"
    water_first_pkg.selection_rationale = (
        f"Selected as Water-First Benchmark: Delivers highest annual non-potable demand coverage "
        f"({water_first_pkg.water_summary.demand_coverage_percent}% reliability, "
        f"{water_first_pkg.water_summary.total_served_demand_liters:,.0f} L supplied) within budget."
    )

    # 3. Balanced Winner: Normalized Knee-of-Curve
    # Compute min/max bounds for normalization across pareto set
    costs = [p.boq.total_cost_inr for p in pareto_set]
    heats = [p.heat_summary.top_floor_peak_conductive_heat_reduction_kw for p in pareto_set]
    waters = [p.water_summary.demand_coverage_percent for p in pareto_set]

    c_min, c_max = min(costs), max(costs)
    h_min, h_max = min(heats), max(heats)
    w_min, w_max = min(waters), max(waters)

    best_dist = float("inf")
    balanced_pkg = pareto_set[0]

    for p in pareto_set:
        c_norm = (p.boq.total_cost_inr - c_min) / (c_max - c_min) if c_max > c_min else 0.0
        h_norm = (p.heat_summary.top_floor_peak_conductive_heat_reduction_kw - h_min) / (h_max - h_min) if h_max > h_min else 1.0
        w_norm = (p.water_summary.demand_coverage_percent - w_min) / (w_max - w_min) if w_max > w_min else 1.0

        # Ideal target is (c=0, h=1, w=1)
        dist = math.sqrt(c_norm**2 + (1.0 - h_norm)**2 + (1.0 - w_norm)**2)
        if dist < best_dist:
            best_dist = dist
            balanced_pkg = p

    balanced_pkg.profile_type = "balanced"
    balanced_pkg.selection_rationale = (
        f"Recommended Balanced Package: Optimizes multi-objective trade-offs at the Pareto knee-point. "
        f"Achieves {balanced_pkg.water_summary.demand_coverage_percent}% water reliability "
        f"and {balanced_pkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW peak heat reduction "
        f"at ₹{balanced_pkg.boq.total_cost_inr:,.0f} (utilizing {round(balanced_pkg.boq.total_cost_inr / balanced_pkg.boq.budget_cap_inr * 100)}% of budget)."
    )

    return {
        "balanced": balanced_pkg,
        "heat_first": heat_first_pkg,
        "water_first": water_first_pkg
    }
