import React from 'react';
import { 
  LayoutDashboard, 
  Sliders, 
  Scale, 
  BookOpenCheck, 
  FileText, 
  History, 
  ChevronRight
} from 'lucide-react';

export type Destination = 'overview' | 'assessment' | 'compare' | 'evidence' | 'reports' | 'history';

interface NavigationProps {
  currentDestination: Destination;
  onNavigate: (dest: Destination) => void;
  onNavigateToLanding?: () => void;
}

interface NavItem {
  id: Destination;
  label: string;
  icon: React.ElementType;
  idAttr: string;
}

const PRIMARY_NAV: NavItem[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, idAttr: 'nav-tab-overview' },
  { id: 'assessment', label: 'Building Inputs', icon: Sliders, idAttr: 'nav-tab-assessment' },
  { id: 'compare', label: 'Compare Packages', icon: Scale, idAttr: 'nav-tab-compare' },
];

const SECONDARY_NAV: NavItem[] = [
  { id: 'evidence', label: 'Evidence & Physics', icon: BookOpenCheck, idAttr: 'nav-tab-evidence' },
  { id: 'reports', label: 'Reports & BOQ', icon: FileText, idAttr: 'nav-tab-reports' },
  { id: 'history', label: 'Saved Runs', icon: History, idAttr: 'nav-tab-history' },
];

export const Navigation: React.FC<NavigationProps> = ({ 
  currentDestination, 
  onNavigate, 
  onNavigateToLanding: _onNavigateToLanding 
}) => {
  return (
    <aside 
      style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '56px',
        height: 'calc(100vh - 56px)',
        zIndex: 30,
        overflowY: 'auto'
      }}
      aria-label="Sidebar Navigation"
    >
      {/* Navigation Sections */}
      <div style={{ padding: '18px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Core Workbench */}
        <div>
          <div style={{
            padding: '0 10px 8px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Retrofit Engine
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {PRIMARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = currentDestination === item.id;
              return (
                <button
                  key={item.id}
                  id={item.idAttr}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--green-border)' : 'transparent',
                    background: isActive ? 'var(--green-light)' : 'transparent',
                    color: isActive ? 'var(--green-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 450,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.4 : 1.9} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ color: 'var(--green-primary)' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification & Analysis */}
        <div>
          <div style={{
            padding: '0 10px 8px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Scientific Evidence
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SECONDARY_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = currentDestination === item.id;
              return (
                <button
                  key={item.id}
                  id={item.idAttr}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--water-border)' : 'transparent',
                    background: isActive ? 'var(--water-light)' : 'transparent',
                    color: isActive ? 'var(--water-blue)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 450,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--bg-subtle)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.4 : 1.9} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ color: 'var(--water-blue)' }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-default)',
        background: 'rgba(9, 9, 11, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--green-primary)',
            boxShadow: '0 0 8px var(--green-primary)',
            display: 'inline-block'
          }} />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Deterministic Engine v1.2</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
          Calibrated to IS 15797 / NBC 2016 Part 8
        </div>
      </div>
    </aside>
  );
};
