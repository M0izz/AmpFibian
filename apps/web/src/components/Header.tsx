import React from 'react';
import { ShieldCheck, CheckCircle2, Sliders, FileText, Building2 } from 'lucide-react';
import type { BuildingProfile } from '../types';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  building: BuildingProfile;
  runId: string;
  onNavigateToAssessment: () => void;
  onNavigateToReports: () => void;
  onNavigateToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  building,
  runId,
  onNavigateToAssessment,
  onNavigateToReports,
  onNavigateToLanding
}) => {
  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        gap: '16px'
      }}>
        {/* Brand */}
        <div
          id="header-brand-home-btn"
          role="button"
          tabIndex={0}
          onClick={onNavigateToLanding}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateToLanding?.(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: onNavigateToLanding ? 'pointer' : 'default',
            userSelect: 'none'
          }}
          title={onNavigateToLanding ? "Back to Roofwise Landing Page" : "Roofwise"}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--green-primary)'
          }}>
            <ShieldCheck size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em'
              }}>
                Roofwise
              </span>
              <span className="badge badge-green badge-mono" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                v1.2
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>
              Evidence-backed roof retrofit planning
            </div>
          </div>
        </div>

        {/* Center: Active Building Context Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-subtle)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-default)',
          fontSize: '0.8rem'
        }}>
          <Building2 size={14} color="var(--green-primary)" />
          <span style={{ color: 'var(--text-muted)' }}>Assessing:</span>
          <strong style={{ color: 'var(--text-main)' }}>{building.name}</strong>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>{building.location.city}</span>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {runId && (
            <div className="badge badge-green badge-mono" title="Immutable run snapshot ID">
              <CheckCircle2 size={12} />
              <span>{runId}</span>
            </div>
          )}
          <UserMenu />

          <button
            id="header-edit-assessment-btn"
            onClick={onNavigateToAssessment}
            className="btn btn-secondary"
            style={{ fontSize: '0.81rem', padding: '6px 12px' }}
          >
            <Sliders size={14} />
            <span>Edit Assessment</span>
          </button>

          <button
            id="header-export-report-btn"
            onClick={onNavigateToReports}
            className="btn btn-primary"
            style={{ fontSize: '0.81rem', padding: '6px 14px' }}
          >
            <FileText size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
