/**
 * Module dependencies.
 */

var format = require('util').format;
var createPolicy = require('password-sheriff');
var $ = require('../bonzo-augmented');
var isSmallScreen = require('../is-small-screen');

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
  var panel = $('.a0-panel');

  // TODO Debounce?
  pwd.a0_on('keyup', function () {
    var missing = policy.missing(pwd.val());
    el.html(flatDescriptions(missing, 0));

    panel.addClass('a0-active-pwd-strength');

    if($('.a0-password_policy .a0-checked').length === $('.a0-password_policy li').length) {
      panel.removeClass('a0-active-pwd-strength');
    }
  });

  panel.a0_on('touchstart', function (e) {
    if(isSmallScreen() && e.target.nodeName !== 'INPUT') {
      document.activeElement.blur();
    }
  });

  pwd.a0_on('blur', function () {
    if(!isSmallScreen()) {
      panel.removeClass('a0-active-pwd-strength');
    }
  });
};

function flatSingleDescription (description, index) {
  var result = (new Array(index+1)).join(' ');
  var verified = (description.verified ? 'a0-checked' : '');
  var message;

  if (description.format) {
    message = format.apply(null, [description.message].concat(description.format));
  } else {
    message = description.message;
  }

  var childrenDescription = flatDescriptions(description || {}, index + 1);

  result += format('<li class="%s">%s%s</li>', verified, message, childrenDescription);

  return result;
}

function flatDescriptions (descriptions, index) {
  if (!(descriptions.rules && descriptions.rules.length) &&
      !(descriptions.items && descriptions.items.length)) {
    return '';
  }

  var items = descriptions.rules || descriptions.items;

  var firstDescription = flatSingleDescription(items[0], index);

  descriptions = items.slice(1).reduce(function (result, description) {
    return result + '\n' + flatSingleDescription(description, index);
  }, firstDescription);

  return '<ul>' + descriptions + '</ul>';
}
