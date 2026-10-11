"""
Hard Feasibility Filter Engine.
Enforces budget caps, physical area limits, structural dead-load constraints,
and component compatibility before any Pareto or preference ranking.
"""
from typing import List, Tuple
from .models import BuildingGeometry, BuildingConstraints, PackageCostBOQ
from .roof_allocation import RoofAllocationResult

def check_package_feasibility(
    selected_intervention_ids: List[str],
    allocation: RoofAllocationResult,
    boq: PackageCostBOQ,
    constraints: BuildingConstraints
) -> Tuple[bool, List[str]]:
    """
    Evaluates hard feasibility constraints. Returns (is_feasible, rejection_reasons).
    """
    reasons: List[str] = []

    # 1. Budget Feasibility
    if not boq.within_budget:
        overspend = boq.total_cost_inr - boq.budget_cap_inr
        reasons.append(
            f"Budget Exceeded: Total package cost ₹{boq.total_cost_inr:,.0f} exceeds budget cap ₹{boq.budget_cap_inr:,.0f} by ₹{overspend:,.0f}."
        )

    # 2. Roof Area Feasibility
    if not allocation.is_area_valid:
        for msg in allocation.messages:
            if "Violation" in msg:
                reasons.append(msg)

    # 3. Structural Dead-Load Constraints
    if "green_roof_modular" in selected_intervention_ids:
        green_roof_deadload = 260.0  # kg/m² wet saturated soil + vegetation
        if green_roof_deadload > constraints.max_allowable_roof_deadload_kg_m2:
            reasons.append(
                f"Structural Dead-Load Exceeded: Green roof saturated weight ({green_roof_deadload} kg/m²) exceeds roof design limit ({constraints.max_allowable_roof_deadload_kg_m2} kg/m²)."
            )
        if not constraints.structural_audit_certified:
            reasons.append(
                "Structural Audit Missing: Extensive green roof installation strictly requires certified structural load sign-off by a licensed civil engineer."
            )

    # 4. Storage Tank & Ground Yard Feasibility
    if allocation.ground_tank_area_required_m2 > constraints.ground_yard_available_for_tanks_m2:
        reasons.append(
            f"Ground Yard Deficit: Ground footprint of {allocation.ground_tank_area_required_m2} m² exceeds available utility yard ({constraints.ground_yard_available_for_tanks_m2} m²)."
        )

    # 5. Technical Compatibility
    has_tank = any(i.startswith("storage_tank_") for i in selected_intervention_ids)
    has_filter = "rwh_filtration_firstflush" in selected_intervention_ids

    if has_tank and not has_filter:
        reasons.append(
            "Incompatible Configuration: Rainwater storage tanks require an upstream first-flush diverter and leaf filter system to prevent silt accumulation and bacterial spoilage."
        )

    # Multiple conflicting tank sizes
    tank_count = sum(1 for i in selected_intervention_ids if i.startswith("storage_tank_"))
    if tank_count > 1:
        reasons.append(
            "Configuration Conflict: Select a single discrete storage tank capacity array rather than multiple overlapping tank sizes."
        )

    is_feasible = len(reasons) == 0
    return is_feasible, reasons
