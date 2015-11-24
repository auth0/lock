/**
 * Module dependencies.
 */

var _ = require('underscore');
var debug = require('debug')('auth0-lock:mode-reset');
var $ = require('../bonzo-augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var stop = require('../stop-event');
var bind = require('../bind');
var template = require('./reset.ejs');
var regex = require('../regex');
var PasswordStrength = require('../password-strength');
var ValidationError = require('../errors/ValidationError');
var empty = regex.empty;
var trim = require('trim');
var email_parser = regex.email_parser;
var slice = Array.prototype.slice;

/**
 * Expose ResetPanel
 */

module.exports = ResetPanel;

/**
 * Create `ResetPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function ResetPanel(widget, options) {
  if (!(this instanceof ResetPanel)) {
    return new ResetPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for ResetPanel');
  }

  this.name = 'reset';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

ResetPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

ResetPanel.prototype.query = function(selector) {
  if (!this.el) throw new Error('Can\'t get element since no `el` is set to local context');
  return $(selector, this.el);
};

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

ResetPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
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

ResetPanel.prototype.render = function() {
  return null != this.el ? this.el : this.create.apply(this, arguments);
};

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

ResetPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/**
 * Bind events to `this.el`, like submit
 *
 * @return {ResetPanel}
 * @private
 */

ResetPanel.prototype.bindAll = function() {
  var options = this.options;

  // hide only and only if set to false
  this.query('.a0-options')
    .toggleClass('a0-hide', !options.showResetAction);

  this.query('form')
    .a0_off('submit')
    .a0_on('submit', bind(this.onsubmit, this));

  this.query('.a0-options .a0-cancel')
    .a0_on('click', bind(this.oncancel, this));

  this.query('input[name=email]')
    .a0_on('input', bind(this.onemailinput, this));

  var passwordStrength = new PasswordStrength(this.query('.a0-password_policy'),
                                              this.query('#a0-reset_easy_password'),
                                              this.options);

  return this;
};

/**
 * Handler for email input event
 *
 * @param {Event} e
 * @private
 */
ResetPanel.prototype.onemailinput = function() {
  var mailField = this.query('input[name=email]');
  var email = mailField.val();

  if (this.options._isConnectionEmail(email)) {

    var widget = this.widget;
    widget._setPreviousPanel('reset');
    widget._showSuccess();
    widget._showError();
    widget._focusError();
    widget._signinPanel();
    widget._setEmail(email);
    return;
  }
};

/**
 * Handler for `submit` form event
 *
 * @param {Event} e
 * @private
 */

ResetPanel.prototype.onsubmit = function(e) {
  stop(e);

  if (!this.valid()) { return; }
  this.submit();
};

/**
 * Handler for `cancel` event click
 *
 * @param {Event} e
 * @private
 */

ResetPanel.prototype.oncancel = function(e) {
  stop(e);
  var widget = this.widget;
  widget._showSuccess();
  widget._showError();
  widget._focusError();
  widget._signinPanel();
};

/**
 * Validate form for errros before `submit`
 *
 * @private
 */

ResetPanel.prototype.valid = function () {
  var ok = true;
  var email_input = this.query('input[name=email]');
  var email = trim(email_input.val());
  var email_empty = empty.test(email);
  var email_parsed = email_parser.exec(email.toLowerCase());
  var validate_username = this.options._isUsernameRequired();
  var username_parsed = regex.username_parser.exec(email_input.val().toLowerCase());
  var password_input = this.query('input[name=password]');
  var password = password_input.val();
  var password_empty = empty.test(password);
  var repeat_password_input = this.query('input[name=repeat_password]');
  var repeat_password = repeat_password_input.val();
  var repeat_password_empty = empty.test(repeat_password);
  var widget = this.widget;

  // asume valid by default
  // and reset errors
  widget._showError();
  widget._focusError();

  if (email_empty) {
    var error_message = validate_username ? 'username empty' : 'email empty';
    widget.emit('reset error', new ValidationError(error_message));
    widget._focusError(email_input);
    ok = false;
  }

  if (!email_parsed && !email_empty) {
    ok = false || (validate_username && username_parsed);

    if (!ok) {
      var invalid_error = validate_username ? 'username invalid' : 'email invalid';
      widget.emit('reset error', new ValidationError(invalid_error));
      widget._focusError(email_input, widget.options.i18n.t('invalid'));
    }
  }

  if (password_empty) {
    widget.emit('reset error', new ValidationError('password empty'));
    widget._focusError(password_input);
    ok = false;
  }

  if (repeat_password_empty) {
    widget.emit('reset error', new ValidationError('repeat password empty'));
    widget._focusError(repeat_password_input);
    ok = false;
  }

  if (repeat_password_input.val() !== password_input.val()) {
    widget.emit('reset error', new ValidationError('password missmatch'));
    widget._focusError(repeat_password_input, widget.options.i18n.t('mustMatch'));
    ok = false;
  }

  return ok;
};

/**
 * Submit validated form to Auth0 for password reset
 *
 * @private
 */

ResetPanel.prototype.submit = function () {
  var panel = this;
  var widget = panel.widget;
  var email_input = this.query('input[name=email]');
  var username = email_input.val();
  var password_input = this.query('input[name=password]');
  var password = password_input.val();
  var repeat_password_input = this.query('input[name=repeat_password]');
  var connection  = this.options._getAuth0Connection();
  var callback = panel.options.popupCallback;

  widget._loadingPanel({ mode: 'reset' });

  widget.emit('reset submit', widget.options);

  widget.$auth0.changePassword({
    connection: connection.name,
    username:   username,
    password:   password
  }, function (err) {
    var args = slice.call(arguments, 0);

    if (!widget.$container) {
      return debug('changePassword ended but this.widget has been detached from DOM: %o', arguments);
    }

    // This is now dummy, and should no longer exist since all
    // dom events keep a reference to widget.$container
    if (widget.query()[0] !== widget.$container.childNodes[0]) {
      return debug('this password reset was triggered from another node instance', arguments);
    }

    // clean password input either there is an error or not
    password_input.val('');
    repeat_password_input.val('');

    if (!err) {
      email_input.val('');
      widget._signinPanel();
      widget._showSuccess(widget.options.i18n.t('reset:successText'));
      widget.emit('reset success');
      return 'function' === typeof callback ? callback.apply(widget, args) : null;
    }

    widget.emit('reset error', err);

    widget.setPanel(panel);

    if (400 === err.status) {
      if ('invalid_password' === err.name) {
        widget._focusError(email_input);
        widget._showError(widget.options.i18n.t('reset:invalidPassword'));
        return;
      }
      widget._focusError(email_input);
      widget._showError(widget.options.i18n.t('reset:userDoesNotExistErrorText'));
    } else {
      widget._showError(widget.options.i18n.t('reset:serverErrorText'));
    }

    return 'function' === typeof callback ? callback.apply(widget, args) : null;

  });

};
