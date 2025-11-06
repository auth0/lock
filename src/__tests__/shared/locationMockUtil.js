/**
 * Shared utility for mocking window.location in tests
 * 
 * This utility provides a safe, consistent way to mock window.location
 * across all test files without using the unsafe `delete window.location` pattern.
 */

/**
 * Creates a mock location object compatible with the Location API
 * @param {string} url - The URL to create a mock location for
 * @returns {Object} Mock location object
 */
export const createLocationMock = (url) => {
  const mockURL = new URL(url);
  
  return {
    href: mockURL.href,
    protocol: mockURL.protocol,
    host: mockURL.host,
    hostname: mockURL.hostname,
    port: mockURL.port,
    pathname: mockURL.pathname,
    search: mockURL.search,
    hash: mockURL.hash,
    origin: mockURL.origin,
    toString: () => mockURL.href,
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  };
};

/**
 * Safely overrides window.location with a mock location object
 * Uses Object.defineProperty as the primary approach for better security
 * @param {Object} mockLocation - The mock location object to set
 */
export const setWindowLocation = (mockLocation) => {
  try {
    // Use Object.defineProperty as the primary approach - safer and more reliable
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true
    });
  } catch (error) {
    // Fallback: Try to set it directly if Object.defineProperty fails
    try {
      window.location = mockLocation;
    } catch (e) {
      // Final fallback - store in global for manual access
      global.mockLocation = mockLocation;
      console.warn('Could not override window.location, using global.mockLocation instead');
    }
  }
};

/**
 * Main utility function to mock window.location with a given URL
 * Combines createLocationMock and setWindowLocation for convenience
 * @param {string} url - The URL to mock
 */
export const mockWindowLocation = (url) => {
  const mockLocation = createLocationMock(url);
  setWindowLocation(mockLocation);
  return mockLocation;
};
