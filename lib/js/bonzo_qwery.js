var qwery       = require('qwery');
var bonzo       = require('bonzo');
var domready = require('domready');
var bean        = require('bean');

bonzo.aug({
  a0_on: function (event, handler) {
    return this.each(function (el) {
      bean.on(el, event, handler);
    });
  },
  a0_off: function (event, handler) {
    return this.each(function (el) {
      bean.off(el, event, handler);
    });
  }
});

module.exports = function (selector, root) {
  if (typeof selector === 'function') {
    return domready(selector);
  }
  return bonzo(qwery('#a0-widget ' + (selector || ''), root));
};

module.exports.create = function (html) {
  return bonzo.create(html);
};