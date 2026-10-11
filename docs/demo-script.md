# ClimateFit RoofLab (AmpFibian) — Demo Script (Sub-3 Minutes)

Target Duration: 2 minutes 45 seconds | Target Audience: Hackathon Judges & Campus Facilities Directors

---

### [0:00 – 0:25] The Problem & The Building Context
* **Visual**: Open AmpFibian dashboard showing the Mumbai 4-Storey College Hostel profile (Wadala/Powai campus, 600 m² roof, 150 students, ₹8,00,000 budget limit).
* **Narration**:
  > *"Every urban campus in Mumbai faces dual climate shocks: punishing top-floor solar heat gain and crippling pre-monsoon water shortages. Facilities teams receive fragmented vendor pitches—cool roof painters claiming 10°C drops, or tank fabricators pitching massive tanks without checking rainfall timing or structural capacity. ClimateFit RoofLab replaces sales hype with a constrained, physically honest decision engine."*

---

### [0:25 – 0:50] Constrained Roof Allocation & Physical Honesty
* **Visual**: Click into **Roof Allocation Workbench**. Show 600 m² gross roof broken down into 80 m² clear HVAC/access corridors and 520 m² net usable surface. Show cool roof coating overlaid over rainwater catchment without double-counting area. Show structural load warning for heavy intensive green roofs.
* **Narration**:
  > *"A roof has shared and competing uses. In RoofLab, cool roof coatings share area with rainwater collection because high-SRI coatings improve runoff coefficients. But heavy green roofs require certified structural dead-loads—and ground-level tanks don't steal roof footprint. Every physical constraint is hard-enforced before any preference ranking."*

---

### [0:50 – 1:25] Deterministic Calculation & Three Explainable Packages
* **Visual**: Click **Run Multi-Objective Optimization**. The results comparison table populates instantly with 3 distinct packages:
  1. **Balanced Package** (Winner: High-albedo cool roof + 40 kL RWH storage + dual first-flush filter).
  2. **Heat-First Package** (Cool roof coating + 50mm XPS over-deck insulation + smaller 20 kL tank).
  3. **Water-First Package** (60 kL ground storage tank + maximum catchment filter + standard reflective paint).
* **Narration**:
  > *"Instead of hiding trade-offs behind a single arbitrary 'eco-score', the engine reports physical metrics: reduction in peak absorbed solar flux and sol-air temperature, alongside chronological daily water reliability. Notice our three profiles: The Balanced package captures 1.48 million liters of non-potable water, eliminates 68% of top-floor conductive heat gain, and stays within the ₹8 Lakh budget."*

---

### [1:25 – 1:55] Sensitivity & Historical Rainfall Switching
* **Visual**: Switch the rainfall scenario dropdown from **Median Year (2020: 2,640 mm)** to **Deficient Dry Year (2015: 1,714 mm)**.
* **Narration**:
  > *"Water security isn't determined by annual totals; it depends on daily rainfall timing and storage buffer. When we stress-test against the 2015 drought year, notice how water reliability shifts from 68% down to 48%, and empty tank days increase. The engine shows whether your retrofit package remains robust when the monsoon falters."*

---

### [1:55 – 2:20] Why-Not Transparency & Assumptions Audit
* **Visual**: Click **Pareto Frontier & Rejection Rationale**. Show dominated packages filtered out and rejected packages (e.g. 80 kL tank + green roof rejected for exceeding ₹8L budget and structural load). Open the **Assumptions Drawer** showing PWD Schedule of Rates citations and IS 15797 standards.
* **Narration**:
  > *"Why didn't we pick the 80 kL tank? Because it exceeded our budget cap. Why not a green roof? Because our structural capacity is uncertified. Every single coefficient, cost rate, and U-value displays its source document, date, and confidence level. No black-box LLM hallucinating numbers in the math path."*

---

### [2:20 – 2:45] Saved Runs, AWS Integration & Measurement Protocol
* **Visual**: Click **Save Assessment Snapshot**. Show generated Run ID (`run_mum_hostel_...`). Show AWS DynamoDB persisted schema payload and exportable Retrofit Assessment Report with the pre/post measurement protocol.
* **Narration**:
  > *"Every run snapshot is stored immutably with engine version and dataset hashes. Facilities teams export an actionable specification and a sensor measurement protocol to verify actual results on-site. ClimateFit RoofLab turns complex climate resilience into transparent, feasible engineering decisions."*
