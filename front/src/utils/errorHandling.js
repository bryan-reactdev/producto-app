// front/src/utils/errorHandling.js
// Global error handling utilities for React Native Expo app

/**
 * Standardized error message formatter for API errors
 * @param {unknown} error - The error object
 * @returns {string} Formatted error message for display
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  if (!(error instanceof Error) && typeof error !== 'string') {
    try {
      return JSON.stringify(error);
    } catch {
      return 'An unknown error occurred';
    }
  }
  const errorMessage = (error && error.message) || String(error);
  if (error && error.name === 'TypeError' && errorMessage.includes('fetch')) {
    return 'There was an issue connecting to the server. Please ensure the backend is running.';
  }
  if (
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('ECONNREFUSED')
  ) {
    return 'There was an issue connecting to the server. Please try again later.';
  }
  if (errorMessage === 'Request timeout' || (error && error.name === 'AbortError')) {
    return 'Request timed out. The server might be down or overloaded. Please try again.';
  }
  if (
    errorMessage.includes('NetworkOnMainThreadException') ||
    errorMessage.includes('CLEARTEXT_NOT_PERMITTED')
  ) {
    return 'Network security configuration issue. Please check app permissions.';
  }
  if (
    errorMessage.includes('NSURLErrorDomain') ||
    errorMessage.includes('App Transport Security')
  ) {
    return 'iOS network security blocked the request. Please check app configuration.';
  }
  if (errorMessage.includes('Database connection failed')) {
    return 'Database connection failed. Please check your database configuration.';
  }
  if (
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('Authentication failed')
  ) {
    return 'Authentication failed. Please log in again.';
  }
  if (
    errorMessage.includes('Permission denied') ||
    errorMessage.includes('Access denied')
  ) {
    return 'You do not have permission to perform this action.';
  }
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('required')
  ) {
    return errorMessage;
  }
  if (
    errorMessage.includes('Too many requests') ||
    errorMessage.includes('rate limit')
  ) {
    return 'Too many requests. Please try again later.';
  }
  if (errorMessage.toLowerCase().includes('error loading groups')) {
    return 'There was an issue loading groups. Please try again later or contact support.';
  }
  if (errorMessage.includes('Request failed with status 500')) {
    return 'There was an Internal Server Error.';
  }
  if (errorMessage.includes('Request failed with status 429')) {
    return 'You made too many requests in the last few minutes. Try again later.';
  }
  if (errorMessage.toLowerCase().includes('failed to connect to')) {
    return 'Could not connect to the server. Please ensure the backend is running and reachable.';
  }
  return errorMessage || 'An unknown error occurred.';
};

/**
 * Retry a function with exponential backoff
 * @param {function(): Promise<any>} fn - The function to retry
 * @param {number} [maxRetries=3] - Maximum number of retries
 * @param {number} [baseDelay=300] - Base delay in milliseconds
 * @returns {Promise<any>} The result of the function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 300) => {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) throw error;
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Retrying after ${delay}ms (attempt ${retries + 1} of ${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}; 