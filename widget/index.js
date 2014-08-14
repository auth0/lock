require('../lib/insert-css');

var Auth0       = require('auth0-js');
var _           = require('underscore');
var strategies  = require('./js/strategies');
var mainTmpl    = require('./html/main.ejs');
var embTmpl     = require('./html/main_embedded.ejs');
var buttonTmpl  = require('./html/button.ejs');

var EventEmitter = require('events').EventEmitter;

var loggedinBtnTmpl      = require('./html/loggedin_button.ejs');
var loginActionsTmpl     = require('./html/login_actions.ejs');
var i18n                 = require('../i18n');

var regex = require('./js/regex');
var email_parser = regex.email_parser;

var signup = require('./modes/signup');
var reset = require('./modes/reset');

var $ = require('./js/bonzo_qwery');
var bonzo = require('bonzo');
var is_small_screen = require('./js/is_small_screen');
var get_viewport = require('./js/get_viewport');

//browser incompatibilities fixes
var placeholderSupported = require('./pf/placeholderSupported');
var object_create = require('./pf/Object.create');
var transition_end = require('./pf/transition_end');
var utils = require('./pf/utils');
var trim = require('trim');
var has_animations = require('./pf/has_animations');

function hasTransitions (el) {
  //defer this. prevent errors if the script is placed on the <head>
  return require('has-transitions')(el);
}

function setfocus (el) {
  if (is_small_screen()) return;
  try{ el.focus(); } catch(er) {}
}

function animation_shake(context) {
  $('.a0-panel', context)
    .removeClass('a0-swing')
    .addClass('a0-errors')
    .addClass('a0-animated a0-shake');
}

function animation_shake_reset(context) {
  $('.a0-animated', context).removeClass('a0-animated');
  $('.a0-shake', context).removeClass('a0-shake');
}

function Auth0Widget (options) {
  if (!(this instanceof Auth0Widget)) {
    return new Auth0Widget(options);
  }

  this._dict = i18n.getDict(options.dict);

  this._options = options;
  this._strategies = strategies;
  this._auth0 = new Auth0({
    clientID:     this._options.clientID,
    callbackURL:  this._options.callbackURL,
    domain:       this._options.domain,
    forceJSONP:   this._options.forceJSONP,
    callbackOnLocationHash: this._options.callbackOnLocationHash
  });

  if (!this._options.assetsUrl) {
    // use domain as assetsUrl if domain is not *.auth0.com
    this._options.assetsUrl = this._isAuth0Domain() ?
      'https://s3.amazonaws.com/assets.auth0.com/' :
      'https://' + this._options.domain + '/';
  }

  if (!this._options.cdn) {
    // use domain as cdn if domain is not *.auth0.com
    this._options.cdn = this._isAuth0Domain() ?
      'https://d19p4zemcycm7a.cloudfront.net/w2/' :
      'https://' + this._options.domain + '/w2/';
  }

  this._getApp();

  EventEmitter.call(this);
  var self = this;
}

Auth0Widget.version = require('package.version');

Auth0Widget.prototype = object_create(EventEmitter.prototype);

// helper methods
Auth0Widget.prototype._$ = function(selector, context) {
  return $(selector, context || this._container);
};

Auth0Widget.prototype._getApp = function () {
  var self = this;
  global.window.Auth0 = global.window.Auth0 || {};
  global.window.Auth0.setClient = function (client) {
    self._client = client;
    self.emit('client_initialized', client);
  };

  var script = document.createElement('script');
  script.src = this._options.assetsUrl +
               'client/' + this._options.clientID + '.js' +
               '?t' + (+new Date); //Date.now() doesnt work on ie.

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
};

Auth0Widget.prototype._isAuth0Domain = function () {
  var domainUrl = utils.parseUrl('https://' + this._options.domain);
  return utils.endsWith(domainUrl.hostname, '.auth0.com');
};

Auth0Widget.prototype._ignoreEmailValidations = function (input) {
  return input.attr('type') !== 'email';
};

Auth0Widget.prototype._setCustomValidity = function (input, message) {
  if (!input) return;
  if (input.setCustomValidity) {
    input.setCustomValidity(message);
  }
  // TODO: support setCustomValidity in IE9
};

Auth0Widget.prototype._showError = function (error) {

  // if no error, clean
  if (!error) {
    // reset errors
    this._$('.a0-error').html('').addClass('a0-hide');
    this._$('.a0-errors').removeClass('a0-errors');
    // reset animations
    return animation_shake_reset(this._container);
  }

  // else, show and render error message
  setTimeout(animation_shake, 0, this._container);

  this._$('.a0-success').addClass('a0-hide');
  this._$('.a0-error').html(error).removeClass('a0-hide');
  this.emit('_error', error);
};

