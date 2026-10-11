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
  const width = 840;
  const height = 340;
  const padLeft = 70;
  const padRight = 40;
  const padTop = 36;
  const padBottom = 50;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Scales
  const maxCost = 1500000; // 15 Lakhs
  const maxWater = 100;

  const getX = (cost: number) => padLeft + Math.min(chartW, (cost / maxCost) * chartW);
  const getY = (water: number) => padTop + chartH - (Math.min(100, water) / maxWater) * chartH;

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
    <div className="card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: 'var(--green-light)',
            border: '1px solid var(--green-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--green-primary)'
          }}>
            <Target size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Multi-Objective Pareto Frontier & Feasibility Screening
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Deterministic trade-off: Capital Expenditure (₹ INR) vs Non-Potable Water Reliability (% Coverage)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--water-blue)', boxShadow: '0 0 6px var(--water-blue)' }}></span>
            <span>Recommended (Balanced)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green-primary)' }}></span>
            <span>Pareto Non-Dominated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--error-primary)' }}></span>
            <span>Infeasible (Budget Exceeded)</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        background: 'rgba(9, 9, 11, 0.7)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        padding: '12px',
        overflow: 'hidden'
      }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="frontierGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--green-primary)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--water-blue)" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Grid lines - Water Reliability Y axis */}
          {[0, 20, 40, 60, 80, 100].map(val => (
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
                x={padLeft - 10}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--text-dim)"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Grid lines - Cost X axis */}
          {[0, 300000, 600000, 900000, 1200000, 1500000].map(val => (
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
                y={padTop + chartH + 20}
                textAnchor="middle"
                fontSize="11"
                fill="var(--text-dim)"
              >
                ₹{val / 100000}L
              </text>
            </g>
          ))}

          {/* Budget Cap Hard-Filter Line */}
          <line
            x1={budgetX}
            y1={padTop}
            x2={budgetX}
            y2={padTop + chartH}
            stroke="var(--amber-primary)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x={budgetX + 8}
            y={padTop + 16}
            fontSize="11"
            fill="var(--amber-primary)"
            fontWeight="600"
          >
            Budget Limit: ₹{(budgetCapInr / 100000).toFixed(1)}L
          </text>

          {/* Pareto Frontier Curve */}
          {frontierPath && (
            <path
              d={frontierPath}
              fill="none"
              stroke="url(#frontierGlow)"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
          )}

          {/* Package Points */}
          {packages.map(p => {
            const cx = getX(p.boq.total_cost_inr);
            const cy = getY(p.water_summary.demand_coverage_percent);
            const isSelected = selectedPackageId === p.package_id;
            const isKnee = p.profile_type === 'balanced';

            let fillColor = 'var(--text-muted)';
            let strokeColor = 'rgba(255, 255, 255, 0.4)';
            let r = 7;

            if (!p.is_feasible) {
              fillColor = 'var(--error-primary)';
              strokeColor = '#ffffff';
              r = 6;
            } else if (isKnee) {
              fillColor = 'var(--water-blue)';
              strokeColor = '#ffffff';
              r = 10;
            } else if (p.profile_type === 'heat_first') {
              fillColor = 'var(--amber-primary)';
              strokeColor = 'rgba(255, 255, 255, 0.8)';
              r = 8;
            } else if (p.profile_type === 'water_first') {
              fillColor = 'var(--green-primary)';
              strokeColor = 'rgba(255, 255, 255, 0.8)';
              r = 8;
            } else if (p.is_pareto_optimal) {
              fillColor = 'var(--green-primary)';
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
                    strokeOpacity="0.7"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.8"
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padLeft + chartW / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fontWeight="500"
            fill="var(--text-muted)"
          >
            Upfront Capital Expenditure (₹ INR)
          </text>
          <text
            x={18}
            y={padTop + chartH / 2}
            textAnchor="middle"
            transform={`rotate(-90 18 ${padTop + chartH / 2})`}
            fontSize="12"
            fontWeight="500"
            fill="var(--text-muted)"
          >
            Non-Potable Water Reliability (% Coverage)
          </text>
        </svg>

        {/* Hover detail tooltip */}
        {hoveredPkg && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(15, 15, 18, 0.95)',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: 'var(--shadow-md)',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'none',
            maxWidth: '280px',
            zIndex: 10
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              {hoveredPkg.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              <span>Cost:</span>
              <strong style={{ color: 'var(--text-main)' }}>₹{hoveredPkg.boq.total_cost_inr.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
              <span>Water Coverage:</span>
              <strong style={{ color: 'var(--water-blue)' }}>{hoveredPkg.water_summary.demand_coverage_percent}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Feasibility:</span>
              <strong style={{ color: hoveredPkg.is_feasible ? 'var(--green-primary)' : 'var(--error-primary)' }}>
                {hoveredPkg.is_feasible ? 'Passes Constraints' : 'Infeasible'}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
