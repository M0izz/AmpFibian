import React from 'react';
import { CloudRain, IndianRupee, Layers, Droplet } from 'lucide-react';
import type { BuildingProfile } from '../types';

interface BuildingContextBarProps {
  building: BuildingProfile;
  rainfallYear: string;
  onSelectRainfallYear: (year: string) => void;
}

export const BuildingContextBar: React.FC<BuildingContextBarProps> = ({
  building,
  rainfallYear,
  onSelectRainfallYear
}) => {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '12px 18px',
      marginBottom: '24px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Left: Building Specs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
          <Layers size={15} color="var(--green-primary)" />
          <span style={{ color: 'var(--text-muted)' }}>Roof Area:</span>
          <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {building.geometry.gross_roof_area_m2} m²
          </strong>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            ({building.geometry.usable_roof_area_m2} m² usable)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
          <IndianRupee size={15} color="var(--amber-primary)" />
          <span style={{ color: 'var(--text-muted)' }}>Budget Limit:</span>
          <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            ₹{(building.constraints_and_budget.budget_cap_inr / 100000).toFixed(2)} Lakhs
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem' }}>
          <Droplet size={15} color="var(--water-blue)" />
          <span style={{ color: 'var(--text-muted)' }}>Non-Potable Demand:</span>
          <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
            {building.water_demand.total_non_potable_demand_liters_day.toLocaleString()} L/day
          </strong>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            ({building.water_demand.occupancy_students} students)
          </span>
        </div>
      </div>

      {/* Right: Weather Scenario Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <CloudRain size={15} color="var(--water-blue)" />
          <span>Rainfall Scenario:</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            id="btn-rain-dry"
            onClick={() => onSelectRainfallYear('2015_dry')}
            className={`btn ${rainfallYear === '2015_dry' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: rainfallYear === '2015_dry' ? 'var(--amber-primary)' : undefined,
              borderColor: rainfallYear === '2015_dry' ? 'var(--amber-primary)' : undefined
            }}
            title="Drought year with prolonged dry intervals (1,714 mm)"
          >
            2015 Dry (1,714 mm)
          </button>

          <button
            id="btn-rain-median"
            onClick={() => onSelectRainfallYear('2020_median')}
            className={`btn ${rainfallYear === '2020_median' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            title="Representative 30-year Mumbai climatological mean (2,640 mm)"
          >
            2020 Typical (2,640 mm)
          </button>

          <button
            id="btn-rain-wet"
            onClick={() => onSelectRainfallYear('2019_wet')}
            className={`btn ${rainfallYear === '2019_wet' ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: rainfallYear === '2019_wet' ? 'var(--water-blue)' : undefined,
              borderColor: rainfallYear === '2019_wet' ? 'var(--water-blue)' : undefined
            }}
            title="Extreme monsoon surge year with cloudbursts (3,485 mm)"
          >
            2019 Wet (3,485 mm)
          </button>
        </div>
      </div>
    </div>
  );
};
