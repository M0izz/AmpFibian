import React, { useState, useEffect } from 'react';
import type { BuildingProfile, RetrofitPackage, SimulationSnapshot } from './types';
import { DEFAULT_MUMBAI_HOSTEL, runSimulation } from './lib/api';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { Destination } from './components/Navigation';
import { BuildingContextBar } from './components/BuildingContextBar';
import { OverviewView } from './views/OverviewView';
import { AssessmentView } from './views/AssessmentView';
import { CompareOptionsView } from './views/CompareOptionsView';
import { EvidenceModelsView } from './views/EvidenceModelsView';
import { ReportsView } from './views/ReportsView';
import { HistoryView } from './views/HistoryView';
import { ToastProvider } from './lib/toast';
import { ToastContainer } from './components/Toast';

interface AppProps {
  initialDestination?: Destination;
  onNavigateToLanding?: () => void;
}

const AppContent: React.FC<AppProps> = ({ initialDestination, onNavigateToLanding }) => {
  const [building, setBuilding] = useState<BuildingProfile>(DEFAULT_MUMBAI_HOSTEL);
  const [rainfallYear, setRainfallYear] = useState<string>('2020_median');
  const [simulation, setSimulation] = useState<SimulationSnapshot | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<RetrofitPackage | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentDestination, setCurrentDestination] = useState<Destination>(initialDestination || 'overview');

  // Trigger simulation on building or rainfall year change
  useEffect(() => {
    let isMounted = true;
    setIsSimulating(true);

    runSimulation(building, rainfallYear)
      .then(res => {
        if (!isMounted) return;
        setSimulation(res);
        // Default to recommended balanced package, or first available
        const recommended = res.profile_recommendations?.balanced || res.packages[0];
        setSelectedPackage(recommended);
        setIsSimulating(false);
      })
      .catch(err => {
        console.error("Simulation run error:", err);
        setIsSimulating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [building, rainfallYear]);

  const activePackage = selectedPackage || (simulation ? (simulation.profile_recommendations?.balanced || simulation.packages[0]) : null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <ToastContainer />

      {/* 1. Persistent Application Header */}
      <Header
        building={building}
        runId={simulation ? simulation.run_id : ''}
        onNavigateToAssessment={() => setCurrentDestination('assessment')}
        onNavigateToReports={() => setCurrentDestination('reports')}
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToHistory={() => setCurrentDestination('history')}
      />

      {/* 2. Primary Navigation Bar */}
      <Navigation
        currentDestination={currentDestination}
        onNavigate={(dest) => setCurrentDestination(dest)}
      />

      {/* 3. Main Content Container */}
      <main className="container" style={{ flex: 1, paddingBottom: '56px' }}>
        {/* Context bar visible on relevant views */}
        {currentDestination !== 'assessment' && currentDestination !== 'reports' && currentDestination !== 'history' && (
          <BuildingContextBar
            building={building}
            rainfallYear={rainfallYear}
            onSelectRainfallYear={(year) => setRainfallYear(year)}
          />
        )}

        {currentDestination === 'history' ? (
          <HistoryView
            onLoadRun={(snap) => {
              if (snap.building_input) setBuilding(snap.building_input);
              setSimulation(snap);
              const rec = snap.profile_recommendations?.balanced || snap.packages?.[0];
              setSelectedPackage(rec);
              setCurrentDestination('overview');
            }}
            onNavigateToAssessment={() => setCurrentDestination('assessment')}
          />
        ) : isSimulating && !simulation ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '420px',
            gap: '16px',
            color: 'var(--text-muted)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--green-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              Running deterministic engineering simulation...
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Executing 365-day water balance & 1D envelope conduction models
            </div>
          </div>
        ) : simulation && activePackage ? (
          <>
            {currentDestination === 'overview' && (
              <OverviewView
                simulation={simulation}
                building={building}
                onNavigateToCompare={() => setCurrentDestination('compare')}
                onNavigateToReports={() => setCurrentDestination('reports')}
                onSelectPackageForDetail={(pkg) => {
                  setSelectedPackage(pkg);
                  setCurrentDestination('compare');
                }}
              />
            )}

            {currentDestination === 'assessment' && (
              <AssessmentView
                building={building}
                onSaveAndRun={(updated) => {
                  setBuilding(updated);
                  setCurrentDestination('overview');
                }}
                isSimulating={isSimulating}
              />
            )}

            {currentDestination === 'compare' && (
              <CompareOptionsView
                simulation={simulation}
                building={building}
                selectedPackage={activePackage}
                onSelectPackage={(pkg) => setSelectedPackage(pkg)}
              />
            )}

            {currentDestination === 'evidence' && (
              <EvidenceModelsView
                simulation={simulation}
                building={building}
                selectedPackage={activePackage}
              />
            )}

            {currentDestination === 'reports' && (
              <ReportsView
                building={building}
                simulation={simulation}
                selectedPackage={activePackage}
                rainfallYear={rainfallYear}
              />
            )}
          </>
        ) : (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            No assessment data available. Check local calculation engine status.
          </div>
        )}
      </main>

      {/* 4. Professional Engineering Footer */}
      <footer className="no-print" style={{
        borderTop: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        padding: '20px 0',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>Roofwise</strong>
            <span style={{ color: 'var(--text-dim)' }}>—</span>
            <span>Make every rooftop work smarter. Evidence-backed roof retrofit planning.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
            <span>Engine: v1.2.0 (Deterministic)</span>
            <span>Standards: IS 15797 / IS 3792 / NBC 2016</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC<AppProps> = (props) => {
  return (
    <ToastProvider>
      <AppContent {...props} />
    </ToastProvider>
  );
};

export default App;
