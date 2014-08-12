/**
 * Expose `stop`
 */

module.exports = stop;

/**
 * Call `preventDefault` and `stopPropagation` on `e`
 *
 * @param {Event} e
 * @return {Event}
 * @public
 */

function stop(e) {
  e.preventDefault();
  e.stopPropagation();
  return e;
}
