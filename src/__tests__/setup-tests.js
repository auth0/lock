// setup file
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { createLocationMock, setWindowLocation } from './shared/locationMockUtil';

configure({ adapter: new Adapter() });

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
