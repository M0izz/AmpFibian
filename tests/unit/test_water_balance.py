"""
Unit tests for the daily water balance engine.
Validates mass conservation, hand-computed fixtures, and edge cases.
"""
import pytest
from packages.climatefit_engine.water_balance import simulate_daily_water_balance

def test_hand_calculated_small_fixture():
    """
    Hand-calculated 5-day test:
    Catchment: 100 m²
    Runoff coeff: 0.80
    Raw multiplier: 1 mm * 100 m² * 0.80 = 80 Liters/mm
    First flush depth: 1.0 mm (diversion max: 1.0 * 100 * 0.80 = 80 L)
    Filter efficiency: 0.90
    Daily demand: 50 L/day
    Storage capacity: 200 L
    Initial storage: 0 L

    Day 1: Rain = 0 mm. Inflow = 0. Demand 50, Served 0, Unmet 50, Storage = 0.
    Day 2: Rain = 2 mm (after dry spell). Raw = 160 L. First flush diverted = 80 L.
           Remaining = 80 L. Net captured = 80 * 0.90 = 72 L.
           Available = 0 + 72 = 72 L. Demand = 50 L.
           Served = 50 L, Unmet = 0 L.
           Ending Storage = 72 - 50 = 22 L. Overflow = 0.
    Day 3: Rain = 0 mm. Available = 22 L.
           Demand = 50 L. Served = 22 L, Unmet = 28 L.
           Ending Storage = 0 L. Overflow = 0.
    """
    rain_series = [0.0, 2.0, 0.0]
    records, summary = simulate_daily_water_balance(
        daily_rainfall_mm=rain_series,
        catchment_area_m2=100.0,
        runoff_coefficient=0.80,
        storage_capacity_liters=200.0,
        daily_demand_liters=50.0,
        first_flush_depth_mm=1.0,
        filter_efficiency=0.90,
        initial_storage_liters=0.0,
        dry_spell_threshold_days=1
    )

    assert len(records) == 3

    # Day 1 checks
    assert records[0].net_inflow_liters == 0.0
    assert records[0].served_demand_liters == 0.0
    assert records[0].unmet_demand_liters == 50.0
    assert records[0].ending_storage_liters == 0.0

    # Day 2 checks
    assert records[1].raw_runoff_liters == 160.0
    assert records[1].first_flush_diverted_liters == 80.0
    assert records[1].net_inflow_liters == 72.0
    assert records[1].served_demand_liters == 50.0
    assert records[1].unmet_demand_liters == 0.0
    assert records[1].ending_storage_liters == 22.0
    assert records[1].overflow_liters == 0.0

    # Day 3 checks
    assert records[2].starting_storage_liters == 22.0
    assert records[2].served_demand_liters == 22.0
    assert records[2].unmet_demand_liters == 28.0
    assert records[2].ending_storage_liters == 0.0

    # Summary checks
    assert summary.total_captured_inflow_liters == 72.0
    assert summary.total_served_demand_liters == 72.0
    assert summary.annual_demand_liters == 150.0

def test_mass_conservation_invariant_across_365_days():
    """
    Verifies that on EVERY single day:
        Starting_Storage + Net_Inflow == Ending_Storage + Served_Demand + Overflow
    within floating point tolerance.
    """
    import random
    random.seed(123)
    # Generate arbitrary 365-day rainfall series
    rain_series = [random.choice([0.0, 0.0, 15.0, 45.0, 120.0]) for _ in range(365)]

    records, summary = simulate_daily_water_balance(
        daily_rainfall_mm=rain_series,
        catchment_area_m2=520.0,
        runoff_coefficient=0.88,
        storage_capacity_liters=40000.0,
        daily_demand_liters=6000.0
    )

    for rec in records:
        lhs = rec.starting_storage_liters + rec.net_inflow_liters
        rhs = rec.ending_storage_liters + rec.served_demand_liters + rec.overflow_liters
        assert abs(lhs - rhs) < 0.05, f"Day {rec.day} invariant failed: {lhs} != {rhs}"
        assert rec.ending_storage_liters >= 0.0
        assert rec.ending_storage_liters <= 40000.0 + 1e-4

def test_zero_rainfall_scenario():
    """When rain is completely zero, storage empties and demand is unmet."""
    rain_series = [0.0] * 30
    records, summary = simulate_daily_water_balance(
        daily_rainfall_mm=rain_series,
        catchment_area_m2=500.0,
        runoff_coefficient=0.85,
        storage_capacity_liters=10000.0,
        daily_demand_liters=1000.0,
        initial_storage_liters=2000.0
    )

    assert summary.total_captured_inflow_liters == 0.0
    assert summary.total_served_demand_liters == 2000.0
    assert summary.empty_tank_days_count >= 28

def test_full_tank_overflow():
    """Large rainfall event exceeding storage triggers overflow while preserving balance."""
    rain_series = [150.0]  # 150mm over 500m² = 75,000 L raw
    records, summary = simulate_daily_water_balance(
        daily_rainfall_mm=rain_series,
        catchment_area_m2=500.0,
        runoff_coefficient=0.85,
        storage_capacity_liters=20000.0,
        daily_demand_liters=5000.0
    )

    rec = records[0]
    assert rec.ending_storage_liters == 20000.0
    assert rec.served_demand_liters == 5000.0
    assert rec.overflow_liters > 0.0
    assert abs((rec.starting_storage_liters + rec.net_inflow_liters) - (rec.ending_storage_liters + rec.served_demand_liters + rec.overflow_liters)) < 0.01
