import React from 'react';
import { LayoutDashboard, Sliders, Scale, BookOpenCheck, FileText, History } from 'lucide-react';

export type Destination = 'overview' | 'assessment' | 'compare' | 'evidence' | 'reports' | 'history';

interface NavigationProps {
  currentDestination: Destination;
  onNavigate: (dest: Destination) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentDestination, onNavigate }) => {
  const tabs = [
    { id: 'overview' as Destination, label: 'Overview', icon: <LayoutDashboard size={16} />, idAttr: 'nav-tab-overview' },
    { id: 'assessment' as Destination, label: 'Assessment', icon: <Sliders size={16} />, idAttr: 'nav-tab-assessment' },
    { id: 'compare' as Destination, label: 'Compare Options', icon: <Scale size={16} />, idAttr: 'nav-tab-compare' },
    { id: 'evidence' as Destination, label: 'Evidence & Models', icon: <BookOpenCheck size={16} />, idAttr: 'nav-tab-evidence' },
    { id: 'reports' as Destination, label: 'Reports', icon: <FileText size={16} />, idAttr: 'nav-tab-reports' },
    { id: 'history' as Destination, label: 'My Runs', icon: <History size={16} />, idAttr: 'nav-tab-history' },
  ];

  return (
    <>
      {/* Desktop & Tablet Navigation */}
      <nav
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          marginBottom: '20px'
        }}
        aria-label="Main Application Navigation"
      >
        <div className="container nav-desktop-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {tabs.map((tab) => {
            const isActive = currentDestination === tab.id;
            return (
              <button
                key={tab.id}
                id={tab.idAttr}
                onClick={() => onNavigate(tab.id)}
                className={`nav-tab nav-tab-link ${isActive ? 'active' : ''}`}
                role="tab"
                aria-selected={isActive}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Pillar 3 at <= 640px) */}
      <div className="nav-mobile-bottom-bar" role="navigation" aria-label="Mobile Navigation">
        {tabs.map((tab) => {
          const isActive = currentDestination === tab.id;
          return (
            <button
              key={`mob_${tab.id}`}
              id={`mob_${tab.idAttr}`}
              onClick={() => onNavigate(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                color: isActive ? 'var(--green-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.68rem',
                cursor: 'pointer',
                padding: '4px 6px',
                flex: 1
              }}
            >
              {tab.icon}
              <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
