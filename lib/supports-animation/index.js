/**
 * Module dependencies.
 */

var _ = require('underscore');
var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];
var animationEndNames = {
  'Animation':'animationend',
  'OAnimation':'oAnimationEnd',
  'MozAnimation':'animationend',
  'WebkitAnimation':'webkitAnimationEnd'
};

module.exports = function () {
  return _.chain(prefixes)
    .map(function (prefix) {
      return prefix + 'Animation';
    })
    .filter(function (s) {
      return typeof document.body.style[s] !== 'undefined';
    })
    .map(function (supportedAnimation) {
      return animationEndNames[supportedAnimation];
    })
    .first()
    .value();
};
