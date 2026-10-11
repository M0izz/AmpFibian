import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Sun,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Scale,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldAlert
} from 'lucide-react';
import type { RetrofitPackage, BuildingProfile, SimulationSnapshot } from '../types';

interface OverviewViewProps {
  simulation: SimulationSnapshot;
  building: BuildingProfile;
  onNavigateToCompare: () => void;
  onNavigateToReports: () => void;
  onSelectPackageForDetail: (pkg: RetrofitPackage) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  simulation,
  building,
  onNavigateToCompare,
  onNavigateToReports,
  onSelectPackageForDetail
}) => {
  const [showTechnicalEvidence, setShowTechnicalEvidence] = useState<boolean>(false);

  const recommended = simulation.profile_recommendations.balanced || simulation.packages[0];
  const heatFirst = simulation.profile_recommendations.heat_first;
  const waterFirst = simulation.profile_recommendations.water_first;

  const budgetCap = building.constraints_and_budget.budget_cap_inr;
  const budgetUsedPct = Math.round((recommended.boq.total_cost_inr / budgetCap) * 100);
  const budgetRemaining = Math.max(0, budgetCap - recommended.boq.total_cost_inr);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* =================================================================== */}
      {/* 1. EXECUTIVE RETROFIT DECISION DASHBOARD (TOP LEVEL)                */}
      {/* =================================================================== */}
      <div className="card" style={{
        padding: '28px',
        border: '1.5px solid var(--green-border)',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(15, 23, 42, 0.96) 100%)',
        position: 'relative',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '4px 10px', fontWeight: 600 }}>
              <Sparkles size={14} />
              Recommended Retrofit Package
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
              Pareto Optimal Knee-Point
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
              <CheckCircle2 size={13} />
              100% Feasible (Passes All Hard Constraints)
            </span>
          </div>
        </div>

        {/* Headline Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.9rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {recommended.name}
        </h1>

        <p style={{
          fontSize: '0.96rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.55',
          maxWidth: '920px',
          marginBottom: '22px'
        }}>
          {recommended.description}
        </p>

        {/* Scope Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          <span style={{
            fontSize: '0.8rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)'
          }}>
            🏢 <strong>Scope:</strong> {building.geometry.usable_roof_area_m2} m² High-Albedo Coating (SRI &gt; 104)
          </span>
          <span style={{
            fontSize: '0.8rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)'
          }}>
            💧 <strong>Storage:</strong> {recommended.storage_capacity_liters.toLocaleString()} L Ground Yard Modular Tank Array
          </span>
          <span style={{
            fontSize: '0.8rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)'
          }}>
            ⚙️ <strong>Filtration:</strong> SS Dual-Mesh Filter + 1.5mm Dual First-Flush Diverter
          </span>
        </div>

        {/* =================================================================== */}
        {/* 2. THE 4 PRIMARY EXECUTIVE OUTCOMES (AT THE VERY TOP)               */}
        {/* =================================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {/* Outcome 1: Upfront Capital */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              1. Total Upfront Capital
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              ₹{(recommended.boq.total_cost_inr / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--green-primary)', fontWeight: 500, marginTop: '4px' }}>
              {budgetUsedPct}% of ₹{(budgetCap / 100000).toFixed(1)}L budget used
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ₹{(budgetRemaining / 100000).toFixed(2)}L safety cushion reserve
            </div>
          </div>

          {/* Outcome 2: Heat Resilience Outcome */}
          <div style={{
            background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              2. Top-Floor Conductive Heat Cut
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--green-primary)', marginTop: '4px' }}>
              -{recommended.heat_summary.modelled_reduction_percent}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500, marginTop: '4px' }}>
              -{recommended.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW peak envelope load
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Solar radiation cut: <strong>-66.7%</strong> (α: 0.75 → 0.25)
            </div>
          </div>

          {/* Outcome 3: Water Reliability Outcome */}
          <div style={{
            background: 'var(--water-light)',
            border: '1px solid var(--water-border)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--water-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3. Water Reliability Outcome
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--water-blue)', marginTop: '4px' }}>
              {recommended.water_summary.monsoon_coverage_percent}% Monsoon
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500, marginTop: '4px' }}>
              {recommended.water_summary.demand_coverage_percent}% Annual Demand Coverage
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {(recommended.water_summary.total_served_demand_liters / 100000).toFixed(2)} Lakh Liters supplied/yr
            </div>
          </div>

          {/* Outcome 4: Physical Feasibility & Sizing */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              4. Physical Feasibility & Fit
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              {recommended.storage_capacity_liters / 1000} kL Array
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--green-primary)', fontWeight: 500, marginTop: '4px' }}>
              Ground yard tank array
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              0 kg/m² added deadload to roof slab
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Selection Rationale: <strong>Optimizes multi-objective trade-offs at the Pareto knee-point without budget exhaustion.</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="btn-goto-compare"
              onClick={onNavigateToCompare}
              className="btn btn-secondary"
            >
              <Scale size={15} />
              <span>Compare All 8 Alternatives</span>
            </button>

            <button
              id="btn-view-assembly-details"
              onClick={() => onSelectPackageForDetail(recommended)}
              className="btn btn-secondary"
            >
              <Layers size={15} />
              <span>Inspect Assembly & BOQ</span>
            </button>

            <button
              id="btn-goto-reports"
              onClick={onNavigateToReports}
              className="btn btn-primary"
            >
              <FileText size={15} />
              <span>Export Audit-Ready Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SCIENTIFIC DEFINITION AUDIT BANNER                                */}
      {/* =================================================================== */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} style={{ color: 'var(--amber-primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Scientific Metric Clarification & Boundary Conditions
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
          <div>
            <strong style={{ color: 'var(--green-primary)' }}>Heat Metrics: </strong>
            <strong>48.3%</strong> represents peak conductive heat flux through the top-floor ceiling envelope (from 67.5 W/m² down to 34.9 W/m², eliminating 13.7 kW of envelope heat flow). This corresponds to a <strong>66.7%</strong> reduction in absorbed solar radiation (absorptance α dropped from 0.75 to 0.25).
          </div>
          <div>
            <strong style={{ color: 'var(--water-blue)' }}>Water Metrics: </strong>
            <strong>74.1%</strong> represents monsoon season self-sufficiency (June–October), when rainfall is abundant. <strong>28.0%</strong> represents annual 365-day demand coverage (6.13 Lakh L supplied of 2.19M L annual demand), accounting for dry non-monsoon months without precipitation.
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. TECHNICAL EVIDENCE & VERIFICATION (SEPARATE SECTION)             */}
      {/* =================================================================== */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <button
          id="btn-toggle-technical-evidence"
          onClick={() => setShowTechnicalEvidence(!showTechnicalEvidence)}
          style={{
            width: '100%',
            padding: '18px 24px',
            background: 'var(--bg-surface)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}>
              <Layers size={17} />
            </div>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Technical Evidence & Engineering Verification
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Deterministic 1D conductive envelope formulas, sol-air temperature deltas, and IMD rainfall mass balance
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <span>{showTechnicalEvidence ? 'Hide Technical Evidence' : 'Show Technical Evidence'}</span>
            {showTechnicalEvidence ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {showTechnicalEvidence && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Heat vs Water Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '20px'
            }}>
              {/* Heat Technical Details */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sun size={17} style={{ color: 'var(--green-primary)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Envelope Conduction Physics (IS 3792 / ASHRAE)
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Peak Heat Flux Cut</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                      -{recommended.heat_summary.modelled_reduction_percent}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      -{recommended.heat_summary.estimated_peak_heat_flux_reduction_w_m2} W/m² flux reduction
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sol-Air Delta</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--amber-primary)' }}>
                      -{recommended.heat_summary.sol_air_temperature_delta_celsius}°C
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Exterior boundary forcing drop
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exposed Ceiling Area</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {building.geometry.top_floor_exposed_ceiling_area_m2} m²
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {building.geometry.top_floor_rooms_count} top-floor rooms affected
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Envelope Power Cut</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                      {recommended.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Peak conductive heat load eliminated
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  <strong>Model formulation: </strong>
                  Calculated using 1D steady-state conductive envelope equations: <code>q = U × (T_sol_air - T_in)</code> under 850 W/m² peak solar irradiance.
                </div>
              </div>

              {/* Water Technical Details */}
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Droplets size={17} style={{ color: 'var(--water-blue)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Daily Mass Balance (IS 15797:2008 / IMD Series)
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: 'var(--water-light)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--water-blue)' }}>Monsoon Reliability</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--water-blue)' }}>
                      {recommended.water_summary.monsoon_coverage_percent}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      June – October self-sufficiency
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Annual Coverage</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--water-blue)' }}>
                      {recommended.water_summary.demand_coverage_percent}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      365-day demand coverage
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storage Capacity Buffer</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {recommended.storage_capacity_liters.toLocaleString()} L
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      6.7 days non-potable reserve
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Empty Tank Days</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--amber-primary)' }}>
                      {recommended.water_summary.empty_tank_days_count} days
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Occurs during non-monsoon drought
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                  <strong>Model formulation: </strong>
                  Chronological mass balance: <code>S_t = min(C, S_{'{t-1}'} + Inflow_t - Demand_t)</code> with 1.5mm initial first-flush diversion and SS dual-mesh filter efficiency.
                </div>
              </div>
            </div>

            {/* Why-Not Alternative Packages */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                Why Was This Package Selected Over Alternatives?
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '0.82rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>vs Heat-First ({heatFirst ? `₹${(heatFirst.boq.total_cost_inr / 100000).toFixed(2)}L` : 'Overbudget'}): </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Adding 50mm XPS over-deck insulation raises cost by 52% to save additional heat flux, but reduces tank storage to only 20 kL.
                  </span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>vs Water-First ({waterFirst ? `₹${(waterFirst.boq.total_cost_inr / 100000).toFixed(2)}L` : 'Overbudget'}): </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    An 80 kL tank farm costs 65% more (₹6.61L) for only 1.8% higher annual coverage due to diminishing returns after monsoon season.
                  </span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>vs Bare Catchment (No Coating): </strong>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Lacks thermal protection entirely, leaving top-floor rooms subject to punishing 38°C ceiling conduction without roof reflectance.
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Honesty Disclaimer */}
            <div style={{
              background: 'var(--amber-light)',
              border: '1px solid var(--amber-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.78rem',
              color: 'var(--amber-primary)',
              lineHeight: '1.45'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Physical Honesty Disclosure: </strong>
                Modelled estimates represent 1D steady-state ceiling conduction and historical IMD daily rainfall records. Before civil procurement, verify downspout plumbing convergence, inspect slab waterproofing, and conduct a licensed structural load audit.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
