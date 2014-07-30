var bonzo_augmented = require('./bonzo_augmented');

module.exports = function (selector, root) {
  if (typeof selector === 'function') {
    return bonzo_augmented(selector);
  }

  return bonzo_augmented('#a0-widget ' + (selector || ''), root);
};

module.exports.create = function (html) {
  return bonzo_augmented.create(html);
};
