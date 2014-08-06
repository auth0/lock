/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var stop = require('../stop-event');
var template = require('./reset.ejs');
var buttonTmpl = require('../html/zocial-button.ejs');
var collapse_onfocus = require('../js/collapse_onfocus');
var is_small_screen = require('../js/is_small_screen');
var regex = require('../js/regex');
var empty = regex.empty;
var trim = require('trim');
var email_parser = regex.email_parser;

/**
 * Expose ResetPanel
 */

module.exports = ResetPanel;

/**
 * Create
 */

function ResetPanel(widget, options) {
  if (!(this instanceof ResetPanel)) {
    return new ResetPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for ResetPanel');
  }

  this.name = 'reset';
  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

ResetPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

ResetPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

ResetPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

ResetPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget.displayOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

ResetPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;
  var signinOptions = widget.displayOptions;
  var connection = widget._getAuth0Connection();
  var showForgot = (signinOptions.showForgot !== false) && ((connection && connection.showForgot) || signinOptions.signupLink);;

  // hide only and only if set to false
  this.query('.a0-options').toggleClass('a0-hide', !showForgot);

  var form = this.query('form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      stop(e);
      var username = self.query('.a0-email input', form).val();
      var password = self.query('.a0-password input', form).val();
      var connection  = widget._getAuth0Connection();

      if (!valid(form, widget)) return;
      submit(self, connection.name, username, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook(self.query('form input'), widget.query('.a0-collapse-reset'));
  }

  this.query('.a0-options .a0-cancel').a0_on('click', function (e) {
    stop(e);
    self.widget._showSuccess();
    self.widget._showError();
    self.widget._focusError();
    self.widget._signinPanel();
  });

  this.query('.a0-repeatPassword input')
    .a0_off('input')
    .a0_on('input', function() {
      if (self.query('.a0-password input').val() != this.value) {
        widget._setCustomValidity(this, widget._dict.t('reset:enterSamePasswordText'));
      } else {
        widget._setCustomValidity(this, '');
      }
    });

}

ResetPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}

function valid(form, widget) {
  var ok = true;
  var email_input = widget.query('input[name=email]', form);
  var email = trim(email_input.val());
  var email_empty = empty.test(email);
  var email_parsed = email_parser.exec(email.toLowerCase());
  var password_input = widget.query('input[name=password]', form);
  var password = password_input.val();
  var password_empty = empty.test(password);
  var repeat_password_input = widget.query('input[name=repeat_password]', form);
  var repeat_password = repeat_password_input.val();
  var repeat_password_empty = empty.test(repeat_password_input.val());

  // asume valid by default
  // and reset errors
  widget._showError();
  widget._focusError();

  if (email_empty) {
    widget._focusError(email_input);
    ok = false;
  }

  if (!email_parsed && !email_empty) {
    widget._focusError(email_input, widget._dict.t('invalid'));
    ok = false;
  }

  if (password_empty) {
    widget._focusError(password_input);
    ok = false;
  };

  if (repeat_password_empty) {
    widget._focusError(repeat_password_input);
    ok = false;
  };

  if (repeat_password_input.val() !== password_input.val()) {
    widget._focusError(repeat_password_input, widget._dict.t('mustMatch'));
    ok = false;
  };

  return ok;
}

function submit(panel, connectionName, username, password) {
  var widget = panel.widget;
  var email_input = panel.query('input[name=email]');

  widget._loadingPanel({ mode: 'reset' });

  widget._auth0.changePassword({
    connection: connectionName,
    username:   username,
    password:   password
  }, function (err) {
    // I should here use the same instance of panel and re-render before showing errors!!

    // This is now dummy, and should no longer exist since all
    // dom events keep a reference to widget._container
    if ( !widget._container || widget.query()[0] !== widget._container.childNodes[0] ) {
      return console && console.log && console.log('this password reset was triggered from another node instance', arguments);
    }

    panel.query('.a0-password input').val('');
    panel.query('.a0-repeatPassword input').val('');

    if (!err) {
      email_input.val('');
      widget._signinPanel(panel.options);
      return widget._showSuccess(widget._dict.t('reset:successText'));
    }

    widget.setPanel(panel);

    if (400 === err.status) {
      widget._focusError(email_input);
      widget._showError(widget._dict.t('reset:userDoesNotExistErrorText'));
    } else {
      widget._showError(widget._dict.t('reset:serverErrorText'));
    }

  });

}
