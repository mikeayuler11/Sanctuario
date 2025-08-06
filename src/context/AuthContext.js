import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Check for stored authentication
    const storedUser = localStorage.getItem('cemeteryUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (username === 'admin' && password === 'admin') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          role: 'admin',
          email: 'admin@sanctuario.com'
        };
        setUser(userData);
        localStorage.setItem('cemeteryUser', JSON.stringify(userData));
        return { success: true };
      } else if (username === 'staff' && password === 'staff') {
        const userData = {
          id: 2,
          username: 'staff',
          name: 'Staff Member',
          role: 'staff',
          email: 'staff@sanctuario.com'
        };
        setUser(userData);
        localStorage.setItem('cemeteryUser', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cemeteryUser');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};