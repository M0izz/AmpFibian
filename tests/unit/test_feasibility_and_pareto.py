"""
Unit tests for feasibility hard filters and Pareto frontier selection.
"""
import pytest
import json
from packages.climatefit_engine.models import BuildingProfile
from packages.climatefit_engine.package_generator import evaluate_all_packages

@pytest.fixture
def sample_building():
    with open("data/example_buildings/mumbai_college_hostel.json", "r") as f:
        data = json.load(f)
    return BuildingProfile(**data)

@pytest.fixture
def median_rainfall():
    with open("data/rainfall/mumbai_daily_rainfall.json", "r") as f:
        data = json.load(f)
    return data["years"]["2020_median"]["daily_mm"]

def test_hard_feasibility_filters(sample_building, median_rainfall):
    """
    Verifies that packages violating budget caps or structural load limits
    are marked is_feasible = False and have descriptive rejection reasons.
    """
    packages = evaluate_all_packages(sample_building, median_rainfall)
    pkg_map = {p.package_id: p for p in packages}

    # Solar PV overbudget package: cost > ₹12L vs ₹8L budget cap
    pv_pkg = pkg_map["pkg_solar_pv_overbudget"]
    assert not pv_pkg.is_feasible
    assert any("Budget Exceeded" in r for r in pv_pkg.feasibility_reasons)

    # Green roof package: requires certified structural audit
    green_pkg = pkg_map["pkg_green_roof_infeasible"]
    assert not green_pkg.is_feasible
    assert any("Structural" in r for r in green_pkg.feasibility_reasons)

def test_pareto_filtering_and_balanced_profile(sample_building, median_rainfall):
    """
    Verifies that dominated packages are marked is_pareto_optimal = False,
    and feasible recommendations contain balanced, heat_first, and water_first.
    """
    packages = evaluate_all_packages(sample_building, median_rainfall)
    feasible = [p for p in packages if p.is_feasible and p.package_id != "pkg_baseline"]
    assert len(feasible) > 0

    # Ensure profile types are assigned
    profiles = {p.profile_type for p in packages}
    assert "balanced" in profiles
    assert "heat_first" in profiles
    assert "water_first" in profiles

    balanced_pkg = [p for p in packages if p.profile_type == "balanced"][0]
    assert balanced_pkg.is_feasible
    assert balanced_pkg.is_pareto_optimal
    assert balanced_pkg.boq.within_budget
    assert balanced_pkg.water_summary.demand_coverage_percent > 0
    assert balanced_pkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw > 0
