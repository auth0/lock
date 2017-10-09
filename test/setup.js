import 'core-js/es6/map';
import 'core-js/es6/set';

window.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
