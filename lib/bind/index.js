/**
 * Expose `bind`
 */

module.exports = bind;

/**
 * Bind `fn` to `obj`
 */
function bind(fn, obj) {
  return function binded() {
    return fn.apply(obj, arguments);
  }
}
