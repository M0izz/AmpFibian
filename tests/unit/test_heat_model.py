"""
Unit tests for the 1D roof assembly heat transfer model.
Validates resistance summation, U-value calculation, sol-air temperature, and directionality.
"""
import pytest
from packages.climatefit_engine.models import MaterialLayer, SurfaceProperties, RoofConstruction
from packages.climatefit_engine.heat_model import (
    compute_assembly_u_value,
    calculate_sol_air_temperature,
    evaluate_roof_heat_performance
)

def test_layer_resistance_and_u_value():
    """
    R_total = R_si + R_layers + R_so
    Given:
      R_si = 0.13
      RCC slab: d = 0.150 m, k = 1.58 W/m·K -> R1 = 0.150 / 1.58 ≈ 0.0949
      Brick-bat: d = 0.050 m, k = 0.81 W/m·K -> R2 = 0.050 / 0.81 ≈ 0.0617
      R_so = 0.05
    R_total ≈ 0.13 + 0.0949 + 0.0617 + 0.05 = 0.3366 m²·K/W
    U = 1 / R_total ≈ 2.97 W/m²·K
    """
    layers = [
        MaterialLayer(name="RCC", thickness_m=0.150, conductivity_w_mk=1.58),
        MaterialLayer(name="Brickbat", thickness_m=0.050, conductivity_w_mk=0.81)
    ]
    u_val = compute_assembly_u_value(layers, r_si=0.13, r_so=0.05)
    assert 2.8 < u_val < 3.1

def test_insulation_reduces_u_value_as_single_assembly():
    """
    Adding 50mm XPS (k=0.034, R=1.47) to the assembly must dramatically lower U-value.
    New R_total ≈ 0.3366 + 1.47 = 1.807 -> U ≈ 0.55 W/m²·K
    """
    baseline_layers = [
        MaterialLayer(name="RCC", thickness_m=0.150, conductivity_w_mk=1.58),
        MaterialLayer(name="Brickbat", thickness_m=0.050, conductivity_w_mk=0.81)
    ]
    xps_layer = MaterialLayer(name="XPS", thickness_m=0.050, conductivity_w_mk=0.034)
    retrofit_layers = baseline_layers + [xps_layer]

    u_base = compute_assembly_u_value(baseline_layers)
    u_retro = compute_assembly_u_value(retrofit_layers)

    assert u_retro < u_base
    assert u_retro < 0.65  # significant thermal insulation

def test_sol_air_directionality():
    """
    Lower solar absorptance (higher reflectance) must strictly lower peak sol-air temperature.
    """
    t_ambient = 38.0
    irradiance = 850.0
    h_o = 19.0

    t_sol_air_dark = calculate_sol_air_temperature(t_ambient, solar_absorptance=0.75, irradiance_w_m2=irradiance, h_o=h_o)
    t_sol_air_cool = calculate_sol_air_temperature(t_ambient, solar_absorptance=0.30, irradiance_w_m2=irradiance, h_o=h_o)

    assert t_sol_air_cool < t_sol_air_dark
    # Delta should be (0.75 - 0.30) * 850 / 19 ≈ 20.1 °C
    delta_t = t_sol_air_dark - t_sol_air_cool
    assert 19.0 < delta_t < 21.0

def test_heat_model_summary_structure():
    baseline_construction = RoofConstruction(
        type="rcc",
        layers=[
            MaterialLayer(name="RCC", thickness_m=0.15, conductivity_w_mk=1.58),
            MaterialLayer(name="Brickbat", thickness_m=0.05, conductivity_w_mk=0.81)
        ],
        surface=SurfaceProperties(
            finish="weathered",
            solar_absorptance=0.75,
            solar_reflectance=0.25,
            thermal_emittance=0.90,
            runoff_coefficient=0.85
        )
    )

    summary = evaluate_roof_heat_performance(
        baseline_construction=baseline_construction,
        retrofit_solar_absorptance=0.30,
        top_floor_area_m2=420.0
    )

    assert summary.peak_absorbed_flux_reduction_w_m2 > 0
    assert summary.top_floor_peak_conductive_heat_reduction_kw > 0
    assert "uncertainty_bounds" in summary.model_dump()
    assert "indoor" not in summary.label_disclaimer.lower() or "not guarantee indoor" in summary.label_disclaimer.lower()
