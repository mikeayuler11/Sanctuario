import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  AdminPanelSettings as AdminIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

const Homepage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: theme.palette.primary.main,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '1.5rem'
            }}
          >
            Sanctuario de Santa Rosa de Lima
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="primary"
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/client/login')}
            >
              Client Login
            </Button>
            <Button
              color="primary"
              variant="contained"
              startIcon={<AdminIcon />}
              onClick={() => navigate('/management/login')}
            >
              Management
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, rgba(2, 132, 199, 0.9) 0%, rgba(192, 38, 211, 0.9) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 600,
              marginBottom: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Sanctuario de Santa Rosa de Lima
          </Typography>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.2rem', md: '1.8rem' },
              fontWeight: 300,
              marginBottom: 4,
              opacity: 0.95,
            }}
          >
            Memorial Park
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              maxWidth: '600px',
              margin: '0 auto 3rem',
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            A peaceful resting place where memories live forever. 
            Our digital cemetery management system provides modern solutions for eternal care.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<RegisterIcon />}
              onClick={() => navigate('/client/register')}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.9),
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                px: 4,
                py: 1.5,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/client/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1),
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                px: 4,
                py: 1.5,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ 
            color: theme.palette.text.primary,
            marginBottom: 6,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Our Services
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <LocationIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: theme.palette.primary.main, 
                    marginBottom: 2 
                  }} 
                />
                <Typography variant="h5" component="h3" gutterBottom>
                  Digital Mapping
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Interactive digital maps to locate and manage grave sites with precision and ease.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <ScheduleIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: theme.palette.secondary.main, 
                    marginBottom: 2 
                  }} 
                />
                <Typography variant="h5" component="h3" gutterBottom>
                  Maintenance Scheduling
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Automated maintenance scheduling and tracking to ensure your loved ones' resting place is always well-maintained.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <AdminIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: theme.palette.success.main, 
                    marginBottom: 2 
                  }} 
                />
                <Typography variant="h5" component="h3" gutterBottom>
                  Complete Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Comprehensive cemetery management system including grave records, visitor management, and administrative tools.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ 
              color: theme.palette.text.primary,
              marginBottom: 6,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Contact Us
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} textAlign="center">
              <PhoneIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Phone
              </Typography>
              <Typography variant="body1" color="text.secondary">
                +63 (02) 8123-4567
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4} textAlign="center">
              <EmailIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                info@sanctuario-memorial.com
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4} textAlign="center">
              <LocationIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1" color="text.secondary">
                123 Memorial Drive<br />
                Quezon City, Metro Manila
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          backgroundColor: theme.palette.grey[900], 
          color: 'white',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" gutterBottom>
            © 2025 Sanctuario de Santa Rosa de Lima Memorial Park. All rights reserved.
          </Typography>
          <Typography variant="body2" color="grey.400">
            Digital Cemetery Management System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Homepage;