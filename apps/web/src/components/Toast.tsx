import React from 'react';
import { useToast, type ToastType } from '../lib/toast';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={18} color="var(--green-primary, #3ECF8E)" />;
    case 'warning':
      return <AlertTriangle size={18} color="#C98A28" />;
    case 'error':
      return <AlertCircle size={18} color="#F0645F" />;
    case 'info':
    default:
      return <Info size={18} color="#2563EB" />;
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notification-portal"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100vw - 40px)',
        pointerEvents: 'none'
      }}
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.id}
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-surface, #FFFFFF)',
            color: 'var(--text-main, #0F172A)',
            border: '1px solid var(--border-default, #E2E8F0)',
            borderLeft: `4px solid ${
              toast.type === 'success'
                ? 'var(--green-primary, #3ECF8E)'
                : toast.type === 'warning'
                ? '#C98A28'
                : toast.type === 'error'
                ? '#F0645F'
                : '#2563EB'
            }`,
            borderRadius: 'var(--radius-md, 8px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            animation: 'slideUpFade 0.25s ease',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            <ToastIcon type={toast.type} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.86rem', lineHeight: 1.3 }}>
              {toast.title}
            </div>
            {toast.message && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #475569)', marginTop: '3px', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: 'var(--text-muted, #94A3B8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px'
            }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
