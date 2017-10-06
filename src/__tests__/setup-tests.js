// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-dom/node_modules/fbjs/lib/warning');

configure({ adapter: new Adapter() });

//jest polyfills
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