Auth0Widget.prototype._showSuccess = function (message) {
  // if no message, clean success span
  if (!message) return this._$('.a0-success').html('').addClass('a0-hide');
  // else, show and render success message
  this._$('.a0-error').addClass('a0-hide');
  this._$('.a0-success').html(message).removeClass('a0-hide');
};

Auth0Widget.prototype._focusError = function(input, message) {
  // remove all `_focusError` resources
  if (!arguments.length) {
    // reset errors
    this._$('.a0-errors').removeClass('a0-errors');
    this._$('.a0-error-input').removeClass('a0-error-input');
    this._$('.a0-error-message').remove();
    // reset animations
    return animation_shake_reset(this._container);;
  }

  // animation
  setTimeout(animation_shake, 0, this._container);

  input
    .parent()
    .addClass('a0-error-input')

  if (!message) return;
  input.parent()
    .append($.create('<span class="a0-error-message">' + message + '</span>'));
};

Auth0Widget.prototype._setTitle = function(title) {
  // this._$('.a0-error').css('display', 'none');
  // this._$('.a0-success').css('display', 'none');
  this._$('h1').html(title).css('display', '');
};

Auth0Widget.prototype._areThereAnySocialConn = function () {
  return !!_.findWhere(this._client.strategies, {social: true});
};

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  return !!_.findWhere(this._client.strategies, {social: false});
};

Auth0Widget.prototype._areThereAnyDbConn = function() {
  return !!_.findWhere(this._client.strategies, {userAndPass: true});
};

Auth0Widget.prototype._isEnterpriseConnection = function (email, output) {
  var emailM = email_parser.exec(email.toLowerCase());

  if (!emailM) return false;

  var email_domain = emailM.slice(-2)[0];

  var conn = _.chain(this._client.strategies)
              .where({userAndPass: undefined})
              .pluck('connections')
              .flatten()
              .findWhere({domain: email_domain})
              .value();

  if (conn && output) {
    output.domain = conn.domain;
  }

  return !!conn;
};

Auth0Widget.prototype._getConfiguredStrategy = function (name) {
  return _.findWhere(this._client.strategies, {name: name});
};

Auth0Widget.prototype._getStrategy = function (connName) {
  return _.chain(this._client.strategies)
          .filter(function (s) {
            return _.findWhere(s.connections, {name: connName});
          }).value()[0];
};

Auth0Widget.prototype._getAuth0Connection = function(userName) {
  // if specified, use it, otherwise return first
  if (this._signinOptions['userPwdConnectionName']) {
    return _.chain(this._auth0Strategies)
            .pluck('connections')
            .flatten()
            .findWhere({name: this._signinOptions['userPwdConnectionName']})
            .value();
  }

  var domain = userName && ~userName.indexOf('@') ? userName.split('@')[1] : '';

  if (userName && domain && this._client.strategies) {
    //there is still a chance that the connection might be
    //adldap and with domain
    var conn = _.chain(this._client.strategies)
                .pluck('connections')
                .flatten()
                .findWhere({domain: domain})
                .value();
    if (conn) {
      return conn;
    }
  }

  // By default, if exists, return auth0 connection (db-conn) or first
  var defaultStrategy = _.findWhere(this._auth0Strategies, { name: 'auth0' });
  defaultStrategy = defaultStrategy || (this._auth0Strategies.length > 0 ? this._auth0Strategies[0] : null);

  return defaultStrategy && defaultStrategy.connections.length > 0 ?
         defaultStrategy.connections[0] : null;
};

Auth0Widget.prototype._showOrHidePassword = function () {
  var mailField = this._$('.a0-notloggedin .a0-email input');
  var pwdField  = this._$('.a0-notloggedin .a0-password input').first();

  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val() || '');

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    // pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    // pwdField.attr('required', true);
  }
};

Auth0Widget.prototype._hideSignIn = function (cb) {
  var self = this;

  this._$('div.a0-overlay').removeClass('a0-active');

  this._$().removeClass('a0-mode-signin');
  this._$().css('display', 'none');
  bonzo(document.body).removeClass('a0-widget-open');

  if (this._container && this._signinOptions.container) {
    // remove `#a0-widget`
    this._$().remove();
  } else if(this._container) {
    // remove `.a0-widget-container`
    this._$().parent('.a0-widget-container').remove();
  }

  this._currentPane = null;
  this._container = null;

  if (cb) cb();
  this.emit('closed');

  return self;
};

Auth0Widget.prototype._getActiveLoginView = function() {
  var container = this._currentPane.hasClass('a0-loggedin') ?
                    this._$('.a0-loggedin') :
                    this._$('.a0-notloggedin');
  return container;
};

