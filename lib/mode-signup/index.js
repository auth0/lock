/**
 * Module dependencies.
 */

var _ = require('underscore');
var debug = require('debug')('auth0-lock:mode-signup');
var $ = require('../bonzo-augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var stop = require('../stop-event');
var bind = require('../bind');
var template = require('./signup.ejs');
var buttonTmpl = require('../html/zocial-button.ejs');
var regex = require('../regex');
var gravatar = require('../gravatar');
var PasswordStrength = require('../password-strength');
var empty = regex.empty;
var email_parser = regex.email_parser;
var slice = Array.prototype.slice;
var username_parser = regex.username_parser;

/**
 * Expose SignupPanel
 */

module.exports = SignupPanel;

/**
 * Create `SignupPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function SignupPanel(widget, options) {
  if (!(this instanceof SignupPanel)) {
    return new SignupPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SignupPanel');
  }

  this.name = 'signup';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  // debounce gravatar update method
  this.gravatar = _.debounce(this.gravatar, 300);

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SignupPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

SignupPanel.prototype.query = function(selector) {
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

SignupPanel.prototype.create = function(options) {
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

SignupPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, slice.call(arguments, 0));
};

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

SignupPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};


/**
 * Bind events to `this.el`, like submit
 *
 * @private
 */

SignupPanel.prototype.bindAll = function() {
  var options = this.options;

  var list = this.query('.a0-iconlist').html('');
  _.chain(this.options._getSocialStrategies())
    .map(function (s) {
      var e = {
        use_big_buttons: options._useBigSocialButtons(),
        title: options.i18n.t('signupSocialButton').replace('{connection:title}', s.title)
      };
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  var anyEnterpriseOrDbConnection = this.options._isThereAnyEnterpriseOrDbConnection();
  var anySocialConnection = this.options._isThereAnySocialConnection();

  this.query('.a0-options').toggleClass('a0-hide', !options.showSignupAction);
  this.query('.a0-iconlist').toggleClass('a0-hide', !anySocialConnection);
  this.query('.a0-instructions, .a0-inputs, .a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-separator').toggleClass('a0-hide', !anySocialConnection || !anyEnterpriseOrDbConnection);

  this.query('.a0-email input').a0_on('input', bind(this.onemailinput, this));

  this.query('.a0-zocial[data-strategy]', list)
    .a0_on('click', bind(this.onzocialclick, this));

  this.query('.a0-options .a0-cancel')
    .a0_on('click', bind(this.oncancel, this));

  this.query('form')
    .a0_off('submit')
    .a0_on('submit', bind(this.onsubmit, this));

  if (anyEnterpriseOrDbConnection) {
    new PasswordStrength(this.query('.a0-password_policy'),
                        this.query('#a0-signup_easy_password'),
                        this.options);
  }
};

/**
 * Handler for `zocial` signup click
 *
 * @param {Event} e
 * @private
 */

SignupPanel.prototype.onzocialclick = function(e) {
  stop(e);
  this.widget._signinSocial(e, null, null, this);
};

/**
 * Handler for `submit` form event
 *
 * @param {Event} e
 * @private
 */

SignupPanel.prototype.onsubmit = function(e) {
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

SignupPanel.prototype.oncancel = function(e) {
  stop(e);

  var widget = this.widget;
  widget._showSuccess();
  widget._showError();
  widget._focusError();
  widget._signinPanel();
};

SignupPanel.prototype.onemailinput = function () {
  var mailField = this.query('.a0-email input');

  if ('username' !== this.options.usernameStyle && this.options.gravatar) {
    this.gravatar(mailField.val());
  }
};

/**
 * Invoke gravatar update for `email`
 *
 * @param {String} email
 * @private
 */

SignupPanel.prototype.gravatar = function(email) {
  gravatar(this.widget, email);
  return this;
};

/**
 * Submit validated form to Auth0 for signup
 *
 * @private
 */

SignupPanel.prototype.submit = function() {
  var panel = this;
  var widget = this.widget;
  var options = this.options;
  var connection  = options._getAuth0Connection();
  var email_input = this.query('input[name=email]');
  var email = email_input.val();
  var username_input = this.query('.a0-username input');
  var username = username_input.val();
  var password_input = this.query('input[name=password]');
  var password = password_input.val();
  var callback = widget.options.popupCallback;

  widget._loadingPanel({ mode: 'signup' });

  debug('signin up');
  widget.$auth0.signup({
    connection: connection.name,
    username:   (options._isUsernameRequired()) ? username : email,
    email:      email,
    password:   password,
    auto_login: false,
    popup:      panel.options.popup,
  }, function (err) {
    var args = slice.call(arguments, 0);

    if (!widget.$container) {
      return debug('singup ended but this.widget has been dettached from DOM: %o', arguments);
    }

    // This is now dummy, and should no longer exist since all
    // dom events keep a reference to widget.$container
    if ( !widget.$container || widget.query()[0] !== widget.$container.childNodes[0] ) {
      return debug('this signup was triggered from another node instance', arguments);
    }

    if (!err && widget.options.loginAfterSignup) { return widget._signinWithAuth0(panel); }
    if (!err && 'function' === typeof callback) { return callback.apply(widget, args), widget.hide(); }
    if (!err) { return widget.hide(); }

    // display signup again
    widget.setPanel(panel);

    // render errors
    if (400 !== err.status) {
      widget._showError(widget.options.i18n.t('signup:serverErrorText'));
      return 'function' === typeof callback ? callback.apply(widget, args) : null;
    }

    function focusPasswordInvalid() {
      widget._focusError(password_input, widget.options.i18n.t('invalid'));
    }

    function focusInput() {
      widget._focusError(username_input);
    }

    var errors = {
      invalid_password: {
        caption: widget.options.i18n.t('signup:invalidPassword'),
        action: focusPasswordInvalid
      },
      user_exists: {
        caption: widget.options.i18n.t('signup:userExistsErrorText'),
        action: focusInput
      },
      username_exists: {
        caption: widget.options.i18n.t('signup:usernameInUseErrorText'),
        action: focusInput
      },
      signup_on_sso_domain: {
        caption: widget.options.i18n.t('signup:signupOnSSODomainErrorText'),
        action: focusInput
      },
      'default': {
        caption: widget.options.i18n.t('signup:serverErrorText'),
        action: focusInput
      }
    };

    var error = errors[err.name] || errors['default'];

    var domainName = (err && err.details && err.details.domain) || '';

    widget._showError(error.caption.replace('{domain}', domainName));
    error.action();

    return 'function' === typeof callback ? callback.apply(widget, args) : null;
  });

};

/**
 * Validate form for errros before `submit`
 *
 * @private
 */

SignupPanel.prototype.valid = function() {
  // TODO: Lot of duplicated validation logic with `mode-signin` and `mode-reset`.
  // Will be better to create a new object that handle input validations.
  var ok = true;
  var email_input = this.query('input[name=email]');
  var email_empty = empty.test(email_input.val());
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var password_input = this.query('input[name=password]');
  var password_empty = empty.test(password_input.val());
  var widget = this.widget;

  // asume valid by default
  // and reset errors
  widget._showError();
  widget._focusError();

  if (email_empty) {
    widget._focusError(email_input);
    ok = false;
  }

  if (!email_parsed && !email_empty) {
    widget._focusError(email_input, widget.options.i18n.t('invalid'));
    ok = false;
  }

  if(this.options._isUsernameRequired()) {
    var username_input = this.query('input[name=username]');
    var username_empty = empty.test(username_input.val());
    var username_parsed = username_parser.exec(username_input.val().toLowerCase());

    if (username_empty) {
      widget._focusError(username_input);
      ok = false;
    }
    if (!username_parsed && !username_empty) {
      widget._focusError(username_input, widget.options.i18n.t('invalid'));
      ok = false;
    }
  }

  if (password_empty) {
    widget._focusError(password_input);
    ok = false;
  }

  return ok;
};
