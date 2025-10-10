// setup file
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}


configure({ adapter: new Adapter() });

//jest polyfills
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
