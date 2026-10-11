import React from 'react';
import { Sparkles, Flame, Droplets, ArrowRight } from 'lucide-react';
import type { RetrofitPackage } from '../types';

interface PackageComparisonProps {
  packages: RetrofitPackage[];
  onSelectPackage: (pkg: RetrofitPackage) => void;
  selectedPackageId: string;
}

export const PackageComparison: React.FC<PackageComparisonProps> = ({
  packages,
  onSelectPackage,
  selectedPackageId
}) => {
  const balanced = packages.find(p => p.profile_type === 'balanced');
  const heatFirst = packages.find(p => p.profile_type === 'heat_first');
  const waterFirst = packages.find(p => p.profile_type === 'water_first');
  const baseline = packages.find(p => p.package_id === 'pkg_baseline');

  const cards = [
    { pkg: balanced, badge: 'Recommended Balanced', icon: <Sparkles size={16} />, color: '#06b6d4', glow: 'var(--accent-cyan-glow)' },
    { pkg: heatFirst, badge: 'Heat-First Benchmark', icon: <Flame size={16} />, color: '#f59e0b', glow: 'var(--accent-amber-glow)' },
    { pkg: waterFirst, badge: 'Water-First Benchmark', icon: <Droplets size={16} />, color: '#10b981', glow: 'var(--accent-emerald-glow)' },
    { pkg: baseline, badge: 'Current Baseline', icon: null, color: '#64748b', glow: 'none' }
  ].filter(item => item.pkg != null);

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '4px'
        }}>
          Multi-Objective Feasible Package Comparison
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Ranked from deterministic Pareto frontier; physical heat-gain reduction and chronological daily water reliability
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '18px'
      }}>
        {cards.map(({ pkg, badge, icon, color, glow }) => {
          if (!pkg) return null;
          const isSelected = selectedPackageId === pkg.package_id;
          const isRecommended = pkg.profile_type === 'balanced';

          return (
            <div
              key={pkg.package_id}
              onClick={() => onSelectPackage(pkg)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                position: 'relative',
                borderColor: isSelected ? color : isRecommended ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)',
                boxShadow: isSelected ? `0 0 20px ${glow}` : 'var(--shadow-md)',
                transform: isSelected ? 'scale(1.01)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: color,
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {icon} {badge}
                </span>

                <span className="mono-badge" style={{ fontSize: '0.72rem' }}>
                  {pkg.is_feasible ? '✓ Feasible' : '✗ Infeasible'}
                </span>
              </div>

              {/* Title & Description */}
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '6px'
              }}>
                {pkg.name}
              </h3>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4',
                marginBottom: '16px',
                minHeight: '44px'
              }}>
                {pkg.description}
              </p>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                {/* Cost */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Upfront Capital
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    marginTop: '2px'
                  }}>
                    {pkg.boq.total_cost_inr === 0 ? '₹0' : `₹${(pkg.boq.total_cost_inr / 100000).toFixed(2)}L`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {pkg.boq.budget_cap_inr > 0 ? `${Math.round(pkg.boq.total_cost_inr / pkg.boq.budget_cap_inr * 100)}% budget` : ''}
                  </div>
                </div>

                {/* Water Coverage */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Water Reliability
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: pkg.water_summary.demand_coverage_percent > 0 ? '#34d399' : 'var(--text-dim)',
                    marginTop: '2px'
                  }}>
                    {pkg.water_summary.demand_coverage_percent}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {(pkg.water_summary.total_served_demand_liters / 1000000).toFixed(2)}M L / yr
                  </div>
                </div>

                {/* Heat Gain Reduction */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Heat Flux Cut
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: pkg.heat_summary.modelled_reduction_percent > 0 ? '#38bdf8' : 'var(--text-dim)',
                    marginTop: '2px'
                  }}>
                    -{pkg.heat_summary.modelled_reduction_percent}%
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {pkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW top floor
                  </div>
                </div>

                {/* Sol-Air Delta */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Sol-Air Delta
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: pkg.heat_summary.sol_air_temperature_delta_celsius > 0 ? '#fbbf24' : 'var(--text-dim)',
                    marginTop: '2px'
                  }}>
                    -{pkg.heat_summary.sol_air_temperature_delta_celsius}°C
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Storage: {pkg.storage_capacity_liters > 0 ? `${pkg.storage_capacity_liters / 1000} kL` : '0 kL'}
                  </div>
                </div>
              </div>

              {/* Selection Rationale */}
              <div style={{
                fontSize: '0.77rem',
                color: 'var(--text-muted)',
                lineHeight: '1.45',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '10px'
              }}>
                <strong style={{ color: 'var(--text-main)' }}>Trade-off Rationale: </strong>
                {pkg.selection_rationale || pkg.tradeoff_notes}
              </div>

              {/* Selection Indicator button */}
              <div style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                fontSize: '0.76rem',
                color: isSelected ? color : 'var(--text-dim)',
                fontWeight: 600,
                gap: '4px'
              }}>
                <span>{isSelected ? 'Active Selection' : 'Inspect Details'}</span>
                <ArrowRight size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
