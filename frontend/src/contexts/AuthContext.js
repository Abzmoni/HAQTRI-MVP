import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';

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
    checkAuth();
    
    // Listen for storage changes (when login happens from other components)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Auth check - Token:', !!token, 'User data:', !!userData);
    
    if (token && userData) {
      try {
        // Set user immediately from localStorage
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User set from localStorage:', parsedUser.name);
        
        // Verify with server in background
        try {
          const res = await API.get('/users/profile');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          console.log('User verified with server');
        } catch (serverError) {
          console.log('Server verification failed, using localStorage data');
          // Continue with localStorage data
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      const { token, ...userInfo } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, user: userInfo };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/signin';
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await API.put('/users/profile', profileData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isVerified: user?.isVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};