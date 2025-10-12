// Admin API service
import { config } from '../../../config/index';

const API_BASE_URL = config.api.baseUrl;

// Helper function to make authenticated requests
export const adminApi = {
  getBaseUrl: () => API_BASE_URL,
  
  // Make a fetch request with token
  fetchWithAuth: async (endpoint, options = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Auth endpoints
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },
  
  getMe: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },
};

// Export a configured fetch function for backward compatibility
export const makeApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
