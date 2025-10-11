/**
 * Utility function to parse API error responses
 * Handles FastAPI validation errors, string errors, and object errors
 */
export const parseErrorResponse = (errorData) => {
  if (!errorData) {
    return 'An unexpected error occurred';
  }

  // If errorData itself is a string
  if (typeof errorData === 'string') {
    return errorData;
  }

  // If detail exists and is a string
  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  // If detail is an array (FastAPI validation errors)
  if (Array.isArray(errorData.detail)) {
    const errorMessages = errorData.detail.map(err => {
      const field = err.loc ? err.loc.slice(1).join('.') : 'field'; // Skip 'body' in loc
      const message = err.msg || 'Invalid value';
      return `${field}: ${message}`;
    }).join('\n');
    return errorMessages || 'Validation error';
  }

  // If detail is an object
  if (errorData.detail && typeof errorData.detail === 'object') {
    return JSON.stringify(errorData.detail);
  }

  // If there's a message field
  if (errorData.message) {
    return errorData.message;
  }

  // Default fallback
  return 'An error occurred';
};

/**
 * Handle fetch response and extract error
 */
export const handleApiError = async (response) => {
  try {
    const errorData = await response.json();
    return parseErrorResponse(errorData);
  } catch (e) {
    // If response is not JSON
    return `Error: ${response.status} ${response.statusText}`;
  }
};
