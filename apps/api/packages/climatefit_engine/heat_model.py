"""
Deterministic 1D Heat Transfer Model for Roof Assemblies.
Calculates thermal resistance, assembly U-values, peak absorbed solar flux,
sol-air temperature deltas, and top-floor conductive heat-flow reductions.
"""
from typing import List, Dict, Any, Optional
from .models import MaterialLayer, RoofConstruction, HeatModelSummary

# Standard surface film resistances (m²·K/W) per IS 3792 / ASHRAE Fundamentals
R_SI_HORIZONTAL_UPWARD = 0.13  # Interior surface film for upward heat flow
R_SO_DEFAULT = 0.05           # Exterior surface film at design summer wind speed (~3 m/s)

def compute_assembly_u_value(
    layers: List[MaterialLayer],
    r_si: float = R_SI_HORIZONTAL_UPWARD,
    r_so: float = R_SO_DEFAULT
) -> float:
    """
    Computes overall heat transfer coefficient U = 1 / R_total (W/m²·K)
    """
    r_layers = sum(layer.thermal_resistance for layer in layers)
    r_total = r_si + r_layers + r_so
    if r_total <= 0:
        raise ValueError("Total thermal resistance must be strictly positive.")
    return 1.0 / r_total

def calculate_sol_air_temperature(
    t_ambient: float,
    solar_absorptance: float,
    irradiance_w_m2: float,
    h_o: float = 19.0,
    emittance: float = 0.90,
    delta_r: float = 60.0
) -> float:
    """
    Calculates sol-air temperature T_sol_air (°C):
        T_sol_air = T_ambient + (alpha * I - epsilon * delta_R) / h_o
    """
    radiation_correction = (solar_absorptance * irradiance_w_m2 - emittance * delta_r) / h_o
    return t_ambient + radiation_correction

