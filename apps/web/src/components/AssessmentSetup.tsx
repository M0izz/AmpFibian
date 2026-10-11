import React, { useState } from 'react';
import { X, RotateCcw, Check, Building } from 'lucide-react';
import type { BuildingProfile } from '../types';
import { DEFAULT_MUMBAI_HOSTEL } from '../lib/api';

interface AssessmentSetupProps {
  building: BuildingProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: BuildingProfile) => void;
}

export const AssessmentSetup: React.FC<AssessmentSetupProps> = ({
  building,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<BuildingProfile>(building);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData(DEFAULT_MUMBAI_HOSTEL);
  };

  const handleGrossAreaChange = (val: number) => {
    const gross = Math.max(50, val);
    const access = formData.geometry.clear_access_corridors_m2;
    const usable = Math.max(10, gross - access);
    setFormData({
      ...formData,
      geometry: {
        ...formData.geometry,
        gross_roof_area_m2: gross,
        usable_roof_area_m2: usable
      }
    });
  };

  const handleAccessAreaChange = (val: number) => {
    const access = Math.max(0, val);
    const gross = formData.geometry.gross_roof_area_m2;
    const usable = Math.max(10, gross - access);
    setFormData({
      ...formData,
      geometry: {
        ...formData.geometry,
        clear_access_corridors_m2: access,
        usable_roof_area_m2: usable
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Building Assessment & Constraint Setup
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Building Identity */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              1. Building Identity & Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Building / Campus Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Building Type</label>
                <input
                  type="text"
                  disabled
                  value="College Hostel (Mumbai)"
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-dim)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Roof Geometry */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              2. Roof Geometry & Area Allocations
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross Roof Area (m²)</label>
                <input
                  type="number"
                  value={formData.geometry.gross_roof_area_m2}
                  onChange={e => handleGrossAreaChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Parapets / Clear Access (m²)</label>
                <input
                  type="number"
                  value={formData.geometry.clear_access_corridors_m2}
                  onChange={e => handleAccessAreaChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Usable Net Roof (m²)</label>
                <input
                  type="number"
                  disabled
                  value={formData.geometry.usable_roof_area_m2}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Water Demand & Budget */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              3. Water Demand & Financial Constraints
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Non-Potable (L/day)</label>
                <input
                  type="number"
                  value={formData.water_demand.total_non_potable_demand_liters_day}
                  onChange={e => setFormData({
                    ...formData,
                    water_demand: {
                      ...formData.water_demand,
                      total_non_potable_demand_liters_day: Number(e.target.value)
                    }
                  })}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Capital Budget Cap (₹ INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={formData.constraints_and_budget.budget_cap_inr}
                  onChange={e => setFormData({
                    ...formData,
                    constraints_and_budget: {
                      ...formData.constraints_and_budget,
                      budget_cap_inr: Number(e.target.value)
                    }
                  })}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fbbf24',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ground Yard Area (m²)</label>
                <input
                  type="number"
                  value={formData.constraints_and_budget.ground_yard_available_for_tanks_m2}
                  onChange={e => setFormData({
                    ...formData,
                    constraints_and_budget: {
                      ...formData.constraints_and_budget,
                      ground_yard_available_for_tanks_m2: Number(e.target.value)
                    }
                  })}
                  style={{
                    width: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Structural Certification */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.35)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.constraints_and_budget.structural_audit_certified}
                onChange={e => setFormData({
                  ...formData,
                  constraints_and_budget: {
                    ...formData.constraints_and_budget,
                    structural_audit_certified: e.target.checked
                  }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
              />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>
                Certified Structural Load Audit Available (enables intensive green roofs &gt;250 kg/m²)
              </span>
            </label>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '28px', marginTop: '2px' }}>
              When uncertified, packages requiring heavy saturated soil loads are hard-filtered for safety.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem' }}
            >
              <RotateCcw size={14} />
              <span>Reset to Mumbai Hostel Baseline</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontSize: '0.8rem' }}
              >
                <Check size={14} />
                <span>Apply & Re-Run Engine</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
