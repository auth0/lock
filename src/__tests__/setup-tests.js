// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

//jest polyfills
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
