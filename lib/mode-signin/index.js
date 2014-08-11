/**
 * Module dependencies.
 */

var _ = require('underscore');
var bind = require('../bind');
var regex = require('../regex');
var stop = require('../stop-event');
var $ = require('../bonzo-augmented');
var template = require('./signin.ejs');
var create = require('../object-create');
var Emitter = require('events').EventEmitter;
var buttonTmpl = require('../html/zocial-button.ejs');
var loginActionsTmpl = require('./login_actions.ejs');

/**
 * Expose SigninPanel
 */

module.exports = SigninPanel;

/**
 * Create `SigninPanel`
 *
 * @param {Auth0Widget} widget
 * @param {Object} options
 * @constructor
 */

function SigninPanel(widget, options) {
  if (!(this instanceof SigninPanel)) {
    return new SigninPanel(widget, options);
  };

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SigninPanel');
  }

  this.name = 'signin';
  this.widget = widget;
  this.options = this.resolveOptions(options);
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SigninPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

SigninPanel.prototype.query = function(selector) {
  if (!this.el) throw new Error('Can\'t get element since no `el` is set to local context');
  return $(selector, this.el);
}

/**
 * Create `el`
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

SigninPanel.prototype.create = function(options) {
  var opts = this.resolveOptions(options);
  var widget = this.widget;

  this.el = $.create(widget.render(template, opts))[0];
  this.bindAll();
  return this.el;
}

/**
 * Return `el` or create it
 *
 * @param {Object} options
 * @return {NodeElement}
 * @public
 */

SigninPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 *
 * @param {Object} options
 * @return {Object}
 * @private
 */

SigninPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 *
 * @return {SigninPanel}
 * @private
 */

SigninPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;
  var options = this.options;

  // load social buttons
  var list = this.query('.a0-iconlist');

  var socialStrategies = _.chain(options.$client.strategies).where({ social: true });

  if (options.connections) {
    // sort social strategies based on options.connections array order
    var connections = options.connections;
    socialStrategies = socialStrategies.map(function (s) {
      var n = connections.indexOf(s.connections[0].name);
      connections[n] = '';
      return [n, s];
    }).sort().map(function (x) { return x[1]; });
  }

  socialStrategies
    .map(function (s) {
      var e = {
        use_big_buttons: options._useBigSocialButtons(),
        title: options.i18n.t('loginSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (options._getSocialStrategies().length > 0) {
    this.query('.a0-separator, .a0-iconlist').toggleClass('a0-hide', false);
  }

  this.query('.a0-email input').a0_on('input', bind(this.onemailinput, this));
  this.query('form').a0_on('submit', bind(this.onsubmit, this));

  this.query('.a0-zocial[data-strategy]', list).a0_on('click', bind(this.onsocialclick, this));

  var actions = $.create(widget.render(loginActionsTmpl, options));
  this.query('.a0-db-actions').append(actions);

  // set username mode
  if (options.username_style === 'username') {
    var placeholder = options.i18n.t('signin:usernamePlaceholder');

    this.query('.a0-email input')
      .attr('type', 'text')
      .attr('title', placeholder)
      .attr('placeholder', placeholder);

    this.query('.a0-email label').text(placeholder);
  }

  var signup_btn = this.query('.a0-sign-up');
  if (!options.signupLink && signup_btn.length > 0) {
    signup_btn.a0_on('click', bind(this.onsignupclick, this));
  }

  if (!options.forgotLink) {
    this.query('.a0-forgot-pass').a0_on('click', bind(this.onresetclick, this));
  }

  this.query('input').val('');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = options._isThereAnyEnterpriseOrDbConnection();
  var anySocialConnection = options._isThereAnySocialConnection();
  var anyDBConnection = options._isThereAnyDBConnection();

  this.query('.a0-email input').toggleClass('a0-hide', !(options.showEmail && anyEnterpriseOrDbConnection));
  this.query('.a0-zocial.a0-primary').toggleClass('a0-hide', !(options.showEmail && anyEnterpriseOrDbConnection));
  this.query('.a0-password').toggleClass('a0-hide', !(options.showEmail && self.options.showPassword && anyDBConnection));
  this.query('.a0-separator').toggleClass('a0-hide', !(options.showEmail && anyEnterpriseOrDbConnection && anySocialConnection));

  this.query('.a0-inputs').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);

}

/**
 * Show or hide password input whether it is or is not
 * an enterprise connection
 * XXX: This should be moved to `SigninPanel` view
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onemailinput = function (e) {
  stop(e);
  var mailField = this.query('.a0-email input');
  var pwdField  = this.query('.a0-password input').first();

  var isEnterpriseConnection = this.options._isEnterpriseConnection(mailField.val() || '');

  if (isEnterpriseConnection) return pwdField.attr('disabled', true);
  return pwdField.removeAttr('disabled');
};

/**
 * Validate form and continuew with signin
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onsubmit = function(e) {
  stop(e);
  var widget = this.widget;
  var options = this.options;

  var ok = true;
  var password_input = this.query('input[name=password]');
  var password_empty = regex.empty.test(password_input.val());
  var password_disabled = password_input.attr('disabled');
  var password_required = options.showEmail && options.showPassword && options._isThereAnyDBConnection();
  var email_input = this.query('input[name=email]');
  var email_parsed = regex.email_parser.exec(email_input.val().toLowerCase());
  var email_empty = regex.empty.test(email_input.val());

  // Clean error container
  widget._showError();
  widget._focusError();

  if (email_empty) {
    widget._focusError(email_input);
    ok = false;
  }

  if (!widget._ignoreEmailValidations(email_input)) {
    if (!email_parsed && !email_empty) {
      widget._focusError(email_input, options.i18n.t('invalid'));
      ok = false;
    }
  }

  if (password_empty && password_required && !password_disabled) {
    widget._focusError(password_input);
    ok = false;
  };

  if (ok) return widget._signin(this);
}

/**
 * Handle `e` for social connections button click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onsocialclick = function(e) {
    stop(e);
    this.widget._signinSocial(e, null, null, this);
}

/**
 * Handle `e` for reset button action click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onresetclick = function(e) {
  stop(e);
  this.widget._resetPanel(this.options);
}

/**
 * Handle `e` for signup button action click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onsignupclick = function(e) {
  stop(e);
  this.widget._signupPanel(this.options);
}
