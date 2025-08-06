import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Users,
  Calculator,
  MessageSquare,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/management/Dashboard';
import MapView from '../pages/management/MapView';
import GraveManagement from '../pages/management/GraveManagement';
import Amortization from '../pages/management/Amortization';
import Inquiries from '../pages/management/Inquiries';
import Maintenance from '../pages/management/Maintenance';
import SettingsPage from '../pages/management/SettingsPage';

const ManagementLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Map',
      href: '/dashboard/map',
      icon: <Map className="w-5 h-5" />,
      current: location.pathname === '/dashboard/map'
    },
    {
      name: 'Grave Management',
      href: '/dashboard/graves',
      icon: <Users className="w-5 h-5" />,
      current: location.pathname === '/dashboard/graves'
    },
    {
      name: 'Amortization',
      href: '/dashboard/amortization',
      icon: <Calculator className="w-5 h-5" />,
      current: location.pathname === '/dashboard/amortization'
    },
    {
      name: 'Inquiries',
      href: '/dashboard/inquiries',
      icon: <MessageSquare className="w-5 h-5" />,
      current: location.pathname === '/dashboard/inquiries'
    },
    {
      name: 'Maintenance',
      href: '/dashboard/maintenance',
      icon: <Wrench className="w-5 h-5" />,
      current: location.pathname === '/dashboard/maintenance'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />,
      current: location.pathname === '/dashboard/settings'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (href) => {
    navigate(href);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              className="lg:hidden"
            >
              <SidebarContent 
                navigation={navigation}
                user={user}
                onNavigation={handleNavigation}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Desktop sidebar */}
        <div className="hidden lg:block h-full">
          <SidebarContent 
            navigation={navigation}
            user={user}
            onNavigation={handleNavigation}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cemetery-500 focus:border-cemetery-500"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <Bell className="w-6 h-6" />
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-8 h-8 bg-cemetery-100 rounded-full flex items-center justify-center">
                  <span className="text-cemetery-700 font-medium text-sm">
                    {user?.avatar}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/graves" element={<GraveManagement />} />
            <Route path="/amortization" element={<Amortization />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, user, onNavigation, onLogout }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-xl font-serif font-bold text-gradient">
            Sanctuario
          </h1>
        </div>
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={() => onNavigation('/dashboard')}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onNavigation(item.href)}
            className={`w-full sidebar-item ${
              item.current ? 'active' : ''
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-cemetery-100 rounded-full flex items-center justify-center">
            <span className="text-cemetery-700 font-medium">
              {user?.avatar}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full sidebar-item text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ManagementLayout;