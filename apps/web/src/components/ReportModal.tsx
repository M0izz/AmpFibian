import React from 'react';
import { X, Printer, Copy, Check, FileText, ShieldCheck } from 'lucide-react';
import type { RetrofitPackage, BuildingProfile } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: RetrofitPackage;
  building: BuildingProfile;
  runId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  building,
  runId
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const reportText = `CLIMATEFIT ROOFLAB (AMPFIBIAN) — RETROFIT ASSESSMENT REPORT
Run ID: ${runId} | Engine Version: 1.0.0
Date: ${new Date().toLocaleDateString()}

BUILDING: ${building.name} (${building.location.city})
Gross Roof: ${building.geometry.gross_roof_area_m2} m² | Usable Catchment: ${building.geometry.usable_roof_area_m2} m²
Daily Non-Potable Demand: ${building.water_demand.total_non_potable_demand_liters_day} L/day
Budget Cap: ₹${building.constraints_and_budget.budget_cap_inr.toLocaleString()}

RECOMMENDED PACKAGE: ${selectedPackage.name}
Capital Upfront Cost: ₹${selectedPackage.boq.total_cost_inr.toLocaleString()} (Variance: ₹${selectedPackage.boq.budget_variance_inr.toLocaleString()})
Annual Water Reliability: ${selectedPackage.water_summary.demand_coverage_percent}% (${(selectedPackage.water_summary.total_served_demand_liters/1000000).toFixed(2)}M Liters supplied)
Peak Conductive Heat Gain Reduction: -${selectedPackage.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW (${selectedPackage.heat_summary.modelled_reduction_percent}% cut)
Sol-Air Temperature Delta: -${selectedPackage.heat_summary.sol_air_temperature_delta_celsius}°C

PRE/POST MEASUREMENT PROTOCOL:
1. Contact thermocouples on roof underside & top-floor ceiling.
2. Shaded indoor air temperature & humidity data loggers.
3. Pulse inline water meter on pump header discharge.
4. Hydrostatic pressure sensor for tank water level.
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
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
            <FileText size={22} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Roof-Retrofit Assessment Report
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Run ID: {runId} | Engine v1.0.0 (Deterministic)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleCopy} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
              {copied ? <Check size={14} color="#3ECF8E" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button onClick={handlePrint} className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
              <Printer size={14} />
              <span>Print Specification</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', marginLeft: '8px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          {/* Building Metadata Box */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              1. Building Assessment Profile
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
              <div>Building: <strong>{building.name}</strong></div>
              <div>Location: <strong>{building.location.city} ({building.location.neighborhood})</strong></div>
              <div>Gross Roof: <strong>{building.geometry.gross_roof_area_m2} m²</strong> (Usable: <strong>{building.geometry.usable_roof_area_m2} m²</strong>)</div>
              <div>Top-Floor Ceiling Area: <strong>{building.geometry.top_floor_exposed_ceiling_area_m2} m² ({building.geometry.top_floor_rooms_count} rooms)</strong></div>
              <div>Daily Non-Potable Demand: <strong>{building.water_demand.total_non_potable_demand_liters_day.toLocaleString()} L/day</strong></div>
              <div>Available Budget: <strong style={{ color: '#E5A23A' }}>₹{building.constraints_and_budget.budget_cap_inr.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* Selected Retrofit Specification */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 600, color: '#4FA3D9' }}>
                2. Selected Retrofit Package: {selectedPackage.name}
              </div>
              <span className="mono-badge badge-cyan">{selectedPackage.profile_type.toUpperCase()} PROFILE</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
              {selectedPackage.description}
            </p>

            {/* BOQ Table */}
            <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Item</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Subtotal (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPackage.boq.items.map(item => (
                    <tr key={item.intervention_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 500 }}>{item.name}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{item.quantity} {item.unit}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>₹{item.unit_rate_inr.toLocaleString()}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-main)' }}>
                        ₹{item.subtotal_inr.toLocaleString()}
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-dim)', fontSize: '0.7rem' }}>{item.source}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'rgba(30, 41, 59, 0.6)', fontWeight: 700 }}>
                    <td style={{ padding: '8px 10px' }}>Total Upfront Capital</td>
                    <td colSpan={2}></td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#4FA3D9' }}>
                      ₹{selectedPackage.boq.total_cost_inr.toLocaleString()}
                    </td>
                    <td style={{ padding: '8px 10px', color: '#3ECF8E', fontSize: '0.72rem' }}>
                      Within ₹{selectedPackage.boq.budget_cap_inr.toLocaleString()} budget
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Modelled Performance Metrics */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px'
          }}>
            <div style={{ fontWeight: 600, color: '#3ECF8E', marginBottom: '8px' }}>
              3. Modelled Resilience Outputs
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
              <div>Water Reliability: <strong>{selectedPackage.water_summary.demand_coverage_percent}% coverage</strong></div>
              <div>Annual Rainwater Supplied: <strong>{(selectedPackage.water_summary.total_served_demand_liters/1000000).toFixed(2)}M Liters</strong></div>
              <div>Peak Conductive Heat-Gain Cut: <strong>-{selectedPackage.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW (-{selectedPackage.heat_summary.modelled_reduction_percent}%)</strong></div>
              <div>Peak Sol-Air Delta: <strong>-{selectedPackage.heat_summary.sol_air_temperature_delta_celsius}°C</strong></div>
            </div>
          </div>

          {/* Measurement Protocol */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '16px',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3ECF8E', fontWeight: 600, marginBottom: '6px' }}>
              <ShieldCheck size={16} />
              <span>4. On-Site Measurement & Verification Protocol</span>
            </div>
            <ol style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.5' }}>
              <li><strong>Surface Temperature Logging:</strong> Install calibrated Type T surface thermocouples on the roof exterior and top-floor interior ceiling slab before and after coating.</li>
              <li><strong>Indoor Thermal Comfort:</strong> Deploy shaded air temperature and relative humidity data loggers in top-floor student dormitories.</li>
              <li><strong>Rainwater Consumption Meter:</strong> Install an inline pulse water meter on the booster pump line feeding the toilet flushing cisterns.</li>
              <li><strong>Storage Level Monitoring:</strong> Submersible hydrostatic pressure sensor to continuously log daily storage, drawdown, and spill overflow frequency.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
