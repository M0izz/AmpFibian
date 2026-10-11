import React, { useState } from 'react';
import { Target } from 'lucide-react';
import type { RetrofitPackage } from '../types';

interface ParetoChartProps {
  packages: RetrofitPackage[];
  selectedPackageId: string;
  onSelectPackage: (pkg: RetrofitPackage) => void;
  budgetCapInr: number;
}

export const ParetoChart: React.FC<ParetoChartProps> = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  budgetCapInr
}) => {
  const [hoveredPkg, setHoveredPkg] = useState<RetrofitPackage | null>(null);

  // SVG dimensions
  const width = 640;
  const height = 300;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Scales
  const maxCost = 1400000; // 14 Lakhs
  const maxWater = 100;

  const getX = (cost: number) => padLeft + (cost / maxCost) * chartW;
  const getY = (water: number) => padTop + chartH - (water / maxWater) * chartH;

  const budgetX = getX(budgetCapInr);

  // Sort feasible non-dominated packages by cost for the frontier line
  const frontierPkgs = packages
    .filter(p => p.is_feasible && p.is_pareto_optimal)
    .sort((a, b) => a.boq.total_cost_inr - b.boq.total_cost_inr);

  const frontierPath = frontierPkgs.reduce((acc, p, idx) => {
    const x = getX(p.boq.total_cost_inr);
    const y = getY(p.water_summary.demand_coverage_percent);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
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
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a78bfa'
          }}>
            <Target size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Pareto Non-Dominated Frontier & Feasibility Screening
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Multi-objective optimization removes dominated alternatives and enforces hard feasibility constraints
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4FA3D9' }}></span>
            <span>Balanced Knee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3ECF8E' }}></span>
            <span>Non-Dominated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F0645F', border: '1px solid #fff' }}></span>
            <span>Infeasible (Hard-Filtered)</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflowX: 'auto',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '10px'
      }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(val => (
            <g key={`y-${val}`}>
              <line
                x1={padLeft}
                y1={getY(val)}
                x2={width - padRight}
                y2={getY(val)}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 8}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--text-dim)"
              >
                {val}%
              </text>
            </g>
          ))}

          {[0, 400000, 800000, 1200000].map(val => (
            <g key={`x-${val}`}>
              <line
                x1={getX(val)}
                y1={padTop}
                x2={getX(val)}
                y2={padTop + chartH}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={getX(val)}
                y={padTop + chartH + 18}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--text-dim)"
              >
                ₹{val / 100000}L
              </text>
            </g>
          ))}

          {/* Budget Cap Hard-Filter Threshold Line */}
          <line
            x1={budgetX}
            y1={padTop}
            x2={budgetX}
            y2={padTop + chartH}
            stroke="#E5A23A"
            strokeWidth="1.5"
            strokeDasharray="5 3"
          />
          <text
            x={budgetX + 6}
            y={padTop + 16}
            fontSize="10"
            fontFamily="var(--font-mono)"
            fill="#E5A23A"
            fontWeight="bold"
          >
            Budget Cap (₹8 Lakhs)
          </text>

          {/* Pareto Frontier Curve */}
          {frontierPath && (
            <path
              d={frontierPath}
              fill="none"
              stroke="#4FA3D9"
              strokeWidth="2.5"
              strokeOpacity="0.75"
              strokeDasharray="4 2"
            />
          )}

          {/* Packages Points */}
          {packages.map(p => {
            const cx = getX(p.boq.total_cost_inr);
            const cy = getY(p.water_summary.demand_coverage_percent);
            const isSelected = selectedPackageId === p.package_id;
            const isKnee = p.profile_type === 'balanced';

            let fillColor = '#64748b';
            let strokeColor = 'rgba(255, 255, 255, 0.4)';
            let r = 7;

            if (!p.is_feasible) {
              fillColor = '#F0645F';
              strokeColor = '#ffffff';
              r = 6;
            } else if (isKnee) {
              fillColor = '#4FA3D9';
              strokeColor = '#4FA3D9';
              r = 10;
            } else if (p.profile_type === 'heat_first') {
              fillColor = '#E5A23A';
              strokeColor = '#E5A23A';
              r = 8;
            } else if (p.profile_type === 'water_first') {
              fillColor = '#3ECF8E';
              strokeColor = '#3ECF8E';
              r = 8;
            } else if (p.is_pareto_optimal) {
              fillColor = '#3b82f6';
              r = 7;
            }

            return (
              <g
                key={p.package_id}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectPackage(p)}
                onMouseEnter={() => setHoveredPkg(p)}
                onMouseLeave={() => setHoveredPkg(null)}
              >
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r + 6}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padLeft + chartW / 2}
            y={height - 6}
            textAnchor="middle"
            fontSize="11"
            fontWeight="500"
            fill="var(--text-muted)"
          >
            Upfront Capital Cost (₹ INR)
          </text>
          <text
            x={16}
            y={padTop + chartH / 2}
            textAnchor="middle"
            transform={`rotate(-90 16 ${padTop + chartH / 2})`}
            fontSize="11"
            fontWeight="500"
            fill="var(--text-muted)"
          >
            Water Reliability (% Coverage)
          </text>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPkg && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--border-medium)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            pointerEvents: 'none',
            maxWidth: '320px',
            fontSize: '0.8rem',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              {hoveredPkg.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: 'var(--text-muted)' }}>
              <span>Cost:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                ₹{hoveredPkg.boq.total_cost_inr.toLocaleString()}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: 'var(--text-muted)' }}>
              <span>Water Reliability:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#3ECF8E' }}>
                {hoveredPkg.water_summary.demand_coverage_percent}%
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: 'var(--text-muted)' }}>
              <span>Heat Reduction:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#4FA3D9' }}>
                {hoveredPkg.heat_summary.top_floor_peak_conductive_heat_reduction_kw} kW
              </strong>
            </div>
            {!hoveredPkg.is_feasible && (
              <div style={{ color: '#F0645F', marginTop: '6px', fontSize: '0.75rem' }}>
                ✗ {hoveredPkg.feasibility_reasons[0]}
              </div>
            )}
          </div>
        )}
      </div>

      {/* "Why Not?" Feasibility & Rejection Audit Table */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px' }}>
          Feasibility Screening & Rejection Audit ("Why Not?")
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '12px'
        }}>
          {packages.filter(p => !p.is_feasible || !p.is_pareto_optimal).map(p => (
            <div
              key={p.package_id}
              style={{
                background: 'rgba(30, 41, 59, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.8rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.name}</span>
                <span className={`mono-badge ${p.is_feasible ? 'badge-amber' : 'badge-rose'}`}>
                  {p.is_feasible ? 'Dominated' : 'Hard Rejected'}
                </span>
              </div>
              <div style={{ color: p.is_feasible ? 'var(--text-muted)' : '#F0645F', lineHeight: '1.4' }}>
                {p.feasibility_reasons.length > 0
                  ? p.feasibility_reasons.join(' ')
                  : p.tradeoff_notes || 'Sub-optimal trade-off compared to non-dominated frontier alternatives.'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
