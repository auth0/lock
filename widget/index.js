var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var xtend     = require('xtend');
var _         = require('underscore');

var mainTmpl  = require('./html/main.html');

var $ = function (selector, root) {
  return bonzo(qwery('#auth0-widget ' + (selector || ''), root));
};

function Auth0Widget (options) {
  if (!(this instanceof Auth0Widget)) {
    return new Auth0Widget(options);
  }

  this._options = options;
  this._auth0 = new Auth0({
    clientID:     this._options.clientID, 
    callbackURL:  this._options.callbackURL,
    domain:       this._options.domain
  });
  
  this._strategies = {
    'google-openid': { css: 'google', name: 'Google OpenId', social: true },
    'google-apps': { css: 'google', name: 'Google Apps', social: false },
    'google-oauth2': { css: 'googleplus', name: 'Google', social: true },
    'facebook': { css: 'facebook', name: 'Facebook', social: true },
    'windowslive': { css: 'windows', name: 'Microsoft Account', social: true },
    'linkedin': { css: 'linkedin', name: 'LinkedIn', social: true },
    'github': { css: 'github', name: 'GitHub', social: true },
    'paypal': { css: 'paypal', name: 'PayPal', social: true },
    'twitter': { css: 'twitter', name: 'Twitter', social: true },
    'amazon': { css: 'amazon', name: 'Amazon', social: true },
    'vkontakte': { css: 'vk', name: 'vKontakte', social: true },
    'yandex': { css: 'yandex', name: 'Yandex', social: true },
    'office365': { css: 'office365', name: 'Office365', social: false },
    'waad': { css: 'waad', name: 'Windows Azure AD', social: false },
    'adfs': { css: 'windows', name: 'ADFS', social: false },
    'samlp': { css: 'guest', name: 'SAML', social: false },
    'mscrm': { css: 'guest', name: 'Dynamics CRM', social: false },
    'ad': { css: 'windows', name: 'AD / LDAP', social: false },
    'custom': { css: 'guest', name: 'Custom Auth', social: false },
    'auth0': { css: 'guest', name: 'Auth0', social: false },
    'auth0-adldap': { css: 'guest', name: 'AD/LDAP', social: false },
    'thirtysevensignals': { css: 'thirtysevensignals', name: '37 Signals', social: true },
    'box': { css: 'box', name: 'Box', social: true, imageicon: true },
    'salesforce': { css: 'salesforce', name: 'Salesforce', social: true },
    'fitbit': { css: 'fitbit', name: 'Fitbit', social: true }
  };
}