Auth0Widget.prototype._showSignUpExperience = function() {
  signup.bind(this);
  this._showSuccess();
  this._showError();
  this._focusError();
  this._setLoginView({ mode: 'signup' });
};

Auth0Widget.prototype._showResetExperience = function() {
  reset.bind(this);
  this._showSuccess();
  this._showError();
  this._focusError();
  this._setLoginView({ mode: 'reset' });
};

Auth0Widget.prototype._showLoadingExperience = function() {
  if (this._openWith) {
    return this._setLoginView({ mode: 'loading', title: this._openWith.toLowerCase() });
  }
  this._showSuccess();
  this._showError();
  this._focusError();
  this._setLoginView({ mode: 'loading' });
};

Auth0Widget.prototype._transitionMode = function(options, callback) {
  var self = this;
  this._$('.a0-loading').removeClass('a0-with-message');

  if((!self._currentPane || self._currentPane.hasClass('a0-loading')) && options.mode === 'loading') {
    self._setTitle(options.title ? this._dict.t(options.title + ':title') : this._dict.t('signin:title'));
    self._currentPane = this._$('.a0-loading');
    self.emit('transition_mode', 'loading');
    self.emit('loading_ready');
    return callback(null, self._currentPane);
  }

  self._currentPane = self._currentPane || this._$('.a0-loading');
  options = options || {};

  var currentEmail = this._$('.a0-email input', self._currentPane).val();
  var mode = options.mode || null;
  var newPane, title;

  switch (mode) {
    case null:
      title = this._dict.t('signin:title');
      newPane = this._$(options.isReturningUser ? '.a0-loggedin' : '.a0-notloggedin');
      if (self._currentPane.hasClass('a0-reset') || self._currentPane.hasClass('a0-loading')) {
        // reset password field
        this._$('.a0-password input', newPane).val('');
      }
      break;
   case 'loading':
      title = options.title ? this._dict.t(options.title + ':title') : this._dict.t('signin:title');
      newPane = this._$('.a0-loading').first();

      // set loading message
      if (options.message) {
        newPane.addClass('a0-with-message');
        this._$('.a0-spin-message span', newPane).html(options.message.replace('-', ' '));
      }
      break;
    case 'signup':
    case 'reset':
      title = this._dict.t(options.mode + ':title');
      newPane = this._$('.a0-' + options.mode).first();
      // XXX Hack, when coming from loading currentPane does not contain email.
      currentEmail = currentEmail || $('.a0-email input', newPane).val();
      this._$('.a0-email input', newPane).val(currentEmail || '');
      break;
  }

  if (!hasTransitions() || !hasTransitions(this._$('#a0-onestep')[0])){
    self._setTitle(title);
    self._currentPane.toggleClass('a0-hide', true);
    self._currentPane = newPane.toggleClass('a0-hide', false);
    setTimeout(function () {
      self.emit('transition_mode', mode || 'signin');
      self.emit((mode || 'signin') + '_ready');
    }, 0);
    return callback(null, self._currentPane);
  }

  var pane_container = this._$('.a0-onestep');
  var original_height = pane_container
                          .addClass('a0-disable-transition')
                          .css('height', 'auto')
                          .dim().height;

  pane_container.css('min-height', original_height.toString() + 'px');

  //do not hide yet
  self._currentPane
      .css('position', 'absolute')
      .css('left', '-1000px');

  newPane
    .toggleClass('a0-hide', false)
    .css('visibility', 'hidden');

  pane_container.css('min-height', '');

  var new_height = pane_container.dim().height;

  pane_container.css('min-height', original_height.toString() + 'px');

  newPane.css('visibility', '').toggleClass('a0-hide', true);

  self._currentPane
      .css('position', '')
      .css('left', '')
      .toggleClass('a0-hide', false);

  pane_container
    .css('height', original_height.toString() + 'px')
    .css('min-height', '');

  setTimeout(function () {
    pane_container.removeClass('a0-disable-transition');
    setTimeout(function () {
      if (!pane_container[0]) return;
      transition_end.on(pane_container[0], function () {
        if (!pane_container[0]) return;
        transition_end.off(pane_container[0]);
        self._setTitle(title);
        self._currentPane.toggleClass('a0-hide', true);
        self._currentPane = newPane.toggleClass('a0-hide', false);
        setTimeout(function () {
          self.emit('transition_mode', mode || 'signin');
          self.emit((mode || 'signin') + '_ready');
          callback(null, self._currentPane);
          // XXX: safari flickers when changing height property
          if (is_small_screen()) pane_container.css('height','auto');
        }, 10);
      });
      pane_container.css('height', new_height.toString() + 'px');

      if (new_height >= get_viewport().height) pane_container.addClass('a0-equal-viewport');
    }, 10);
  }, 10);
};

