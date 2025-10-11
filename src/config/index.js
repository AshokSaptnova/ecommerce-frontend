// Application configuration
export const config = {
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000',
    timeout: 10000,
    retryAttempts: 3,
    enableFallback: process.env.REACT_APP_ENABLE_FALLBACK !== 'false'
  },
  
  app: {
    name: 'SAPTNOVA Product Catalog',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  presentation: {
    autoPlayInterval: 10000, // 10 seconds
    controlsHideDelay: 3000  // 3 seconds
  }
};

export default config;