require('../lib/insert-css');

var Auth0       = require('auth0-js');
var qwery       = require('qwery');
var bonzo       = require('bonzo');
var bean        = require('bean');
var xtend       = require('xtend');
var _           = require('underscore');
var strategies  = require('./js/strategies');
var utils       = require('./js/utils');
var mainTmpl    = require('./html/main.ejs');
var buttonTmpl  = require('./html/button.ejs');
var loggedinBtnTmpl = require('./html/loggedin_button.ejs');
var i18n        = require('../i18n');

var $ = function (selector, root) {
  return bonzo(qwery('#a0-widget ' + (selector || ''), root));
};

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
      'https://' + this._options.domain + '/';
  }

  this._getApp();
}

// helper methods
Auth0Widget.prototype._getApp = function () {
  var self = this;
  global.window.Auth0 = global.window.Auth0 || {};
  global.window.Auth0.setClient = function (client) {
    self._client = client;
  };

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = this._options.assetsUrl + 'client/' + this._options.clientID + '.js';

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
};

Auth0Widget.prototype._isAuth0Domain = function () {
  var domainUrl = utils.parseUrl('https://' + this._options.domain);
  return utils.endsWith(domainUrl.hostname, '.auth0.com');
};

Auth0Widget.prototype._setTop = function () {
  var element = $('.a0-signin div.a0-panel.a0-onestep');

  if (!this._signinOptions.top) {
    setTimeout(function() {
      element.css({
        'marginTop': '-' + (element.offset().height / 2) + 'px',
        'top': '50%'
        //'marginTop': '2px',
        //'top': '15%'
      });
    }, 1);
  } else {
    element.css({
      'marginTop': '2px',
      'top': '0'
    });
  }
};

Auth0Widget.prototype._setCustomValidity = function (input, message) {
  if (!input) return;
  if (input.setCustomValidity) {
    input.setCustomValidity(message);
  }
  // TODO: support setCustomValidity in IE9
};

Auth0Widget.prototype._showError = function (error) {
  if (!error) return;
  $('.a0-signin h1').css('display', 'none');
  $('.a0-signin .a0-success').css('display', 'none');
  $('.a0-signin .a0-error').html(error).css('display', '');
};

Auth0Widget.prototype._showSuccess = function (message) {
  if (!message) return;
  $('.signin h1').css('display', 'none');
  $('.a0-signin .a0-error').css('display', 'none');
  $('.a0-signin .a0-success').html(message).css('display', '');
};

Auth0Widget.prototype._setTitle = function(title) {
  $('.a0-signin .a0-error').css('display', 'none');
  $('.a0-signin .a0-success').css('display', 'none');
  $('.a0-signin h1').html(title).css('display', '');
};

Auth0Widget.prototype._parseResponseMessage = function (responseObj, defaultValue) {
  return this._signinOptions[responseObj.code] || responseObj.message || defaultValue;
};

Auth0Widget.prototype._isAdLdapConn = function (connection) {
  return connection === 'adldap';
};