Auth0Widget.prototype._setLoginView = function(options, callback) {
  var self = this;
  this._transitionMode(options || {}, function (err, currentPane) {
    if (!self._signinOptions._avoidInitialFocus) setfocus(self._$('input', currentPane).first());
    if (callback) callback();
  });
};

Auth0Widget.prototype._getLoggedInAuthParams = function (strategy, ssoData) {
  switch (strategy) {
    case 'google-oauth2':
      return {login_hint:ssoData.lastUsedUsername};
    default:
      return {};
  }
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy_name = this._ssoData.lastUsedConnection.strategy;
  var strategy = this._strategies[strategy_name];

  if (!strategy) return;

  var loginView = this._$('.a0-loggedin');

  this._$('form', loginView).a0_on('submit', function (e) {
    self._signInEnterprise(e);
  });

  var button = $.create(loggedinBtnTmpl({
    name: strategy_name,
    title: strategy.title,
    css: strategy.css,
    imageicon: strategy.imageicon,
    username: this._ssoData.lastUsedUsername
  }));

  this._$('.a0-last-time').html(this._dict.t('signin:returnUserLabel'));

  this._$('.a0-strategy div', loginView).remove();

  this._$('.a0-strategy', loginView)
    .append(button);

  this._$('.a0-strategy .a0-zocial[data-strategy]', loginView).a0_on('click', function (e) {
    e.preventDefault();
    self._signInSocial(
      strategy_name,
      self._ssoData.lastUsedConnection && self._ssoData.lastUsedConnection.name,
      self._getLoggedInAuthParams(strategy_name, self._ssoData));
  });

  this._$('.a0-all', loginView).a0_on('click', function () {
    self._setLoginView();
  });

  this._setLoginView({ isReturningUser: !!strategy });
};

Auth0Widget.prototype._showAdInDomainExperience = function() {
  var self = this;
  var connection = this._ssoData.connection;
  //this could be ad or auth0-adldap
  var strategy_name = this._ssoData.strategy;
  var strategy = this._strategies[strategy_name];

  if (!strategy) return;

  var loginView = this._$('.a0-loggedin');

  this._$('form', loginView).a0_on('submit', function (e) {
    self._signInEnterprise(e);
  });

  var button = $.create(buttonTmpl({
    use_big_buttons: true,
    name: strategy_name,
    title: this._dict.t('windowsAuthTitle').replace('{connection}', connection),
    css: strategy.css,
    imageicon: strategy.imageicon,
  }));

  this._$('.a0-last-time').html(this._dict.t('signin:domainUserLabel'));

  this._$('.a0-strategy div', loginView).remove();

  this._$('.a0-strategy', loginView)
    .append(button);

  this._$('.a0-strategy .a0-zocial[data-strategy]', loginView).a0_on('click', function (e) {
    e.preventDefault();
    self._signInSocial(strategy_name, connection);
  });

  this._$('.a0-all', loginView).a0_on('click', function () {
    self._setLoginView();
  });

  this._setLoginView({ isReturningUser: !!strategy });
};

Auth0Widget.prototype._signInPopupNoRedirect = function (connectionName, popupCallback, extraParams) {
  var self = this;
  var container = this._getActiveLoginView();
  var email_input = this._$('input[name=email]', container);
  var password_input = this._$('input[name=password]', container);

  extraParams = extraParams || {};

  var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self._signinOptions.popup,
        popupOptions: self._signinOptions.popupOptions
      }, self._signinOptions.extraParameters, extraParams);
  if (!popupCallback) {
    throw new Error('Popup mode needs a callback to be executed after authentication success or failure.');
  }
  var loadingMessage = self._dict.t('signin:popupCredentials');
  self._auth0.login(loginOptions, function(err, profile, id_token, access_token, state) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (err) {
      // set error message before view refresh
      // to avoid wrong resizing calculations
      // XXX: This message is only displayed on popup mode
      if (err.message === 'User closed the popup window') {
        // Closed window
        self._showError(self._dict.t('signin:userClosedPopup'));

      } else if (err.message === 'access_denied') {
        // Permissions not granted
        self._showError(self._dict.t('signin:userConsentFailed'));
      } else if (err.status !== 401) {
        self._showError(self._dict.t('signin:serverErrorText'));
      } else {
        self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
        self._focusError(email_input);
        self._focusError(password_input);
      }
      self._setLoginView({});
    } else {
      self._hideSignIn();
    }
    self._signinOptions.popupCallback.apply(null, args);
  });
  self._setLoginView({ mode: 'loading', message: loadingMessage});
};

