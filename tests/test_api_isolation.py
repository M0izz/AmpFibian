import pytest
from fastapi.testclient import TestClient
from apps.api.app.main import app
from apps.api.app.services.persistence import persistence_service

client = TestClient(app)

def test_user_isolation_create_and_list():
    # User A creates a simulation
    user_a = "cognito_sub_user_aaa"
    user_b = "cognito_sub_user_bbb"

    building_payload = {
        "id": "bldg_iso_1",
        "name": "Isolation Test Building",
        "location": {"city": "Mumbai"},
        "geometry": {
            "gross_roof_area_m2": 600.0,
            "usable_roof_area_m2": 500.0,
            "number_of_floors": 4,
            "top_floor_exposed_ceiling_area_m2": 400.0,
            "top_floor_rooms_count": 12
        },
        "existing_roof_construction": {
            "type": "rcc",
            "layers": [{"name": "slab", "thickness_m": 0.15, "conductivity_w_mk": 1.58}],
            "surface": {"finish": "bare_concrete", "solar_absorptance": 0.75, "solar_reflectance": 0.25, "thermal_emittance": 0.90, "runoff_coefficient": 0.85}
        },
        "water_demand": {
            "occupancy_students": 150,
            "non_potable_demand_liters_per_capita_day": 40.0,
            "total_non_potable_demand_liters_day": 6000.0
        },
        "constraints_and_budget": {
            "budget_cap_inr": 800000.0,
            "max_allowable_roof_deadload_kg_m2": 80.0,
            "ground_yard_available_for_tanks_m2": 45.0
        }
    }

    # Post simulation as User A
    res_a = client.post(
        "/simulations",
        json={"building": building_payload, "rainfall_year": "2020_median"},
        headers={"X-User-Id": user_a}
    )
    assert res_a.status_code == 200
    data_a = res_a.json()
    run_id_a = data_a["run_id"]
    assert data_a["user_id"] == user_a

    # User A lists their simulations
    list_a = client.get("/simulations", headers={"X-User-Id": user_a}).json()
    run_ids_a = [r["run_id"] for r in list_a]
    assert run_id_a in run_ids_a

    # User B lists their simulations — MUST NOT contain User A's run!
    list_b = client.get("/simulations", headers={"X-User-Id": user_b}).json()
    run_ids_b = [r["run_id"] for r in list_b]
    assert run_id_a not in run_ids_b
