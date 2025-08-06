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
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  AccountBox as GravesIcon,
  Help as InquiriesIcon,
  Build as MaintenanceIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ManagementDashboardHome: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Graves',
      value: '1,247',
      change: '+12',
      icon: <GravesIcon />,
      color: theme.palette.primary.main,
      description: 'Active plots',
      progress: 78,
    },
    {
      title: 'Open Inquiries',
      value: '23',
      change: '+5',
      icon: <InquiriesIcon />,
      color: theme.palette.error.main,
      description: 'Requiring attention',
      progress: 23,
    },
    {
      title: 'Maintenance Tasks',
      value: '15',
      change: '-3',
      icon: <MaintenanceIcon />,
      color: theme.palette.warning.main,
      description: 'Scheduled this week',
      progress: 60,
    },
    {
      title: 'Revenue (Month)',
      value: '$45,280',
      change: '+8.2%',
      icon: <PaymentIcon />,
      color: theme.palette.success.main,
      description: 'Current month',
      progress: 85,
    },
  ];

  const recentActivities = [
    {
      title: 'New grave reservation',
      description: 'Plot B-156 reserved by John Martinez',
      time: '5 minutes ago',
      type: 'reservation',
      icon: <GravesIcon color="primary" />,
    },
    {
      title: 'Maintenance completed',
      description: 'Section A landscaping finished',
      time: '1 hour ago',
      type: 'maintenance',
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: 'Urgent inquiry received',
      description: 'Memorial service scheduling request',
      time: '2 hours ago',
      type: 'inquiry',
      icon: <WarningIcon color="error" />,
    },
    {
      title: 'Payment received',
      description: 'Monthly installment - Plot A-89',
      time: '3 hours ago',
      type: 'payment',
      icon: <PaymentIcon color="success" />,
    },
    {
      title: 'Staff login',
      description: 'Maria Santos logged into system',
      time: '4 hours ago',
      type: 'system',
      icon: <PeopleIcon color="info" />,
    },
  ];

  const upcomingTasks = [
    {
      title: 'Monthly Report Generation',
      dueDate: 'Today, 5:00 PM',
      priority: 'high',
      assignee: 'Admin Team',
    },
    {
      title: 'Section C Maintenance',
      dueDate: 'Tomorrow, 8:00 AM',
      priority: 'medium',
      assignee: 'Maintenance Crew',
    },
    {
      title: 'Client Meeting - Martinez Family',
      dueDate: 'Jan 25, 2:00 PM',
      priority: 'high',
      assignee: 'Sales Team',
    },
    {
      title: 'Grave Site Inspection',
      dueDate: 'Jan 26, 10:00 AM',
      priority: 'low',
      assignee: 'Operations',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: user?.role === 'admin' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: user?.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
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
              Here's what's happening at Sanctuario Memorial Park today.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
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
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" component="div" color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        color={stat.change.startsWith('+') ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.description}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  sx={{
                    mt: 1,
                    bgcolor: alpha(stat.color, 0.1),
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stat.color,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2">
                  Recent Activities
                </Typography>
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
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

        {/* Upcoming Tasks */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Upcoming Tasks
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {upcomingTasks.map((task, index) => (
                  <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.priority.toUpperCase()}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      {task.dueDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assigned to: {task.assignee}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<GravesIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Add New Grave
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MaintenanceIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Schedule Maintenance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PaymentIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Generate Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PeopleIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  Manage Users
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagementDashboardHome;