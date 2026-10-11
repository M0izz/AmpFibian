import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  actionId = 'empty-state-action-btn'
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface, #FFFFFF)',
        border: '1px dashed var(--border-default, #CBD5E1)',
        borderRadius: 'var(--radius-lg, 12px)',
        margin: '24px 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--bg-subtle, #F8FAFC)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: 'var(--green-primary, #176B4D)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        {icon || <Layers size={26} />}
      </div>
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--text-main, #0F172A)',
          marginBottom: '8px'
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.86rem',
          color: 'var(--text-secondary, #64748B)',
          maxWidth: '440px',
          lineHeight: 1.5,
          marginBottom: actionText && onAction ? '20px' : '0'
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <button
          id={actionId}
          onClick={onAction}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem'
          }}
        >
          <span>{actionText}</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};
