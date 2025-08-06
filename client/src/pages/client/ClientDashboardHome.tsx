import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccountBox as GravesIcon,
  Help as InquiriesIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ClientDashboardHome: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const stats = [
    {
      title: 'My Graves',
      value: '2',
      icon: <GravesIcon />,
      color: theme.palette.primary.main,
      description: 'Active plots',
    },
    {
      title: 'Inquiries',
      value: '1',
      icon: <InquiriesIcon />,
      color: theme.palette.secondary.main,
      description: 'Open inquiries',
    },
    {
      title: 'Payments',
      value: '$450',
      icon: <PaymentIcon />,
      color: theme.palette.success.main,
      description: 'Outstanding balance',
    },
    {
      title: 'Maintenance',
      value: '1',
      icon: <ScheduleIcon />,
      color: theme.palette.warning.main,
      description: 'Scheduled this month',
    },
  ];

  const recentActivities = [
    {
      title: 'Maintenance completed',
      description: 'Plot A-12: Grass cutting and stone cleaning',
      date: '2 days ago',
      type: 'maintenance',
    },
    {
      title: 'Payment received',
      description: 'Monthly maintenance fee - $150',
      date: '1 week ago',
      type: 'payment',
    },
    {
      title: 'Inquiry resolved',
      description: 'Memorial service scheduling request',
      date: '2 weeks ago',
      type: 'inquiry',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <ScheduleIcon color="primary" />;
      case 'payment':
        return <PaymentIcon color="success" />;
      case 'inquiry':
        return <InquiriesIcon color="secondary" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: theme.palette.primary.main,
              mr: 3,
              fontSize: '1.5rem',
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome back, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your memorial services and account status.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 2,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.1),
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.date}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<InquiriesIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Submit New Inquiry
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Schedule Service
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PaymentIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Make Payment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Update Profile
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Monthly maintenance scheduled for Plot A-12
                  </Typography>
                  <Chip label="Upcoming" color="warning" size="small" />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Payment due in 5 days
                  </Typography>
                  <Chip label="Payment Due" color="error" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDashboardHome;