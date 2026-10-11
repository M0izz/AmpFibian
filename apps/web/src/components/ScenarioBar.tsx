import React from 'react';
import { CloudRain, IndianRupee, Layers, Droplet, Sliders, CheckCircle2 } from 'lucide-react';
import type { BuildingProfile } from '../types';

interface ScenarioBarProps {
  rainfallYear: string;
  onSelectRainfallYear: (year: string) => void;
  building: BuildingProfile;
  onOpenEditAssessment: () => void;
  runId: string;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  rainfallYear,
  onSelectRainfallYear,
  building,
  onOpenEditAssessment,
  runId
}) => {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '14px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Left: Rainfall Scenario Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
            <CloudRain size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Historical Rainfall Year:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onSelectRainfallYear('2015_dry')}
              className="btn"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                background: rainfallYear === '2015_dry' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                color: rainfallYear === '2015_dry' ? '#fbbf24' : 'var(--text-muted)',
                borderColor: rainfallYear === '2015_dry' ? 'var(--accent-amber)' : 'var(--border-subtle)'
              }}
            >
              2015 Dry (1,714 mm)
            </button>

            <button
              onClick={() => onSelectRainfallYear('2020_median')}
              className="btn"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                background: rainfallYear === '2020_median' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                color: rainfallYear === '2020_median' ? '#38bdf8' : 'var(--text-muted)',
                borderColor: rainfallYear === '2020_median' ? 'var(--accent-cyan)' : 'var(--border-subtle)'
              }}
            >
              2020 Median (2,640 mm)
            </button>

            <button
              onClick={() => onSelectRainfallYear('2019_wet')}
              className="btn"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                background: rainfallYear === '2019_wet' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                color: rainfallYear === '2019_wet' ? '#34d399' : 'var(--text-muted)',
                borderColor: rainfallYear === '2019_wet' ? 'var(--accent-emerald)' : 'var(--border-subtle)'
              }}
            >
              2019 Wet (3,485 mm)
            </button>
          </div>
        </div>

        {/* Center/Right: Physical Constraints Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.81rem' }}>
            <IndianRupee size={14} color="var(--accent-amber)" />
            <span style={{ color: 'var(--text-dim)' }}>Budget Cap:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
              ₹{(building.constraints_and_budget.budget_cap_inr / 100000).toFixed(1)} Lakhs
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.81rem' }}>
            <Layers size={14} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-dim)' }}>Usable Roof:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
              {building.geometry.usable_roof_area_m2} m²
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.81rem' }}>
            <Droplet size={14} color="#60a5fa" />
            <span style={{ color: 'var(--text-dim)' }}>Non-Potable Demand:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
              {building.water_demand.total_non_potable_demand_liters_day.toLocaleString()} L/day
            </span>
          </div>

          <button
            onClick={onOpenEditAssessment}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '5px 10px', gap: '5px' }}
          >
            <Sliders size={13} />
            <span>Edit Building Inputs</span>
          </button>

          {runId && (
            <div className="mono-badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              <CheckCircle2 size={11} /> {runId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
