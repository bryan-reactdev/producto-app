import { EXPO_PUBLIC_API_URL } from '@env';
import { Platform } from 'react-native';

/**
 * Centralized API configuration
 * This file provides API configuration that can be reused across the application
 */

// Use configurable API URL from environment variables
export const API_URL = EXPO_PUBLIC_API_URL || 'http://192.168.3.182:3000';
export const API_BASE = `${API_URL}/api`;


/**
 * Generate a complete API endpoint URL
 * @param {string} path - The API endpoint path (without /api prefix)
 * @returns {string} Complete API URL
 */
export const getApiUrl = (path) => {
  // Ensure path starts with a slash if not empty
  const formattedPath = path && !path.startsWith('/') ? `/${path}` : path;
  const fullUrl = `${API_BASE}${formattedPath || ''}`;
  return fullUrl;
};

/**
 * Generate a complete resource URL (for images, files, etc.)
 * @param {string} path - The resource path
 * @returns {string} Complete resource URL
 */
export const getResourceUrl = (path) => {
  // Ensure path starts with a slash if not empty
  const formattedPath = path && !path.startsWith('/') ? `/${path}` : path;
  return `${API_URL}${formattedPath || ''}`;
}; 