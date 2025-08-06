import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('cemetery_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, userType) => {
    // Simulate authentication - in real app, this would be an API call
    const users = {
      admin: {
        id: 1,
        email: 'admin@sanctuario.com',
        name: 'Administrator',
        role: 'admin',
        avatar: '👨‍💼'
      },
      staff: {
        id: 2,
        email: 'staff@sanctuario.com',
        name: 'Staff Member',
        role: 'staff',
        avatar: '👷‍♂️'
      },
      client: {
        id: 3,
        email: 'client@example.com',
        name: 'John Doe',
        role: 'client',
        avatar: '👤'
      }
    };

    // Simple validation - in real app, validate against backend
    if (email === users[userType].email && password === 'password123') {
      const userData = users[userType];
      setUser(userData);
      localStorage.setItem('cemetery_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } else {
      toast.error('Invalid credentials. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cemetery_user');
    toast.success('Logged out successfully');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const canAccessManagement = () => {
    return user?.role === 'admin' || user?.role === 'staff';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    hasRole,
    canAccessManagement,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};