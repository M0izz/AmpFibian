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
  onNavigateToHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  building,
  runId,
  onNavigateToAssessment,
  onNavigateToReports,
  onNavigateToLanding,
  onNavigateToHistory
}) => {
  return (
    <header style={{
      background: 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(14px) saturate(1.4)',
      borderBottom: '1px solid var(--border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        gap: '20px'
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
            gap: '10px',
            cursor: onNavigateToLanding ? 'pointer' : 'default',
            userSelect: 'none',
            flexShrink: 0
          }}
          title={onNavigateToLanding ? 'Back to Roofwise home' : 'Roofwise'}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '7px',
            background: 'var(--green-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-accent)'
          }}>
            <ShieldCheck size={16} strokeWidth={2.4} />
          </div>
          <span style={{
            fontSize: '0.98rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            Roofwise
          </span>
        </div>

        {/* Center: building context (breadcrumb style, truncates instead of wrapping) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: 0,
          flex: '1 1 auto',
          justifyContent: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <Building2 size={14} style={{ flexShrink: 0, color: 'var(--text-dim)' }} />
          <span style={{ whiteSpace: 'nowrap' }}>{building.location.city}</span>
          <span style={{ color: 'var(--text-dim)' }}>/</span>
          <span style={{
            color: 'var(--text-main)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0
          }} title={building.name}>
            {building.name}
          </span>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {runId && (
            <span
              title={`Immutable run snapshot ID: ${runId}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-code)',
                fontSize: '0.7rem',
                color: 'var(--text-dim)',
                marginRight: '4px'
              }}
            >
              <CheckCircle2 size={12} style={{ color: 'var(--green-primary)' }} />
              <span>{runId.length > 14 ? runId.slice(0, 14) + '…' : runId}</span>
            </span>
          )}
          <UserMenu onNavigateToHistory={onNavigateToHistory} />

          <button
            id="header-edit-assessment-btn"
            onClick={onNavigateToAssessment}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Sliders size={14} />
            <span>Edit assessment</span>
          </button>

          <button
            id="header-export-report-btn"
            onClick={onNavigateToReports}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <FileText size={14} />
            <span>Export report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
