import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorHandling';
import { API_BASE } from '../utils/apiConfig';

// Cache for product data
const productCache = new Map();

export const useProductAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function for API requests
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });
    
    try {
      const fetchPromise = fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `API Error: ${res.status}`);
      }
      
      return await res.json();
    } catch (e) {
      console.error(`API Request Error (${endpoint}):`, e);
      throw new Error(getErrorMessage(e));
    }
  }, []);

  const fetchProduct = useCallback(async (barcode) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first
      const cacheKey = `barcode-${barcode}`;
      if (productCache.has(cacheKey)) {
        return productCache.get(cacheKey);
      }
      
      const products = await apiRequest(`/products?barcode=${encodeURIComponent(barcode)}`);
      
      if (Array.isArray(products) && products.length > 0) {
        // Store in cache
        productCache.set(cacheKey, products[0]);
        return products[0];
      } else {
        setError('Product not found');
        return null;
      }
    } catch (e) {
      setError(getErrorMessage(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      
      // Invalidate cache when creating new products
      productCache.clear();
      
      return newProduct;
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const deleteProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiRequest(`/products/${productId}`, {
        method: 'DELETE',
      });
      
      // Invalidate cache when deleting products
      productCache.clear();
      
      return result;
    } catch (e) {
      setError(getErrorMessage(e));
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    fetchProduct,
    createProduct,
    deleteProduct,
    clearError,
  };
}; 