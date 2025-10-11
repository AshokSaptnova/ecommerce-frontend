import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

// Custom hook for fetching individual product details
export const useProductDetails = (identifier) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single product details
  const fetchProductDetails = useCallback(async () => {
    if (!identifier) {
      setError('Product identifier is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductById(identifier);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
      console.error('Product details fetch error:', err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  // Initial load when identifier changes
  useEffect(() => {
    if (identifier) {
      fetchProductDetails();
    } else {
      setProduct(null);
      setLoading(false);
      setError('No product identifier provided');
    }
  }, [identifier, fetchProductDetails]);

  return {
    product,
    loading,
    error,
    refetch: fetchProductDetails
  };
};

export default useProductDetails;