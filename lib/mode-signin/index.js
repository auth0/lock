/**
 * Module dependencies.
 */

var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var stop = require('../stop-event');
var template = require('./signin.ejs');
var buttonTmpl = require('../html/button.ejs');
var loginActionsTmpl = require('../html/login_actions.ejs');
var collapse_onfocus = require('../js/collapse_onfocus');
var is_small_screen = require('../js/is_small_screen');

/**
 * Expose SigninPanel
 */

module.exports = SigninPanel;

/**
 * Create
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
  this.options = options;
  this.el = null;

  Emitter.call(this);
}

/**
 * Inherit from `EventEmitter`
 */

SigninPanel.prototype = create(Emitter.prototype);

/**
 * Create `el`
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
 */

SigninPanel.prototype.render = function() {
  return null != this.el
    ? this.el
    : this.create.apply(this, arguments);
}

/**
 * Resolves login options passed to template
 */

SigninPanel.prototype.resolveOptions = function(options) {
  var widget = this.widget;
  var widgetOptions = widget._options;
  var modeResolvedOptions = widget._signinOptions;

  return _.extend({}, widgetOptions, modeResolvedOptions,  this.options, options);
}

/**
 * Bind events to `this.el`, like submit
 */

SigninPanel.prototype.bindAll = function() {
  var self = this;
  var widget = this.widget;

  var use_big_buttons = widget._signinOptions['socialBigButtons'] || !widget._areThereAnyEnterpriseOrDbConn();

  // load social buttons
  var list = this.query('.a0-iconlist');

  var socialStrategies = _.chain(widget._client.strategies).where({ social: true });

  if (widget._signinOptions.connections) {
    // sort social strategies based on options.connections array order
    var connections = widget._signinOptions.connections;
    socialStrategies = socialStrategies.map(function (s) {
      var n = connections.indexOf(s.connections[0].name);
      connections[n] = '';
      return [n, s];
    }).sort().map(function (x) { return x[1]; });
  }

  socialStrategies
    .map(function (s) {
      var e = {
        use_big_buttons: use_big_buttons,
        title: widget._dict.t('loginSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(widget._client.strategies, { social: true }).length > 0) {
    this.query('.a0-separator, .a0-iconlist').toggleClass('a0-hide', false);
  }

  this.query('form').a0_on('submit', function (e) {
    stop(e);
    widget._signin(self);
  });

  this.query('.a0-email input').a0_on('input', function (e) {
    stop(e);
    widget._showOrHidePassword();
  });

  self.query('.a0-zocial[data-strategy]', list).a0_on('click', function (e) {
    stop(e);
    widget._signinSocial(e, null, null, self);
  });

  // show signup/forgot links
  var auth0Conn = widget._getAuth0Connection() || {};

  var locals = {
    showSignup: (widget._signinOptions.showSignup !== false) && ((auth0Conn && auth0Conn.showSignup) || widget._signinOptions.signupLink),
    showForgot: (widget._signinOptions.showForgot !== false) && ((auth0Conn && auth0Conn.showForgot) || widget._signinOptions.forgotLink),
    signupLink: widget._signinOptions.signupLink,
    forgotLink: widget._signinOptions.forgotLink
  };

  var actions = $.create(widget.render(loginActionsTmpl, locals));

  // username_style
  var auth0ConnStrategy = widget._getStrategy(auth0Conn.name) || {};

  if (!widget._signinOptions.username_style &&
      (auth0ConnStrategy.name === 'ad' || auth0ConnStrategy.name === 'auth0-adldap')) {
    widget._signinOptions.username_style = 'username';
  }

  if (widget._signinOptions.username_style === 'username') {
    // set username mode
    var placeholder = widget._dict.t('signin:usernamePlaceholder');
    this.query('.a0-email input')
      .attr('type', 'text')
      .attr('title', placeholder)
      .attr('placeholder', placeholder);

    this.query('.a0-email label').text(placeholder);
  }

  this.query('.a0-db-actions').append(actions);

  var signup_btn = self.query('.a0-sign-up');
  if (!widget._signinOptions.signupLink && signup_btn.length > 0) {
    signup_btn.a0_on('click', function (e) {
      e.preventDefault();
      widget._signupPanel(self.options);
    });
  }

  if (!widget._signinOptions.forgotLink) {
    this.query('.a0-forgot-pass').a0_on('click', function (e) {
      e.preventDefault();
      widget._resetPanel(self.options);
    });
  }

  this.query('input').val('');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = widget._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = widget._areThereAnySocialConn();
  var anyDbConnection = widget._areThereAnyDbConn();

  this.query('.a0-email input').toggleClass('a0-hide', !(widget._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  this.query('.a0-zocial.a0-primary').toggleClass('a0-hide', !(widget._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  this.query('.a0-password').toggleClass('a0-hide', !(widget._signinOptions.showEmail && self.widget._signinOptions.showPassword && anyDbConnection));
  this.query('.a0-separator').toggleClass('a0-hide', !(widget._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection));

  this.query('.a0-inputs').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);

  if (is_small_screen()) {
    collapse_onfocus.hook(this.query('form input'), this.query('.a0-collapse-social'));
  }
}

SigninPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}
