/**
 * Module dependencies.
 */

var Dictionary = require('./dictionary');
var dicts = require('./dicts');
var default_dict = dicts['en'];
var _ = require('underscore');

/**
 * Expose all supported `dicts`
 */

module.exports.dicts = dicts;

/**
 * Retrieve a new `Dictionary` from `lang`
 *
 * @param {String|Object} lang
 * @return {Dictionary}
 * @public
 */

module.exports.getDict = function (lang) {
  if (!lang) {
    return new Dictionary(default_dict);
  }

  if ('string' === typeof lang) {
    var dict = dicts[lang] || dicts[lang.split('-')[0]];
    return new Dictionary(dict || default_dict);
  }

  return new Dictionary(lang);

}