// sign in methods
Auth0Widget.prototype._signInSocial = function (e, connection, extraParams) {
  var target = e.currentTarget || e.delegateTarget || e.target || e;
  var self = this;
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getConfiguredStrategy(strategyName);

  var connectionName = connection || strategy.connections[0].name;
  // use extraParameters because it is used in all branches to set loginOptions
  var extra = self._signinOptions.extraParameters;

  if (extra.connection_scopes) {
    // if no connection_scope was set for the connection we are ok with sending undefined
    extra.connection_scope = extra.connection_scopes[connectionName];
  }

  if (strategy) {
    // If we are in popup mode and callbackOnLocationHash was specified
    // we need to pass a callback.
    if (self._signinOptions.popup && self._options.callbackOnLocationHash) {
      this._signInPopupNoRedirect(connectionName, self._signinOptions.popupCallback, extraParams);
    } else {
      var loginOptions = _.extend({}, {
        connection: connectionName,
        popup: self._signinOptions.popup,
        popupOptions: self._signinOptions.popupOptions
      }, self._signinOptions.extraParameters, extraParams);

      this._auth0.login(loginOptions);
    }
  }
};

Auth0Widget.prototype._signInEnterprise = function (e) {
  e.preventDefault();
  e.stopPropagation();


  var self = this;
  var container = this._getActiveLoginView();
  var form = this._$('form', container);
  var valid = true;

  var emailD = this._$('.a0-email', form);
  var password_input = this._$('input[name=password]', form);
  var password_empty = regex.empty.test(password_input.val());
  var password_disabled = password_input.attr('disabled');
  var password_required = self._signinOptions.showEmail && self._signinOptions.showPassword && self._areThereAnyDbConn();
  var email_input = this._$('input[name=email]', form);
  var email_value = trim(email_input.val());
  var email_parsed = email_parser.exec(email_value.toLowerCase());
  var email_empty = regex.empty.test(email_value);
  var email = null, domain, connection, has_errors = false;

  // Clean error container
  this._showError();
  this._focusError();

  if (email_empty) {
    this._focusError(email_input);
    has_errors = true;
  }

  if (!this._ignoreEmailValidations(email_input)) {
    if (!email_parsed && !email_empty) {
      this._focusError(email_input, this._dict.t('invalid'));
      has_errors = true;
    }
  }

  if (password_empty && password_required && !password_disabled) {
    this._focusError(password_input);
    has_errors = true;
  };

  if (has_errors) return;

  var input_email_domain = email_parsed ? email_parsed.slice(-2)[0] : undefined;

  var conn_obj = _.chain(this._client.strategies)
    .where({userAndPass: undefined})
    .pluck('connections')
    .flatten()
    .findWhere({domain: input_email_domain})
    .value();


  // Gets suffix
  if (conn_obj) {
    domain = conn_obj.domain;
    email = email_input.val();
    connection = conn_obj.name;
  } else {
    if (this._auth0Strategies.length > 0) {
      return this._signInWithAuth0(email_input.val());
    }

    if (input_email_domain === 'gmail.com') {
      return this._signInSocial('google-oauth2');
    }

    this._showError(
      this._dict.t('signin:strategyDomainInvalid')
          .replace('{domain}', input_email_domain));
    this._focusError(email_input);
  }

  valid &= (!domain && !emailD.addClass('a0-invalid')) || (!!domain && !!emailD.removeClass('a0-invalid'));

  if (valid) {
    if (self._signinOptions.popup && self._options.callbackOnLocationHash) {
      this._signInPopupNoRedirect(connection, self._signinOptions.popupCallback);
    } else {
      var loadingMessage = self._dict.t('signin:loadingMessage').replace('{connection}', connection);
      this._setLoginView({ mode: 'loading', message: loadingMessage }, function () {
        var loginOptions = _.extend({}, {
          connection: connection,
          popup: self._signinOptions.popup,
          popupOptions: self._signinOptions.popupOptions
        }, self._signinOptions.extraParameters);
        self._auth0.login(loginOptions);
      });
    }
  }
};

