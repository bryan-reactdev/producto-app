import { useState } from 'react';

const API_BASE = 'http://192.168.3.12:3000/api';

export const useProductAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async (barcode) => {
    setLoading(true);
    setError(null);
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000);
    });
    
    try {
      const fetchPromise = fetch(`${API_BASE}/products?barcode=${encodeURIComponent(barcode)}`);
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 503 && errorData.error === 'Database connection failed') {
          setError('Database connection failed. Please check server configuration.');
          return null;
        } else if (res.status === 404) {
          setError('Product not found');
          return null;
        } else {
          setError(errorData.error || 'Server error occurred');
          return null;
        }
      }
      
      const products = await res.json();
      if (Array.isArray(products) && products.length > 0) {
        return products[0];
      } else {
        setError('Product not found');
        return null;
      }
    } catch (e) {
      console.error('Fetch error:', e);
      if (e.message === 'Request timeout') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(e.message || 'Error contacting server. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error creating product');
      }

      return await res.json();
    } catch (e) {
      console.error('Create product error:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error deleting product');
      }

      return await res.json();
    } catch (e) {
      console.error('Delete product error:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    fetchProduct,
    createProduct,
    deleteProduct,
    clearError,
  };
}; 