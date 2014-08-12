/**
 * Module dependencies.
 */

var _ = require('underscore');
var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];

module.exports = function () {
  return _.chain(prefixes)
    .map(function (prefix) {
      return prefix + 'Animation';
    })
    .some(function (s) {
      return typeof document.body.style[s] !== 'undefined';
    });
};
