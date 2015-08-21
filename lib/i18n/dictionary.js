/**
 * Module dependencies.
 */

var dicts = require('./dicts');
var default_dict = dicts['en'];

/**
 * Expose `Dictionary`
 */

module.exports = Dictionary;

/**
 * Initialize a `Dictionary` with `data`
 *
 * @param {Object} data
 * @class
 */

function Dictionary (data) {
  this._data = data;
}

/**
 * Translation finder `t`
 *
 * @param {String} key
 * @return {String|undefined}
 * @public
 */

Dictionary.prototype.t = function (key) {
  return findProp(this._data, key) || findProp(default_dict, key);
}

/**
 * Helper `findProp`
 */

function findProp(o, s) {
  s = s.replace(/\[(\w+)\]/g, ':$1'); // convert indexes to properties
  s = s.replace(/^\:/, '');           // strip a leading dot
  var a = s.split(':');
  while (a.length) {
    var n = a.shift();
    if (n in o) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}
