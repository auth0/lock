/**
 * Expose `LoginError`
 */

module.exports = ValidationError;

/**
 * Create a `ValidationError` by extend of `Error`
 *
 * @param {String} mesage
 * @public
 */

function ValidationError(message) {
  message = message || 'Validation error';

  var err = Error.call(this, message);

  return err;
}

/**
 * Extend `ValidationError.prototype` with `Error.prototype`
 * and `ValidationError` as constructor
 */

if (Object && Object.create) {
  ValidationError.prototype = Object.create(Error.prototype, {
    constructor: { value: ValidationError }
  });
}
