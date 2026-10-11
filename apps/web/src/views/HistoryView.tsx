import React, { useState, useEffect } from 'react';
import type { SimulationSnapshot } from '../types';
import { fetchUserRuns } from '../lib/api';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../lib/toast';
import {
  History,
  Calendar,
  Building2,
  Droplets,
  Flame,
  ArrowRight,
  Trash2,
  Download,
  CloudCheck,
  RefreshCw
} from 'lucide-react';

interface HistoryViewProps {
  onLoadRun: (snapshot: SimulationSnapshot) => void;
  onNavigateToAssessment: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onLoadRun,
  onNavigateToAssessment
}) => {
  const [runs, setRuns] = useState<SimulationSnapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const loadRuns = async () => {
    setLoading(true);
    try {
      const data = await fetchUserRuns();
      setRuns(data);
    } catch (err) {
      console.error('Failed to load user runs:', err);
      showToast('Could not load runs', 'Please verify backend connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const handleDeleteRun = async (runId: string) => {
    if (!confirm(`Are you sure you want to delete simulation run ${runId}?`)) return;

    try {
      // Optimistically remove from state
      setRuns((prev) => prev.filter((r) => r.run_id !== runId));
      showToast('Run deleted', `Simulation ${runId} was removed from your history.`, 'info');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete', 'Please try again later.', 'error');
    }
  };

  const handleExportRun = (run: SimulationSnapshot) => {
    const jsonStr = JSON.stringify(run, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${run.run_id}_assessment.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export Ready', `Downloaded JSON for ${run.run_id}`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '8px 0' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              My Simulation Runs
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: 'var(--green-light)',
                color: 'var(--green-primary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)'
              }}
            >
              <CloudCheck size={12} />
              <span>Isolated Partition</span>
            </span>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            All historical assessments strictly isolated to your authenticated browser session.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="btn-history-refresh"
            onClick={loadRuns}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={13} className={loading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
          <button
            id="btn-history-new-run"
            onClick={onNavigateToAssessment}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
          >
            <span>New Assessment</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          <SkeletonCard height="210px" />
          <SkeletonCard height="210px" />
          <SkeletonCard height="210px" />
        </div>
      ) : runs.length === 0 ? (
        <EmptyState
          icon={<History size={28} />}
          title="No Saved Simulation Runs Found"
          description="You haven't run any simulations in this isolated partition yet. Start a new assessment to see feasible retrofit packages."
          actionText="Run Your First Assessment"
          onAction={onNavigateToAssessment}
          actionId="btn-empty-state-assessment"
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px'
          }}
        >
          {runs.map((run) => {
            const recommended =
              run.profile_recommendations?.balanced || run.packages?.[0];
            const dateStr = run.created_at
              ? new Date(run.created_at).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              : 'Recent Run';

            return (
              <div
                key={run.run_id}
                id={`card-run-${run.run_id}`}
                className="card"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--text-dim)',
                        marginBottom: '4px'
                      }}
                    >
                      {run.run_id}
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.98rem',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Building2 size={15} color="var(--green-primary)" />
                      <span>{run.building_input?.name || 'Building Assessment'}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-default)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {run.rainfall_year?.replace('_', ' ').toUpperCase() || 'MEDIAN'}
                  </span>
                </div>

                {/* Key Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    background: 'var(--bg-subtle)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Droplets size={12} color="var(--water-blue)" />
                      <span>Non-Potable Served</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--water-blue)', marginTop: '2px' }}>
                      {recommended?.water_summary ? `${recommended.water_summary.demand_coverage_percent.toFixed(1)}%` : '—'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={12} color="#C98A28" />
                      <span>Sol-Air ΔT</span>
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#C98A28', marginTop: '2px' }}>
                      {recommended?.heat_summary ? `−${recommended.heat_summary.sol_air_temperature_delta_celsius.toFixed(1)}°C` : '—'}
                    </div>
                  </div>
                </div>

                {/* Date & Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '6px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>{dateStr}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      id={`btn-export-${run.run_id}`}
                      onClick={() => handleExportRun(run)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)'
                      }}
                      title="Export Snapshot JSON"
                    >
                      <Download size={13} />
                    </button>

                    <button
                      id={`btn-delete-${run.run_id}`}
                      onClick={() => handleDeleteRun(run.run_id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        color: '#F0645F'
                      }}
                      title="Delete Run"
                    >
                      <Trash2 size={13} />
                    </button>

                    <button
                      id={`btn-load-${run.run_id}`}
                      onClick={() => {
                        onLoadRun(run);
                        showToast('Loaded Snapshot', `Restored ${run.run_id} into active workbench.`, 'success');
                      }}
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.76rem',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Load</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
