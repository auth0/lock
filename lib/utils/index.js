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
  },

  isCordova: function () {
    return !!window.cordova;
  },

  isIOS: function () {
    if (window.navigator &&
        window.navigator.userAgent &&
          window.navigator.userAgent.match) {
      // navigator.userAgent examples:
      //
      // Safari Mobile (iPhone)
      // -------------
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 10_10_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4"
      //
      // Phonegap (iPhone)
      // --------
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 10_10_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B411 (2050749072)"
      //
      // Safari Mobile (iPad)
      // -------------
      // Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10
      return !!navigator.userAgent.match(/.*iPhone OS.*/);
    }
    return false;
  }
};
