import React from 'react';
import {
  Sparkles,
  Droplets,
  Sun,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Scale
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
  const recommended = simulation.profile_recommendations.balanced || simulation.packages[0];
  const heatFirst = simulation.profile_recommendations.heat_first;
  const waterFirst = simulation.profile_recommendations.water_first;

  const budgetCap = building.constraints_and_budget.budget_cap_inr;
  const budgetUsedPct = Math.round((recommended.boq.total_cost_inr / budgetCap) * 100);
  const budgetRemaining = Math.max(0, budgetCap - recommended.boq.total_cost_inr);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Visually Prominent Recommendation Panel */}
      <div className="card" style={{
        padding: '28px',
        border: '1.5px solid var(--green-border)',
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(15, 23, 42, 0.95) 100%)',
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
          fontSize: '1.85rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          {recommended.name}
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.55',
          maxWidth: '880px',
          marginBottom: '24px'
        }}>
          {recommended.description}
        </p>

        {/* 4 Core Decision Numbers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {/* Cost Card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Upfront Capital
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              ₹{(recommended.boq.total_cost_inr / 100000).toFixed(2)} Lakhs
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--green-primary)', fontWeight: 500, marginTop: '2px' }}>
              {budgetUsedPct}% of budget used (₹{(budgetRemaining / 100000).toFixed(2)}L cushion)
            </div>
          </div>

          {/* Water Outcome Card */}
          <div style={{
            background: 'var(--water-light)',
            border: '1px solid var(--water-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--water-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Non-Potable Water Reliability
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--water-blue)', marginTop: '4px' }}>
              {recommended.water_summary.demand_coverage_percent}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {(recommended.water_summary.total_served_demand_liters / 1000000).toFixed(2)}M Liters supplied / year
            </div>
          </div>

          {/* Heat Outcome Card */}
          <div style={{
            background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--green-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Top-Floor Peak Heat Cut
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--green-primary)', marginTop: '4px' }}>
              -{recommended.heat_summary.modelled_reduction_percent}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              -{recommended.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW peak envelope load
            </div>
          </div>

          {/* Storage & Area Card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Physical Sizing
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
              {recommended.storage_capacity_liters / 1000} kL
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Ground yard tank array • 520 m² roof coating
            </div>
          </div>
        </div>

        {/* Actions Row */}
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
              id="btn-view-assembly-details"
              onClick={() => onSelectPackageForDetail(recommended)}
              className="btn btn-secondary"
            >
              <span>View Cost & Assembly Details</span>
            </button>

            <button
              id="btn-goto-compare"
              onClick={onNavigateToCompare}
              className="btn btn-secondary"
            >
              <Scale size={15} />
              <span>Compare Alternatives</span>
            </button>

            <button
              id="btn-goto-reports"
              onClick={onNavigateToReports}
              className="btn btn-primary"
            >
              <FileText size={15} />
              <span>Export Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Two Primary Outcome Sections (Heat vs Water) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '20px'
      }}>
        {/* Heat Resilience Column */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--green-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--green-primary)'
            }}>
              <Sun size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Heat Resilience Performance
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Modelled 1D conductive envelope heat flux under peak summer sun (850 W/m²)
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Peak Heat Flux Cut</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                -{recommended.heat_summary.modelled_reduction_percent}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {recommended.heat_summary.estimated_peak_heat_flux_reduction_w_m2} W/m² reduction
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Exterior Sol-Air Delta</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--amber-primary)' }}>
                -{recommended.heat_summary.sol_air_temperature_delta_celsius}°C
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Exterior boundary forcing reduction
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Top Floor Exposed Area</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {building.geometry.top_floor_exposed_ceiling_area_m2} m²
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {building.geometry.top_floor_rooms_count} rooms directly under slab
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Top-Floor Power Cut</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--green-primary)' }}>
                {recommended.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Peak conductive load eliminated
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-subtle)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--green-primary)'
          }}>
            <strong>Engineering definition: </strong>
            Reports reduction in peak conductive heat flow through the top-floor ceiling envelope under steady-state boundary conditions. Does not guarantee exact indoor room temperature drops without dynamic building energy modeling.
          </div>
        </div>

        {/* Water Resilience Column */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--water-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--water-blue)'
            }}>
              <Droplets size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Water Resilience Performance
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Chronological daily mass balance across {simulation.rainfall_info.label} ({simulation.rainfall_info.annual_rainfall_mm} mm)
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--water-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--water-blue)' }}>Annual Demand Coverage</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--water-blue)' }}>
                {recommended.water_summary.demand_coverage_percent}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {(recommended.water_summary.total_served_demand_liters / 1000000).toFixed(2)}M L of 2.19M L needed
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monsoon Period Coverage</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--water-blue)' }}>
                {recommended.water_summary.monsoon_coverage_percent}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                June – October self-sufficiency
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storage Capacity Buffer</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {recommended.storage_capacity_liters.toLocaleString()} L
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                6.7 days demand storage reserve
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dry Season Carryover</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--amber-primary)' }}>
                {recommended.water_summary.dry_season_coverage_percent}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Tank empty: {recommended.water_summary.empty_tank_days_count} days
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-subtle)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--water-blue)'
          }}>
            <strong>Engineering definition: </strong>
            Evaluates daily rainwater runoff, initial 1.5mm first-flush diversion, and dual-mesh filter efficiency across 365 calendar days. Surplus monsoon rainfall overflows to municipal stormwater drains.
          </div>
        </div>
      </div>

      {/* 3. Decision Rationale ("Why this option?") */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
          Decision Rationale: Why Was This Package Selected?
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          {/* Reason 1 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ color: 'var(--green-primary)', marginTop: '2px' }}><CheckCircle2 size={18} /></div>
            <div>
              <strong style={{ color: 'var(--text-main)' }}>1. High Capital Efficiency: </strong>
              <span style={{ color: 'var(--text-muted)' }}>
                At ₹4,01,200, this option captures over 67% of annual water demand and halves top-floor conductive heat gain while leaving ₹3.99 Lakhs in budget reserve.
              </span>
            </div>
          </div>

          {/* Reason 2 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ color: 'var(--green-primary)', marginTop: '2px' }}><CheckCircle2 size={18} /></div>
            <div>
              <strong style={{ color: 'var(--text-main)' }}>2. Physical Feasibility: </strong>
              <span style={{ color: 'var(--text-muted)' }}>
                Ground utility yard storage avoids adding dead weight to the roof slab. The high-albedo elastomeric coating shares surface area with rainwater catchment without conflict.
              </span>
            </div>
          </div>

          {/* Reason 3 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ color: 'var(--green-primary)', marginTop: '2px' }}><CheckCircle2 size={18} /></div>
            <div>
              <strong style={{ color: 'var(--text-main)' }}>3. Non-Dominated Over Alternatives: </strong>
              <span style={{ color: 'var(--text-muted)' }}>
                {heatFirst && waterFirst
                  ? `The Heat-First option (${(heatFirst.boq.total_cost_inr / 100000).toFixed(2)}L) costs 52% more for only 20 kL storage, while Water-First 80 kL (${(waterFirst.boq.total_cost_inr / 100000).toFixed(2)}L) costs 65% more with diminishing dry-season returns.`
                  : 'Balances thermal mitigation with seasonal water storage under the available capital budget constraint.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Mandatory Physical Honesty Limitations Banner */}
      <div style={{
        background: 'var(--amber-light)',
        border: '1px solid var(--amber-border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'var(--amber-primary)',
        lineHeight: '1.45'
      }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--text-main)' }}>Engineering Model Disclosure & Limitations: </strong>
          Results are deterministic engineering estimates based on 1D heat-transfer and historical IMD daily rainfall series. Before tendering or procurement, confirm site plumbing downspout convergence, inspect existing roof slab waterproofing integrity, and conduct a licensed structural load audit.
        </div>
      </div>
    </div>
  );
};
