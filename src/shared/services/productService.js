// API service for fetching products data
import { fallbackProducts } from '../../fallbackProducts';
import { config } from '../../config/index';

// Use relative URL when in development (proxy will handle it)
// Use full URL in production
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return ''; // Use relative URLs - proxy will handle this
  }
  return config.api.baseUrl;
};

const API_BASE_URL = getApiUrl();

export const productService = {
  // Fetch all products
  async getAllProducts() {
    try {
      console.log('Fetching products from API...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for Render free tier
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products fetched successfully:', data.length, 'products');
      return data;
    } catch (error) {
      console.warn('API not available, using fallback data:', error.message);
      
      if (error.name === 'AbortError') {
        console.warn('Request timeout - using fallback data');
      }
      
      // Return fallback data when API is not available
      return fallbackProducts;
    }
  },

  // Fetch single product by ID (supports numeric ID, slug, or product_id)
  async getProductById(identifier) {
    try {
      console.log(`Fetching product ${identifier} from API...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      let endpoint;
      // Check if identifier is numeric (ID) or string (slug)
      if (/^\d+$/.test(identifier)) {
        // It's a numeric ID
        endpoint = `${API_BASE_URL}/products/${identifier}`;
      } else {
        // It's likely a slug
        endpoint = `${API_BASE_URL}/products/slug/${identifier}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Product fetched successfully:', data);
      return data;
    } catch (error) {
      console.warn(`API not available for product ${identifier}, using fallback:`, error.message);
      
      // Return fallback product with flexible matching
      const product = fallbackProducts.find(p => 
        p.id?.toString() === identifier ||
        p.product_id?.toString() === identifier ||
        p.slug === identifier ||
        p.name.toLowerCase().replace(/\s+/g, '-') === identifier
      );
      
      if (!product) {
        throw new Error(`Product ${identifier} not found`);
      }
      
      console.log('Using fallback product:', product.name);
      return product;
    }
  },

  // Search products
  async searchProducts(query, category = null) {
    try {
      let url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`;
      if (category && category !== 'all') {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      console.log('Searching products:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      return data;
    } catch (error) {
      console.warn('API search not available, using fallback search:', error.message);
      
      // Fallback search implementation
      let results = fallbackProducts;
      
      if (query) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.tagline?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (category && category !== 'all') {
        results = results.filter(product => product.category === category);
      }
      
      return results;
    }
  }
};

export default productService;