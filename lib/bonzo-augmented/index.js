var sizzle       = require('sizzle');
var bonzo       = require('bonzo');
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
  if ('string' === typeof selector) {
    return bonzo(sizzle((selector || ''), root));
  }

  return bonzo(selector);
};

module.exports.create = function (html) {
  return bonzo.create(html);
};