Auth0Widget.prototype._signInWithAuth0 = function (userName, signInPassword) {
  var self = this;
  var container = this._getActiveLoginView();
  var connection  = this._getAuth0Connection(userName);
  var email_input = this._$('input[name=email]', container);
  var password_input = this._$('input[name=password]', container);

  var loginOptions = {
    connection: connection.name,
    username: connection.domain ?
                userName.replace('@' + connection.domain, '') :
                userName,
    password: signInPassword || this._$('.a0-password input', container).val(),
    popup: self._signinOptions.popup,
    popupOptions: self._signinOptions.popupOptions
  };

  loginOptions = _.extend({}, loginOptions, self._signinOptions.extraParameters);

  var strategy = self._getStrategy(connection.name) || {};
  var loadingMessage = strategy.name !== 'auth0' ? // dont show loading message for dbConnections
    self._dict.t('signin:loadingMessage').replace('{connection}', connection.name) : '';

  // Clean error container
  self._showError();
  self._focusError();
  if (self._signinOptions.popup) {
    if (self._signinOptions.sso) {
      // popup + sso = redirect
      self._auth0.login(loginOptions, function (err) {
        if (err) {
          if (err.status !== 401) {
            self._showError(err.message || self._dict.t('signin:serverErrorText'));
          }
          self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
          self._focusError(email_input);
          self._focusError(password_input);
        }
      });
    } else {
      // popup without sso = no redirect (ajax, not setting cookie)
      this._signInPopupNoRedirect(connection.name, self._signinOptions.popupCallback, loginOptions);
    }

    return;
  }

  // TODO: Handle sso case without popup

  this._setLoginView({ mode: 'loading', message: loadingMessage }, function (){
    self._auth0.login(loginOptions, function (err) {
      if (err) {
        // set error message before view refresh
        // to avoid wrong resizing calculations
        if (err.status !== 401) {
          self._showError(err.message || self._dict.t('signin:serverErrorText'));
        }
        self._showError(self._dict.t('signin:wrongEmailPasswordErrorText'));
        self._setLoginView({}, function () {
          self._focusError(email_input);
          self._focusError(password_input);
        });
      }
    });
  });
};

// initialize
Auth0Widget.prototype._initialize = function (widgetLoadedCallback) {
  var self = this;
  this._$().addClass('a0-mode-signin');

  // wait for setClient()
  if (!self._client) {
    var args  = arguments;
    var setClient = global.window.Auth0.setClient;

    global.window.Auth0.setClient = function () {
      setClient.apply(this, arguments);
      self._initialize.apply(self, args);
    };

    return;
  }

  // buttons actions
  this._$('.a0-onestep a.a0-close').a0_on('click', function (e) { e.preventDefault(); self._hideSignIn(); });
  this._$('.a0-notloggedin form').a0_on('submit', function (e) { self._signInEnterprise(e); });
  this._$('').a0_on('keyup', function (e) {
    if ((e.which == 27 || e.keycode == 27) && !self._signinOptions.standalone) {
      self._hideSignIn(); // close popup with ESC key
    }
  });

  if (self._client.subscription && !~['free', 'dev'].indexOf(self._client.subscription)) {
    // hide footer for non free/dev subscriptions
    this._$('.a0-footer').toggleClass('a0-hide', true);
    this._$('.a0-free-subscription').removeClass('a0-free-subscription');
  }

  // images from cdn
  // this._$('.a0-header a.a0-close').css('background-image', 'url(' + self._signinOptions.cdn + 'img/close.png)');

  // labels text
  var options = _.extend({}, this._signinOptions, this._signinOptions.resources);
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
  options['enableADRealmDiscovery'] = typeof options['enableADRealmDiscovery'] !== 'undefined' ? options['enableADRealmDiscovery'] : true;

  this._signinOptions = options;

  // activate panel
  this._$('div.a0-panel').removeClass('a0-active');
  this._$('div.a0-overlay').addClass('a0-active');
  this._$('div.a0-panel.a0-onestep').addClass('a0-active');

  if (self._signinOptions.container) {
    this._$('div.a0-active').removeClass('a0-overlay');
  }

  this._$('.a0-popup h1').html(this._dict.t('signin:title'));
  this._$('.a0-popup .a0-invalid').removeClass('a0-invalid');

  this._$('div.a0-panel.a0-onestep h1').html(this._signinOptions['title']);

  if (self._signinOptions.connections) {
    self._client.strategies = _.chain(self._client.strategies)
                                .map(function (s) {
                                  s.connections = _.filter(s.connections, function (c) {
                                    return _.contains(self._signinOptions.connections, c.name);
                                  });
                                  return s;
                                }).filter(function (s) {
                                  return s.connections.length > 0;
                                }).value();
  }


  // merge strategies info
  for (var s = 0; s < self._client.strategies.length; s++) {
    var strategy_name = self._client.strategies[s].name;
    self._client.strategies[s] = _.extend({}, self._client.strategies[s], self._strategies[strategy_name]);
  }

  self._auth0Strategies = _.chain(self._client.strategies)
                            .filter(function (s) { return s.userAndPass && s.connections.length > 0; })
                            .value();

  var auth0Conn = this._getAuth0Connection() || {};
  if (self._openWith === 'SignUp' && !auth0Conn.showSignup && !self._signinOptions.signupLink) self._openWith = null;
  if (self._openWith === 'Reset' && !auth0Conn.showForgot && !self._signinOptions.forgotLink) self._openWith = null;

  // show loading
  self._showLoadingExperience();

  function finish(err, ssoData){
    self._ssoData = ssoData;
    self._resolveLoginView();
    if (widgetLoadedCallback && typeof widgetLoadedCallback === 'function') widgetLoadedCallback();
  }

  var is_any_ad = _.some(self._client.strategies, function (s) {
    return (s.name === 'ad' || s.name === 'auth0-adldap') &&
            s.connections.length > 0;
  });

  // get SSO data
  if (this._signinOptions.enableReturnUserExperience === false && (!is_any_ad || self._openWith || this._signinOptions.enableADRealmDiscovery === false)) {
    finish(null, {});
  } else {
    self._auth0.getSSOData(is_any_ad, finish);
  }
};

