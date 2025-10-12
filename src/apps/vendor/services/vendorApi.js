// Vendor API service
import { config } from '../../../config/index';

const API_BASE_URL = config.api.baseUrl;

// Helper function to make authenticated requests
export const vendorApi = {
  getBaseUrl: () => API_BASE_URL,
  
  // Make a fetch request with token
  fetchWithAuth: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
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
  
  getVendorProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get vendor profile');
    }
    
    return response.json();
  },

  // Product endpoints
  getProducts: async (vendorId, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get products');
    }
    
    return response.json();
  },

  createProduct: async (vendorId, productData, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    
    return response.json();
  },

  updateProduct: async (productId, productData, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    
    return response.json();
  },

  deleteProduct: async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    
    return response.json();
  },
};
