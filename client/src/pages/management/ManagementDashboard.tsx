import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  alpha,
  Chip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  AccountBox as GraveIcon,
  Payment as AmortizationIcon,
  Help as InquiriesIcon,
  Build as MaintenanceIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as ProfileIcon,
  AdminPanelSettings as AdminIcon,
  Badge as StaffIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import ManagementDashboardHome from './ManagementDashboardHome';
import ManagementMap from './ManagementMap';
import GraveManagement from './GraveManagement';
import AmortizationManagement from './AmortizationManagement';
import InquiriesManagement from './InquiriesManagement';
import MaintenanceManagement from './MaintenanceManagement';
import ManagementSettings from './ManagementSettings';

const drawerWidth = 300;

const ManagementDashboard: React.FC = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/management/dashboard',
      badge: null,
    },
    { 
      text: 'Map', 
      icon: <MapIcon />, 
      path: '/management/dashboard/map',
      badge: null,
    },
    { 
      text: 'Grave Management', 
      icon: <GraveIcon />, 
      path: '/management/dashboard/graves',
      badge: null,
    },
    { 
      text: 'Amortization', 
      icon: <AmortizationIcon />, 
      path: '/management/dashboard/amortization',
      badge: { count: 12, color: 'warning' as const },
    },
    { 
      text: 'Inquiries', 
      icon: <InquiriesIcon />, 
      path: '/management/dashboard/inquiries',
      badge: { count: 5, color: 'error' as const },
    },
    { 
      text: 'Maintenance', 
      icon: <MaintenanceIcon />, 
      path: '/management/dashboard/maintenance',
      badge: { count: 8, color: 'info' as const },
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon />, 
      path: '/management/dashboard/settings',
      badge: null,
    },
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/management/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.grey[800]} 0%, ${theme.palette.grey[900]} 100%)`,
          color: 'white',
          textAlign: 'center',
          borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
        }}
      >
        <AdminIcon sx={{ fontSize: 40, mb: 1, opacity: 0.9 }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: '1.3rem',
            mb: 0.5,
          }}
        >
          Management Portal
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Cemetery Administration
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 3, bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: user?.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
              mr: 2,
              fontSize: '1.2rem',
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Chip
                icon={user?.role === 'admin' ? <AdminIcon /> : <StaffIcon />}
                label={user?.role?.toUpperCase()}
                size="small"
                color={user?.role === 'admin' ? 'error' : 'primary'}
                variant="filled"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                px: 2.5,
                py: 1.5,
                backgroundColor: isActiveRoute(item.path) ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                color: isActiveRoute(item.path) ? theme.palette.primary.main : 'inherit',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                },
                transition: 'all 0.2s ease',
              }}
              selected={isActiveRoute(item.path)}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.badge ? (
                  <Badge 
                    badgeContent={item.badge.count} 
                    color={item.badge.color}
                    max={99}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 2 }} />

      {/* Logout Button */}
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              minHeight: 48,
              px: 2.5,
              py: 1.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: 40,
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            {menuItems.find(item => isActiveRoute(item.path))?.text || 'Management System'}
          </Typography>

          <IconButton
            size="large"
            edge="end"
            aria-label="account menu"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: user?.role === 'admin' ? theme.palette.error.main : theme.palette.primary.main,
                fontSize: '0.875rem',
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/management/dashboard/settings')}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'inherit' }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/" element={<ManagementDashboardHome />} />
            <Route path="/map" element={<ManagementMap />} />
            <Route path="/graves" element={<GraveManagement />} />
            <Route path="/amortization" element={<AmortizationManagement />} />
            <Route path="/inquiries" element={<InquiriesManagement />} />
            <Route path="/maintenance" element={<MaintenanceManagement />} />
            <Route path="/settings" element={<ManagementSettings />} />
            <Route path="*" element={<Navigate to="/management/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagementDashboard;