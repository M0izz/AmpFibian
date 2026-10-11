# AmpFibian (ClimateFit RoofLab)

> **A constrained roof-retrofit decision engine for balanced heat and water resilience.**
>
> Helps building facilities teams choose a feasible combination of roof and water interventions under real area, budget, site, and uncertainty constraints — then explains why that package was selected.

---

## 🏗️ Core Engineering Principles

1. **Physical Honesty**: Reports modelled absorbed solar flux, sol-air temperature reduction, and daily storage water balance. Never promises unverified indoor room temperature drops or tanker savings without verified data.
2. **Feasibility Before Preference**: Strict hard filters eliminate packages violating budget caps, roof area, incompatible treatments, or structural dead-load constraints.
3. **Pareto Before Weighted Ranking**: Dominated alternatives are filtered first. Preferences only order the non-dominated Pareto trade-offs (Heat-First, Water-First, Balanced).
4. **Evidence Provenance**: Every cost rate, runoff coefficient, and thermal conductivity carries explicit source citations, dates, units, and confidence ratings.
5. **No AI in the Calculation Path**: AI/LLMs may optionally explain deterministic outputs, but cannot invent or modify numeric calculation results.

---

## 📁 Repository Structure

```
AmpFibian/
├── apps/
│   ├── api/                    # FastAPI backend (validation, simulation runner, persistence)
│   │   └── app/
│   │       ├── main.py
│   │       ├── routes/
│   │       ├── schemas/
│   │       └── services/
│   └── web/                    # React + Vite + TypeScript dashboard UI
│       └── src/
│           ├── components/
│           ├── features/
│           └── lib/
├── packages/
│   └── climatefit_engine/       # Deterministic calculation engine
│       ├── water_balance.py     # Daily rainfall-storage chronological balance
│       ├── heat_model.py        # 1D layer resistance, U-value, sol-air delta, heat flux
│       ├── roof_allocation.py   # Exclusive vs compatible roof surface accounting
│       ├── package_generator.py # Feasible candidate generator
│       ├── feasibility.py       # Hard constraints filter (area, budget, load, compatibility)
│       ├── pareto.py            # Non-dominated frontier filter & profile ranking
│       ├── uncertainty.py       # Multi-year historical climate robustness
│       ├── costs.py             # Itemized BOQ cost model with confidence metadata
│       └── models.py            # Pydantic core domain models
├── data/
│   ├── rainfall/                # IMD daily rainfall time series (Dry, Median, Wet years)
│   ├── interventions/           # Intervention catalog with physical & structural constraints
│   ├── costs/                   # Maharashtra PWD SSR 2023-24 & vendor quotes
│   └── example_buildings/       # Mumbai college hostel baseline assessment
├── docs/
│   ├── assumptions-register.md  # Detailed register of all parameters and citations
│   ├── data-sources.md          # Primary source documentation & meteorological notes
│   ├── model-limitations.md     # Boundary conditions & pre/post measurement protocol
│   └── demo-script.md           # 3-minute hackathon demo script
├── tests/
│   └── unit/                    # Unit tests for water mass balance, heat, Pareto, and filters
└── README.md
```

---

## 🚀 Quickstart & Development

### 1. Requirements
* Python 3.10+
* Node.js v18+ & npm

### 2. Run Engine Tests
```powershell
python -m pytest tests/unit -v
```

### 3. Run FastAPI Backend
```powershell
pip install -r apps/api/requirements.txt
cd apps/api
uvicorn app.main:app --reload --port 8000
```

### 4. Run React Web Frontend
```powershell
cd apps/web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ AWS Architecture & Integration
* **API Service**: FastAPI containerized deployment (AWS App Runner / Elastic Beanstalk / ECS).
* **Persistence**: Amazon DynamoDB for immutable simulation run snapshots (`RunId`, `BuildingHash`, `EngineVersion`, `Inputs`, `Results`, `Metadata`). Local fallback provided for offline testing.
* **Static Web Hosting**: AWS S3 + CloudFront distribution.