Auth0Widget.prototype._areThereAnySocialConn = function () {
  for (var s in this._client.strategies) {
    if (this._client.strategies[s] && this._client.strategies[s].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  for (var s in this._client.strategies) {
    if (this._client.strategies[s] && !this._client.strategies[s].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._isEnterpriseConnection = function (email, output) {
  var emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    .exec(email.toLowerCase());

  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];
    if (strategy.userAndPass) continue;

    for (var c in strategy.connections) {
      if (emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        output = output || {};
        output.domain = strategy.connections[c].domain;
        return true;
      }
    }
  }

  return false;
};

Auth0Widget.prototype._getConfiguredStrategy = function (name) {
  for (var s in this._client.strategies) {
    if (this._client.strategies[s] && this._client.strategies[s].name === name) {
      return this._client.strategies[s];
    }
  }
};

Auth0Widget.prototype._getAuth0Connection = function() {
  // if specified, use it, otherwise return first
  if (this._signinOptions['userPwdConnectionName']) {
    for (var i in this._auth0Strategies) {
      for (var j in this._auth0Strategies[i].connections) {
        if (this._auth0Strategies[j].connections[j].name === this._signinOptions['userPwdConnectionName']) {
          return this._auth0Strategies[i].connections[j];
        }
      }
    }
  }

  // By default, if exists, return auth0 connection (db-conn)
  var defaultStrategy = _.filter(this._auth0Strategies, function (s) { return s.name === 'auth0'; })[0];
  return this._auth0Strategies.length > 0 ?
    (defaultStrategy ? defaultStrategy.connections[0] : this._auth0Strategies[0].connections[0]) :
    null;
};

Auth0Widget.prototype._showOrHidePassword = function () {
  var mailField = $('.a0-notloggedin .a0-email input');
  var pwdField  = $('.a0-notloggedin .a0-password input').first();

  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val() || '');

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    pwdField.attr('required', true);
  }
};

Auth0Widget.prototype._hideSignIn = function (cb) {
  $('div.a0-overlay').removeClass('a0-active');

  setTimeout(function () {
    $().removeClass('a0-mode-signin');
    $().css('display', 'none');
    if (cb) cb();
  }, 500);
};

Auth0Widget.prototype._getActiveLoginView = function() {
  var container = this._hasLoggedInBefore ? $('.a0-loggedin') : $('.a0-notloggedin');
  return container;
};

Auth0Widget.prototype._toggleSpinner = function (container) {
  container = container || this._getActiveLoginView();
  var spinner = $('.a0-spinner', container);
  var signin = $('.a0-zocial.a0-primary', container);

  spinner.css('display', spinner.css('display') === 'none' ? '' : 'none');
  signin.css('display', signin.css('display') === 'none' ? '' : 'none');
};

Auth0Widget.prototype._showSignUpExperience = function() {
  this._setLoginView({ mode: 'signup' });
};

Auth0Widget.prototype._showResetExperience = function() {
  this._setLoginView({ mode: 'reset' });
};

Auth0Widget.prototype._showLoadingExperience = function() {
  this._setLoginView({ mode: 'loading' });
};

Auth0Widget.prototype._setLoginView = function(options) {
  var self = this;
  options = options || {};

  $('.a0-loading').css('display', 'none');
  $('.a0-loggedin').css('display', 'none');
  $('.a0-notloggedin').css('display', 'none');
  $('.a0-signup').css('display', 'none');
  $('.a0-reset').css('display', 'none');
  $('.a0-signin input[type=password]').val('');

  if (!options.mode) {
    this._hasLoggedInBefore = !!options.isReturningUser;
    this._setTitle(this._dict.t('signin:title'));

    $(options.isReturningUser ? '.a0-loggedin' : '.a0-notloggedin').css('display', '');
    self._setTop();

    try {
      $('input', container).each(function (elem) {
        elem.focus(); // workaround to enable password placeholders with placeholders.js
      });

      if (options.isReturningUser) $('.a0-loggedin .a0-password input').first().focus();
      else $('.a0-notloggedin .a0-email input').first().focus();
    } catch(e) {
      console.log(e);
    }

    return;
  }

  var container;

  switch (options.mode) {
    case 'loading':
      this._setTitle(this._dict.t('loadingTitle'));
      container = $('.a0-loading').first();
      break;
    case 'signup':
      this._setTitle(this._dict.t('signup:title'));
      container = $('.a0-signup').first();
      break;
    case 'reset':
      this._setTitle(this._dict.t('reset:title'));
      container = $('.a0-reset').first();
      break;
  }

  if (container) {
    this._setTop();
    container.css('display', '');

    try {
      var email = $('.a0-notloggedin .email input').val();

      $('input', container).each(function (elem) {
        elem.focus(); // workaround to enable password placeholders with placeholders.js
      });

      $('.a0-email input', container).val(email);
      $('.a0-email input', container).first().focus();
    } catch(e) {
      console.log(e);
    }
  }
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy_name = this._ssoData.lastUsedConnection.strategy;
  var strategy = this._strategies[strategy_name];
  this._setLoginView({ isReturningUser: !!strategy });

  if (!strategy) return;

  var loginView = this._getActiveLoginView();
  bean.on($('form', loginView)[0], 'submit', function (e) { self._signInEnterprise(e); });

  var button;
  if (strategy_name !== 'auth0') {
    button = bonzo.create(loggedinBtnTmpl({
      name: strategy_name,
      title: strategy.title,
      css: strategy.css,
      imageicon: strategy.imageicon,
      username: this._ssoData.lastUsedUsername
    }));

    bean.on(button[0], 'click', function (e) { self._signInSocial(e.target); });

    $('.a0-strategy span', loginView).each(function (el) { if (el) el.remove(); });
    $('.a0-strategy', loginView).append(button);
  }

  bean.on($('.a0-all', loginView)[0], 'click', function () {
    self._setLoginView();
  });

  if (this._ssoData.lastUsedUsername) {
    if (strategy_name === 'auth0') {
      $('.a0-email-readonly', loginView).html(this._ssoData.lastUsedUsername);
      $('.a0-email input', loginView).css('display', 'none');
      $('.a0-emailPassword', loginView).css('display', '');
    }
    else if (!strategy.social) {
      button.html(this._ssoData.lastUsedUsername || strategy.title)
            .attr('title', this._ssoData.lastUsedUsername || strategy.title);
    }
  }
  $('.a0-spinner', loginView).css('display', 'none');
};

// sign in methods
Auth0Widget.prototype._signInSocial = function (target) {
  var self = this;
  var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
  var strategy = this._getConfiguredStrategy(strategyName);

  if (strategy) {
    var loginOptions = xtend({ connection: strategy.connections[0].name }, self._signinOptions.extraParameters);
    this._auth0.login(loginOptions);
  }
};

Auth0Widget.prototype._signInEnterprise = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = this._getActiveLoginView();
  var form = $('form', container);
  var valid = true;

  var emailD = $('.a0-email', form),
      emailE = $('input[name=email]', form),
      emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(emailE.val().toLowerCase()),
      emailP = /^\s*$/.test(emailE.val()),
      domain, connection, email = null, strategy;

  for (var s in this._client.strategies) {
    strategy = self._client.strategies[s];

    if (strategy.userAndPass) continue;

    for (var c in strategy.connections) {
      if(!emailP && emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
        domain = strategy.connections[c].domain;
        connection = strategy.connections[c].name;
        email = emailE.val();
        break;
      }
    }

    if (domain) break;
  }

  if (emailP) {
    this._showError(this._dict.t('signin:strategyEmailEmpty'));
  }
  else if (!emailM) {
    this._showError(this._dict.t('signin:strategyEmailInvalid'));
  }
  else if (!domain) {
    if (this._auth0Strategies.length > 0) {
      return this._signInWithAuth0(emailE.val());
    }

    if (emailM && emailM.slice(-2)[0] === 'gmail.com') {
      return this._signInSocial('google-oauth2');
    }

    this._showError(
      this._dict.t('signin:strategyDomainInvalid')
          .replace('{domain}', emailM ? emailM.slice(-2)[0] : ''));
  }

  valid &= (!domain && !emailD.addClass('a0-invalid')) || (!!domain && !!emailD.removeClass('a0-invalid'));

  if (valid) {
    var loginOptions = xtend({ connection: connection }, self._signinOptions.extraParameters);
    this._auth0.login(loginOptions);
  }
};

