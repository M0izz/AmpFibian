import React, { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import type { BuildingProfile } from '../types';
import { DEFAULT_MUMBAI_HOSTEL } from '../lib/api';

interface AssessmentViewProps {
  building: BuildingProfile;
  onSaveAndRun: (updatedBuilding: BuildingProfile) => void;
  isSimulating: boolean;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  building,
  onSaveAndRun,
  isSimulating
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<BuildingProfile>(building);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleReset = () => {
    setFormData(DEFAULT_MUMBAI_HOSTEL);
    setValidationErrors([]);
  };

  const handleGrossChange = (val: number) => {
    const gross = Math.max(50, val);
    const access = formData.geometry.clear_access_corridors_m2;
    const usable = Math.max(10, gross - access);
    setFormData({
      ...formData,
      geometry: { ...formData.geometry, gross_roof_area_m2: gross, usable_roof_area_m2: usable }
    });
  };

  const handleAccessChange = (val: number) => {
    const access = Math.max(0, val);
    const gross = formData.geometry.gross_roof_area_m2;
    const usable = Math.max(10, gross - access);
    setFormData({
      ...formData,
      geometry: { ...formData.geometry, clear_access_corridors_m2: access, usable_roof_area_m2: usable }
    });
  };

  const validate = () => {
    const errors: string[] = [];
    if (formData.geometry.gross_roof_area_m2 <= 0) errors.push("Gross roof area must be positive.");
    if (formData.geometry.usable_roof_area_m2 <= 0) errors.push("Usable roof area must be positive.");
    if (formData.water_demand.total_non_potable_demand_liters_day <= 0) errors.push("Daily water demand must be positive.");
    if (formData.constraints_and_budget.budget_cap_inr <= 0) errors.push("Budget cap must be positive.");
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveAndRun(formData);
    }
  };

  const steps = [
    { num: 1, label: 'Building Profile' },
    { num: 2, label: 'Roof Constraints' },
    { num: 3, label: 'Water Demand' },
    { num: 4, label: 'Budget & Priority' },
    { num: 5, label: 'Review & Run' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step Progress Bar */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          {steps.map((s, idx) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  opacity: isCurrent || isCompleted ? 1 : 0.6
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  background: isCurrent ? 'var(--green-primary)' : isCompleted ? 'var(--green-light)' : 'var(--bg-subtle)',
                  color: isCurrent ? '#FFFFFF' : isCompleted ? 'var(--green-primary)' : 'var(--text-muted)',
                  border: isCompleted ? '1px solid var(--green-border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {isCompleted ? <CheckCircle2 size={16} /> : s.num}
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)'
                }}>
                  {s.label}
                </span>

                {idx < steps.length - 1 && (
                  <span style={{ color: 'var(--border-default)', margin: '0 8px' }}>—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workflow Form Container */}
      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          {/* STEP 1: Building Profile */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Step 1: Building Identity & Structural Geometry
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Specify building classification, location, and structural slab dimensions.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="input-building-name" className="form-label">Building / Campus Name</label>
                  <input
                    id="input-building-name"
                    type="text"
                    maxLength={80}
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="input-location" className="form-label">Location (City & Neighborhood)</label>
                  <input
                    id="input-location"
                    type="text"
                    className="form-input"
                    value={`${formData.location.city} (${formData.location.neighborhood})`}
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="input-gross-area" className="form-label">Gross Roof Slab Footprint (m²)</label>
                  <input
                    id="input-gross-area"
                    type="number"
                    min="50"
                    className="form-input"
                    value={formData.geometry.gross_roof_area_m2}
                    onChange={e => handleGrossChange(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Total architectural roof area including edge parapets
                  </div>
                </div>

                <div>
                  <label className="form-label">Top-Floor Exposed Ceiling Area (m²)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.geometry.top_floor_exposed_ceiling_area_m2}
                    onChange={e => setFormData({
                      ...formData,
                      geometry: { ...formData.geometry, top_floor_exposed_ceiling_area_m2: Number(e.target.value) }
                    })}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Ceiling area exposed directly underneath the roof slab ({formData.geometry.top_floor_rooms_count} rooms)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Roof Constraints & Allocation */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Step 2: Roof Availability & Physical Constraints
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Account for access pathways, parapets, utility yard space, and allowable structural dead-loads.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="input-access-area" className="form-label">Clear Access & Parapet Corridors (m²)</label>
                  <input
                    id="input-access-area"
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.geometry.clear_access_corridors_m2}
                    onChange={e => handleAccessChange(Number(e.target.value))}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Reserved perimeter for maintenance walkways and fire egress
                  </div>
                </div>

                <div>
                  <label className="form-label">Net Usable Roof Surface (m²)</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled
                    value={formData.geometry.usable_roof_area_m2}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 500, marginTop: '4px' }}>
                    Calculated: Gross ({formData.geometry.gross_roof_area_m2} m²) - Access ({formData.geometry.clear_access_corridors_m2} m²)
                  </div>
                </div>

                <div>
                  <label className="form-label">Ground Utility Yard Available for Tanks (m²)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.constraints_and_budget.ground_yard_available_for_tanks_m2}
                    onChange={e => setFormData({
                      ...formData,
                      constraints_and_budget: {
                        ...formData.constraints_and_budget,
                        ground_yard_available_for_tanks_m2: Number(e.target.value)
                      }
                    })}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Ground-level utility yard space for modular HDPE tank arrays
                  </div>
                </div>

                <div>
                  <label className="form-label">Allowable Roof Added Dead-Load (kg/m²)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.constraints_and_budget.max_allowable_roof_deadload_kg_m2}
                    onChange={e => setFormData({
                      ...formData,
                      constraints_and_budget: {
                        ...formData.constraints_and_budget,
                        max_allowable_roof_deadload_kg_m2: Number(e.target.value)
                      }
                    })}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Allowable live + dead load margin without structural reinforcement
                  </div>
                </div>
              </div>

              {/* Structural Certification Checkbox */}
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px'
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
                    style={{ width: '18px', height: '18px', accentColor: 'var(--green-primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    Licensed Civil Engineer Structural Audit Certified
                  </span>
                </label>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '28px', marginTop: '4px' }}>
                  Safety filter: Heavy green roof trays (260 kg/m² saturated deadload) require a certified structural load audit. Uncertified roofs automatically reject heavy green systems.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Water Demand & Historical Weather */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Step 3: Water Demand Profile & Rainwater Sizing
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Define daily non-potable requirements (toilet flushing, cleaning) and campus occupancy.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="input-occupancy" className="form-label">Hostel Student Occupancy</label>
                  <input
                    id="input-occupancy"
                    type="number"
                    step="1"
                    min="1"
                    className="form-input"
                    value={formData.water_demand.occupancy_students}
                    onChange={e => {
                      const students = Math.max(1, Number(e.target.value));
                      const perCapita = formData.water_demand.non_potable_demand_liters_per_capita_day;
                      setFormData({
                        ...formData,
                        water_demand: {
                          ...formData.water_demand,
                          occupancy_students: students,
                          total_non_potable_demand_liters_day: students * perCapita
                        }
                      });
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="input-demand-lpd" className="form-label">Non-Potable Allocation (L / person / day)</label>
                  <input
                    id="input-demand-lpd"
                    type="number"
                    min="1"
                    className="form-input"
                    value={formData.water_demand.non_potable_demand_liters_per_capita_day}
                    onChange={e => {
                      const perCapita = Math.max(1, Number(e.target.value));
                      const students = formData.water_demand.occupancy_students;
                      setFormData({
                        ...formData,
                        water_demand: {
                          ...formData.water_demand,
                          non_potable_demand_liters_per_capita_day: perCapita,
                          total_non_potable_demand_liters_day: students * perCapita
                        }
                      });
                    }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Per NBC 2016 Part 9: 30 L flushing + 10 L cleaning & washing
                  </div>
                </div>

                <div>
                  <label className="form-label">Total Daily Non-Potable Demand (L/day)</label>
                  <input
                    type="number"
                    className="form-input"
                    disabled
                    value={formData.water_demand.total_non_potable_demand_liters_day}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--water-blue)', fontWeight: 500, marginTop: '4px' }}>
                    Annual non-potable demand: {(formData.water_demand.total_non_potable_demand_liters_day * 365 / 1000000).toFixed(2)}M Liters
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Priorities */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Step 4: Financial Budget Cap & Resilience Priorities
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Specify capital expenditure ceiling and preference mode across thermal and water objectives.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label htmlFor="input-budget" className="form-label">Available Capital Budget Cap (₹ INR)</label>
                  <input
                    id="input-budget"
                    type="number"
                    step="50000"
                    min="100000"
                    className="form-input"
                    value={formData.constraints_and_budget.budget_cap_inr}
                    onChange={e => setFormData({
                      ...formData,
                      constraints_and_budget: {
                        ...formData.constraints_and_budget,
                        budget_cap_inr: Number(e.target.value)
                      }
                    })}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--amber-primary)', fontWeight: 500, marginTop: '4px' }}>
                    ₹{(formData.constraints_and_budget.budget_cap_inr / 100000).toFixed(2)} Lakhs (Hard feasibility ceiling)
                  </div>
                </div>
              </div>

              {/* Priority Mode Cards */}
              <div style={{ marginTop: '14px' }}>
                <label className="form-label" style={{ marginBottom: '10px' }}>Optimization Priority Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div style={{
                    border: '2px solid var(--green-primary)',
                    background: 'var(--green-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px'
                  }}>
                    <strong style={{ color: 'var(--green-primary)', fontSize: '0.85rem' }}>Balanced (Recommended)</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Picks the Pareto knee-point to maximize simultaneous heat reduction and water reliability without budget exhaustion.
                    </p>
                  </div>

                  <div style={{
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px'
                  }}>
                    <strong style={{ color: 'var(--amber-primary)', fontSize: '0.85rem' }}>Heat-First Priority</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Prioritizes maximum envelope conductive heat-gain cut using XPS over-deck insulation and reflective coatings.
                    </p>
                  </div>

                  <div style={{
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px'
                  }}>
                    <strong style={{ color: 'var(--water-blue)', fontSize: '0.85rem' }}>Water-First Priority</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Prioritizes large storage capacity (up to 80 kL) for peak monsoon buffer and dry-season carryover.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Run */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Step 5: Review Building Assessment & Execute Engine
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Verify physical inputs before running the deterministic multi-package optimization engine.
              </p>

              {/* Review Summary Grid */}
              <div style={{
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                fontSize: '0.82rem',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Building:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formData.name}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Roof Area:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {formData.geometry.gross_roof_area_m2} m² gross ({formData.geometry.usable_roof_area_m2} m² usable)
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Daily Water Demand:</span>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {formData.water_demand.total_non_potable_demand_liters_day.toLocaleString()} L/day
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Budget Ceiling:</span>
                  <div style={{ fontWeight: 600, color: 'var(--amber-primary)' }}>
                    ₹{(formData.constraints_and_budget.budget_cap_inr / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>

              {validationErrors.length > 0 && (
                <div style={{
                  background: 'var(--error-light)',
                  border: '1px solid var(--error-border)',
                  color: 'var(--error-primary)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  marginBottom: '16px'
                }}>
                  {validationErrors.map((err, i) => <div key={i}>✗ {err}</div>)}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-default)',
            paddingTop: '20px',
            marginTop: '24px'
          }}>
            <div>
              {currentStep > 1 ? (
                <button
                  id="btn-back-step"
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={15} />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  id="btn-reset"
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                  title="Reset to default Mumbai hostel baseline"
                >
                  <RotateCcw size={14} />
                  <span>Reset to Baseline</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {currentStep < 5 ? (
                <button
                  id="btn-next-step"
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn btn-primary"
                >
                  <span>Next Step</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  id="btn-save-run"
                  type="submit"
                  disabled={isSimulating}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                >
                  <Play size={16} />
                  <span>{isSimulating ? 'Evaluating Optimization...' : 'Run Assessment Engine'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