// helper methods
Auth0Widget.prototype._setTop = function () {
  var element = $('.signin div.panel.onestep');
  
  if (!this._signinOptions.top) {
    setTimeout(function() {
      element.css({ 
        //'marginTop': '-' + (element.offset().height / 2) + 'px',
        //'top': '50%'
        'marginTop': '2px', 
        'top': '15%' 
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
  $('.signin h1').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin .error').html(error).css('display', '');
};

Auth0Widget.prototype._showSuccess = function (message) {
  if (!message) return;
  $('.signin h1').css('display', 'none');
  $('.signin .error').css('display', 'none');
  $('.signin .success').html(message).css('display', '');
};

Auth0Widget.prototype._isAuth0Conn = function (strategy) {
  return strategy === 'auth0' || strategy === 'auth0-adldap';
};

Auth0Widget.prototype._setTitle = function(title) {
  $('.signin .error').css('display', 'none');
  $('.signin .success').css('display', 'none');
  $('.signin h1').html(title).css('display', '');
};

Auth0Widget.prototype._parseResponseMessage = function (responseObj, defaultValue) {
  return this._signinOptions[responseObj.code] || responseObj.message || defaultValue;
};

Auth0Widget.prototype._isAdLdapConn = function (connection) {
  return connection === 'adldap';
};

Auth0Widget.prototype._areThereAnySocialConn = function () {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && this._strategies[this._client.strategies[s].name].social) {
      return true;
    }
  }

  return false;
};

Auth0Widget.prototype._areThereAnyEnterpriseOrDbConn = function() {
  for (var s in this._client.strategies) {
    if (this._strategies[this._client.strategies[s].name] && 
        !this._strategies[this._client.strategies[s].name].social) {
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
    if (this._isAuth0Conn(strategy.name)) continue;

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

Auth0Widget.prototype._isEnterpriseStrategy = function (strategy) { 
  for (var s in this._strategies) {
    if (s === strategy && !this._strategies[s].social) { 
      return true; 
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
  var mailField = $('.notloggedin .email input');
  var pwdField  = $('.notloggedin .password input').first();
  
  var isEnterpriseConnection = this._isEnterpriseConnection(mailField.val());

  if (isEnterpriseConnection) {
    pwdField.attr('disabled', true);
    pwdField.attr('placeholder', '');
    pwdField.removeAttr('required');
  } else {
    pwdField.removeAttr('disabled');
    pwdField.attr('placeholder', this._signinOptions['passwordPlaceholder']);
    pwdField.attr('required', true);
  }
};

Auth0Widget.prototype._hideSignIn = function (cb) {
  $('div.overlay').removeClass('active');

  setTimeout(function () {
    $().removeClass('mode-signin');
    $().css('display', 'none');
    if (cb) cb();
  }, 500);
};

Auth0Widget.prototype._getActiveLoginView = function() {
  var container = this._hasLoggedInBefore ? $('.loggedin') : $('.notloggedin');
  return container;
};

Auth0Widget.prototype._toggleSpinner = function (container) {
  container = container || this._getActiveLoginView();
  var spinner = $('.spinner', container);
  var signin = $('.zocial.primary', container);

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

  $('.loading').css('display', 'none');
  $('.loggedin').css('display', 'none');
  $('.notloggedin').css('display', 'none');
  $('.signup').css('display', 'none');
  $('.reset').css('display', 'none');
  $('.signin input[type=password]').val('');

  if (!options.mode) {
    this._hasLoggedInBefore = !!options.isReturningUser;
    this._setTitle(this._signinOptions['title']);

    $(options.isReturningUser ? '.loggedin' : '.notloggedin').css('display', '');
    self._setTop();

    try { 
      $('input', container).each(function (elem) {
        elem.focus(); // workaround to enable password placeholders with placeholders.js
      });

      if (options.isReturningUser) $('.loggedin .password input').first().focus();
      else $('.notloggedin .email input').first().focus();
    } catch(e) {
      console.log(e);
    }
    
    return;
  }

  var container;

  switch (options.mode) {
    case 'loading':
      this._setTitle(this._signinOptions['loadingTitle']);
      container = $('.loading').first();
      break;
    case 'signup':
      this._setTitle(this._signinOptions['signupTitle']);
      container = $('.signup').first();
      break;
    case 'reset':
      this._setTitle(this._signinOptions['resetTitle']);
      container = $('.reset').first();
      break;
  }

  if (container) {
    this._setTop();
    container.css('display', '');

    try { 
      var email = $('.notloggedin .email input').val();

      $('input', container).each(function (elem) {
        elem.focus(); // workaround to enable password placeholders with placeholders.js
      });

      $('.email input', container).val(email);
      $('.email input', container).first().focus();
    } catch(e) {
      console.log(e);
    }
  }
};

Auth0Widget.prototype._showLoggedInExperience = function() {
  var self = this;
  var strategy = this._ssoData.lastUsedConnection.strategy;
  this._setLoginView({ isReturningUser: !!strategy });

  if (!strategy) return;

  var loginView = this._getActiveLoginView();
  bean.on($('form', loginView)[0], 'submit', function (e) { self._signInEnterprise(e); });
  
  var button;
  if (strategy !== 'auth0') {
    button = bonzo(bonzo.create('<span></span>'))
      .attr('tabindex', 0)
      .attr('data-strategy', strategy)
      .attr('title', this._strategies[strategy].name)
      .addClass('zocial').addClass('block')
      .addClass(this._strategies[strategy].css)
      .addClass(this._strategies[strategy].imageicon ? 'image-icon' : '')
      .html(this._strategies[strategy].name);
    
    bean.on(button[0], 'click', function (e) { self._signInSocial(e.target); });

    $('.strategy span', loginView).each(function (el) { if (el) el.remove(); });
    $('.strategy', loginView).append(button);
  }

  $('.all', loginView).html(this._signinOptions['allButtonTemplate']);

  bean.on($('.all', loginView)[0], 'click', function () {
    self._setLoginView();
  });

  if (this._ssoData.lastUsedUsername) {
    if (strategy === 'auth0') {
      $('.email-readonly', loginView).html(this._ssoData.lastUsedUsername); 
      $('.email input', loginView).css('display', 'none');
      $('.emailPassword', loginView).css('display', '');
    } 
    else if (this._isEnterpriseStrategy(strategy)) {
      button.html(this._ssoData.lastUsedUsername || this._strategies[strategy].name)
            .attr('title', this._ssoData.lastUsedUsername || this._strategies[strategy].name);
    }
  }
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

  var emailD = $('.email', form),
      emailE = $('input[name=email]', form),
      emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(emailE.val().toLowerCase()),
      emailP = /^\s*$/.test(emailE.val()),
      domain, connection, email = null, strategy;

  for (var s in this._client.strategies) {
    strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name)) continue;

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
    this._showError(this._signinOptions['strategyEmailEmpty']);
  } 
  else if (!emailM) {
    this._showError(this._signinOptions['strategyEmailInvalid']);
  } 
  else if (!domain) {
    if (this._auth0Strategies.length > 0) {
      return this._signInWithAuth0(emailE.val());
    }

    if (emailM && emailM.slice(-2)[0] === 'gmail.com') {
      return this._signInSocial('google-oauth2');
    }

    this._showError(
      this._signinOptions['strategyDomainInvalid']
          .replace('{domain}', emailM ? emailM.slice(-2)[0] : ''));
  }

  valid &= (!domain && !emailD.addClass('invalid')) || (!!domain && !!emailD.removeClass('invalid'));

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
    password: signInPassword || $('.password input', container).val()
  };

  loginOptions = xtend(loginOptions, self._signinOptions.extraParameters);

  this._auth0.login(loginOptions, function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['wrongEmailPasswordErrorText']));
    }

    self._toggleSpinner();
  });
};

Auth0Widget.prototype._signUpWithAuth0 = function (e) {
  e.preventDefault();
  e.stopPropagation();

  var self = this;
  var container = $('.popup .panel.onestep .signup');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.signup({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['signupServerErrorText']));
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
  var container = $('.popup .panel.onestep .reset');
  var email = $('.email input', container).val();
  var password = $('.password input', container).val();
  var connection  = this._getAuth0Connection();

  this._toggleSpinner(container);

  this._auth0.changePassword({
    connection: connection.name,
    username:   email,
    password:   password
  }, 
  function (err) {
    self._toggleSpinner(container);

    $('.password input', container).val('');
    $('.repeatPassword input', container).val('');

    if (err) {
      self._showError(self._parseResponseMessage(err, self._signinOptions['resetServerErrorText']));
      return;
    }

    $('.email input', container).val('');

    try { 
      $('.email input', container).first().focus(); 
    } catch(e) {}  

    self._setLoginView();
    self._showSuccess(self._signinOptions['resetSuccessText']);
  });
};

// initialize
Auth0Widget.prototype._initialize = function (cb) {
  // TODO: support css option for non free subscriptions

  var self = this;
  $().addClass('mode-signin');

  // buttons actions
  bean.on($('.popup .panel.onestep a.close')[0], 'click', function () { self._hideSignIn(); });
  bean.on($('.popup .panel.onestep .notloggedin form')[0], 'submit', function (e) { self._signInEnterprise(e); });
  bean.on($('.popup .panel.onestep .signup form')[0], 'submit', function (e) { self._signUpWithAuth0(e); });
  bean.on($('.popup .panel.onestep .reset form')[0], 'submit', function (e) { self._resetPasswordWithAuth0(e); });
  bean.on(qwery('html')[0], 'keyup', function (e) {
    if ($().hasClass('mode-signin')) {
      if ((e.which == 27 || e.keycode == 27) && !self._signinOptions.standalone) {
        self._hideSignIn(); // close popup with ESC key
      }
    }
  });

  // assets
  $('.popup .panel header a.close').css('background-image', 'url(' + self._signinOptions.assetsUrl + 'img/close.png)');
  $('.action .spinner').css('background-image', 'url(' + self._signinOptions.assetsUrl + 'img/spinner.gif)');

  // labels text
  var options = xtend(this._signinOptions, this._signinOptions.resources);
  options['title'] = options['title'] || "Sign In";
  options['loadingTitle'] = options['loadingTitle'] || "Please wait...";
  options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
  options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
  options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";
  options['strategyDomainInvalid'] = options['strategyDomainInvalid'] || "The domain {domain} has not been setup.";

  options['icon'] = options['icon'] || self._signinOptions.assetsUrl + "img/logo-32.png";
  options['showIcon'] = typeof options['showIcon'] !== 'undefined' ? options['showIcon'] : true;
  options['showSignup'] = typeof options['showSignup'] !== 'undefined' ? options['showSignup'] : true;
  options['showForgot'] = typeof options['showForgot'] !== 'undefined' ? options['showForgot'] : true;
  options['signupText'] = options['signupText'] || 'Sign Up';
  options['forgotText'] = options['forgotText'] || 'Forgot your password?';
  options['signInButtonText'] = options['signInButtonText'] || 'Sign In';
  options['emailPlaceholder'] = options['emailPlaceholder'] || 'Email';
  options['passwordPlaceholder'] = options['passwordPlaceholder'] || 'Password';
  options['separatorText'] = options['separatorText'] || 'or';
  options['serverErrorText'] = options['serverErrorText'] || 'There was an error processing the sign in.';
  options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
  options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
  options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
  options['returnUserLabel'] = options['returnUserLabel'] || 'Last time you signed in using...';
  options['wrongEmailPasswordErrorText'] = options['wrongEmailPasswordErrorText'] || 'Wrong email or password.';

  // signup
  options['signupTitle'] = options['signupTitle'] || 'Sign Up';
  options['signupButtonText'] = options['signupButtonText'] || 'Sign Up';
  options['signupEmailPlaceholder'] = options['signupEmailPlaceholder'] || 'Email';
  options['signupPasswordPlaceholder'] = options['signupPasswordPlaceholder'] || 'Create a Password';
  options['signupCancelButtonText'] = options['signupCancelButtonText'] || 'Cancel';
  options['signupHeaderText'] = typeof options['signupHeaderText'] !== 'undefined' ? options['signupHeaderText'] : 'Please enter your email and password';
  options['signupFooterText'] = typeof options['signupFooterText'] !== 'undefined' ? options['signupFooterText'] : 'By clicking "Sign Up", you agree to our terms of service and privacy policy.';
  options['signupEnterpriseEmailWarningText'] = options['signupEnterpriseEmailWarningText'] || 'This domain {domain} has been configured for Single Sign On and you can\'t create an account. Try signing in instead.';
  options['signupServerErrorText'] = options['signupServerErrorText'] || 'There was an error processing the sign up.';

  // reset
  options['resetTitle'] = options['resetTitle'] || 'Reset Password';
  options['resetButtonText'] = options['resetButtonText'] || 'Send';
  options['resetEmailPlaceholder'] = options['resetEmailPlaceholder'] || 'Email';
  options['resetPasswordPlaceholder'] = options['resetPasswordPlaceholder'] || 'New Password';
  options['resetRepeatPasswordPlaceholder'] = options['resetRepeatPasswordPlaceholder'] || 'Confirm New Password';
  options['resetCancelButtonText'] = options['resetCancelButtonText'] || 'Cancel';
  options['resetSuccessText'] = options['resetSuccessText'] || 'We\'ve just sent you an email to reset your password.';
  options['resetEnterSamePasswordText'] = options['resetEnterSamePasswordText'] || 'Please enter the same password.';
  options['resetHeaderText'] = typeof options['resetHeaderText'] !== 'undefined' ? options['resetHeaderText'] : 'Please enter your email and the new password. We will send you an email to confirm the password change.';
  options['resetServerErrorText'] = options['resetServerErrorText'] || 'There was an error processing the reset password.';

  this._signinOptions = options;

  // theme
  if (this._signinOptions.theme) {
    $('.signin').addClass('theme-' + this._signinOptions.theme);
  }

  $('.panel a.close').css('display', this._signinOptions.standalone ? 'none' : 'block');

  // show icon
  if (this._signinOptions.showIcon) {
    $('.panel .image img').attr('src', this._signinOptions.icon);
    $('.panel .image').css('display', this._signinOptions.showIcon ? 'block' : 'none');
  }

  // activate panel
  $('div.panel').removeClass('active');
  $('div.overlay').addClass('active');
  $('div.panel.onestep').addClass('active');

  if (self._signinOptions.container) {
    $('div.active').removeClass('overlay');
  }

  $('.popup h1').html(this._signinOptions.title);
  $('.popup .invalid').removeClass('invalid');

  $('div.panel.onestep h1').html(this._signinOptions['title']);

  // show loading
  self._showLoadingExperience();
 
  // get configured strategies/connections
  self._auth0.getConnections(function (err, connections) {
    var allowedConnections = [];

    // use only specified connections
    if (self._signinOptions.connections) {
      for (var i in connections) {
        if (_.contains(self._signinOptions.connections, connections[i].name)) {
          allowedConnections.push(connections[i]);
        }
      }
    }
    else {
      allowedConnections = connections;
    }

    self._client = {
      strategies: self._getConfiguredStrategies(allowedConnections)
    };

    // get SSO data
    self._auth0.getSSOData(function (err, ssoData) {
      self._ssoData = ssoData;
      self._resolveLoginView();

      if (cb && typeof cb === 'function') cb();
    });
  });
};

Auth0Widget.prototype._resolveLoginView = function () {
  var self = this;

  // if no social connections and one enterprise connection only, redirect
  if (!this._areThereAnySocialConn() && 
    this._client.strategies.length === 1 &&
    this._client.strategies[0].name !== 'auth0' &&
    this._client.strategies[0].connections.length === 1) {
    
    var loginOptions = xtend({
      connection: self._client.strategies[0].connections[0].name
    }, 
    self._signinOptions.extraParameters);
    self._auth0.login(loginOptions);

    return;
  }

  // load social buttons
  var list = $('.popup .panel.onestep .iconlist');
  for (var s in this._client.strategies) {
    var strategy = this._client.strategies[s];

    if (this._isAuth0Conn(strategy.name) && strategy.connections.length > 0) {
      this._auth0Strategies.push(strategy);
      $('.create-account, .password').css('display', 'block');

      bean.on($('.notloggedin .email input')[0], 'input', function (e) { self._showOrHidePassword(e); });
    }

    if (this._strategies[strategy.name] && this._strategies[strategy.name].social) {
      var button = bonzo(bonzo.create('<span></span>'))
        .attr('tabindex', 0)
        .attr('data-strategy', strategy.name)
        .attr('title', this._strategies[strategy.name].name)
        .addClass('zocial').addClass('icon')
        .addClass(this._strategies[strategy.name].css)
        .addClass(this._strategies[strategy.name].imageicon ? 'image-icon' : '')
        .html(this._strategies[strategy.name].name);

      list.append(button);
      list.css('display', 'block');

      $('.popup .panel.onestep .separator').css('display', 'block');
    }
  }

  $('.popup .panel.onestep .iconlist span').each(function (button) {
    bean.on(button, 'click', function (e) {
      self._signInSocial(e.target);
    });
  });

  this._signinOptions.socialBigButtons = typeof this._signinOptions['socialBigButtons'] !== 'undefined' ? this._signinOptions['socialBigButtons'] : !this._areThereAnyEnterpriseOrDbConn();
  if (this._signinOptions.socialBigButtons) {
    $('.popup .panel.onestep .iconlist span').removeClass('icon').addClass('block');
  } else {
    $('.popup .panel.onestep .iconlist span').addClass('icon').removeClass('block');
  }

  // show signup/forgot links
  var auth0Conn = this._getAuth0Connection();
  if (auth0Conn) {
    this._signinOptions.showSignup = auth0Conn.showSignup;
    this._signinOptions.showForgot = auth0Conn.showForgot;
  }
  
  $('.panel .create-account .sign-up')
    .css('display', this._signinOptions.showSignup ? '' : 'none')
    .html(this._signinOptions.signupText);

  $('.panel .create-account .forgot-pass')
    .css('display', this._signinOptions.showForgot ? '' : 'none')
    .html(this._signinOptions.forgotText);

  if (this._signinOptions.signupLink) {
    $('.panel .create-account .sign-up')
      .attr('href', this._signinOptions.signupLink)
      .attr('target', '_parent');
  } 
  else {
    bean.on($('.panel .create-account .sign-up')[0], 'click', function (e) { self._showSignUpExperience(e); });
  }

  if (this._signinOptions.forgotLink) {
    $('.panel .create-account .forgot-pass')
      .attr('href', this._signinOptions.forgotLink)
      .attr('target', '_parent');
  } 
  else {
    $('.panel .create-account .forgot-pass').each(function (elem) {
      bean.on(elem, 'click', function (e) { self._showResetExperience(e); });
    });
  }

  // hide divider dot if there are one of two
  $('.panel .create-account .divider')
    .css('display', self._signinOptions.showEmail && self._signinOptions.showSignup && self._signinOptions.showForgot ? '' : 'none');

  $('div.panel input').each(function (e) { e.value = ''; });

  // placeholders and buttons
  $('.panel .zocial.primary').html(self._signinOptions.signInButtonText);
  $('.panel .email input').attr('placeholder', self._signinOptions.emailPlaceholder);
  $('.panel .password input').attr('placeholder', self._signinOptions.passwordPlaceholder);
  $('.panel .separator span').html(self._signinOptions.separatorText);

  // signup
  $('.panel .signup .zocial.primary').html(self._signinOptions.signupButtonText);

  $('.panel .signup .email input').each(function (i) { 
      i.setAttribute('placeholder', self._signinOptions.signupEmailPlaceholder);
      bean.on(i, 'input', function() {
        var output = {};
        if (self._isEnterpriseConnection(this.value, output)) {
          var warningText = self._signinOptions.signupEnterpriseEmailWarningText.replace(/{domain}/g, output.domain);
          self._setCustomValidity(this, warningText);
        } else {
          self._setCustomValidity(this, '');
        }
      });
  });

  $('.panel .signup .password input').attr('placeholder', self._signinOptions.signupPasswordPlaceholder);

  $('.panel .signup .options .cancel').html(self._signinOptions['signupCancelButtonText']);
  bean.on($('.panel .signup .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .signup .header')
    .html(self._signinOptions.signupHeaderText)
    .attr('display', self._signinOptions.signupHeaderText ? '' : 'none');

  $('.panel .signup .footer')
    .html(self._signinOptions.signupFooterText)
    .attr('display', self._signinOptions.signupFooterText ? '' : 'none');

  // reset
  $('.panel .reset .zocial.primary').html(self._signinOptions.resetButtonText);
  $('.panel .reset .email input').attr('placeholder', self._signinOptions.resetEmailPlaceholder);
  $('.panel .reset .password input').attr('placeholder', self._signinOptions.resetPasswordPlaceholder);

  $('.panel .reset .repeatPassword input').each(function (i) { 
      i.setAttribute('placeholder', self._signinOptions.resetRepeatPasswordPlaceholder);
      bean.on(i, 'input', function() {
        if ($('.panel .reset .password input').val() != this.value) {
          self._setCustomValidity(this, self._signinOptions.resetEnterSamePasswordText);
        } else {
          self._setCustomValidity(this, '');
        }
      });
  });

  $('.panel .reset .options .cancel').html(self._signinOptions.resetCancelButtonText);
  bean.on($('.panel .reset .options .cancel')[0], 'click', function () { self._setLoginView(); });

  $('.panel .reset .header')
    .html(self._signinOptions.resetHeaderText)
    .attr('display', self._signinOptions.resetHeaderText ? '' : 'none');

  // show email, password, separator and button if there are enterprise/db connections
  var anyEnterpriseOrDbConnection = self._areThereAnyEnterpriseOrDbConn();
  var anySocialConnection = self._areThereAnySocialConn();

  $('.panel .email input').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .zocial.primary').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .password input').css('display', self._signinOptions.showEmail && self._signinOptions.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .forgot-pass').css('display', self._signinOptions.showEmail && self._signinOptions.showForgot && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .create-account .sign-up').css('display', self._signinOptions.showEmail && this._signinOptions.showSignup && anyEnterpriseOrDbConnection ? '' : 'none');
  $('.panel .separator').css('display', self._signinOptions.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');
  $('.panel .last-time').html(self._signinOptions.returnUserLabel);

  // if user logged in show logged in experience
  if (self._ssoData.sso) {
    if (self._ssoData.lastUsedUsername &&
        self._isEnterpriseStrategy(self._ssoData.lastUsedConnection.strategy)) {
      $('div.panel.onestep input').val(self._ssoData.lastUsedUsername);
      self._showOrHidePassword();
    }

    if (self._signinOptions['enableReturnUserExperience']) { 
      self._showLoggedInExperience();
      return;
    }
  }

  self._setLoginView({ isReturningUser: self._ssoData.sso });
};

Auth0Widget.prototype._getConfiguredStrategies = function (conns) {
  var strategies = [];
  for (var conn in conns) {
    if (typeof(conns[conn].status) !== 'undefined' && !conns[conn].status) continue;

    var strategy = _.filter(strategies, function (s) { 
      return s.name === conns[conn].strategy; 
    })[0];

    if (!strategy) {
      strategy = {
        name: conns[conn].strategy,
        connections: []
      };

      strategies.push(strategy);
    }

    var connData = {
      name: conns[conn].name,
      domain: conns[conn].domain,
      showSignup: conns[conn].showSignup,
      showForgot: conns[conn].showForgot
    };

    strategy.connections.push(connData);
  }

  return strategies;
};

Auth0Widget.prototype.getClient = function () {
  return this._auth0;
};

Auth0Widget.prototype.show = function (signinOptions, callback) {
  if (typeof signinOptions === 'function') {
    callback = signinOptions;
    signinOptions = {};
  }

  var self = this;
  self._signinOptions = xtend(self._options, signinOptions);
  self._signinOptions.assetsUrl = self._signinOptions.assetsUrl || 'https://d19p4zemcycm7a.cloudfront.net/w2/'; 
  self._auth0Strategies = [];

  // widget container
  if (self._signinOptions.container) {
    self._signinOptions.theme = 'static';
    self._signinOptions.standalone = true;
    self._signinOptions.top = true;

    var specifiedContainer = document.getElementById(self._signinOptions.container);
    specifiedContainer.innerHTML = mainTmpl();
  }
  else {
    // remove widget container (if exist)
    $().parent().remove();

    var div = document.createElement('div');
    div.innerHTML = mainTmpl();
    document.body.appendChild(div);
  }
  
  self._initialize(callback);
};

module.exports = Auth0Widget;
