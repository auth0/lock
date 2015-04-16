/**
 * Module dependencies.
 */

var _ = require('underscore');
var debug = require('debug')('auth0-lock:mode-sigin');
var bind = require('../bind');
var regex = require('../regex');
var stop = require('../stop-event');
var $ = require('../bonzo-augmented');
var template = require('./signin.ejs');
var create = require('../object-create');
var Emitter = require('events').EventEmitter;
var buttonTmpl = require('../html/zocial-button.ejs');
var loginActionsTmpl = require('./login_actions.ejs');
var gravatar = require('../gravatar');

/**
 * Expose SigninPanel
 */

module.exports = SigninPanel;

/**
 * Create `SigninPanel`
 *
 * @param {Auth0Lock} widget
 * @param {Object} options
 * @constructor
 */

function SigninPanel(widget, options) {
  if (!(this instanceof SigninPanel)) {
    return new SigninPanel(widget, options);
  }

  // Both `widget` and `options` are required
  if (2 !== arguments.length) {
    throw new Error('Missing parameters for SigninPanel');
  }

  this.name = 'signin';
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

SigninPanel.prototype = create(Emitter.prototype);

/**
 * Query for elements at `this.el` context
 *
 * @param {String} selector
 * @return {BonzoAugmented}
 * @public
 */

SigninPanel.prototype.query = function(selector) {
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

SigninPanel.prototype.create = function(options) {
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

SigninPanel.prototype.render = function() {
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

SigninPanel.prototype.resolveOptions = function(options) {
  return _.extend({}, this.widget.options,  this.options, options);
};

/*
 * Render and bind social strategies
 *
 *@private
 */
SigninPanel.prototype.renderAndBindSocialStrategies = function () {
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
      };
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (options._getSocialStrategies().length > 0) {
    this.query('.a0-separator, .a0-iconlist').toggleClass('a0-hide', false);
  }

  this.query('.a0-zocial[data-strategy]', list).a0_on('click', bind(this.onsocialclick, this));
};

/**
 * Bind events to `this.el`, like submit
 *
 * @return {SigninPanel}
 * @private
 */

SigninPanel.prototype.bindAll = function() {
  var widget = this.widget;
  var options = this.options;

  this.renderAndBindSocialStrategies();

  // register email validation stuff
  this.query('.a0-email input').a0_on('input', bind(this.onemailinput, this));

  // bind to submit
  this.query('form').a0_on('submit', bind(this.onsubmit, this));

  var actions = $.create(widget.render(loginActionsTmpl, options));
  this.query('.a0-db-actions').append(actions);

  // set username mode
  if (options.usernameStyle === 'username') {
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

  if (!options.resetLink) {
    this.query('.a0-forgot-pass').a0_on('click', bind(this.onresetclick, this));
  }

  this.query('input').val('');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = options._isThereAnyEnterpriseOrDbConnection();
  var anySocialConnection = options._isThereAnySocialConnection();
  var anyDBConnection = options._isThereAnyDBConnection();

  this.query('.a0-email input').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-zocial.a0-primary').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-password').toggleClass('a0-hide', !anyDBConnection);
  this.query('.a0-separator').toggleClass('a0-hide', !(anyEnterpriseOrDbConnection && anySocialConnection));

  this.query('.a0-inputs').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this.query('.a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);

};

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
  var mailField   = this.query('.a0-email input');
  var pwdField    = this.query('.a0-password input').first();
  var nextButton  = this.query('.a0-action > button.a0-next');

  var emailDomain = this.options._extractEmailDomain(mailField.val() || '');

  var isEnterpriseConnection = this.options._isEnterpriseConnection(mailField.val() || '');
  var adConnection = this.options._findConnectionByADDomain(emailDomain);
  var msg;

  if ('username' !== this.options.usernameStyle && this.options.gravatar) {
    this.gravatar(mailField.val());
  }

  // TODO Refactor
  if ('username' !== this.options.usernameStyle && adConnection) {
    this.hrd = true;
    this.currentADConnection = adConnection;
    this.currentADConnectionDomain = emailDomain;

    this.query('.a0-sso-notice-container').removeClass('a0-hide');
    this.query('.a0-password').addClass('a0-hide');
    this.oldText = nextButton.text();

    msg = this.options.i18n.t('signin:actionDomain');
    msg = msg.replace('{domain}', emailDomain);

    nextButton.text(msg);
    nextButton.attr('title', msg);

    return pwdField.attr('disabled', true);
  }

  this.hrd = undefined;
  this.currentADConnection = undefined;
  if (this.oldText) {
    nextButton.text(this.oldText);
    nextButton.attr('title', this.oldText);
    this.oldText = undefined;
  }

  if (isEnterpriseConnection) {
    this.query('.a0-sso-notice-container').removeClass('a0-hide');
    this.query('.a0-password').addClass('a0-hide');
    this.oldText = nextButton.text();

    msg = this.options.i18n.t('signin:actionDomain');
    msg = msg.replace('{domain}', emailDomain);

    nextButton.text(msg);
    nextButton.attr('title', msg);

    return pwdField.attr('disabled', true);
  }

  this.query('.a0-sso-notice-container').addClass('a0-hide');
  this.query('.a0-password').removeClass('a0-hide');

  return pwdField.removeAttr('disabled');
};

/**
 * Invoke gravatar update for `email`
 *
 * @param {String} email
 * @private
 */

SigninPanel.prototype.gravatar = function(email) {
  gravatar(this.widget, email);
  return this;
}

/**
 * Validate form and continue with signin
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
  var password_required = options._isThereAnyDBConnection();

  var validate_username = options._isUsernameRequired();
  var email_input = this.query('input[name=email]');
  var email_parsed = regex.email_parser.exec(email_input.val().toLowerCase());
  var username_parsed = regex.username_parser.exec(email_input.val().toLowerCase());
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
      ok = false || (validate_username && username_parsed);
      if(!ok) widget._focusError(email_input, options.i18n.t('invalid'));
    }
  }

  if (password_empty && password_required && !password_disabled) {
    widget._focusError(password_input);
    ok = false;
  }

  if (this.hrd) {
    return this.enableHRD(this.currentADConnection, this.currentADConnectionDomain);
  }

  if (ok && this.currentADConnection) {
    var conn_obj = this.options._findConnectionByADDomain(
      this.currentADConnection.domain,
      widget.$client.strategies
    );
    return widget._signinWithAuth0(this, conn_obj);
  }

  if (ok) { return widget._signin(this); }
};

/**
 * Handle `e` for social connections button click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onsocialclick = function(e) {
    stop(e);
    this.widget._signinSocial(e, null, null, this);
};

/**
 * Handle `e` for reset button action click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onresetclick = function(e) {
  stop(e);
  this.widget._resetPanel(this.options);
};

/**
 * Handle `e` for signup button action click
 *
 * @param {Event} e
 * @private
 */

SigninPanel.prototype.onsignupclick = function(e) {
  stop(e);
  this.widget._signupPanel(this.options);
};


/**
 * Enables Home Realm Discovery in signin
 *
 * @param {Connection} conn
 * @private
 */
// TODO Refactor
SigninPanel.prototype.enableHRD = function (adConnection, emailDomain) {
  this.hrd = undefined;

  var emailField = this.query('.a0-email input').first();
  var pwdField   = this.query('.a0-password input').first();
  var nextButton = this.query('.a0-action > button.a0-next');

  var emailParsed = regex.email_parser.exec(emailField.val());

  this.query('.a0-password').removeClass('a0-hide');
  this.query('.a0-sso-notice-container').addClass('a0-hide');
  nextButton.text(this.oldText);
  pwdField.removeAttr('disabled');

  this.widget.setPanel(this);

  var placeholder = this.options.i18n.t('signin:usernamePlaceholder');

  this._oldPlaceholder = emailField.attr('title');

  emailField
  .attr('type', 'text')
  .attr('title', placeholder)
  .attr('placeholder', placeholder);

  this.query('.a0-email label').text(placeholder);
  emailField.focus();
  if (emailParsed.length > 1 && this.options.defaultADUsernameFromEmailPrefix) {
    emailField.val(emailParsed[1]);
  } else {
    emailField.val('');
  }

  this.query('.a0-corporate-credentials').toggleClass('a0-hide');
  this.query('.a0-domain').text(emailDomain);

  // Hide other actions buttons
  var actions = $.create(this.widget.render(loginActionsTmpl, {
    showSignupAction: false,
    showResetAction: false,
    showCancel: true
  }));

  this.query('.a0-db-actions').first().deepEach(function (child) {
    $(child).hide();
  });
  this.query('.a0-db-actions').append(actions);
  this.query('.a0-db-actions').show();

  this.query('.a0-cancel').a0_on('click', bind(this.oncancel, this));
  this.currentADConnection = adConnection;
  emailField.a0_off('input');
};


/**
 * Handle `e` for cancel button action click (when doing HRD)
 *
 * @param {Event} e
 * @private
 */
// TODO Refactor
SigninPanel.prototype.oncancel = function (e) {
  stop(e);

  this.currentADConnection = undefined;

  var widget = this.widget;
  // Clean error container
  widget._showError();
  widget._focusError();
  widget.setPanel(this);

  var emailField = this.query('.a0-email input').first();
  var pwdField   = this.query('.a0-password input').first();

  this.query('.a0-db-actions').first().deepEach(function (child) {
    $(child).show();
  });

  var oldPlaceholder = this._oldPlaceholder;
  this._oldPlaceholder = undefined;

  this.query('.a0-db-actions .a0-cancel').remove();
  emailField
    .attr('type', 'text')
    .attr('title', oldPlaceholder)
    .attr('placeholder', oldPlaceholder);

  emailField.val('');
  pwdField.val('');

  this.query('.a0-email label').text(oldPlaceholder);

  this.query('.a0-corporate-credentials').toggleClass('a0-hide');
  emailField.a0_on('input', bind(this.onemailinput, this));
  emailField.focus();

  debug('sigin canceled');
};


