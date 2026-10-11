# ClimateFit RoofLab (AmpFibian) — Model Limitations & Measurement Protocol

Version 1.0 | October 2026

## 1. Principles of Physical Honesty
ClimateFit RoofLab is engineered around physical honesty. The engine explicitly avoids overpromising unverified savings or misrepresenting computational proxies as certified physical realities.

### What the Engine Models vs. What It Does NOT Claim

| Model Output | What It Strictly Represents | What It Does NOT Claim |
|---|---|---|
| **Roof Absorbed Solar Flux Reduction (W/m²)** | Change in solar irradiance absorbed by the exterior roof skin ($\Delta q_{abs} = \Delta \alpha \cdot I$). | Does NOT claim an indoor air temperature drop without dynamic whole-building energy modeling. |
| **Sol-Air Temperature Change ($\Delta T_{sol-air}$)** | Equivalent outside air temperature reduction driving conductive flux through the roof envelope. | Is NOT the temperature experienced by occupants inside the rooms. |
| **Top-Floor Conductive Heat Gain Reduction (kW)** | Reduction in peak conductive heat flow through the building roof slab into the top floor ceiling. | Does NOT guarantee specific AC electricity bill reductions or AC unit tonnage down-sizing. |
| **Daily Rainwater Storage & Reliability (%)** | Chronological mass-balance of captured roof runoff against daily non-potable demand across historical rainfall series. | Does NOT guarantee municipal water bill savings or tanker rate savings unless local tanker supplier contracts are audited. |
| **Dominated / Pareto Optimal Packages** | Feasible retrofit combinations where no other package is simultaneously cheaper and superior in both heat and water metrics. | Is NOT an engineering structural certification or municipal building permit approval. |

## 2. Model Boundary Conditions and Approximations
1. **Steady-State 1D Thermal Conduction**: Heat transfer through the roof slab is calculated using layer thermal resistances under peak solar insolation. Thermal mass capacitance (time lag and decrement factor) is treated as a steady-state boundary approximation for peak hour comparison.
2. **Rainfall Spatial Smoothing**: Gridded IMD rainfall data provides reliable daily depths, but local cloudburst downpours (e.g. 50 mm within 30 minutes) may exceed gutter hydraulic conveyance capacity and cause momentary weir bypass.
3. **No Dynamic Sensor Integration**: All baseline values are derived from calibrated literature and standard codes rather than live IoT sensors.

## 3. Recommended Measurement Protocol (Pre- & Post-Retrofit)
To bridge from model projections to certified post-installation performance, building facilities teams must follow this measurement protocol:
1. **Surface Temperature Logging**: Place calibrated infrared or contact thermocouples (Type T) on both exterior roof surface and underside of top-floor ceiling before and after coating application.
2. **Indoor Thermal Comfort**: Record top-floor indoor air temperature and relative humidity using data loggers (e.g., calibrated Hobo or Testo sensors) shaded from direct radiation.
3. **Rainwater Metering**: Install an inline electromagnetic or pulse water meter on the pump discharge line feeding the flushing cistern header tanks to record actual daily non-potable consumption.
4. **Tank Level Inundation Sensor**: Install a submersible hydrostatic pressure sensor in the storage tank to cross-validate actual daily fill rates and overflow frequency against rainfall events.
