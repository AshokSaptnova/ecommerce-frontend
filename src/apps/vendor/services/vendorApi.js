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

  // Categories endpoint
  getCategories: async (token) => {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get categories');
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

  // Order endpoints
  getOrders: async (vendorId, params, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/orders?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get orders');
    }
    
    return response.json();
  },

  updateOrderStatus: async (vendorId, orderId, status, token) => {
    const response = await fetch(`${API_BASE_URL}/vendors/${vendorId}/orders/${orderId}/status`, {
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

  // Financials endpoints (placeholder for future implementation)
  getFinancials: async (period, token) => {
    const response = await fetch(`${API_BASE_URL}/vendor/financials?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get financials');
    }
    
    return response.json();
  },

  getPayouts: async (token) => {
    const response = await fetch(`${API_BASE_URL}/vendor/payouts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get payouts');
    }
    
    return response.json();
  },

  requestPayout: async (amount, token) => {
    const response = await fetch(`${API_BASE_URL}/vendor/payouts/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to request payout');
    }
    
    return response.json();
  },
};