def evaluate_roof_heat_performance(
    baseline_construction: RoofConstruction,
    retrofit_layers: Optional[List[MaterialLayer]] = None,
    retrofit_solar_absorptance: Optional[float] = None,
    top_floor_area_m2: float = 420.0,
    t_ambient_peak_celsius: float = 38.0,
    t_indoor_design_celsius: float = 27.0,
    peak_solar_irradiance_w_m2: float = 850.0,
    h_outside_w_m2k: float = 19.0
) -> HeatModelSummary:
    """
    Evaluates comparative heat transfer performance between baseline and retrofit assemblies.
    """
    # 1. Baseline thermal calculations
    baseline_u = compute_assembly_u_value(baseline_construction.layers)
    baseline_alpha = baseline_construction.surface.solar_absorptance
    baseline_emittance = baseline_construction.surface.thermal_emittance
    
    baseline_sol_air = calculate_sol_air_temperature(
        t_ambient=t_ambient_peak_celsius,
        solar_absorptance=baseline_alpha,
        irradiance_w_m2=peak_solar_irradiance_w_m2,
        h_o=h_outside_w_m2k,
        emittance=baseline_emittance
    )
    
    # Baseline peak conductive flux into building (W/m²)
    # q = U * (T_sol_air - T_in)
    q_base = baseline_u * max(0.0, baseline_sol_air - t_indoor_design_celsius)
    q_abs_base = baseline_alpha * peak_solar_irradiance_w_m2

    # 2. Retrofit calculations
    active_layers = retrofit_layers if retrofit_layers is not None else baseline_construction.layers
    retrofit_u = compute_assembly_u_value(active_layers)
    
    retrofit_alpha = retrofit_solar_absorptance if retrofit_solar_absorptance is not None else baseline_alpha
    retrofit_emittance = 0.90
    
    retrofit_sol_air = calculate_sol_air_temperature(
        t_ambient=t_ambient_peak_celsius,
        solar_absorptance=retrofit_alpha,
        irradiance_w_m2=peak_solar_irradiance_w_m2,
        h_o=h_outside_w_m2k,
        emittance=retrofit_emittance
    )
    
    q_retro = retrofit_u * max(0.0, retrofit_sol_air - t_indoor_design_celsius)
    q_abs_retro = retrofit_alpha * peak_solar_irradiance_w_m2

    # 3. Performance deltas
    delta_alpha = baseline_alpha - retrofit_alpha
    delta_q_abs = q_abs_base - q_abs_retro
    delta_sol_air = baseline_sol_air - retrofit_sol_air
    delta_q_conductive = max(0.0, q_base - q_retro)
    
    # Total kW peak conductive load reduction for top floor exposed ceiling
    top_floor_kw_reduction = (delta_q_conductive * top_floor_area_m2) / 1000.0
    
    u_val_reduction_pct = ((baseline_u - retrofit_u) / baseline_u * 100.0) if baseline_u > 0 else 0.0
    modelled_reduction_pct = (delta_q_conductive / q_base * 100.0) if q_base > 0 else 0.0

    # 4. Uncertainty sensitivity bands (Low / Central / High)
    # Low scenario: I=750, h_o=22, aged coating alpha=0.35
    low_sol_air_base = calculate_sol_air_temperature(36.0, baseline_alpha, 750.0, 22.0)
    low_sol_air_retro = calculate_sol_air_temperature(36.0, min(0.38, retrofit_alpha + 0.05), 750.0, 22.0)
    low_q_base = baseline_u * max(0.0, low_sol_air_base - t_indoor_design_celsius)
    low_q_retro = retrofit_u * max(0.0, low_sol_air_retro - t_indoor_design_celsius)
    low_delta_q = max(0.0, low_q_base - low_q_retro)

    # High scenario: I=950, h_o=16, fresh coating alpha=0.20
    high_sol_air_base = calculate_sol_air_temperature(40.0, baseline_alpha, 950.0, 16.0)
    high_sol_air_retro = calculate_sol_air_temperature(40.0, max(0.18, retrofit_alpha - 0.05), 950.0, 16.0)
    high_q_base = baseline_u * max(0.0, high_sol_air_base - t_indoor_design_celsius)
    high_q_retro = retrofit_u * max(0.0, high_sol_air_retro - t_indoor_design_celsius)
    high_delta_q = max(0.0, high_q_base - high_q_retro)

    uncertainty = {
        "low_bound_heat_flux_reduction_w_m2": round(low_delta_q, 1),
        "central_heat_flux_reduction_w_m2": round(delta_q_conductive, 1),
        "high_bound_heat_flux_reduction_w_m2": round(high_delta_q, 1),
        "low_bound_top_floor_kw": round((low_delta_q * top_floor_area_m2) / 1000.0, 2),
        "high_bound_top_floor_kw": round((high_delta_q * top_floor_area_m2) / 1000.0, 2),
        "assumptions": {
            "peak_irradiance_range_w_m2": "750 - 950",
            "exterior_convection_ho_range": "16.0 - 22.0 W/m²·K",
            "aged_coating_absorptance_range": f"{round(retrofit_alpha, 2)} ± 0.05"
        }
    }

    return HeatModelSummary(
        baseline_u_value_w_m2k=round(baseline_u, 3),
        retrofit_u_value_w_m2k=round(retrofit_u, 3),
        u_value_reduction_percent=round(u_val_reduction_pct, 1),
        baseline_solar_absorptance=round(baseline_alpha, 2),
        retrofit_solar_absorptance=round(retrofit_alpha, 2),
        delta_solar_absorptance=round(delta_alpha, 2),
        peak_absorbed_flux_baseline_w_m2=round(q_abs_base, 1),
        peak_absorbed_flux_retrofit_w_m2=round(q_abs_retro, 1),
        peak_absorbed_flux_reduction_w_m2=round(delta_q_abs, 1),
        sol_air_temperature_delta_celsius=round(delta_sol_air, 1),
        estimated_peak_heat_flux_reduction_w_m2=round(delta_q_conductive, 1),
        top_floor_peak_conductive_heat_reduction_kw=round(top_floor_kw_reduction, 2),
        modelled_reduction_percent=round(modelled_reduction_pct, 1),
        uncertainty_bounds=uncertainty,
        label_disclaimer="Modelled exterior heat-flow change under peak boundary conditions; does not guarantee indoor air temperature reduction."
    )
