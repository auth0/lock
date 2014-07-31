/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./reset.ejs');
var buttonTmpl = require('../html/button.ejs');
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
  var modeResolvedOptions = widget._signinOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

ResetPanel.prototype.bindAll = function() {
  var widget = this.widget;
  var self = this;

  widget.query('.a0-reset .a0-options').show(widget._openWith ? 'none' : 'block');

  var form = this.query('form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var username = self.query('.a0-email input', form).val();
      var password = self.query('.a0-password input', form).val();
      var connection  = widget._getAuth0Connection();

      if (!valid(form, widget)) return;
      submit(widget, connection.name, username, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook(widget.query('.a0-reset form input'), widget.query('.a0-collapse-reset'));
  }

  self.query('.a0-options .a0-cancel').a0_on('click', function () {
    self.widget._showSuccess();
    self.widget._showError();
    self.widget._focusError();
    self.widget._signinPanel();
  });

  widget.query('.a0-repeatPassword input', form)
    .a0_off('input')
    .a0_on('input', function() {
      if (widget.query('.a0-password input', form).val() != this.value) {
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

function submit(widget, connectionName, email, password) {
  var container = widget.query('.a0-reset form');

  widget._setLoginView({ mode: 'loading', title: 'reset' }, function () {
    widget._auth0.changePassword({
      connection: connectionName,
      username:   username,
      password:   password
    }, function (err) {

      // This is now dummy, and should no longer exist since all
      // dom events keep a reference to widget._container
      if ( !widget._container || widget.query()[0] !== widget._container.childNodes[0] ) {
        return console && console.log && console.log('this password reset was triggered from another node instance', arguments);
      }

      widget.query('.a0-password input', container).val('');
      widget.query('.a0-repeatPassword input', container).val('');

      if (err) {
        // set error message before view refresh
        // to avoid wrong resizing calculations
        if (400 === err.status) {
          widget._showError(widget._dict.t('reset:userDoesNotExistErrorText'));
        } else {
          widget._showError(widget._dict.t('reset:serverErrorText'));
        }
        return widget._setLoginView({ mode: 'reset' });
      }

      widget.query('.a0-email input', container).val('');

      // set success message before view refresh
      // to avoid wrong resizing calculations
      widget._showSuccess(widget._dict.t('reset:successText'));
      widget._setLoginView({});
    });
  });

}
