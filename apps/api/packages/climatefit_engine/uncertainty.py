"""
Multi-Year Climate Robustness and Scenario Uncertainty Runner.
Evaluates retrofit packages across historical rainfall years (Dry, Median, Wet)
and heat boundary sensitivity bands.
"""
from typing import Dict, List, Any
from .models import BuildingProfile, RetrofitPackage
from .package_generator import evaluate_all_packages

def run_multi_year_robustness_analysis(
    building: BuildingProfile,
    rainfall_database: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Evaluates packages across all available historical rainfall years.
    Returns year-by-year performance matrix and robustness metrics.
    """
    years_data = rainfall_database.get("years", {})
    year_results: Dict[str, List[RetrofitPackage]] = {}

    for year_key, year_info in years_data.items():
        daily_rain = year_info["daily_mm"]
        evaluated = evaluate_all_packages(building, daily_rain)
        year_results[year_key] = evaluated

    # Extract robustness summaries for recommended profiles
    # (Balanced, Heat-First, Water-First)
    profiles_summary = {}

    for prof in ["balanced", "heat_first", "water_first"]:
        perf_by_year = {}
        for y_key, pkgs in year_results.items():
            matching = [p for p in pkgs if p.profile_type == prof]
            if matching:
                p = matching[0]
                perf_by_year[y_key] = {
                    "annual_rainfall_mm": p.water_summary.annual_rainfall_mm,
                    "water_coverage_percent": p.water_summary.demand_coverage_percent,
                    "total_served_liters": p.water_summary.total_served_demand_liters,
                    "empty_tank_days": p.water_summary.empty_tank_days_count,
                    "overflow_liters": p.water_summary.total_overflow_liters
                }
        profiles_summary[prof] = perf_by_year

    return {
        "years_evaluated": list(years_data.keys()),
        "year_results": year_results,
        "profiles_robustness": profiles_summary
    }
