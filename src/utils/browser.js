// Browser-related utility functions

/**
 * Check if the current location host matches the given domain
 * This is used to determine if we're running in Universal Login Page context
 * 
 * @param {string} domain - The domain to check against
 * @returns {boolean} - True if current host matches domain, false otherwise
 * 
 * Fallbacks are used in:
 * - Server-side rendering environments
 * - Test environments with mocked/restricted window.location
 * - Web Workers or other contexts without window.location
 */
export const isUniversalLoginPage = (domain) => {
  try {
    // Check if window and location exist
    if (typeof window === 'undefined' || !window.location) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('isUniversalLoginPage: window.location not available, returning false');
      }
      return false;
    }
    return window.location.host === domain;
  } catch (error) {
    // Only catch specific errors related to restricted access
    if (error.name === 'SecurityError' || error.message.includes('cross-origin') || 
        error.message.includes('Permission denied')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('isUniversalLoginPage: Cross-origin access restricted, returning false', error.message);
      }
      return false;
    }
    // Re-throw unexpected errors to avoid hiding bugs
    throw error;
  }
};

/**
 * Get the current location href
 * This can be mocked in tests
 * 
 * @returns {string} - Current page URL or fallback URL
 * 
 * Fallbacks are used in:
 * - Server-side rendering environments
 * - Test environments with mocked/restricted window.location
 * - Web Workers or other contexts without window.location
 */
export const getCurrentLocationHref = () => {
  try {
    // Check if window and location exist
    if (typeof window === 'undefined' || !window.location) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationHref: window.location not available, using fallback URL');
      }
      return 'http://localhost/';
    }
    return window.location.href;
  } catch (error) {
    // Only catch specific errors related to restricted access
    if (error.name === 'SecurityError' || error.message.includes('cross-origin') || 
        error.message.includes('Permission denied')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationHref: Cross-origin access restricted, using fallback URL', error.message);
      }
      return 'http://localhost/';
    }
    // Re-throw unexpected errors to avoid hiding bugs
    throw error;
  }
};

/**
 * Get the current location pathname
 * This can be mocked in tests
 * 
 * @returns {string} - Current page pathname or fallback pathname
 * 
 * Fallbacks are used in:
 * - Server-side rendering environments
 * - Test environments with mocked/restricted window.location
 * - Web Workers or other contexts without window.location
 */
export const getCurrentLocationPathname = () => {
  try {
    // Check if window and location exist
    if (typeof window === 'undefined' || !window.location) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationPathname: window.location not available, using fallback pathname');
      }
      return '/';
    }
    return window.location.pathname;
  } catch (error) {
    // Only catch specific errors related to restricted access
    if (error.name === 'SecurityError' || error.message.includes('cross-origin') || 
        error.message.includes('Permission denied')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationPathname: Cross-origin access restricted, using fallback pathname', error.message);
      }
      return '/';
    }
    // Re-throw unexpected errors to avoid hiding bugs
    throw error;
  }
};

/**
 * Get the current location search
 * This can be mocked in tests
 * 
 * @returns {string} - Current page search parameters or empty string
 * 
 * Fallbacks are used in:
 * - Server-side rendering environments  
 * - Test environments with mocked/restricted window.location
 * - Web Workers or other contexts without window.location
 */
export const getCurrentLocationSearch = () => {
  try {
    // Check if window and location exist
    if (typeof window === 'undefined' || !window.location) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationSearch: window.location not available, returning empty string');
      }
      return '';
    }
    return window.location.search;
  } catch (error) {
    // Only catch specific errors related to restricted access
    if (error.name === 'SecurityError' || error.message.includes('cross-origin') || 
        error.message.includes('Permission denied')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('getCurrentLocationSearch: Cross-origin access restricted, returning empty string', error.message);
      }
      return '';
    }
    // Re-throw unexpected errors to avoid hiding bugs
    throw error;
  }
};
