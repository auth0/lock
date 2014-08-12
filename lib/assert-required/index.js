/**
 * Expose `required`
 */

module.exports = required;

/**
 * Assert `prop` as requirement at `obj`
 *
 * @param {Object} obj
 * @param {prop} prop
 * @public
 */

function required (prop, obj) {
  if (!obj[prop]) {
    throw new Error(prop + ' is required.');
  }
}
