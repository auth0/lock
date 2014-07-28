var _ = require('underscore');

module.exports = {
  parseUrl: function (url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  },

  endsWith: function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  },

  extract: function (obj, props) {
    var pre = _.pick(obj, props);

    return _.chain(_.pairs(pre))
            .filter(function (pair) {
              return typeof pair[1] !== 'undefined';
            }).reduce(function (r, current) {
              r[current[0]] = current[1];
              return r;
            }, {}).value();
  }
};
