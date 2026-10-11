import React, { useState } from 'react';
import type { BuildingProfile, RetrofitPackage, SimulationSnapshot } from '../types';
import { useToast } from '../lib/toast';

interface ReportsViewProps {
  building: BuildingProfile;
  simulation: SimulationSnapshot;
  selectedPackage: RetrofitPackage;
  rainfallYear: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  building,
  simulation,
  selectedPackage,
  rainfallYear,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const { showToast } = useToast();

  const formatInr = (val: number) => '₹' + val.toLocaleString('en-IN');
  const formatKL = (liters: number) => (liters / 1000).toLocaleString('en-IN', { maximumFractionDigits: 1 }) + ' kL';

  const timestamp = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const reportData = {
      product: 'Roofwise',
      version: '1.2.0',
      exported_at: new Date().toISOString(),
      building,
      rainfall_scenario: rainfallYear,
      selected_package: selectedPackage,
      simulation_run_id: simulation.run_id,
      all_packages: simulation.packages,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Roofwise_Assessment_${building.name.replace(/\s+/g, '_')}_${selectedPackage.package_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON Exported', 'Full engineering assessment snapshot downloaded.', 'success');
  };

  const handleCopyMarkdown = () => {
    const text = `# ROOFWISE RETROFIT ASSESSMENT REPORT
Building: ${building.name} (${building.location.city})
Run ID: ${simulation.run_id} | Timestamp: ${timestamp}
Rainfall Scenario: ${rainfallYear}

## 1. EXECUTIVE SUMMARY
Recommended Package: ${selectedPackage.name}
Total Estimated Cost: ${formatInr(selectedPackage.boq.total_cost_inr)} (Budget Cap: ${formatInr(building.constraints_and_budget.budget_cap_inr)})
Demand Coverage: ${selectedPackage.water_summary.demand_coverage_percent.toFixed(1)}% (${formatKL(selectedPackage.water_summary.total_captured_inflow_liters)} captured)
Thermal Reduction: ${selectedPackage.heat_summary.modelled_reduction_percent.toFixed(1)}% peak conductive heat reduction (${selectedPackage.heat_summary.estimated_peak_heat_flux_reduction_w_m2.toFixed(1)} W/m² reduction)
Feasibility Status: ${selectedPackage.is_feasible ? 'PASSED ALL HARD CONSTRAINTS' : 'FAILED CONSTRAINTS'}

## 2. PHYSICAL SPECIFICATIONS
- Gross Roof Area: ${building.geometry.gross_roof_area_m2} m²
- Usable Roof Area: ${building.geometry.usable_roof_area_m2} m²
- Storage Capacity: ${(selectedPackage.storage_capacity_liters / 1000)} kL
- Allocated Roof Area: ${selectedPackage.allocated_roof_area_m2} m²

## 3. BILL OF QUANTITIES
${selectedPackage.boq.items.map(item => `- ${item.name}: ${item.quantity} ${item.unit} @ ₹${item.unit_rate_inr}/${item.unit} = ₹${item.subtotal_inr.toLocaleString('en-IN')} [Source: ${item.source}]`).join('\n')}

## 4. ENGINEERING CAVEAT
Results are engineering-model estimates based on the selected building inputs and historical weather data. Validate structural capacity, site conditions, and installation costs prior to contract award.
`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      showToast('Copied to Clipboard', 'Summary report copied as Markdown text.', 'success');
      setTimeout(() => setCopySuccess(false), 2500);
    }).catch(() => {
      showToast('Clipboard Error', 'Please allow clipboard permissions.', 'error');
    });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Assessment Report Document
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Official retrofit specification for stakeholders, civil contractors, and funding committees.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyMarkdown}
            className="btn btn-secondary"
            id="btn-copy-report"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            {copySuccess ? '✓ Copied Text' : 'Copy Text'}
          </button>
          <button
            onClick={handleExportJson}
            className="btn btn-secondary"
            id="btn-export-json"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            id="btn-print-report"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Official Report Document Paper */}
      <div className="report-paper" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        padding: '40px',
        boxShadow: 'var(--shadow-md)',
        color: '#18211D',
        lineHeight: 1.6
      }}>
        {/* Document Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '2px solid var(--border-default)',
          paddingBottom: '24px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: 'var(--green-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900
              }}>R</div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-primary)', letterSpacing: '-0.3px' }}>
                Roofwise
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                | Rooftop Retrofit Engineering Assessment
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 4px', color: '#18211D', letterSpacing: '-0.5px' }}>
              {building.name}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Location: {building.location.city} • Building Type: {building.building_type.toUpperCase()} • Daily Demand: {building.water_demand.total_non_potable_demand_liters_day.toLocaleString('en-IN')} L/day
            </p>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div><strong>Engine Core:</strong> v1.2.0 (Deterministic)</div>
            <div><strong>Run ID:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{simulation.run_id}</span></div>
            <div><strong>Generated:</strong> {timestamp}</div>
            <div><strong>Weather Profile:</strong> {rainfallYear.replace('_', ' ').toUpperCase()}</div>
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div style={{
          backgroundColor: '#F8FAF9',
          borderLeft: '4px solid var(--green-primary)',
          padding: '18px 20px',
          borderRadius: '4px',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: 'var(--green-primary)', marginBottom: '4px' }}>
            Executive Retrofit Recommendation
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#18211D', marginBottom: '8px' }}>
            {selectedPackage.name}
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#3E4D45' }}>
            {selectedPackage.description} Selected under balanced multi-objective criteria providing non-potable water coverage ({selectedPackage.water_summary.demand_coverage_percent.toFixed(1)}%) alongside significant envelope thermal flux reduction ({selectedPackage.heat_summary.modelled_reduction_percent.toFixed(1)}% reduction), remaining within the available capital budget constraint.
          </p>
        </div>

        {/* 1. Building Baseline & Geometric Specifications */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800, color: 'var(--green-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: '6px', marginBottom: '14px' }}>
            1. Building Geometry & Roof Allocation
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F8F9F7', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Gross Roof Area</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{building.geometry.gross_roof_area_m2} m²</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8F9F7', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Usable Treatment Area</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{building.geometry.usable_roof_area_m2} m²</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Catchment + Cool Coating</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8F9F7', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Existing Roof Assembly</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>150mm RCC + Bitumen</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>U: 3.12 W/m²·K | α: 0.85</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#F8F9F7', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Capital Budget Cap</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green-primary)' }}>
                {formatInr(building.constraints_and_budget.budget_cap_inr)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Modelled Physical Outcomes */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800, color: 'var(--green-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: '6px', marginBottom: '14px' }}>
            2. Dual Resilience Model Outcomes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Water Outcomes */}
            <div style={{ border: '1px solid #D0E4EC', borderRadius: '8px', padding: '18px', backgroundColor: '#F6FAFC' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--water-blue)', margin: '0 0 12px' }}>
                Water Balance Performance ({rainfallYear.replace('_', ' ')})
              </h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E1EDF2' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Storage Capacity Installed</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{formatKL(selectedPackage.storage_capacity_liters)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E1EDF2' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Annual Rainwater Captured</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{formatKL(selectedPackage.water_summary.total_captured_inflow_liters)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E1EDF2' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Annual Demand Coverage</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: 'var(--water-blue)' }}>
                      {selectedPackage.water_summary.demand_coverage_percent.toFixed(1)}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E1EDF2' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Annual Storage Overflow</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{formatKL(selectedPackage.water_summary.total_overflow_liters)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Empty Tank Days</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{selectedPackage.water_summary.empty_tank_days_count} days / yr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Thermal Outcomes */}
            <div style={{ border: '1px solid #D8E6DC', borderRadius: '8px', padding: '18px', backgroundColor: '#F5F9F6' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green-primary)', margin: '0 0 12px' }}>
                Envelope Thermal Model Performance
              </h3>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #E2EDE5' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Baseline Peak Absorbed Flux</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{selectedPackage.heat_summary.peak_absorbed_flux_baseline_w_m2.toFixed(1)} W/m²</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2EDE5' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Retrofit Peak Absorbed Flux</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: 'var(--green-primary)' }}>
                      {selectedPackage.heat_summary.peak_absorbed_flux_retrofit_w_m2.toFixed(1)} W/m²
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2EDE5' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Peak Heat Gain Reduction</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700, color: 'var(--green-primary)' }}>
                      -{selectedPackage.heat_summary.modelled_reduction_percent.toFixed(1)}%
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #E2EDE5' }}>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Assembly U-Value</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{selectedPackage.heat_summary.retrofit_u_value_w_m2k.toFixed(2)} W/m²·K</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-muted)' }}>Exterior Sol-Air Boundary Delta</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>{selectedPackage.heat_summary.sol_air_temperature_delta_celsius.toFixed(1)}°C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Itemized Cost Breakdown (Bill of Quantities) */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800, color: 'var(--green-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: '6px', marginBottom: '14px' }}>
            3. Itemized Bill of Quantities & Capital Expenditure
          </h2>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F6F7F4', borderBottom: '2px solid var(--border-default)' }}>
                <th style={{ padding: '10px 12px' }}>Item Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Unit</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Subtotal (INR)</th>
              </tr>
            </thead>
            <tbody>
              {selectedPackage.boq.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{item.quantity.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>{item.unit}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{item.unit_rate_inr.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{item.subtotal_inr.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#F8FAF9', fontWeight: 800, fontSize: '14px' }}>
                <td colSpan={4} style={{ padding: '12px', textAlign: 'right' }}>Total Estimated Project Cost:</td>
                <td style={{ padding: '12px', textAlign: 'right', color: 'var(--green-primary)' }}>
                  {formatInr(selectedPackage.boq.total_cost_inr)}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            * Budget Utilization: {((selectedPackage.boq.total_cost_inr / building.constraints_and_budget.budget_cap_inr) * 100).toFixed(1)}% of ₹{building.constraints_and_budget.budget_cap_inr.toLocaleString('en-IN')} available. Remaining surplus: ₹{(building.constraints_and_budget.budget_cap_inr - selectedPackage.boq.total_cost_inr).toLocaleString('en-IN')}.
          </div>
        </div>

        {/* 4. Multi-Objective Comparison Matrix */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 800, color: 'var(--green-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: '6px', marginBottom: '14px' }}>
            4. Comparative Evaluation of Alternatives
          </h2>
          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F6F7F4', borderBottom: '2px solid var(--border-default)' }}>
                <th style={{ padding: '8px 10px' }}>Package</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Upfront Cost</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Water Coverage</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Thermal Reduction</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Feasibility</th>
              </tr>
            </thead>
            <tbody>
              {simulation.packages.map((pkg) => {
                const isSelected = pkg.package_id === selectedPackage.package_id;
                return (
                  <tr key={pkg.package_id} style={{
                    borderBottom: '1px solid var(--border-default)',
                    backgroundColor: isSelected ? 'rgba(23, 107, 77, 0.05)' : 'transparent',
                    fontWeight: isSelected ? 700 : 400
                  }}>
                    <td style={{ padding: '8px 10px' }}>
                      {pkg.name} {isSelected && '(RECOMMENDED)'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatInr(pkg.boq.total_cost_inr)}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>{pkg.water_summary.demand_coverage_percent.toFixed(1)}%</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>-{pkg.heat_summary.modelled_reduction_percent.toFixed(1)}%</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      {pkg.is_feasible ? (
                        <span style={{ color: 'var(--green-primary)' }}>✓ Feasible</span>
                      ) : (
                        <span style={{ color: 'var(--danger-primary)' }}>✕ Excluded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Engineering Limitations & Sign-off Caveat */}
        <div style={{
          borderTop: '2px solid var(--border-default)',
          paddingTop: '20px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.5
        }}>
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#18211D', margin: '0 0 6px', textTransform: 'uppercase' }}>
            Engineering Limitations & Assurance Protocol
          </h4>
          <p style={{ margin: '0 0 6px' }}>
            This assessment is prepared using Roofwise Physical Engine v1.2.0 adhering to ASHRAE 90.1 steady-state 1D heat conduction and daily mass-conservation water balance. Modelled outputs depend on historical rainfall records from IMD Santacruz (2015–2020) and published building materials standards (IS 3792 / NBC 2016).
          </p>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)' }}>
            NOTICE: Results are engineering-model estimates based on the selected building inputs and weather data. Validate structural capacity, site plumbing conditions, and local supplier quotations prior to construction contract award.
          </p>
        </div>
      </div>
    </div>
  );
};
