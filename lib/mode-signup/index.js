/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./signup.ejs');
var buttonTmpl = require('../html/button.ejs');
var collapse_onfocus = require('../js/collapse_onfocus');
var is_small_screen = require('../js/is_small_screen');
var regex = require('../js/regex');
var empty = regex.empty;
var email_parser = regex.email_parser;

/**
 * Expose SignupPanel
 */

module.exports = SignupPanel;

/**
 * Create
 */

function SignupPanel(widget, options) {
  if (!(this instanceof SignupPanel)) {
    return new SignupPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SignupPanel');
  }

  this.widget = widget;
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SignupPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
 */

SignupPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 */

SignupPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

SignupPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget._signinOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

SignupPanel.prototype.bindAll = function() {
  var widget = this.widget;
  var self = this;

  var list = self.query('.a0-iconlist').html('');

  self.query('.a0-options').show(widget._openWith ? 'none' : 'block');

  _.chain(widget._client.strategies)
    .where({social: true})
    .map(function (s) {
      var e = {
        use_big_buttons: false,
        title: widget._dict.t('signupSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(widget._client.strategies, {social: true}).length > 0) {
    self.query('.a0-separator, .a0-iconlist').show();
  }

  self.query('.a0-zocial[data-strategy]', list).a0_on('click', function (e) {
    widget._signInSocial(e);
  });

  this.query('.a0-email input').a0_on('input', function() {
    var output = {};
    if (widget._isEnterpriseConnection(this.value, output)) {
      var warningText = widget._dict.t('signup:enterpriseEmailWarningText').replace(/{domain}/g, output.domain);
      // widget._setCustomValidity(this, warningText);
    } else {
      // widget._setCustomValidity(this, '');
    }
  });

  self.query('.a0-options .a0-cancel').a0_on('click', function () {
    widget._showSuccess();
    widget._showError();
    widget._focusError();
    widget._signinPanel();
  });

  var form = self.query('form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var connection  = widget._getAuth0Connection();
      var email = self.query('.a0-email input', form).val();
      var password = self.query('.a0-password input', form).val();

      if (!valid(form, widget)) return;
      submit(widget, connection.name, email, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook(self.query('form input'), self.query('.a0-collapse-social-signup'));
  }

}

SignupPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}

function valid(form, widget) {
  var ok = true;
  var email_input = widget.query('input[name=email]', form);
  var email_empty = empty.test(email_input.val());
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var password_input = widget.query('input[name=password]', form);
  var password_empty = empty.test(password_input.val());

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

  return ok;
}

function submit(widget, connectionName, email, password) {
  var form = $('.a0-signup form');
  var password_input = $('input[name=password]', form);

  widget._setLoginView({mode: 'loading', title: 'signup'}, function () {
    widget._auth0.signup({
      connection: connectionName,
      username:   email,
      password:   password,
      auto_login: false
    }, function (err) {

      // This is now dummy, and should no longer exist since all
      // dom events keep a reference to widget._container
      if ( !widget._container || widget.query()[0] !== widget._container.childNodes[0] ) {
        return console && console.log && console.log('this signup was triggered from another node instance', arguments);
      }

      if (err) {
        // set error message before view refresh
        // to avoid wrong resizing calculations
        if (400 === err.status) {
          if ('invalid_password' === err.name) {
            widget._focusError(password_input, widget._dict.t('invalid'));
            widget._showError(widget._dict.t('signup:invalidPassword'));
          } else {
            widget._showError(widget._dict.t('signup:userExistsErrorText'));
          }
        } else {
          widget._showError(widget._dict.t('signup:serverErrorText'));
        }
        return widget._setLoginView({ mode: 'signup' });
      }

      return widget._signInWithAuth0(email, password);
    });
  });

}
