// setup file
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({ adapter: new Adapter() });

// Store the original location for restoration
const originalLocation = window.location;

// Store current mock for proper cleanup
let currentLocationMock = null;

// Create a location mock that works with JSDOM's restrictions
const createLocationMock = (url) => {
  const newURL = new URL(url);
  
  return {
    href: newURL.href,
    protocol: newURL.protocol,
    host: newURL.host,
    hostname: newURL.hostname,
    port: newURL.port,
    pathname: newURL.pathname,
    search: newURL.search,
    hash: newURL.hash,
    origin: newURL.origin,
    toString: () => newURL.href,
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  };
};

// Override window location with a more forceful approach
const setWindowLocation = (mockLocation) => {
  currentLocationMock = mockLocation;
  
  // Force override window.location using Object.defineProperty
  try {
    delete window.location;
    window.location = mockLocation;
  } catch (error) {
    // If that fails, try with Object.defineProperty
    try {
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true
      });
    } catch (e) {
      // Final fallback - store in global for manual access
      global.mockLocation = mockLocation;
    }
  }
};

// Make jsdom available globally for tests that need to use jsdom.reconfigure
global.jsdom = {
  reconfigure: (options) => {
    if (options && options.url) {
      const mockLocation = createLocationMock(options.url);
      setWindowLocation(mockLocation);
    }
  }
};

//jest polyfills
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