Auth0Widget.prototype._signInWithAuth0 = function (userName, signInPassword) {
  this._toggleSpinner();

  var self = this;
  var container = this._getActiveLoginView();
  var connection  = this._getAuth0Connection();

  var loginOptions = {
    connection: connection.name,
    username: this._isAdLdapConn(connection.name) ? userName.replace('@' + connection.domain, '') : userName,
    password: signInPassword || $('.a0-password input', container).val()
  };

  loginOptions = xtend(loginOptions, self._signinOptions.extraParameters);

  this._auth0.login(loginOptions, function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._dict.t('signin:wrongEmailPasswordErrorText')));
    }

    self._toggleSpinner();
  });
};

Auth0Widget.prototype._signUpWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.a0-popup .a0-panel.a0-onestep .a0-signup');
  var email = $('.a0-email input', container).val();
  var password = $('.a0-password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.signup({
    connection: connection.name,
    username:   email,
    password:   password
  }, function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._dict.t('signup:serverErrorText')));
      self._toggleSpinner(container);
      return;
    }
    return self._signInWithAuth0(email, password);
  });
};

Auth0Widget.prototype._resetPasswordWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.a0-popup .a0-panel.a0-onestep .a0-reset');
  var email = $('.a0-email input', container).val();
  var password = $('.a0-password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.changePassword({
    connection: connection.name,
    username:   email,
    password:   password
  }, function (err) {
    self._toggleSpinner(container);

    $('.a0-password input', container).val('');
    $('.a0-repeatPassword input', container).val('');

    if (err) {
      self._showError(self._parseResponseMessage(err, self._dict.t('reset:serverErrorText')));
      return;
    }

    $('.a0-email input', container).val('');

    try {
      $('.a0-email input', container).first().focus();
    } catch(e) {}

    self._setLoginView();
    self._showSuccess(self._signinOptions['resetSuccessText']);
  });
};

