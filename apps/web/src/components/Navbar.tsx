import React from 'react';
import { ShieldCheck, BookOpen, FileText, Database, Cloud } from 'lucide-react';

interface NavbarProps {
  onOpenAssumptions: () => void;
  onOpenReport: () => void;
  onOpenProvenance: () => void;
  activeBuildingName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAssumptions,
  onOpenReport,
  onOpenProvenance,
  activeBuildingName
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--accent-cyan-glow)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #f8fafc, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AmpFibian
              </span>
              <span className="mono-badge badge-cyan" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                RoofLab v1.0
              </span>
              <span className="mono-badge" style={{ fontSize: '0.68rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <Cloud size={11} style={{ marginRight: '3px' }} /> AWS Powered
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', letterSpacing: '0.01em' }}>
              Constrained Roof-Retrofit Decision Engine
            </div>
          </div>
        </div>

        {/* Building Context Tag */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.4)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.81rem'
        }} className="md-flex">
          <span style={{ color: 'var(--text-dim)' }}>Scenario Context:</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{activeBuildingName}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenAssumptions}
            className="btn btn-outline"
            style={{ fontSize: '0.81rem', padding: '6px 12px' }}
            title="View full evidence and assumptions register"
          >
            <BookOpen size={15} color="var(--accent-cyan)" />
            <span>Assumptions Register</span>
          </button>

          <button
            onClick={onOpenProvenance}
            className="btn btn-outline"
            style={{ fontSize: '0.81rem', padding: '6px 12px' }}
            title="View data sources and AWS persistence configuration"
          >
            <Database size={15} color="var(--accent-emerald)" />
            <span>Data Provenance</span>
          </button>

          <button
            onClick={onOpenReport}
            className="btn btn-primary"
            style={{ fontSize: '0.81rem', padding: '6px 14px' }}
          >
            <FileText size={15} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
