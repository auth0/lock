/**
 * Expose `get_viewport`
 */

module.exports = get_viewport;

/**
 * Get window viewport `height` and `width`
 *
 * @return {Object} `width` and `height` properties
 * @api public
 */

function get_viewport() {
  return {
    width: Math.max(document.body.clientWidth, window.innerWidth || 0),
    height: Math.max(document.body.clientHeight, window.innerHeight || 0)
  }
}