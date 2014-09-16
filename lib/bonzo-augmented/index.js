var sizzle       = require('sizzle');
var bonzo       = require('bonzo');
var bean        = require('bean');

function generate(name) {
  return function (event, handler) {
    return this.each(function (el) {
      bean[name](el, event, handler);
    });
  }
}

bonzo.aug({
  a0_on:    generate('on'),
  a0_off:   generate('off'),
  a0_one:   generate('one'),

  // a0_once is an alias of one
  a0_once:  generate('one')
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