Auth0Widget.prototype._resolveLoginView = function () {
  var self = this;

  var use_big_buttons = this._signinOptions['socialBigButtons'] || !this._areThereAnyEnterpriseOrDbConn();

  // load social buttons
  var list = this._$('.a0-notloggedin .a0-iconlist');
  var socialStrategies = _.chain(self._client.strategies).where({social: true});

  if (self._signinOptions.connections) {
    // sort social strategies based on options.connections array order
    var connections = self._signinOptions.connections;
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
        title: self._dict.t('loginSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(self._client.strategies, {social: true}).length > 0) {
    this._$('.a0-notloggedin .a0-separator, .a0-notloggedin .a0-iconlist').toggleClass('a0-hide', false);
  }

  this._$('.a0-notloggedin .a0-email input').a0_on('input', function (e) {
    self._showOrHidePassword(e);
  });

  this._$('.a0-zocial[data-strategy]', list).a0_on('click', function (e) {
    self._signInSocial(e);
  });

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection() || {};
  var actions = $.create(loginActionsTmpl({
    showSignup: (this._signinOptions.showSignup !== false) && ((auth0Conn && auth0Conn.showSignup) || this._signinOptions.signupLink),
    showForgot: (this._signinOptions.showForgot !== false) && ((auth0Conn && auth0Conn.showForgot) || this._signinOptions.forgotLink),
    i18n: this._dict,
    signupLink: this._signinOptions.signupLink,
    forgotLink: this._signinOptions.forgotLink
  }));

  // username_style
  var auth0ConnStrategy = this._getStrategy(auth0Conn.name) || {};

  if (!this._signinOptions.username_style &&
      (auth0ConnStrategy.name === 'ad' || auth0ConnStrategy.name === 'auth0-adldap')) {
    this._signinOptions.username_style = 'username';
  }

  if (this._signinOptions.username_style === 'username') {
    // set username mode
    var placeholder = this._dict.t('signin:usernamePlaceholder');
    this._$('.a0-notloggedin .a0-email input')
      .attr('type', 'text')
      .attr('title', placeholder)
      .attr('placeholder', placeholder);

    this._$('.a0-notloggedin .a0-email label').text(placeholder);
  }

  this._$('.a0-db-actions').append(actions);

  var signup_btn = this._$('.a0-sign-up');
  if (!this._signinOptions.signupLink && signup_btn.length > 0) {
    signup_btn.a0_on('click', function (e) {
      self._showSignUpExperience(e);
    });
  }

  if (!this._signinOptions.forgotLink) {
    this._$('.a0-forgot-pass').a0_on('click', function (e) {
      self._showResetExperience(e);
    });
  }

  this._$('.a0-panel input').val('');

  this._$('.a0-panel .a0-signup .a0-email input').a0_on('input', function() {
    var output = {};
    if (self._isEnterpriseConnection(this.value, output)) {
      var warningText = self._dict.t('signup:enterpriseEmailWarningText').replace(/{domain}/g, output.domain);
      // self._setCustomValidity(this, warningText);
    } else {
      // self._setCustomValidity(this, '');
    }
  });

  this._$('.a0-panel .a0-options .a0-cancel').a0_on('click', function () {
    self._showSuccess();
    self._showError();
    self._focusError();
    self._setLoginView();
  });

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = self._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = self._areThereAnySocialConn();
  var anyDbConnection = self._areThereAnyDbConn();

  this._$('.a0-panel .a0-email input').toggleClass('a0-hide', !(self._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  this._$('.a0-panel .a0-zocial.a0-primary').toggleClass('a0-hide', !(self._signinOptions.showEmail && anyEnterpriseOrDbConnection));
  this._$('.a0-panel .a0-password').toggleClass('a0-hide', !(self._signinOptions.showEmail && self._signinOptions.showPassword && anyDbConnection));
  this._$('.a0-panel .a0-separator').toggleClass('a0-hide', !(self._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection));

  this._$('.a0-panel .a0-inputs').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);
  this._$('.a0-panel .a0-action').toggleClass('a0-hide', !anyEnterpriseOrDbConnection);

  if (is_small_screen()) {
    var collapse_onfocus = require('./js/collapse_onfocus');
    collapse_onfocus.hook(this._$('.a0-notloggedin form input'), this._$('.a0-collapse-social'));
  }

  if (self._openWith) {
    return self['_show' + self._openWith + 'Experience']();
  }

  // if user in AD ip range
  if (self._ssoData && self._ssoData.connection) {
    self._showAdInDomainExperience();
    return;
  } else {
    // if user logged in show logged in experience
    if (self._ssoData.sso && self._signinOptions['enableReturnUserExperience']) {
      self._showLoggedInExperience();
      return;
    }
  }

  self._setLoginView({ isReturningUser: self._ssoData.sso && self._signinOptions['enableReturnUserExperience'] !== false});
};

Auth0Widget.prototype._getEmbededTemplate = function (signinOptions) {
  return signinOptions.chrome ?
    mainTmpl({
      expand:       true, // cover the entire container
      i18n:         this._dict,
      options:      signinOptions,
      alt_spinner:  !has_animations() ? (signinOptions.cdn + 'img/ajax-loader.gif') : null
    }) :
    embTmpl({
      embedded:     true,
      i18n:         this._dict,
      options:      signinOptions,
      alt_spinner:  !has_animations() ? (signinOptions.cdn + 'img/ajax-loader.gif') : null
    });
};

Auth0Widget.prototype.getClient = function () {
  return this._auth0;
};

Auth0Widget.prototype.parseHash = function (hash) {
  return this._auth0.parseHash(hash);
};

Auth0Widget.prototype.getProfile = function (token, callback) {
  this._auth0.getProfile(token, callback);
};

Auth0Widget.prototype.reset = function (signinOptions, widgetLoadedCallback, popupCallback) {
  this._openWith = 'Reset';
  var self = this;
  var displayOptions = _.extend({ showForgot: false, showSignup: false }, signinOptions);
  this._$(function () {
    self._show(displayOptions, widgetLoadedCallback, popupCallback);
  });
  return self;
};

Auth0Widget.prototype.signup = function (signinOptions, widgetLoadedCallback, popupCallback) {
  this._openWith = 'SignUp';
  var self = this;
  var displayOptions = _.extend({ showForgot: false, showSignup: false }, signinOptions);
  this._$(function () {
    self._show(displayOptions, widgetLoadedCallback, popupCallback);
  });
  return self;
};

/**
 * Displays the Auth0 Widget.
 *
 * @param {Object}   signinOptions         options to be passed to auth0.js
 * @param {function} widgetLoadedCallback  callback to be executed when widget loads
 * @param {function} popupCallback         callback to be executed after
 *                                         successful login on popup mode and
 *                                         callbackOnLocationHash is true too.
 */
Auth0Widget.prototype.show = Auth0Widget.prototype.signin = function (signinOptions, widgetLoadedCallback, popupCallback) {
  this._openWith = null;
  var self = this;
  this._$(function () {
    self._show(signinOptions, widgetLoadedCallback, popupCallback);
  });
  return self;
};

Auth0Widget.prototype._show = function (signinOptions, widgetLoadedCallback, popupCallback) {
  if (typeof signinOptions === 'function') {
    widgetLoadedCallback = signinOptions;
    callback = widgetLoadedCallback;
    signinOptions = {};
  }

  var self = this;

  self._signinOptions = _.extend({popupCallback: popupCallback}, self._options, signinOptions);

  var extra = utils.extract(self._signinOptions,
                            [ 'state', 'access_token',
                              'scope', 'protocol', 'device',
                              'request_id', 'connection_scopes', 'nonce',
                              'offline_mode' ]);

  self._signinOptions.extraParameters = _.extend({}, extra, self._signinOptions.extraParameters);

  // widget container
  if (self._signinOptions.container) {
    self._signinOptions.theme = 'static';
    self._signinOptions.standalone = true;
    self._signinOptions.top = true;

    var specifiedContainer = document.getElementById(self._signinOptions.container);
    specifiedContainer.innerHTML = self._getEmbededTemplate(self._signinOptions);
    self._container = specifiedContainer;
  } else {

    var div = document.createElement('div');
    bonzo(div).addClass('a0-widget-container');
    div.innerHTML = mainTmpl({
      i18n:    this._dict,
      options: self._signinOptions,
      alt_spinner: !has_animations() ? (self._signinOptions.cdn + 'img/ajax-loader.gif') : null
    });
    document.body.appendChild(div);
    self._container = div;
  }

  if (!placeholderSupported) {
    this._$('.a0-overlay').addClass('a0-no-placeholder-support');
  }

  if (!self._signinOptions.container) {
    bonzo(document.body).addClass('a0-widget-open');
  }

  self._initialize(widgetLoadedCallback);
  return self;
};

Auth0Widget.prototype.logout = function (query) {
  this._auth0.logout(query);
};

module.exports = Auth0Widget;
