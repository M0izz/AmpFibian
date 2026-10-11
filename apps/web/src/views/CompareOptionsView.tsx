import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Flame,
  Droplets,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldAlert,
  X
} from 'lucide-react';
import type { RetrofitPackage, BuildingProfile, SimulationSnapshot } from '../types';

interface CompareOptionsViewProps {
  simulation: SimulationSnapshot;
  building: BuildingProfile;
  selectedPackage: RetrofitPackage;
  onSelectPackage: (pkg: RetrofitPackage) => void;
}

export const CompareOptionsView: React.FC<CompareOptionsViewProps> = ({
  simulation,
  building,
  selectedPackage,
  onSelectPackage
}) => {
  const [detailDrawerPkg, setDetailDrawerPkg] = useState<RetrofitPackage | null>(selectedPackage);

  const balanced = simulation.profile_recommendations.balanced;
  const heatFirst = simulation.profile_recommendations.heat_first;
  const waterFirst = simulation.profile_recommendations.water_first;
  const baseline = simulation.packages.find(p => p.package_id === 'pkg_baseline');

  const corePackages = [balanced, heatFirst, waterFirst, baseline].filter(Boolean) as RetrofitPackage[];
  const budgetCap = building.constraints_and_budget.budget_cap_inr;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Description */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Scale size={20} color="var(--green-primary)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Compare Retrofit Alternatives
          </h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Side-by-side evaluation of non-dominated Pareto packages against the existing baseline. Feasibility constraints are strictly checked before ranking.
        </p>
      </div>

      {/* Structured Comparison Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Option / Profile</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Upfront Capital</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Water Coverage</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Peak Heat Cut</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Storage Buffer</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Feasibility Status</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {corePackages.map(pkg => {
                const isRecommended = pkg.profile_type === 'balanced';
                const isSelected = detailDrawerPkg?.package_id === pkg.package_id;
                const costLakhs = (pkg.boq.total_cost_inr / 100000).toFixed(2);
                const budgetUsedPct = budgetCap > 0 ? Math.round((pkg.boq.total_cost_inr / budgetCap) * 100) : 0;

                return (
                  <tr
                    key={pkg.package_id}
                    onClick={() => {
                      onSelectPackage(pkg);
                      setDetailDrawerPkg(pkg);
                    }}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: isSelected ? 'var(--green-light)' : isRecommended ? 'rgba(232, 244, 236, 0.4)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Option Title */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isRecommended && (
                          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                            <Sparkles size={11} /> Recommended
                          </span>
                        )}
                        {pkg.profile_type === 'heat_first' && (
                          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                            <Flame size={11} /> Heat-First
                          </span>
                        )}
                        {pkg.profile_type === 'water_first' && (
                          <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                            <Droplets size={11} /> Water-First
                          </span>
                        )}
                        {pkg.package_id === 'pkg_baseline' && (
                          <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                            Baseline
                          </span>
                        )}
                      </div>
                      <strong style={{ color: 'var(--text-main)', display: 'block', marginTop: '4px' }}>
                        {pkg.name}
                      </strong>
                    </td>

                    {/* Cost */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>
                        {pkg.boq.total_cost_inr === 0 ? '₹0' : `₹${costLakhs}L`}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {budgetUsedPct}% of budget limit
                      </div>
                    </td>

                    {/* Water */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: pkg.water_summary.demand_coverage_percent > 0 ? 'var(--water-blue)' : 'var(--text-muted)' }}>
                        {pkg.water_summary.demand_coverage_percent}%
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {(pkg.water_summary.total_served_demand_liters / 1000000).toFixed(2)}M L supplied
                      </div>
                    </td>

                    {/* Heat */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: pkg.heat_summary.modelled_reduction_percent > 0 ? 'var(--green-primary)' : 'var(--text-muted)' }}>
                        {pkg.heat_summary.modelled_reduction_percent > 0 ? `-${pkg.heat_summary.modelled_reduction_percent}%` : '0%'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        -{pkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW peak cut
                      </div>
                    </td>

                    {/* Storage */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
                        {pkg.storage_capacity_liters > 0 ? `${pkg.storage_capacity_liters / 1000} kL` : 'None'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {pkg.storage_capacity_liters > 0 ? 'Ground HDPE tank' : 'Direct storm drain'}
                      </div>
                    </td>

                    {/* Feasibility */}
                    <td style={{ padding: '14px 18px' }}>
                      {pkg.is_feasible ? (
                        <span className="badge badge-green">
                          <CheckCircle2 size={12} /> Feasible
                        </span>
                      ) : (
                        <span className="badge badge-red">
                          <XCircle size={12} /> Infeasible
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPackage(pkg);
                          setDetailDrawerPkg(pkg);
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Package Drawer / Inspector */}
      {detailDrawerPkg && (
        <div className="card animate-fade-in" style={{ padding: '24px', border: '1.5px solid var(--border-active)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '6px' }}>
                Inspecting: {detailDrawerPkg.profile_type.toUpperCase()}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {detailDrawerPkg.name}
              </h3>
            </div>
            <button
              onClick={() => setDetailDrawerPkg(null)}
              className="btn btn-secondary"
              style={{ padding: '4px 8px' }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>
            {detailDrawerPkg.description}
          </p>

          {/* Itemized BOQ Table */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
              Itemized Bill of Quantities (BOQ) & Cost Provenance
            </h4>
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Intervention Item</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Quantity</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Rate</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>Subtotal</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>Price Source & Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {detailDrawerPkg.boq.items.length > 0 ? (
                    detailDrawerPkg.boq.items.map(item => (
                      <tr key={item.intervention_id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{item.quantity} {item.unit}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{item.unit_rate_inr.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{item.subtotal_inr.toLocaleString()}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>
                          {item.source} <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{item.confidence}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Zero capital expenditure for unimproved baseline.
                      </td>
                    </tr>
                  )}
                  <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700 }}>
                    <td style={{ padding: '8px 12px' }}>Total Upfront Capital Cost</td>
                    <td colSpan={2}></td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--green-primary)' }}>
                      ₹{detailDrawerPkg.boq.total_cost_inr.toLocaleString()}
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>
                      Budget Variance: ₹{detailDrawerPkg.boq.budget_variance_inr.toLocaleString()} cushion
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tradeoff & Selection Rationale */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            fontSize: '0.8rem',
            lineHeight: '1.45',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--text-main)' }}>Selection Rationale & Trade-Offs: </strong>
            {detailDrawerPkg.selection_rationale || detailDrawerPkg.tradeoff_notes || 'Baseline unretrofitted state.'}
          </div>
        </div>
      )}

      {/* Excluded & Infeasible Alternatives Audit Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldAlert size={18} color="var(--error-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Hard Feasibility Screening & Excluded Alternatives Audit
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Options violating physical bounds, budget ceilings, or structural load limits are filtered out before preference ranking:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {simulation.packages.filter(p => !p.is_feasible).map(p => (
            <div
              key={p.package_id}
              style={{
                background: 'var(--error-light)',
                border: '1px solid var(--error-border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ color: 'var(--text-main)' }}>{p.name}</strong>
                <span className="badge badge-red">Hard Rejected</span>
              </div>
              <div style={{ color: 'var(--error-primary)', lineHeight: '1.4' }}>
                {p.feasibility_reasons.join(' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
