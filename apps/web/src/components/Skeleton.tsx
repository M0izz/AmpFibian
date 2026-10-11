import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '18px',
  borderRadius = 'var(--radius-sm, 6px)',
  style,
  className
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className || ''}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--border-default, #E2E8F0)',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
    />
  );
};

export const SkeletonCard: React.FC<{ height?: string | number }> = ({ height = '180px' }) => {
  return (
    <div
      style={{
        background: 'var(--bg-surface, #FFFFFF)',
        border: '1px solid var(--border-default, #E2E8F0)',
        borderRadius: 'var(--radius-lg, 12px)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="40%" height="20px" />
        <Skeleton width="20%" height="16px" borderRadius="10px" />
      </div>
      <Skeleton width="70%" height="14px" />
      <div style={{ flex: 1 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Skeleton height="36px" />
        <Skeleton height="36px" />
      </div>
    </div>
  );
};

export const SkeletonRow: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-default, #E2E8F0)'
      }}
    >
      <Skeleton width="24px" height="24px" borderRadius="50%" />
      <Skeleton width="30%" height="16px" />
      <Skeleton width="20%" height="16px" />
      <Skeleton width="25%" height="16px" />
      <div style={{ flex: 1 }} />
      <Skeleton width="60px" height="28px" borderRadius="6px" />
    </div>
  );
};
