import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ManagementLayout from './layouts/ManagementLayout';
import ClientDashboard from './pages/ClientDashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, canAccessManagement, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-memorial">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />

        {/* Client routes */}
        <Route path="/client" element={
          isAuthenticated() ? <ClientDashboard /> : <Navigate to="/login" replace />
        } />

        {/* Management routes - protected */}
        <Route path="/dashboard/*" element={
          isAuthenticated() && canAccessManagement() 
            ? <ManagementLayout /> 
            : <Navigate to="/login" replace />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;