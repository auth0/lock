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
 * Safely access window.location properties with proper error handling
 * @param {string} property - The location property to access
 * @param {any} fallback - Fallback value if property is not accessible
 * @param {string} functionName - Name of the calling function for logging
 * @returns {any} - Property value or fallback
 */
const safeLocationAccess = (property, fallback, functionName) => {
  try {
    if (typeof window === 'undefined' || !window.location) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${functionName}: window.location not available, using fallback`);
      }
      return fallback;
    }
    return window.location[property];
  } catch (error) {
    if (error.name === 'SecurityError' || error.message.includes('cross-origin') || 
        error.message.includes('Permission denied')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`${functionName}: Cross-origin access restricted, using fallback`, error.message);
      }
      return fallback;
    }
    throw error;
  }
};

export const getCurrentLocationHref = () => safeLocationAccess('href', 'http://localhost/', 'getCurrentLocationHref');
export const getCurrentLocationPathname = () => safeLocationAccess('pathname', '/', 'getCurrentLocationPathname');
export const getCurrentLocationSearch = () => safeLocationAccess('search', '', 'getCurrentLocationSearch');
