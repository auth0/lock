var _ = require('underscore');

module.exports = function () {
  return _.chain(['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''])
          .map(function (prefix) {
            return prefix + 'Animation';
          })
          .some(function (s) {
            return typeof document.body.style[s] !== 'undefined';
          });
};