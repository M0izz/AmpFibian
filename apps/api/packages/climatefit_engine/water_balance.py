"""
Chronological Daily Water-Balance Simulation Engine.
Implements rigorous mass-conservation rainwater harvesting balance across 365/366 days.

Invariant:
    Starting_Storage + Inflow = Ending_Storage + Served_Demand + Overflow
"""
from typing import List, Tuple, Dict, Any, Optional
from .models import DailyWaterBalanceRecord, WaterBalanceSummary

def simulate_daily_water_balance(
    daily_rainfall_mm: List[float],
    catchment_area_m2: float,
    runoff_coefficient: float,
    storage_capacity_liters: float,
    daily_demand_liters: float,
    first_flush_depth_mm: float = 1.5,
    filter_efficiency: float = 0.92,
    initial_storage_liters: float = 0.0,
    dry_spell_threshold_days: int = 2
) -> Tuple[List[DailyWaterBalanceRecord], WaterBalanceSummary]:
    """
    Simulates chronological daily rainwater harvesting mass balance.

    Units:
    - daily_rainfall_mm: mm/day
    - catchment_area_m2: m²
    - runoff_coefficient: dimensionless (0.0 to 1.0)
    - storage_capacity_liters: Liters (1 m³ = 1000 L)
    - daily_demand_liters: Liters/day
    - first_flush_depth_mm: mm
    - filter_efficiency: dimensionless (0.0 to 1.0)
    - initial_storage_liters: Liters

    Mass invariant on each day t:
        starting_storage + net_inflow == ending_storage + served_demand + overflow
    """
    if catchment_area_m2 <= 0:
        raise ValueError("Catchment area must be strictly positive.")
    if storage_capacity_liters < 0:
        raise ValueError("Storage capacity cannot be negative.")
    if runoff_coefficient < 0.0 or runoff_coefficient > 1.0:
        raise ValueError("Runoff coefficient must be between 0.0 and 1.0.")
    if filter_efficiency < 0.0 or filter_efficiency > 1.0:
        raise ValueError("Filter efficiency must be between 0.0 and 1.0.")

    records: List[DailyWaterBalanceRecord] = []
    current_storage = min(max(0.0, initial_storage_liters), storage_capacity_liters)
    
    consecutive_dry_days = 5  # start assuming dry pre-conditions
    
    total_rainfall_mm = 0.0
    total_raw_runoff = 0.0
    total_captured_inflow = 0.0
    total_served_demand = 0.0
    total_unmet_demand = 0.0
    total_overflow = 0.0
    total_demand = 0.0
    
    empty_tank_days = 0
    full_tank_days = 0

    monsoon_served = 0.0
    monsoon_demand = 0.0
    dry_served = 0.0
    dry_demand = 0.0

    for day_idx, rain_mm in enumerate(daily_rainfall_mm):
        day_number = day_idx + 1
        rain_mm = max(0.0, float(rain_mm))
        total_rainfall_mm += rain_mm
        
        # 1. Raw runoff generated on the roof:
        # 1 mm of rain over 1 m² = 1 Liter
        raw_runoff_liters = rain_mm * catchment_area_m2 * runoff_coefficient
        total_raw_runoff += raw_runoff_liters
        
        # 2. First-flush diversion:
        # Diverts first flush if preceded by a dry spell (>= dry_spell_threshold_days)
        first_flush_diverted = 0.0
        if rain_mm > 0.0:
            if consecutive_dry_days >= dry_spell_threshold_days:
                # First flush volume is first_flush_depth_mm * catchment * runoff_coeff
                max_flush_vol = first_flush_depth_mm * catchment_area_m2 * runoff_coefficient
                first_flush_diverted = min(raw_runoff_liters, max_flush_vol)
            consecutive_dry_days = 0
        else:
            consecutive_dry_days += 1

        runoff_after_flush = max(0.0, raw_runoff_liters - first_flush_diverted)
        
        # 3. Filter and conveyance loss:
        net_inflow_liters = runoff_after_flush * filter_efficiency
        filter_loss_liters = runoff_after_flush * (1.0 - filter_efficiency)
        
        total_captured_inflow += net_inflow_liters
        
        # 4. Storage & Demand serving (Yield-Before-Spill formulation)
        starting_storage = current_storage
        available_water = starting_storage + net_inflow_liters
        
        # Non-potable demand for the day
        d_liters = daily_demand_liters
        total_demand += d_liters

        # Is this in Mumbai monsoon window (June 1 - Oct 15 approx, days 152 to 288)?
        is_monsoon = (152 <= day_number <= 288)
        if is_monsoon:
            monsoon_demand += d_liters
        else:
            dry_demand += d_liters
        
        # Serve demand from available water
        if storage_capacity_liters > 0:
            served_demand = min(available_water, d_liters)
            unmet_demand = max(0.0, d_liters - served_demand)
            water_after_demand = available_water - served_demand
            if water_after_demand > storage_capacity_liters:
                overflow = water_after_demand - storage_capacity_liters
                ending_storage = storage_capacity_liters
                full_tank_days += 1
            else:
                overflow = 0.0
                ending_storage = water_after_demand
                if ending_storage >= storage_capacity_liters * 0.999:
                    full_tank_days += 1
        else:
            # Without storage and RWH connection, raw runoff cannot serve non-potable demand
            served_demand = 0.0
            unmet_demand = d_liters
            overflow = net_inflow_liters
            ending_storage = 0.0
            empty_tank_days += 1

        if is_monsoon:
            monsoon_served += served_demand
        else:
            dry_served += served_demand

        if storage_capacity_liters > 0 and ending_storage <= 1e-4 and unmet_demand > 0.0:
            empty_tank_days += 1
            
        current_storage = ending_storage
        
        # Invariant check:
        lhs = starting_storage + net_inflow_liters
        rhs = ending_storage + served_demand + overflow
        assert abs(lhs - rhs) < 1e-3, f"Mass balance violation on day {day_number}: {lhs} vs {rhs}"
        
        total_served_demand += served_demand
        total_unmet_demand += unmet_demand
        total_overflow += overflow
        
        records.append(DailyWaterBalanceRecord(
            day=day_number,
            rainfall_mm=round(rain_mm, 2),
            raw_runoff_liters=round(raw_runoff_liters, 2),
            first_flush_diverted_liters=round(first_flush_diverted, 2),
            filter_conveyance_loss_liters=round(filter_loss_liters, 2),
            net_inflow_liters=round(net_inflow_liters, 2),
            starting_storage_liters=round(starting_storage, 2),
            demand_liters=round(d_liters, 2),
            served_demand_liters=round(served_demand, 2),
            unmet_demand_liters=round(unmet_demand, 2),
            overflow_liters=round(overflow, 2),
            ending_storage_liters=round(ending_storage, 2)
        ))

    coverage_pct = (total_served_demand / total_demand * 100.0) if total_demand > 0 else 0.0
    monsoon_cov = (monsoon_served / monsoon_demand * 100.0) if monsoon_demand > 0 else 0.0
    dry_cov = (dry_served / dry_demand * 100.0) if dry_demand > 0 else 0.0

    summary = WaterBalanceSummary(
        annual_rainfall_mm=round(total_rainfall_mm, 1),
        total_raw_runoff_liters=round(total_raw_runoff, 0),
        total_captured_inflow_liters=round(total_captured_inflow, 0),
        total_served_demand_liters=round(total_served_demand, 0),
        total_unmet_demand_liters=round(total_unmet_demand, 0),
        total_overflow_liters=round(total_overflow, 0),
        annual_demand_liters=round(total_demand, 0),
        demand_coverage_percent=round(coverage_pct, 1),
        monsoon_coverage_percent=round(monsoon_cov, 1),
        dry_season_coverage_percent=round(dry_cov, 1),
        empty_tank_days_count=empty_tank_days,
        full_tank_days_count=full_tank_days,
        storage_capacity_liters=storage_capacity_liters,
        catchment_area_m2=catchment_area_m2
    )

    return records, summary