// initialize
Auth0Widget.prototype._initialize = function (cb) {
  var self = this;
  $().addClass('a0-mode-signin');

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
  bean.on($('.a0-popup .a0-panel.a0-onestep a.a0-close')[0], 'click', function () { self._hideSignIn(); });
  bean.on($('.a0-popup .a0-panel.a0-onestep .a0-notloggedin form')[0], 'submit', function (e) { self._signInEnterprise(e); });
  bean.on($('.a0-popup .a0-panel.a0-onestep .a0-signup form')[0], 'submit', function (e) { self._signUpWithAuth0(e); });
  bean.on($('.a0-popup .a0-panel.a0-onestep .a0-reset form')[0], 'submit', function (e) { self._resetPasswordWithAuth0(e); });
  bean.on(qwery('html')[0], 'keyup', function (e) {
    if ($().hasClass('mode-signin')) {
      if ((e.which == 27 || e.keycode == 27) && !self._signinOptions.standalone) {
        self._hideSignIn(); // close popup with ESC key
      }
    }
  });

  if (self._client.subscription && self._client.subscription !== 'free') {
    // hide footer for non free subscriptions
    $('footer').addClass('a0-hide');
  }

  // images from cdn
  $('.a0-popup .a0-panel header a.a0-close').css('background-image', 'url(' + self._signinOptions.cdn + 'img/close.png)');
  $('.a0-action .a0-spinner').css('background-image', 'url(' + self._signinOptions.cdn + 'img/spinner.gif)');

  // labels text
  var options = xtend(this._signinOptions, this._signinOptions.resources);
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;

  this._signinOptions = options;

  // activate panel
  $('div.a0-panel').removeClass('a0-active');
  $('div.a0-overlay').addClass('a0-active');
  $('div.a0-panel.a0-onestep').addClass('a0-active');

  if (self._signinOptions.container) {
    $('div.a0-active').removeClass('a0-overlay');
  }

  $('.a0-popup h1').html(this._signinOptions.title);
  $('.a0-popup .a0-invalid').removeClass('a0-invalid');

  $('div.a0-panel.a0-onestep h1').html(this._signinOptions['title']);

  // show loading
  self._showLoadingExperience();

  if (self._signinOptions.connections) {
    // use only specified connections
    var allowedStrategiesAndConnections = [];

    for (var i in self._client.strategies) {
      var strategy = self._client.strategies[i];

      for (var j in strategy.connections) {
        if (_.contains(self._signinOptions.connections, strategy.connections[j].name)) {
          var alreadyIncluded = _.filter(allowedStrategiesAndConnections, function (s) { return s.name === strategy.name; })[0];

          if (alreadyIncluded) alreadyIncluded.connections.push(strategy.connections[j]);
          else allowedStrategiesAndConnections.push({
            name: strategy.name,
            connections: [strategy.connections[j]]
          });
        }
      }
    }

    self._client.strategies = allowedStrategiesAndConnections;
  }

  // merge strategies info
  for (var s in self._client.strategies) {
    var strategy_name = self._client.strategies[s].name;
    self._client.strategies[s] = xtend(self._client.strategies[s], self._strategies[strategy_name]);
  }

  function finish(err, ssoData){
    self._ssoData = ssoData;
    self._resolveLoginView();
    if (cb && typeof cb === 'function') cb();
  }

  // get SSO data
  if (this._signinOptions.enableReturnUserExperience === false) {
    finish(null, {});
  } else {
    self._auth0.getSSOData(finish);
  }
};

