// Code attribution
// Inlined and modified from https://github.com/browserify/node-util/blob/e37ce41f4063bcd7bc27e01470d6654053bdcd14/util.js#L33-L69
// Copyright Joyent, Inc. and other Node contributors.
// Please see LICENSE for full copyright and license attribution.
const formatRegExp = /%[sdj%]/g;

export default function format(f) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || !isObject(x)) {
      str += ' ' + x;
    } else if (x !== null) {
      str += ' ' + JSON.stringify(x);
    }
  }
  return str;
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
