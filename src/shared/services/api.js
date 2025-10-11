// API Configuration and Services
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('access_token');
    this.sessionId = this.getOrCreateSessionId();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  getHeaders() {
    // Always get fresh token from localStorage
    this.token = localStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Update token (call this after login/logout)
  updateToken() {
    this.token = localStorage.getItem('access_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (204 No Content or empty body)
      const contentLength = response.headers.get('content-length');
      if (response.status === 204 || contentLength === '0') {
        return null;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Cart API methods
  async getCart() {
    if (this.token) {
      return this.request('/cart/');
    } else {
      return this.request(`/cart/session/${this.sessionId}`);
    }
  }

  async addToCart(productId, quantity = 1) {
    const payload = {
      product_id: productId,
      quantity: quantity
    };

    if (this.token) {
      return this.request('/cart/add', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } else {
      return this.request(`/cart/session/${this.sessionId}/add`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  }

  async updateCartItem(itemId, quantity) {
    if (this.token) {
      if (!itemId) {
        throw new Error('Cart item ID is required to update an authenticated cart item');
      }
      return this.request(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
    }

    const payload = {
      product_id: itemId,
      quantity
    };

    return this.request(`/cart/session/${this.sessionId}/update`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async removeFromCart(itemId) {
    if (this.token) {
      if (!itemId) {
        throw new Error('Cart item ID is required to remove an authenticated cart item');
      }
      return this.request(`/cart/${itemId}`, {
        method: 'DELETE'
      });
    }

    return this.request(`/cart/session/${this.sessionId}/remove/${itemId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    if (this.token) {
      return this.request('/cart/', {
        method: 'DELETE'
      });
    }

    return this.request(`/cart/session/${this.sessionId}/clear`, {
      method: 'DELETE'
    });
  }

  async getCartSummary() {
    if (this.token) {
      return this.request('/cart/summary');
    } else {
      return this.request(`/cart/session/${this.sessionId}/summary`);
    }
  }

  // Order API methods
  async checkout(checkoutData) {
    if (this.token) {
      return this.request('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(checkoutData)
      });
    } else {
      return this.request(`/orders/session/${this.sessionId}/checkout`, {
        method: 'POST',
        body: JSON.stringify(checkoutData)
      });
    }
  }

  async getOrders() {
    return this.request('/orders/');
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'POST'
    });
  }

  // Product API methods
  async getProducts() {
    return this.request('/products/');
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  // Auth methods
  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    this.token = data.access_token;
    localStorage.setItem('access_token', this.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    return data;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // User methods
  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  // Authentication API methods
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      // FastAPI OAuth2 expects form data
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Invalid credentials');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.request('/auth/me');
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      return await this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      throw error;
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      return await this.request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });
    } catch (error) {
      throw error;
    }
  }

  async requestPasswordReset(email) {
    try {
      return await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token, newPassword) {
    try {
      return await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          new_password: newPassword
        })
      });
    } catch (error) {
      throw error;
    }
  }

  // User Stats API
  async getUserStats() {
    try {
      return await this.request('/auth/stats');
    } catch (error) {
      throw error;
    }
  }

  // Address API methods
  async getAddresses() {
    try {
      return await this.request('/addresses/');
    } catch (error) {
      throw error;
    }
  }

  async createAddress(addressData) {
    try {
      return await this.request('/addresses/', {
        method: 'POST',
        body: JSON.stringify(addressData)
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAddress(addressId, addressData) {
    try {
      return await this.request(`/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAddress(addressId) {
    try {
      return await this.request(`/addresses/${addressId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  }

  async setDefaultAddress(addressId) {
    try {
      return await this.request(`/addresses/${addressId}/set-default`, {
        method: 'POST'
      });
    } catch (error) {
      throw error;
    }
  }

  // Wishlist API methods
  async getWishlist() {
    try {
      return await this.request('/wishlist/');
    } catch (error) {
      throw error;
    }
  }

  async addToWishlist(productId) {
    try {
      return await this.request('/wishlist/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId })
      });
    } catch (error) {
      throw error;
    }
  }

  async removeFromWishlist(productId) {
    try {
      return await this.request(`/wishlist/${productId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  }

  async toggleWishlist(productId) {
    try {
      return await this.request(`/wishlist/${productId}/toggle`, {
        method: 'POST'
      });
    } catch (error) {
      throw error;
    }
  }

  async checkWishlist(productId) {
    try {
      return await this.request(`/wishlist/check/${productId}`);
    } catch (error) {
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;