import React from 'react';
import { X, Database, Cloud } from 'lucide-react';

interface ProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProvenanceModal: React.FC<ProvenanceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
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
            <Database size={22} color="var(--accent-emerald)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Data Sources & AWS Architecture Provenance
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Verifiable citations and cloud persistence architecture
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

        {/* Content */}
        <div style={{ fontSize: '0.82rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
          {/* Section 1: AWS Deployment Architecture */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3ECF8E', fontWeight: 600, marginBottom: '8px' }}>
              <Cloud size={16} />
              <span>Real AWS Cloud Integration</span>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Amazon DynamoDB: </strong>
                Persists immutable simulation run snapshots (`run_id`, `engine_version`, `building_hash`, `inputs_snapshot`, `results_snapshot`). Zero data loss on session reset.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>AWS App Runner / ECS: </strong>
                Hosts the containerized FastAPI Python deterministic calculation engine with automatic health checks (`GET /health`).
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>AWS S3 & CloudFront: </strong>
                Distributes the production React + Vite single-page application globally with sub-second latency.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Secret Hygiene: </strong>
                Zero credentials in source control; runtime configuration loaded strictly through environment variables.
              </li>
            </ul>
          </div>

          {/* Section 2: Data Sources Citations */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '18px'
          }}>
            <div style={{ fontWeight: 600, color: '#4FA3D9', marginBottom: '8px' }}>
              Primary Verified Datasets & Standards
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Daily Rainfall: </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  IMD Gridded 0.25° Series cross-validated against Mumbai Santacruz Airport station (Dry 2015, Median 2020, Wet 2019).
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Schedule of Rates: </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Maharashtra PWD SSR 2023-2024 (Item 14.12 reflective coatings & Item 22.45 over-deck XPS insulation).
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-main)' }}>RWH Standards: </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  IS 15797:2008 (Roof Top Rainwater Harvesting) & CPWD Artificial Recharge Manual Table 1.
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Thermal Envelope: </strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  IS 3792, ECBC 2017, and Cool Roof Rating Council (CRRC) aged reflectance metrics.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
