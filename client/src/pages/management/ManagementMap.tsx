import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Map as MapIcon,
  LocationOn as LocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';

const ManagementMap: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cemetery Digital Map
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Interactive digital mapping system for grave locations and cemetery management
      </Typography>

      <Grid container spacing={3}>
        {/* Map Container */}
        <Grid item xs={12} lg={9}>
          <Card sx={{ height: '70vh', position: 'relative' }}>
            <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 3,
                    bgcolor: theme.palette.primary.light,
                  }}
                >
                  <MapIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Digital Map System
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Interactive cemetery map will be displayed here
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This feature will include:
                </Typography>
                <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    • Interactive plot visualization
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    • Grave location search
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    • Section-based navigation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    • Plot availability status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    • GPS coordinates integration
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  startIcon={<MapIcon />}
                  sx={{ mt: 3 }}
                  disabled
                >
                  Coming Soon
                </Button>
              </Box>
            </CardContent>

            {/* Map Controls Placeholder */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Paper sx={{ p: 1 }}>
                <ZoomInIcon color="disabled" />
              </Paper>
              <Paper sx={{ p: 1 }}>
                <ZoomOutIcon color="disabled" />
              </Paper>
              <Paper sx={{ p: 1 }}>
                <LayersIcon color="disabled" />
              </Paper>
            </Box>
          </Card>
        </Grid>

        {/* Map Legend and Controls */}
        <Grid item xs={12} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Map Legend
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'success.main',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Available Plots</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'warning.main',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Reserved Plots</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'error.main',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Occupied Plots</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'grey.400',
                      mr: 2,
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="body2">Maintenance</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Plots:</Typography>
                  <Typography variant="body2" fontWeight="bold">1,500</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Available:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="success.main">342</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Occupied:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">1,089</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Reserved:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">69</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search & Filter
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" fullWidth disabled>
                  Search by Plot Number
                </Button>
                <Button variant="outlined" fullWidth disabled>
                  Filter by Section
                </Button>
                <Button variant="outlined" fullWidth disabled>
                  View by Status
                </Button>
                <Button variant="outlined" fullWidth disabled>
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagementMap;