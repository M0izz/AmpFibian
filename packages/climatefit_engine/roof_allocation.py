"""
Roof Area Allocation and Catchment Partitioning Engine.
Tracks exclusive surface occupancies, compatible coating overlays, and eligible RWH catchment area.
"""
from typing import Dict, List, Any, Tuple
from .models import BuildingGeometry, BuildingConstraints

class RoofAllocationResult:
    def __init__(
        self,
        gross_roof_area_m2: float,
        access_corridors_m2: float,
        usable_roof_area_m2: float,
        exclusive_occupied_area_m2: float,
        unallocated_usable_area_m2: float,
        cool_roof_coating_area_m2: float,
        eligible_rwh_catchment_m2: float,
        effective_runoff_coefficient: float,
        ground_tank_area_required_m2: float,
        is_area_valid: bool,
        messages: List[str]
    ):
        self.gross_roof_area_m2 = gross_roof_area_m2
        self.access_corridors_m2 = access_corridors_m2
        self.usable_roof_area_m2 = usable_roof_area_m2
        self.exclusive_occupied_area_m2 = exclusive_occupied_area_m2
        self.unallocated_usable_area_m2 = unallocated_usable_area_m2
        self.cool_roof_coating_area_m2 = cool_roof_coating_area_m2
        self.eligible_rwh_catchment_m2 = eligible_rwh_catchment_m2
        self.effective_runoff_coefficient = effective_runoff_coefficient
        self.ground_tank_area_required_m2 = ground_tank_area_required_m2
        self.is_area_valid = is_area_valid
        self.messages = messages

    def to_dict(self) -> Dict[str, Any]:
        return {
            "gross_roof_area_m2": self.gross_roof_area_m2,
            "access_corridors_m2": self.access_corridors_m2,
            "usable_roof_area_m2": self.usable_roof_area_m2,
            "exclusive_occupied_area_m2": self.exclusive_occupied_area_m2,
            "unallocated_usable_area_m2": self.unallocated_usable_area_m2,
            "cool_roof_coating_area_m2": self.cool_roof_coating_area_m2,
            "eligible_rwh_catchment_m2": self.eligible_rwh_catchment_m2,
            "effective_runoff_coefficient": round(self.effective_runoff_coefficient, 3),
            "ground_tank_area_required_m2": self.ground_tank_area_required_m2,
            "is_area_valid": self.is_area_valid,
            "messages": self.messages
        }

def allocate_roof_space(
    geometry: BuildingGeometry,
    constraints: BuildingConstraints,
    selected_intervention_ids: List[str],
    baseline_runoff_coeff: float = 0.85
) -> RoofAllocationResult:
    """
    Computes rigorous surface partition and eligibility.
    """
    gross = geometry.gross_roof_area_m2
    access = geometry.clear_access_corridors_m2
    usable = geometry.usable_roof_area_m2
    
    messages: List[str] = []
    
    exclusive_area = 0.0
    coating_area = 0.0
    ground_tank_area = 0.0
    has_cool_roof = "cool_roof_coating" in selected_intervention_ids
    has_green_roof = "green_roof_modular" in selected_intervention_ids
    has_solar_pv = "rooftop_solar_pv_20kw" in selected_intervention_ids
    has_rwh = any(i.startswith("storage_tank_") or i == "rwh_filtration_firstflush" for i in selected_intervention_ids)

    # Exclusive allocations:
    if has_green_roof:
        # e.g. Green roof takes 200 m2
        green_roof_area = 200.0
        exclusive_area += green_roof_area
        messages.append(f"Green roof occupies {green_roof_area} m² of exclusive terrace surface.")
        
    if has_solar_pv:
        pv_footprint = 120.0
        exclusive_area += pv_footprint
        messages.append(f"Solar PV array occupies {pv_footprint} m² (elevated frame).")

    # Check usability bound:
    if exclusive_area > usable:
        messages.append(f"Area Violation: Exclusive occupancies ({exclusive_area} m²) exceed usable roof area ({usable} m²).")
        is_area_valid = False
    else:
        is_area_valid = True

    unallocated_usable = max(0.0, usable - exclusive_area)

    # Compatible overlay: Cool roof coating can cover entire usable non-green roof area
    if has_cool_roof:
        coating_area = usable - (200.0 if has_green_roof else 0.0)
        messages.append(f"Cool roof coating applied across {coating_area} m².")

    # Storage tank footprints (off-roof ground yard):
    for i_id in selected_intervention_ids:
        if i_id == "storage_tank_20kl":
            ground_tank_area += 10.0
        elif i_id == "storage_tank_40kl":
            ground_tank_area += 18.0
        elif i_id == "storage_tank_60kl":
            ground_tank_area += 26.0
        elif i_id == "storage_tank_80kl":
            ground_tank_area += 35.0

    if ground_tank_area > constraints.ground_yard_available_for_tanks_m2:
        messages.append(
            f"Ground Space Violation: Tank area {ground_tank_area} m² exceeds available ground yard {constraints.ground_yard_available_for_tanks_m2} m²."
        )
        is_area_valid = False

    # Catchment area calculation for RWH:
    if not has_rwh:
        eligible_catchment = 0.0
        eff_runoff = baseline_runoff_coeff
    else:
        # Green roof surfaces are excluded from potable/non-potable RWH collection due to substrate leaching
        eligible_catchment = usable - (200.0 if has_green_roof else 0.0)
        if has_cool_roof:
            # High-SRI elastomeric coating provides smoother runoff with higher coefficient
            eff_runoff = 0.88
        else:
            eff_runoff = baseline_runoff_coeff

    return RoofAllocationResult(
        gross_roof_area_m2=gross,
        access_corridors_m2=access,
        usable_roof_area_m2=usable,
        exclusive_occupied_area_m2=exclusive_area,
        unallocated_usable_area_m2=unallocated_usable,
        cool_roof_coating_area_m2=coating_area,
        eligible_rwh_catchment_m2=eligible_catchment,
        effective_runoff_coefficient=eff_runoff,
        ground_tank_area_required_m2=ground_tank_area,
        is_area_valid=is_area_valid,
        messages=messages
    )