Auth0Widget.prototype._resolveLoginView = function () {
  var self = this;

  // if one connection only (but no userAndPass connection), redirect
  if (this._client.strategies.length === 1 &&
    !this._client.strategies[0].userAndPass &&
    this._client.strategies[0].connections.length === 1) {

    var loginOptions = xtend({
      connection: self._client.strategies[0].connections[0].name
    },
    self._signinOptions.extraParameters);
    self._auth0.login(loginOptions);

    return;
  }

  // load social buttons
  var list = $('.a0-popup .a0-panel.a0-onestep .a0-iconlist');
  for (var s in self._client.strategies) {
    var strategy = self._client.strategies[s];

    if (strategy.userAndPass && strategy.connections.length > 0) {
      self._auth0Strategies.push(strategy);
      $('.a0-create-account, .a0-password').css('display', 'block');

      bean.on($('.a0-notloggedin .a0-email input')[0], 'input', function (e) { self._showOrHidePassword(e); });
    }

    if (strategy.social) {
      var button = bonzo.create(buttonTmpl(strategy));

      list.append(button);
      list.css('display', 'block');

      $('.a0-popup .a0-panel.a0-onestep .a0-separator').css('display', 'block');
    }
  }

  $('.a0-popup .a0-panel.a0-onestep .a0-iconlist span').each(function (button) {
    bean.on(button, 'click', function (e) {
      self._signInSocial(e.target);
    });
  });

  this._signinOptions.socialBigButtons = typeof this._signinOptions['socialBigButtons'] !== 'undefined' ? this._signinOptions['socialBigButtons'] : !this._areThereAnyEnterpriseOrDbConn();
  $('.a0-popup .a0-panel.a0-onestep .a0-iconlist span')
    .toggleClass('a0-icon', !this._signinOptions.socialBigButtons)
    .toggleClass('a0-block', this._signinOptions.socialBigButtons);

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection();
  if (auth0Conn) {
    this._signinOptions.showSignup = auth0Conn.showSignup;
    this._signinOptions.showForgot = auth0Conn.showForgot;
  }

  if (!this._signinOptions.signupLink) {
    bean.on($('.a0-panel .a0-create-account .a0-sign-up')[0], 'click', function (e) { self._showSignUpExperience(e); });
  }

  if (!this._signinOptions.forgotLink) {
    $('.a0-panel .a0-create-account .a0-forgot-pass').each(function (elem) {
      bean.on(elem, 'click', function (e) { self._showResetExperience(e); });
    });
  }

  $('div.a0-panel input').each(function (e) { e.value = ''; });

  $('.a0-panel .a0-signup .a0-email input').each(function (i) {
      bean.on(i, 'input', function() {
        var output = {};
        if (self._isEnterpriseConnection(this.value, output)) {
          var warningText = self._dict.t('signup:enterpriseEmailWarningText').replace(/{domain}/g, output.domain);
          self._setCustomValidity(this, warningText);
        } else {
          self._setCustomValidity(this, '');
        }
      });
  });

  $('.a0-panel .a0-options .a0-cancel').each(function (e) {
    bean.on(e, 'click', function () { self._setLoginView(); });
  });

  $('.a0-panel .a0-reset .a0-repeatPassword input').each(function (i) {
      bean.on(i, 'input', function() {
        if ($('.a0-panel .a0-reset .a0-password input').val() != this.value) {
          self._setCustomValidity(this, self._dict.t('reset:enterSamePasswordText'));
        } else {
          self._setCustomValidity(this, '');
        }
      });
  });


  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = self._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = self._areThereAnySocialConn();

  $('.a0-panel .a0-email input').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.a0-panel .a0-zocial.a0-primary').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.a0-panel .a0-password input').css('display', self._signinOptions.showEmail && self._signinOptions.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.a0-panel .a0-separator').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');

  // if user logged in show logged in experience
  if (self._ssoData.sso) {
    if (self._ssoData.lastUsedUsername &&
        !self._strategies[self._ssoData.lastUsedConnection.strategy].social) {
      $('div.a0-panel.a0-onestep input').val(self._ssoData.lastUsedUsername);
      self._showOrHidePassword();
    }

    if (self._signinOptions['enableReturnUserExperience']) {
      self._showLoggedInExperience();
      return;
    }
  }

  self._setLoginView({ isReturningUser: self._ssoData.sso });
};

Auth0Widget.prototype.parseHash = function (hash, callback) {
  this._auth0.parseHash(hash, callback);
};

Auth0Widget.prototype.show = function (signinOptions, callback) {
  if (typeof signinOptions === 'function') {
    callback = signinOptions;
    signinOptions = {};
  }

  var self = this;
  self._signinOptions = xtend({}, self._options, signinOptions);
  self._signinOptions.extraParameters = {
    state:         self._signinOptions.state || undefined,
    access_token:  self._signinOptions.access_token || undefined,
  };
  if (self._signinOptions.scope) {
    self._signinOptions.extraParameters.scope =
      self._signinOptions.scope;
  }
  self._auth0Strategies = [];

  // widget container
  if (self._signinOptions.container) {
    self._signinOptions.theme = 'static';
    self._signinOptions.standalone = true;
    self._signinOptions.top = true;

    var specifiedContainer = document.getElementById(self._signinOptions.container);
    specifiedContainer.innerHTML = mainTmpl({
      embedded: true,
      i18n:     this._dict,
      options:  self._signinOptions
    });
  } else {
    // remove widget container (if exist)
    $().parent().remove();

    var div = document.createElement('div');
    div.innerHTML = mainTmpl({
      i18n:    this._dict,
      options: self._signinOptions
    });
    document.body.appendChild(div);
  }

  self._initialize(callback);
};

module.exports = Auth0Widget;
