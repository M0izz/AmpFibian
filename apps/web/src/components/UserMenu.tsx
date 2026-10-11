import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, RefreshCw, Key } from 'lucide-react';
import { getAnonymousIdentity, clearSession } from '../lib/session';

interface UserMenuProps {
  onNavigateToHistory?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigateToHistory }) => {
  const [identityId, setIdentityId] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    getAnonymousIdentity().then(({ identityId: id }) => {
      setIdentityId(id);
    });
  }, []);

  const handleResetSession = () => {
    if (confirm("Reset current browser session? This will issue a fresh isolated user partition.")) {
      clearSession();
      window.location.reload();
    }
  };

  const displayId = identityId
    ? identityId.length > 18
      ? `${identityId.slice(0, 8)}...${identityId.slice(-6)}`
      : identityId
    : 'Connecting...';

  return (
    <div style={{ position: 'relative' }}>
      <button
        id="user-menu-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-full)',
          padding: '4px 10px',
          fontSize: '0.76rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        title="AWS User Isolation Status"
      >
        <UserCheck size={13} color="var(--green-primary)" />
        <span style={{ fontFamily: 'var(--font-mono)' }}>{displayId}</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
            onClick={() => setIsOpen(false)}
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 100,
            width: '280px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: '16px',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--green-primary)', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>AWS User Isolation Active</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.45, marginBottom: '12px' }}>
              Your simulation data and building assessments are cryptographically isolated under your unique identity partition.
            </p>

            <div style={{
              background: 'var(--bg-subtle)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-default)',
              marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                <Key size={11} />
                <span>PARTITION ID (COGNITO / SUB)</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', wordBreak: 'break-all', color: 'var(--text-main)' }}>
                {identityId || 'anon_session'}
              </div>
            </div>

            {onNavigateToHistory && (
              <button
                id="user-menu-my-runs-btn"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToHistory();
                }}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  fontSize: '0.76rem',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}
              >
                <span>View My Saved Runs</span>
              </button>
            )}

            <button
              id="user-menu-reset-session-btn"
              onClick={handleResetSession}
              className="btn btn-secondary"
              style={{
                width: '100%',
                fontSize: '0.76rem',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={12} />
              <span>Start Fresh Session</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
