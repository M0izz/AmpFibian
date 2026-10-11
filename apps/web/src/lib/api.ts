import type { BuildingProfile, SimulationSnapshot } from "../types";
import { getAuthHeaders } from "./session";

// In production on Vercel, browser requests use relative path "/api" routed via vercel.json rewrites.
// In runtime functions / SSR, process.env.API_URL is read from Vercel service bindings.
// In local development, falls back to Vite proxy or VITE_API_URL.
const getBaseApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process;
  if (proc?.env?.API_URL) {
    return proc.env.API_URL;
  }
  if (typeof window !== "undefined") {
    return "/api";
  }
  return "http://localhost:8000";
};

const API_BASE_URL = getBaseApiUrl();

export const DEFAULT_MUMBAI_HOSTEL: BuildingProfile = {
  id: "bldg_mumbai_hostel_01",
  name: "Vivekananda College Hostel — Block B",
  building_type: "college_hostel",
  location: {
    city: "Mumbai",
    neighborhood: "Wadala / Chembur",
    coordinates: { lat: 19.0218, lon: 72.8711 }
  },
  geometry: {
    gross_roof_area_m2: 600.0,
    clear_access_corridors_m2: 80.0,
    usable_roof_area_m2: 520.0,
    number_of_floors: 4,
    top_floor_exposed_ceiling_area_m2: 420.0,
    top_floor_rooms_count: 16
  },
  existing_roof_construction: {
    type: "rcc_slab_with_brickbat_coba",
    layers: [
      { name: "Inside plaster", thickness_m: 0.012, conductivity_w_mk: 0.72 },
      { name: "Reinforced Cement Concrete (RCC) Slab", thickness_m: 0.150, conductivity_w_mk: 1.58 },
      { name: "Brick-Bat Coba Waterproofing & Screed", thickness_m: 0.050, conductivity_w_mk: 0.81 }
    ],
    surface: {
      finish: "Weathered cement screed / brick finish",
      solar_absorptance: 0.75,
      solar_reflectance: 0.25,
      thermal_emittance: 0.90,
      runoff_coefficient: 0.85
    }
  },
  water_demand: {
    occupancy_students: 150,
    non_potable_demand_liters_per_capita_day: 40.0,
    total_non_potable_demand_liters_day: 6000.0,
    seasonal_profile: "academic_year_active",
    monsoon_demand_reduction_percent: 0.0
  },
  constraints_and_budget: {
    budget_cap_inr: 800000.0,
    max_allowable_roof_deadload_kg_m2: 80.0,
    structural_audit_certified: false,
    ground_yard_available_for_tanks_m2: 45.0,
    downspout_interconnection_feasible: true
  }
};

export async function runSimulation(
  building: BuildingProfile,
  rainfallYear: string = "2020_median"
): Promise<SimulationSnapshot> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/simulations`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        building,
        rainfall_year: rainfallYear,
        run_all_years: true
      })
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Backend API not reachable or error, using client-side deterministic calculation:", err);
    // Fall back to client calculation
    const { runClientSimulation } = await import("./clientEngine");
    return runClientSimulation(building, rainfallYear);
  }
}

export async function fetchSavedRun(runId: string): Promise<SimulationSnapshot> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/simulations/${runId}`, {
    headers: authHeaders
  });
  if (!res.ok) {
    throw new Error(`Run ${runId} not found`);
  }
  return await res.json();
}

export async function fetchUserRuns(): Promise<SimulationSnapshot[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/simulations`, {
      headers: authHeaders
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch user runs:", err);
    return [];
  }
}

export async function deleteSimulationRun(runId: string): Promise<boolean> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/simulations/${runId}`, {
      method: "DELETE",
      headers: authHeaders
    });
    return res.ok;
  } catch (err) {
    console.warn("Could not delete simulation run:", err);
    return false;
  }
}

export async function fetchExportUrl(runId: string): Promise<string | null> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/simulations/${runId}/export-url`, {
      headers: authHeaders
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  } catch (err) {
    console.warn("Could not fetch export URL:", err);
    return null;
  }
}

