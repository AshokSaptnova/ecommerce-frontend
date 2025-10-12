// API URL helper - use this everywhere instead of hardcoded URLs
import { config } from '../../config/index';

export const API_BASE_URL = config.api.baseUrl;

// Helper to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
