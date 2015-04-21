/**
 * Module dependencies.
 */

var _ = require('underscore');
var debug = require('debug')('auth0-lock:mode-sms');
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
 * Expose SMSPanel
 */

module.exports = SMSPanel;

/**
 * Create `SMSPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function SMSPanel(widget, options) {
  if (!(this instanceof SMSPanel)) {
    return new SMSPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SMSPanel');
  }

  this.name = 'sms';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  this.toggleFromSearch = _.debounce(this.toggleFromSearch, 300);
  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SMSPanel.prototype = ocreate(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

SMSPanel.prototype.query = function(selector) {
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

SMSPanel.prototype.create = function(options) {
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

SMSPanel.prototype.render = function() {
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

SMSPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/**
 * Get or set selected country code
 *
 * @param {String} countryCode
 * @return {String}
 * @private
 */

SMSPanel.prototype.countryCode = function(countryCode) {
  if ('undefined' !== typeof countryCode) {
    this.country_code = countryCode;
  } else if ('undefined' === typeof this.country_code) {
    // set default country code
    this.country_code = countryCodes[0].DialCode;
  }
  return this.country_code;
};

/**
 * Get or set phone number
 *
 * @param {String} phoneNumber
 * @return {String}
 * @private
 */

SMSPanel.prototype.phoneNumber = function(phoneNumber) {
  if ('undefined' !== typeof phoneNumber) {
    this.phone_number = phoneNumber;
  }
  return this.phone_number || '';
};

/**
 * Get phone number with country code
 *
 * @return {String}
 * @public
 */

SMSPanel.prototype.fullPhoneNumber = function() {
  return this.countryCode() + this.phoneNumber();
};

/**
 * Get or set sms code
 *
 * @param {String} smsCode
 * @return {String}
 * @private
 */

SMSPanel.prototype.smsCode = function(smsCode) {
  if ('undefined' !== typeof smsCode) {
    this.sms_code = smsCode;
  }
  return this.sms_code || '';
};

/*
 * Render and bind sms sender
 *
 * @private
 */

SMSPanel.prototype.renderAndBindRequestCodeTemplate = function () {
  var self = this;
  var form = this.query('form');

  var requestCodeMarkup = this.widget.render(requestCodeTemplate, {
    countryCodes: countryCodes.map(function (cc) {
      cc.Name = self.options.i18n.t('countryNames:' + cc.Code);
      return cc;
    }),
    selectedCountryCode: this.countryCode(),
    phoneNumber: this.phoneNumber()
  });

  form.empty().append(requestCodeMarkup);

  // bind to submit
  form
    .a0_off()
    .a0_on('submit', bind(this.onsendsmssubmit, this));

  // bind to country code selector
  this.query('#a0-signin_sms_country_code')
    .a0_off()
    .a0_on('click', bind(this.oncountrycodeselectorclick, this));

  // bind to country code search input
  this.query('#a0-sms_search_code')
    .a0_off()
    .a0_on('input', bind(this.oncountrycodesearch, this));

  // bind to country code search form submit
  this.query('form.a0-search')
    .a0_off()
    .a0_on('submit', bind(this.oncountrycodesearch, this));

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

SMSPanel.prototype.renderAndBindSubmitCodeTemplate = function () {
  this.widget._setTitle(this.options.i18n.t('sms:enterSmsCode'));

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
 * @return {SMSPanel}
 * @private
 */

SMSPanel.prototype.bindAll = function() {
  this.renderAndBindRequestCodeTemplate();
};

/**
 * Validate form and continue sending sms
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.onsendsmssubmit = function(e) {
  stop(e);

  var panel = this;
  var widget = this.widget;

  var phone_input = this.query('input[name=phone]');
  var phone_value = phone_input.val();
  var phone_empty = regex.empty.test(phone_value);
  var phone_valid = regex.phone_number.test(phone_value);

  // Clean error container
  widget._showError();
  widget._focusError();

  if (phone_empty) {
    widget._focusError(phone_input);
    return;
  }

  if (!phone_valid) {
    widget._showError(this.options.i18n.t('sms:invalidPhoneNumber'));
    widget._focusError(phone_input);
    return;
  }

  // All validations passed, submitting
  panel.phoneNumber(phone_value);
  widget._requestSMSCode(this, function (err /*, result */ ) {
    if (err) {
      widget._focusError(phone_input);
      panel.phoneNumber(null);
      return;
    }
    panel.renderAndBindSubmitCodeTemplate();
  });
};

/**
 * Validate form and continue signin with sms passcode
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.onsmscodesubmit = function(e) {
  stop(e);
  var panel = this;
  var widget = this.widget;

  var code_input = this.query('input[name=code]');
  var code_value = code_input.val();
  var code_empty = regex.empty.test(code_value);
  var code_valid = regex.sms_passcode.test(code_value);

  // Clean error container
  widget._showError();
  widget._focusError();

  if (code_empty) {
    widget._focusError(code_input);
    return;
  }

  if (!code_valid) {
    widget._showError(this.options.i18n.t('sms:invalidSmsCode'));
    widget._focusError(code_input);
    return;
  }

  // All validations passed, submitting
  panel.smsCode(code_value);
  return widget._signinWithSMSCode(this);
};

/**
 * Reset panel to its initial state
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.onnocodeclick = function (e) {
  stop(e);

  // reset to first step
  this.bindAll();
};

/**
 * Reset panel to its initial state
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.oncountrycodeselectorclick = function (e) {
  stop(e);

  // show list of country codes
  this.query('.a0-request-code-container').toggleClass('a0-hide');
  this.query('.a0-country-codes').toggleClass('a0-hide');
  this.widget.header.toggleTitle();
};

/**
 * Handle country code search
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.oncountrycodesearch = function (e) {
  stop(e);

  // show new code in input
  var search = this.query('[name="search-code"]').val();
  this.toggleFromSearch(search);
  return false;
};

/**
 * Handle country code change
 *
 * @param {Event} e
 * @private
 */

SMSPanel.prototype.oncountrycodechange = function (e) {
  stop(e);

  var code = this.countryCode(e.currentTarget.attributes['data-value'].value);

  // show new code in input
  this
    .query('#a0-signin_sms_country_code')
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
  this.query('.a0-request-code-container').toggleClass('a0-hide');
  this.query('.a0-country-codes').toggleClass('a0-hide');
  this.widget.header.toggleTitle();

  // restore state
  this.toggleFromSearch('');
  this.query('[name="search-code"]').val('')
};

SMSPanel.prototype.toggleFromSearch = function (search) {
  // restore state
  this.query('.a0-country-codes-list > li').removeClass('a0-hide');

  // if search is empty, return fast
  if (!search.length) return;

  // otherwise hide everything not matching `query`
  var query = '.a0-country-codes-list > li:not([data-index*="' + search + '"])';
  this.query(query).addClass('a0-hide');
}
