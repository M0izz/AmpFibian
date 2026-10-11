"""
ClimateFit RoofLab (AmpFibian) Deterministic Calculation Package.
"""
from .models import (
    MaterialLayer,
    SurfaceProperties,
    RoofConstruction,
    BuildingGeometry,
    WaterDemandProfile,
    BuildingConstraints,
    BuildingProfile,
    DailyWaterBalanceRecord,
    WaterBalanceSummary,
    HeatModelSummary,
    PackageCostBOQItem,
    PackageCostBOQ,
    RetrofitPackage
)
from .water_balance import simulate_daily_water_balance
from .heat_model import (
    compute_assembly_u_value,
    calculate_sol_air_temperature,
    evaluate_roof_heat_performance
)
from .roof_allocation import allocate_roof_space, RoofAllocationResult
from .costs import calculate_package_boq
from .feasibility import check_package_feasibility
from .pareto import filter_pareto_frontier, assign_profile_recommendations
from .package_generator import evaluate_all_packages
from .uncertainty import run_multi_year_robustness_analysis

__version__ = "1.0.0"
