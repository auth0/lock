/**
 * Module dependencies.
 */

var ua = navigator.userAgent.toLowerCase();

/**
 * Expose `is_old_ie`
 */

module.exports = is_old_ie;

/**
 * Check if is and old version of
 * Internet Explorer. Meaning <10
 *
 * @api public
 */

function is_old_ie() {
  return ~ua.indexOf('msie') && parseInt(ua.split('msie')[1], 10) < 10
}