"""
Cost Estimation and Bill of Quantities (BOQ) Generator.
Itemizes upfront capital costs with strict provenance, confidence tags, and budget tracking.
"""
from typing import List, Dict, Any
from .models import PackageCostBOQ, PackageCostBOQItem, BuildingGeometry, BuildingConstraints

# Default itemized rates seeded from Maha PWD SSR 2023-24 and verified vendor quotes
RATES_CATALOG: Dict[str, Dict[str, Any]] = {
    "cool_roof_coating": {
        "name": "High-Albedo Cool Roof Coating (SRI > 104)",
        "unit": "m²",
        "rate_inr": 185.0,
        "source": "Maha PWD SSR 2023-24 Item 14.12 & Asian Paints SmartCare Quote",
        "confidence": "high"
    },
    "xps_insulation": {
        "name": "50mm Extruded Polystyrene (XPS) Over-Deck Insulation",
        "unit": "m²",
        "rate_inr": 650.0,
        "source": "Maha PWD SSR 2023-24 Item 22.45",
        "confidence": "high"
    },
    "rwh_filtration_firstflush": {
        "name": "Commercial RWH Dual First-Flush & Vortex Leaf Filter System",
        "unit": "system",
        "rate_inr": 45000.0,
        "source": "RainWater Harvest Solutions Mumbai Quote #RWH-2024-88",
        "confidence": "high"
    },
    "storage_tank_20kl": {
        "name": "20,000 L Modular HDPE Ground Storage Tank Array",
        "unit": "system",
        "rate_inr": 130000.0,
        "source": "Sintex Commercial Distributor Rate Card (₹6.50/L installed)",
        "confidence": "high"
    },
    "storage_tank_40kl": {
        "name": "40,000 L Modular HDPE Ground Storage Tank Array",
        "unit": "system",
        "rate_inr": 260000.0,
        "source": "Sintex Commercial Distributor Rate Card (₹6.50/L installed)",
        "confidence": "high"
    },
    "storage_tank_60kl": {
        "name": "60,000 L Modular HDPE Ground Storage Tank Array",
        "unit": "system",
        "rate_inr": 390000.0,
        "source": "Sintex Commercial Distributor Rate Card (₹6.50/L installed)",
        "confidence": "high"
    },
    "storage_tank_80kl": {
        "name": "80,000 L Modular HDPE Ground Storage Tank Array",
        "unit": "system",
        "rate_inr": 520000.0,
        "source": "Sintex Commercial Distributor Rate Card (₹6.50/L installed)",
        "confidence": "high"
    },
    "rooftop_solar_pv_20kw": {
        "name": "20 kWp Elevated Rooftop Solar PV System",
        "unit": "system",
        "rate_inr": 920000.0,
        "source": "Tata Power Solar Commercial Quote #TPS-2024-512",
        "confidence": "high"
    },
    "green_roof_modular": {
        "name": "Extensive Modular Sedum Planter Trays (200 m²)",
        "unit": "m²",
        "rate_inr": 2200.0,
        "source": "Urban Landscape Contractor Estimate Mumbai 2024",
        "confidence": "medium"
    }
}

def calculate_package_boq(
    intervention_ids: List[str],
    geometry: BuildingGeometry,
    constraints: BuildingConstraints
) -> PackageCostBOQ:
    """
    Computes itemized upfront cost BOQ for a retrofit package.
    """
    items: List[PackageCostBOQItem] = []
    total_cost = 0.0

    usable_area = geometry.usable_roof_area_m2

    for i_id in intervention_ids:
        if i_id not in RATES_CATALOG:
            continue
        spec = RATES_CATALOG[i_id]
        
        # Quantity determination
        if i_id in ["cool_roof_coating", "xps_insulation"]:
            qty = usable_area
        elif i_id == "green_roof_modular":
            qty = 200.0  # standard 200 m² trial section
        else:
            qty = 1.0  # system lump-sum

        subtotal = round(qty * spec["rate_inr"], 2)
        total_cost += subtotal

        items.append(PackageCostBOQItem(
            intervention_id=i_id,
            name=spec["name"],
            quantity=qty,
            unit=spec["unit"],
            unit_rate_inr=spec["rate_inr"],
            subtotal_inr=subtotal,
            source=spec["source"],
            confidence=spec["confidence"]
        ))

    budget_cap = constraints.budget_cap_inr
    within_budget = (total_cost <= budget_cap)
    variance = round(budget_cap - total_cost, 2)

    return PackageCostBOQ(
        items=items,
        total_cost_inr=round(total_cost, 2),
        budget_cap_inr=budget_cap,
        within_budget=within_budget,
        budget_variance_inr=variance
    )
