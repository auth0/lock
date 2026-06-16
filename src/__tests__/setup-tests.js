// setup file
import '@testing-library/jest-dom';

//jest polyfills
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
