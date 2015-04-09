/**
 * Module dependencies.
 */

var _ = require('underscore');
// var debug = require('debug')('auth0-lock:mode-passwordless');
var bind = require('../bind');
var regex = require('../regex');
var stop = require('../stop-event');
var $ = require('../bonzo-augmented');
var defaultTemplate = require('./default.ejs');
var requestCodeTemplate = require('./request-code.ejs');
var submitCodeTemplate = require('./submit-code.ejs');
var countryCodes = require('./country-codes.json');
var ocreate = require('../object-create');
var Emitter = require('events').EventEmitter;

/**
 * Expose PasswordlessPanel
 */

module.exports = PasswordlessPanel;

/**
 * Create `PasswordlessPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function PasswordlessPanel(widget, options) {
  if (!(this instanceof PasswordlessPanel)) {
    return new PasswordlessPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for PasswordlessPanel');
  }

  this.name = 'passwordless';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

PasswordlessPanel.prototype = ocreate(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

PasswordlessPanel.prototype.query = function(selector) {
  if (!this.el) { throw new Error('Can\'t get element since no `el` is set to local context'); }
  return $(selector, this.el);
};

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

PasswordlessPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(defaultTemplate, opts))[0];
  this.bindAll();
  return this.el;
};

/**
 * Return `el` or create it
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

PasswordlessPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
};

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

PasswordlessPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/**
 * Get or set selected country code
 *
 * @param {String} countryCode
 * @return {String}
 * @private
 */

PasswordlessPanel.prototype.countryCode = function(countryCode) {
  if (typeof countryCode !== 'undefined') {
    this.options.countryCode = countryCode;
  }
  return this.options.countryCode;
};

/**
 * Get or set phone number
 *
 * @param {String} phoneNumber
 * @return {String}
 * @private
 */

PasswordlessPanel.prototype.phoneNumber = function(phoneNumber) {
  if (typeof phoneNumber !== 'undefined') {
    this.options.phoneNumber = phoneNumber;
  }
  return this.options.phoneNumber;
};

/*
 * Render and bind sms sender
 *
 * @private
 */
PasswordlessPanel.prototype.renderAndBindSMS = function () {
  // set default country code
  this.countryCode(countryCodes[0].DialCode);
  
  var form = this.query('form');
  var requestCodeMarkup = this.widget.render(requestCodeTemplate, {
    countryCodes: countryCodes,
    selectedCountryCode: this.countryCode()
  });
  
  form.empty().append(requestCodeMarkup);

  // bind to submit
  form
    .a0_off()
    .a0_on('submit', bind(this.onsendsmssubmit, this));
  
  // bind to country code selector
  this
    .query('#a0-signin_passwordless_country_code')
    .a0_off()
    .a0_on('click', bind(this.oncountrycodeselectorclick, this));

  // bind to country code item
  this
    .query('.a0-country-codes-list > li')
    .a0_off()
    .a0_on('click', bind(this.oncountrycodechange, this));
};

/*
 * Render and bind sms code sender
 *
 * @private
 */
PasswordlessPanel.prototype.renderAndBindSMSCode = function () {
  this.widget._setTitle(this.options.i18n.t('passwordless:enterSmsCode'));

  var form = this.query('form');
  var submitCodeMarkup = this.widget.render(submitCodeTemplate, {
    countryCode: this.countryCode(),
    phoneNumber: this.phoneNumber()
  });

  form.empty().append(submitCodeMarkup);

  // bind to submit
  form.a0_off().a0_on('submit', bind(this.onsmscodesubmit, this));

  // bind to no code button
  this.query('.a0-no-code').a0_off().a0_on('click', bind(this.onnocodeclick, this));
};

/**
 * Bind events to `this.el`, like submit
 *
 * @return {PasswordlessPanel}
 * @private
 */

PasswordlessPanel.prototype.bindAll = function() {
  this.renderAndBindSMS();
  this.query('input').val('');
};

/**
 * Validate form and continue sending sms
 *
 * @param {Event} e
 * @private
 */
PasswordlessPanel.prototype.onsendsmssubmit = function(e) {
  stop(e);
  var panel = this;
  var widget = this.widget;

  var ok = true;
  var phone_input = this.query('input[name=phone]');
  var phone_val = phone_input.val();
  var phone_empty = regex.empty.test(phone_val);

  // Clean error container
  widget._showError();
  widget._focusError();

  if (phone_empty) {
    widget._focusError(phone_input);
    ok = false;
  }

  if (ok) {
    panel.phoneNumber(phone_val);
    widget._requestSMSCode(this, function (err /*, result */ ) {
      if (err) {
        panel.phoneNumber(null);
      }
      panel.renderAndBindSMSCode();
    });
  }
};

/**
 * Validate form and continue signin with sms passcode
 *
 * @param {Event} e
 * @private
 */
PasswordlessPanel.prototype.onsmscodesubmit = function(e) {
  stop(e);
  var panel = this;
  var widget = this.widget;

  var ok = true;
  var code_input = this.query('input[name=code]');
  var code_val = code_input.val();
  var code_empty = regex.empty.test(code_val);

  // Clean error container
  widget._showError();
  widget._focusError();

  if (code_empty) {
    widget._focusError(code_input);
    ok = false;
  }

  if (ok) {
    panel.options.smsCode = code_val;
    return widget._signinWithSMSCode(this);
  }
};

/**
 * Reset panel to its initial state
 *
 * @param {Event} e
 * @private
 */
PasswordlessPanel.prototype.onnocodeclick = function (e) {
  stop(e);
  
  // reset panel
  this.countryCode(countryCodes[0].DialCode);
  this.phoneNumber(null);
  
  this.bindAll();
};

/**
 * Reset panel to its initial state
 *
 * @param {Event} e
 * @private
 */
PasswordlessPanel.prototype.oncountrycodeselectorclick = function (e) {
  stop(e);

  // show list of country codes
  this.query('.a0-sms').toggleClass('a0-hide');
  this.query('.a0-country-code').toggleClass('a0-hide');
};

/**
 * Handle country code change
 *
 * @param {Event} e
 * @private
 */
PasswordlessPanel.prototype.oncountrycodechange = function (e) {
  stop(e);

  var code = this.countryCode(e.currentTarget.attributes['data-value'].value);

  // show new code in input
  this
    .query('#a0-signin_passwordless_country_code')
    .html(code);

  // remove active class from old code in list
  this
    .query('.a0-country-codes-list > li.a0-active')
    .removeClass('a0-active');
  
  // add active class to new code in list
  this
    .query('.a0-country-codes-list > li[data-value="' + code + '"]')
    .addClass('a0-active');

  // show form
  this.query('.a0-sms').toggleClass('a0-hide');
  this.query('.a0-country-code').toggleClass('a0-hide');
};
