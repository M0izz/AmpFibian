import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import App from '../App';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');

  return (
    <App
      initialDestination={
        initialTab === 'assessment' ||
        initialTab === 'compare' ||
        initialTab === 'evidence' ||
        initialTab === 'reports' ||
        initialTab === 'overview'
          ? initialTab
          : undefined
      }
      onNavigateToLanding={() => navigate('/')}
    />
  );
};

export default AppShell;
