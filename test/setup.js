import 'core-js/es/map';
import 'core-js/es/set';

window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
