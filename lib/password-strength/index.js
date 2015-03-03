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
  var self = this;
  var panel = $('.a0-panel');
  var initialized = false;

  // TODO Debounce?
  pwd.a0_on('input', function () {
    showPasswordErrors(); 
  });

  pwd.a0_on('focus', function() {
    showPasswordErrors(); 
  });

  panel.a0_on('touchstart', function (e) {
    if(isSmallScreen() && e.target.nodeName !== 'INPUT') {
      document.activeElement.blur();
    }
    initialized = false;
  });

  pwd.a0_on('blur', function () {
    var missing = policy.missing(pwd.val());
    var pwdIsEmpty = pwd.val().length === 0;

    if(!isSmallScreen()) {
      panel.removeClass('a0-active-pwd-strength');
    }
    $('.a0-password .a0-input-box').toggleClass('a0-error-input', !missing.verified && !pwdIsEmpty );
    initialized = false;
  });

  function showPasswordErrors() {
    var missing = policy.missing(pwd.val());
    var pwdIsEmpty = pwd.val().length === 0;

    el.html(flatDescriptions(self.options, missing, 0));

    var showPwdStrength = !missing.verified && (!pwdIsEmpty || initialized);

    panel.toggleClass('a0-active-pwd-strength', showPwdStrength);
    $('.a0-password .a0-input-box').toggleClass('a0-error-input', showPwdStrength);

    initialized = showPwdStrength;
  }
};

function flatSingleDescription (options, description, index) {
  var result = (new Array(index+1)).join(' ');
  var verified = (description.verified ? 'a0-checked' : '');
  var message = options.i18n.t('signup:passwordStrength:' + description.code);

  if (description.format) {
    message = format.apply(null, [message].concat(description.format));
  }

  var childrenDescription = flatDescriptions(options, description || {}, index + 1);
  result += format('<li class="%s">%s%s</li>', verified, message, childrenDescription);

  return result;
}

function flatDescriptions (options, descriptions, index) {
  if (!(descriptions.rules && descriptions.rules.length) &&
      !(descriptions.items && descriptions.items.length)) {
    return '';
  }

  var items = descriptions.rules || descriptions.items;

  var firstDescription = flatSingleDescription(options, items[0], index);

  descriptions = items.slice(1).reduce(function (result, description) {
    return result + '\n' + flatSingleDescription(options, description, index);
  }, firstDescription);

  return '<ul>' + descriptions + '</ul>';
}
