import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import './index.css';
import { LandingPage } from './pages/LandingPage';
import { AppShell } from './pages/AppShell';

const LandingPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <LandingPage
      onEnterApp={() => navigate('/app')}
      onNavigateToAssessment={() => navigate('/app?tab=assessment')}
    />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageWrapper />
  },
  {
    path: '/app',
    element: <AppShell />
  },
  {
    path: '/app/*',
    element: <AppShell />
  },
  {
    path: '*',
    element: <LandingPageWrapper />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
