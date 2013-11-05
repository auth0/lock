module.exports = {
  parseUrl: function (url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser;
  },

  endsWith: function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
};
