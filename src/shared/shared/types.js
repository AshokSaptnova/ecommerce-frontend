// Types for TypeScript-like development (if you decide to migrate)
export const ProductTypes = {
  // Product categories
  CATEGORIES: {
    GENERAL_HEALTH: 'General Health',
    DIABETES: 'Diabetes',
    HEART_HEALTH: 'Heart Health',
    LIVER_HEALTH: 'Liver Health',
    MULTI_VITAMIN: 'Multi Vitamin'
  },

  // Product types
  TYPES: {
    CAPSULE: 'Capsule',
    TABLET: 'Tablet',
    SYRUP: 'Syrup',
    POWDER: 'Powder'
  },

  // API endpoints
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search'
  }
};

// Validation helpers
export const validateProduct = (product) => {
  const required = ['name', 'category', 'tagline'];
  const missing = required.filter(field => !product[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return true;
};

export default ProductTypes;