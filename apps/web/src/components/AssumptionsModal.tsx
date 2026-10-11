import React, { useState } from 'react';
import { X, Search, BookOpen } from 'lucide-react';

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSUMPTIONS_DATA = [
  { id: 'rwh_runoff_rcc_bare', val: '0.85 (0.80 - 0.90)', unit: 'dimensionless', source: 'CPWD Recharge Manual / IS 15797:2008 Table 1', confidence: 'High', usedBy: 'Water Model', status: 'Checked', notes: 'Concrete slab with smooth screed finish' },
  { id: 'rwh_runoff_cool_roof', val: '0.88 (0.85 - 0.92)', unit: 'dimensionless', source: 'CRRC Guidelines & Manufacturer Datasheet', confidence: 'Medium', usedBy: 'Water Model', status: 'Cross-checked', notes: 'Elastomeric film reduces surface micro-porosity' },
  { id: 'rwh_first_flush_depth', val: '1.5 (1.0 - 2.0)', unit: 'mm', source: 'IS 15797:2008 & WHO Rainwater Harvest Guide', confidence: 'High', usedBy: 'Water Model', status: 'Checked', notes: 'Diverted after prolonged dry intervals' },
  { id: 'rwh_filter_efficiency', val: '0.92 (0.88 - 0.95)', unit: 'dimensionless', source: 'SS Vortex Filter Lab Test Report', confidence: 'High', usedBy: 'Water Model', status: 'Checked', notes: 'Self-cleaning mesh filter capture rate' },
  { id: 'heat_rcc_thickness', val: '0.150 (0.125 - 0.175)', unit: 'm', source: 'Campus Structural Drawings / IS 456', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: '150mm reinforced concrete slab' },
  { id: 'heat_rcc_conductivity', val: '1.58 (1.40 - 1.75)', unit: 'W/m·K', source: 'IS 3792 / ECBC 2017 Table 4.1', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: 'Dense concrete (2400 kg/m³)' },
  { id: 'heat_brickbat_thickness', val: '0.050 (0.040 - 0.075)', unit: 'm', source: 'Architectural Spec (Brick-bat coba slope)', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: 'Terrace waterproofing & weathering course' },
  { id: 'heat_brickbat_conductivity', val: '0.81 (0.70 - 0.90)', unit: 'W/m·K', source: 'SP 41 Handbook of Functional Requirements', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: 'Lime/cement brick-bat mortar' },
  { id: 'heat_xps_thickness', val: '0.050 (0.025 - 0.075)', unit: 'm', source: 'Maha PWD SSR Item 22.45 Spec', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: '50mm Extruded Polystyrene Board' },
  { id: 'heat_xps_conductivity', val: '0.034 (0.030 - 0.038)', unit: 'W/m·K', source: 'Manufacturer Technical Datasheet (Supreme/Owens)', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: 'Thermal insulation conductivity' },
  { id: 'heat_coating_reflectance_aged', val: '0.70 (0.65 - 0.75)', unit: 'dimensionless', source: '3-Year Weathering Study (BEE / CRRC)', confidence: 'Medium', usedBy: 'Heat Model', status: 'Checked', notes: 'Accounts for coastal monsoon dust and soiling' },
  { id: 'heat_baseline_absorptance', val: '0.75 (0.70 - 0.80)', unit: 'dimensionless', source: 'Empirical Field Measurement (Weathered terrace)', confidence: 'High', usedBy: 'Heat Model', status: 'Checked', notes: 'Dark weathered cement/brick finish' },
  { id: 'cost_cool_roof_per_m2', val: '185 (150 - 220)', unit: 'INR / m²', source: 'Maha PWD SSR 2023-24 Item 14.12', confidence: 'High', usedBy: 'Costs', status: 'Checked', notes: 'Includes primer + 2 coats high-SRI coating' },
  { id: 'cost_storage_tank_per_l', val: '6.5 (5.5 - 7.5)', unit: 'INR / Liter', source: 'Commercial Distributor Quotation (Sintex/Vectus)', confidence: 'High', usedBy: 'Costs', status: 'Checked', notes: 'Food-grade HDPE tank array installed on PCC pad' }
];

export const AssumptionsModal: React.FC<AssumptionsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = ASSUMPTIONS_DATA.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.usedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '950px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Evidence & Assumptions Register
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Every parameter carries provenance metadata, confidence level, and source citations (Appendix A)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Search parameter, source citation, or model..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px 8px 36px',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.7)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '10px 12px' }}>Parameter ID</th>
                <th style={{ padding: '10px 12px' }}>Value / Range</th>
                <th style={{ padding: '10px 12px' }}>Unit</th>
                <th style={{ padding: '10px 12px' }}>Source Reference</th>
                <th style={{ padding: '10px 12px' }}>Confidence</th>
                <th style={{ padding: '10px 12px' }}>Used By</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontWeight: 600 }}>
                    {item.id}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: '#4FA3D9' }}>
                    {item.val}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                    {item.unit}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                    {item.source}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className={`mono-badge ${item.confidence === 'High' ? 'badge-emerald' : 'badge-amber'}`}>
                      {item.confidence}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                    {item.usedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
            Close Register
          </button>
        </div>
      </div>
    </div>
  );
};
