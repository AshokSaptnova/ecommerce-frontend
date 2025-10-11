import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (token) {
        try {
          apiService.setToken(token);
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('access_token');
          apiService.setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      // Step 1: Register the user
      const userResponse = await apiService.register(userData);
      
      // Step 2: Automatically log them in
      const loginResponse = await apiService.login(userData.email, userData.password);
      
      if (loginResponse.access_token) {
        localStorage.setItem('token', loginResponse.access_token);
        apiService.setToken(loginResponse.access_token);
        
        // Get the full user profile
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
        
        return { success: true, user: currentUser };
      }
      
      return { success: false, error: 'Login after registration failed' };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiService.login(email, password);
      
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('token', response.access_token); // Keep both for compatibility
        apiService.setToken(response.access_token);
        
        // Fetch the full user profile to ensure we have all data
        const currentUser = await apiService.getCurrentUser();
        setUser(currentUser);
        
        return { success: true, user: currentUser };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Invalid credentials';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      apiService.setToken(null);
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await apiService.updateProfile(profileData);
      setUser(response);
      return { success: true, user: response };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Profile update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setError(null);
      await apiService.changePassword(oldPassword, newPassword);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Password change failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
