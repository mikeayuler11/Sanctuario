import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Homepage from './pages/Homepage';
import ClientLogin from './pages/auth/ClientLogin';
import ClientRegister from './pages/auth/ClientRegister';
import ManagementLogin from './pages/auth/ManagementLogin';
import ClientDashboard from './pages/client/ClientDashboard';
import ManagementDashboard from './pages/management/ManagementDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
    },
    secondary: {
      main: '#c026d3',
      light: '#e879f9',
      dark: '#a21caf',
    },
    success: {
      main: '#84cc16',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '0px 8px 16px rgba(0, 0, 0, 0.1)',
    '0px 16px 24px rgba(0, 0, 0, 0.1)',
    '0px 24px 32px rgba(0, 0, 0, 0.1)',
    ...Array(19).fill('0px 24px 32px rgba(0, 0, 0, 0.1)'),
  ] as any,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/client/login" element={<ClientLogin />} />
              <Route path="/client/register" element={<ClientRegister />} />
              <Route path="/management/login" element={<ManagementLogin />} />
              
              {/* Protected Client Routes */}
              <Route 
                path="/client/dashboard/*" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Management Routes */}
              <Route 
                path="/management/dashboard/*" 
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <ManagementDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
