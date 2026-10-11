import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, Box } from 'lucide-react';
import type { BuildingGeometry, BuildingConstraints } from '../types';

interface RoofAllocationViewProps {
  geometry: BuildingGeometry;
  constraints: BuildingConstraints;
  selectedTankCapacityLiters: number;
  hasCoolRoof: boolean;
}

export const RoofAllocationView: React.FC<RoofAllocationViewProps> = ({
  geometry,
  constraints,
  selectedTankCapacityLiters,
  hasCoolRoof
}) => {
  const grossArea = geometry.gross_roof_area_m2;
  const accessArea = geometry.clear_access_corridors_m2;
  const usableArea = geometry.usable_roof_area_m2;

  // Ground tank area required based on capacity
  let tankFootprintM2 = 0;
  if (selectedTankCapacityLiters >= 80000) tankFootprintM2 = 35.0;
  else if (selectedTankCapacityLiters >= 60000) tankFootprintM2 = 26.0;
  else if (selectedTankCapacityLiters >= 40000) tankFootprintM2 = 18.0;
  else if (selectedTankCapacityLiters >= 20000) tankFootprintM2 = 10.0;

  const accessPercent = Math.round((accessArea / grossArea) * 100);
  const usablePercent = Math.round((usableArea / grossArea) * 100);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <Layers size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Constrained Roof Surface & Site Allocation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Area partitioning distinguishes exclusive occupancies from compatible overlays and off-roof storage
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="mono-badge badge-cyan">
            Gross: {grossArea} m²
          </span>
          <span className="mono-badge badge-emerald">
            Usable: {usableArea} m² ({usablePercent}%)
          </span>
          <span className="mono-badge" style={{ color: '#E5A23A' }}>
            Parapets/HVAC: {accessArea} m² ({accessPercent}%)
          </span>
        </div>
      </div>

      {/* Visual Allocation Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          height: '28px',
          width: '100%',
          background: 'rgba(30, 41, 59, 0.6)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          display: 'flex',
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Usable Catchment & Cool Roof Overlay */}
          <div style={{
            width: `${usablePercent}%`,
            background: hasCoolRoof
              ? 'linear-gradient(90deg, #3A8CC0 0%, #4FA3D9 100%)'
              : '#334155',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            transition: 'all 0.3s ease'
          }}>
            {hasCoolRoof ? `Usable Surface (${usableArea} m²): Cool Roof + Active RWH Catchment` : `Usable Roof Catchment (${usableArea} m²)`}
          </div>

          {/* Access Corridors */}
          <div style={{
            width: `${accessPercent}%`,
            background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 8px, #334155 8px, #334155 16px)',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 500
          }}>
            Clear Access ({accessArea} m²)
          </div>
        </div>
      </div>

      {/* Surface Logic Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        fontSize: '0.82rem'
      }}>
        {/* Card 1: Compatible Overlay Logic */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.35)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4FA3D9', fontWeight: 600, marginBottom: '6px' }}>
            <CheckCircle2 size={15} />
            <span>Compatible Overlay (Zero Area Penalty)</span>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
            High-albedo elastomeric coating is applied directly over the terrace slab. It does <strong style={{ color: 'var(--text-main)' }}>not</strong> steal catchment area. Instead, it seals concrete micro-porosity, raising runoff efficiency from 0.85 to 0.88.
          </p>
        </div>

        {/* Card 2: Off-Roof Ground Storage */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.35)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3ECF8E', fontWeight: 600, marginBottom: '6px' }}>
            <Box size={15} />
            <span>Ground Yard Storage Footprint</span>
          </div>
          <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Storage tank arrays are mounted in the utility ground yard (
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{tankFootprintM2} m² required</span> of{' '}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>{constraints.ground_yard_available_for_tanks_m2} m² available</span>).
            <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#3ECF8E' }}>
              ✓ Zero dead-load penalty on roof slab.
            </div>
          </div>
        </div>

        {/* Card 3: Structural Load Guard */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.35)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E5A23A', fontWeight: 600, marginBottom: '6px' }}>
            <AlertTriangle size={15} />
            <span>Structural Dead-Load Safeguard</span>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Allowable roof added dead-load is capped at{' '}
            <strong style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>{constraints.max_allowable_roof_deadload_kg_m2} kg/m²</strong>.
            Heavy green roof trays (260 kg/m²) are hard-rejected without certified structural engineer audit.
          </p>
        </div>
      </div>
    </div>
  );
};
