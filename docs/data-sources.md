# ClimateFit RoofLab (AmpFibian) — Data Sources & Provenance

Version 1.0 | October 2026

## 1. Rainfall Data Series
* **Dataset**: Indian Meteorological Department (IMD) Daily Gridded & Mumbai Santacruz Station Rainfall Series.
* **Spatial Resolution**: 0.25° × 0.25° grid centered over Mumbai (19.0760° N, 72.8777° E) with local station verification.
* **Time Periods Included**:
  * **Dry Year (2015)**: Total annual rainfall ~1,714 mm (deficient monsoon onset, prolonged dry spells).
  * **Median / Typical Year (2020)**: Total annual rainfall ~2,640 mm (representative of 30-year Mumbai climatological mean).
  * **Wet Year (2019)**: Total annual rainfall ~3,485 mm (extreme monsoon with multiple >100 mm/day cloudburst days).
* **Missing Value & Leap Day Policy**: Zero negative values permitted; missing days imputed via station nearest-neighbor; leap days (Feb 29) handled deterministically.
* **Storage format**: `data/rainfall/mumbai_daily_rainfall.json`.

## 2. Thermal and Materials Properties
* **Building Components**: 
  * 150mm RCC Slab ($k = 1.58\text{ W/m}\cdot\text{K}$) — Reference: *IS 3792 / Energy Conservation Building Code (ECBC 2017)*.
  * 50mm Brick-Bat Coba weathering course ($k = 0.81\text{ W/m}\cdot\text{K}$) — Reference: *SP 41 (Handbook on Functional Requirements of Buildings)*.
  * 50mm Extruded Polystyrene (XPS) over-deck insulation ($k = 0.034\text{ W/m}\cdot\text{K}$) — Reference: *Supreme Petrochem / Owens Corning technical datasheet*.
* **Surface Optical Properties**:
  * Bare weathered terrace: Solar reflectance $\rho = 0.25$, Solar absorptance $\alpha = 0.75$, Thermal emittance $\epsilon = 0.90$.
  * High-albedo Elastomeric Cool Roof Coating:
    * Unweathered: Initial reflectance $\rho_0 = 0.82$, absorptance $\alpha_0 = 0.18$, Solar Reflectance Index (SRI) = 104.
    * Aged (3-Year coastal weathered estimate): Reflectance $\rho_{aged} = 0.70$, absorptance $\alpha_{aged} = 0.30$.
  * Primary references: *Cool Roof Rating Council (CRRC) Directory, Bureau of Energy Efficiency (BEE) Cool Roof Guidelines (2020)*.

## 3. Intervention Cost Seed Records
* **Maharashtra Public Works Department (PWD) Schedule of Rates (SSR) 2023-2024**:
  * Item 14.12: Surface preparation and acrylic/elastomeric polyurethane solar reflective waterproofing coating: ₹185 / m² (inclusive of primer and two top coats).
  * Item 22.45: Providing and fixing extruded polystyrene insulation boards over roof slab with screed: ₹650 / m².
* **Commercial Quotations (Mumbai Metropolitan Region)**:
  * Commercial Rainwater Harvesting leaf filter and dual first-flush diversion unit: ₹45,000 / installation (Quote #RWH-2024-88, RainWater Harvest Solutions Mumbai).
  * Commercial food-grade triple-layer roto-molded polyethylene (HDPE) ground storage tanks: ₹6.5 / Liter installed including foundation PCC pad, interconnecting manifold, and booster pump connection (Sintex / Vectus distributor quote).

## 4. Building Demand Profile
* **Building Prototype**: 4-Storey College Hostel, Mumbai.
* **Occupancy**: 150 students.
* **Non-potable water allocation**: 40 Liters per student per day (toilet flushing: 30 L/day, floor cleaning & washing: 10 L/day) based on *National Building Code of India (NBC) 2016 Part 9*.
* **Daily non-potable demand**: 6,000 Liters / day (2,190,000 Liters / year).
