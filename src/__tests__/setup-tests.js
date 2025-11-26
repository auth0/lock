// setup file
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({ adapter: new Adapter() });

// Expose jsdom reconfigure globally by accessing the test environment's jsdom instance
// jest-environment-jsdom runs tests inside a JSDOM instance
if (typeof window !== 'undefined' && window) {
  try {
    // Find the jsdom Window constructor through the global window object
    const getJSDOMInstance = (obj) => {
      // Try to find a property that looks like it holds the JSDOM instance
      for (const key of Object.keys(obj)) {
        if (obj[key] && typeof obj[key] === 'object' && obj[key].reconfigure) {
          return obj[key];
        }
      }
      // Check symbols
      for (const sym of Object.getOwnPropertySymbols(obj)) {
        if (obj[sym] && typeof obj[sym] === 'object' && obj[sym].reconfigure) {
          return obj[sym];
        }
      }
      return null;
    };

    // Try to get JSDOM from window or document
    const jsdomInstance = getJSDOMInstance(window) || getJSDOMInstance(window.document || {});

    if (jsdomInstance) {
      global.jsdom = jsdomInstance;
    }
  } catch (e) {
    // Silently fail - setURL will use fallback
  }
}

//jest polyfills
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
