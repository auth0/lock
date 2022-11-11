// setup file
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({ adapter: new Adapter() });

//jest polyfills
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
