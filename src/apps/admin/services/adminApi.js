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

  // Orders endpoints
  getOrders: async (params, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get orders');
    }
    
    return response.json();
  },

  updateOrderStatus: async (orderId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return response.json();
  },

  // Category endpoints
  createOrUpdateCategory: async (categoryData, categoryId, token) => {
    const url = categoryId 
      ? `${API_BASE_URL}/admin/categories/${categoryId}`
      : `${API_BASE_URL}/admin/categories`;
    const method = categoryId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save category');
    }
    
    return response.json();
  },

  deleteCategory: async (categoryId, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    
    return response.json();
  },

  // User endpoints
  getUsers: async (params, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get users');
    }
    
    return response.json();
  },

  updateUserStatus: async (userId, isActive, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user status');
    }
    
    return response.json();
  },

  deleteUser: async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    return response.json();
  },

  // Reports endpoints
  getReports: async (params, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/reports?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get reports');
    }
    
    return response.json();
  },

  // Vendor endpoints
  getVendors: async (params, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get vendors');
    }
    
    return response.json();
  },

  verifyVendor: async (vendorId, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_verified: true }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify vendor');
    }
    
    return response.json();
  },

  updateVendorStatus: async (vendorId, isActive, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: isActive }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update vendor status');
    }
    
    return response.json();
  },

  updateVendor: async (vendorId, vendorData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update vendor');
    }
    
    return response.json();
  },

  getVendor: async (vendorId, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/vendors/${vendorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get vendor');
    }
    
    return response.json();
  },

  // Product endpoints
  getProducts: async (params, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get products');
    }
    
    return response.json();
  },

  updateProductStatus: async (productId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update product status');
    }
    
    return response.json();
  },
};

// Export a configured fetch function for backward compatibility
export const makeApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

