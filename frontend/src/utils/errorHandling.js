/**
 * Standardized error message formatter for API errors
 * @param {Error} error - The error object
 * @returns {string} Formatted error message for display
 */
export const getErrorMessage = (error) => {
  // Check if error is null or undefined
  if (!error) {
    return 'An unknown error occurred';
  }

  // Convert non-Error objects to string
  if (!(error instanceof Error) && typeof error !== 'string') {
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'An unknown error occurred';
    }
  }

  // Get error message
  const errorMessage = error.message || String(error);

  // Check for specific network errors that indicate server is down
  if (error.name === 'TypeError' && errorMessage.includes('fetch')) {
    return 'Server is not running. Please start the backend server and try again.';
  }
  
  if (errorMessage.includes('Network request failed') || 
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('ECONNREFUSED')) {
    return 'Network connection failed. Check your internet connection and server status.';
  }
  
  if (errorMessage === 'Request timeout' || error.name === 'AbortError') {
    return 'Request timed out. The server might be down or overloaded. Please try again.';
  }

  // Android-specific network errors
  if (errorMessage.includes('NetworkOnMainThreadException') || 
      errorMessage.includes('CLEARTEXT_NOT_PERMITTED')) {
    return 'Network security configuration issue. Please check app permissions.';
  }

  // iOS-specific network errors
  if (errorMessage.includes('NSURLErrorDomain') || 
      errorMessage.includes('App Transport Security')) {
    return 'iOS network security blocked the request. Please check app configuration.';
  }

  // Database connection errors
  if (errorMessage.includes('Database connection failed')) {
    return 'Database connection failed. Please check your database configuration.';
  }

  // Authentication errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Authentication failed')) {
    return 'Authentication failed. Please log in again.';
  }

  // Permission errors
  if (errorMessage.includes('Permission denied') || errorMessage.includes('Access denied')) {
    return 'You do not have permission to perform this action.';
  }

  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('required')) {
    return errorMessage; // Return the original validation error
  }

  // Rate limiting errors
  if (errorMessage.includes('Too many requests') || errorMessage.includes('rate limit')) {
    return 'Too many requests. Please try again later.';
  }
  
  // Default error message
  return errorMessage || 'Network error. Please check your connection and try again.';
};

/**
 * Image modal helper to reduce boilerplate
 */
export const handleImagePress = (setModalImageSource, setImageModalVisible) => (imageSource) => {
  setModalImageSource(imageSource);
  setImageModalVisible(true);
};

/**
 * Image modal close helper
 */
export const handleImageModalClose = (setModalImageSource, setImageModalVisible) => () => {
  setImageModalVisible(false);
  setModalImageSource(null);
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise<any>} - The result of the function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 300) => {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Retrying after ${delay}ms (attempt ${retries + 1} of ${maxRetries})...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}; 