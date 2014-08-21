/**
 * Module dependencies.
 */

var format = require('util').format;
var createPolicy = require('password-sheriff');

/**
 * Expose PasswordStrength
 */
module.exports = PasswordStrength;

/**
 * Create `PasswordStrength`
 *
 * @param {Object} el     Element where the PasswordStrength will be render
 * @param {Object} pwdEl  Password element to validate
 * @constructor
 */
function PasswordStrength(el, pwdEl, options) {
  this.el = el;
  this.pwdEl = pwdEl;
  this.options = options;

  // TODO Feature currently disabled
  this.bindAll();
}

/**
 * Bind events to `this.pwdEl`
 */
PasswordStrength.prototype.bindAll = function () {
  var connection  = this.options._getAuth0Connection();
  var policy = createPolicy(connection.passwordPolicy);
  var pwd = this.pwdEl;
  var el = this.el;

  // TODO Debounce?
  pwd.a0_on('keyup', function () {
    var missing = policy.missing(pwd.val());
    el.html(flatDescriptions(missing, 0));
  });
  var missing = policy.missing(pwd.val());
  el.html(flatDescriptions(missing, 0));
};

function flatSingleDescription (description, index) {
  var result = (new Array(index+1)).join(' ');
  var verified = (description.verified ? 'a0-checked' : '');
  var childrenDescription = flatDescriptions(description.items || [], index + 1);

  result += format('<li class="%s">%s%s</li>', verified, description.message, childrenDescription);

  return result;
}

function flatDescriptions (descriptions, index) {
  if (!descriptions.length) {
    return '';
  }

  var firstDescription = flatSingleDescription(descriptions[0], index);

  descriptions = descriptions.slice(1).reduce(function (result, description) {
    return result + '\n' + flatSingleDescription(description, index);
  }, firstDescription);

  return '<ul>' + descriptions + '</ul>';
}
