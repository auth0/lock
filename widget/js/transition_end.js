var transitionendNames = [
    'transitionend',
    'webkitTransitionEnd',
    'MozTransitionEnd',
    'oTransitionEnd'
];

var bean = require('bean');

module.exports.on = function (el, callback) {
  function subscribe(name) {
    bean.on(el, name, function (e) {
      callback(e);
    });
  }
  for (var i = 0; i < transitionendNames.length; i++) {
    subscribe(transitionendNames[i]);
  }
};

module.exports.off = function (el) {
  function subscribe(name) {
    bean.off(el, name);
  }
  for (var i = 0; i < transitionendNames.length; i++) {
    subscribe(transitionendNames[i]);
  }
};