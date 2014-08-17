/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../bonzo-augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var stop = require('../stop-event');
var bind = require('../bind');
var template = require('./signup.ejs');
var buttonTmpl = require('../html/zocial-button.ejs');
var regex = require('../regex');
var empty = regex.empty;
var email_parser = regex.email_parser;

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
    : this.create.apply(this, arguments);
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
 */

SignupPanel.prototype.bindAll = function() {
  var options = this.options;
 
  // hide only and only if set to false
  this.query('.a0-options')
    .toggleClass('a0-hide', !options.showSignupAction);

  var list = this.query('.a0-iconlist').html('');
  _.chain(options.$client.strategies)
    .where({ social: true })
    .map(function (s) {
      var e = {
        use_big_buttons: false,
        title: options.i18n.t('signupSocialButton').replace('{connection:title}', s.title)
      };
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (options._getSocialStrategies().length > 0) {
    this.query('.a0-separator, .a0-iconlist').show();
  } else {
    this.query('.a0-separator, .a0-iconlist').hide();
  }

  this.query('.a0-zocial[data-strategy]', list)
    .a0_on('click', bind(this.onzocialclick, this));

  this.query('.a0-options .a0-cancel')
    .a0_on('click', bind(this.oncancel, this));

  this.query('form')
    .a0_off('submit')
    .a0_on('submit', bind(this.onsubmit, this));
};

SignupPanel.prototype.onzocialclick = function(e) {
  stop(e);
  this.widget._signinSocial(e, null, null, this);
};

SignupPanel.prototype.onsubmit = function(e) {
  stop(e);
  var options = this.options;
  var connection  = options._getAuth0Connection();
  var email = this.query('.a0-email input').val();
  var password = this.query('.a0-password input').val();

  if (!valid(this)) return;
  submit(this, connection.name, email, password);
};

SignupPanel.prototype.oncancel = function(e) {
  stop(e);
  var widget = this.widget;
  widget._showSuccess();
  widget._showError();
  widget._focusError();
  widget._signinPanel();
};

/**
 * Private helpers
 */

/**
 * Validate form for errros
 */

function valid(panel) {
  var ok = true;
  var email_input = panel.query('input[name=email]');
  var email_empty = empty.test(email_input.val());
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var password_input = panel.query('input[name=password]');
  var password_empty = empty.test(password_input.val());
  var widget = panel.widget;

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

  if (password_empty) {
    widget._focusError(password_input);
    ok = false;
  }

  return ok;
}

/**
 * Re-submit validated form
 */

function submit(panel, connectionName, email, password) {
  var widget = panel.widget;
  var password_input = panel.query('input[name=password]');
  var email_input = panel.query('input[name=email]');

  widget._loadingPanel({ mode: 'signup' });

  widget.$auth0.signup({
    connection: connectionName,
    username:   email,
    password:   password,
    auto_login: false
  }, function (err) {
    // I should here use the same instance of panel and re-render before showing errors!!

    // This is now dummy, and should no longer exist since all
    // dom events keep a reference to widget.$container
    if ( !widget.$container || widget.query()[0] !== widget.$container.childNodes[0] ) {
      return console && console.log && console.log('this signup was triggered from another node instance', arguments);
    }

    if (!err) return widget._signinWithAuth0(panel);

    // display signup again
    widget.setPanel(panel);

    // render errors
    if (400 !== err.status) {
      return widget._showError(widget.options.i18n.t('signup:serverErrorText'));
    }

    if ('invalid_password' === err.name) {
      widget._focusError(password_input, widget.options.i18n.t('invalid'));
      widget._showError(widget.options.i18n.t('signup:invalidPassword'));
    } else {
      widget._focusError(email_input);
      widget._showError(widget.options.i18n.t('signup:userExistsErrorText'));
    }

  });

}
