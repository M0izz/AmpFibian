import React from 'react';
import { Sun, AlertCircle } from 'lucide-react';
import type { HeatSummary } from '../types';

interface ThermalBreakdownProps {
  heatSummary: HeatSummary;
  packageName: string;
}

export const ThermalBreakdown: React.FC<ThermalBreakdownProps> = ({
  heatSummary,
  packageName
}) => {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E5A23A'
          }}>
            <Sun size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              1D Thermal Conduction & Sol-Air Analysis ({packageName})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Layer resistance summation, sol-air boundary response, and peak conductive flux reduction
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="mono-badge badge-amber">
            Sol-Air: -{heatSummary.sol_air_temperature_delta_celsius}°C
          </span>
          <span className="mono-badge badge-cyan">
            Top Floor: -{heatSummary.top_floor_peak_conductive_heat_reduction_kw} kW
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {/* Assembly U-Value */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Assembly U-Value
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {heatSummary.retrofit_u_value_w_m2k}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>W/m²·K</span>
          </div>
          <div style={{ fontSize: '0.73rem', color: heatSummary.u_value_reduction_percent > 0 ? '#3ECF8E' : 'var(--text-dim)', marginTop: '4px' }}>
            {heatSummary.u_value_reduction_percent > 0 ? `-${heatSummary.u_value_reduction_percent}% vs baseline (2.97)` : 'Uninsulated slab (baseline)'}
          </div>
        </div>

        {/* Solar Absorptance */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Solar Absorptance (α)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#4FA3D9' }}>
              {heatSummary.retrofit_solar_absorptance}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SRI &gt; 104</span>
          </div>
          <div style={{ fontSize: '0.73rem', color: '#3ECF8E', marginTop: '4px' }}>
            Reduced from {heatSummary.baseline_solar_absorptance} (Δ = -{heatSummary.delta_solar_absorptance})
          </div>
        </div>

        {/* Peak Absorbed Solar Flux */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Absorbed Solar Flux
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#E5A23A' }}>
              {heatSummary.peak_absorbed_flux_retrofit_w_m2}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>W/m²</span>
          </div>
          <div style={{ fontSize: '0.73rem', color: '#3ECF8E', marginTop: '4px' }}>
            -{heatSummary.peak_absorbed_flux_reduction_w_m2} W/m² under 850 W/m² peak sun
          </div>
        </div>

        {/* Top-Floor Peak Conductive Flux Reduction */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Top Floor Heat Cut
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: '#3ECF8E' }}>
              {heatSummary.top_floor_peak_conductive_heat_reduction_kw}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>kW peak</span>
          </div>
          <div style={{ fontSize: '0.73rem', color: '#4FA3D9', marginTop: '4px' }}>
            -{heatSummary.modelled_reduction_percent}% peak envelope heat flux
          </div>
        </div>
      </div>

      {/* Uncertainty Bounds Table */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '14px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
          Boundary Uncertainty Sensitivity Bands (Peak Mumbai Summer Conditions):
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px',
          fontSize: '0.75rem'
        }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '6px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Conservative (Low Solar / High Wind):</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
              {heatSummary.uncertainty_bounds.low_bound_top_floor_kw} kW peak cut
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>750 W/m², ho = 22 W/m²·K</div>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '10px', borderRadius: '6px' }}>
            <span style={{ color: '#4FA3D9', fontWeight: 600 }}>Central Engineering Baseline:</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {heatSummary.top_floor_peak_conductive_heat_reduction_kw} kW peak cut
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>850 W/m², ho = 19 W/m²·K</div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '6px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Aggressive (Peak Solar / Calm Air):</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
              {heatSummary.uncertainty_bounds.high_bound_top_floor_kw} kW peak cut
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>950 W/m², ho = 16 W/m²·K</div>
          </div>
        </div>
      </div>

      {/* Mandatory Physical Honesty Disclaimer */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.76rem',
        color: '#E5A23A',
        lineHeight: '1.4'
      }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <strong>Physical Honesty Contract: </strong>
          {heatSummary.label_disclaimer} Sol-air temperature measures exterior boundary forcing; actual indoor comfort depends on window glazing, internal loads, and ventilation.
        </div>
      </div>
    </div>
  );
};
