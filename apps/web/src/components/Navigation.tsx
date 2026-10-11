import React from 'react';
import { LayoutDashboard, Sliders, Scale, BookOpenCheck, FileText } from 'lucide-react';

export type Destination = 'overview' | 'assessment' | 'compare' | 'evidence' | 'reports';

interface NavigationProps {
  currentDestination: Destination;
  onNavigate: (dest: Destination) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentDestination, onNavigate }) => {
  const tabs = [
    { id: 'overview' as Destination, label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'assessment' as Destination, label: 'Assessment', icon: <Sliders size={16} /> },
    { id: 'compare' as Destination, label: 'Compare Options', icon: <Scale size={16} /> },
    { id: 'evidence' as Destination, label: 'Evidence & Models', icon: <BookOpenCheck size={16} /> },
    { id: 'reports' as Destination, label: 'Reports', icon: <FileText size={16} /> },
  ];

  return (
    <nav style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-default)',
      marginBottom: '20px'
    }}>
      <div className="container" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const isActive = currentDestination === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`nav-tab ${isActive ? 'active' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
