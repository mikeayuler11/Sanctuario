import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Badge as StaffIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ManagementLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/management/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, 'management');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <IconButton
              component={Link}
              to="/"
              sx={{ position: 'absolute', top: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <AdminIcon 
              sx={{ 
                fontSize: 80, 
                color: 'primary.main', 
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              }} 
            />
            
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Management Portal
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Staff & Administrator Access
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
              <Chip 
                icon={<StaffIcon />} 
                label="Staff" 
                variant="outlined" 
                color="primary" 
                size="small"
              />
              <Chip 
                icon={<AdminIcon />} 
                label="Administrator" 
                variant="outlined" 
                color="secondary" 
                size="small"
              />
            </Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                boxShadow: '0 4px 12px rgba(30, 41, 59, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
                  boxShadow: '0 6px 16px rgba(30, 41, 59, 0.5)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(30, 41, 59, 0.5)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Access Management System'
              )}
            </Button>
          </Box>

          {/* Security Notice */}
          <Box 
            sx={{ 
              mt: 4, 
              p: 2, 
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: 'center',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              🔒 Authorized Personnel Only
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 0.5,
              }}
            >
              All access attempts are logged and monitored
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need system access?{' '}
              <Link 
                to="/contact" 
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'underline',
                  fontWeight: 500,
                }}
              >
                Contact IT Support
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManagementLogin;