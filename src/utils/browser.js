// Browser-related utility functions

/**
 * Check if the current location host matches the given domain
 * This is used to determine if we're running in Universal Login Page context
 */
export const isUniversalLoginPage = (domain) => {
  try {
    return window.location.host === domain;
  } catch (error) {
    // Fallback for environments where window.location is not available
    return false;
  }
};

/**
 * Get the current location href
 * This can be mocked in tests
 */
export const getCurrentLocationHref = () => {
  try {
    return window.location.href;
  } catch (error) {
    // Fallback for environments where window.location is not available
    return 'http://localhost/';
  }
};

/**
 * Get the current location pathname
 * This can be mocked in tests
 */
export const getCurrentLocationPathname = () => {
  try {
    return window.location.pathname;
  } catch (error) {
    // Fallback for environments where window.location is not available
    return '/';
  }
};

/**
 * Get the current location search
 * This can be mocked in tests
 */
export const getCurrentLocationSearch = () => {
  try {
    return window.location.search;
  } catch (error) {
    // Fallback for environments where window.location is not available
    return '';
  }
};
