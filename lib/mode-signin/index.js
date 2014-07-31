/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var create = require('../object-create');
var template = require('./signin.ejs');
var buttonTmpl = require('../html/button.ejs');
var loginActionsTmpl = require('../html/login_actions.ejs');
var _ = require('underscore');
var $ = require('../js/bonzo_augmented');
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

  var use_big_buttons = self.widget._signinOptions['socialBigButtons'] || !self.widget._areThereAnyEnterpriseOrDbConn();

  // load social buttons
  var list = self.query('.a0-notloggedin .a0-iconlist');

  var socialStrategies = _.chain(self.widget._client.strategies).where({social: true});

  if (self.widget._signinOptions.connections) {
    // sort social strategies based on options.connections array order
    var connections = self.widget._signinOptions.connections;
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
        title: self.widget._dict.t('loginSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(self.widget._client.strategies, {social: true}).length > 0) {
    self.query('.a0-notloggedin .a0-separator, .a0-notloggedin .a0-iconlist').toggleClass('a0-hide', false);
  }

  this.query('.a0-notloggedin form').a0_on('submit', function (e) {
    self.widget._signInEnterprise(e);
  });

  self.query('.a0-notloggedin .a0-email input').a0_on('input', function (e) {
    self.widget._showOrHidePassword(e);
  });

  self.query('.a0-zocial[data-strategy]', list).a0_on('click', function (e) {
    self.widget._signInSocial(e);
  });

  // show signup/forgot links
  var auth0Conn = self.widget._getAuth0Connection() || {};

  var locals = {
    showSignup: (self.widget._signinOptions.showSignup !== false) && ((auth0Conn && auth0Conn.showSignup) || self.widget._signinOptions.signupLink),
    showForgot: (self.widget._signinOptions.showForgot !== false) && ((auth0Conn && auth0Conn.showForgot) || self.widget._signinOptions.forgotLink),
    signupLink: self.widget._signinOptions.signupLink,
    forgotLink: self.widget._signinOptions.forgotLink
  };

  var actions = $.create(self.widget.render(loginActionsTmpl, locals));

  // username_style
  var auth0ConnStrategy = self.widget._getStrategy(auth0Conn.name) || {};

  if (!self.widget._signinOptions.username_style &&
      (auth0ConnStrategy.name === 'ad' || auth0ConnStrategy.name === 'auth0-adldap')) {
    self.widget._signinOptions.username_style = 'username';
  }

  if (self.widget._signinOptions.username_style === 'username') {
    // set username mode
    var placeholder = self.widget._dict.t('signin:usernamePlaceholder');
    self.query('.a0-notloggedin .a0-email input')
      .attr('type', 'text')
      .attr('title', placeholder)
      .attr('placeholder', placeholder);

    self.query('.a0-notloggedin .a0-email label').text(placeholder);
  }

  self.query('.a0-db-actions').append(actions);

  var signup_btn = self.query('.a0-sign-up');
  if (!self.widget._signinOptions.signupLink && signup_btn.length > 0) {
    signup_btn.a0_on('click', function (e) {
      e.preventDefault();
      self.widget._signupPanel(self.options);
    });
  }

  if (!self.widget._signinOptions.forgotLink) {
    self.query('.a0-forgot-pass').a0_on('click', function (e) {
      e.preventDefault();
      self.widget._resetPanel(self.options);
    });
  }

  self.query('input').val('');

  self.query('.a0-signup .a0-email input').a0_on('input', function() {
    var output = {};
    if (self.widget._isEnterpriseConnection(self.widget.value, output)) {
      var warningText = self.widget._dict.t('signup:enterpriseEmailWarningText').replace(/{domain}/g, output.domain);
      // self.widget._setCustomValidity(self.widget, warningText);
    } else {
      // self.widget._setCustomValidity(self.widget, '');
    }
  });

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = self.widget._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = self.widget._areThereAnySocialConn();
  var anyDbConnection = self.widget._areThereAnyDbConn();

  self.query('.a0-email input').toggleClass('a0-hide', !(self.widget._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  self.query('.a0-zocial.a0-primary').toggleClass('a0-hide', !(self.widget._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  self.query('.a0-password').toggleClass('a0-hide', !(self.widget._signinOptions.showEmail && self.widget._signinOptions.showPassword && anyDbConnection));
  self.query('.a0-separator').toggleClass('a0-hide', !(self.widget._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection));

  self.query('.a0-inputs').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  self.query('.a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);

  // if (is_small_screen()) {
  //   var collapse_onfocus = require('./lib/js/collapse_onfocus');
  //   collapse_onfocus.hook(self.query('.a0-notloggedin form input'), self.query('.a0-collapse-social'));
  // }
}

SigninPanel.prototype.query = function(selector) {
  return $(selector, this.el);
}
