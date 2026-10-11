import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryId?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Simulation Error',
  message,
  onRetry,
  onDismiss,
  retryId = 'btn-error-banner-retry'
}) => {
  return (
    <div
      role="alert"
      style={{
        background: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '14px 18px',
        margin: '16px 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        color: '#991B1B'
      }}
    >
      <AlertCircle size={20} color="#F0645F" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#B91C1C', lineHeight: 1.45 }}>
          {message}
        </div>
        {onRetry && (
          <button
            id={retryId}
            onClick={onRetry}
            style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#F0645F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm, 6px)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={12} />
            <span>Retry Calculation</span>
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F0645F',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
