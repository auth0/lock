;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var domready  = require('domready');
var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var bean      = require('bean');
var fs        = require('fs');
var insertCss = require('insert-css');

var loginTmpl = require('./widget/html/login.html');

domready(function () {
  var _options = {
    domain:      'mdocs.auth0.com',
    clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 
    callbackURL: 'http://localhost:3000/'
  };

  var auth0 = Auth0({
    clientID:     _options.clientID, 
    callbackURL:  _options.callbackURL,
    domain:       _options.domain
  });

  var _strategies = {
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

  var _auth0Strategy, _auth0ConnectionParams, _hasLoggedInBefore, _ssoData;
  var _client = {
    strategies: [
      {
        name: 'google-oauth2',
        social: true,
        connections: [
          { domain: '', name: 'google-oauth2' }
        ]
      },
      {
        name: 'github',
        social: true,
        connections: [
          { domain: '', name: 'github' }
        ]
      },
      {
        name: 'auth0',
        connections: [
          { domain: '', name: 'Username-Password-Authentication' }
        ]
      }
    ]
  };

  // helper methods
  var $ = function (selector, root) {
    return bonzo(qwery(selector, root));
  };

  var _redirect = function (url) {
    global.window.location = url;
  };

  var _setTop = function (onTop, element) {
    if (!onTop) {
      setTimeout(function() {
        element.css({
          'marginTop': '-' + (element.offset().height / 2) + 'px',
          'top': '50%'
        });
      }, 1);
    } else {
      element.css({
        'marginTop': '2px',
        'top': '0'
      });
    }
  };

  var _showError = function (error) {
    $('.signin h1').css('display', 'none');
    $('.signin .success').css('display', 'none');
    $('.signin .error').html(error).css('display', '');
  };

  var _showSuccess = function (message) {
    $('.signin h1').css('display', 'none');
    $('.signin .error').css('display', 'none');
    $('.signin .success').html(message).css('display', '');
  };

  var _isAuth0Conn = function (strategy) {
    return strategy === 'auth0' || strategy === 'auth0-adldap';
  };

  var _setTitle = function(title) {
    $('.signin .error').css('display', 'none');
    $('.signin .success').css('display', 'none');
    $('.signin h1').html(title).css('display', '');
  };

  var _isAdLdapConn = function (connection) {
    return connection === 'adldap';
  };

  var _areThereAnySocialConn = function () {
    for (var s in _client.strategies) {
      if (_strategies[_client.strategies[s].name] && _strategies[_client.strategies[s].name].social) {
        return true;
      }
    }

    return false;
  };

  var _areThereAnyEnterpriseOrDbConn = function() {
    for (var s in _client.strategies) {
      if (_strategies[_client.strategies[s].name] && 
          !_strategies[_client.strategies[s].name].social) {
        return true;
      }
    }

    return false;
  };

  var _isEnterpriseConnection = function (email, output) {
    var emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                      .exec(email.toLowerCase());

    for(var s in _client.strategies) {
      var strategy = _client.strategies[s];
      if (_isAuth0Conn(strategy.name)) continue;

      for(var c in strategy.connections) {
        if (emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
          output.domain = strategy.connections[c].domain;
          return true;
        }
      }
    }

    return false;
  };

  var _isEnterpriseStrategy = function (strategy) { 
    for (var s in _strategies) {
      if (s === strategy && !_strategies[s].social) { 
        return true; 
      } 
    } 

    return false; 
  };

  var _getConfiguredStrategy = function (name) {
    for (var s in _client.strategies) {
      if (_client.strategies[s] && _client.strategies[s].name === name) {
        return _client.strategies[s];
      }
    }
  };

  var _getAuth0Connection = function() {
    // if specified, use it, otherwise return first
    if (_options['userPwdConnectionName']) {
      for (var i in _auth0Strategy.connections) {
        if (_auth0Strategy.connections[i].name === _options['userPwdConnectionName']) {
          return _auth0Strategy.connections[i];
        }
      }
    }

    return _auth0Strategy ? _auth0Strategy.connections[0] : null;
  };

  var _showOrHidePassword = function () {
    var mailField = $('.notloggedin .email input').first();
    var pwdField  = $('.notloggedin .password input');
    pwdField.removeAttr('required');

    var isEnterpriseConnection = _isEnterpriseConnection(mailField.val());

    if (isEnterpriseConnection) {
      pwdField.attr('disabled', '');
      pwdField.attr('placeholder', '');
    } else {
      pwdField.removeAttr('disabled');
      pwdField.attr('required', true);
    }
  };

  var _hideSignIn = function (cb) {
    $('div.overlay').removeClass('active');
    setTimeout(function () {
      $('html').removeClass('mode-signin');
      if (cb) cb();
    }, 500);
  };

  var _getActiveLoginView = function() {
    var container = _hasLoggedInBefore ? $('.loggedin') : $('.notloggedin');
    return container;
  };

  var _toggleSpinner = function (container) {
    container = container || _getActiveLoginView();
    var spinner = $('.spinner', container);
    var signin = $('.zocial.primary', container);

    spinner.css('display', spinner.css('display') === 'none' ? '' : 'none');
    signin.css('display', signin.css('display') === 'none' ? '' : 'none');
  };

  var _setLoginView = function(options) {
    _hasLoggedInBefore = options.isReturningUser;
    _setTitle(_options['title']);

    $('.loggedin').css('display', 'none');
    $('.notloggedin').css('display', 'none');
    $('.signup').css('display', 'none');
    $('.reset').css('display', 'none');

    $('.loggedin').css('display', options.isReturningUser ? '' : 'none');
    $('.notloggedin').css('display', options.isReturningUser ? 'none' : '');

    _setTop(_options.top, $('.signin div.panel.onestep'));
    $('.notloggedin .email input').first().focus();
  };

  var _showLoggedInExperience = function(e) {
    var strategy = _ssoData.lastUsedConnection.strategy;
    _setLoginView({ isReturningUser: !!strategy });

    if (!strategy) return;

    var loginView = _getActiveLoginView();
    bean.on($('form', loginView)[0], 'submit', _signInEnterprise);
    
    var button;
    if (strategy !== 'auth0') {
      button = bonzo(bonzo.create('<span></span>'))
        .attr('tabindex', 0)
        .attr('data-strategy', strategy)
        .attr('title', _strategies[strategy].name)
        .addClass('zocial').addClass('block')
        .addClass(_strategies[strategy].css)
        .addClass(_strategies[strategy].imageicon ? 'image-icon' : '')
        .html(_strategies[strategy].name);
      
      bean.on(button, 'click', function (e) { _showSignInOptions(e.target); });

      $('.strategy span', loginView).each(function (el) { if (el) el.remove(); });
      $('.strategy', loginView).append(button);
    }

    $('.all', loginView).html(_options['allButtonTemplate']);

    bean.on($('.all', loginView), 'click', function () {
      _setLoginView({ isReturningUser: false });
    });

    if (_ssoData.lastUsedUsername) {
      if (strategy === 'auth0') {
        $('.email-readonly', loginView).html(_ssoData.lastUsedUsername); 
        $('.email input', loginView).css('display', 'none');
        $('.emailPassword', loginView).css('display', '');
      } 
      else if (_isEnterpriseStrategy(strategy)) {
        button.html(_ssoData.lastUsedUsername || _strategies[strategy].name)
              .attr('title', _ssoData.lastUsedUsername || _strategies[strategy].name);
      }
    }
  };

  // sign in methods
  var _signInSocial = function (target) {
    var strategyName = typeof target === 'string' ? target : target.getAttribute('data-strategy');
    var strategy = _getConfiguredStrategy(strategyName);

    if (strategy) {
      auth0.login({
        connection: strategy.connections[0].name
      });
    }
  };

  var _signInEnterprise = function (e) {
    e.preventDefault();
    e.stopPropagation();

    var container = _getActiveLoginView();
    var form = $('form', container);
    var valid = true;

    var emailD = $('.email', form),
        emailE = $('input[name=email]', form),
        emailM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(emailE.val().toLowerCase()),
        emailP = /^\s*$/.test(emailE.val()),
        domain, url, email = null, strategy;

    for (var s in _client.strategies) {
      strategy = _client.strategies[s];

      if (_isAuth0Conn(strategy.name)) continue;

      for (var c in strategy.connections) {
        if(!emailP && emailM && emailM.slice(-2)[0] == strategy.connections[c].domain) {
          domain = strategy.connections[c].domain;
          url = strategy.connections[c].url;
          email = emailE.val();
          break;
        }
      }

      if (domain) break;
    }

    if (emailP) {
      // _showError(global.tlite.find(self._signInOptions['strategyEmailEmpty']));
    } 
    else if (!emailM) {
      // _showError(global.tlite.find(self._signInOptions['strategyEmailInvalid']));
    } 
    else if (!domain) {
      if (_auth0Strategy) {
        return _signInWithAuth0(emailE.val());
      }

      if (emailM && emailM.slice(-2)[0] === 'gmail.com') {
        return _signInSocial('google-oauth2');
      }

      // _showError(global.tlite.find(self._signInOptions['strategyDomainInvalid'], { domain: emailM && emailM.slice(-2)[0] }));
    }

    valid &= (!domain && !emailD.addClass('invalid')) || (!!domain && !!emailD.removeClass('invalid'));

    if (valid) {
      _redirect(url);
    }
  };

  var _signInWithAuth0 = function (userName, signInPassword) {
    _toggleSpinner();

    var container = _getActiveLoginView();
    var connection  = _getAuth0Connection();
    
    var loginOptions = {
      connection: connection.name,
      username: _isAdLdapConn(connection.name) ? userName.replace('@' + connection.domain, '') : userName,
      password: signInPassword || $('.password input', container).val()
    };

    for (var k in _auth0ConnectionParams) {
      loginOptions[k] = _auth0ConnectionParams[k];
    }

    auth0.login(loginOptions, function (err) {
      if (err) alert(err);
      _toggleSpinner();
    });
  };

  // initialize
  var initialize = function () {
    // TODO: support css option for non free subscriptions

    bean.on($('.popup .panel.onestep a.close')[0], 'click', _hideSignIn);
    bean.on($('.popup .panel.onestep .notloggedin form')[0], 'submit', _signInEnterprise);
    bean.on($('html')[0], 'keyup', function (e) {
      if ($('html').hasClass('mode-signin')) {
        if ((e.which == 27 || e.keycode == 27) && !_options.standalone) {
          _hideSignIn(); // close popup with ESC key
        }
      }
    });

    // load social buttons
    var list = $('.popup .panel.onestep .iconlist');
    for (var s in _client.strategies) {
      var strategy = _client.strategies[s];

      if (_isAuth0Conn(strategy.name) && strategy.connections.length > 0) {
        _auth0Strategy = strategy;
        $('.create-account, .password').css('display', 'block');
      }

      if (_strategies[strategy.name] && _strategies[strategy.name].social) {
        var button = bonzo(bonzo.create('<span></span>'))
          .attr('tabindex', 0)
          .attr('data-strategy', strategy.name)
          .attr('title', _strategies[strategy.name].name)
          .addClass('zocial').addClass('icon')
          .addClass(_strategies[strategy.name].css)
          .addClass(_strategies[strategy.name].imageicon ? 'image-icon' : '');
          //.html(global.tlite.find("{name}", { name: _strategies[strategy.name].name}));

        list.append(button);
        list.css('display', 'block');

        $('.popup .panel.onestep .separator').css('display', 'block');
      }
    }

    $('.popup .panel.onestep .iconlist span').each(function (button) {
      bean.on(button, 'click', function (e) {
        _signInSocial(e.target);
      });
    });

    showSignIn();
  };

  var showSignIn = function () {
    $('html').addClass('mode-signin');

    // if no social connections and one enterprise connection only, redirect
    if (!_areThereAnySocialConn() && 
      _client.strategies.length === 1 &&
      _client.strategies[0].name !== 'auth0' &&
      _client.strategies[0].connections.length === 1) {
      
      _redirect(_client.strategies[0].connections[0].url);
    }

    // labels text
    var options = _options || {};
    options['onestep'] = typeof options['onestep'] !== 'undefined' ? options['onestep'] : false;
    options['top'] = options['top'] || false;
    options['title'] = options['title'] || 'Sign In';
    options['strategyButtonTemplate'] = options['strategyButtonTemplate'] || "{name}";
    options['allButtonTemplate'] = options['allButtonTemplate'] || "Show all";
    options['strategyBack'] = options['strategyBack'] || "Back";
    options['strategyEmailLabel'] = options['strategyEmailLabel'] || "Email:";
    options['strategyEmailEmpty'] = options['strategyEmailEmpty'] || "The email is empty.";
    options['strategyEmailInvalid'] = options['strategyEmailInvalid'] || "The email is invalid.";

    options['icon'] = options['icon'] || "img/logo-32.png";
    options['showIcon'] = typeof options['showIcon'] !== 'undefined' ? options['showIcon'] : false;
    options['showSignup'] = typeof options['showSignup'] !== 'undefined' ? options['showSignup'] : true;
    options['showForgot'] = typeof options['showForgot'] !== 'undefined' ? options['showForgot'] : true;
    options['signupText'] = options['signupText'] || 'Sign Up';
    options['forgotText'] = options['forgotText'] || 'Forgot your password?';
    options['useAppSignInCallback'] = typeof options['useAppSignInCallback'] !== 'undefined' ? options['useAppSignInCallback'] : false;
    options['signInButtonText'] = options['signInButtonText'] || 'Sign In';
    options['emailPlaceholder'] = options['emailPlaceholder'] || 'Email';
    options['passwordPlaceholder'] = options['passwordPlaceholder'] || 'Password';
    options['separatorText'] = options['separatorText'] || 'or';
    options['serverErrorText'] = options['serverErrorText'] || 'There was an error processing the sign in.';
    options['showEmail'] = typeof options['showEmail'] !== 'undefined' ? options['showEmail'] : true;
    options['showPassword'] = typeof options['showPassword'] !== 'undefined' ? options['showPassword'] : true;
    options['socialBigButtons'] = typeof options['socialBigButtons'] !== 'undefined' ? options['socialBigButtons'] : !_areThereAnyEnterpriseOrDbConn();
    options['enableReturnUserExperience'] = typeof options['enableReturnUserExperience'] !== 'undefined' ? options['enableReturnUserExperience'] : true;
    options['returnUserLabel'] = options['returnUserLabel'] || 'Last time you signed in using...';
    options['wrongEmailPasswordErrorText'] = options['wrongEmailPasswordErrorText'] || 'Wrong email or password.';

    // theme
    if (options.theme) {
      $('html').addClass('theme-' + options.theme);
    }

    $('.panel a.close').css('display', options.standalone ? 'none' : 'block');

    // show icon
    if (options.showIcon) {
      $('.panel .image img').attr('src', options.icon);
      $('.panel .image').css('display', options.showIcon ? 'block' : 'none');
    }

    // hide divider dot if there are one of two
    $('.panel .create-account .divider')
      .css('display', options.showEmail && options.showSignup && options.showForgot ? '' : 'none');

    $('div.panel input').each(function (e) { e.value = ''; });

    // placeholders and buttons
    $('.panel .zocial.primary').html(options.signInButtonText);
    $('.panel .email input').attr('placeholder', options.emailPlaceholder);
    $('.panel .password input').attr('placeholder', options.passwordPlaceholder);
    $('.panel .separator span').html(options.separatorText);

    // show email, password, separator and button if there are enterprise/db connections
    var anyEnterpriseOrDbConnection = _areThereAnyEnterpriseOrDbConn();
    var anySocialConnection = _areThereAnySocialConn();

    $('.panel .email input').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
    $('.panel .zocial.primary').css('display', options.showEmail && anyEnterpriseOrDbConnection ? '' : 'none');
    $('.panel .password input').css('display', options.showEmail && options.showPassword && anyEnterpriseOrDbConnection ? '' : 'none');
    $('.panel .create-account .forgot-pass').css('display', options.showEmail && options.showForgot && anyEnterpriseOrDbConnection ? '' : 'none');
    $('.panel .create-account .sign-up').css('display', options.showEmail && options.showSignup && anyEnterpriseOrDbConnection ? '' : 'none');
    $('.panel .separator').css('display', options.showEmail && anyEnterpriseOrDbConnection && anySocialConnection ? '' : 'none');
    $('.panel .last-time').html(options.returnUserLabel);

    // TODO: show placeholders for IE9

    // activate panel
    $('div.panel').removeClass('active');
    $('div.overlay').addClass('active');
    $('div.panel.onestep').addClass('active');

    $('.popup h1').html(options.title);
    $('.popup .invalid').removeClass('invalid');

    // if user logged in show logged in experience
    if (_ssoData.sso && options['enableReturnUserExperience']) {
      _showLoggedInExperience();
    }

    if (options['socialBigButtons']) {
      $('.popup .panel.onestep .iconlist span').removeClass('icon').addClass('block');
    } else {
      $('.popup .panel.onestep .iconlist span').addClass('icon').removeClass('block');
    }

    $('div.panel.onestep h1').html(options['title']);
    $('div.panel.onestep').addClass('active');

    if (_ssoData.sso && _ssoData.lastUsedUsername) {
      $('div.panel.onestep input').val(_ssoData.lastUsedUsername);
    }

    _setTop(options.top, $('div.panel.onestep'));
    _setLoginView({ isReturningUser: _ssoData.sso });
  };

  // load
  insertCss(".popup .overlay {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  z-index: 9999;\n  font-weight: 200;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  background: #000;\n  background: rgba(0,0,0,0.8);\n  background: -webkit-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.8) 100%);\n  background: -moz-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.8) 100%);\n  background: -ms-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.8) 100%);\n  background: radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.45) 1%, rgba(0,0,0,0.8) 100%);\n  opacity: 0;\n  -webkit-transition: 400ms opacity ease;\n  -moz-transition: 400ms opacity ease;\n  transition: 400ms opacity ease;\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n}\n\n.popup .overlay.active {\n  opacity: 1;\n}\n\n.popup .overlay .panel {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  position: absolute;\n  left: 50%;\n  display: none;\n}\n\n.popup .overlay .panel.active {\n  display: block;\n  -webkit-animation-duration: 400ms;\n  -webkit-animation-timing-function: ease;\n  -webkit-animation-name: showPanel;\n}\n\n.popup .overlay .panel {\n  -webkit-animation-duration: 400ms;\n  -webkit-animation-timing-function: ease;\n  -webkit-animation-name: hidePanel;\n  width: 280px;\n  margin: 0 0 0 -140px;\n}\n\n.popup .overlay .email {\n  margin-bottom: 14px;\n}\n\n.popup .overlay .password, .popup .overlay .repeatPassword {\n  margin-bottom: 14px;\n}\n\n.popup .overlay .email-readonly {\n  text-align: center;\n  display: inherit;\n  color: #41444a;\n  font-weight: bold;\n  margin-bottom: 25px;\n}\n\n.panel .signup .header, .panel .reset .header {\n  margin-bottom: 15px; \n  font-size: 14px; \n  color: #41444a;\n}\n\n.panel .signup .footer {\n  margin-bottom: 15px; \n  font-size: 12px; \n  color: #41444a; \n  text-align: left; \n  margin-top: 10px;\n}\n\n@-moz-keyframes showPanel {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0.95) translate3d(0, 100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n}\n@-webkit-keyframes showPanel {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0.95) translate3d(0, 100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n}\n@-o-keyframes showPanel {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0.95) translate3d(0, 100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n}\n@-ms-keyframes showPanel {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0.95) translate3d(0, 100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n}\n@keyframes showPanel {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0.95) translate3d(0, 100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n}\n@-moz-keyframes hidePanel {\n  0% {\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n\n  100% {\n    -webkit-transform: scale(0.98) translate3d(0, 0, 0);\n  }\n}\n@-webkit-keyframes hidePanel {\n  0% {\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n\n  100% {\n    -webkit-transform: scale(0.98) translate3d(0, 0, 0);\n  }\n}\n@-o-keyframes hidePanel {\n  0% {\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n\n  100% {\n    -webkit-transform: scale(0.98) translate3d(0, 0, 0);\n  }\n}\n@-ms-keyframes hidePanel {\n  0% {\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n\n  100% {\n    -webkit-transform: scale(0.98) translate3d(0, 0, 0);\n  }\n}\n@keyframes hidePanel {\n  0% {\n    -webkit-transform: scale(1) translate3d(0, 0, 0);\n  }\n\n  100% {\n    -webkit-transform: scale(0.98) translate3d(0, 0, 0);\n  }\n}\n\n.popup .panel {\n  background: #fafafa;\n  background-image: -webkit-linear-gradient(#fff, #fafafa);\n  background-image: -moz-linear-gradient(#fff, #fafafa);\n  background-image: -ms-linear-gradient(#fff, #fafafa);\n  background-image: -o-linear-gradient(#fff, #fafafa);\n  background-image: linear-gradient(#fff, #fafafa);\n  z-index: 10;\n  -moz-box-shadow: 0 0 1px 1px rgba(0,0,0,0.2), 0 10px 27px rgba(0,0,0,0.7);\n  -webkit-box-shadow: 0 0 1px 1px rgba(0,0,0,0.2), 0 10px 27px rgba(0,0,0,0.7);\n  box-shadow: 0 0 1px 1px rgba(0,0,0,0.2), 0 10px 27px rgba(0,0,0,0.7);\n  -moz-border-radius: 6px;\n  -webkit-border-radius: 6px;\n  border-radius: 6px;\n  -webkit-touch-callout: none;\n}\n\n.popup .panel:after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  -moz-box-shadow: inset 0 -1px 2px rgba(82,93,112,0.4);\n  -webkit-box-shadow: inset 0 -1px 2px rgba(82,93,112,0.4);\n  box-shadow: inset 0 -1px 2px rgba(82,93,112,0.4);\n}\n\n.popup .panel header {\ndisplay: block;\nposition: relative;\nmin-height: 65px;\noverflow: hidden;\n-moz-border-radius: 6px 6px 0 0;\n-webkit-border-radius: 6px 6px 0 0;\nborder-radius: 6px 6px 0 0;\nbackground: #f1f4f6;\nbackground-image: -webkit-linear-gradient(#f1f4f6, #e9edf0);\nbackground-image: -moz-linear-gradient(#f1f4f6, #e9edf0);\nbackground-image: -ms-linear-gradient(#f1f4f6, #e9edf0);\nbackground-image: -o-linear-gradient(#f1f4f6, #e9edf0);\nbackground-image: linear-gradient(#f1f4f6, #e9edf0);\nborder-bottom: 1px solid rgba(40,69,85,0.11);\n}\n\n.popup .panel header:before {\n  content: '';\n  position: absolute;\n  height: 5px;\n  bottom: -1px;\n  left: 0;\n  right: 0;\n  background-image: -webkit-linear-gradient(rgba(40,69,85,0), rgba(40,69,85,0.1));\n  background-image: -moz-linear-gradient(rgba(40,69,85,0), rgba(40,69,85,0.1));\n  background-image: -ms-linear-gradient(rgba(40,69,85,0), rgba(40,69,85,0.1));\n  background-image: -o-linear-gradient(rgba(40,69,85,0), rgba(40,69,85,0.1));\n  background-image: linear-gradient(rgba(40,69,85,0), rgba(40,69,85,0.1));\n}\n\n.popup .panel header:after {\ncontent: '';\nposition: absolute;\nheight: 4px;\nbottom: 0;\nleft: 0;\nright: 0;\nbackground-image: -webkit-linear-gradient(left, #e9edf0, rgba(241,244,246,0), #e9edf0);\nbackground-image: -moz-linear-gradient(left, #e9edf0, rgba(241,244,246,0), #e9edf0);\nbackground-image: -ms-linear-gradient(left, #e9edf0, rgba(241,244,246,0), #e9edf0);\nbackground-image: -o-linear-gradient(left, #e9edf0, rgba(241,244,246,0), #e9edf0);\nbackground-image: linear-gradient(left, #e9edf0, rgba(241,244,246,0), #e9edf0);\n}\n\n.popup .panel header h1 {\n  padding: 21px 20px;\n  margin: 0;\n  font-size: 18px;\n  color: #41444a;\n  font-weight: bold;\n  border-bottom: 1px solid #DDE3E6;\n}\n\n.popup .panel header a {\n  display: block;\n  overflow: hidden;\n  text-indent: 200%;\n  position: absolute;\n  width: 12px;\n  opacity: 0.4;\n  padding: 5px;\n  z-index: 5;\n}\n\n.popup .panel header a:hover {\n  opacity: 0.66;\n}\n\n.popup .panel header a:active {\n  opacity: 1;\n}\n\n.popup .panel header a.close {\n  height: 12px;\n  background: url(\"img/close.png\") 50% 50% no-repeat;\n  background-size: 12px 12px;\n  right: 19px;\n  top: 21px;\n  cursor: pointer;\n}\n\n.popup .panel header a.close:hover {\n  opacity: 0.66;\n}\n\n.popup .panel header img {\n  height: 32px;\n  margin: 16px 10px 10px 20px;\n  position: relative;\n  float: left;\n}\n\n.action .spinner {\n  width: 100%;\n  background-color: #6A777F;\n  background-image: url('img/spinner.gif');\n  background-repeat: no-repeat;\n  background-position: center;\n  margin: 0;\n  height: 44px;\n  border: 1px solid #777; \n  border-color: rgba(0,0,0,0.2); \n  border-bottom-color: #333; \n  border-bottom-color: rgba(0,0,0,0.4);  \n  -moz-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9); \n  -webkit-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9); \n  box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9);         \n  -moz-user-select: none;  \n  user-select: none;  \n  -moz-border-radius: .3em; \n  -webkit-border-radius: .3em; \n  border-radius: .3em;\n}\n\n.popup .panel footer {\n  display: block;\n  position: relative;\n  -moz-border-radius: 0 0 5px 5px;\n  -webkit-border-radius: 0 0 5px 5px;\n  border-radius: 0 0 5px 5px;\n  height: 25px;\n  line-height: 25px;\n  vertical-align: middle;\n  margin: 0 15px;\n  border-top: 1px solid #DDE3E6;\n  z-index: 5;\n}\n\n.popup .panel footer span {\n  font-size: 10px;\n  color: #666;\n}\n\n.popup .panel footer a {\n  font-size: 9px;\n  color: #333;\n  font-weight: bold;\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.list, .iconlist {\n  margin: 25px 0;\n  position: relative;\n  z-index: 5;\n}\n\n.list:before, .list:after,\n.iconlist:before, .iconlist:after {\n  display: table;\n  content: \"\";\n}\n\n.list:after, .iconlist:after {\n  clear: both;\n}\n\n.list span {\n  display: block;\n  margin: 10px 0;\n  cursor: pointer;\n}\n\n.iconlist {\n  text-align: center;\n}\n\n.iconlist span {\n  margin: 0 2px;\n}\n\n.forgot-pass {\n  font-size: 12px;\n  color: rgb(102, 102, 102);\n  font-weight: normal;\n}\n\n.create-account {\n  display: none ;\n  margin-top: 20px;\n  text-align: center;\n}\n\n.create-account a {\n  font-size: 12px;\n  color: rgb(109, 109, 109);\n  text-decoration: none;\n}\n\n.create-account a:hover {\n  text-decoration: underline;\n}\n\n.loggedin span.centered.all {\n  color: #008CDD;\n  cursor: pointer;\n}\n\n.loggedin span.centered {\n  text-align: center;\n  padding: 5px 0;\n  margin: 15px 0 5px;\n  font-size: 13px;\n  display: block;\n}\n\n.loggedin span.centered.all:hover {\n  text-decoration: underline; \n}\n\n.signup .options a.cancel, .reset .options a.cancel {\n  color: #008CDD;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n.signup .options a.cancel:hover, .reset .options a.cancel:hover {\n  text-decoration: underline; \n}\n\n.signup .options, .reset .options {\n  text-align: center;\n  padding: 5px 0;\n  margin: 15px 0 5px;\n  font-size: 13px;\n  display: block;\n}\n\nform {\n  margin: 30px;\n  margin-bottom: 22px;\n  position: relative;\n  z-index: 5;\n}\n\nform label {\n  display: block;\n  color: #7F8899;\n  font-size: 13px;\n  font-weight: bold;\n  margin: 0 0 7px 0;\n  text-shadow: 0 1px 0 white;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n\nform input {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  width: 100%;\n  font-size: 18px;\n  padding: 10px 12px;\n  border: 1px solid #B4BECD;\n  border-top-color: #B0BACA;\n  border-bottom-color: #D3D9E2;\n  -moz-box-shadow: inset 0 1px 2px rgba(130,137,150,0.23), 0 1px 0 rgba(255,255,255,0.85);\n  -webkit-box-shadow: inset 0 1px 2px rgba(130, 137, 150, 0.23), 0 1px 0 rgba(255, 255, 255, 0.85);\n  box-shadow: inset 0 1px 2px rgba(130, 137, 150, 0.23), 0 1px 0 rgba(255, 255, 255, 0.85);\n  -moz-border-radius: 4px;\n  -webkit-border-radius: 4px;\n  border-radius: 4px;\n  color: black;\n  margin: 0;\n  font-family: 'Helvetica Neue', Helvetica, Arial Geneva, sans-serif;\n}\n\n.placeholder {\n  color: #ccc;\n}\n\nform input:focus {\n  border-color: #5695DB #70A7E4 #89B8EC #70A7E4;\n  outline: none;\n  -moz-box-shadow: inset 0 1px 2px rgba(70,123,181,0.35), 0 0 4px #5695db;\n  -webkit-box-shadow: inset 0 1px 2px rgba(70, 123, 181, 0.35), 0 0 4px #5695DB;\n  box-shadow: inset 0 1px 2px rgba(70, 123, 181, 0.35), 0 0 4px #5695DB;\n}\n\nform .invalid input {\n  outline: none;\n  border-color: #FF7076;\n  border-top-color: #FF5C61;\n  -moz-box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 4px 0 rgba(255,0,0,0.5);\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 4px 0 rgba(255, 0, 0, 0.5);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 4px 0 rgba(255, 0, 0, 0.5);\n}\n\nheader .error {\n  padding: 9px 0px;\n  margin: 10px auto;\n  width: 70%;\n  font-size: 14px;\n  line-height: 13px;\n  color: rgb(185, 83, 83);\n  text-align: center;\n}\n\nheader .success {\n  padding: 9px 0px;\n  margin: 10px auto;\n  width: 70%;\n  font-size: 14px;\n  line-height: 13px;\n  color: rgb(15, 173, 41);\n  text-align: center;\n}\n\nform .note {\n  display: block;\n  color: #7F8899;\n  font-size: 13px;\n  font-weight: bold;\n  margin: 0 0 7px 0;\n  text-shadow: 0 1px 0 white;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n\nform .note a {\n  color: #008CDD;\n  text-decoration: none;\n}\n\nform .invalid .error {\n  visibility: visible;\n}\n\nform button {\n  display: block;\n  margin: 20px 0 0 0;\n  cursor: pointer;\n  width: 100%;\n}\n\n.action {\n  text-align: right;\n  margin: 0 30px 30px 30px;\n  position: relative;\n  z-index: 5;\n}\n\nform .action {\n  margin: 0;\n}\n\n.action button {\n  width: auto;\n}\n\n.separator {\n  position: relative;\n  text-align: center;\n  margin: 0 0 25px 0;\n}\n\n.separator:before {\n  content: \"\";  \n  display: block;  \n  border-top: 1px solid #7F8899;\n  width: 200px;\n  left: 50%;\n  margin-left: -100px;\n  height: 1px;  \n  position: absolute;  \n  top: 50%;  \n  z-index: 1;\n}\n\n.separator span {\n  background: #fafafa;  \n  padding: 0 10px;  \n  position: relative;  \n  z-index: 5;\n  color: #7F8899;\n  font-size: 13px;\n  font-weight: bold;\n  text-shadow: 0 1px 0 white;\n}\n\n\nspan.back {\n  display: block;\n  color: #008CDD;\n  text-align: center;\n  padding: 5px 0;\n  margin: 15px 0 5px;\n  font-size: 13px;\n  cursor: pointer;\n  position: relative;\n  z-index: 5;\n  outline: 0;\n}\n\nspan.back:hover {\n  text-decoration: underline; \n}\n\n.signin .panel.strategies .list .email {\n  display: block;\n  color: #7F8899;\n  font-size: 13px;\n  font-weight: bold;\n  margin: 0 0 7px 0;\n  text-shadow: 0 1px 0 white;\n  text-align: center;\n}\n\n.zocial.office365:before {content: \"W\";}\n.zocial.office365 {background-color: #00ACED; color: #fff;}\n.zocial.waad:before {content: \"z\";}\n.zocial.waad {background-color: #00ADEF; color: #fff;}\n.zocial.thirtysevensignals:before {content: \"b\";}\n.zocial.thirtysevensignals {background-color: #6AC071; color: #fff;}\n.zocial.box:before {content: \"x\";}\n.zocial.box {background-color: #267bb6; color: #fff;}\n.zocial.salesforce:before {content: \"*\";}\n.zocial.salesforce {background-color: #fff; color: #ff0000;}\n.zocial.windows {background-color: #2672EC; color: #fff;}\n.zocial.fitbit:before {content: \"#\";}\n.zocial.fitbit {background-color: #45C2C5; color: #fff;}\n.zocial.yandex:before {content: \"&\";}\n.zocial.yandex {background-color: #FF0000; color: #fff;}\n.zocial.renren:before {content: \"r\";}\n.zocial.renren {background-color: #0056B5; color: #fff;}\n.zocial.baidu:before {content: \"u\";}\n.zocial.baidu {background-color: #2832E1; color: #fff;}\n\n.popup .overlay .onestep {\n  width: 345px;\n  margin: 0 0 0 -172px;\n}\n\n@media (max-width: 280px) {\n  .popup .overlay .panel {\n    width: 240px;\n    margin: 0 0 0 -120px;\n  }\n  .popup .zocial, .popup a.zocial {\n    /*\n    it doesnt look right.\n     font-size: 9px;\n     */\n  }\n  .signin .popup .panel.strategies .list {\n    margin: 12px;\n  }\n  form {\n    margin: 12px;\n  }\n  form input {\n    padding: 5px;\n  }\n  .popup .panel header {\n    margin: 0;\n    padding: 0;\n  }\n  .popup .panel header h1 {\n    padding: 14px 16px;\n    margin: 0;\n    font-size: 22px;\n  }\n  .popup .panel header a.close {\n    right: 14px;\n    top: 16px;\n  }\n}\n\n@media  (min-width: 281px) and (max-width: 340px) {\n  .popup .overlay .panel {\n    margin: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    border-radius: 0;\n  }\n  .popup .zocial, .popup a.zocial {\n    font-size: 18px;\n  }\n  .signin .popup .panel.strategies .list {\n    margin: 15px;\n  }\n  form {\n    margin: 15px 25px;\n  }\n  form input {\n    padding: 6px;\n    font-size: 18px;\n  }\n  .popup .panel header {\n    margin: 0;\n    padding: 0;\n    min-height: 32px;\n  }\n  .popup .panel header h1 {\n    padding: 12px 16px;\n    margin-top: 1px;\n    font-size: 20px;\n  }\n\n  .popup .panel header img {\n    height: 32px;\n    margin: 9px 10px 6px 18px;\n  }\n\n  .zocial.primary {\n    line-height: 34px;\n  }\n\n  .action .spinner {\n    height: 34px;\n  }\n\n  .create-account {\n    margin-top: 20px;\n  }\n\n  .popup .overlay .email {\n    margin-bottom: 5px;\n  }\n\n  .popup .overlay .password, .popup .overlay .repeatPassword {\n    margin-bottom: 5px;\n  }\n}\n\n.loading {\n  display: none;\n  border: 0;\n  overflow: hidden;\n  position: fixed;\n  visibility: visible;\n  margin: 0;\n  padding: 0;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 100000;\n  font-weight: 200;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  background-color: rgba(255,255,255,0.5);\n}\n\n.loading .message {\n  position: absolute;\n  top: 50%;\n  margin-top: -110px;\n  width: 100%;\n  text-align: center;\n  font-size: 22px;\n  font-family: Helvetica, arial, freesans, clean, sans-serif;\n  color: #333;\n}\n\n.loading .balls {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  margin-left: -45px;\n  margin-top: -45px;\n  width: 90px;\n  height:90px;\n}\n\n.loading .balls > div {\n  position: absolute;\n  width: 86px;\n  height: 86px;\n  opacity: 0;\n  -moz-transform: rotate(225deg);\n  -moz-animation: orbit 7.15s infinite;\n  -webkit-transform: rotate(225deg);\n  -webkit-animation: orbit 7.15s infinite;\n  -ms-transform: rotate(225deg);\n  -ms-animation: orbit 7.15s infinite;\n  -o-transform: rotate(225deg);\n  -o-animation: orbit 7.15s infinite;\n  transform: rotate(225deg);\n  animation: orbit 7.15s infinite;\n}\n\n.loading .balls > div > div{\n  position: absolute;\n  width: 11px;\n  height: 11px;\n  background: #333;\n  left:0px;\n  top:0px;\n  -moz-border-radius: 11px;\n  -webkit-border-radius: 11px;\n  -ms-border-radius: 11px;\n  -o-border-radius: 11px;\n  border-radius: 11px;\n}\n\n.loading .balls .ball01 {\n  -moz-animation-delay: 1.56s;\n  -webkit-animation-delay: 1.56s;\n  -ms-animation-delay: 1.56s;\n  -o-animation-delay: 1.56s;\n  animation-delay: 1.56s;\n}\n\n.loading .balls .ball02 {\n  -moz-animation-delay: 0.31s;\n  -webkit-animation-delay: 0.31s;\n  -ms-animation-delay: 0.31s;\n  -o-animation-delay: 0.31s;\n  animation-delay: 0.31s;\n}\n\n.loading .balls .ball03 {\n  -moz-animation-delay: 0.62s;\n  -webkit-animation-delay: 0.62s;\n  -ms-animation-delay: 0.62s;\n  -o-animation-delay: 0.62s;\n  animation-delay: 0.62s;\n}\n\n.loading .balls .ball04 {\n-moz-animation-delay: 0.94s;\n-webkit-animation-delay: 0.94s;\n-ms-animation-delay: 0.94s;\n-o-animation-delay: 0.94s;\nanimation-delay: 0.94s;\n}\n\n.loading .balls .ball05 {\n  -moz-animation-delay: 1.25s;\n  -webkit-animation-delay: 1.25s;\n  -ms-animation-delay: 1.25s;\n  -o-animation-delay: 1.25s;\n  animation-delay: 1.25s;\n}\n\n@-moz-keyframes orbit {\n  0% {\n    opacity: 1;\n    z-index:99;\n    -moz-transform: rotate(180deg);\n    -moz-animation-timing-function: ease-out;\n  }\n\n  7% {\n    opacity: 1;\n    -moz-transform: rotate(300deg);\n    -moz-animation-timing-function: linear;\n    -moz-origin:0%;\n  }\n\n  30% {\n    opacity: 1;\n    -moz-transform:rotate(410deg);\n    -moz-animation-timing-function: ease-in-out;\n    -moz-origin:7%;\n  }\n\n  39% {\n    opacity: 1;\n    -moz-transform: rotate(645deg);\n    -moz-animation-timing-function: linear;\n    -moz-origin:30%;\n  }\n\n  70% {\n    opacity: 1;\n    -moz-transform: rotate(770deg);\n    -moz-animation-timing-function: ease-out;\n    -moz-origin:39%;\n  }\n\n  75% {\n    opacity: 1;\n    -moz-transform: rotate(900deg);\n    -moz-animation-timing-function: ease-out;\n    -moz-origin:70%;\n  }\n\n  76% {\n    opacity: 0;\n    -moz-transform:rotate(900deg);\n  }\n\n  100% {\n    opacity: 0;\n    -moz-transform: rotate(900deg);\n  }\n\n}\n\n@-webkit-keyframes orbit {\n  0% {\n    opacity: 1;\n    z-index:99;\n    -webkit-transform: rotate(180deg);\n    -webkit-animation-timing-function: ease-out;\n  }\n\n  7% {\n    opacity: 1;\n    -webkit-transform: rotate(300deg);\n    -webkit-animation-timing-function: linear;\n    -webkit-origin:0%;\n  }\n\n  30% {\n    opacity: 1;\n    -webkit-transform:rotate(410deg);\n    -webkit-animation-timing-function: ease-in-out;\n    -webkit-origin:7%;\n  }\n\n  39% {\n    opacity: 1;\n    -webkit-transform: rotate(645deg);\n    -webkit-animation-timing-function: linear;\n    -webkit-origin:30%;\n  }\n\n  70% {\n    opacity: 1;\n    -webkit-transform: rotate(770deg);\n    -webkit-animation-timing-function: ease-out;\n    -webkit-origin:39%;\n  }\n\n  75% {\n    opacity: 1;\n    -webkit-transform: rotate(900deg);\n    -webkit-animation-timing-function: ease-out;\n    -webkit-origin:70%;\n  }\n\n  76% {\n    opacity: 0;\n    -webkit-transform:rotate(900deg);\n  }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: rotate(900deg);\n  }\n\n}\n\n@-ms-keyframes orbit {\n  0% {\n    opacity: 1;\n    z-index:99;\n    -ms-transform: rotate(180deg);\n    -ms-animation-timing-function: ease-out;\n  }\n\n  7% {\n    opacity: 1;\n    -ms-transform: rotate(300deg);\n    -ms-animation-timing-function: linear;\n    -ms-origin:0%;\n  }\n\n  30% {\n    opacity: 1;\n    -ms-transform:rotate(410deg);\n    -ms-animation-timing-function: ease-in-out;\n    -ms-origin:7%;\n  }\n\n  39% {\n    opacity: 1;\n    -ms-transform: rotate(645deg);\n    -ms-animation-timing-function: linear;\n    -ms-origin:30%;\n  }\n\n  70% {\n    opacity: 1;\n    -ms-transform: rotate(770deg);\n    -ms-animation-timing-function: ease-out;\n    -ms-origin:39%;\n  }\n\n  75% {\n    opacity: 1;\n    -ms-transform: rotate(900deg);\n    -ms-animation-timing-function: ease-out;\n    -ms-origin:70%;\n  }\n\n  76% {\n    opacity: 0;\n    -ms-transform:rotate(900deg);\n  }\n\n  100% {\n    opacity: 0;\n    -ms-transform: rotate(900deg);\n  }\n\n}\n\n@-o-keyframes orbit {\n  0% {\n    opacity: 1;\n    z-index:99;\n    -o-transform: rotate(180deg);\n    -o-animation-timing-function: ease-out;\n  }\n\n  7% {\n    opacity: 1;\n    -o-transform: rotate(300deg);\n    -o-animation-timing-function: linear;\n    -o-origin:0%;\n  }\n\n  30% {\n    opacity: 1;\n    -o-transform:rotate(410deg);\n    -o-animation-timing-function: ease-in-out;\n    -o-origin:7%;\n  }\n\n  39% {\n    opacity: 1;\n    -o-transform: rotate(645deg);\n    -o-animation-timing-function: linear;\n    -o-origin:30%;\n  }\n\n  70% {\n    opacity: 1;\n    -o-transform: rotate(770deg);\n    -o-animation-timing-function: ease-out;\n    -o-origin:39%;\n  }\n\n  75% {\n    opacity: 1;\n    -o-transform: rotate(900deg);\n    -o-animation-timing-function: ease-out;\n    -o-origin:70%;\n  }\n\n  76% {\n    opacity: 0;\n    -o-transform:rotate(900deg);\n  }\n\n  100% {\n    opacity: 0;\n    -o-transform: rotate(900deg);\n  }\n\n}\n\n@keyframes orbit {\n    0% {\n      opacity: 1;\n      z-index:99;\n      transform: rotate(180deg);\n      animation-timing-function: ease-out;\n    }\n\n  7% {\n    opacity: 1;\n    transform: rotate(300deg);\n    animation-timing-function: linear;\n    origin:0%;\n  }\n\n  30% {\n    opacity: 1;\n    transform:rotate(410deg);\n    animation-timing-function: ease-in-out;\n    origin:7%;\n  }\n\n  39% {\n    opacity: 1;\n    transform: rotate(645deg);\n    animation-timing-function: linear;\n    origin:30%;\n  }\n\n  70% {\n    opacity: 1;\n    transform: rotate(770deg);\n    animation-timing-function: ease-out;\n    origin:39%;\n  }\n\n  75% {\n    opacity: 1;\n    transform: rotate(900deg);\n    animation-timing-function: ease-out;\n    origin:70%;\n  }\n\n  76% {\n    opacity: 0;\n    transform:rotate(900deg);\n  }\n\n  100% {\n    opacity: 0;\n    transform: rotate(900deg);\n  }\n\n}\n\ninput[disabled]{\n  background-color: rgb(217, 222, 224);\n}");
  insertCss("@charset \"UTF-8\";\n\n/*!\n\tZocial Butons\n\thttp://zocial.smcllns.com\n\tby Sam Collins (@smcllns)\n\tLicense: http://opensource.org/licenses/mit-license.php\n\t\n\tYou are free to use and modify, as long as you keep this license comment intact or link back to zocial.smcllns.com on your site.\n*/\n\n\n/* Button structure */\n\n.zocial,\na.zocial {\n\tborder: 1px solid #777;\n\tborder-color: rgba(0,0,0,0.2);\n\tborder-bottom-color: #333;\n\tborder-bottom-color: rgba(0,0,0,0.4);\n\tcolor: #fff;\n\t-moz-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9);\n\t-webkit-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9);\n\tbox-shadow: inset 0 0.08em 0 rgba(255,255,255,0.4), inset 0 0 0.1em rgba(255,255,255,0.9);\n\tcursor: pointer;\n\tdisplay: inline-block;\n\tfont: bold 100%/2.1 \"Lucida Grande\", Tahoma, sans-serif;\n\tpadding: 0 .95em 0 0;\n\ttext-align: center;\n\ttext-decoration: none;\n\ttext-shadow: 0 1px 0 rgba(0,0,0,0.5);\n\twhite-space: nowrap;\n\t\n\t-moz-user-select: none;\n\t-webkit-user-select: none;\n\tuser-select: none;\n\t\n\tposition: relative;\n\t\n\t-moz-border-radius: .3em;\n\t-webkit-border-radius: .3em;\n\tborder-radius: .3em;\n}\n\n.zocial:before {\n\tcontent: \"\";\n\tborder-right: 0.075em solid rgba(0,0,0,0.1);\n\tfloat: left;\n\tfont: 120%/1.65 zocial;\n\tfont-style: normal;\n\tfont-weight: normal;\n\tmargin: 0 0.5em 0 0;\n\tpadding: 0 0.5em;\n\ttext-align: center;\n\ttext-decoration: none;\n\ttext-transform: none;\n\t\n\t-moz-box-shadow: 0.075em 0 0 rgba(255,255,255,0.25);\n\t-webkit-box-shadow: 0.075em 0 0 rgba(255,255,255,0.25);\n\tbox-shadow: 0.075em 0 0 rgba(255,255,255,0.25);\n\t\n\t-moz-font-smoothing: antialiased;\n\t-webkit-font-smoothing: antialiased;\n\tfont-smoothing: antialiased;\n}\n\n.zocial:active {\n\toutline: none; /* outline is visible on :focus */\n}\n\n/* Buttons can be displayed as standalone icons by adding a class of \"icon\" */\n\n.zocial.icon {\n\toverflow: hidden;\n\tmax-width: 2.4em;\n\tpadding-left: 0;\n\tpadding-right: 0;\n\tmax-height: 2.15em;\n\twhite-space: nowrap;\n}\n.zocial.icon:before {\n\tpadding: 0;\n\twidth: 2em;\n\theight: 2em;\n\t\n\tbox-shadow: none;\n\tborder: none;\n}\n\n/* Gradients */\n\n.zocial {\n\tbackground-image: -moz-linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.05) 49%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1));\n\tbackground-image: -ms-linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.05) 49%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1));\n\tbackground-image: -o-linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.05) 49%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1));\n\tbackground-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,.1)), color-stop(49%, rgba(255,255,255,.05)), color-stop(51%, rgba(0,0,0,.05)), to(rgba(0,0,0,.1)));\n\tbackground-image: -webkit-linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.05) 49%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1));\n\tbackground-image: linear-gradient(rgba(255,255,255,.1), rgba(255,255,255,.05) 49%, rgba(0,0,0,.05) 51%, rgba(0,0,0,.1));\n}\n\n.zocial:hover, .zocial:focus {\n\tbackground-image: -moz-linear-gradient(rgba(255,255,255,.15) 49%, rgba(0,0,0,.1) 51%, rgba(0,0,0,.15));\n\tbackground-image: -ms-linear-gradient(rgba(255,255,255,.15) 49%, rgba(0,0,0,.1) 51%, rgba(0,0,0,.15));\n\tbackground-image: -o-linear-gradient(rgba(255,255,255,.15) 49%, rgba(0,0,0,.1) 51%, rgba(0,0,0,.15));\n\tbackground-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,.15)), color-stop(49%, rgba(255,255,255,.15)), color-stop(51%, rgba(0,0,0,.1)), to(rgba(0,0,0,.15)));\n\tbackground-image: -webkit-linear-gradient(rgba(255,255,255,.15) 49%, rgba(0,0,0,.1) 51%, rgba(0,0,0,.15));\n\tbackground-image: linear-gradient(rgba(255,255,255,.15) 49%, rgba(0,0,0,.1) 51%, rgba(0,0,0,.15));\n}\n\n.zocial:active {\n\tbackground-image: -moz-linear-gradient(bottom, rgba(255,255,255,.1), rgba(255,255,255,0) 30%, transparent 50%, rgba(0,0,0,.1));\n\tbackground-image: -ms-linear-gradient(bottom, rgba(255,255,255,.1), rgba(255,255,255,0) 30%, transparent 50%, rgba(0,0,0,.1));\n\tbackground-image: -o-linear-gradient(bottom, rgba(255,255,255,.1), rgba(255,255,255,0) 30%, transparent 50%, rgba(0,0,0,.1));\n\tbackground-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,.1)), color-stop(30%, rgba(255,255,255,0)), color-stop(50%, transparent), to(rgba(0,0,0,.1)));\n\tbackground-image: -webkit-linear-gradient(bottom, rgba(255,255,255,.1), rgba(255,255,255,0) 30%, transparent 50%, rgba(0,0,0,.1));\n\tbackground-image: linear-gradient(bottom, rgba(255,255,255,.1), rgba(255,255,255,0) 30%, transparent 50%, rgba(0,0,0,.1));\n}\n\n/* Adjustments for light background buttons */\n\n.zocial.dropbox,\n.zocial.github,\n.zocial.gmail,\n.zocial.openid,\n.zocial.secondary,\n.zocial.stackoverflow,\n.zocial.salesforce {\n\tborder: 1px solid #aaa;\n\tborder-color: rgba(0,0,0,0.3);\n\tborder-bottom-color: #777;\n\tborder-bottom-color: rgba(0,0,0,0.5);\n\t-moz-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.7), inset 0 0 0.08em rgba(255,255,255,0.5);\n\t-webkit-box-shadow: inset 0 0.08em 0 rgba(255,255,255,0.7), inset 0 0 0.08em rgba(255,255,255,0.5);\n\tbox-shadow: inset 0 0.08em 0 rgba(255,255,255,0.7), inset 0 0 0.08em rgba(255,255,255,0.5);\n\ttext-shadow: 0 1px 0 rgba(255,255,255,0.8);\n}\n\n/* :hover adjustments for light background buttons */\n\n.zocial.dropbox:focus,\n.zocial.dropbox:hover,\n.zocial.github:focus,\n.zocial.github:hover,\n.zocial.gmail:focus,\n.zocial.gmail:hover,\n.zocial.openid:focus,\n.zocial.openid:hover,\n.zocial.secondary:focus,\n.zocial.secondary:hover,\n.zocial.stackoverflow:focus,\n.zocial.stackoverflow:hover,\n.zocial.twitter:focus \n.zocial.twitter:hover,\n.zocial.salesforce:focus \n.zocial.salesforce:hover {\n\tbackground-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0.5)), color-stop(49%, rgba(255,255,255,0.2)), color-stop(51%, rgba(0,0,0,0.05)), to(rgba(0,0,0,0.15)));\n\tbackground-image: -moz-linear-gradient(top, rgba(255,255,255,0.5), rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15));\n\tbackground-image: -webkit-linear-gradient(top, rgba(255,255,255,0.5), rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15));\n\tbackground-image: -o-linear-gradient(top, rgba(255,255,255,0.5), rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15));\n\tbackground-image: -ms-linear-gradient(top, rgba(255,255,255,0.5), rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15));\n\tbackground-image: linear-gradient(top, rgba(255,255,255,0.5), rgba(255,255,255,0.2) 49%, rgba(0,0,0,0.05) 51%, rgba(0,0,0,0.15));\n}\n\n/* :active adjustments for light background buttons */\n\n.zocial.dropbox:active,\n.zocial.github:active,\n.zocial.gmail:active,\n.zocial.openid:active,\n.zocial.secondary:active,\n.zocial.stackoverflow:active,\n.zocial.wikipedia:active,\n.zocial.salesforce:active {\n\tbackground-image: -webkit-gradient(linear, left top, left bottom, from(rgba(255,255,255,0)), color-stop(30%, rgba(255,255,255,0)), color-stop(50%, rgba(0,0,0,0)), to(rgba(0,0,0,0.1)));\n\tbackground-image: -moz-linear-gradient(bottom, rgba(255,255,255,0), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1));\n\tbackground-image: -webkit-linear-gradient(bottom, rgba(255,255,255,0), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1));\n\tbackground-image: -o-linear-gradient(bottom, rgba(255,255,255,0), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1));\n\tbackground-image: -ms-linear-gradient(bottom, rgba(255,255,255,0), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1));\n\tbackground-image: linear-gradient(bottom, rgba(255,255,255,0), rgba(255,255,255,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.1));\n}\n\n/* Button icon and color */\n/* Icon characters are stored in unicode private area */\n.zocial.amazon:before {content: \"a\";}\n.zocial.dropbox:before {content: \"d\"; color: #1f75cc;}\n.zocial.facebook:before {content: \"f\";}\n.zocial.github:before {content: \"\\00E8\";}\n.zocial.gmail:before {content: \"m\"; color: #f00;}\n.zocial.google:before {content: \"G\";}\n.zocial.googleplus:before {content: \"+\";}\n.zocial.guest:before {content: \"?\";}\n.zocial.ie:before {content: \"6\";}\n.zocial.linkedin:before {content: \"L\";}\n.zocial.openid:before {content: \"o\"; color: #ff921d;}\n.zocial.paypal:before {content: \"$\";}\n.zocial.stackoverflow:before {content: \"\\00EC\"; color: #ff7a15;}\n.zocial.twitter:before {content: \"T\";}\n.zocial.vk:before {content: \"N\";}\n.zocial.windows:before {content: \"W\";}\n.zocial.yahoo:before {content: \"Y\";}\n.zocial.office365:before {content: \"z\";}\n.zocial.thirtysevensignals:before {content: \"b\";}\n.zocial.salesforce:before {content: \"*\";}\n.zocial.waad:before {content: \"z\";}\n.zocial.box:before {content: \"x\";}\n\n/* Button background and text color */\n\n.zocial.amazon {background-color: #ffad1d; color: #030037; text-shadow: 0 1px 0 rgba(255,255,255,0.5);}\n.zocial.dropbox {background-color: #fff; color: #312c2a;}\n.zocial.facebook {background-color: #4863ae;}\n.zocial.github {background-color: #fbfbfb; color: #050505;}\n.zocial.gmail {background-color: #efefef; color: #222;}\n.zocial.google {background-color: #4e6cf7;}\n.zocial.googleplus {background-color: #dd4b39;}\n.zocial.guest {background-color: #1b4d6d;}\n.zocial.ie {background-color: #00a1d9;}\n.zocial.linkedin {background-color: #0083a8;}\n.zocial.openid {background-color: #f5f5f5; color: #333;}\n.zocial.paypal {background-color: #fff; color: #32689a; text-shadow: 0 1px 0 rgba(255,255,255,0.5);}\n.zocial.twitter {background-color: #46c0fb;}\n.zocial.vk {background-color: #45688E;}\n.zocial.windows {background-color: #0052a4; color: #fff;}\n.zocial.office365 {background-color: #00ACED; color: #fff;}\n.zocial.waad {background-color: #00ADEF; color: #fff;}\n.zocial.thirtysevensignals {background-color: #6AC071; color: #fff;}\n.zocial.box {background-color: #267bb6; color: #fff;}\n.zocial.salesforce {background-color: #fff; color: #ff0000;}\n.zocial.windows {background-color: #2672EC; color: #fff;}\n\n/*\nThe Miscellaneous Buttons\nThese button have no icons and can be general purpose buttons while ensuring consistent button style\nCredit to @guillermovs for suggesting\n*/\n\n.zocial.primary, .zocial.secondary {margin: 0.1em 0; padding: 0 1em;}\n.zocial.primary:before, .zocial.secondary:before {display: none;}\n.zocial.primary {background-color: #333;}\n.zocial.secondary {background-color: #f0f0eb; color: #222; text-shadow: 0 1px 0 rgba(255,255,255,0.8);}\n\n/* Any browser-specific adjustments */\n\nbutton:-moz-focus-inner {\n\tborder: 0;\n\tpadding: 0;\n}\n\n\n/* Reference icons from font-files\n** Base 64-encoded version recommended to resolve cross-site font-loading issues\n*/\n\n@font-face {\n    font-family: 'zocial';\n    src: url('/sdk/font/zocial-regular-webfont.eot');\n}\n\n@font-face {\n    font-family: 'zocial';\n\t\tsrc: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABeQAA0AAAAAIGgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABMAAAABoAAAAcZnuAykdERUYAAAFMAAAAHwAAACAATgAGT1MvMgAAAWwAAABIAAAAVk/l3EBjbWFwAAABtAAAAPYAAAIKnl567Gdhc3AAAAKsAAAACAAAAAj//wADZ2x5ZgAAArQAABKLAAAZsAMpJrBoZWFkAAAVQAAAADAAAAA2/3JSWWhoZWEAABVwAAAAIAAAACQFfQH5aG10eAAAFZAAAABjAAAAgDtOAbdsb2NhAAAV9AAAAEQAAABEWZZf+G1heHAAABY4AAAAHgAAACAAcAC+bmFtZQAAFlgAAADeAAABhlbD9/Jwb3N0AAAXOAAAAFYAAABsUemhhHicY2BgYGQAgpOd+YYg+lwlxxkYDQBA+QYqAAB4nGNgZGBg4ANiCQYQYGJgZGBmUACSLGAeAwAFxABVAHicY2BkEmOcwMDKwMHow5jGwMDgDqW/MkgytDAwMDGwMjPAALMAAwIEpLmmMDgwKH5gYHzw/wGDHuNrBvUGBgZGkBwAj6YLSHictZC9LkRRFIW/O67xzx2GYQwzElHMNBMvoBKNqIQoiVBKJBLxMlSimnJoKGi8gxeQUCh1y7o/jZurtJO1917n7HWy1wEGSNEgcCYIzYKEh7y7rtNyN+1ulTU6dNlgky222WGXfQ444phTzjjngkuurPr8QopfY8Wadk6zZ82hNSfFGn3rTR961Yue9aRHPehefZ/3jFv1dKcbXaujdpRu2qU4WhnyUbe3pj1F1KhQtecyqfnYf8mplFPEl/VGM2TZzWA5Plr8PTGU5GFG4jLKWELHmZhkKpuIav7ESjVjs8lqSzDPQtHuM8bcH77+JX4A6/Y7NwAAAAAAAf//AAJ4nJ1YeYwkV32u33tV79V9H313T/f0MdMzPdNnzeGZ2WN2vYftXXbXF2vvrtc2uw7GDkZADARI2BChiFh2hL1BcsAKicLhkEgJRJEwREFKLMcRoBAnUkKwEsFi5AASOIqTzOT3qmcdkv9I1/T0O6pevXrv+33f9ysJJGn320SCb0tEkjyYIdIOVnYk8ZGx77vwA7gmWVJF6kjLkjQOhoMK4TZ0gTeSYTocTNJJO95rCERD0sNysgnpaDJu3PtyfrntqM5bts/Vrgyv1M4dut+1Z13decuhu2ceev98vA+4nHP3zea6ClmvwvNBa719+OTV9KmThw51W/1DJ58C6xxx/PdBowAySGR3d/cazvd7Uk3axBmPJlvAojCp0ChkjXqrzePEJqJAW+NkNBkO4iRttQebIEpBjGc5MBmPWu2Wa91f+yWnUPYbSWV/NFdeVGJPtSJ6Bl5qRPktu9rrw0KZZy2udSx3dO12eAhruWb/3FCxo6IT55LgrOsCkz0TLjCaBJHv3JFTTeZaO59kFE/2ZudXjgUVScZ5f4ech+9KbekG6bB0CtdyNFmH1niUinlnFd6oQBTiYkZhnIhi1pOGMS7zeNTusXar0WJpBYbxpEeYMh6Oh9EwakSN8dn9xUhV9PH2mcknZge54mJglOxq7syR7XOrNyxupBRklVuqL4fB0qE6G1Qrs/pwYxZmLuUvXcpvLxwOc44DB5eXDhe0YW1p1vYtraLHvUZvezjvzfYXmzpXdJ0ZikkZ9P9zbg3SN62QyUhcfumSBBIgVn4V/hhxIqWjFPdfPNMAF5xnD8W4LTfqrAu4NdkxBmbu73b23bGvMznaJAr1a0ELQIHNwklFky0tOGXEC0e92mBhY2NhUAvuSpdURVUtVVbAszWTqmpDoojRa/As4uEh6f3SRwQiUoTkOogV24C9SpzEyQChGU+PN6aDU8SJirNjm+Cisy51lLBCppdPpzmqR6EDjDfq2bx70G6l43TU5wJ2IT4PZ8pkGCejdgOLqqxpzrJqMO6zSK+EIbWNYtD3IqbIlKg2d6xcGKZtPWeqlk0AgBCgivjIWJJlh3plLwgX3SLRZcWmprO/aXI1oISeAwbKsm9SmDHMJKgSh6twLNQ5VQzVMCuWZigUVDUhjLNS6USvEtt3zMdFl5PCfFI08F5UVqmsU1FSGNcUYufbRby9PgSoFy0TUeIyxz8feYfhLqCGbcwrDJ4koHZBN5ATqMAxHM9wvPn/RnG2aohjXOc0a4Ns8aLwZ4AxXag3BJBJ2bNBGVZIxbN/RhzncojjQlxWtbkVKERlVTzff+2+Qlz4DnKeJ81LEhEcMoUMzpp6Q28dxgLfw0EZhggSnHjU34BGHNLZcsn3PL8MpdIjW2+X1XK8+siR9QPNtwM8PpxxvWLe9XbeC7ftfObLvu7lbv7iV2+6ZQVg2f0sRs9/SG3yNnhMehInMUWwgGy6hsGO7IawrTAE80isFmlvwjqt0jhBBOKyCSQiwDfpeLIlZ1eKtR5UIJu3jXxNkzAbI3sOgWScdQPBTEWvaMAxsSojKBDOCkcgIRcqBqNc4RCWgFGmMEZtolLNlXmzatmWbehczgAMxMLIpHouhyepqqHolseVwHZ1QnzNLylgMgaUyTo0o7CAVxq6Zum03qSWZnOTE5nX7aCzv5WMl0GVGYV3i3AAoETXPDo/R1SFyzKGyqqutmwmpqIhmrluIp69SDFNTU9UqsoWVEemlU0MyUSmslN2cg0OruowmWuyBjPFouHJYtJKl3iaCqTQ4CaRZ2bL2/dQT3NsxPlUF9+FuthHjONypshb4qcHGxAPewIDuL4C8QiPScq4+EahTXExHffNh+cOmrrtu4vrxVqx6i//2gl6fLLSWmza881mvl3ZvO3RQ289WyArgzZR1CM94nqrM43K+hHZs8Y3zWnJUl5x2yVvdPn80YW16XyukePIc/uR4zbpFoj7VhQMsEyDERatbFexPBwMpztty5zVBWER3F8beGllfkbVGNNVy7M0plIvNMyFggVyrHA/b64uLDI2DjSqj7aOToK4WU9U7ZQqeCCx4e6ZUcmlgq3y1W5zwd43We3nY6YUObEPdqryfJh3vNGDZ44vWiaSTgCGjjRDTf26l7hGfgHnHyBzrEsncFUxiLYEVhPegyXAydtYRz4e/u+2ABe6imuOGp4iqziA8P0/bQ2ObRN/6Pn50iie+Ium7blqcX0w9keeVyiO4rG/aFm+g20vjgMsZt3O2B+7XqE0bI+DhayttIZtI98tFkbV53RkTEWPnnM8gh/ze8/pZla3fQFNc+cHX7J9RD8xjOmpBqhf2uszxLlMk4Q+SYfIVxBHx/GZT+Pe4Y5VyTCJyxAKUeH1MswgjXRJfQNa6GYm+Pz4H7Wr1UdTFcZVOuRt0ba8CaIVz+RRM6FtniacEgS6tvobGDFk1WGgIbcfkwFryi9vK7JGKfyTiCRTW/+5d0ZcblCskNdlIPecn6/ZZIXA7+kUx1D+gPGLsiiUyoTwy4ARwt4ja7Kiil3k+JjyfR8jBsiUCx1J6c634OIKWZEyb3ONDHFvc9Lt0mXpo+gAJoKChAuYxEJrQTgyDJYtGE2EJKcCr11ATDIu2sfTba8oZRru0RZqGPJTmwl6ak3VYzhJN8mG0I5kOkqm6NlCZqQ2DQOhJBwVZxkI++CT999DdcI1rjkLD45O/vqKTD5erxbn7Co3EtnLU6Ktadp2z1qbUTSUYODIY3KXMg05UCflop/vDO4IPZTeyGQKVJzFl5DtjNBXlEQhoYcBgSQVEJZopmlQclaWj7XQqVJLYVqhvDIkuBdPNAaWqRCizRgOBMiKHA/SWyAVxdR8FhPXPmfFOrKuTJtUkVGeHFrjynIa5oDFWuK4lmx9HQegCvIWkjH1+w7eWV70sAK4pSA44jH0Qr+dxZiUojkUahyhSKJQZSbxsROH+idOcPPixXu/ebE/Pn7RtQYXX301i8/df9/9IeGoewbqXiQVJamdttMEIZbwtgPjJC0DTdI2Mk+SRuxtb/vE5bd+/P77n758ebB8+cmnrj6Fs7k0eun06ct33nnvmdvPnzxZL5dOwhdg/dx9t+088AU4Wa3hfTDL2H0FduH7OEd0DzeA2MdsG7MdFx4rFWKG9Lpnv9LWlBAmgmYnGPR8Dx0cd/4N5tvbdjzCufNLDyydm4uiuXNYOD8XducPRYZd8JcKpm0oapCvblRD3+XcMgolNx8VooPdec8rlztz3bn5dqXseV+8vHy+E0Wd8/37+xfmwnDuwr1HVleSuaqF9GeUj7aLlQZhnoqGjgE0KsX2ahmlhNiVuWR19caFDo7i+r5brrQ7Ess86su4L21Uk3XpoHSj9ADyXxhnLrMxD42WcBT4JBgYaDPwWZgwT0LXbZhkWYxwUXxqqFm95YsSFigmAOkw6qO4Z15qi2SBsASjNu5/Y4y7vnV2375FxIdpNgeyo+arNFdqT/KhbSWlzdhxYvxGxWYR/z6Ta+RyDXs7VyZOGDCO3hXlFWIT2Q9pY2lps5zO9HoztZ5RcMho1jaovO6641ZuzvJDPzTqX6zncvXcH1lBYNlBAFfEeLmdb7322p897sY6Q3+ryEMOwPH76HhpaerfSRfXZhYzhxRXpbUpb0FkK840r5OrEPWUseKlXiBkrQo8GWfiAMX50ahrWeV+JWdy4RVYsT5b1vTByf6sq4F81KNBGBtG95OT6Fix+HQtnS25BpAt4sb5HD4fVw3dz0UWkuZYKdSajbL6OfjrwU4HuOAB1ev8YjUuEsHhXPgBeAJ5nGOEOIjeBGOkKknROOEzuAtNDLExRkv7p74YKryNcdHZ+dHzzyvPy182/9x6On42ub3xrlmzO9Ot/S187rN/8/PzxxfC7oPz6fxvNS+3vpH/VP6f+V/wLFZ8SScJ/Im0IX0AIzq+nr+kk71jD/r/c6A2XI+D6wfSYxLG6eiNi5A2JxVZjDN8oykRVnI6uqDf69fuDbvcChkz3Up3brQ6Thfm6zrjKDFIRVY+rlabYWJaClFdRQgFM80kbtcqUajho9dRILlHDY37LlMMqlMVbI1zbmACrdsKUyhVwshxfY2F4GsAfr+7ikzf6qK1gAdV7pg5y0Zjyjyvoqm6qjksUOSVfne2ERpc+DjceUVzivOd0WAVs0LREKM15GFJ8Ww1p6BgoaUBR6agmaWGYRPBySA7kRvErtakVZ9ALXARnIrjlbhGhV95QqrQy/B53OO2tCSUG+oMcYfLO+6PWhigfQy7zHxl/0ctud7KojLe+03a6XjSw8yxz9v9Hmpd0k94n1WQtPppgtduQpvkOwd9/0BnqeUmHpxa6xzw/YOdtVOndn54eDA43P/L7P9rR45w2U/45hZPfMqOHEH6R3RtYk3msDJXr8+V3m24rvHK2ptE5fQ7T73cz67M/m9cuABaYlHt9GmNWol2zwU9tqc1O0Z3piC2/wHj+9uZT1MlU3LRp/TTiCdRe5w2Iwui5vgb+Pk+JDvfy75PlV+A+IXy5/9l7sc0/+POX009nin58BNcs560Ld0lPSxJAeZJEwEpgbJNwNIb0Opl1B8P46xnCmVlggi8fkJ93NoD52B6pQ3t+h4is3Y+mUKWh3tI7YFJHM3nbJ8PcFSTA03TaO5ux3bifF0zCHpgH2LL1FHN6VlHhic0Dzedt5p51+YIaDVMqsUR0RVFMwnidHGm7KMoE6Kauea7ZG7lOn0LXEMLZmuuyuA3NQs8+1NdAl/JaapMA33tWtsLuKqAqzkiBTH0PLXQVfzjrBZTpBRfCV2RpRN0GJ4f+78i0OppOA5F7cf0FjMWmZ9GQdfcAvNcJjOzkHNUtJKSsvv67t/jPr2MHKQjNxSkuiQ1G7yRDpPGEvBZoQwIPVZnQloESLNfmDttHL/z5J03FwsFKF196erVl/LPPPLIM4+854lLl5649Ez71VfP3nrrO0T71QOPiJ4Ll0SPtHfPf4N/ha9LMWrXDZh93IiR0AOx4gwXPoqjCmQ+L51QhpuQbTPuFPYy3Ju96iR7N5CZwbag9XQicn54JTnWqRQeeKaoG/HjF868k0LUfW3fB5otdaHzvhSc+MYHNPXWjcMPGNQowy2HzmxsdjoHAN6xvZ0/ppBmBT5dCSydxfdexjShBG++T1ev3Fmr37Tzh0F/de3KpN9IQofqtx5be6uqv+nGhMOJh756w1xnH8CBuflHzf0HLBJsoZaLZ1Uznf4malFJulW6T3pQelT6iPSM9KcCx3Q4tSHCbgrbKnJmEP5E5IBZJrNJpnDNTqsQRKx412hTgdlGXbxCEka4nb1HSqcp+3DcFv6MX5dzLsbCBCASdhlZuwpDIeF4ow1oBD+V2kVisGkwjJKReCeLxtlWuiAyeSCm7aDQxl6IXjFBoTN116GkjplmYtmQr+ia64WK7CIAZXdURn5F6LG4PKoGMfcMS9G0vBlqkPN8dhC4Ud5fbjg5qtZ6tVrPRrp1SgXVJOccVT1Wq8oMqkUaBz6VY9dUQi9H5ZLB4a4Vr2BhpCmq4Wk0tCyTwmJQtFXww1BFSq7nZZxS2dFU5cca5t1xHvOoqOa7hpFRNQsnsV4p5dGSa5GB9oGI5EVk7p7nH+bcdWL2NHQjA9j+Xm//0usYOpot7zMUS7coefgMoOc+BkouHyn5EFWjnITomWM3Vj96sxOLOFWoa9g6ZjksH0qZ5n5w93U4C19DfZ9BpGdOLEEoo73aQhsd4u/YG9HrL7siOHN4cuSWuzEj6jJypiq35F5hptetVuFrp46fbzwrM+XTn1YUeIHtSuNxmv6dJFmSs/sa/AhexDj20EW0MLI2MK5OS3dLb5HeLr1XuiJJswISNtTTEJkwE5T2ng+st5TrjpC1mqJYgezVd9aQZn3pnk/EmKtP31GIOp0OhKXJtHM44G+Yy9a0BwsjvqdgDA6GlRii8tXIdqKoGjwbOXYUlaOdF0M0jaICQ1GCGIsfxpPwZMcJDzpRXM66I9uO8IQwKof4wTbbuRpm7U74nkoYTk+OsPRwOYxK4YdxxBDPvQ0vKUXhbW4QliIc0w7xN7TtEGLbCXAo0VIOr2BTFFlOuPMw9uPNwo/hTylsOKI3eF1cEZaWAyxXAtQ5S7oLXoWLmKdWpa40kNYwsjFSY8xUCaaYdqYxQkcmqPRIanFaIVNtGU04qhhrT7CKHRX4rFr0uemaqlfEfNh2882iZ6gy+VCix6NG8pPeupJozkQlUDK6dDWtfmiyZrQ4a8FFRCfT8c+SnYP1fjBDK2EhXNj3YvnIxpLyO7+rb5+ed/Xmpju79PvWSM7nW61czlpS1Z4k/Tc/tXiPAHicY2BkYGAA4qooY554fpuvDNxMDCBwrpLjDIz+//P/TeYMxtdALgcDWBoAKlkMKXicY2BkYGB8/f8mgx4Lw/+f/xiYMxiAIihAHgCk1AZ5eJxjYoCCVRCK8RMDAxOQZooDsjsYGBnXAGkvIF/k/z+m3P9/mEqBbBC/HIgPAbERUH4RQz8T2/9fIH2MD4BiWkB6ItgcIRYGhklg8xgYeJgY/v8GYcYrYH4DAz8DLwDcABUuAAAAAAAAAAAAAA4AWAC0ASQBYAIYAogCxAOMA9QENASwBSIF5gYEBjgGsgdAB5QHzgiMCQIJJgnWChAKhguIC7oMdgzYeJxjYGRgYFBk2M3AywACTEDMyAAScwDzGQAZIgEvAAB4nHWOMWoDMRBF39prh+AQUoWUgjRpdpE2jfEB9gAp3BsjlgXbAtkGnyRVjpAyx8gBcoQcI9/raVJYMOjN15/5Au54p+B8Cm54MB6JX4zHPHMyLqV/Gk+Y8W08lf4rZ1HeSrkfps48Ej8Zj2nxxqX0D+MJj3wZT6X/0LMmsVUldtCv0zYlwRuRjiMbVmS1sTtuVoJ28B2GO8sRcTTUSnMsVP/3XbQ5FUGOSk4vetWatDu0KXfRNbV3C2e5onkVfNX4INO1vy2Vmtnr/ZIRhnyWMe977Qi1vzr7BwDvOdMAAHicY2BiwA8UgZiRgYmRiYGdgZeBj0GJQYNBi0GfwZDBnMGSwYrBhsGFwZPBnaGQwYshiKGUwZUhmiGWgYVBmIGVIYKBk4GNIZS9NC/TzcDAAADphwhaAAA=) format('woff'),\n         url('zocial-regular-webfont.ttf') format('truetype'),\n         url('zocial-regular-webfont.svg#zocialregular') format('svg');\n    font-weight: normal;\n    font-style: normal;\n}");
  insertCss("html, body {\n  padding: 0;\n  margin: 0;\n}\n\n.zocial.auth0:before {\n  content: \"?\";\n}\n\n.zocial.auth0 {\n  background-color: #ff4500;\n  width: auto;\n}\n\n.zocial.block {\n  display: block;\n  margin: 10px 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.zocial.primary, .zocial.secondary {margin: 0; padding: 0 1em; font-size: 14px; line-height: 42px;}\n.zocial.primary:before, .zocial.secondary:before {display: none;}\n.zocial.primary {background-color: rgb(116, 126, 133);}\n.zocial.secondary {background-color: #f0f0eb; color: #222; text-shadow: 0 1px 0 rgba(255,255,255,0.8);}\n\n.zocial { -webkit-font-smoothing: antialiased; }");
  insertCss("html.button {\n  overflow: hidden;\n}\n\nhtml.button body {\n overflow: hidden;\n width: 600px; /* fix firefox width inline block issue */\n}\n");
  insertCss("/*! normalize.css v1.0.1 | MIT License | git.io/normalize */\n\n/* ==========================================================================\n   HTML5 display definitions\n   ========================================================================== */\n\n/*\n * Corrects `block` display not defined in IE 6/7/8/9 and Firefox 3.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nnav,\nsection,\nsummary {\n    display: block;\n}\n\n/*\n * Corrects `inline-block` display not defined in IE 6/7/8/9 and Firefox 3.\n */\n\naudio,\ncanvas,\nvideo {\n    display: inline-block;\n    *display: inline;\n    *zoom: 1;\n}\n\n/*\n * Prevents modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n    display: none;\n    height: 0;\n}\n\n/*\n * Addresses styling for `hidden` attribute not present in IE 7/8/9, Firefox 3,\n * and Safari 4.\n * Known issue: no IE 6 support.\n */\n\n[hidden] {\n    display: none;\n}\n\n/* ==========================================================================\n   Base\n   ========================================================================== */\n\n/*\n * 1. Corrects text resizing oddly in IE 6/7 when body `font-size` is set using\n *    `em` units.\n * 2. Prevents iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n    font-size: 100%; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n    -ms-text-size-adjust: 100%; /* 2 */\n}\n\n/*\n * Addresses `font-family` inconsistency between `textarea` and other form\n * elements.\n */\n\nhtml,\nbutton,\ninput,\nselect,\ntextarea {\n    font-family: sans-serif;\n}\n\n/*\n * Addresses margins handled incorrectly in IE 6/7.\n */\n\nbody {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Links\n   ========================================================================== */\n\n/*\n * Addresses `outline` inconsistency between Chrome and other browsers.\n */\n\na:focus {\n    outline: thin dotted;\n}\n\n/*\n * Improves readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n    outline: 0;\n}\n\n/* ==========================================================================\n   Typography\n   ========================================================================== */\n\n/*\n * Addresses font sizes and margins set differently in IE 6/7.\n * Addresses font sizes within `section` and `article` in Firefox 4+, Safari 5,\n * and Chrome.\n */\n\nh1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n}\n\nh2 {\n    font-size: 1.5em;\n    margin: 0.83em 0;\n}\n\nh3 {\n    font-size: 1.17em;\n    margin: 1em 0;\n}\n\nh4 {\n    font-size: 1em;\n    margin: 1.33em 0;\n}\n\nh5 {\n    font-size: 0.83em;\n    margin: 1.67em 0;\n}\n\nh6 {\n    font-size: 0.75em;\n    margin: 2.33em 0;\n}\n\n/*\n * Addresses styling not present in IE 7/8/9, Safari 5, and Chrome.\n */\n\nabbr[title] {\n    border-bottom: 1px dotted;\n}\n\n/*\n * Addresses style set to `bolder` in Firefox 3+, Safari 4/5, and Chrome.\n */\n\nb,\nstrong {\n    font-weight: bold;\n}\n\nblockquote {\n    margin: 1em 40px;\n}\n\n/*\n * Addresses styling not present in Safari 5 and Chrome.\n */\n\ndfn {\n    font-style: italic;\n}\n\n/*\n * Addresses styling not present in IE 6/7/8/9.\n */\n\nmark {\n    background: #ff0;\n    color: #000;\n}\n\n/*\n * Addresses margins set differently in IE 6/7.\n */\n\np,\npre {\n    margin: 1em 0;\n}\n\n/*\n * Corrects font family set oddly in IE 6, Safari 4/5, and Chrome.\n */\n\ncode,\nkbd,\npre,\nsamp {\n    font-family: monospace, serif;\n    _font-family: 'courier new', monospace;\n    font-size: 1em;\n}\n\n/*\n * Improves readability of pre-formatted text in all browsers.\n */\n\npre {\n    white-space: pre;\n    white-space: pre-wrap;\n    word-wrap: break-word;\n}\n\n/*\n * Addresses CSS quotes not supported in IE 6/7.\n */\n\nq {\n    quotes: none;\n}\n\n/*\n * Addresses `quotes` property not supported in Safari 4.\n */\n\nq:before,\nq:after {\n    content: '';\n    content: none;\n}\n\n/*\n * Addresses inconsistent and variable font size in all browsers.\n */\n\nsmall {\n    font-size: 80%;\n}\n\n/*\n * Prevents `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsup {\n    top: -0.5em;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\n/* ==========================================================================\n   Lists\n   ========================================================================== */\n\n/*\n * Addresses margins set differently in IE 6/7.\n */\n\ndl,\nmenu,\nol,\nul {\n    margin: 1em 0;\n}\n\ndd {\n    margin: 0 0 0 40px;\n}\n\n/*\n * Addresses paddings set differently in IE 6/7.\n */\n\nmenu,\nol,\nul {\n    padding: 0 0 0 40px;\n}\n\n/*\n * Corrects list images handled incorrectly in IE 7.\n */\n\nnav ul,\nnav ol {\n    list-style: none;\n    list-style-image: none;\n}\n\n/* ==========================================================================\n   Embedded content\n   ========================================================================== */\n\n/*\n * 1. Removes border when inside `a` element in IE 6/7/8/9 and Firefox 3.\n * 2. Improves image quality when scaled in IE 7.\n */\n\nimg {\n    border: 0; /* 1 */\n    -ms-interpolation-mode: bicubic; /* 2 */\n}\n\n/*\n * Corrects overflow displayed oddly in IE 9.\n */\n\nsvg:not(:root) {\n    overflow: hidden;\n}\n\n/* ==========================================================================\n   Figures\n   ========================================================================== */\n\n/*\n * Addresses margin not present in IE 6/7/8/9, Safari 5, and Opera 11.\n */\n\nfigure {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Forms\n   ========================================================================== */\n\n/*\n * Corrects margin displayed oddly in IE 6/7.\n */\n\nform {\n    margin: 0;\n}\n\n/*\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n    border: 1px solid #c0c0c0;\n    margin: 0 2px;\n    padding: 0.35em 0.625em 0.75em;\n}\n\n/*\n * 1. Corrects color not being inherited in IE 6/7/8/9.\n * 2. Corrects text not wrapping in Firefox 3.\n * 3. Corrects alignment displayed oddly in IE 6/7.\n */\n\nlegend {\n    border: 0; /* 1 */\n    padding: 0;\n    white-space: normal; /* 2 */\n    *margin-left: -7px; /* 3 */\n}\n\n/*\n * 1. Corrects font size not being inherited in all browsers.\n * 2. Addresses margins set differently in IE 6/7, Firefox 3+, Safari 5,\n *    and Chrome.\n * 3. Improves appearance and consistency in all browsers.\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n    font-size: 100%; /* 1 */\n    margin: 0; /* 2 */\n    vertical-align: baseline; /* 3 */\n    *vertical-align: middle; /* 3 */\n}\n\n/*\n * Addresses Firefox 3+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\nbutton,\ninput {\n    line-height: normal;\n}\n\n/*\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Corrects inability to style clickable `input` types in iOS.\n * 3. Improves usability and consistency of cursor style between image-type\n *    `input` and others.\n * 4. Removes inner spacing in IE 7 without affecting normal text inputs.\n *    Known issue: inner spacing remains in IE 6.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n    -webkit-appearance: button; /* 2 */\n    cursor: pointer; /* 3 */\n    *overflow: visible;  /* 4 */\n}\n\n/*\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\ninput[disabled] {\n    cursor: default;\n}\n\n/*\n * 1. Addresses box sizing set to content-box in IE 8/9.\n * 2. Removes excess padding in IE 8/9.\n * 3. Removes excess padding in IE 7.\n *    Known issue: excess padding remains in IE 6.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n    *height: 13px; /* 3 */\n    *width: 13px; /* 3 */\n}\n\n/*\n * 1. Addresses `appearance` set to `searchfield` in Safari 5 and Chrome.\n * 2. Addresses `box-sizing` set to `border-box` in Safari 5 and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    -moz-box-sizing: content-box;\n    -webkit-box-sizing: content-box; /* 2 */\n    box-sizing: content-box;\n}\n\n/*\n * Removes inner padding and search cancel button in Safari 5 and Chrome\n * on OS X.\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\n/*\n * Removes inner padding and border in Firefox 3+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n    border: 0;\n    padding: 0;\n}\n\n/*\n * 1. Removes default vertical scrollbar in IE 6/7/8/9.\n * 2. Improves readability and alignment in all browsers.\n */\n\ntextarea {\n    overflow: auto; /* 1 */\n    vertical-align: top; /* 2 */\n}\n\n/* ==========================================================================\n   Tables\n   ========================================================================== */\n\n/*\n * Remove most spacing between table cells.\n */\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}");

  var div = document.createElement('div');
  div.innerHTML = loginTmpl({});

  auth0.getSSOData(function (err, ssoData) {
    _ssoData = ssoData;
    document.body.appendChild(div);
    initialize();
  });
});

},{"./widget/html/login.html":19,"auth0-js":2,"bean":13,"bonzo":14,"domready":16,"fs":15,"insert-css":17,"qwery":18}],2:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};var assert_required   = require('./lib/assert_required');
var base64_url_decode = require('./lib/base64_url_decode');
var qs                = require('qs');
var reqwest           = require('reqwest');

var jsonp             = require('jsonp');

var use_jsonp         = require('./lib/use_jsonp');
var LoginError        = require('./lib/LoginError');
var json_parse        = require('./lib/json_parse');

function Auth0 (options) {
  if (!(this instanceof Auth0)) {
    return new Auth0(options);
  }

  assert_required(options, 'clientID');
  assert_required(options, 'callbackURL');
  assert_required(options, 'domain');

  this._clientID = options.clientID;
  this._callbackURL = options.callbackURL;
  this._domain = options.domain;
  if (options.success) {
    this.parseHash(options.success);
  }
  this._failure = options.failure;
}

Auth0.prototype._redirect = function (url) {
  global.window.location = url;
};

Auth0.prototype._renderAndSubmitWSFedForm = function (formHtml) {
  var div = document.createElement('div');
  div.innerHTML = formHtml;
  var form = document.body.appendChild(div).children[0];
  form.submit();
};

Auth0.prototype.parseHash = function (callback) {
  if(!window.location.hash.match(/access_token/)) return;
  var hash = window.location.hash.substr(1);
  var parsed_qs = qs.parse(hash);
  var id_token = parsed_qs.id_token;
  var encoded = id_token.split('.')[1];
  var prof = json_parse(base64_url_decode(encoded));
  callback(prof, id_token, parsed_qs.access_token, parsed_qs.state);
};

Auth0.prototype.signup = function (options, callback) {
  var self = this;
  
  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.email = options.username || options.email;
  query.password = options.password;
  
  query.tenant = this._domain.split('.')[0];

  function success () {
    if ('auto_login' in options && !options.auto_login) {
      if (callback) callback();
      return;
    }
    self.login(options, callback);
  }

  function fail (status, resp) {
    var error = new LoginError(status, resp);
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error); 
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/signup?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return fail(0, err);
      }
      return resp.status == 200 ? 
              success() :
              fail(resp.status, resp.err);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/signup',
    method:  'post',
    type:    'html',
    data:    query,
    success: success
  }).fail(function (err) {
    fail(err.status, err.responseText);
  });
};

Auth0.prototype.login = function (options, callback) {
  if (options.username || options.email) {
    return this.loginWithDbConnection(options, callback);
  }

  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  this._redirect('https://' + this._domain + '/authorize?' + qs.stringify(query));
};

Auth0.prototype.loginWithDbConnection = function (options, callback) {
  var self = this;
  
  var query = {
    response_type: 'token',
    client_id:     this._clientID,
    connection:    options.connection,
    redirect_uri:  this._callbackURL,
    scope:         'openid profile'
  };

  if (options.state) {
    query.state = options.state;
  }

  query.username = options.username || options.email;
  query.password = options.password;
  
  query.tenant = this._domain.split('.')[0];

  function return_error (error) {
    if (callback)      return callback(error);
    if (self._failure) return self._failure(error); 
  }

  if (use_jsonp()) {
    return jsonp('https://' + this._domain + '/dbconnections/login?' + qs.stringify(query), {
      param: 'cbx',
      timeout: 15000
    }, function (err, resp) {
      if (err) {
        return return_error(err);
      }
      if('error' in resp) {
        var error = new LoginError(resp.status, resp.error);
        return return_error(error);
      }
      self._renderAndSubmitWSFedForm(resp.form);
    });
  }

  reqwest({
    url:     'https://' + this._domain + '/dbconnections/login',
    method:  'post',
    type:    'html',
    data:    query,
    success: function (resp) {
      self._renderAndSubmitWSFedForm(resp);
    }
  }).fail(function (err) {
    var error = new LoginError(err.status, err.responseText);
    return return_error(error);
  });
};

Auth0.prototype.getSSOData = function (callback) {
  return jsonp('https://' + this._domain + '/user/ssodata', {
    param: 'cbx',
    timeout: 15000
  }, function (err, resp) {
    callback(null, err ? {} : resp); // Always return OK, regardless of any errors
  });
};

if (global.window) {
  global.window.Auth0 = Auth0;
}

module.exports = Auth0;
},{"./lib/LoginError":3,"./lib/assert_required":4,"./lib/base64_url_decode":5,"./lib/json_parse":6,"./lib/use_jsonp":7,"jsonp":9,"qs":11,"reqwest":12}],3:[function(require,module,exports){
var json_parse = require('./json_parse');

function LoginError(status, details) {
  var obj;

  if (typeof details == 'string') {
    try {
      obj = json_parse(details);
    } catch (er) {
      obj = {message: details};      
    }
  } else {
    obj = details;
  }

  var err = Error.call(this, obj.description || obj.message || obj.error);

  err.status = status;
  err.name = obj.code;
  err.code = obj.code;
  err.details = obj;
  
  if (status === 0) {
    err.code = "Unknown";
    err.message = "Unknown error.";
  }

  return err;
}

if (Object && Object.create) {
  LoginError.prototype = Object.create(Error.prototype, { 
    constructor: { value: LoginError } 
  });
}

module.exports = LoginError;
},{"./json_parse":6}],4:[function(require,module,exports){
module.exports = function (obj, prop) {
  if (!obj[prop]) {
    throw new Error(prop + ' is required.');
  }
};
},{}],5:[function(require,module,exports){
var Base64 = require('Base64');

module.exports = function(str) {
  var output = str.replace("-", "+").replace("_", "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  return Base64.atob(output);
};
},{"Base64":8}],6:[function(require,module,exports){
module.exports = function (str) {
  return window.JSON ? window.JSON.parse(str) : eval('(' + str + ')');
};
},{}],7:[function(require,module,exports){
module.exports = function () {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : null;
  
  if (xhr && 'withCredentials' in xhr) {
    return false;
  }

  return 'XDomainRequest' in window && window.location.protocol === 'http:';
};
},{}],8:[function(require,module,exports){
;(function () {

  var
    object = typeof exports != 'undefined' ? exports : this, // #8: web workers
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    INVALID_CHARACTER_ERR = (function () {
      // fabricate a suitable error object
      try { document.createElement('$'); }
      catch (error) { return error; }}());

  // encoder
  // [https://gist.github.com/999166] by [https://github.com/nignag]
  object.btoa || (
  object.btoa = function (input) {
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next input index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      input.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = input.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) throw INVALID_CHARACTER_ERR;
      block = block << 8 | charCode;
    }
    return output;
  });

  // decoder
  // [https://gist.github.com/1020396] by [https://github.com/atk]
  object.atob || (
  object.atob = function (input) {
    input = input.replace(/=+$/, '')
    if (input.length % 4 == 1) throw INVALID_CHARACTER_ERR;
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  });

}());

},{}],9:[function(require,module,exports){

/**
 * Module dependencies
 */

var debug = require('debug')('jsonp');

/**
 * Module exports.
 */

module.exports = jsonp;

/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){};

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

function jsonp(url, opts, fn){
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  var opts = opts || {};
  var param = opts.param || 'callback';
  var timeout = null != opts.timeout ? opts.timeout : 60000;
  var enc = encodeURIComponent;
  var target = document.getElementsByTagName('script')[0];
  var script;
  var timer;

  // generate a unique id for this request
  var id = count++;

  if (timeout) {
    timer = setTimeout(function(){
      cleanup();
      fn && fn(new Error('Timeout'));
    }, timeout);
  }

  function cleanup(){
    target.parentNode.removeChild(script);
    window['__jp' + id] = noop;
  }

  window['__jp' + id] = function(data){
    debug('jsonp got', data);
    if (timer) clearTimeout(timer);
    cleanup();
    fn && fn(null, data);
  };

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc('__jp' + id + '');
  url = url.replace('?&', '?');

  debug('jsonp req "%s"', url);

  // create script
  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);
};

},{"debug":10}],10:[function(require,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

// persist

if (window.localStorage) debug.enable(localStorage.debug);

},{}],11:[function(require,module,exports){
/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Object#hasOwnProperty ref
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * see issue #70
 */
var isRestorableProto = (function () {
  var o;

  if (!Object.create) return false;

  o = Object.create(null);
  o.__proto__ = Object.prototype;

  return o.hasOwnProperty === hasOwnProperty;
})();

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      if (typeof arr == 'string' && typeof "a"[0] == 'undefined') {
        arr = arr.split('');
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret.push(key);
    }
  }
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Create a nullary object if possible
 */

function createObject() {
  return isRestorableProto
    ? Object.create(null)
    : {};
}

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = createObject();
  var t = createObject();
  for (var i in parent[key]) {
    if (hasOwnProperty.call(parent[key], i)) {
      t[i] = parent[key][i];
    }
  }
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();
  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = createObject();
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Compact sparse arrays.
 */

function compact(obj) {
  if ('object' != typeof obj) return obj;

  if (isArray(obj)) {
    var ret = [];

    for (var i in obj) {
      if (hasOwnProperty.call(obj, i)) {
        ret.push(obj[i]);
      }
    }

    return ret;
  }

  for (var key in obj) {
    obj[key] = compact(obj[key]);
  }

  return obj;
}

/**
 * Restore Object.prototype.
 * see pull-request #58
 */

function restoreProto(obj) {
  if (!isRestorableProto) return obj;
  if (isArray(obj)) return obj;
  if (obj && 'object' != typeof obj) return obj;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      obj[key] = restoreProto(obj[key]);
    }
  }

  obj.__proto__ = Object.prototype;
  return obj;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };

  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });

  return compact(ret.base);
}

/**
 * Parse the given str.
 */

function parseString(str){
  var ret = reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: createObject() }).base;

  return restoreProto(compact(ret));
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if ('' == key) continue;
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],12:[function(require,module,exports){
/*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2013
  * https://github.com/ded/reqwest
  * license MIT
  */
!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('reqwest', this, function () {

  var win = window
    , doc = document
    , twoHundo = /^20\d$/
    , byTag = 'getElementsByTagName'
    , readyState = 'readyState'
    , contentType = 'Content-Type'
    , requestedWith = 'X-Requested-With'
    , head = doc[byTag]('head')[0]
    , uniqid = 0
    , callbackPrefix = 'reqwest_' + (+new Date())
    , lastValue // data stored by the most recent JSONP callback
    , xmlHttpRequest = 'XMLHttpRequest'
    , xDomainRequest = 'XDomainRequest'
    , noop = function () {}

    , isArray = typeof Array.isArray == 'function'
        ? Array.isArray
        : function (a) {
            return a instanceof Array
          }

    , defaultHeaders = {
          contentType: 'application/x-www-form-urlencoded'
        , requestedWith: xmlHttpRequest
        , accept: {
              '*':  'text/javascript, text/html, application/xml, text/xml, */*'
            , xml:  'application/xml, text/xml'
            , html: 'text/html'
            , text: 'text/plain'
            , json: 'application/json, text/javascript'
            , js:   'application/javascript, text/javascript'
          }
      }

    , xhr = function(o) {
        // is it x-domain
        if (o.crossOrigin === true) {
          var xhr = win[xmlHttpRequest] ? new XMLHttpRequest() : null
          if (xhr && 'withCredentials' in xhr) {
            return xhr
          } else if (win[xDomainRequest]) {
            return new XDomainRequest()
          } else {
            throw new Error('Browser does not support cross-origin requests')
          }
        } else if (win[xmlHttpRequest]) {
          return new XMLHttpRequest()
        } else {
          return new ActiveXObject('Microsoft.XMLHTTP')
        }
      }
    , globalSetupOptions = {
        dataFilter: function (data) {
          return data
        }
      }

  function handleReadyState(r, success, error) {
    return function () {
      // use _aborted to mitigate against IE err c00c023f
      // (can't read props on aborted request objects)
      if (r._aborted) return error(r.request)
      if (r.request && r.request[readyState] == 4) {
        r.request.onreadystatechange = noop
        if (twoHundo.test(r.request.status))
          success(r.request)
        else
          error(r.request)
      }
    }
  }

  function setHeaders(http, o) {
    var headers = o.headers || {}
      , h

    headers.Accept = headers.Accept
      || defaultHeaders.accept[o.type]
      || defaultHeaders.accept['*']

    // breaks cross-origin requests with legacy browsers
    if (!o.crossOrigin && !headers[requestedWith]) headers[requestedWith] = defaultHeaders.requestedWith
    if (!headers[contentType]) headers[contentType] = o.contentType || defaultHeaders.contentType
    for (h in headers)
      headers.hasOwnProperty(h) && 'setRequestHeader' in http && http.setRequestHeader(h, headers[h])
  }

  function setCredentials(http, o) {
    if (typeof o.withCredentials !== 'undefined' && typeof http.withCredentials !== 'undefined') {
      http.withCredentials = !!o.withCredentials
    }
  }

  function generalCallback(data) {
    lastValue = data
  }

  function urlappend (url, s) {
    return url + (/\?/.test(url) ? '&' : '?') + s
  }

  function handleJsonp(o, fn, err, url) {
    var reqId = uniqid++
      , cbkey = o.jsonpCallback || 'callback' // the 'callback' key
      , cbval = o.jsonpCallbackName || reqwest.getcallbackPrefix(reqId)
      // , cbval = o.jsonpCallbackName || ('reqwest_' + reqId) // the 'callback' value
      , cbreg = new RegExp('((^|\\?|&)' + cbkey + ')=([^&]+)')
      , match = url.match(cbreg)
      , script = doc.createElement('script')
      , loaded = 0
      , isIE10 = navigator.userAgent.indexOf('MSIE 10.0') !== -1

    if (match) {
      if (match[3] === '?') {
        url = url.replace(cbreg, '$1=' + cbval) // wildcard callback func name
      } else {
        cbval = match[3] // provided callback func name
      }
    } else {
      url = urlappend(url, cbkey + '=' + cbval) // no callback details, add 'em
    }

    win[cbval] = generalCallback

    script.type = 'text/javascript'
    script.src = url
    script.async = true
    if (typeof script.onreadystatechange !== 'undefined' && !isIE10) {
      // need this for IE due to out-of-order onreadystatechange(), binding script
      // execution to an event listener gives us control over when the script
      // is executed. See http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
      //
      // if this hack is used in IE10 jsonp callback are never called
      script.event = 'onclick'
      script.htmlFor = script.id = '_reqwest_' + reqId
    }

    script.onload = script.onreadystatechange = function () {
      if ((script[readyState] && script[readyState] !== 'complete' && script[readyState] !== 'loaded') || loaded) {
        return false
      }
      script.onload = script.onreadystatechange = null
      script.onclick && script.onclick()
      // Call the user callback with the last value stored and clean up values and scripts.
      fn(lastValue)
      lastValue = undefined
      head.removeChild(script)
      loaded = 1
    }

    // Add the script to the DOM head
    head.appendChild(script)

    // Enable JSONP timeout
    return {
      abort: function () {
        script.onload = script.onreadystatechange = null
        err({}, 'Request is aborted: timeout', {})
        lastValue = undefined
        head.removeChild(script)
        loaded = 1
      }
    }
  }

  function getRequest(fn, err) {
    var o = this.o
      , method = (o.method || 'GET').toUpperCase()
      , url = typeof o === 'string' ? o : o.url
      // convert non-string objects to query-string form unless o.processData is false
      , data = (o.processData !== false && o.data && typeof o.data !== 'string')
        ? reqwest.toQueryString(o.data)
        : (o.data || null)
      , http
      , sendWait = false

    // if we're working on a GET request and we have data then we should append
    // query string to end of URL and not post data
    if ((o.type == 'jsonp' || method == 'GET') && data) {
      url = urlappend(url, data)
      data = null
    }

    if (o.type == 'jsonp') return handleJsonp(o, fn, err, url)

    http = xhr(o)
    http.open(method, url, o.async === false ? false : true)
    setHeaders(http, o)
    setCredentials(http, o)
    if (win[xDomainRequest] && http instanceof win[xDomainRequest]) {
        http.onload = fn
        http.onerror = err
        // NOTE: see
        // http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e
        http.onprogress = function() {}
        sendWait = true
    } else {
      http.onreadystatechange = handleReadyState(this, fn, err)
    }
    o.before && o.before(http)
    if (sendWait) {
      setTimeout(function () {
        http.send(data)
      }, 200)
    } else {
      http.send(data)
    }
    return http
  }

  function Reqwest(o, fn) {
    this.o = o
    this.fn = fn

    init.apply(this, arguments)
  }

  function setType(url) {
    var m = url.match(/\.(json|jsonp|html|xml)(\?|$)/)
    return m ? m[1] : 'js'
  }

  function init(o, fn) {

    this.url = typeof o == 'string' ? o : o.url
    this.timeout = null

    // whether request has been fulfilled for purpose
    // of tracking the Promises
    this._fulfilled = false
    // success handlers
    this._successHandler = function(){}
    this._fulfillmentHandlers = []
    // error handlers
    this._errorHandlers = []
    // complete (both success and fail) handlers
    this._completeHandlers = []
    this._erred = false
    this._responseArgs = {}

    var self = this
      , type = o.type || setType(this.url)

    fn = fn || function () {}

    if (o.timeout) {
      this.timeout = setTimeout(function () {
        self.abort()
      }, o.timeout)
    }

    if (o.success) {
      this._successHandler = function () {
        o.success.apply(o, arguments)
      }
    }

    if (o.error) {
      this._errorHandlers.push(function () {
        o.error.apply(o, arguments)
      })
    }

    if (o.complete) {
      this._completeHandlers.push(function () {
        o.complete.apply(o, arguments)
      })
    }

    function complete (resp) {
      o.timeout && clearTimeout(self.timeout)
      self.timeout = null
      while (self._completeHandlers.length > 0) {
        self._completeHandlers.shift()(resp)
      }
    }

    function success (resp) {
      resp = (type !== 'jsonp') ? self.request : resp
      // use global data filter on response text
      var filteredResponse = globalSetupOptions.dataFilter(resp.responseText, type)
        , r = filteredResponse
      try {
        resp.responseText = r
      } catch (e) {
        // can't assign this in IE<=8, just ignore
      }
      if (r) {
        switch (type) {
        case 'json':
          try {
            resp = win.JSON ? win.JSON.parse(r) : eval('(' + r + ')')
          } catch (err) {
            return error(resp, 'Could not parse JSON in response', err)
          }
          break
        case 'js':
          resp = eval(r)
          break
        case 'html':
          resp = r
          break
        case 'xml':
          resp = resp.responseXML
              && resp.responseXML.parseError // IE trololo
              && resp.responseXML.parseError.errorCode
              && resp.responseXML.parseError.reason
            ? null
            : resp.responseXML
          break
        }
      }

      self._responseArgs.resp = resp
      self._fulfilled = true
      fn(resp)
      self._successHandler(resp)
      while (self._fulfillmentHandlers.length > 0) {
        resp = self._fulfillmentHandlers.shift()(resp)
      }

      complete(resp)
    }

    function error(resp, msg, t) {
      resp = self.request
      self._responseArgs.resp = resp
      self._responseArgs.msg = msg
      self._responseArgs.t = t
      self._erred = true
      while (self._errorHandlers.length > 0) {
        self._errorHandlers.shift()(resp, msg, t)
      }
      complete(resp)
    }

    this.request = getRequest.call(this, success, error)
  }

  Reqwest.prototype = {
    abort: function () {
      this._aborted = true
      this.request.abort()
    }

  , retry: function () {
      init.call(this, this.o, this.fn)
    }

    /**
     * Small deviation from the Promises A CommonJs specification
     * http://wiki.commonjs.org/wiki/Promises/A
     */

    /**
     * `then` will execute upon successful requests
     */
  , then: function (success, fail) {
      success = success || function () {}
      fail = fail || function () {}
      if (this._fulfilled) {
        this._responseArgs.resp = success(this._responseArgs.resp)
      } else if (this._erred) {
        fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._fulfillmentHandlers.push(success)
        this._errorHandlers.push(fail)
      }
      return this
    }

    /**
     * `always` will execute whether the request succeeds or fails
     */
  , always: function (fn) {
      if (this._fulfilled || this._erred) {
        fn(this._responseArgs.resp)
      } else {
        this._completeHandlers.push(fn)
      }
      return this
    }

    /**
     * `fail` will execute when the request fails
     */
  , fail: function (fn) {
      if (this._erred) {
        fn(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t)
      } else {
        this._errorHandlers.push(fn)
      }
      return this
    }
  }

  function reqwest(o, fn) {
    return new Reqwest(o, fn)
  }

  // normalize newline variants according to spec -> CRLF
  function normalize(s) {
    return s ? s.replace(/\r?\n/g, '\r\n') : ''
  }

  function serial(el, cb) {
    var n = el.name
      , t = el.tagName.toLowerCase()
      , optCb = function (o) {
          // IE gives value="" even where there is no value attribute
          // 'specified' ref: http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-862529273
          if (o && !o.disabled)
            cb(n, normalize(o.attributes.value && o.attributes.value.specified ? o.value : o.text))
        }
      , ch, ra, val, i

    // don't serialize elements that are disabled or without a name
    if (el.disabled || !n) return

    switch (t) {
    case 'input':
      if (!/reset|button|image|file/i.test(el.type)) {
        ch = /checkbox/i.test(el.type)
        ra = /radio/i.test(el.type)
        val = el.value
        // WebKit gives us "" instead of "on" if a checkbox has no value, so correct it here
        ;(!(ch || ra) || el.checked) && cb(n, normalize(ch && val === '' ? 'on' : val))
      }
      break
    case 'textarea':
      cb(n, normalize(el.value))
      break
    case 'select':
      if (el.type.toLowerCase() === 'select-one') {
        optCb(el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null)
      } else {
        for (i = 0; el.length && i < el.length; i++) {
          el.options[i].selected && optCb(el.options[i])
        }
      }
      break
    }
  }

  // collect up all form elements found from the passed argument elements all
  // the way down to child elements; pass a '<form>' or form fields.
  // called with 'this'=callback to use for serial() on each element
  function eachFormElement() {
    var cb = this
      , e, i
      , serializeSubtags = function (e, tags) {
          var i, j, fa
          for (i = 0; i < tags.length; i++) {
            fa = e[byTag](tags[i])
            for (j = 0; j < fa.length; j++) serial(fa[j], cb)
          }
        }

    for (i = 0; i < arguments.length; i++) {
      e = arguments[i]
      if (/input|select|textarea/i.test(e.tagName)) serial(e, cb)
      serializeSubtags(e, [ 'input', 'select', 'textarea' ])
    }
  }

  // standard query string style serialization
  function serializeQueryString() {
    return reqwest.toQueryString(reqwest.serializeArray.apply(null, arguments))
  }

  // { 'name': 'value', ... } style serialization
  function serializeHash() {
    var hash = {}
    eachFormElement.apply(function (name, value) {
      if (name in hash) {
        hash[name] && !isArray(hash[name]) && (hash[name] = [hash[name]])
        hash[name].push(value)
      } else hash[name] = value
    }, arguments)
    return hash
  }

  // [ { name: 'name', value: 'value' }, ... ] style serialization
  reqwest.serializeArray = function () {
    var arr = []
    eachFormElement.apply(function (name, value) {
      arr.push({name: name, value: value})
    }, arguments)
    return arr
  }

  reqwest.serialize = function () {
    if (arguments.length === 0) return ''
    var opt, fn
      , args = Array.prototype.slice.call(arguments, 0)

    opt = args.pop()
    opt && opt.nodeType && args.push(opt) && (opt = null)
    opt && (opt = opt.type)

    if (opt == 'map') fn = serializeHash
    else if (opt == 'array') fn = reqwest.serializeArray
    else fn = serializeQueryString

    return fn.apply(null, args)
  }

  reqwest.toQueryString = function (o, trad) {
    var prefix, i
      , traditional = trad || false
      , s = []
      , enc = encodeURIComponent
      , add = function (key, value) {
          // If value is a function, invoke it and return its value
          value = ('function' === typeof value) ? value() : (value == null ? '' : value)
          s[s.length] = enc(key) + '=' + enc(value)
        }
    // If an array was passed in, assume that it is an array of form elements.
    if (isArray(o)) {
      for (i = 0; o && i < o.length; i++) add(o[i].name, o[i].value)
    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in o) {
        buildParams(prefix, o[prefix], traditional, add)
      }
    }

    // spaces should be + according to spec
    return s.join('&').replace(/%20/g, '+')
  }

  function buildParams(prefix, obj, traditional, add) {
    var name, i, v
      , rbracket = /\[\]$/

    if (isArray(obj)) {
      // Serialize array item.
      for (i = 0; obj && i < obj.length; i++) {
        v = obj[i]
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v)
        } else {
          buildParams(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add)
        }
      }
    } else if (obj && obj.toString() === '[object Object]') {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], traditional, add)
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj)
    }
  }

  reqwest.getcallbackPrefix = function () {
    return callbackPrefix
  }

  // jQuery and Zepto compatibility, differences can be remapped here so you can call
  // .ajax.compat(options, callback)
  reqwest.compat = function (o, fn) {
    if (o) {
      o.type && (o.method = o.type) && delete o.type
      o.dataType && (o.type = o.dataType)
      o.jsonpCallback && (o.jsonpCallbackName = o.jsonpCallback) && delete o.jsonpCallback
      o.jsonp && (o.jsonpCallback = o.jsonp)
    }
    return new Reqwest(o, fn)
  }

  reqwest.ajaxSetup = function (options) {
    options = options || {}
    for (var k in options) {
      globalSetupOptions[k] = options[k]
    }
  }

  return reqwest
});

},{}],13:[function(require,module,exports){
/*!
  * Bean - copyright (c) Jacob Thornton 2011-2012
  * https://github.com/fat/bean
  * MIT license
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bean', this, function (name, context) {
  name    = name    || 'bean'
  context = context || this

  var win            = window
    , old            = context[name]
    , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
    , nameRegex      = /\..*/
    , addEvent       = 'addEventListener'
    , removeEvent    = 'removeEventListener'
    , doc            = document || {}
    , root           = doc.documentElement || {}
    , W3C_MODEL      = root[addEvent]
    , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
    , ONE            = {} // singleton for quick matching making add() do one()

    , slice          = Array.prototype.slice
    , str2arr        = function (s, d) { return s.split(d || ' ') }
    , isString       = function (o) { return typeof o == 'string' }
    , isFunction     = function (o) { return typeof o == 'function' }

      // events that we consider to be 'native', anything not in this list will
      // be treated as a custom event
    , standardNativeEvents =
        'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
        'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
        'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
        'keydown keypress keyup '                                        + // keyboard
        'orientationchange '                                             + // mobile
        'focus blur change reset select submit '                         + // form elements
        'load unload beforeunload resize move DOMContentLoaded '         + // window
        'readystatechange message '                                      + // window
        'error abort scroll '                                              // misc
      // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
      // that doesn't actually exist, so make sure we only do these on newer browsers
    , w3cNativeEvents =
        'show '                                                          + // mouse buttons
        'input invalid '                                                 + // form elements
        'touchstart touchmove touchend touchcancel '                     + // touch
        'gesturestart gesturechange gestureend '                         + // gesture
        'textinput'                                                      + // TextEvent
        'readystatechange pageshow pagehide popstate '                   + // window
        'hashchange offline online '                                     + // window
        'afterprint beforeprint '                                        + // printing
        'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
        'loadstart progress suspend emptied stalled loadmetadata '       + // media
        'loadeddata canplay canplaythrough playing waiting seeking '     + // media
        'seeked ended durationchange timeupdate play pause ratechange '  + // media
        'volumechange cuechange '                                        + // media
        'checking noupdate downloading cached updateready obsolete '       // appcache

      // convert to a hash for quick lookups
    , nativeEvents = (function (hash, events, i) {
        for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
        return hash
      }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))

      // custom events are events that we *fake*, they are not provided natively but
      // we can use native events to generate them
    , customEvents = (function () {
        var isAncestor = 'compareDocumentPosition' in root
              ? function (element, container) {
                  return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                }
              : 'contains' in root
                ? function (element, container) {
                    container = container.nodeType === 9 || container === window ? root : container
                    return container !== element && container.contains(element)
                  }
                : function (element, container) {
                    while (element = element.parentNode) if (element === container) return 1
                    return 0
                  }
          , check = function (event) {
              var related = event.relatedTarget
              return !related
                ? related == null
                : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                    && !isAncestor(related, this))
            }

        return {
            mouseenter: { base: 'mouseover', condition: check }
          , mouseleave: { base: 'mouseout', condition: check }
          , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
        }
      }())

      // we provide a consistent Event object across browsers by taking the actual DOM
      // event object and generating a new one from its properties.
    , Event = (function () {
            // a whitelist of properties (for different event types) tells us what to check for and copy
        var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
              'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
              'srcElement target timeStamp type view which propertyName')
          , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
              'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
          , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
              'axis')) // 'axis' is FF specific
          , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
              'keyLocation location'))
          , textProps    = commonProps.concat(str2arr('data'))
          , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
          , messageProps = commonProps.concat(str2arr('data origin source'))
          , stateProps   = commonProps.concat(str2arr('state'))
          , overOutRegex = /over|out/
            // some event types need special handling and some need special properties, do that all here
          , typeFixers   = [
                { // key events
                    reg: /key/i
                  , fix: function (event, newEvent) {
                      newEvent.keyCode = event.keyCode || event.which
                      return keyProps
                    }
                }
              , { // mouse events
                    reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                  , fix: function (event, newEvent, type) {
                      newEvent.rightClick = event.which === 3 || event.button === 2
                      newEvent.pos = { x: 0, y: 0 }
                      if (event.pageX || event.pageY) {
                        newEvent.clientX = event.pageX
                        newEvent.clientY = event.pageY
                      } else if (event.clientX || event.clientY) {
                        newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                        newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                      }
                      if (overOutRegex.test(type)) {
                        newEvent.relatedTarget = event.relatedTarget
                          || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                      }
                      return mouseProps
                    }
                }
              , { // mouse wheel events
                    reg: /mouse.*(wheel|scroll)/i
                  , fix: function () { return mouseWheelProps }
                }
              , { // TextEvent
                    reg: /^text/i
                  , fix: function () { return textProps }
                }
              , { // touch and gesture events
                    reg: /^touch|^gesture/i
                  , fix: function () { return touchProps }
                }
              , { // message events
                    reg: /^message$/i
                  , fix: function () { return messageProps }
                }
              , { // popstate events
                    reg: /^popstate$/i
                  , fix: function () { return stateProps }
                }
              , { // everything else
                    reg: /.*/
                  , fix: function () { return commonProps }
                }
            ]
          , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism

          , Event = function (event, element, isNative) {
              if (!arguments.length) return
              event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
              this.originalEvent = event
              this.isNative       = isNative
              this.isBean         = true

              if (!event) return

              var type   = event.type
                , target = event.target || event.srcElement
                , i, l, p, props, fixer

              this.target = target && target.nodeType === 3 ? target.parentNode : target

              if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                fixer = typeFixerMap[type]
                if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                  for (i = 0, l = typeFixers.length; i < l; i++) {
                    if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                      typeFixerMap[type] = fixer = typeFixers[i].fix
                      break
                    }
                  }
                }

                props = fixer(event, this, type)
                for (i = props.length; i--;) {
                  if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                }
              }
            }

        // preventDefault() and stopPropagation() are a consistent interface to those functions
        // on the DOM, stop() is an alias for both of them together
        Event.prototype.preventDefault = function () {
          if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
          else this.originalEvent.returnValue = false
        }
        Event.prototype.stopPropagation = function () {
          if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
          else this.originalEvent.cancelBubble = true
        }
        Event.prototype.stop = function () {
          this.preventDefault()
          this.stopPropagation()
          this.stopped = true
        }
        // stopImmediatePropagation() has to be handled internally because we manage the event list for
        // each element
        // note that originalElement may be a Bean#Event object in some situations
        Event.prototype.stopImmediatePropagation = function () {
          if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
          this.isImmediatePropagationStopped = function () { return true }
        }
        Event.prototype.isImmediatePropagationStopped = function () {
          return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
        }
        Event.prototype.clone = function (currentTarget) {
          //TODO: this is ripe for optimisation, new events are *expensive*
          // improving this will speed up delegated events
          var ne = new Event(this, this.element, this.isNative)
          ne.currentTarget = currentTarget
          return ne
        }

        return Event
      }())

      // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
    , targetElement = function (element, isNative) {
        return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
      }

      /**
        * Bean maintains an internal registry for event listeners. We don't touch elements, objects
        * or functions to identify them, instead we store everything in the registry.
        * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
        */
    , RegEntry = (function () {
        // each handler is wrapped so we can handle delegation and custom events
        var wrappedHandler = function (element, fn, condition, args) {
            var call = function (event, eargs) {
                  return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                }
              , findTarget = function (event, eventElement) {
                  return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                }
              , handler = condition
                  ? function (event) {
                      var target = findTarget(event, this) // deleated event
                      if (condition.apply(target, arguments)) {
                        if (event) event.currentTarget = target
                        return call(event, arguments)
                      }
                    }
                  : function (event) {
                      if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                      return call(event, arguments)
                    }
            handler.__beanDel = fn.__beanDel
            return handler
          }

        , RegEntry = function (element, type, handler, original, namespaces, args, root) {
            var customType     = customEvents[type]
              , isNative

            if (type == 'unload') {
              // self clean-up
              handler = once(removeListener, element, type, handler, original)
            }

            if (customType) {
              if (customType.condition) {
                handler = wrappedHandler(element, handler, customType.condition, args)
              }
              type = customType.base || type
            }

            this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
            this.customType    = !W3C_MODEL && !isNative && type
            this.element       = element
            this.type          = type
            this.original      = original
            this.namespaces    = namespaces
            this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
            this.target        = targetElement(element, isNative)
            this[eventSupport] = !!this.target[eventSupport]
            this.root          = root
            this.handler       = wrappedHandler(element, handler, null, args)
          }

        // given a list of namespaces, is our entry in any of them?
        RegEntry.prototype.inNamespaces = function (checkNamespaces) {
          var i, j, c = 0
          if (!checkNamespaces) return true
          if (!this.namespaces) return false
          for (i = checkNamespaces.length; i--;) {
            for (j = this.namespaces.length; j--;) {
              if (checkNamespaces[i] == this.namespaces[j]) c++
            }
          }
          return checkNamespaces.length === c
        }

        // match by element, original fn (opt), handler fn (opt)
        RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
          return this.element === checkElement &&
            (!checkOriginal || this.original === checkOriginal) &&
            (!checkHandler || this.handler === checkHandler)
        }

        return RegEntry
      }())

    , registry = (function () {
        // our map stores arrays by event type, just because it's better than storing
        // everything in a single array.
        // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
        // rootListeners so we can look them up fast
        var map = {}

          // generic functional search of our registry for matching listeners,
          // `fn` returns false to break out of the loop
          , forAll = function (element, type, original, handler, root, fn) {
              var pfx = root ? 'r' : '$'
              if (!type || type == '*') {
                // search the whole registry
                for (var t in map) {
                  if (t.charAt(0) == pfx) {
                    forAll(element, t.substr(1), original, handler, root, fn)
                  }
                }
              } else {
                var i = 0, l, list = map[pfx + type], all = element == '*'
                if (!list) return
                for (l = list.length; i < l; i++) {
                  if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                }
              }
            }

          , has = function (element, type, original, root) {
              // we're not using forAll here simply because it's a bit slower and this
              // needs to be fast
              var i, list = map[(root ? 'r' : '$') + type]
              if (list) {
                for (i = list.length; i--;) {
                  if (!list[i].root && list[i].matches(element, original, null)) return true
                }
              }
              return false
            }

          , get = function (element, type, original, root) {
              var entries = []
              forAll(element, type, original, null, root, function (entry) {
                return entries.push(entry)
              })
              return entries
            }

          , put = function (entry) {
              var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                , key = (entry.root ? 'r' : '$') + entry.type
              ;(map[key] || (map[key] = [])).push(entry)
              return has
            }

          , del = function (entry) {
              forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                list.splice(i, 1)
                entry.removed = true
                if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                return false
              })
            }

            // dump all entries, used for onunload
          , entries = function () {
              var t, entries = []
              for (t in map) {
                if (t.charAt(0) == '$') entries = entries.concat(map[t])
              }
              return entries
            }

        return { has: has, get: get, put: put, del: del, entries: entries }
      }())

      // we need a selector engine for delegated events, use querySelectorAll if it exists
      // but for older browsers we need Qwery, Sizzle or similar
    , selectorEngine
    , setSelectorEngine = function (e) {
        if (!arguments.length) {
          selectorEngine = doc.querySelectorAll
            ? function (s, r) {
                return r.querySelectorAll(s)
              }
            : function () {
                throw new Error('Bean: No selector engine installed') // eeek
              }
        } else {
          selectorEngine = e
        }
      }

      // we attach this listener to each DOM event that we need to listen to, only once
      // per event type per DOM element
    , rootListener = function (event, type) {
        if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return

        var listeners = registry.get(this, type || event.type, null, false)
          , l = listeners.length
          , i = 0

        event = new Event(event, this, true)
        if (type) event.type = type

        // iterate through all handlers registered for this type, calling them unless they have
        // been removed by a previous handler or stopImmediatePropagation() has been called
        for (; i < l && !event.isImmediatePropagationStopped(); i++) {
          if (!listeners[i].removed) listeners[i].handler.call(this, event)
        }
      }

      // add and remove listeners to DOM elements
    , listener = W3C_MODEL
        ? function (element, type, add) {
            // new browsers
            element[add ? addEvent : removeEvent](type, rootListener, false)
          }
        : function (element, type, add, custom) {
            // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
            // to simulate event bubbling etc.
            var entry
            if (add) {
              registry.put(entry = new RegEntry(
                  element
                , custom || type
                , function (event) { // handler
                    rootListener.call(element, event, custom)
                  }
                , rootListener
                , null
                , null
                , true // is root
              ))
              if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
              entry.target.attachEvent('on' + entry.eventType, entry.handler)
            } else {
              entry = registry.get(element, custom || type, rootListener, true)[0]
              if (entry) {
                entry.target.detachEvent('on' + entry.eventType, entry.handler)
                registry.del(entry)
              }
            }
          }

    , once = function (rm, element, type, fn, originalFn) {
        // wrap the handler in a handler that does a remove as well
        return function () {
          fn.apply(this, arguments)
          rm(element, type, originalFn)
        }
      }

    , removeListener = function (element, orgType, handler, namespaces) {
        var type     = orgType && orgType.replace(nameRegex, '')
          , handlers = registry.get(element, type, null, false)
          , removed  = {}
          , i, l

        for (i = 0, l = handlers.length; i < l; i++) {
          if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
            // TODO: this is problematic, we have a registry.get() and registry.del() that
            // both do registry searches so we waste cycles doing this. Needs to be rolled into
            // a single registry.forAll(fn) that removes while finding, but the catch is that
            // we'll be splicing the arrays that we're iterating over. Needs extra tests to
            // make sure we don't screw it up. @rvagg
            registry.del(handlers[i])
            if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
              removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
          }
        }
        // check each type/element for removed listeners and remove the rootListener where it's no longer needed
        for (i in removed) {
          if (!registry.has(element, removed[i].t, null, false)) {
            // last listener of this type, remove the rootListener
            listener(element, removed[i].t, false, removed[i].c)
          }
        }
      }

      // set up a delegate helper using the given selector, wrap the handler function
    , delegate = function (selector, fn) {
        //TODO: findTarget (therefore $) is called twice, once for match and once for
        // setting e.currentTarget, fix this so it's only needed once
        var findTarget = function (target, root) {
              var i, array = isString(selector) ? selectorEngine(selector, root) : selector
              for (; target && target !== root; target = target.parentNode) {
                for (i = array.length; i--;) {
                  if (array[i] === target) return target
                }
              }
            }
          , handler = function (e) {
              var match = findTarget(e.target, this)
              if (match) fn.apply(match, arguments)
            }

        // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
        handler.__beanDel = {
            ft       : findTarget // attach it here for customEvents to use too
          , selector : selector
        }
        return handler
      }

    , fireListener = W3C_MODEL ? function (isNative, type, element) {
        // modern browsers, do a proper dispatchEvent()
        var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
        evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
        element.dispatchEvent(evt)
      } : function (isNative, type, element) {
        // old browser use onpropertychange, just increment a custom property to trigger the event
        element = targetElement(element, isNative)
        isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
      }

      /**
        * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
        */

      /**
        * off(element[, eventType(s)[, handler ]])
        */
    , off = function (element, typeSpec, fn) {
        var isTypeStr = isString(typeSpec)
          , k, type, namespaces, i

        if (isTypeStr && typeSpec.indexOf(' ') > 0) {
          // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
          typeSpec = str2arr(typeSpec)
          for (i = typeSpec.length; i--;)
            off(element, typeSpec[i], fn)
          return element
        }

        type = isTypeStr && typeSpec.replace(nameRegex, '')
        if (type && customEvents[type]) type = customEvents[type].base

        if (!typeSpec || isTypeStr) {
          // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
          if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
          removeListener(element, type, fn, namespaces)
        } else if (isFunction(typeSpec)) {
          // off(el, fn)
          removeListener(element, null, typeSpec)
        } else {
          // off(el, { t1: fn1, t2, fn2 })
          for (k in typeSpec) {
            if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
          }
        }

        return element
      }

      /**
        * on(element, eventType(s)[, selector], handler[, args ])
        */
    , on = function(element, events, selector, fn) {
        var originalFn, type, types, i, args, entry, first

        //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
        if (selector === undefined && typeof events == 'object') {
          //TODO: this can't handle delegated events
          for (type in events) {
            if (events.hasOwnProperty(type)) {
              on.call(this, element, type, events[type])
            }
          }
          return
        }

        if (!isFunction(selector)) {
          // delegated event
          originalFn = fn
          args       = slice.call(arguments, 4)
          fn         = delegate(selector, originalFn, selectorEngine)
        } else {
          args       = slice.call(arguments, 3)
          fn         = originalFn = selector
        }

        types = str2arr(events)

        // special case for one(), wrap in a self-removing handler
        if (this === ONE) {
          fn = once(off, element, events, fn, originalFn)
        }

        for (i = types.length; i--;) {
          // add new handler to the registry and check if it's the first for this element/type
          first = registry.put(entry = new RegEntry(
              element
            , types[i].replace(nameRegex, '') // event type
            , fn
            , originalFn
            , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
            , args
            , false // not root
          ))
          if (entry[eventSupport] && first) {
            // first event of this type on this element, add root listener
            listener(element, entry.eventType, true, entry.customType)
          }
        }

        return element
      }

      /**
        * add(element[, selector], eventType(s), handler[, args ])
        *
        * Deprecated: kept (for now) for backward-compatibility
        */
    , add = function (element, events, fn, delfn) {
        return on.apply(
            null
          , !isString(fn)
              ? slice.call(arguments)
              : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
        )
      }

      /**
        * one(element, eventType(s)[, selector], handler[, args ])
        */
    , one = function () {
        return on.apply(ONE, arguments)
      }

      /**
        * fire(element, eventType(s)[, args ])
        *
        * The optional 'args' argument must be an array, if no 'args' argument is provided
        * then we can use the browser's DOM event system, otherwise we trigger handlers manually
        */
    , fire = function (element, type, args) {
        var types = str2arr(type)
          , i, j, l, names, handlers

        for (i = types.length; i--;) {
          type = types[i].replace(nameRegex, '')
          if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
          if (!names && !args && element[eventSupport]) {
            fireListener(nativeEvents[type], type, element)
          } else {
            // non-native event, either because of a namespace, arguments or a non DOM element
            // iterate over all listeners and manually 'fire'
            handlers = registry.get(element, type, null, false)
            args = [false].concat(args)
            for (j = 0, l = handlers.length; j < l; j++) {
              if (handlers[j].inNamespaces(names)) {
                handlers[j].handler.apply(element, args)
              }
            }
          }
        }
        return element
      }

      /**
        * clone(dstElement, srcElement[, eventType ])
        *
        * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
        */
    , clone = function (element, from, type) {
        var handlers = registry.get(from, type, null, false)
          , l = handlers.length
          , i = 0
          , args, beanDel

        for (; i < l; i++) {
          if (handlers[i].original) {
            args = [ element, handlers[i].type ]
            if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
            args.push(handlers[i].original)
            on.apply(null, args)
          }
        }
        return element
      }

    , bean = {
          on                : on
        , add               : add
        , one               : one
        , off               : off
        , remove            : off
        , clone             : clone
        , fire              : fire
        , Event             : Event
        , setSelectorEngine : setSelectorEngine
        , noConflict        : function () {
            context[name] = old
            return this
          }
      }

  // for IE, clean up on unload to avoid leaks
  if (win.attachEvent) {
    var cleanup = function () {
      var i, entries = registry.entries()
      for (i in entries) {
        if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
      }
      win.detachEvent('onunload', cleanup)
      win.CollectGarbage && win.CollectGarbage()
    }
    win.attachEvent('onunload', cleanup)
  }

  // initialize selector engine to internal default (qSA or throw Error)
  setSelectorEngine()

  return bean
});
},{}],14:[function(require,module,exports){
/*!
  * Bonzo: DOM Utility (c) Dustin Diaz 2012
  * https://github.com/ded/bonzo
  * License MIT
  */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('bonzo', this, function() {
  var win = window
    , doc = win.document
    , html = doc.documentElement
    , parentNode = 'parentNode'
    , specialAttributes = /^(checked|value|selected|disabled)$/i
      // tags that we have trouble inserting *into*
    , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
    , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
    , table = ['<table>', '</table>', 1]
    , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
    , option = ['<select>', '</select>', 1]
    , noscope = ['_', '', 0, 1]
    , tagMap = { // tags that we have trouble *inserting*
          thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
        , tr: ['<table><tbody>', '</tbody></table>', 2]
        , th: td , td: td
        , col: ['<table><colgroup>', '</colgroup></table>', 2]
        , fieldset: ['<form>', '</form>', 1]
        , legend: ['<form><fieldset>', '</fieldset></form>', 2]
        , option: option, optgroup: option
        , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
      }
    , stateAttributes = /^(checked|selected|disabled)$/
    , ie = /msie/i.test(navigator.userAgent)
    , hasClass, addClass, removeClass
    , uidMap = {}
    , uuids = 0
    , digit = /^-?[\d\.]+$/
    , dattr = /^data-(.+)$/
    , px = 'px'
    , setAttribute = 'setAttribute'
    , getAttribute = 'getAttribute'
    , byTag = 'getElementsByTagName'
    , features = function() {
        var e = doc.createElement('p')
        e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
        return {
          hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
        , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
        , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
        , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
        , transform: function () {
            var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
            for (i = 0; i < props.length; i++) {
              if (props[i] in e.style) return props[i]
            }
          }()
        , classList: 'classList' in e
        , opasity: function () {
            return typeof doc.createElement('a').style.opacity !== 'undefined'
          }()
        }
      }()
    , trimReplace = /(^\s*|\s*$)/g
    , whitespaceRegex = /\s+/
    , toString = String.prototype.toString
    , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
    , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
    , trim = String.prototype.trim ?
        function (s) {
          return s.trim()
        } :
        function (s) {
          return s.replace(trimReplace, '')
        }

    , getStyle = features.computedStyle
        ? function (el, property) {
            var value = null
              , computed = doc.defaultView.getComputedStyle(el, '')
            computed && (value = computed[property])
            return el.style[property] || value
          }
        : !(ie && html.currentStyle)
          ? function (el, property) {
              return el.style[property]
            }
          :
          /**
           * @param {Element} el
           * @param {string} property
           * @return {string|number}
           */
          function (el, property) {
            var val, value
            if (property == 'opacity' && !features.opasity) {
              val = 100
              try {
                val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
              } catch (e1) {
                try {
                  val = el['filters']('alpha').opacity
                } catch (e2) {}
              }
              return val / 100
            }
            value = el.currentStyle ? el.currentStyle[property] : null
            return el.style[property] || value
          }

  function isNode(node) {
    return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
  }


  function normalize(node, host, clone) {
    var i, l, ret
    if (typeof node == 'string') return bonzo.create(node)
    if (isNode(node)) node = [ node ]
    if (clone) {
      ret = [] // don't change original array
      for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
      return ret
    }
    return node
  }

  /**
   * @param {string} c a class name to test
   * @return {boolean}
   */
  function classReg(c) {
    return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @param {boolean=} opt_rev
   * @return {Bonzo|Array}
   */
  function each(ar, fn, opt_scope, opt_rev) {
    var ind, i = 0, l = ar.length
    for (; i < l; i++) {
      ind = opt_rev ? ar.length - i - 1 : i
      fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
    }
    return ar
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {Bonzo|Array}
   */
  function deepEach(ar, fn, opt_scope) {
    for (var i = 0, l = ar.length; i < l; i++) {
      if (isNode(ar[i])) {
        deepEach(ar[i].childNodes, fn, opt_scope)
        fn.call(opt_scope || ar[i], ar[i], i, ar)
      }
    }
    return ar
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }


  /**
   * @param {string} s
   * @return {string}
   */
  function decamelize(s) {
    return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
  }


  /**
   * @param {Element} el
   * @return {*}
   */
  function data(el) {
    el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
    var uid = el[getAttribute]('data-node-uid')
    return uidMap[uid] || (uidMap[uid] = {})
  }


  /**
   * removes the data associated with an element
   * @param {Element} el
   */
  function clearData(el) {
    var uid = el[getAttribute]('data-node-uid')
    if (uid) delete uidMap[uid]
  }


  function dataValue(d) {
    var f
    try {
      return (d === null || d === undefined) ? undefined :
        d === 'true' ? true :
          d === 'false' ? false :
            d === 'null' ? null :
              (f = parseFloat(d)) == d ? f : d;
    } catch(e) {}
    return undefined
  }


  /**
   * @param {Bonzo|Array} ar
   * @param {function(Object, number, (Bonzo|Array))} fn
   * @param {Object=} opt_scope
   * @return {boolean} whether `some`thing was found
   */
  function some(ar, fn, opt_scope) {
    for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
    return false
  }


  /**
   * this could be a giant enum of CSS properties
   * but in favor of file size sans-closure deadcode optimizations
   * we're just asking for any ol string
   * then it gets transformed into the appropriate style property for JS access
   * @param {string} p
   * @return {string}
   */
  function styleProperty(p) {
      (p == 'transform' && (p = features.transform)) ||
        (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
        (p == 'float' && (p = features.cssFloat))
      return p ? camelize(p) : null
  }

  // this insert method is intense
  function insert(target, host, fn, rev) {
    var i = 0, self = host || this, r = []
      // target nodes could be a css selector if it's a string and a selector engine is present
      // otherwise, just use target
      , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
    // normalize each node in case it's still a string and we need to create nodes on the fly
    each(normalize(nodes), function (t, j) {
      each(self, function (el) {
        fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
      }, null, rev)
    }, this, rev)
    self.length = i
    each(r, function (e) {
      self[--i] = e
    }, null, !rev)
    return self
  }


  /**
   * sets an element to an explicit x/y position on the page
   * @param {Element} el
   * @param {?number} x
   * @param {?number} y
   */
  function xy(el, x, y) {
    var $el = bonzo(el)
      , style = $el.css('position')
      , offset = $el.offset()
      , rel = 'relative'
      , isRel = style == rel
      , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]

    if (style == 'static') {
      $el.css('position', rel)
      style = rel
    }

    isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
    isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)

    x != null && (el.style.left = x - offset.left + delta[0] + px)
    y != null && (el.style.top = y - offset.top + delta[1] + px)

  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  if (features.classList) {
    hasClass = function (el, c) {
      return el.classList.contains(c)
    }
    addClass = function (el, c) {
      el.classList.add(c)
    }
    removeClass = function (el, c) {
      el.classList.remove(c)
    }
  }
  else {
    hasClass = function (el, c) {
      return classReg(c).test(el.className)
    }
    addClass = function (el, c) {
      el.className = trim(el.className + ' ' + c)
    }
    removeClass = function (el, c) {
      el.className = trim(el.className.replace(classReg(c), ' '))
    }
  }


  /**
   * this allows method calling for setting values
   *
   * @example
   * bonzo(elements).css('color', function (el) {
   *   return el.getAttribute('data-original-color')
   * })
   *
   * @param {Element} el
   * @param {function (Element)|string}
   * @return {string}
   */
  function setter(el, v) {
    return typeof v == 'function' ? v(el) : v
  }

  function scroll(x, y, type) {
    var el = this[0]
    if (!el) return this
    if (x == null && y == null) {
      return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
    }
    if (isBody(el)) {
      win.scrollTo(x, y)
    } else {
      x != null && (el.scrollLeft = x)
      y != null && (el.scrollTop = y)
    }
    return this
  }

  /**
   * @constructor
   * @param {Array.<Element>|Element|Node|string} elements
   */
  function Bonzo(elements) {
    this.length = 0
    if (elements) {
      elements = typeof elements !== 'string' &&
        !elements.nodeType &&
        typeof elements.length !== 'undefined' ?
          elements :
          [elements]
      this.length = elements.length
      for (var i = 0; i < elements.length; i++) this[i] = elements[i]
    }
  }

  Bonzo.prototype = {

      /**
       * @param {number} index
       * @return {Element|Node}
       */
      get: function (index) {
        return this[index] || null
      }

      // itetators
      /**
       * @param {function(Element|Node)} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , each: function (fn, opt_scope) {
        return each(this, fn, opt_scope)
      }

      /**
       * @param {Function} fn
       * @param {Object=} opt_scope
       * @return {Bonzo}
       */
    , deepEach: function (fn, opt_scope) {
        return deepEach(this, fn, opt_scope)
      }


      /**
       * @param {Function} fn
       * @param {Function=} opt_reject
       * @return {Array}
       */
    , map: function (fn, opt_reject) {
        var m = [], n, i
        for (i = 0; i < this.length; i++) {
          n = fn.call(this, this[i], i)
          opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
        }
        return m
      }

    // text and html inserters!

    /**
     * @param {string} h the HTML to insert
     * @param {boolean=} opt_text whether to set or get text content
     * @return {Bonzo|string}
     */
    , html: function (h, opt_text) {
        var method = opt_text
              ? html.textContent === undefined ? 'innerText' : 'textContent'
              : 'innerHTML'
          , that = this
          , append = function (el, i) {
              each(normalize(h, that, i), function (node) {
                el.appendChild(node)
              })
            }
          , updateElement = function (el, i) {
              try {
                if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                  return el[method] = h
                }
              } catch (e) {}
              append(el, i)
            }
        return typeof h != 'undefined'
          ? this.empty().each(updateElement)
          : this[0] ? this[0][method] : ''
      }

      /**
       * @param {string=} opt_text the text to set, otherwise this is a getter
       * @return {Bonzo|string}
       */
    , text: function (opt_text) {
        return this.html(opt_text, true)
      }

      // more related insertion methods

      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , append: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el.appendChild(i)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , prepend: function (node) {
        var that = this
        return this.each(function (el, i) {
          var first = el.firstChild
          each(normalize(node, that, i), function (i) {
            el.insertBefore(i, first)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , appendTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.appendChild(el)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , prependTo: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t.insertBefore(el, t.firstChild)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , before: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el)
          })
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , after: function (node) {
        var that = this
        return this.each(function (el, i) {
          each(normalize(node, that, i), function (i) {
            el[parentNode].insertBefore(i, el.nextSibling)
          }, null, 1)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertBefore: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          t[parentNode].insertBefore(el, t)
        })
      }


      /**
       * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , insertAfter: function (target, opt_host) {
        return insert.call(this, target, opt_host, function (t, el) {
          var sibling = t.nextSibling
          sibling ?
            t[parentNode].insertBefore(el, sibling) :
            t[parentNode].appendChild(el)
        }, 1)
      }


      /**
       * @param {Bonzo|string|Element|Array} node
       * @return {Bonzo}
       */
    , replaceWith: function (node) {
        bonzo(normalize(node)).insertAfter(this)
        return this.remove()
      }

      /**
       * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
       * @return {Bonzo}
       */
    , clone: function (opt_host) {
        var ret = [] // don't change original array
          , l, i
        for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
        return bonzo(ret)
      }

      // class management

      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , addClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          // we `each` here so you can do $el.addClass('foo bar')
          each(c, function (c) {
            if (c && !hasClass(el, setter(el, c)))
              addClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {Bonzo}
       */
    , removeClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c && hasClass(el, setter(el, c)))
              removeClass(el, setter(el, c))
          })
        })
      }


      /**
       * @param {string} c
       * @return {boolean}
       */
    , hasClass: function (c) {
        c = toString.call(c).split(whitespaceRegex)
        return some(this, function (el) {
          return some(c, function (c) {
            return c && hasClass(el, c)
          })
        })
      }


      /**
       * @param {string} c classname to toggle
       * @param {boolean=} opt_condition whether to add or remove the class straight away
       * @return {Bonzo}
       */
    , toggleClass: function (c, opt_condition) {
        c = toString.call(c).split(whitespaceRegex)
        return this.each(function (el) {
          each(c, function (c) {
            if (c) {
              typeof opt_condition !== 'undefined' ?
                opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
            }
          })
        })
      }

      // display togglers

      /**
       * @param {string=} opt_type useful to set back to anything other than an empty string
       * @return {Bonzo}
       */
    , show: function (opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : ''
        return this.each(function (el) {
          el.style.display = opt_type
        })
      }


      /**
       * @return {Bonzo}
       */
    , hide: function () {
        return this.each(function (el) {
          el.style.display = 'none'
        })
      }


      /**
       * @param {Function=} opt_callback
       * @param {string=} opt_type
       * @return {Bonzo}
       */
    , toggle: function (opt_callback, opt_type) {
        opt_type = typeof opt_type == 'string' ? opt_type : '';
        typeof opt_callback != 'function' && (opt_callback = null)
        return this.each(function (el) {
          el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
          opt_callback && opt_callback.call(el)
        })
      }


      // DOM Walkers & getters

      /**
       * @return {Element|Node}
       */
    , first: function () {
        return bonzo(this.length ? this[0] : [])
      }


      /**
       * @return {Element|Node}
       */
    , last: function () {
        return bonzo(this.length ? this[this.length - 1] : [])
      }


      /**
       * @return {Element|Node}
       */
    , next: function () {
        return this.related('nextSibling')
      }


      /**
       * @return {Element|Node}
       */
    , previous: function () {
        return this.related('previousSibling')
      }


      /**
       * @return {Element|Node}
       */
    , parent: function() {
        return this.related(parentNode)
      }


      /**
       * @private
       * @param {string} method the directional DOM method
       * @return {Element|Node}
       */
    , related: function (method) {
        return bonzo(this.map(
          function (el) {
            el = el[method]
            while (el && el.nodeType !== 1) {
              el = el[method]
            }
            return el || 0
          },
          function (el) {
            return el
          }
        ))
      }


      /**
       * @return {Bonzo}
       */
    , focus: function () {
        this.length && this[0].focus()
        return this
      }


      /**
       * @return {Bonzo}
       */
    , blur: function () {
        this.length && this[0].blur()
        return this
      }

      // style getter setter & related methods

      /**
       * @param {Object|string} o
       * @param {string=} opt_v
       * @return {Bonzo|string}
       */
    , css: function (o, opt_v) {
        var p, iter = o
        // is this a request for just getting a style?
        if (opt_v === undefined && typeof o == 'string') {
          // repurpose 'v'
          opt_v = this[0]
          if (!opt_v) return null
          if (opt_v === doc || opt_v === win) {
            p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
            return o == 'width' ? p.width : o == 'height' ? p.height : ''
          }
          return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
        }

        if (typeof o == 'string') {
          iter = {}
          iter[o] = opt_v
        }

        if (!features.opasity && 'opacity' in iter) {
          // oh this 'ol gamut
          iter.filter = iter.opacity != null && iter.opacity !== ''
            ? 'alpha(opacity=' + (iter.opacity * 100) + ')'
            : ''
          // give it layout
          iter.zoom = o.zoom || 1
          ;delete iter.opacity
        }

        function fn(el, p, v) {
          for (var k in iter) {
            if (iter.hasOwnProperty(k)) {
              v = iter[k];
              // change "5" to "5px" - unless you're line-height, which is allowed
              (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
              try { el.style[p] = setter(el, v) } catch(e) {}
            }
          }
        }
        return this.each(fn)
      }


      /**
       * @param {number=} opt_x
       * @param {number=} opt_y
       * @return {Bonzo|number}
       */
    , offset: function (opt_x, opt_y) {
        if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
          return this.each(function (el) {
            xy(el, opt_x.left, opt_x.top)
          })
        } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
          return this.each(function (el) {
            xy(el, opt_x, opt_y)
          })
        }
        if (!this[0]) return {
            top: 0
          , left: 0
          , height: 0
          , width: 0
        }
        var el = this[0]
          , de = el.ownerDocument.documentElement
          , bcr = el.getBoundingClientRect()
          , scroll = getWindowScroll()
          , width = el.offsetWidth
          , height = el.offsetHeight
          , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
          , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)

        return {
            top: top
          , left: left
          , height: height
          , width: width
        }
      }


      /**
       * @return {number}
       */
    , dim: function () {
        if (!this.length) return { height: 0, width: 0 }
        var el = this[0]
          , de = el.nodeType == 9 && el.documentElement // document
          , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
             // el isn't visible, can't be measured properly, so fix that
             function (t) {
               var s = {
                   position: el.style.position || ''
                 , visibility: el.style.visibility || ''
                 , display: el.style.display || ''
               }
               t.first().css({
                   position: 'absolute'
                 , visibility: 'hidden'
                 , display: 'block'
               })
               return s
            }(this) : null
          , width = de
              ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
              : el.offsetWidth
          , height = de
              ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
              : el.offsetHeight

        orig && this.first().css(orig)
        return {
            height: height
          , width: width
        }
      }

      // attributes are hard. go shopping

      /**
       * @param {string} k an attribute to get or set
       * @param {string=} opt_v the value to set
       * @return {Bonzo|string}
       */
    , attr: function (k, opt_v) {
        var el = this[0]
          , n

        if (typeof k != 'string' && !(k instanceof String)) {
          for (n in k) {
            k.hasOwnProperty(n) && this.attr(n, k[n])
          }
          return this
        }

        return typeof opt_v == 'undefined' ?
          !el ? null : specialAttributes.test(k) ?
            stateAttributes.test(k) && typeof el[k] == 'string' ?
              true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                el[getAttribute](k, 2) : el[getAttribute](k) :
          this.each(function (el) {
            specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
          })
      }


      /**
       * @param {string} k
       * @return {Bonzo}
       */
    , removeAttr: function (k) {
        return this.each(function (el) {
          stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
        })
      }


      /**
       * @param {string=} opt_s
       * @return {Bonzo|string}
       */
    , val: function (s) {
        return (typeof s == 'string' || typeof s == 'number') ?
          this.attr('value', s) :
          this.length ? this[0].value : null
      }

      // use with care and knowledge. this data() method uses data attributes on the DOM nodes
      // to do this differently costs a lot more code. c'est la vie
      /**
       * @param {string|Object=} opt_k the key for which to get or set data
       * @param {Object=} opt_v
       * @return {Bonzo|Object}
       */
    , data: function (opt_k, opt_v) {
        var el = this[0], o, m
        if (typeof opt_v === 'undefined') {
          if (!el) return null
          o = data(el)
          if (typeof opt_k === 'undefined') {
            each(el.attributes, function (a) {
              (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
            })
            return o
          } else {
            if (typeof o[opt_k] === 'undefined')
              o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
            return o[opt_k]
          }
        } else {
          return this.each(function (el) { data(el)[opt_k] = opt_v })
        }
      }

      // DOM detachment & related

      /**
       * @return {Bonzo}
       */
    , remove: function () {
        this.deepEach(clearData)
        return this.detach()
      }


      /**
       * @return {Bonzo}
       */
    , empty: function () {
        return this.each(function (el) {
          deepEach(el.childNodes, clearData)

          while (el.firstChild) {
            el.removeChild(el.firstChild)
          }
        })
      }


      /**
       * @return {Bonzo}
       */
    , detach: function () {
        return this.each(function (el) {
          el[parentNode] && el[parentNode].removeChild(el)
        })
      }

      // who uses a mouse anyway? oh right.

      /**
       * @param {number} y
       */
    , scrollTop: function (y) {
        return scroll.call(this, null, y, 'y')
      }


      /**
       * @param {number} x
       */
    , scrollLeft: function (x) {
        return scroll.call(this, x, null, 'x')
      }

  }


  function cloneNode(host, el) {
    var c = el.cloneNode(true)
      , cloneElems
      , elElems
      , i

    // check for existence of an event cloner
    // preferably https://github.com/fat/bean
    // otherwise Bonzo won't do this for you
    if (host.$ && typeof host.cloneEvents == 'function') {
      host.$(c).cloneEvents(el)

      // clone events from every child node
      cloneElems = host.$(c).find('*')
      elElems = host.$(el).find('*')

      for (i = 0; i < elElems.length; i++)
        host.$(cloneElems[i]).cloneEvents(elElems[i])
    }
    return c
  }

  function isBody(element) {
    return element === win || (/^(?:body|html)$/i).test(element.tagName)
  }

  function getWindowScroll() {
    return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
  }

  function createScriptFromHtml(html) {
    var scriptEl = document.createElement('script')
      , matches = html.match(simpleScriptTagRe)
    scriptEl.src = matches[1]
    return scriptEl
  }

  /**
   * @param {Array.<Element>|Element|Node|string} els
   * @return {Bonzo}
   */
  function bonzo(els) {
    return new Bonzo(els)
  }

  bonzo.setQueryEngine = function (q) {
    query = q;
    delete bonzo.setQueryEngine
  }

  bonzo.aug = function (o, target) {
    // for those standalone bonzo users. this love is for you.
    for (var k in o) {
      o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
    }
  }

  bonzo.create = function (node) {
    // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
    return typeof node == 'string' && node !== '' ?
      function () {
        if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
        var tag = node.match(/^\s*<([^\s>]+)/)
          , el = doc.createElement('div')
          , els = []
          , p = tag ? tagMap[tag[1].toLowerCase()] : null
          , dep = p ? p[2] + 1 : 1
          , ns = p && p[3]
          , pn = parentNode
          , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)

        el.innerHTML = p ? (p[0] + node + p[1]) : node
        while (dep--) el = el.firstChild
        // for IE NoScope, we may insert cruft at the begining just to get it to work
        if (ns && el && el.nodeType !== 1) el = el.nextSibling
        do {
          // tbody special case for IE<8, creates tbody on any empty table
          // we don't want it if we're just after a <thead>, <caption>, etc.
          if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
            els.push(el)
          }
        } while (el = el.nextSibling)
        // IE < 9 gives us a parentNode which messes up insert() check for cloning
        // `dep` > 1 can also cause problems with the insert() check (must do this last)
        each(els, function(el) { el[pn] && el[pn].removeChild(el) })
        return els
      }() : isNode(node) ? [node.cloneNode(true)] : []
  }

  bonzo.doc = function () {
    var vp = bonzo.viewport()
    return {
        width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
      , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
    }
  }

  bonzo.firstChild = function (el) {
    for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
      if (c[i].nodeType === 1) e = c[j = i]
    }
    return e
  }

  bonzo.viewport = function () {
    return {
        width: ie ? html.clientWidth : self.innerWidth
      , height: ie ? html.clientHeight : self.innerHeight
    }
  }

  bonzo.isAncestor = 'compareDocumentPosition' in html ?
    function (container, element) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (container, element) {
      return container !== element && container.contains(element);
    } :
    function (container, element) {
      while (element = element[parentNode]) {
        if (element === container) {
          return true
        }
      }
      return false
    }

  return bonzo
}); // the only line we care about using a semi-colon. placed here for concatenation tools

},{}],15:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],16:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
    , loaded = loadedRgx.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})
},{}],17:[function(require,module,exports){
var inserted = [];

module.exports = function (css) {
    if (inserted.indexOf(css) >= 0) return;
    inserted.push(css);
    
    var elem = document.createElement('style');
    var text = document.createTextNode(css);
    elem.appendChild(text);
    
    if (document.head.childNodes.length) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(elem);
    }
};

},{}],18:[function(require,module,exports){
/*!
  * @preserve Qwery - A Blazing Fast query selector engine
  * https://github.com/ded/qwery
  * copyright Dustin Diaz 2012
  * MIT License
  */

(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('qwery', this, function () {
  var doc = document
    , html = doc.documentElement
    , byClass = 'getElementsByClassName'
    , byTag = 'getElementsByTagName'
    , qSA = 'querySelectorAll'
    , useNativeQSA = 'useNativeQSA'
    , tagName = 'tagName'
    , nodeType = 'nodeType'
    , select // main select() method, assign later

    , id = /#([\w\-]+)/
    , clas = /\.[\w\-]+/g
    , idOnly = /^#([\w\-]+)$/
    , classOnly = /^\.([\w\-]+)$/
    , tagOnly = /^([\w\-]+)$/
    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
    , splittable = /(^|,)\s*[>~+]/
    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
    , splitters = /[\s\>\+\~]/
    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
    , tokenizr = new RegExp(splitters.source + splittersMore.source)
    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

  var walker = {
      ' ': function (node) {
        return node && node !== html && node.parentNode
      }
    , '>': function (node, contestant) {
        return node && node.parentNode == contestant.parentNode && node.parentNode
      }
    , '~': function (node) {
        return node && node.previousSibling
      }
    , '+': function (node, contestant, p1, p2) {
        if (!node) return false
        return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
      }
    }

  function cache() {
    this.c = {}
  }
  cache.prototype = {
    g: function (k) {
      return this.c[k] || undefined
    }
  , s: function (k, v, r) {
      v = r ? new RegExp(v) : v
      return (this.c[k] = v)
    }
  }

  var classCache = new cache()
    , cleanCache = new cache()
    , attrCache = new cache()
    , tokenCache = new cache()

  function classRegex(c) {
    return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
  }

  // not quite as fast as inline loops in older browsers so don't use liberally
  function each(a, fn) {
    var i = 0, l = a.length
    for (; i < l; i++) fn(a[i])
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
    return r
  }

  function arrayify(ar) {
    var i = 0, l = ar.length, r = []
    for (; i < l; i++) r[i] = ar[i]
    return r
  }

  function previous(n) {
    while (n = n.previousSibling) if (n[nodeType] == 1) break;
    return n
  }

  function q(query) {
    return query.match(chunker)
  }

  // called using `this` as element and arguments from regex group results.
  // given => div.hello[title="world"]:foo('bar')
  // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
  function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
    var i, m, k, o, classes
    if (this[nodeType] !== 1) return false
    if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
    if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
    if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
          return this
        }
      }
    }
    if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
      // select is for attrib equality
      return false
    }
    return this
  }

  function clean(s) {
    return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
  }

  function checkAttr(qualify, actual, val) {
    switch (qualify) {
    case '=':
      return actual == val
    case '^=':
      return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
    case '$=':
      return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
    case '*=':
      return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
    case '~=':
      return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
    case '|=':
      return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
    }
    return 0
  }

  // given a selector, first check for simple cases then collect all base candidate matches and filter
  function _qwery(selector, _root) {
    var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

    if (!tokens.length) return r

    token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
    if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
    if (!root) return r

    intr = q(token)
    // collect base candidates to filter
    els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
        while (root = root.nextSibling) {
          root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
        }
        return r
      }([]) :
      root[byTag](intr[1] || '*')
    // filter elements according to the right-most part of the selector
    for (i = 0, l = els.length; i < l; i++) {
      if (item = interpret.apply(els[i], intr)) r[r.length] = item
    }
    if (!tokens.length) return r

    // filter further according to the rest of the selector (the left side)
    each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
    return ret
  }

  // compare element to a selector
  function is(el, selector, root) {
    if (isNode(selector)) return el == selector
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

    var selectors = selector.split(','), tokens, dividedTokens
    while (selector = selectors.pop()) {
      tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      dividedTokens = selector.match(dividers)
      tokens = tokens.slice(0) // copy array
      if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
        return true
      }
    }
    return false
  }

  // given elements matching the right-most part of a selector, filter out any that don't match the rest
  function ancestorMatch(el, tokens, dividedTokens, root) {
    var cand
    // recursively work backwards through the tokens and up the dom, covering all options
    function crawl(e, i, p) {
      while (p = walker[dividedTokens[i]](p, e)) {
        if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
          if (i) {
            if (cand = crawl(p, i - 1, p)) return cand
          } else return p
        }
      }
    }
    return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
  }

  function isNode(el, t) {
    return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
  }

  function uniq(ar) {
    var a = [], i, j;
    o:
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
      a[a.length] = ar[i]
    }
    return a
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length))
  }

  function normalizeRoot(root) {
    if (!root) return doc
    if (typeof root == 'string') return qwery(root)[0]
    if (!root[nodeType] && arrayLike(root)) return root[0]
    return root
  }

  function byId(root, id, el) {
    // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
    return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
  }

  function qwery(selector, _root) {
    var m, el, root = normalizeRoot(_root)

    // easy, fast cases that we can dispatch with simple DOM calls
    if (!root || !selector) return []
    if (selector === window || isNode(selector)) {
      return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
    }
    if (selector && arrayLike(selector)) return flatten(selector)
    if (m = selector.match(easy)) {
      if (m[1]) return (el = byId(root, m[1])) ? [el] : []
      if (m[2]) return arrayify(root[byTag](m[2]))
      if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
    }

    return select(selector, root)
  }

  // where the root is not document and a relationship selector is first we have to
  // do some awkward adjustments to get it to work, even with qSA
  function collectSelector(root, collector) {
    return function (s) {
      var oid, nid
      if (splittable.test(s)) {
        if (root[nodeType] !== 9) {
          // make sure the el has an id, rewrite the query, set root to doc and run it
          if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
          s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
          collector(root.parentNode || root, s, true)
          oid || root.removeAttribute('id')
        }
        return;
      }
      s.length && collector(root, s, false)
    }
  }

  var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
      container = container[nodeType] === 9 || container == window ? html : container
      return container !== element && container.contains(element)
    } :
    function (element, container) {
      while (element = element.parentNode) if (element === container) return 1
      return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
          return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
    }()
  , hasByClass = !!doc[byClass]
    // has native qSA support
  , hasQSA = doc.querySelector && doc[qSA]
    // use native qSA
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
        if (root[nodeType] === 9 || !splittable.test(selector)) {
          // most work is done right here, defer to qSA
          return arrayify(root[qSA](selector))
        }
        // special case where we need the services of `collectSelector()`
        each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
          e = ctx[qSA](s)
          if (e.length == 1) result[result.length] = e.item(0)
          else if (e.length) result = result.concat(arrayify(e))
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
    }
    // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
        r = classRegex(m[2])
        items = root[byTag](m[1] || '*')
        for (i = 0, l = items.length; i < l; i++) {
          if (r.test(items[i].className)) result[result.length] = items[i]
        }
        return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
        r = _qwery(s, ctx)
        for (i = 0, l = r.length; i < l; i++) {
          if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
        }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
    }
  , configure = function (options) {
      // configNativeQSA: use fully-internal selector or native qSA where present
      if (typeof options[useNativeQSA] !== 'undefined')
        select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
    }

  configure({ useNativeQSA: true })

  qwery.configure = configure
  qwery.uniq = uniq
  qwery.is = is
  qwery.pseudos = {}

  return qwery
});

},{}],19:[function(require,module,exports){
module.exports=(function() {var t = function anonymous(locals, filters, escape) {
escape = escape || function (html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('<div class="mode signin">\n    <div class="popup">\n      	<div class="overlay">\n        	<div id="onestep" class="panel onestep">\n          		<header class="header">\n            		<div class="image" style="display: none">\n            			<img src="">\n            		</div>\n            		<h1>Sign In</h1>\n		            <h2 class="error" style="display: none">&nbsp;</h2>\n		            <h2 class="success" style="display: none">&nbsp;</h2>\n		            <a class="close">Close</a>\n          		</header>\n\n          		<div class="loggedin">\n		            <form>\n						<span class="centered last-time"></span>\n						<div class="strategy"></div>\n						<div class="emailPassword" style="display:none">\n							<div class="email">\n								<span class="email-readonly"></span>\n								<input name="email" type="email" value="" disabled placeholder="Email" title="Email" style="display:none">\n							</div>\n							<div class="password">\n								<input name="password" type="password" value="" autofocus placeholder="Password" title="Password">\n							</div>\n							<div class="action">\n								<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n							  	<button type="submit" class="spinner" style="display: none"></button>\n							  	<label class="create-account"><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n							</div>\n						</div>\n						<span class="centered all">Show all</span>\n		            </form>\n          		</div>\n\n	          	<div class="notloggedin">\n		            <form>\n		            	<div class="iconlist" style="display: none"><p style="display:none">... or sign in using</p></div>\n		              	<div class="separator" style="display: none"><span>or</span></div>\n		              	<div class="emailPassword">\n		                	<div class="email">\n		                  		<input name="email" id="signin_easy_email" type="email" required placeholder="Email" title="Email">\n		                	</div>\n		                	<div class="password" style="display:none">\n		                  		<input name="password" id="signin_easy_password" type="password" placeholder="Password" title="Password">\n		                	</div>\n			                <div class="action">\n			                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign In</button>\n			                  	<button type="submit" class="spinner" style="display: none"></button>\n			                  	<label class="create-account"><a href="javascript: {}" class="sign-up">Sign Up</a><span class="divider" style="display:none">&nbsp;•&nbsp;</span><a href="javascript: {}" class="forgot-pass">Forgot your password?</a></label>\n			                </div>\n		              	</div>\n		            </form>\n	          	</div>\n\n	          	<div class="signup">\n		            <form>\n		              	<div class="header"></div>\n		              	<div class="emailPassword">\n		                	<div class="email">\n		                  		<input name="email" id="signup_easy_email" type="email" value="" required placeholder="Email" title="Email">\n		                	</div>\n		                	<div class="password">\n		                  		<input name="password" id="signup_easy_password" type="password" value="" required placeholder="Create a Password" title="Password">\n		                	</div>\n			                <div class="action">\n			                  	<button type="submit" class="zocial primary next" style="width: 100%;">Sign Up</button>\n			                  	<button type="submit" class="spinner" style="display: none"></button>\n			                  	<div class="footer"></div>\n			                  	<div class="options">\n			                    	<a href="javascript: {}" class="centered cancel">Cancel</a>\n			                  	</div>\n			                </div>\n		              	</div>\n		            </form>\n	          	</div>\n\n				<div class="reset">\n					<form id="change_password">\n					  	<div class="header"></div>\n					  	<div class="emailPassword">\n					    	<div class="email">\n					      		<input name="email" id="reset_easy_email" type="email" value="" required placeholder="Email" title="Email">\n					    	</div>\n					    	<div class="password">\n					      		<input name="password" id="reset_easy_password" type="password" value="" required placeholder="New Password" title="New Password">\n					    	</div>\n					    	<div class="repeatPassword">\n					      		<input name="repeat_password" id="reset_easy_repeat_password" type="password" value="" required placeholder="Confirm New Password" title="Confirm New Password">\n					    	</div>\n					    	<div class="action">\n					      		<button type="submit" class="zocial primary next" style="width: 100%;">Send</button>\n					      		<button type="submit" class="spinner" style="display: none"></button>\n					      		<div class="options">\n					        		<a href="javascript: {}" class="centered cancel">Cancel</a>\n					      		</div>\n					    	</div>\n					  	</div>\n					</form>\n				</div>\n				\n          		<footer>\n            		<span>Powered by <a href="http://auth0.com" target="_new">Auth0</a></span>\n          		</footer>\n        	</div>\n      	</div>\n    </div>\n</div>\n'); })();
} 
return buf.join('');
}; return function(l) { return t(l) }}())
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvTG9naW5FcnJvci5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvYXNzZXJ0X3JlcXVpcmVkLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL2xpYi9iYXNlNjRfdXJsX2RlY29kZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvanNvbl9wYXJzZS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9saWIvdXNlX2pzb25wLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9CYXNlNjQvYmFzZTY0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9qc29ucC9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvanNvbnAvbm9kZV9tb2R1bGVzL2RlYnVnL2RlYnVnLmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2F1dGgwLWpzL25vZGVfbW9kdWxlcy9xcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9hdXRoMC1qcy9ub2RlX21vZHVsZXMvcmVxd2VzdC9yZXF3ZXN0LmpzIiwiL1VzZXJzL3NlYmFzL0RvY3VtZW50cy9Qcm9qZWN0cy9hdXRoMC13aWRnZXQuanMvbm9kZV9tb2R1bGVzL2JlYW4vYmVhbi5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9ib256by9ib256by5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvZG9tcmVhZHkvcmVhZHkuanMiLCIvVXNlcnMvc2ViYXMvRG9jdW1lbnRzL1Byb2plY3RzL2F1dGgwLXdpZGdldC5qcy9ub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL25vZGVfbW9kdWxlcy9xd2VyeS9xd2VyeS5qcyIsIi9Vc2Vycy9zZWJhcy9Eb2N1bWVudHMvUHJvamVjdHMvYXV0aDAtd2lkZ2V0LmpzL3dpZGdldC9odG1sL2xvZ2luLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0akJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqb0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTt2YXIgZG9tcmVhZHkgID0gcmVxdWlyZSgnZG9tcmVhZHknKTtcbnZhciBBdXRoMCAgICAgPSByZXF1aXJlKCdhdXRoMC1qcycpO1xudmFyIHF3ZXJ5ICAgICA9IHJlcXVpcmUoJ3F3ZXJ5Jyk7XG52YXIgYm9uem8gICAgID0gcmVxdWlyZSgnYm9uem8nKTtcbnZhciBiZWFuICAgICAgPSByZXF1aXJlKCdiZWFuJyk7XG52YXIgZnMgICAgICAgID0gcmVxdWlyZSgnZnMnKTtcbnZhciBpbnNlcnRDc3MgPSByZXF1aXJlKCdpbnNlcnQtY3NzJyk7XG5cbnZhciBsb2dpblRtcGwgPSByZXF1aXJlKCcuL3dpZGdldC9odG1sL2xvZ2luLmh0bWwnKTtcblxuZG9tcmVhZHkoZnVuY3Rpb24gKCkge1xuICB2YXIgX29wdGlvbnMgPSB7XG4gICAgZG9tYWluOiAgICAgICdtZG9jcy5hdXRoMC5jb20nLFxuICAgIGNsaWVudElEOiAgICAnMEhQNzFHU2Q2UHVvUllKM0RYS2RpWENVVWRHbUJidXAnLCBcbiAgICBjYWxsYmFja1VSTDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8nXG4gIH07XG5cbiAgdmFyIGF1dGgwID0gQXV0aDAoe1xuICAgIGNsaWVudElEOiAgICAgX29wdGlvbnMuY2xpZW50SUQsIFxuICAgIGNhbGxiYWNrVVJMOiAgX29wdGlvbnMuY2FsbGJhY2tVUkwsXG4gICAgZG9tYWluOiAgICAgICBfb3B0aW9ucy5kb21haW5cbiAgfSk7XG5cbiAgdmFyIF9zdHJhdGVnaWVzID0ge1xuICAgICdnb29nbGUtb3BlbmlkJzogeyBjc3M6ICdnb29nbGUnLCBuYW1lOiAnR29vZ2xlIE9wZW5JZCcsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdnb29nbGUtYXBwcyc6IHsgY3NzOiAnZ29vZ2xlJywgbmFtZTogJ0dvb2dsZSBBcHBzJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdnb29nbGUtb2F1dGgyJzogeyBjc3M6ICdnb29nbGVwbHVzJywgbmFtZTogJ0dvb2dsZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdmYWNlYm9vayc6IHsgY3NzOiAnZmFjZWJvb2snLCBuYW1lOiAnRmFjZWJvb2snLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnd2luZG93c2xpdmUnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnTWljcm9zb2Z0IEFjY291bnQnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnbGlua2VkaW4nOiB7IGNzczogJ2xpbmtlZGluJywgbmFtZTogJ0xpbmtlZEluJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2dpdGh1Yic6IHsgY3NzOiAnZ2l0aHViJywgbmFtZTogJ0dpdEh1YicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICdwYXlwYWwnOiB7IGNzczogJ3BheXBhbCcsIG5hbWU6ICdQYXlQYWwnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAndHdpdHRlcic6IHsgY3NzOiAndHdpdHRlcicsIG5hbWU6ICdUd2l0dGVyJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2FtYXpvbic6IHsgY3NzOiAnYW1hem9uJywgbmFtZTogJ0FtYXpvbicsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd2a29udGFrdGUnOiB7IGNzczogJ3ZrJywgbmFtZTogJ3ZLb250YWt0ZScsIHNvY2lhbDogdHJ1ZSB9LFxuICAgICd5YW5kZXgnOiB7IGNzczogJ3lhbmRleCcsIG5hbWU6ICdZYW5kZXgnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnb2ZmaWNlMzY1JzogeyBjc3M6ICdvZmZpY2UzNjUnLCBuYW1lOiAnT2ZmaWNlMzY1Jywgc29jaWFsOiBmYWxzZSB9LFxuICAgICd3YWFkJzogeyBjc3M6ICd3YWFkJywgbmFtZTogJ1dpbmRvd3MgQXp1cmUgQUQnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkZnMnOiB7IGNzczogJ3dpbmRvd3MnLCBuYW1lOiAnQURGUycsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnc2FtbHAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ1NBTUwnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ21zY3JtJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdEeW5hbWljcyBDUk0nLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ2FkJzogeyBjc3M6ICd3aW5kb3dzJywgbmFtZTogJ0FEIC8gTERBUCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnY3VzdG9tJzogeyBjc3M6ICdndWVzdCcsIG5hbWU6ICdDdXN0b20gQXV0aCcsIHNvY2lhbDogZmFsc2UgfSxcbiAgICAnYXV0aDAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0F1dGgwJywgc29jaWFsOiBmYWxzZSB9LFxuICAgICdhdXRoMC1hZGxkYXAnOiB7IGNzczogJ2d1ZXN0JywgbmFtZTogJ0FEL0xEQVAnLCBzb2NpYWw6IGZhbHNlIH0sXG4gICAgJ3RoaXJ0eXNldmVuc2lnbmFscyc6IHsgY3NzOiAndGhpcnR5c2V2ZW5zaWduYWxzJywgbmFtZTogJzM3IFNpZ25hbHMnLCBzb2NpYWw6IHRydWUgfSxcbiAgICAnYm94JzogeyBjc3M6ICdib3gnLCBuYW1lOiAnQm94Jywgc29jaWFsOiB0cnVlLCBpbWFnZWljb246IHRydWUgfSxcbiAgICAnc2FsZXNmb3JjZSc6IHsgY3NzOiAnc2FsZXNmb3JjZScsIG5hbWU6ICdTYWxlc2ZvcmNlJywgc29jaWFsOiB0cnVlIH0sXG4gICAgJ2ZpdGJpdCc6IHsgY3NzOiAnZml0Yml0JywgbmFtZTogJ0ZpdGJpdCcsIHNvY2lhbDogdHJ1ZSB9XG4gIH07XG5cbiAgdmFyIF9hdXRoMFN0cmF0ZWd5LCBfYXV0aDBDb25uZWN0aW9uUGFyYW1zLCBfaGFzTG9nZ2VkSW5CZWZvcmUsIF9zc29EYXRhO1xuICB2YXIgX2NsaWVudCA9IHtcbiAgICBzdHJhdGVnaWVzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdnb29nbGUtb2F1dGgyJyxcbiAgICAgICAgc29jaWFsOiB0cnVlLFxuICAgICAgICBjb25uZWN0aW9uczogW1xuICAgICAgICAgIHsgZG9tYWluOiAnJywgbmFtZTogJ2dvb2dsZS1vYXV0aDInIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2dpdGh1YicsXG4gICAgICAgIHNvY2lhbDogdHJ1ZSxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtcbiAgICAgICAgICB7IGRvbWFpbjogJycsIG5hbWU6ICdnaXRodWInIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2F1dGgwJyxcbiAgICAgICAgY29ubmVjdGlvbnM6IFtcbiAgICAgICAgICB7IGRvbWFpbjogJycsIG5hbWU6ICdVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbicgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIC8vIGhlbHBlciBtZXRob2RzXG4gIHZhciAkID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgcmV0dXJuIGJvbnpvKHF3ZXJ5KHNlbGVjdG9yLCByb290KSk7XG4gIH07XG5cbiAgdmFyIF9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICBnbG9iYWwud2luZG93LmxvY2F0aW9uID0gdXJsO1xuICB9O1xuXG4gIHZhciBfc2V0VG9wID0gZnVuY3Rpb24gKG9uVG9wLCBlbGVtZW50KSB7XG4gICAgaWYgKCFvblRvcCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZWxlbWVudC5jc3Moe1xuICAgICAgICAgICdtYXJnaW5Ub3AnOiAnLScgKyAoZWxlbWVudC5vZmZzZXQoKS5oZWlnaHQgLyAyKSArICdweCcsXG4gICAgICAgICAgJ3RvcCc6ICc1MCUnXG4gICAgICAgIH0pO1xuICAgICAgfSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY3NzKHtcbiAgICAgICAgJ21hcmdpblRvcCc6ICcycHgnLFxuICAgICAgICAndG9wJzogJzAnXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9zaG93RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcuc2lnbmluIC5zdWNjZXNzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcuc2lnbmluIC5lcnJvcicpLmh0bWwoZXJyb3IpLmNzcygnZGlzcGxheScsICcnKTtcbiAgfTtcblxuICB2YXIgX3Nob3dTdWNjZXNzID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAkKCcuc2lnbmluIGgxJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcuc2lnbmluIC5lcnJvcicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgJCgnLnNpZ25pbiAuc3VjY2VzcycpLmh0bWwobWVzc2FnZSkuY3NzKCdkaXNwbGF5JywgJycpO1xuICB9O1xuXG4gIHZhciBfaXNBdXRoMENvbm4gPSBmdW5jdGlvbiAoc3RyYXRlZ3kpIHtcbiAgICByZXR1cm4gc3RyYXRlZ3kgPT09ICdhdXRoMCcgfHwgc3RyYXRlZ3kgPT09ICdhdXRoMC1hZGxkYXAnO1xuICB9O1xuXG4gIHZhciBfc2V0VGl0bGUgPSBmdW5jdGlvbih0aXRsZSkge1xuICAgICQoJy5zaWduaW4gLmVycm9yJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcuc2lnbmluIC5zdWNjZXNzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAkKCcuc2lnbmluIGgxJykuaHRtbCh0aXRsZSkuY3NzKCdkaXNwbGF5JywgJycpO1xuICB9O1xuXG4gIHZhciBfaXNBZExkYXBDb25uID0gZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbiAgICByZXR1cm4gY29ubmVjdGlvbiA9PT0gJ2FkbGRhcCc7XG4gIH07XG5cbiAgdmFyIF9hcmVUaGVyZUFueVNvY2lhbENvbm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyBpbiBfY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICAgIGlmIChfc3RyYXRlZ2llc1tfY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0gJiYgX3N0cmF0ZWdpZXNbX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdLnNvY2lhbCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubiA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIHMgaW4gX2NsaWVudC5zdHJhdGVnaWVzKSB7XG4gICAgICBpZiAoX3N0cmF0ZWdpZXNbX2NsaWVudC5zdHJhdGVnaWVzW3NdLm5hbWVdICYmIFxuICAgICAgICAgICFfc3RyYXRlZ2llc1tfY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZV0uc29jaWFsKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICB2YXIgX2lzRW50ZXJwcmlzZUNvbm5lY3Rpb24gPSBmdW5jdGlvbiAoZW1haWwsIG91dHB1dCkge1xuICAgIHZhciBlbWFpbE0gPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFxdKXwoKFthLXpBLVpcXC0wLTldK1xcLikrW2EtekEtWl17Mix9KSkkL1xuICAgICAgICAgICAgICAgICAgICAgIC5leGVjKGVtYWlsLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgZm9yKHZhciBzIGluIF9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgICAgdmFyIHN0cmF0ZWd5ID0gX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuICAgICAgaWYgKF9pc0F1dGgwQ29ubihzdHJhdGVneS5uYW1lKSkgY29udGludWU7XG5cbiAgICAgIGZvcih2YXIgYyBpbiBzdHJhdGVneS5jb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoZW1haWxNICYmIGVtYWlsTS5zbGljZSgtMilbMF0gPT0gc3RyYXRlZ3kuY29ubmVjdGlvbnNbY10uZG9tYWluKSB7XG4gICAgICAgICAgb3V0cHV0LmRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICB2YXIgX2lzRW50ZXJwcmlzZVN0cmF0ZWd5ID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7IFxuICAgIGZvciAodmFyIHMgaW4gX3N0cmF0ZWdpZXMpIHtcbiAgICAgIGlmIChzID09PSBzdHJhdGVneSAmJiAhX3N0cmF0ZWdpZXNbc10uc29jaWFsKSB7IFxuICAgICAgICByZXR1cm4gdHJ1ZTsgXG4gICAgICB9IFxuICAgIH0gXG5cbiAgICByZXR1cm4gZmFsc2U7IFxuICB9O1xuXG4gIHZhciBfZ2V0Q29uZmlndXJlZFN0cmF0ZWd5ID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBmb3IgKHZhciBzIGluIF9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgICAgaWYgKF9jbGllbnQuc3RyYXRlZ2llc1tzXSAmJiBfY2xpZW50LnN0cmF0ZWdpZXNbc10ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICByZXR1cm4gX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgX2dldEF1dGgwQ29ubmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGlmIHNwZWNpZmllZCwgdXNlIGl0LCBvdGhlcndpc2UgcmV0dXJuIGZpcnN0XG4gICAgaWYgKF9vcHRpb25zWyd1c2VyUHdkQ29ubmVjdGlvbk5hbWUnXSkge1xuICAgICAgZm9yICh2YXIgaSBpbiBfYXV0aDBTdHJhdGVneS5jb25uZWN0aW9ucykge1xuICAgICAgICBpZiAoX2F1dGgwU3RyYXRlZ3kuY29ubmVjdGlvbnNbaV0ubmFtZSA9PT0gX29wdGlvbnNbJ3VzZXJQd2RDb25uZWN0aW9uTmFtZSddKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdXRoMFN0cmF0ZWd5LmNvbm5lY3Rpb25zW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9hdXRoMFN0cmF0ZWd5ID8gX2F1dGgwU3RyYXRlZ3kuY29ubmVjdGlvbnNbMF0gOiBudWxsO1xuICB9O1xuXG4gIHZhciBfc2hvd09ySGlkZVBhc3N3b3JkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWlsRmllbGQgPSAkKCcubm90bG9nZ2VkaW4gLmVtYWlsIGlucHV0JykuZmlyc3QoKTtcbiAgICB2YXIgcHdkRmllbGQgID0gJCgnLm5vdGxvZ2dlZGluIC5wYXNzd29yZCBpbnB1dCcpO1xuICAgIHB3ZEZpZWxkLnJlbW92ZUF0dHIoJ3JlcXVpcmVkJyk7XG5cbiAgICB2YXIgaXNFbnRlcnByaXNlQ29ubmVjdGlvbiA9IF9pc0VudGVycHJpc2VDb25uZWN0aW9uKG1haWxGaWVsZC52YWwoKSk7XG5cbiAgICBpZiAoaXNFbnRlcnByaXNlQ29ubmVjdGlvbikge1xuICAgICAgcHdkRmllbGQuYXR0cignZGlzYWJsZWQnLCAnJyk7XG4gICAgICBwd2RGaWVsZC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHdkRmllbGQucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICAgIHB3ZEZpZWxkLmF0dHIoJ3JlcXVpcmVkJywgdHJ1ZSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfaGlkZVNpZ25JbiA9IGZ1bmN0aW9uIChjYikge1xuICAgICQoJ2Rpdi5vdmVybGF5JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJCgnaHRtbCcpLnJlbW92ZUNsYXNzKCdtb2RlLXNpZ25pbicpO1xuICAgICAgaWYgKGNiKSBjYigpO1xuICAgIH0sIDUwMCk7XG4gIH07XG5cbiAgdmFyIF9nZXRBY3RpdmVMb2dpblZpZXcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gX2hhc0xvZ2dlZEluQmVmb3JlID8gJCgnLmxvZ2dlZGluJykgOiAkKCcubm90bG9nZ2VkaW4nKTtcbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfdG9nZ2xlU3Bpbm5lciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICAgIHZhciBzcGlubmVyID0gJCgnLnNwaW5uZXInLCBjb250YWluZXIpO1xuICAgIHZhciBzaWduaW4gPSAkKCcuem9jaWFsLnByaW1hcnknLCBjb250YWluZXIpO1xuXG4gICAgc3Bpbm5lci5jc3MoJ2Rpc3BsYXknLCBzcGlubmVyLmNzcygnZGlzcGxheScpID09PSAnbm9uZScgPyAnJyA6ICdub25lJyk7XG4gICAgc2lnbmluLmNzcygnZGlzcGxheScsIHNpZ25pbi5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnID8gJycgOiAnbm9uZScpO1xuICB9O1xuXG4gIHZhciBfc2V0TG9naW5WaWV3ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIF9oYXNMb2dnZWRJbkJlZm9yZSA9IG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyO1xuICAgIF9zZXRUaXRsZShfb3B0aW9uc1sndGl0bGUnXSk7XG5cbiAgICAkKCcubG9nZ2VkaW4nKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICQoJy5ub3Rsb2dnZWRpbicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgJCgnLnNpZ251cCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgJCgnLnJlc2V0JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICQoJy5sb2dnZWRpbicpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyID8gJycgOiAnbm9uZScpO1xuICAgICQoJy5ub3Rsb2dnZWRpbicpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuaXNSZXR1cm5pbmdVc2VyID8gJ25vbmUnIDogJycpO1xuXG4gICAgX3NldFRvcChfb3B0aW9ucy50b3AsICQoJy5zaWduaW4gZGl2LnBhbmVsLm9uZXN0ZXAnKSk7XG4gICAgJCgnLm5vdGxvZ2dlZGluIC5lbWFpbCBpbnB1dCcpLmZpcnN0KCkuZm9jdXMoKTtcbiAgfTtcblxuICB2YXIgX3Nob3dMb2dnZWRJbkV4cGVyaWVuY2UgPSBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHN0cmF0ZWd5ID0gX3Nzb0RhdGEubGFzdFVzZWRDb25uZWN0aW9uLnN0cmF0ZWd5O1xuICAgIF9zZXRMb2dpblZpZXcoeyBpc1JldHVybmluZ1VzZXI6ICEhc3RyYXRlZ3kgfSk7XG5cbiAgICBpZiAoIXN0cmF0ZWd5KSByZXR1cm47XG5cbiAgICB2YXIgbG9naW5WaWV3ID0gX2dldEFjdGl2ZUxvZ2luVmlldygpO1xuICAgIGJlYW4ub24oJCgnZm9ybScsIGxvZ2luVmlldylbMF0sICdzdWJtaXQnLCBfc2lnbkluRW50ZXJwcmlzZSk7XG4gICAgXG4gICAgdmFyIGJ1dHRvbjtcbiAgICBpZiAoc3RyYXRlZ3kgIT09ICdhdXRoMCcpIHtcbiAgICAgIGJ1dHRvbiA9IGJvbnpvKGJvbnpvLmNyZWF0ZSgnPHNwYW4+PC9zcGFuPicpKVxuICAgICAgICAuYXR0cigndGFiaW5kZXgnLCAwKVxuICAgICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5KVxuICAgICAgICAuYXR0cigndGl0bGUnLCBfc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgICAgLmFkZENsYXNzKCd6b2NpYWwnKS5hZGRDbGFzcygnYmxvY2snKVxuICAgICAgICAuYWRkQ2xhc3MoX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLmNzcylcbiAgICAgICAgLmFkZENsYXNzKF9zdHJhdGVnaWVzW3N0cmF0ZWd5XS5pbWFnZWljb24gPyAnaW1hZ2UtaWNvbicgOiAnJylcbiAgICAgICAgLmh0bWwoX3N0cmF0ZWdpZXNbc3RyYXRlZ3ldLm5hbWUpO1xuICAgICAgXG4gICAgICBiZWFuLm9uKGJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHsgX3Nob3dTaWduSW5PcHRpb25zKGUudGFyZ2V0KTsgfSk7XG5cbiAgICAgICQoJy5zdHJhdGVneSBzcGFuJywgbG9naW5WaWV3KS5lYWNoKGZ1bmN0aW9uIChlbCkgeyBpZiAoZWwpIGVsLnJlbW92ZSgpOyB9KTtcbiAgICAgICQoJy5zdHJhdGVneScsIGxvZ2luVmlldykuYXBwZW5kKGJ1dHRvbik7XG4gICAgfVxuXG4gICAgJCgnLmFsbCcsIGxvZ2luVmlldykuaHRtbChfb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSk7XG5cbiAgICBiZWFuLm9uKCQoJy5hbGwnLCBsb2dpblZpZXcpLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfc2V0TG9naW5WaWV3KHsgaXNSZXR1cm5pbmdVc2VyOiBmYWxzZSB9KTtcbiAgICB9KTtcblxuICAgIGlmIChfc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKSB7XG4gICAgICBpZiAoc3RyYXRlZ3kgPT09ICdhdXRoMCcpIHtcbiAgICAgICAgJCgnLmVtYWlsLXJlYWRvbmx5JywgbG9naW5WaWV3KS5odG1sKF9zc29EYXRhLmxhc3RVc2VkVXNlcm5hbWUpOyBcbiAgICAgICAgJCgnLmVtYWlsIGlucHV0JywgbG9naW5WaWV3KS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAkKCcuZW1haWxQYXNzd29yZCcsIGxvZ2luVmlldykuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgICAgfSBcbiAgICAgIGVsc2UgaWYgKF9pc0VudGVycHJpc2VTdHJhdGVneShzdHJhdGVneSkpIHtcbiAgICAgICAgYnV0dG9uLmh0bWwoX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSB8fCBfc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSlcbiAgICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgX3Nzb0RhdGEubGFzdFVzZWRVc2VybmFtZSB8fCBfc3RyYXRlZ2llc1tzdHJhdGVneV0ubmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIHNpZ24gaW4gbWV0aG9kc1xuICB2YXIgX3NpZ25JblNvY2lhbCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgc3RyYXRlZ3lOYW1lID0gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyB0YXJnZXQgOiB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXN0cmF0ZWd5Jyk7XG4gICAgdmFyIHN0cmF0ZWd5ID0gX2dldENvbmZpZ3VyZWRTdHJhdGVneShzdHJhdGVneU5hbWUpO1xuXG4gICAgaWYgKHN0cmF0ZWd5KSB7XG4gICAgICBhdXRoMC5sb2dpbih7XG4gICAgICAgIGNvbm5lY3Rpb246IHN0cmF0ZWd5LmNvbm5lY3Rpb25zWzBdLm5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3NpZ25JbkVudGVycHJpc2UgPSBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdmFyIGNvbnRhaW5lciA9IF9nZXRBY3RpdmVMb2dpblZpZXcoKTtcbiAgICB2YXIgZm9ybSA9ICQoJ2Zvcm0nLCBjb250YWluZXIpO1xuICAgIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgICB2YXIgZW1haWxEID0gJCgnLmVtYWlsJywgZm9ybSksXG4gICAgICAgIGVtYWlsRSA9ICQoJ2lucHV0W25hbWU9ZW1haWxdJywgZm9ybSksXG4gICAgICAgIGVtYWlsTSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVtcXF1cXFxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFxcW1swLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXF0pfCgoW2EtekEtWlxcLTAtOV0rXFwuKStbYS16QS1aXXsyLH0pKSQvLmV4ZWMoZW1haWxFLnZhbCgpLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgICBlbWFpbFAgPSAvXlxccyokLy50ZXN0KGVtYWlsRS52YWwoKSksXG4gICAgICAgIGRvbWFpbiwgdXJsLCBlbWFpbCA9IG51bGwsIHN0cmF0ZWd5O1xuXG4gICAgZm9yICh2YXIgcyBpbiBfY2xpZW50LnN0cmF0ZWdpZXMpIHtcbiAgICAgIHN0cmF0ZWd5ID0gX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuXG4gICAgICBpZiAoX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpKSBjb250aW51ZTtcblxuICAgICAgZm9yICh2YXIgYyBpbiBzdHJhdGVneS5jb25uZWN0aW9ucykge1xuICAgICAgICBpZighZW1haWxQICYmIGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbikge1xuICAgICAgICAgIGRvbWFpbiA9IHN0cmF0ZWd5LmNvbm5lY3Rpb25zW2NdLmRvbWFpbjtcbiAgICAgICAgICB1cmwgPSBzdHJhdGVneS5jb25uZWN0aW9uc1tjXS51cmw7XG4gICAgICAgICAgZW1haWwgPSBlbWFpbEUudmFsKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGRvbWFpbikgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGVtYWlsUCkge1xuICAgICAgLy8gX3Nob3dFcnJvcihnbG9iYWwudGxpdGUuZmluZChzZWxmLl9zaWduSW5PcHRpb25zWydzdHJhdGVneUVtYWlsRW1wdHknXSkpO1xuICAgIH0gXG4gICAgZWxzZSBpZiAoIWVtYWlsTSkge1xuICAgICAgLy8gX3Nob3dFcnJvcihnbG9iYWwudGxpdGUuZmluZChzZWxmLl9zaWduSW5PcHRpb25zWydzdHJhdGVneUVtYWlsSW52YWxpZCddKSk7XG4gICAgfSBcbiAgICBlbHNlIGlmICghZG9tYWluKSB7XG4gICAgICBpZiAoX2F1dGgwU3RyYXRlZ3kpIHtcbiAgICAgICAgcmV0dXJuIF9zaWduSW5XaXRoQXV0aDAoZW1haWxFLnZhbCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVtYWlsTSAmJiBlbWFpbE0uc2xpY2UoLTIpWzBdID09PSAnZ21haWwuY29tJykge1xuICAgICAgICByZXR1cm4gX3NpZ25JblNvY2lhbCgnZ29vZ2xlLW9hdXRoMicpO1xuICAgICAgfVxuXG4gICAgICAvLyBfc2hvd0Vycm9yKGdsb2JhbC50bGl0ZS5maW5kKHNlbGYuX3NpZ25Jbk9wdGlvbnNbJ3N0cmF0ZWd5RG9tYWluSW52YWxpZCddLCB7IGRvbWFpbjogZW1haWxNICYmIGVtYWlsTS5zbGljZSgtMilbMF0gfSkpO1xuICAgIH1cblxuICAgIHZhbGlkICY9ICghZG9tYWluICYmICFlbWFpbEQuYWRkQ2xhc3MoJ2ludmFsaWQnKSkgfHwgKCEhZG9tYWluICYmICEhZW1haWxELnJlbW92ZUNsYXNzKCdpbnZhbGlkJykpO1xuXG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICBfcmVkaXJlY3QodXJsKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9zaWduSW5XaXRoQXV0aDAgPSBmdW5jdGlvbiAodXNlck5hbWUsIHNpZ25JblBhc3N3b3JkKSB7XG4gICAgX3RvZ2dsZVNwaW5uZXIoKTtcblxuICAgIHZhciBjb250YWluZXIgPSBfZ2V0QWN0aXZlTG9naW5WaWV3KCk7XG4gICAgdmFyIGNvbm5lY3Rpb24gID0gX2dldEF1dGgwQ29ubmVjdGlvbigpO1xuICAgIFxuICAgIHZhciBsb2dpbk9wdGlvbnMgPSB7XG4gICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uLm5hbWUsXG4gICAgICB1c2VybmFtZTogX2lzQWRMZGFwQ29ubihjb25uZWN0aW9uLm5hbWUpID8gdXNlck5hbWUucmVwbGFjZSgnQCcgKyBjb25uZWN0aW9uLmRvbWFpbiwgJycpIDogdXNlck5hbWUsXG4gICAgICBwYXNzd29yZDogc2lnbkluUGFzc3dvcmQgfHzCoCQoJy5wYXNzd29yZCBpbnB1dCcsIGNvbnRhaW5lcikudmFsKClcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgayBpbiBfYXV0aDBDb25uZWN0aW9uUGFyYW1zKSB7XG4gICAgICBsb2dpbk9wdGlvbnNba10gPSBfYXV0aDBDb25uZWN0aW9uUGFyYW1zW2tdO1xuICAgIH1cblxuICAgIGF1dGgwLmxvZ2luKGxvZ2luT3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikgYWxlcnQoZXJyKTtcbiAgICAgIF90b2dnbGVTcGlubmVyKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gaW5pdGlhbGl6ZVxuICB2YXIgaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPOiBzdXBwb3J0IGNzcyBvcHRpb24gZm9yIG5vbiBmcmVlIHN1YnNjcmlwdGlvbnNcblxuICAgIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIGEuY2xvc2UnKVswXSwgJ2NsaWNrJywgX2hpZGVTaWduSW4pO1xuICAgIGJlYW4ub24oJCgnLnBvcHVwIC5wYW5lbC5vbmVzdGVwIC5ub3Rsb2dnZWRpbiBmb3JtJylbMF0sICdzdWJtaXQnLCBfc2lnbkluRW50ZXJwcmlzZSk7XG4gICAgYmVhbi5vbigkKCdodG1sJylbMF0sICdrZXl1cCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdtb2RlLXNpZ25pbicpKSB7XG4gICAgICAgIGlmICgoZS53aGljaCA9PSAyNyB8fCBlLmtleWNvZGUgPT0gMjcpICYmICFfb3B0aW9ucy5zdGFuZGFsb25lKSB7XG4gICAgICAgICAgX2hpZGVTaWduSW4oKTsgLy8gY2xvc2UgcG9wdXAgd2l0aCBFU0Mga2V5XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGxvYWQgc29jaWFsIGJ1dHRvbnNcbiAgICB2YXIgbGlzdCA9ICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3QnKTtcbiAgICBmb3IgKHZhciBzIGluIF9jbGllbnQuc3RyYXRlZ2llcykge1xuICAgICAgdmFyIHN0cmF0ZWd5ID0gX2NsaWVudC5zdHJhdGVnaWVzW3NdO1xuXG4gICAgICBpZiAoX2lzQXV0aDBDb25uKHN0cmF0ZWd5Lm5hbWUpICYmIHN0cmF0ZWd5LmNvbm5lY3Rpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgX2F1dGgwU3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICAgJCgnLmNyZWF0ZS1hY2NvdW50LCAucGFzc3dvcmQnKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdICYmIF9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLnNvY2lhbCkge1xuICAgICAgICB2YXIgYnV0dG9uID0gYm9uem8oYm9uem8uY3JlYXRlKCc8c3Bhbj48L3NwYW4+JykpXG4gICAgICAgICAgLmF0dHIoJ3RhYmluZGV4JywgMClcbiAgICAgICAgICAuYXR0cignZGF0YS1zdHJhdGVneScsIHN0cmF0ZWd5Lm5hbWUpXG4gICAgICAgICAgLmF0dHIoJ3RpdGxlJywgX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0ubmFtZSlcbiAgICAgICAgICAuYWRkQ2xhc3MoJ3pvY2lhbCcpLmFkZENsYXNzKCdpY29uJylcbiAgICAgICAgICAuYWRkQ2xhc3MoX3N0cmF0ZWdpZXNbc3RyYXRlZ3kubmFtZV0uY3NzKVxuICAgICAgICAgIC5hZGRDbGFzcyhfc3RyYXRlZ2llc1tzdHJhdGVneS5uYW1lXS5pbWFnZWljb24gPyAnaW1hZ2UtaWNvbicgOiAnJyk7XG4gICAgICAgICAgLy8uaHRtbChnbG9iYWwudGxpdGUuZmluZChcIntuYW1lfVwiLCB7IG5hbWU6IF9zdHJhdGVnaWVzW3N0cmF0ZWd5Lm5hbWVdLm5hbWV9KSk7XG5cbiAgICAgICAgbGlzdC5hcHBlbmQoYnV0dG9uKTtcbiAgICAgICAgbGlzdC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgICAgICAkKCcucG9wdXAgLnBhbmVsLm9uZXN0ZXAgLnNlcGFyYXRvcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgfVxuICAgIH1cblxuICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgICAgYmVhbi5vbihidXR0b24sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIF9zaWduSW5Tb2NpYWwoZS50YXJnZXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzaG93U2lnbkluKCk7XG4gIH07XG5cbiAgdmFyIHNob3dTaWduSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgJCgnaHRtbCcpLmFkZENsYXNzKCdtb2RlLXNpZ25pbicpO1xuXG4gICAgLy8gaWYgbm8gc29jaWFsIGNvbm5lY3Rpb25zIGFuZCBvbmUgZW50ZXJwcmlzZSBjb25uZWN0aW9uIG9ubHksIHJlZGlyZWN0XG4gICAgaWYgKCFfYXJlVGhlcmVBbnlTb2NpYWxDb25uKCkgJiYgXG4gICAgICBfY2xpZW50LnN0cmF0ZWdpZXMubGVuZ3RoID09PSAxICYmXG4gICAgICBfY2xpZW50LnN0cmF0ZWdpZXNbMF0ubmFtZSAhPT0gJ2F1dGgwJyAmJlxuICAgICAgX2NsaWVudC5zdHJhdGVnaWVzWzBdLmNvbm5lY3Rpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgXG4gICAgICBfcmVkaXJlY3QoX2NsaWVudC5zdHJhdGVnaWVzWzBdLmNvbm5lY3Rpb25zWzBdLnVybCk7XG4gICAgfVxuXG4gICAgLy8gbGFiZWxzIHRleHRcbiAgICB2YXIgb3B0aW9ucyA9IF9vcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnNbJ29uZXN0ZXAnXSA9IHR5cGVvZiBvcHRpb25zWydvbmVzdGVwJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snb25lc3RlcCddIDogZmFsc2U7XG4gICAgb3B0aW9uc1sndG9wJ10gPSBvcHRpb25zWyd0b3AnXSB8fCBmYWxzZTtcbiAgICBvcHRpb25zWyd0aXRsZSddID0gb3B0aW9uc1sndGl0bGUnXSB8fCAnU2lnbiBJbic7XG4gICAgb3B0aW9uc1snc3RyYXRlZ3lCdXR0b25UZW1wbGF0ZSddID0gb3B0aW9uc1snc3RyYXRlZ3lCdXR0b25UZW1wbGF0ZSddIHx8IFwie25hbWV9XCI7XG4gICAgb3B0aW9uc1snYWxsQnV0dG9uVGVtcGxhdGUnXSA9IG9wdGlvbnNbJ2FsbEJ1dHRvblRlbXBsYXRlJ10gfHwgXCJTaG93IGFsbFwiO1xuICAgIG9wdGlvbnNbJ3N0cmF0ZWd5QmFjayddID0gb3B0aW9uc1snc3RyYXRlZ3lCYWNrJ10gfHwgXCJCYWNrXCI7XG4gICAgb3B0aW9uc1snc3RyYXRlZ3lFbWFpbExhYmVsJ10gPSBvcHRpb25zWydzdHJhdGVneUVtYWlsTGFiZWwnXSB8fCBcIkVtYWlsOlwiO1xuICAgIG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxFbXB0eSddID0gb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEVtcHR5J10gfHwgXCJUaGUgZW1haWwgaXMgZW1wdHkuXCI7XG4gICAgb3B0aW9uc1snc3RyYXRlZ3lFbWFpbEludmFsaWQnXSA9IG9wdGlvbnNbJ3N0cmF0ZWd5RW1haWxJbnZhbGlkJ10gfHwgXCJUaGUgZW1haWwgaXMgaW52YWxpZC5cIjtcblxuICAgIG9wdGlvbnNbJ2ljb24nXSA9IG9wdGlvbnNbJ2ljb24nXSB8fCBcImltZy9sb2dvLTMyLnBuZ1wiO1xuICAgIG9wdGlvbnNbJ3Nob3dJY29uJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd0ljb24nXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93SWNvbiddIDogZmFsc2U7XG4gICAgb3B0aW9uc1snc2hvd1NpZ251cCddID0gdHlwZW9mIG9wdGlvbnNbJ3Nob3dTaWdudXAnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93U2lnbnVwJ10gOiB0cnVlO1xuICAgIG9wdGlvbnNbJ3Nob3dGb3Jnb3QnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93Rm9yZ290J10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd0ZvcmdvdCddIDogdHJ1ZTtcbiAgICBvcHRpb25zWydzaWdudXBUZXh0J10gPSBvcHRpb25zWydzaWdudXBUZXh0J10gfHwgJ1NpZ24gVXAnO1xuICAgIG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSA9IG9wdGlvbnNbJ2ZvcmdvdFRleHQnXSB8fCAnRm9yZ290IHlvdXIgcGFzc3dvcmQ/JztcbiAgICBvcHRpb25zWyd1c2VBcHBTaWduSW5DYWxsYmFjayddID0gdHlwZW9mIG9wdGlvbnNbJ3VzZUFwcFNpZ25JbkNhbGxiYWNrJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1sndXNlQXBwU2lnbkluQ2FsbGJhY2snXSA6IGZhbHNlO1xuICAgIG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSA9IG9wdGlvbnNbJ3NpZ25JbkJ1dHRvblRleHQnXSB8fCAnU2lnbiBJbic7XG4gICAgb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddID0gb3B0aW9uc1snZW1haWxQbGFjZWhvbGRlciddIHx8ICdFbWFpbCc7XG4gICAgb3B0aW9uc1sncGFzc3dvcmRQbGFjZWhvbGRlciddID0gb3B0aW9uc1sncGFzc3dvcmRQbGFjZWhvbGRlciddIHx8ICdQYXNzd29yZCc7XG4gICAgb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddID0gb3B0aW9uc1snc2VwYXJhdG9yVGV4dCddIHx8ICdvcic7XG4gICAgb3B0aW9uc1snc2VydmVyRXJyb3JUZXh0J10gPSBvcHRpb25zWydzZXJ2ZXJFcnJvclRleHQnXSB8fCAnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHNpZ24gaW4uJztcbiAgICBvcHRpb25zWydzaG93RW1haWwnXSA9IHR5cGVvZiBvcHRpb25zWydzaG93RW1haWwnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydzaG93RW1haWwnXSA6IHRydWU7XG4gICAgb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gPSB0eXBlb2Ygb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc2hvd1Bhc3N3b3JkJ10gOiB0cnVlO1xuICAgIG9wdGlvbnNbJ3NvY2lhbEJpZ0J1dHRvbnMnXSA9IHR5cGVvZiBvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10gIT09ICd1bmRlZmluZWQnID8gb3B0aW9uc1snc29jaWFsQmlnQnV0dG9ucyddIDogIV9hcmVUaGVyZUFueUVudGVycHJpc2VPckRiQ29ubigpO1xuICAgIG9wdGlvbnNbJ2VuYWJsZVJldHVyblVzZXJFeHBlcmllbmNlJ10gPSB0eXBlb2Ygb3B0aW9uc1snZW5hYmxlUmV0dXJuVXNlckV4cGVyaWVuY2UnXSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddIDogdHJ1ZTtcbiAgICBvcHRpb25zWydyZXR1cm5Vc2VyTGFiZWwnXSA9IG9wdGlvbnNbJ3JldHVyblVzZXJMYWJlbCddIHx8ICdMYXN0IHRpbWUgeW91IHNpZ25lZCBpbiB1c2luZy4uLic7XG4gICAgb3B0aW9uc1snd3JvbmdFbWFpbFBhc3N3b3JkRXJyb3JUZXh0J10gPSBvcHRpb25zWyd3cm9uZ0VtYWlsUGFzc3dvcmRFcnJvclRleHQnXSB8fCAnV3JvbmcgZW1haWwgb3IgcGFzc3dvcmQuJztcblxuICAgIC8vIHRoZW1lXG4gICAgaWYgKG9wdGlvbnMudGhlbWUpIHtcbiAgICAgICQoJ2h0bWwnKS5hZGRDbGFzcygndGhlbWUtJyArIG9wdGlvbnMudGhlbWUpO1xuICAgIH1cblxuICAgICQoJy5wYW5lbCBhLmNsb3NlJykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zdGFuZGFsb25lID8gJ25vbmUnIDogJ2Jsb2NrJyk7XG5cbiAgICAvLyBzaG93IGljb25cbiAgICBpZiAob3B0aW9ucy5zaG93SWNvbikge1xuICAgICAgJCgnLnBhbmVsIC5pbWFnZSBpbWcnKS5hdHRyKCdzcmMnLCBvcHRpb25zLmljb24pO1xuICAgICAgJCgnLnBhbmVsIC5pbWFnZScpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0ljb24gPyAnYmxvY2snIDogJ25vbmUnKTtcbiAgICB9XG5cbiAgICAvLyBoaWRlIGRpdmlkZXIgZG90IGlmIHRoZXJlIGFyZSBvbmUgb2YgdHdvXG4gICAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuZGl2aWRlcicpXG4gICAgICAuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgb3B0aW9ucy5zaG93U2lnbnVwICYmIG9wdGlvbnMuc2hvd0ZvcmdvdCA/ICcnIDogJ25vbmUnKTtcblxuICAgICQoJ2Rpdi5wYW5lbCBpbnB1dCcpLmVhY2goZnVuY3Rpb24gKGUpIHsgZS52YWx1ZSA9ICcnOyB9KTtcblxuICAgIC8vIHBsYWNlaG9sZGVycyBhbmQgYnV0dG9uc1xuICAgICQoJy5wYW5lbCAuem9jaWFsLnByaW1hcnknKS5odG1sKG9wdGlvbnMuc2lnbkluQnV0dG9uVGV4dCk7XG4gICAgJCgnLnBhbmVsIC5lbWFpbCBpbnB1dCcpLmF0dHIoJ3BsYWNlaG9sZGVyJywgb3B0aW9ucy5lbWFpbFBsYWNlaG9sZGVyKTtcbiAgICAkKCcucGFuZWwgLnBhc3N3b3JkIGlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBvcHRpb25zLnBhc3N3b3JkUGxhY2Vob2xkZXIpO1xuICAgICQoJy5wYW5lbCAuc2VwYXJhdG9yIHNwYW4nKS5odG1sKG9wdGlvbnMuc2VwYXJhdG9yVGV4dCk7XG5cbiAgICAvLyBzaG93IGVtYWlsLCBwYXNzd29yZCwgc2VwYXJhdG9yIGFuZCBidXR0b24gaWYgdGhlcmUgYXJlIGVudGVycHJpc2UvZGIgY29ubmVjdGlvbnNcbiAgICB2YXIgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID0gX2FyZVRoZXJlQW55RW50ZXJwcmlzZU9yRGJDb25uKCk7XG4gICAgdmFyIGFueVNvY2lhbENvbm5lY3Rpb24gPSBfYXJlVGhlcmVBbnlTb2NpYWxDb25uKCk7XG5cbiAgICAkKCcucGFuZWwgLmVtYWlsIGlucHV0JykuY3NzKCdkaXNwbGF5Jywgb3B0aW9ucy5zaG93RW1haWwgJiYgYW55RW50ZXJwcmlzZU9yRGJDb25uZWN0aW9uID8gJycgOiAnbm9uZScpO1xuICAgICQoJy5wYW5lbCAuem9jaWFsLnByaW1hcnknKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICAgJCgnLnBhbmVsIC5wYXNzd29yZCBpbnB1dCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1Bhc3N3b3JkICYmIGFueUVudGVycHJpc2VPckRiQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgICAkKCcucGFuZWwgLmNyZWF0ZS1hY2NvdW50IC5mb3Jnb3QtcGFzcycpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd0ZvcmdvdCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICAgJCgnLnBhbmVsIC5jcmVhdGUtYWNjb3VudCAuc2lnbi11cCcpLmNzcygnZGlzcGxheScsIG9wdGlvbnMuc2hvd0VtYWlsICYmIG9wdGlvbnMuc2hvd1NpZ251cCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gPyAnJyA6ICdub25lJyk7XG4gICAgJCgnLnBhbmVsIC5zZXBhcmF0b3InKS5jc3MoJ2Rpc3BsYXknLCBvcHRpb25zLnNob3dFbWFpbCAmJiBhbnlFbnRlcnByaXNlT3JEYkNvbm5lY3Rpb24gJiYgYW55U29jaWFsQ29ubmVjdGlvbiA/ICcnIDogJ25vbmUnKTtcbiAgICAkKCcucGFuZWwgLmxhc3QtdGltZScpLmh0bWwob3B0aW9ucy5yZXR1cm5Vc2VyTGFiZWwpO1xuXG4gICAgLy8gVE9ETzogc2hvdyBwbGFjZWhvbGRlcnMgZm9yIElFOVxuXG4gICAgLy8gYWN0aXZhdGUgcGFuZWxcbiAgICAkKCdkaXYucGFuZWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnZGl2Lm92ZXJsYXknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAkKCcucG9wdXAgaDEnKS5odG1sKG9wdGlvbnMudGl0bGUpO1xuICAgICQoJy5wb3B1cCAuaW52YWxpZCcpLnJlbW92ZUNsYXNzKCdpbnZhbGlkJyk7XG5cbiAgICAvLyBpZiB1c2VyIGxvZ2dlZCBpbiBzaG93IGxvZ2dlZCBpbiBleHBlcmllbmNlXG4gICAgaWYgKF9zc29EYXRhLnNzbyAmJiBvcHRpb25zWydlbmFibGVSZXR1cm5Vc2VyRXhwZXJpZW5jZSddKSB7XG4gICAgICBfc2hvd0xvZ2dlZEluRXhwZXJpZW5jZSgpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zWydzb2NpYWxCaWdCdXR0b25zJ10pIHtcbiAgICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLnJlbW92ZUNsYXNzKCdpY29uJykuYWRkQ2xhc3MoJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoJy5wb3B1cCAucGFuZWwub25lc3RlcCAuaWNvbmxpc3Qgc3BhbicpLmFkZENsYXNzKCdpY29uJykucmVtb3ZlQ2xhc3MoJ2Jsb2NrJyk7XG4gICAgfVxuXG4gICAgJCgnZGl2LnBhbmVsLm9uZXN0ZXAgaDEnKS5odG1sKG9wdGlvbnNbJ3RpdGxlJ10pO1xuICAgICQoJ2Rpdi5wYW5lbC5vbmVzdGVwJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgaWYgKF9zc29EYXRhLnNzbyAmJiBfc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKSB7XG4gICAgICAkKCdkaXYucGFuZWwub25lc3RlcCBpbnB1dCcpLnZhbChfc3NvRGF0YS5sYXN0VXNlZFVzZXJuYW1lKTtcbiAgICB9XG5cbiAgICBfc2V0VG9wKG9wdGlvbnMudG9wLCAkKCdkaXYucGFuZWwub25lc3RlcCcpKTtcbiAgICBfc2V0TG9naW5WaWV3KHsgaXNSZXR1cm5pbmdVc2VyOiBfc3NvRGF0YS5zc28gfSk7XG4gIH07XG5cbiAgLy8gbG9hZFxuICBpbnNlcnRDc3MoXCIucG9wdXAgLm92ZXJsYXkge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgbGVmdDogMDtcXG4gIHRvcDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHotaW5kZXg6IDk5OTk7XFxuICBmb250LXdlaWdodDogMjAwO1xcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtby11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgYmFja2dyb3VuZDogIzAwMDtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC44KTtcXG4gIGJhY2tncm91bmQ6IC13ZWJraXQtcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsIGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIsIHJnYmEoMCwwLDAsMC40NSkgMSUsIHJnYmEoMCwwLDAsMC44KSAxMDAlKTtcXG4gIGJhY2tncm91bmQ6IC1tb3otcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsIGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIsIHJnYmEoMCwwLDAsMC40NSkgMSUsIHJnYmEoMCwwLDAsMC44KSAxMDAlKTtcXG4gIGJhY2tncm91bmQ6IC1tcy1yYWRpYWwtZ3JhZGllbnQoNTAlIDUwJSwgZWxsaXBzZSBjbG9zZXN0LWNvcm5lciwgcmdiYSgwLDAsMCwwLjQ1KSAxJSwgcmdiYSgwLDAsMCwwLjgpIDEwMCUpO1xcbiAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KDUwJSA1MCUsIGVsbGlwc2UgY2xvc2VzdC1jb3JuZXIsIHJnYmEoMCwwLDAsMC40NSkgMSUsIHJnYmEoMCwwLDAsMC44KSAxMDAlKTtcXG4gIG9wYWNpdHk6IDA7XFxuICAtd2Via2l0LXRyYW5zaXRpb246IDQwMG1zIG9wYWNpdHkgZWFzZTtcXG4gIC1tb3otdHJhbnNpdGlvbjogNDAwbXMgb3BhY2l0eSBlYXNlO1xcbiAgdHJhbnNpdGlvbjogNDAwbXMgb3BhY2l0eSBlYXNlO1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxuICAtby10cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG59XFxuXFxuLnBvcHVwIC5vdmVybGF5LmFjdGl2ZSB7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4ucG9wdXAgLm92ZXJsYXkgLnBhbmVsIHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiA1MCU7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4ucG9wdXAgLm92ZXJsYXkgLnBhbmVsLmFjdGl2ZSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIC13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOiA0MDBtcztcXG4gIC13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZTtcXG4gIC13ZWJraXQtYW5pbWF0aW9uLW5hbWU6IHNob3dQYW5lbDtcXG59XFxuXFxuLnBvcHVwIC5vdmVybGF5IC5wYW5lbCB7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjogNDAwbXM7XFxuICAtd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2U7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1uYW1lOiBoaWRlUGFuZWw7XFxuICB3aWR0aDogMjgwcHg7XFxuICBtYXJnaW46IDAgMCAwIC0xNDBweDtcXG59XFxuXFxuLnBvcHVwIC5vdmVybGF5IC5lbWFpbCB7XFxuICBtYXJnaW4tYm90dG9tOiAxNHB4O1xcbn1cXG5cXG4ucG9wdXAgLm92ZXJsYXkgLnBhc3N3b3JkLCAucG9wdXAgLm92ZXJsYXkgLnJlcGVhdFBhc3N3b3JkIHtcXG4gIG1hcmdpbi1ib3R0b206IDE0cHg7XFxufVxcblxcbi5wb3B1cCAub3ZlcmxheSAuZW1haWwtcmVhZG9ubHkge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZGlzcGxheTogaW5oZXJpdDtcXG4gIGNvbG9yOiAjNDE0NDRhO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBtYXJnaW4tYm90dG9tOiAyNXB4O1xcbn1cXG5cXG4ucGFuZWwgLnNpZ251cCAuaGVhZGVyLCAucGFuZWwgLnJlc2V0IC5oZWFkZXIge1xcbiAgbWFyZ2luLWJvdHRvbTogMTVweDsgXFxuICBmb250LXNpemU6IDE0cHg7IFxcbiAgY29sb3I6ICM0MTQ0NGE7XFxufVxcblxcbi5wYW5lbCAuc2lnbnVwIC5mb290ZXIge1xcbiAgbWFyZ2luLWJvdHRvbTogMTVweDsgXFxuICBmb250LXNpemU6IDEycHg7IFxcbiAgY29sb3I6ICM0MTQ0NGE7IFxcbiAgdGV4dC1hbGlnbjogbGVmdDsgXFxuICBtYXJnaW4tdG9wOiAxMHB4O1xcbn1cXG5cXG5ALW1vei1rZXlmcmFtZXMgc2hvd1BhbmVsIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQC13ZWJraXQta2V5ZnJhbWVzIHNob3dQYW5lbCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk1KSB0cmFuc2xhdGUzZCgwLCAxMDAlLCAwKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxuICB9XFxufVxcbkAtby1rZXlmcmFtZXMgc2hvd1BhbmVsIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQC1tcy1rZXlmcmFtZXMgc2hvd1BhbmVsIHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBzaG93UGFuZWwge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMC45NSkgdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgfVxcbn1cXG5ALW1vei1rZXlmcmFtZXMgaGlkZVBhbmVsIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQC13ZWJraXQta2V5ZnJhbWVzIGhpZGVQYW5lbCB7XFxuICAwJSB7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMC45OCkgdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxuICB9XFxufVxcbkAtby1rZXlmcmFtZXMgaGlkZVBhbmVsIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQC1tcy1rZXlmcmFtZXMgaGlkZVBhbmVsIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpIHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gIH1cXG59XFxuQGtleWZyYW1lcyBoaWRlUGFuZWwge1xcbiAgMCUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMSkgdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDAuOTgpIHRyYW5zbGF0ZTNkKDAsIDAsIDApO1xcbiAgfVxcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIHtcXG4gIGJhY2tncm91bmQ6ICNmYWZhZmE7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCgjZmZmLCAjZmFmYWZhKTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KCNmZmYsICNmYWZhZmEpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogLW1zLWxpbmVhci1ncmFkaWVudCgjZmZmLCAjZmFmYWZhKTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudCgjZmZmLCAjZmFmYWZhKTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgjZmZmLCAjZmFmYWZhKTtcXG4gIHotaW5kZXg6IDEwO1xcbiAgLW1vei1ib3gtc2hhZG93OiAwIDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMiksIDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTtcXG4gIC13ZWJraXQtYm94LXNoYWRvdzogMCAwIDFweCAxcHggcmdiYSgwLDAsMCwwLjIpLCAwIDEwcHggMjdweCByZ2JhKDAsMCwwLDAuNyk7XFxuICBib3gtc2hhZG93OiAwIDAgMXB4IDFweCByZ2JhKDAsMCwwLDAuMiksIDAgMTBweCAyN3B4IHJnYmEoMCwwLDAsMC43KTtcXG4gIC1tb3otYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiA2cHg7XFxuICBib3JkZXItcmFkaXVzOiA2cHg7XFxuICAtd2Via2l0LXRvdWNoLWNhbGxvdXQ6IG5vbmU7XFxufVxcblxcbi5wb3B1cCAucGFuZWw6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAwO1xcbiAgcmlnaHQ6IDA7XFxuICB0b3A6IDA7XFxuICBib3R0b206IDA7XFxuICB6LWluZGV4OiAxO1xcbiAgLW1vei1ib3gtc2hhZG93OiBpbnNldCAwIC0xcHggMnB4IHJnYmEoODIsOTMsMTEyLDAuNCk7XFxuICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgLTFweCAycHggcmdiYSg4Miw5MywxMTIsMC40KTtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgLTFweCAycHggcmdiYSg4Miw5MywxMTIsMC40KTtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBoZWFkZXIge1xcbmRpc3BsYXk6IGJsb2NrO1xcbnBvc2l0aW9uOiByZWxhdGl2ZTtcXG5taW4taGVpZ2h0OiA2NXB4O1xcbm92ZXJmbG93OiBoaWRkZW47XFxuLW1vei1ib3JkZXItcmFkaXVzOiA2cHggNnB4IDAgMDtcXG4td2Via2l0LWJvcmRlci1yYWRpdXM6IDZweCA2cHggMCAwO1xcbmJvcmRlci1yYWRpdXM6IDZweCA2cHggMCAwO1xcbmJhY2tncm91bmQ6ICNmMWY0ZjY7XFxuYmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwgI2U5ZWRmMCk7XFxuYmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwgI2U5ZWRmMCk7XFxuYmFja2dyb3VuZC1pbWFnZTogLW1zLWxpbmVhci1ncmFkaWVudCgjZjFmNGY2LCAjZTllZGYwKTtcXG5iYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoI2YxZjRmNiwgI2U5ZWRmMCk7XFxuYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KCNmMWY0ZjYsICNlOWVkZjApO1xcbmJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDQwLDY5LDg1LDAuMTEpO1xcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIGhlYWRlcjpiZWZvcmUge1xcbiAgY29udGVudDogJyc7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBoZWlnaHQ6IDVweDtcXG4gIGJvdHRvbTogLTFweDtcXG4gIGxlZnQ6IDA7XFxuICByaWdodDogMDtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCksIHJnYmEoNDAsNjksODUsMC4xKSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLCByZ2JhKDQwLDY5LDg1LDAuMSkpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogLW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDQwLDY5LDg1LDApLCByZ2JhKDQwLDY5LDg1LDAuMSkpO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHJnYmEoNDAsNjksODUsMCksIHJnYmEoNDAsNjksODUsMC4xKSk7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQocmdiYSg0MCw2OSw4NSwwKSwgcmdiYSg0MCw2OSw4NSwwLjEpKTtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBoZWFkZXI6YWZ0ZXIge1xcbmNvbnRlbnQ6ICcnO1xcbnBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5oZWlnaHQ6IDRweDtcXG5ib3R0b206IDA7XFxubGVmdDogMDtcXG5yaWdodDogMDtcXG5iYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChsZWZ0LCAjZTllZGYwLCByZ2JhKDI0MSwyNDQsMjQ2LDApLCAjZTllZGYwKTtcXG5iYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudChsZWZ0LCAjZTllZGYwLCByZ2JhKDI0MSwyNDQsMjQ2LDApLCAjZTllZGYwKTtcXG5iYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KGxlZnQsICNlOWVkZjAsIHJnYmEoMjQxLDI0NCwyNDYsMCksICNlOWVkZjApO1xcbmJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudChsZWZ0LCAjZTllZGYwLCByZ2JhKDI0MSwyNDQsMjQ2LDApLCAjZTllZGYwKTtcXG5iYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQobGVmdCwgI2U5ZWRmMCwgcmdiYSgyNDEsMjQ0LDI0NiwwKSwgI2U5ZWRmMCk7XFxufVxcblxcbi5wb3B1cCAucGFuZWwgaGVhZGVyIGgxIHtcXG4gIHBhZGRpbmc6IDIxcHggMjBweDtcXG4gIG1hcmdpbjogMDtcXG4gIGZvbnQtc2l6ZTogMThweDtcXG4gIGNvbG9yOiAjNDE0NDRhO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0RERTNFNjtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBoZWFkZXIgYSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0ZXh0LWluZGVudDogMjAwJTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHdpZHRoOiAxMnB4O1xcbiAgb3BhY2l0eTogMC40O1xcbiAgcGFkZGluZzogNXB4O1xcbiAgei1pbmRleDogNTtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBoZWFkZXIgYTpob3ZlciB7XFxuICBvcGFjaXR5OiAwLjY2O1xcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIGhlYWRlciBhOmFjdGl2ZSB7XFxuICBvcGFjaXR5OiAxO1xcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIGhlYWRlciBhLmNsb3NlIHtcXG4gIGhlaWdodDogMTJweDtcXG4gIGJhY2tncm91bmQ6IHVybChcXFwiaW1nL2Nsb3NlLnBuZ1xcXCIpIDUwJSA1MCUgbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMnB4IDEycHg7XFxuICByaWdodDogMTlweDtcXG4gIHRvcDogMjFweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBoZWFkZXIgYS5jbG9zZTpob3ZlciB7XFxuICBvcGFjaXR5OiAwLjY2O1xcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIGhlYWRlciBpbWcge1xcbiAgaGVpZ2h0OiAzMnB4O1xcbiAgbWFyZ2luOiAxNnB4IDEwcHggMTBweCAyMHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZmxvYXQ6IGxlZnQ7XFxufVxcblxcbi5hY3Rpb24gLnNwaW5uZXIge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNkE3NzdGO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCdpbWcvc3Bpbm5lci5naWYnKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxuICBtYXJnaW46IDA7XFxuICBoZWlnaHQ6IDQ0cHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjNzc3OyBcXG4gIGJvcmRlci1jb2xvcjogcmdiYSgwLDAsMCwwLjIpOyBcXG4gIGJvcmRlci1ib3R0b20tY29sb3I6ICMzMzM7IFxcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgwLDAsMCwwLjQpOyAgXFxuICAtbW96LWJveC1zaGFkb3c6IGluc2V0IDAgMC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLCBpbnNldCAwIDAgMC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpOyBcXG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksIGluc2V0IDAgMCAwLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7IFxcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksIGluc2V0IDAgMCAwLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7ICAgICAgICAgXFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lOyAgXFxuICB1c2VyLXNlbGVjdDogbm9uZTsgIFxcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAuM2VtOyBcXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogLjNlbTsgXFxuICBib3JkZXItcmFkaXVzOiAuM2VtO1xcbn1cXG5cXG4ucG9wdXAgLnBhbmVsIGZvb3RlciB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIC1tb3otYm9yZGVyLXJhZGl1czogMCAwIDVweCA1cHg7XFxuICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDAgMCA1cHggNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogMCAwIDVweCA1cHg7XFxuICBoZWlnaHQ6IDI1cHg7XFxuICBsaW5lLWhlaWdodDogMjVweDtcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICBtYXJnaW46IDAgMTVweDtcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjRERFM0U2O1xcbiAgei1pbmRleDogNTtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBmb290ZXIgc3BhbiB7XFxuICBmb250LXNpemU6IDEwcHg7XFxuICBjb2xvcjogIzY2NjtcXG59XFxuXFxuLnBvcHVwIC5wYW5lbCBmb290ZXIgYSB7XFxuICBmb250LXNpemU6IDlweDtcXG4gIGNvbG9yOiAjMzMzO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5saXN0LCAuaWNvbmxpc3Qge1xcbiAgbWFyZ2luOiAyNXB4IDA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiA1O1xcbn1cXG5cXG4ubGlzdDpiZWZvcmUsIC5saXN0OmFmdGVyLFxcbi5pY29ubGlzdDpiZWZvcmUsIC5pY29ubGlzdDphZnRlciB7XFxuICBkaXNwbGF5OiB0YWJsZTtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG5cXG4ubGlzdDphZnRlciwgLmljb25saXN0OmFmdGVyIHtcXG4gIGNsZWFyOiBib3RoO1xcbn1cXG5cXG4ubGlzdCBzcGFuIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgbWFyZ2luOiAxMHB4IDA7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5pY29ubGlzdCB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5pY29ubGlzdCBzcGFuIHtcXG4gIG1hcmdpbjogMCAycHg7XFxufVxcblxcbi5mb3Jnb3QtcGFzcyB7XFxuICBmb250LXNpemU6IDEycHg7XFxuICBjb2xvcjogcmdiKDEwMiwgMTAyLCAxMDIpO1xcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG59XFxuXFxuLmNyZWF0ZS1hY2NvdW50IHtcXG4gIGRpc3BsYXk6IG5vbmUgO1xcbiAgbWFyZ2luLXRvcDogMjBweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmNyZWF0ZS1hY2NvdW50IGEge1xcbiAgZm9udC1zaXplOiAxMnB4O1xcbiAgY29sb3I6IHJnYigxMDksIDEwOSwgMTA5KTtcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuLmNyZWF0ZS1hY2NvdW50IGE6aG92ZXIge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxufVxcblxcbi5sb2dnZWRpbiBzcGFuLmNlbnRlcmVkLmFsbCB7XFxuICBjb2xvcjogIzAwOENERDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogNXB4IDA7XFxuICBtYXJnaW46IDE1cHggMCA1cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLmxvZ2dlZGluIHNwYW4uY2VudGVyZWQuYWxsOmhvdmVyIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBcXG59XFxuXFxuLnNpZ251cCAub3B0aW9ucyBhLmNhbmNlbCwgLnJlc2V0IC5vcHRpb25zIGEuY2FuY2VsIHtcXG4gIGNvbG9yOiAjMDA4Q0REO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG4uc2lnbnVwIC5vcHRpb25zIGEuY2FuY2VsOmhvdmVyLCAucmVzZXQgLm9wdGlvbnMgYS5jYW5jZWw6aG92ZXIge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IFxcbn1cXG5cXG4uc2lnbnVwIC5vcHRpb25zLCAucmVzZXQgLm9wdGlvbnMge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogNXB4IDA7XFxuICBtYXJnaW46IDE1cHggMCA1cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuZm9ybSB7XFxuICBtYXJnaW46IDMwcHg7XFxuICBtYXJnaW4tYm90dG9tOiAyMnB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogNTtcXG59XFxuXFxuZm9ybSBsYWJlbCB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGNvbG9yOiAjN0Y4ODk5O1xcbiAgZm9udC1zaXplOiAxM3B4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICBtYXJnaW46IDAgMCA3cHggMDtcXG4gIHRleHQtc2hhZG93OiAwIDFweCAwIHdoaXRlO1xcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtby11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbn1cXG5cXG5mb3JtIGlucHV0IHtcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICB3aWR0aDogMTAwJTtcXG4gIGZvbnQtc2l6ZTogMThweDtcXG4gIHBhZGRpbmc6IDEwcHggMTJweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNCNEJFQ0Q7XFxuICBib3JkZXItdG9wLWNvbG9yOiAjQjBCQUNBO1xcbiAgYm9yZGVyLWJvdHRvbS1jb2xvcjogI0QzRDlFMjtcXG4gIC1tb3otYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLDEzNywxNTAsMC4yMyksIDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjg1KTtcXG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMnB4IHJnYmEoMTMwLCAxMzcsIDE1MCwgMC4yMyksIDAgMXB4IDAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjg1KTtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDJweCByZ2JhKDEzMCwgMTM3LCAxNTAsIDAuMjMpLCAwIDFweCAwIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44NSk7XFxuICAtbW96LWJvcmRlci1yYWRpdXM6IDRweDtcXG4gIC13ZWJraXQtYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgbWFyZ2luOiAwO1xcbiAgZm9udC1mYW1pbHk6ICdIZWx2ZXRpY2EgTmV1ZScsIEhlbHZldGljYSwgQXJpYWwgR2VuZXZhLCBzYW5zLXNlcmlmO1xcbn1cXG5cXG4ucGxhY2Vob2xkZXIge1xcbiAgY29sb3I6ICNjY2M7XFxufVxcblxcbmZvcm0gaW5wdXQ6Zm9jdXMge1xcbiAgYm9yZGVyLWNvbG9yOiAjNTY5NURCICM3MEE3RTQgIzg5QjhFQyAjNzBBN0U0O1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIC1tb3otYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMnB4IHJnYmEoNzAsMTIzLDE4MSwwLjM1KSwgMCAwIDRweCAjNTY5NWRiO1xcbiAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDFweCAycHggcmdiYSg3MCwgMTIzLCAxODEsIDAuMzUpLCAwIDAgNHB4ICM1Njk1REI7XFxuICBib3gtc2hhZG93OiBpbnNldCAwIDFweCAycHggcmdiYSg3MCwgMTIzLCAxODEsIDAuMzUpLCAwIDAgNHB4ICM1Njk1REI7XFxufVxcblxcbmZvcm0gLmludmFsaWQgaW5wdXQge1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlci1jb2xvcjogI0ZGNzA3NjtcXG4gIGJvcmRlci10b3AtY29sb3I6ICNGRjVDNjE7XFxuICAtbW96LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDJweCByZ2JhKDAsMCwwLDAuMiksIDAgMCA0cHggMCByZ2JhKDI1NSwwLDAsMC41KTtcXG4gIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwgMCAwIDRweCAwIHJnYmEoMjU1LCAwLCAwLCAwLjUpO1xcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAxcHggMnB4IHJnYmEoMCwgMCwgMCwgMC4yKSwgMCAwIDRweCAwIHJnYmEoMjU1LCAwLCAwLCAwLjUpO1xcbn1cXG5cXG5oZWFkZXIgLmVycm9yIHtcXG4gIHBhZGRpbmc6IDlweCAwcHg7XFxuICBtYXJnaW46IDEwcHggYXV0bztcXG4gIHdpZHRoOiA3MCU7XFxuICBmb250LXNpemU6IDE0cHg7XFxuICBsaW5lLWhlaWdodDogMTNweDtcXG4gIGNvbG9yOiByZ2IoMTg1LCA4MywgODMpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG5oZWFkZXIgLnN1Y2Nlc3Mge1xcbiAgcGFkZGluZzogOXB4IDBweDtcXG4gIG1hcmdpbjogMTBweCBhdXRvO1xcbiAgd2lkdGg6IDcwJTtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGxpbmUtaGVpZ2h0OiAxM3B4O1xcbiAgY29sb3I6IHJnYigxNSwgMTczLCA0MSk7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbmZvcm0gLm5vdGUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjb2xvcjogIzdGODg5OTtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgbWFyZ2luOiAwIDAgN3B4IDA7XFxuICB0ZXh0LXNoYWRvdzogMCAxcHggMCB3aGl0ZTtcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAta2h0bWwtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcbiAgLW8tdXNlci1zZWxlY3Q6IG5vbmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuZm9ybSAubm90ZSBhIHtcXG4gIGNvbG9yOiAjMDA4Q0REO1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5mb3JtIC5pbnZhbGlkIC5lcnJvciB7XFxuICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xcbn1cXG5cXG5mb3JtIGJ1dHRvbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIG1hcmdpbjogMjBweCAwIDAgMDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uYWN0aW9uIHtcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcbiAgbWFyZ2luOiAwIDMwcHggMzBweCAzMHB4O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgei1pbmRleDogNTtcXG59XFxuXFxuZm9ybSAuYWN0aW9uIHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLmFjdGlvbiBidXR0b24ge1xcbiAgd2lkdGg6IGF1dG87XFxufVxcblxcbi5zZXBhcmF0b3Ige1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiAwIDAgMjVweCAwO1xcbn1cXG5cXG4uc2VwYXJhdG9yOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjsgIFxcbiAgZGlzcGxheTogYmxvY2s7ICBcXG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjN0Y4ODk5O1xcbiAgd2lkdGg6IDIwMHB4O1xcbiAgbGVmdDogNTAlO1xcbiAgbWFyZ2luLWxlZnQ6IC0xMDBweDtcXG4gIGhlaWdodDogMXB4OyAgXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7ICBcXG4gIHRvcDogNTAlOyAgXFxuICB6LWluZGV4OiAxO1xcbn1cXG5cXG4uc2VwYXJhdG9yIHNwYW4ge1xcbiAgYmFja2dyb3VuZDogI2ZhZmFmYTsgIFxcbiAgcGFkZGluZzogMCAxMHB4OyAgXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7ICBcXG4gIHotaW5kZXg6IDU7XFxuICBjb2xvcjogIzdGODg5OTtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgdGV4dC1zaGFkb3c6IDAgMXB4IDAgd2hpdGU7XFxufVxcblxcblxcbnNwYW4uYmFjayB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGNvbG9yOiAjMDA4Q0REO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgcGFkZGluZzogNXB4IDA7XFxuICBtYXJnaW46IDE1cHggMCA1cHg7XFxuICBmb250LXNpemU6IDEzcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiA1O1xcbiAgb3V0bGluZTogMDtcXG59XFxuXFxuc3Bhbi5iYWNrOmhvdmVyIHtcXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyBcXG59XFxuXFxuLnNpZ25pbiAucGFuZWwuc3RyYXRlZ2llcyAubGlzdCAuZW1haWwge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjb2xvcjogIzdGODg5OTtcXG4gIGZvbnQtc2l6ZTogMTNweDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbiAgbWFyZ2luOiAwIDAgN3B4IDA7XFxuICB0ZXh0LXNoYWRvdzogMCAxcHggMCB3aGl0ZTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLnpvY2lhbC5vZmZpY2UzNjU6YmVmb3JlIHtjb250ZW50OiBcXFwiV1xcXCI7fVxcbi56b2NpYWwub2ZmaWNlMzY1IHtiYWNrZ3JvdW5kLWNvbG9yOiAjMDBBQ0VEOyBjb2xvcjogI2ZmZjt9XFxuLnpvY2lhbC53YWFkOmJlZm9yZSB7Y29udGVudDogXFxcInpcXFwiO31cXG4uem9jaWFsLndhYWQge2JhY2tncm91bmQtY29sb3I6ICMwMEFERUY7IGNvbG9yOiAjZmZmO31cXG4uem9jaWFsLnRoaXJ0eXNldmVuc2lnbmFsczpiZWZvcmUge2NvbnRlbnQ6IFxcXCJiXFxcIjt9XFxuLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHMge2JhY2tncm91bmQtY29sb3I6ICM2QUMwNzE7IGNvbG9yOiAjZmZmO31cXG4uem9jaWFsLmJveDpiZWZvcmUge2NvbnRlbnQ6IFxcXCJ4XFxcIjt9XFxuLnpvY2lhbC5ib3gge2JhY2tncm91bmQtY29sb3I6ICMyNjdiYjY7IGNvbG9yOiAjZmZmO31cXG4uem9jaWFsLnNhbGVzZm9yY2U6YmVmb3JlIHtjb250ZW50OiBcXFwiKlxcXCI7fVxcbi56b2NpYWwuc2FsZXNmb3JjZSB7YmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgY29sb3I6ICNmZjAwMDA7fVxcbi56b2NpYWwud2luZG93cyB7YmFja2dyb3VuZC1jb2xvcjogIzI2NzJFQzsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwuZml0Yml0OmJlZm9yZSB7Y29udGVudDogXFxcIiNcXFwiO31cXG4uem9jaWFsLmZpdGJpdCB7YmFja2dyb3VuZC1jb2xvcjogIzQ1QzJDNTsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwueWFuZGV4OmJlZm9yZSB7Y29udGVudDogXFxcIiZcXFwiO31cXG4uem9jaWFsLnlhbmRleCB7YmFja2dyb3VuZC1jb2xvcjogI0ZGMDAwMDsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwucmVucmVuOmJlZm9yZSB7Y29udGVudDogXFxcInJcXFwiO31cXG4uem9jaWFsLnJlbnJlbiB7YmFja2dyb3VuZC1jb2xvcjogIzAwNTZCNTsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwuYmFpZHU6YmVmb3JlIHtjb250ZW50OiBcXFwidVxcXCI7fVxcbi56b2NpYWwuYmFpZHUge2JhY2tncm91bmQtY29sb3I6ICMyODMyRTE7IGNvbG9yOiAjZmZmO31cXG5cXG4ucG9wdXAgLm92ZXJsYXkgLm9uZXN0ZXAge1xcbiAgd2lkdGg6IDM0NXB4O1xcbiAgbWFyZ2luOiAwIDAgMCAtMTcycHg7XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAyODBweCkge1xcbiAgLnBvcHVwIC5vdmVybGF5IC5wYW5lbCB7XFxuICAgIHdpZHRoOiAyNDBweDtcXG4gICAgbWFyZ2luOiAwIDAgMCAtMTIwcHg7XFxuICB9XFxuICAucG9wdXAgLnpvY2lhbCwgLnBvcHVwIGEuem9jaWFsIHtcXG4gICAgLypcXG4gICAgaXQgZG9lc250IGxvb2sgcmlnaHQuXFxuICAgICBmb250LXNpemU6IDlweDtcXG4gICAgICovXFxuICB9XFxuICAuc2lnbmluIC5wb3B1cCAucGFuZWwuc3RyYXRlZ2llcyAubGlzdCB7XFxuICAgIG1hcmdpbjogMTJweDtcXG4gIH1cXG4gIGZvcm0ge1xcbiAgICBtYXJnaW46IDEycHg7XFxuICB9XFxuICBmb3JtIGlucHV0IHtcXG4gICAgcGFkZGluZzogNXB4O1xcbiAgfVxcbiAgLnBvcHVwIC5wYW5lbCBoZWFkZXIge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuICAucG9wdXAgLnBhbmVsIGhlYWRlciBoMSB7XFxuICAgIHBhZGRpbmc6IDE0cHggMTZweDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBmb250LXNpemU6IDIycHg7XFxuICB9XFxuICAucG9wdXAgLnBhbmVsIGhlYWRlciBhLmNsb3NlIHtcXG4gICAgcmlnaHQ6IDE0cHg7XFxuICAgIHRvcDogMTZweDtcXG4gIH1cXG59XFxuXFxuQG1lZGlhICAobWluLXdpZHRoOiAyODFweCkgYW5kIChtYXgtd2lkdGg6IDM0MHB4KSB7XFxuICAucG9wdXAgLm92ZXJsYXkgLnBhbmVsIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBib3JkZXItcmFkaXVzOiAwO1xcbiAgfVxcbiAgLnBvcHVwIC56b2NpYWwsIC5wb3B1cCBhLnpvY2lhbCB7XFxuICAgIGZvbnQtc2l6ZTogMThweDtcXG4gIH1cXG4gIC5zaWduaW4gLnBvcHVwIC5wYW5lbC5zdHJhdGVnaWVzIC5saXN0IHtcXG4gICAgbWFyZ2luOiAxNXB4O1xcbiAgfVxcbiAgZm9ybSB7XFxuICAgIG1hcmdpbjogMTVweCAyNXB4O1xcbiAgfVxcbiAgZm9ybSBpbnB1dCB7XFxuICAgIHBhZGRpbmc6IDZweDtcXG4gICAgZm9udC1zaXplOiAxOHB4O1xcbiAgfVxcbiAgLnBvcHVwIC5wYW5lbCBoZWFkZXIge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIG1pbi1oZWlnaHQ6IDMycHg7XFxuICB9XFxuICAucG9wdXAgLnBhbmVsIGhlYWRlciBoMSB7XFxuICAgIHBhZGRpbmc6IDEycHggMTZweDtcXG4gICAgbWFyZ2luLXRvcDogMXB4O1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICB9XFxuXFxuICAucG9wdXAgLnBhbmVsIGhlYWRlciBpbWcge1xcbiAgICBoZWlnaHQ6IDMycHg7XFxuICAgIG1hcmdpbjogOXB4IDEwcHggNnB4IDE4cHg7XFxuICB9XFxuXFxuICAuem9jaWFsLnByaW1hcnkge1xcbiAgICBsaW5lLWhlaWdodDogMzRweDtcXG4gIH1cXG5cXG4gIC5hY3Rpb24gLnNwaW5uZXIge1xcbiAgICBoZWlnaHQ6IDM0cHg7XFxuICB9XFxuXFxuICAuY3JlYXRlLWFjY291bnQge1xcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xcbiAgfVxcblxcbiAgLnBvcHVwIC5vdmVybGF5IC5lbWFpbCB7XFxuICAgIG1hcmdpbi1ib3R0b206IDVweDtcXG4gIH1cXG5cXG4gIC5wb3B1cCAub3ZlcmxheSAucGFzc3dvcmQsIC5wb3B1cCAub3ZlcmxheSAucmVwZWF0UGFzc3dvcmQge1xcbiAgICBtYXJnaW4tYm90dG9tOiA1cHg7XFxuICB9XFxufVxcblxcbi5sb2FkaW5nIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICBib3JkZXI6IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBsZWZ0OiAwO1xcbiAgdG9wOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB6LWluZGV4OiAxMDAwMDA7XFxuICBmb250LXdlaWdodDogMjAwO1xcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC1raHRtbC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxuICAtby11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsMjU1LDI1NSwwLjUpO1xcbn1cXG5cXG4ubG9hZGluZyAubWVzc2FnZSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDUwJTtcXG4gIG1hcmdpbi10b3A6IC0xMTBweDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbiAgZm9udC1mYW1pbHk6IEhlbHZldGljYSwgYXJpYWwsIGZyZWVzYW5zLCBjbGVhbiwgc2Fucy1zZXJpZjtcXG4gIGNvbG9yOiAjMzMzO1xcbn1cXG5cXG4ubG9hZGluZyAuYmFsbHMge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgbGVmdDogNTAlO1xcbiAgdG9wOiA1MCU7XFxuICBtYXJnaW4tbGVmdDogLTQ1cHg7XFxuICBtYXJnaW4tdG9wOiAtNDVweDtcXG4gIHdpZHRoOiA5MHB4O1xcbiAgaGVpZ2h0OjkwcHg7XFxufVxcblxcbi5sb2FkaW5nIC5iYWxscyA+IGRpdiB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB3aWR0aDogODZweDtcXG4gIGhlaWdodDogODZweDtcXG4gIG9wYWNpdHk6IDA7XFxuICAtbW96LXRyYW5zZm9ybTogcm90YXRlKDIyNWRlZyk7XFxuICAtbW96LWFuaW1hdGlvbjogb3JiaXQgNy4xNXMgaW5maW5pdGU7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDIyNWRlZyk7XFxuICAtd2Via2l0LWFuaW1hdGlvbjogb3JiaXQgNy4xNXMgaW5maW5pdGU7XFxuICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoMjI1ZGVnKTtcXG4gIC1tcy1hbmltYXRpb246IG9yYml0IDcuMTVzIGluZmluaXRlO1xcbiAgLW8tdHJhbnNmb3JtOiByb3RhdGUoMjI1ZGVnKTtcXG4gIC1vLWFuaW1hdGlvbjogb3JiaXQgNy4xNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSgyMjVkZWcpO1xcbiAgYW5pbWF0aW9uOiBvcmJpdCA3LjE1cyBpbmZpbml0ZTtcXG59XFxuXFxuLmxvYWRpbmcgLmJhbGxzID4gZGl2ID4gZGl2e1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgd2lkdGg6IDExcHg7XFxuICBoZWlnaHQ6IDExcHg7XFxuICBiYWNrZ3JvdW5kOiAjMzMzO1xcbiAgbGVmdDowcHg7XFxuICB0b3A6MHB4O1xcbiAgLW1vei1ib3JkZXItcmFkaXVzOiAxMXB4O1xcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOiAxMXB4O1xcbiAgLW1zLWJvcmRlci1yYWRpdXM6IDExcHg7XFxuICAtby1ib3JkZXItcmFkaXVzOiAxMXB4O1xcbiAgYm9yZGVyLXJhZGl1czogMTFweDtcXG59XFxuXFxuLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDEge1xcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDEuNTZzO1xcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDEuNTZzO1xcbiAgLW1zLWFuaW1hdGlvbi1kZWxheTogMS41NnM7XFxuICAtby1hbmltYXRpb24tZGVsYXk6IDEuNTZzO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAxLjU2cztcXG59XFxuXFxuLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDIge1xcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDAuMzFzO1xcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDAuMzFzO1xcbiAgLW1zLWFuaW1hdGlvbi1kZWxheTogMC4zMXM7XFxuICAtby1hbmltYXRpb24tZGVsYXk6IDAuMzFzO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjMxcztcXG59XFxuXFxuLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDMge1xcbiAgLW1vei1hbmltYXRpb24tZGVsYXk6IDAuNjJzO1xcbiAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IDAuNjJzO1xcbiAgLW1zLWFuaW1hdGlvbi1kZWxheTogMC42MnM7XFxuICAtby1hbmltYXRpb24tZGVsYXk6IDAuNjJzO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjYycztcXG59XFxuXFxuLmxvYWRpbmcgLmJhbGxzIC5iYWxsMDQge1xcbi1tb3otYW5pbWF0aW9uLWRlbGF5OiAwLjk0cztcXG4td2Via2l0LWFuaW1hdGlvbi1kZWxheTogMC45NHM7XFxuLW1zLWFuaW1hdGlvbi1kZWxheTogMC45NHM7XFxuLW8tYW5pbWF0aW9uLWRlbGF5OiAwLjk0cztcXG5hbmltYXRpb24tZGVsYXk6IDAuOTRzO1xcbn1cXG5cXG4ubG9hZGluZyAuYmFsbHMgLmJhbGwwNSB7XFxuICAtbW96LWFuaW1hdGlvbi1kZWxheTogMS4yNXM7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogMS4yNXM7XFxuICAtbXMtYW5pbWF0aW9uLWRlbGF5OiAxLjI1cztcXG4gIC1vLWFuaW1hdGlvbi1kZWxheTogMS4yNXM7XFxuICBhbmltYXRpb24tZGVsYXk6IDEuMjVzO1xcbn1cXG5cXG5ALW1vei1rZXlmcmFtZXMgb3JiaXQge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB6LWluZGV4Ojk5O1xcbiAgICAtbW96LXRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XFxuICAgIC1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxuICB9XFxuXFxuICA3JSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC1tb3otdHJhbnNmb3JtOiByb3RhdGUoMzAwZGVnKTtcXG4gICAgLW1vei1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxuICAgIC1tb3otb3JpZ2luOjAlO1xcbiAgfVxcblxcbiAgMzAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLW1vei10cmFuc2Zvcm06cm90YXRlKDQxMGRlZyk7XFxuICAgIC1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7XFxuICAgIC1tb3otb3JpZ2luOjclO1xcbiAgfVxcblxcbiAgMzklIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZSg2NDVkZWcpO1xcbiAgICAtbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGxpbmVhcjtcXG4gICAgLW1vei1vcmlnaW46MzAlO1xcbiAgfVxcblxcbiAgNzAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLW1vei10cmFuc2Zvcm06IHJvdGF0ZSg3NzBkZWcpO1xcbiAgICAtbW96LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgICAtbW96LW9yaWdpbjozOSU7XFxuICB9XFxuXFxuICA3NSUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtbW96LXRyYW5zZm9ybTogcm90YXRlKDkwMGRlZyk7XFxuICAgIC1tb3otYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxuICAgIC1tb3otb3JpZ2luOjcwJTtcXG4gIH1cXG5cXG4gIDc2JSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIC1tb3otdHJhbnNmb3JtOnJvdGF0ZSg5MDBkZWcpO1xcbiAgfVxcblxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIC1tb3otdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG59XFxuXFxuQC13ZWJraXQta2V5ZnJhbWVzIG9yYml0IHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgei1pbmRleDo5OTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgfVxcblxcbiAgNyUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDMwMGRlZyk7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogbGluZWFyO1xcbiAgICAtd2Via2l0LW9yaWdpbjowJTtcXG4gIH1cXG5cXG4gIDMwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2UtaW4tb3V0O1xcbiAgICAtd2Via2l0LW9yaWdpbjo3JTtcXG4gIH1cXG5cXG4gIDM5JSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoNjQ1ZGVnKTtcXG4gICAgLXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxuICAgIC13ZWJraXQtb3JpZ2luOjMwJTtcXG4gIH1cXG5cXG4gIDcwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoNzcwZGVnKTtcXG4gICAgLXdlYmtpdC1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXG4gICAgLXdlYmtpdC1vcmlnaW46MzklO1xcbiAgfVxcblxcbiAgNzUlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSg5MDBkZWcpO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgICAtd2Via2l0LW9yaWdpbjo3MCU7XFxuICB9XFxuXFxuICA3NiUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDkwMGRlZyk7XFxuICB9XFxuXFxufVxcblxcbkAtbXMta2V5ZnJhbWVzIG9yYml0IHtcXG4gIDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgei1pbmRleDo5OTtcXG4gICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XFxuICAgIC1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXG4gIH1cXG5cXG4gIDclIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKDMwMGRlZyk7XFxuICAgIC1tcy1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxuICAgIC1tcy1vcmlnaW46MCU7XFxuICB9XFxuXFxuICAzMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtbXMtdHJhbnNmb3JtOnJvdGF0ZSg0MTBkZWcpO1xcbiAgICAtbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7XFxuICAgIC1tcy1vcmlnaW46NyU7XFxuICB9XFxuXFxuICAzOSUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoNjQ1ZGVnKTtcXG4gICAgLW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGxpbmVhcjtcXG4gICAgLW1zLW9yaWdpbjozMCU7XFxuICB9XFxuXFxuICA3MCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoNzcwZGVnKTtcXG4gICAgLW1zLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgICAtbXMtb3JpZ2luOjM5JTtcXG4gIH1cXG5cXG4gIDc1JSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC1tcy10cmFuc2Zvcm06IHJvdGF0ZSg5MDBkZWcpO1xcbiAgICAtbXMtYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxuICAgIC1tcy1vcmlnaW46NzAlO1xcbiAgfVxcblxcbiAgNzYlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLW1zLXRyYW5zZm9ybTpyb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG59XFxuXFxuQC1vLWtleWZyYW1lcyBvcmJpdCB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHotaW5kZXg6OTk7XFxuICAgIC1vLXRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XFxuICAgIC1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgfVxcblxcbiAgNyUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtby10cmFuc2Zvcm06IHJvdGF0ZSgzMDBkZWcpO1xcbiAgICAtby1hbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxuICAgIC1vLW9yaWdpbjowJTtcXG4gIH1cXG5cXG4gIDMwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC1vLXRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTtcXG4gICAgLW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7XFxuICAgIC1vLW9yaWdpbjo3JTtcXG4gIH1cXG5cXG4gIDM5JSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC1vLXRyYW5zZm9ybTogcm90YXRlKDY0NWRlZyk7XFxuICAgIC1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGxpbmVhcjtcXG4gICAgLW8tb3JpZ2luOjMwJTtcXG4gIH1cXG5cXG4gIDcwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIC1vLXRyYW5zZm9ybTogcm90YXRlKDc3MGRlZyk7XFxuICAgIC1vLWFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgICAtby1vcmlnaW46MzklO1xcbiAgfVxcblxcbiAgNzUlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLW8tdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gICAgLW8tYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxuICAgIC1vLW9yaWdpbjo3MCU7XFxuICB9XFxuXFxuICA3NiUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtby10cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgLW8tdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG59XFxuXFxuQGtleWZyYW1lcyBvcmJpdCB7XFxuICAgIDAlIHtcXG4gICAgICBvcGFjaXR5OiAxO1xcbiAgICAgIHotaW5kZXg6OTk7XFxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcXG4gICAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXG4gICAgfVxcblxcbiAgNyUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzMDBkZWcpO1xcbiAgICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XFxuICAgIG9yaWdpbjowJTtcXG4gIH1cXG5cXG4gIDMwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTpyb3RhdGUoNDEwZGVnKTtcXG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1pbi1vdXQ7XFxuICAgIG9yaWdpbjo3JTtcXG4gIH1cXG5cXG4gIDM5JSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDY0NWRlZyk7XFxuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGxpbmVhcjtcXG4gICAgb3JpZ2luOjMwJTtcXG4gIH1cXG5cXG4gIDcwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDc3MGRlZyk7XFxuICAgIGFuaW1hdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcbiAgICBvcmlnaW46MzklO1xcbiAgfVxcblxcbiAgNzUlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxuICAgIG9yaWdpbjo3MCU7XFxuICB9XFxuXFxuICA3NiUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB0cmFuc2Zvcm06cm90YXRlKDkwMGRlZyk7XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoOTAwZGVnKTtcXG4gIH1cXG5cXG59XFxuXFxuaW5wdXRbZGlzYWJsZWRde1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDIxNywgMjIyLCAyMjQpO1xcbn1cIik7XG4gIGluc2VydENzcyhcIkBjaGFyc2V0IFxcXCJVVEYtOFxcXCI7XFxuXFxuLyohXFxuXFx0Wm9jaWFsIEJ1dG9uc1xcblxcdGh0dHA6Ly96b2NpYWwuc21jbGxucy5jb21cXG5cXHRieSBTYW0gQ29sbGlucyAoQHNtY2xsbnMpXFxuXFx0TGljZW5zZTogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxcblxcdFxcblxcdFlvdSBhcmUgZnJlZSB0byB1c2UgYW5kIG1vZGlmeSwgYXMgbG9uZyBhcyB5b3Uga2VlcCB0aGlzIGxpY2Vuc2UgY29tbWVudCBpbnRhY3Qgb3IgbGluayBiYWNrIHRvIHpvY2lhbC5zbWNsbG5zLmNvbSBvbiB5b3VyIHNpdGUuXFxuKi9cXG5cXG5cXG4vKiBCdXR0b24gc3RydWN0dXJlICovXFxuXFxuLnpvY2lhbCxcXG5hLnpvY2lhbCB7XFxuXFx0Ym9yZGVyOiAxcHggc29saWQgIzc3NztcXG5cXHRib3JkZXItY29sb3I6IHJnYmEoMCwwLDAsMC4yKTtcXG5cXHRib3JkZXItYm90dG9tLWNvbG9yOiAjMzMzO1xcblxcdGJvcmRlci1ib3R0b20tY29sb3I6IHJnYmEoMCwwLDAsMC40KTtcXG5cXHRjb2xvcjogI2ZmZjtcXG5cXHQtbW96LWJveC1zaGFkb3c6IGluc2V0IDAgMC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjQpLCBpbnNldCAwIDAgMC4xZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjkpO1xcblxcdC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksIGluc2V0IDAgMCAwLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7XFxuXFx0Ym94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNCksIGluc2V0IDAgMCAwLjFlbSByZ2JhKDI1NSwyNTUsMjU1LDAuOSk7XFxuXFx0Y3Vyc29yOiBwb2ludGVyO1xcblxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cXHRmb250OiBib2xkIDEwMCUvMi4xIFxcXCJMdWNpZGEgR3JhbmRlXFxcIiwgVGFob21hLCBzYW5zLXNlcmlmO1xcblxcdHBhZGRpbmc6IDAgLjk1ZW0gMCAwO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXFx0dGV4dC1zaGFkb3c6IDAgMXB4IDAgcmdiYSgwLDAsMCwwLjUpO1xcblxcdHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuXFx0XFxuXFx0LW1vei11c2VyLXNlbGVjdDogbm9uZTtcXG5cXHQtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcblxcdHVzZXItc2VsZWN0OiBub25lO1xcblxcdFxcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXHRcXG5cXHQtbW96LWJvcmRlci1yYWRpdXM6IC4zZW07XFxuXFx0LXdlYmtpdC1ib3JkZXItcmFkaXVzOiAuM2VtO1xcblxcdGJvcmRlci1yYWRpdXM6IC4zZW07XFxufVxcblxcbi56b2NpYWw6YmVmb3JlIHtcXG5cXHRjb250ZW50OiBcXFwiXFxcIjtcXG5cXHRib3JkZXItcmlnaHQ6IDAuMDc1ZW0gc29saWQgcmdiYSgwLDAsMCwwLjEpO1xcblxcdGZsb2F0OiBsZWZ0O1xcblxcdGZvbnQ6IDEyMCUvMS42NSB6b2NpYWw7XFxuXFx0Zm9udC1zdHlsZTogbm9ybWFsO1xcblxcdGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuXFx0bWFyZ2luOiAwIDAuNWVtIDAgMDtcXG5cXHRwYWRkaW5nOiAwIDAuNWVtO1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXFx0dGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuXFx0XFxuXFx0LW1vei1ib3gtc2hhZG93OiAwLjA3NWVtIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpO1xcblxcdC13ZWJraXQtYm94LXNoYWRvdzogMC4wNzVlbSAwIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjI1KTtcXG5cXHRib3gtc2hhZG93OiAwLjA3NWVtIDAgMCByZ2JhKDI1NSwyNTUsMjU1LDAuMjUpO1xcblxcdFxcblxcdC1tb3otZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcblxcdC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcblxcdGZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG59XFxuXFxuLnpvY2lhbDphY3RpdmUge1xcblxcdG91dGxpbmU6IG5vbmU7IC8qIG91dGxpbmUgaXMgdmlzaWJsZSBvbiA6Zm9jdXMgKi9cXG59XFxuXFxuLyogQnV0dG9ucyBjYW4gYmUgZGlzcGxheWVkIGFzIHN0YW5kYWxvbmUgaWNvbnMgYnkgYWRkaW5nIGEgY2xhc3Mgb2YgXFxcImljb25cXFwiICovXFxuXFxuLnpvY2lhbC5pY29uIHtcXG5cXHRvdmVyZmxvdzogaGlkZGVuO1xcblxcdG1heC13aWR0aDogMi40ZW07XFxuXFx0cGFkZGluZy1sZWZ0OiAwO1xcblxcdHBhZGRpbmctcmlnaHQ6IDA7XFxuXFx0bWF4LWhlaWdodDogMi4xNWVtO1xcblxcdHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcbi56b2NpYWwuaWNvbjpiZWZvcmUge1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0d2lkdGg6IDJlbTtcXG5cXHRoZWlnaHQ6IDJlbTtcXG5cXHRcXG5cXHRib3gtc2hhZG93OiBub25lO1xcblxcdGJvcmRlcjogbm9uZTtcXG59XFxuXFxuLyogR3JhZGllbnRzICovXFxuXFxuLnpvY2lhbCB7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLW1vei1saW5lYXItZ3JhZGllbnQocmdiYSgyNTUsMjU1LDI1NSwuMSksIHJnYmEoMjU1LDI1NSwyNTUsLjA1KSA0OSUsIHJnYmEoMCwwLDAsLjA1KSA1MSUsIHJnYmEoMCwwLDAsLjEpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjEpLCByZ2JhKDI1NSwyNTUsMjU1LC4wNSkgNDklLCByZ2JhKDAsMCwwLC4wNSkgNTElLCByZ2JhKDAsMCwwLC4xKSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjEpLCByZ2JhKDI1NSwyNTUsMjU1LC4wNSkgNDklLCByZ2JhKDAsMCwwLC4wNSkgNTElLCByZ2JhKDAsMCwwLC4xKSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgZnJvbShyZ2JhKDI1NSwyNTUsMjU1LC4xKSksIGNvbG9yLXN0b3AoNDklLCByZ2JhKDI1NSwyNTUsMjU1LC4wNSkpLCBjb2xvci1zdG9wKDUxJSwgcmdiYSgwLDAsMCwuMDUpKSwgdG8ocmdiYSgwLDAsMCwuMSkpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4xKSwgcmdiYSgyNTUsMjU1LDI1NSwuMDUpIDQ5JSwgcmdiYSgwLDAsMCwuMDUpIDUxJSwgcmdiYSgwLDAsMCwuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4xKSwgcmdiYSgyNTUsMjU1LDI1NSwuMDUpIDQ5JSwgcmdiYSgwLDAsMCwuMDUpIDUxJSwgcmdiYSgwLDAsMCwuMSkpO1xcbn1cXG5cXG4uem9jaWFsOmhvdmVyLCAuem9jaWFsOmZvY3VzIHtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtbW96LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4xNSkgNDklLCByZ2JhKDAsMCwwLC4xKSA1MSUsIHJnYmEoMCwwLDAsLjE1KSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLW1zLWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4xNSkgNDklLCByZ2JhKDAsMCwwLC4xKSA1MSUsIHJnYmEoMCwwLDAsLjE1KSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLW8tbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjE1KSA0OSUsIHJnYmEoMCwwLDAsLjEpIDUxJSwgcmdiYSgwLDAsMCwuMTUpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWdyYWRpZW50KGxpbmVhciwgbGVmdCB0b3AsIGxlZnQgYm90dG9tLCBmcm9tKHJnYmEoMjU1LDI1NSwyNTUsLjE1KSksIGNvbG9yLXN0b3AoNDklLCByZ2JhKDI1NSwyNTUsMjU1LC4xNSkpLCBjb2xvci1zdG9wKDUxJSwgcmdiYSgwLDAsMCwuMSkpLCB0byhyZ2JhKDAsMCwwLC4xNSkpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudChyZ2JhKDI1NSwyNTUsMjU1LC4xNSkgNDklLCByZ2JhKDAsMCwwLC4xKSA1MSUsIHJnYmEoMCwwLDAsLjE1KSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHJnYmEoMjU1LDI1NSwyNTUsLjE1KSA0OSUsIHJnYmEoMCwwLDAsLjEpIDUxJSwgcmdiYSgwLDAsMCwuMTUpKTtcXG59XFxuXFxuLnpvY2lhbDphY3RpdmUge1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwuMSksIHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMCwwLDAsLjEpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwuMSksIHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLCB0cmFuc3BhcmVudCA1MCUsIHJnYmEoMCwwLDAsLjEpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQoYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LC4xKSwgcmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgwLDAsMCwuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGZyb20ocmdiYSgyNTUsMjU1LDI1NSwuMSkpLCBjb2xvci1zdG9wKDMwJSwgcmdiYSgyNTUsMjU1LDI1NSwwKSksIGNvbG9yLXN0b3AoNTAlLCB0cmFuc3BhcmVudCksIHRvKHJnYmEoMCwwLDAsLjEpKSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoYm90dG9tLCByZ2JhKDI1NSwyNTUsMjU1LC4xKSwgcmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsIHRyYW5zcGFyZW50IDUwJSwgcmdiYSgwLDAsMCwuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsLjEpLCByZ2JhKDI1NSwyNTUsMjU1LDApIDMwJSwgdHJhbnNwYXJlbnQgNTAlLCByZ2JhKDAsMCwwLC4xKSk7XFxufVxcblxcbi8qIEFkanVzdG1lbnRzIGZvciBsaWdodCBiYWNrZ3JvdW5kIGJ1dHRvbnMgKi9cXG5cXG4uem9jaWFsLmRyb3Bib3gsXFxuLnpvY2lhbC5naXRodWIsXFxuLnpvY2lhbC5nbWFpbCxcXG4uem9jaWFsLm9wZW5pZCxcXG4uem9jaWFsLnNlY29uZGFyeSxcXG4uem9jaWFsLnN0YWNrb3ZlcmZsb3csXFxuLnpvY2lhbC5zYWxlc2ZvcmNlIHtcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjYWFhO1xcblxcdGJvcmRlci1jb2xvcjogcmdiYSgwLDAsMCwwLjMpO1xcblxcdGJvcmRlci1ib3R0b20tY29sb3I6ICM3Nzc7XFxuXFx0Ym9yZGVyLWJvdHRvbS1jb2xvcjogcmdiYSgwLDAsMCwwLjUpO1xcblxcdC1tb3otYm94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksIGluc2V0IDAgMCAwLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO1xcblxcdC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwLjA4ZW0gMCByZ2JhKDI1NSwyNTUsMjU1LDAuNyksIGluc2V0IDAgMCAwLjA4ZW0gcmdiYSgyNTUsMjU1LDI1NSwwLjUpO1xcblxcdGJveC1zaGFkb3c6IGluc2V0IDAgMC4wOGVtIDAgcmdiYSgyNTUsMjU1LDI1NSwwLjcpLCBpbnNldCAwIDAgMC4wOGVtIHJnYmEoMjU1LDI1NSwyNTUsMC41KTtcXG5cXHR0ZXh0LXNoYWRvdzogMCAxcHggMCByZ2JhKDI1NSwyNTUsMjU1LDAuOCk7XFxufVxcblxcbi8qIDpob3ZlciBhZGp1c3RtZW50cyBmb3IgbGlnaHQgYmFja2dyb3VuZCBidXR0b25zICovXFxuXFxuLnpvY2lhbC5kcm9wYm94OmZvY3VzLFxcbi56b2NpYWwuZHJvcGJveDpob3ZlcixcXG4uem9jaWFsLmdpdGh1Yjpmb2N1cyxcXG4uem9jaWFsLmdpdGh1Yjpob3ZlcixcXG4uem9jaWFsLmdtYWlsOmZvY3VzLFxcbi56b2NpYWwuZ21haWw6aG92ZXIsXFxuLnpvY2lhbC5vcGVuaWQ6Zm9jdXMsXFxuLnpvY2lhbC5vcGVuaWQ6aG92ZXIsXFxuLnpvY2lhbC5zZWNvbmRhcnk6Zm9jdXMsXFxuLnpvY2lhbC5zZWNvbmRhcnk6aG92ZXIsXFxuLnpvY2lhbC5zdGFja292ZXJmbG93OmZvY3VzLFxcbi56b2NpYWwuc3RhY2tvdmVyZmxvdzpob3ZlcixcXG4uem9jaWFsLnR3aXR0ZXI6Zm9jdXMgXFxuLnpvY2lhbC50d2l0dGVyOmhvdmVyLFxcbi56b2NpYWwuc2FsZXNmb3JjZTpmb2N1cyBcXG4uem9jaWFsLnNhbGVzZm9yY2U6aG92ZXIge1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtZ3JhZGllbnQobGluZWFyLCBsZWZ0IHRvcCwgbGVmdCBib3R0b20sIGZyb20ocmdiYSgyNTUsMjU1LDI1NSwwLjUpKSwgY29sb3Itc3RvcCg0OSUsIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSksIGNvbG9yLXN0b3AoNTElLCByZ2JhKDAsMCwwLDAuMDUpKSwgdG8ocmdiYSgwLDAsMCwwLjE1KSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLCByZ2JhKDAsMCwwLDAuMDUpIDUxJSwgcmdiYSgwLDAsMCwwLjE1KSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSksIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUsIHJnYmEoMCwwLDAsMC4wNSkgNTElLCByZ2JhKDAsMCwwLDAuMTUpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCByZ2JhKDI1NSwyNTUsMjU1LDAuNSksIHJnYmEoMjU1LDI1NSwyNTUsMC4yKSA0OSUsIHJnYmEoMCwwLDAsMC4wNSkgNTElLCByZ2JhKDAsMCwwLDAuMTUpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLCByZ2JhKDAsMCwwLDAuMDUpIDUxJSwgcmdiYSgwLDAsMCwwLjE1KSk7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgyNTUsMjU1LDI1NSwwLjUpLCByZ2JhKDI1NSwyNTUsMjU1LDAuMikgNDklLCByZ2JhKDAsMCwwLDAuMDUpIDUxJSwgcmdiYSgwLDAsMCwwLjE1KSk7XFxufVxcblxcbi8qIDphY3RpdmUgYWRqdXN0bWVudHMgZm9yIGxpZ2h0IGJhY2tncm91bmQgYnV0dG9ucyAqL1xcblxcbi56b2NpYWwuZHJvcGJveDphY3RpdmUsXFxuLnpvY2lhbC5naXRodWI6YWN0aXZlLFxcbi56b2NpYWwuZ21haWw6YWN0aXZlLFxcbi56b2NpYWwub3BlbmlkOmFjdGl2ZSxcXG4uem9jaWFsLnNlY29uZGFyeTphY3RpdmUsXFxuLnpvY2lhbC5zdGFja292ZXJmbG93OmFjdGl2ZSxcXG4uem9jaWFsLndpa2lwZWRpYTphY3RpdmUsXFxuLnpvY2lhbC5zYWxlc2ZvcmNlOmFjdGl2ZSB7XFxuXFx0YmFja2dyb3VuZC1pbWFnZTogLXdlYmtpdC1ncmFkaWVudChsaW5lYXIsIGxlZnQgdG9wLCBsZWZ0IGJvdHRvbSwgZnJvbShyZ2JhKDI1NSwyNTUsMjU1LDApKSwgY29sb3Itc3RvcCgzMCUsIHJnYmEoMjU1LDI1NSwyNTUsMCkpLCBjb2xvci1zdG9wKDUwJSwgcmdiYSgwLDAsMCwwKSksIHRvKHJnYmEoMCwwLDAsMC4xKSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC1tb3otbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwwKSwgcmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsIHJnYmEoMCwwLDAsMCkgNTAlLCByZ2JhKDAsMCwwLDAuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwwKSwgcmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsIHJnYmEoMCwwLDAsMCkgNTAlLCByZ2JhKDAsMCwwLDAuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IC1vLWxpbmVhci1ncmFkaWVudChib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsMCksIHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLCByZ2JhKDAsMCwwLDApIDUwJSwgcmdiYSgwLDAsMCwwLjEpKTtcXG5cXHRiYWNrZ3JvdW5kLWltYWdlOiAtbXMtbGluZWFyLWdyYWRpZW50KGJvdHRvbSwgcmdiYSgyNTUsMjU1LDI1NSwwKSwgcmdiYSgyNTUsMjU1LDI1NSwwKSAzMCUsIHJnYmEoMCwwLDAsMCkgNTAlLCByZ2JhKDAsMCwwLDAuMSkpO1xcblxcdGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChib3R0b20sIHJnYmEoMjU1LDI1NSwyNTUsMCksIHJnYmEoMjU1LDI1NSwyNTUsMCkgMzAlLCByZ2JhKDAsMCwwLDApIDUwJSwgcmdiYSgwLDAsMCwwLjEpKTtcXG59XFxuXFxuLyogQnV0dG9uIGljb24gYW5kIGNvbG9yICovXFxuLyogSWNvbiBjaGFyYWN0ZXJzIGFyZSBzdG9yZWQgaW4gdW5pY29kZSBwcml2YXRlIGFyZWEgKi9cXG4uem9jaWFsLmFtYXpvbjpiZWZvcmUge2NvbnRlbnQ6IFxcXCJhXFxcIjt9XFxuLnpvY2lhbC5kcm9wYm94OmJlZm9yZSB7Y29udGVudDogXFxcImRcXFwiOyBjb2xvcjogIzFmNzVjYzt9XFxuLnpvY2lhbC5mYWNlYm9vazpiZWZvcmUge2NvbnRlbnQ6IFxcXCJmXFxcIjt9XFxuLnpvY2lhbC5naXRodWI6YmVmb3JlIHtjb250ZW50OiBcXFwiXFxcXDAwRThcXFwiO31cXG4uem9jaWFsLmdtYWlsOmJlZm9yZSB7Y29udGVudDogXFxcIm1cXFwiOyBjb2xvcjogI2YwMDt9XFxuLnpvY2lhbC5nb29nbGU6YmVmb3JlIHtjb250ZW50OiBcXFwiR1xcXCI7fVxcbi56b2NpYWwuZ29vZ2xlcGx1czpiZWZvcmUge2NvbnRlbnQ6IFxcXCIrXFxcIjt9XFxuLnpvY2lhbC5ndWVzdDpiZWZvcmUge2NvbnRlbnQ6IFxcXCI/XFxcIjt9XFxuLnpvY2lhbC5pZTpiZWZvcmUge2NvbnRlbnQ6IFxcXCI2XFxcIjt9XFxuLnpvY2lhbC5saW5rZWRpbjpiZWZvcmUge2NvbnRlbnQ6IFxcXCJMXFxcIjt9XFxuLnpvY2lhbC5vcGVuaWQ6YmVmb3JlIHtjb250ZW50OiBcXFwib1xcXCI7IGNvbG9yOiAjZmY5MjFkO31cXG4uem9jaWFsLnBheXBhbDpiZWZvcmUge2NvbnRlbnQ6IFxcXCIkXFxcIjt9XFxuLnpvY2lhbC5zdGFja292ZXJmbG93OmJlZm9yZSB7Y29udGVudDogXFxcIlxcXFwwMEVDXFxcIjsgY29sb3I6ICNmZjdhMTU7fVxcbi56b2NpYWwudHdpdHRlcjpiZWZvcmUge2NvbnRlbnQ6IFxcXCJUXFxcIjt9XFxuLnpvY2lhbC52azpiZWZvcmUge2NvbnRlbnQ6IFxcXCJOXFxcIjt9XFxuLnpvY2lhbC53aW5kb3dzOmJlZm9yZSB7Y29udGVudDogXFxcIldcXFwiO31cXG4uem9jaWFsLnlhaG9vOmJlZm9yZSB7Y29udGVudDogXFxcIllcXFwiO31cXG4uem9jaWFsLm9mZmljZTM2NTpiZWZvcmUge2NvbnRlbnQ6IFxcXCJ6XFxcIjt9XFxuLnpvY2lhbC50aGlydHlzZXZlbnNpZ25hbHM6YmVmb3JlIHtjb250ZW50OiBcXFwiYlxcXCI7fVxcbi56b2NpYWwuc2FsZXNmb3JjZTpiZWZvcmUge2NvbnRlbnQ6IFxcXCIqXFxcIjt9XFxuLnpvY2lhbC53YWFkOmJlZm9yZSB7Y29udGVudDogXFxcInpcXFwiO31cXG4uem9jaWFsLmJveDpiZWZvcmUge2NvbnRlbnQ6IFxcXCJ4XFxcIjt9XFxuXFxuLyogQnV0dG9uIGJhY2tncm91bmQgYW5kIHRleHQgY29sb3IgKi9cXG5cXG4uem9jaWFsLmFtYXpvbiB7YmFja2dyb3VuZC1jb2xvcjogI2ZmYWQxZDsgY29sb3I6ICMwMzAwMzc7IHRleHQtc2hhZG93OiAwIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC41KTt9XFxuLnpvY2lhbC5kcm9wYm94IHtiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOyBjb2xvcjogIzMxMmMyYTt9XFxuLnpvY2lhbC5mYWNlYm9vayB7YmFja2dyb3VuZC1jb2xvcjogIzQ4NjNhZTt9XFxuLnpvY2lhbC5naXRodWIge2JhY2tncm91bmQtY29sb3I6ICNmYmZiZmI7IGNvbG9yOiAjMDUwNTA1O31cXG4uem9jaWFsLmdtYWlsIHtiYWNrZ3JvdW5kLWNvbG9yOiAjZWZlZmVmOyBjb2xvcjogIzIyMjt9XFxuLnpvY2lhbC5nb29nbGUge2JhY2tncm91bmQtY29sb3I6ICM0ZTZjZjc7fVxcbi56b2NpYWwuZ29vZ2xlcGx1cyB7YmFja2dyb3VuZC1jb2xvcjogI2RkNGIzOTt9XFxuLnpvY2lhbC5ndWVzdCB7YmFja2dyb3VuZC1jb2xvcjogIzFiNGQ2ZDt9XFxuLnpvY2lhbC5pZSB7YmFja2dyb3VuZC1jb2xvcjogIzAwYTFkOTt9XFxuLnpvY2lhbC5saW5rZWRpbiB7YmFja2dyb3VuZC1jb2xvcjogIzAwODNhODt9XFxuLnpvY2lhbC5vcGVuaWQge2JhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7IGNvbG9yOiAjMzMzO31cXG4uem9jaWFsLnBheXBhbCB7YmFja2dyb3VuZC1jb2xvcjogI2ZmZjsgY29sb3I6ICMzMjY4OWE7IHRleHQtc2hhZG93OiAwIDFweCAwIHJnYmEoMjU1LDI1NSwyNTUsMC41KTt9XFxuLnpvY2lhbC50d2l0dGVyIHtiYWNrZ3JvdW5kLWNvbG9yOiAjNDZjMGZiO31cXG4uem9jaWFsLnZrIHtiYWNrZ3JvdW5kLWNvbG9yOiAjNDU2ODhFO31cXG4uem9jaWFsLndpbmRvd3Mge2JhY2tncm91bmQtY29sb3I6ICMwMDUyYTQ7IGNvbG9yOiAjZmZmO31cXG4uem9jaWFsLm9mZmljZTM2NSB7YmFja2dyb3VuZC1jb2xvcjogIzAwQUNFRDsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwud2FhZCB7YmFja2dyb3VuZC1jb2xvcjogIzAwQURFRjsgY29sb3I6ICNmZmY7fVxcbi56b2NpYWwudGhpcnR5c2V2ZW5zaWduYWxzIHtiYWNrZ3JvdW5kLWNvbG9yOiAjNkFDMDcxOyBjb2xvcjogI2ZmZjt9XFxuLnpvY2lhbC5ib3gge2JhY2tncm91bmQtY29sb3I6ICMyNjdiYjY7IGNvbG9yOiAjZmZmO31cXG4uem9jaWFsLnNhbGVzZm9yY2Uge2JhY2tncm91bmQtY29sb3I6ICNmZmY7IGNvbG9yOiAjZmYwMDAwO31cXG4uem9jaWFsLndpbmRvd3Mge2JhY2tncm91bmQtY29sb3I6ICMyNjcyRUM7IGNvbG9yOiAjZmZmO31cXG5cXG4vKlxcblRoZSBNaXNjZWxsYW5lb3VzIEJ1dHRvbnNcXG5UaGVzZSBidXR0b24gaGF2ZSBubyBpY29ucyBhbmQgY2FuIGJlIGdlbmVyYWwgcHVycG9zZSBidXR0b25zIHdoaWxlIGVuc3VyaW5nIGNvbnNpc3RlbnQgYnV0dG9uIHN0eWxlXFxuQ3JlZGl0IHRvIEBndWlsbGVybW92cyBmb3Igc3VnZ2VzdGluZ1xcbiovXFxuXFxuLnpvY2lhbC5wcmltYXJ5LCAuem9jaWFsLnNlY29uZGFyeSB7bWFyZ2luOiAwLjFlbSAwOyBwYWRkaW5nOiAwIDFlbTt9XFxuLnpvY2lhbC5wcmltYXJ5OmJlZm9yZSwgLnpvY2lhbC5zZWNvbmRhcnk6YmVmb3JlIHtkaXNwbGF5OiBub25lO31cXG4uem9jaWFsLnByaW1hcnkge2JhY2tncm91bmQtY29sb3I6ICMzMzM7fVxcbi56b2NpYWwuc2Vjb25kYXJ5IHtiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGViOyBjb2xvcjogIzIyMjsgdGV4dC1zaGFkb3c6IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpO31cXG5cXG4vKiBBbnkgYnJvd3Nlci1zcGVjaWZpYyBhZGp1c3RtZW50cyAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzLWlubmVyIHtcXG5cXHRib3JkZXI6IDA7XFxuXFx0cGFkZGluZzogMDtcXG59XFxuXFxuXFxuLyogUmVmZXJlbmNlIGljb25zIGZyb20gZm9udC1maWxlc1xcbioqIEJhc2UgNjQtZW5jb2RlZCB2ZXJzaW9uIHJlY29tbWVuZGVkIHRvIHJlc29sdmUgY3Jvc3Mtc2l0ZSBmb250LWxvYWRpbmcgaXNzdWVzXFxuKi9cXG5cXG5AZm9udC1mYWNlIHtcXG4gICAgZm9udC1mYW1pbHk6ICd6b2NpYWwnO1xcbiAgICBzcmM6IHVybCgnL3Nkay9mb250L3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuZW90Jyk7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgICBmb250LWZhbWlseTogJ3pvY2lhbCc7XFxuXFx0XFx0c3JjOiB1cmwoZGF0YTphcHBsaWNhdGlvbi9mb250LXdvZmY7Y2hhcnNldD11dGYtODtiYXNlNjQsZDA5R1JnQUJBQUFBQUJlUUFBMEFBQUFBSUdnQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJHUmxSTkFBQUJNQUFBQUJvQUFBQWNabnVBeWtkRVJVWUFBQUZNQUFBQUh3QUFBQ0FBVGdBR1QxTXZNZ0FBQVd3QUFBQklBQUFBVmsvbDNFQmpiV0Z3QUFBQnRBQUFBUFlBQUFJS25sNTY3R2RoYzNBQUFBS3NBQUFBQ0FBQUFBai8vd0FEWjJ4NVpnQUFBclFBQUJLTEFBQVpzQU1wSnJCb1pXRmtBQUFWUUFBQUFEQUFBQUEyLzNKU1dXaG9aV0VBQUJWd0FBQUFJQUFBQUNRRmZRSDVhRzEwZUFBQUZaQUFBQUJqQUFBQWdEdE9BYmRzYjJOaEFBQVY5QUFBQUVRQUFBQkVXWlpmK0cxaGVIQUFBQlk0QUFBQUhnQUFBQ0FBY0FDK2JtRnRaUUFBRmxnQUFBRGVBQUFCaGxiRDkvSndiM04wQUFBWE9BQUFBRllBQUFCc1VlbWhoSGljWTJCZ1lHUUFncE9kK1lZZytsd2x4eGtZRFFCQStRWXFBQUI0bkdOZ1pHQmc0QU5pQ1FZUVlHSmdaR0JtVUFDU0xHQWVBd0FGeEFCVkFIaWNZMkJrRW1PY3dNREt3TUhvdzVqR3dNRGdEcVcvTWtneXREQXdNREd3TWpQQUFMTUFBd0lFcExtbU1EZ3dLSDVnWUh6dy93R0RIdU5yQnZVR0JnWkdrQndBajZZTFNIaWN0WkM5TGtSUkZJVy9PNjd4engyR1lRd3pFbEhNTkJNdm9CS05xSVFvaVZCS0pCTHhNbFNpbW5Kb0tHaThneGVRVUNoMXk3by9qWnVydEpPMTkxN243SFd5MXdFR1NORWdjQ1lJellLRWg3eTdydE55TisxdWxUVTZkTmxna3kyMjJXR1hmUTQ0NHBoVHpqam5na3V1clByOFFvcGZZOFdhZGs2elo4MmhOU2ZGR24zclRSOTYxWXVlOWFSSFBlaGVmWi8zakZ2MWRLY2JYYXVqZHBSdTJxVTRXaG55VWJlM3BqMUYxS2hRdGVjeXFmbllmOG1wbEZQRWwvVkdNMlRaeldBNVBscjhQVEdVNUdGRzRqTEtXRUxIbVpoa0twdUlhdjdFU2pWanM4bHFTekRQUXRIdU04YmNINzcrSlg0QTYvWTdOd0FBQUFBQUFmLy9BQUo0bkoxWWVZd2tWMzJ1MzN0Vjc5VjlIMzEzVC9mME1kTXpQZE5uemVHWjJXTjJ2WWZ0WFhiWEYydnZydGMydXc3R0RrWkFEQVJJMkJDaGlGaDJoTDFCY3NBS2ljTGhrRWdKUkpFd1JFRktMTWNSb0JBblVrS3dFc0ZpNUFBU09JcVR6T1QzcW1jZGt2OUkxL1QwTzZwZXZYcnYrMzNmOXlzSkpHbjMyMFNDYjB0RWtqeVlJZElPVm5ZazhaR3g3N3Z3QTdnbVdWSkY2a2pMa2pRT2hvTUs0VFowZ1RlU1lUb2NUTkpKTzk1ckNFUkQwc055c2ducGFESnUzUHR5ZnJudHFNNWJ0cy9Wcmd5djFNNGR1dCsxWjEzZGVjdWh1MmNlZXY5OHZBKzRuSFAzemVhNkNsbXZ3dk5CYTcxOStPVFY5S21UaHc1MVcvMURKNThDNnh4eC9QZEJvd0F5U0dSM2QvY2F6dmQ3VWszYXhCbVBKbHZBb2pDcDBDaGtqWHFyemVQRUpxSkFXK05rTkJrTzRpUnR0UWViSUVwQmpHYzVNQm1QV3UyV2E5MWYreVduVVBZYlNXVi9ORmRlVkdKUHRTSjZCbDVxUlBrdHU5cnJ3MEtaWnkydWRTeDNkTzEyZUFocnVXYi8zRkN4bzZJVDU1TGdyT3NDa3owVExqQ2FCSkh2M0pGVFRlWmFPNTlrRkUvMlp1ZFhqZ1VWU2NaNWY0ZWNoKzlLYmVrRzZiQjBDdGR5TkZtSDFuaVVpbmxuRmQ2b1FCVGlZa1pobkloaTFwT0dNUzd6ZU5UdXNYYXIwV0pwQllieHBFZVlNaDZPaDlFd2FrU044ZG45eFVoVjlQSDJtY2tuWmdlNTRtSmdsT3hxN3N5UjdYT3JOeXh1cEJSa2xWdXFMNGZCMHFFNkcxUXJzL3B3WXhabUx1VXZYY3B2THh3T2M0NERCNWVYRGhlMFlXMXAxdll0cmFMSHZVWnZlemp2emZZWG16cFhkSjBaaWtrWjlQOXpiZzNTTjYyUXlVaGNmdW1TQkJJZ1ZuNFYvaGh4SXFXakZQZGZQTk1BRjV4bkQ4VzRMVGZxckF1NE5ka3hCbWJ1NzNiMjNiR3ZNem5hSkFyMWEwRUxRSUhOd2tsRmt5MHRPR1hFQzBlOTJtQmhZMk5oVUF2dVNwZFVSVlV0VlZiQXN6V1RxbXBEb29qUmEvQXM0dUVoNmYzU1J3UWlVb1RrT29nVjI0QzlTcHpFeVFDaEdVK1BONmFEVThTSmlyTmptK0Npc3k1MWxMQkNwcGRQcHptcVI2RURqRGZxMmJ4NzBHNmw0M1RVNXdKMklUNFBaOHBrR0NlamRnT0xxcXhwenJKcU1PNnpTSytFSWJXTll0RDNJcWJJbEtnMmQ2eGNHS1p0UFdlcWxrMEFnQkNnaXZqSVdKSmxoM3BsTHdnWDNTTFJaY1dtcHJPL2FYSTFvSVNlQXdiS3NtOVNtREhNSktnU2g2dHdMTlE1VlF6Vk1DdVdaaWdVVkRVaGpMTlM2VVN2RXR0M3pNZEZsNVBDZkZJMDhGNVVWcW1zVTFGU0dOY1VZdWZiUmJ5OVBnU29GeTBUVWVJeXh6OGZlWWZoTHFDR2Jjd3JESjRrb0haQk41QVRxTUF4SE05d3ZQbi9SbkcyYW9oalhPYzBhNE5zOGFMd1o0QXhYYWczQkpCSjJiTkJHVlpJeGJOL1Joem5jb2pqUWx4V3Ria1ZLRVJsVlR6ZmYrMitRbHo0RG5LZUo4MUxFaEVjTW9VTXpwcDZRMjhkeGdMZncwRVpoZ2dTbkhqVTM0QkdITkxaY3NuM1BMOE1wZElqVzIrWDFYSzgrc2lSOVFQTnR3TThQcHh4dldMZTlYYmVDN2Z0Zk9iTHZ1N2xidjdpVjIrNlpRVmcyZjBzUnM5L1NHM3lObmhNZWhJbk1VV3dnR3k2aHNHTzdJYXdyVEFFODBpc0ZtbHZ3anF0MGpoQkJPS3lDU1Fpd0RmcGVMSWxaMWVLdFI1VUlKdTNqWHhOa3pBYkkzc09nV1NjZFFQQlRFV3ZhTUF4c1NvaktCRE9Da2NnSVJjcUJxTmM0UkNXZ0ZHbU1FWnRvbExObFhtemF0bVdiZWhjemdBTXhNTElwSG91aHllcHFxSG9sc2VWd0haMVFuek5MeWxnTWdhVXlUbzBvN0NBVnhxNlp1bTAzcVNXWm5PVEU1blg3YUN6djVXTWwwR1ZHWVYzaTNBQW9FVFhQRG8vUjFTRnl6S0d5cXF1dG13bXBxSWhtcmx1SXA2OVNERk5UVTlVcXNvV1ZFZW1sVTBNeVVTbXNsTjJjZzBPcnVvd21XdXlCalBGb3VISll0SktsM2lhQ3FUUTRDYVJaMmJMMi9kUVQzTnN4UGxVRjkrRnV0aEhqT055cHNoYjRxY0hHeEFQZXdJRHVMNEM4UWlQU2NxNCtFYWhUWEV4SGZmTmgrY09tcnJ0dTR2cnhWcXg2aS8vMmdsNmZMTFNXbXphODgxbXZsM1p2TzNSUTI4OVd5QXJnelpSMUNNOTRucXJNNDNLK2hIWnM4WTN6V25KVWw1eDJ5VnZkUG44MFlXMTZYeXVrZVBJYy91UjR6YnBGb2o3VmhRTXNFeURFUmF0YkZleFBCd01wenR0eTV6VkJXRVIzRjhiZUdsbGZrYlZHTk5WeTdNMHBsSXZOTXlGZ2dWeXJIQS9iNjR1TERJMkRqU3FqN2FPVG9LNFdVOVU3WlFxZUNDeDRlNlpVY21sZ3EzeTFXNXp3ZDQzV2Uzblk2WVVPYkVQZHFyeWZKaDN2TkdEWjQ0dldpYVNUZ0NHampSRFRmMjZsN2hHZmdIbkh5QnpyRXNuY0ZVeGlMWUVWaFBlZ3lYQXlkdFlSejRlL3UrMkFCZTZpbXVPR3A0aXF6aUE4UDAvYlEyT2JSTi82UG41MGlpZStJdW03YmxxY1gwdzlrZWVWeWlPNHJHL2FGbStnMjB2amdNc1p0M08yQis3WHFFMGJJK0RoYXl0dEladEk5OHRGa2JWNTNSa1RFV1Bubk04Z2gvemU4L3BabGEzZlFGTmMrY0hYN0o5UkQ4eGpPbXBCcWhmMnVzenhMbE1rNFErU1lmSVZ4Qkh4L0daVCtQZTRZNVZ5VENKeXhBS1VlSDFNc3dnalhSSmZRTmE2R1ltK1B6NEg3V3IxVWRURmNaVk91UnQwYmE4Q2FJVnorUlJNNkZ0bmlhY0VnUzZ0dm9iR0RGazFXR2dJYmNma3dGcnlpOXZLN0pHS2Z5VGlDUlRXLys1ZDBaY2JsQ3NrTmRsSVBlY242L1paSVhBNytrVXgxRCtnUEdMc2lpVXlvVHd5NEFSd3Q0amE3S2lpbDNrK0pqeWZSOGpCc2lVQ3gxSjZjNjM0T0lLV1pFeWIzT05ESEZ2YzlMdDBtWHBvK2dBSm9LQ2hBdVl4RUpyUVRneURKWXRHRTJFSktjQ3IxMUFUREl1MnNmVGJhOG9aUnJ1MFJacUdQSlRtd2w2YWszVll6aEpOOG1HMEk1a09rcW02TmxDWnFRMkRRT2hKQndWWnhrSSsrQ1Q5OTlEZGNJMXJqa0xENDVPL3ZxS1RENWVyeGJuN0NvM0V0bkxVNkt0YWRwMnoxcWJVVFNVWU9ESVkzS1hNZzA1VUNmbG9wL3ZETzRJUFpUZXlHUUtWSnpGbDVEdGpOQlhsRVFob1ljQmdTUVZFSlpvcG1sUWNsYVdqN1hRcVZKTFlWcWh2RElrdUJkUE5BYVdxUkNpelJnT0JNaUtIQS9TV3lBVnhkUjhGaFBYUG1mRk9yS3VUSnRVa1ZHZUhGcmp5bklhNW9ERld1SzRsbXg5SFFlZ0N2SVdrakgxK3c3ZVdWNzBzQUs0cFNBNDRqSDBRcitkeFppVW9qa1VhaHloU0tKUVpTYnhzUk9IK2lkT2NQUGl4WHUvZWJFL1BuN1J0UVlYWDMwMWk4L2RmOS85SWVHb2V3YnFYaVFWSmFtZHR0TUVJWmJ3dGdQakpDMERUZEkyTWsrU1J1eHRiL3ZFNWJkKy9QNzduNzU4ZWJCOCtjbW5yajZGczdrMGV1bjA2Y3QzM25udm1kdlBuenhaTDVkT3doZGcvZHg5dCswODhBVTRXYTNoZlRETDJIMEZkdUg3T0VkMER6ZUEyTWRzRzdNZEZ4NHJGV0tHOUxwbnY5TFdsQkFtZ21ZbkdQUjhEeDBjZC80TjV0dmJkanpDdWZOTER5eWRtNHVpdVhOWU9EOFhkdWNQUllaZDhKY0twbTBvYXBDdmJsUkQzK1hjTWdvbE54OFZvb1BkZWM4cmx6dHozYm41ZHFYc2VWKzh2SHkrRTBXZDgvMzcreGZtd25EdXdyMUhWbGVTdWFxRjlHZVVqN2FMbFFaaG5vcUdqZ0UwS3NYMmFobWxoTmlWdVdSMTljYUZEbzdpK3I1YnJyUTdFc3M4NnN1NEwyMVVrM1hwb0hTajlBRHlYeGhuTHJNeEQ0MldjQlQ0SkJnWWFEUHdXWmd3VDBMWGJaaGtXWXh3VVh4cXFGbTk1WXNTRmlnbUFPa3c2cU80WjE1cWkyU0JzQVNqTnU1L1k0eTd2blYyMzc1RnhJZHBOZ2V5bythck5GZHFUL0toYlNXbHpkaHhZdnhHeFdZUi96NlRhK1J5RFhzN1Z5Wk9HRENPM2hYbEZXSVQyUTlwWTJscHM1ek85SG96dFo1UmNNaG8xamFvdk82NjQxWnV6dkpEUHpUcVg2em5jdlhjSDFsQllObEJBRmZFZUxtZGI3MzIycDg5N3NZNlEzK3J5RU1Pd1BINzZIaHBhZXJmU1JmWFpoWXpoeFJYcGJVcGIwRmtLODQwcjVPckVQV1VzZUtsWGlCa3JRbzhHV2ZpQU1YNTBhaHJXZVYrSldkeTRSVllzVDViMXZUQnlmNnNxNEY4MUtOQkdCdEc5NU9UNkZpeCtIUXRuUzI1QnBBdDRzYjVIRDRmVnczZHowVVdrdVpZS2RTYWpiTDZPZmpyd1U0SHVPQUIxZXY4WWpVdUVzSGhYUGdCZUFKNW5HT0VPSWplQkdPa0trblJPT0V6dUF0TkRMRXhSa3Y3cDc0WUtyeU5jZEhaK2RIenp5dlB5MTgyLzl4Nk9uNDJ1YjN4cmxtek85T3QvUzE4N3JOLzgvUHp4eGZDN29QejZmeHZOUyszdnBIL1ZQNmYrVi93TEZaOFNTY0ovSW0wSVgwQUl6cStucitrazcxakQvci9jNkEyWEkrRDZ3ZlNZeExHNmVpTmk1QTJKeFZaakROOG95a1JWbkk2dXFEZjY5ZnVEYnZjQ2hrejNVcDNiclE2VGhmbTZ6cmpLREZJUlZZK3JsYWJZV0phQ2xGZFJRZ0ZNODBrYnRjcVVhamhvOWRSSUxsSERZMzdMbE1NcWxNVmJJMXpibUFDcmRzS1V5aFZ3c2h4ZlkyRjRHc0Fmcis3aWt6ZjZxSzFnQWRWN3BnNXkwWmp5anl2b3FtNnFqa3NVT1NWZm5lMkVScGMrRGpjZVVWeml2T2QwV0FWczBMUkVLTTE1R0ZKOFd3MXA2QmdvYVVCUjZhZ21hV0dZUlBCeVNBN2tSdkVydGFrVlo5QUxYQVJuSXJqbGJoR2hWOTVRcXJReS9CNTNPTzJ0Q1NVRytvTWNZZkxPKzZQV2hpZ2ZReTd6SHhsLzBjdHVkN0tvakxlKzAzYTZYalN3OHl4ejl2OUhtcGQwazk0bjFXUXRQcHBndGR1UXB2a093ZDkvMEJucWVVbUhweGE2eHp3L1lPZHRWT25kbjU0ZURBNDNQL0w3UDlyUjQ1dzJVLzQ1aFpQZk1xT0hFSDZSM1J0WWszbXNESlhyOCtWM20yNHJ2SEsycHRFNWZRN1Q3M2N6NjdNL205Y3VBQmFZbEh0OUdtTldvbDJ6d1U5dHFjMU8wWjNwaUMyL3dIais5dVpUMU1sVTNMUnAvVFRpQ2RSZTV3Mkl3dWk1dmdiK1BrK0pEdmZ5NzVQbFYrQStJWHk1LzlsN3NjMC8rUE9YMDA5bmluNThCTmNzNTYwTGQwbFBTeEpBZVpKRXdFcGdiSk53TkliME9wbDFCOFA0NnhuQ21WbGdnaThma0o5M05vRDUyQjZwUTN0K2g0aXMzWSttVUtXaDN0STdZRkpITTNuYko4UGNGU1RBMDNUYU81dXgzYmlmRjB6Q0hwZ0gyTEwxRkhONlZsSGhpYzBEemVkdDVwNTErWUlhRFZNcXNVUjBSVkZNd25pZEhHbTdLTW9FNkthdWVhN1pHN2xPbjBMWEVNTFptdXV5dUEzTlFzOCsxTmRBbC9KYWFwTUEzM3RXdHNMdUtxQXF6a2lCVEgwUExYUVZmempyQlpUcEJSZkNWMlJwUk4wR0o0Zis3OGkwT3BwT0E1RjdjZjBGak1XbVo5R1FkZmNBdk5jSmpPemtITlV0SktTc3Z2Njd0L2pQcjJNSEtRak54U2t1aVExRzd5UkRwUEdFdkJab1F3SVBWWm5RbG9FU0xOZm1EdHRITC96NUowM0Z3c0ZLRjE5NmVyVmwvTFBQUExJTTQrODU0bExsNTY0OUV6NzFWZlAzbnJyTzBUNzFRT1BpSjRMbDBTUHRIZlBmNE4vaGE5TE1XclhEWmg5M0lpUjBBT3g0Z3dYUG9xakNtUStMNTFRaHB1UWJUUHVGUFl5M0p1OTZpUjdONUNad2JhZzlYUWljbjU0SlRuV3FSUWVlS2FvRy9IakY4NjhrMExVZlczZkI1b3RkYUh6dmhTYytNWUhOUFhXamNNUEdOUW93eTJIem14c2Rqb0hBTjZ4dlowL3BwQm1CVDVkQ1N5ZHhmZGV4alNoQkcrK1QxZXYzRm1yMzdUemgwRi9kZTNLcE45SVFvZnF0eDViZTZ1cXYrbkdoTU9KaDc1NncxeG5IOENCdWZsSHpmMEhMQkpzb1phTFoxVXpuZjRtYWxGSnVsVzZUM3BRZWxUNmlQU005S2NDeDNRNHRTSENiZ3JiS25KbUVQNUU1SUJaSnJOSnBuRE5UcXNRUkt4NDEyaFRnZGxHWGJ4Q0VrYTRuYjFIU3FjcCszRGNGdjZNWDVkekxzYkNCQ0FTZGhsWnV3cERJZUY0b3cxb0JEK1Yya1Zpc0drd2pKS1JlQ2VMeHRsV3VpQXllU0NtN2FEUXhsNklYakZCb1ROMTE2R2tqcGxtWXRtUXIraWE2NFdLN0NJQVpYZFVSbjVGNkxHNFBLb0dNZmNNUzlHMHZCbHFrUE44ZGhDNFVkNWZiamc1cXRaNnRWclBScnAxU2dYVkpPY2NWVDFXcThvTXFrVWFCejZWWTlkVVFpOUg1WkxCNGE0VnIyQmhwQ21xNFdrMHRDeVR3bUpRdEZYd3cxQkZTcTduWlp4UzJkRlU1Y2NhNXQxeEh2T29xT2E3aHBGUk5Rc25zVjRwNWRHU2E1R0I5b0dJNUVWazdwN25IK2JjZFdMMk5IUWpBOWorWG0vLzB1c1lPcG90N3pNVVM3Y29lZmdNb09jK0Jrb3VIeW41RUZXam5JVG9tV00zVmo5NnN4T0xPRldvYTlnNlpqa3NIMHFaNW41dzkzVTRDMTlEZlo5QnBHZE9MRUVvbzczYVFoc2Q0dS9ZRzlIckw3c2lPSE40Y3VTV3V6RWo2akp5cGlxMzVGNWhwdGV0VnVGcnA0NmZiendyTStYVG4xWVVlSUh0U3VOeG12NmRKRm1Tcy9zYS9BaGV4RGoyMEVXME1MSTJNSzVPUzNkTGI1SGVMcjFYdWlKSnN3SVNOdFRURUprd0U1VDJuZytzdDVUcmpwQzFtcUpZZ2V6VmQ5YVFabjNwbmsvRW1LdFAzMUdJT3AwT2hLWEp0SE00NEcrWXk5YTBCd3NqdnFkZ0RBNkdsUmlpOHRYSWRxS29HandiT1hZVWxhT2RGME0wamFJQ1ExR0NHSXNmeHBQd1pNY0pEenBSWE02Nkk5dU84SVF3S29mNHdUYmJ1UnBtN1U3NG5rb1lUaytPc1BSd09ZeEs0WWR4eEJEUHZRMHZLVVhoYlc0UWxpSWMwdzd4TjdUdEVHTGJDWEFvMFZJT3IyQlRGRmxPdVBNdzl1UE53by9oVHlsc09LSTNlRjFjRVphV0F5eFhBdFE1UzdvTFhvV0xtS2RXcGE0MGtOWXdzakZTWTh4VUNhYVlkcVl4UWtjbXFQUklhbkZhSVZOdEdVMDRxaGhyVDdDS0hSWDRyRnIwdWVtYXFsZkVmTmgyODgyaVo2Z3krVkNpeDZORzhwUGV1cEpvemtRbFVESzZkRFd0Zm1peVpyUTRhOEZGUkNmVDhjK1NuWVAxZmpCREsyRWhYTmozWXZuSXhwTHlPNytyYjUrZWQvWG1wanU3OVB2V1NNN25XNjFjemxwUzFaNGsvVGMvdFhpUEFIaWNZMkJrWUdBQTRxb29ZNTU0ZnB1dkROeE1EQ0J3cnBMakRJeisvL1AvVGVZTXh0ZEFMZ2NEV0JvQUtsa01LWGljWTJCa1lHQjgvZjhtZ3g0THcvK2YveGlZTXhpQUlpaEFIZ0NrMUFaNWVKeGpZb0NDVlJDSzhSTURBeE9RWm9vRHNqc1lHQm5YQUdrdklGL2sveittM1A5L21FcUJiQkMvSElnUEFiRVJVSDRSUXo4VDIvOWZJSDJNRDRCaVdrQjZJdGdjSVJZR2hrbGc4eGdZZUpnWS92OEdZY1lyWUg0REF6OERMd0RjQUJVdUFBQUFBQUFBQUFBQUFBNEFXQUMwQVNRQllBSVlBb2dDeEFPTUE5UUVOQVN3QlNJRjVnWUVCamdHc2dkQUI1UUh6Z2lNQ1FJSkpnbldDaEFLaGd1SUM3b01kZ3pZZUp4allHUmdZRkJrMk0zQXl3QUNURURNeUFBU2N3RHpHUUFaSWdFdkFBQjRuSFdPTVdvRE1SQkYzOXByaCtBUVVvV1VnalJwZHBFMmpmRUI5Z0FwM0JzamxnWGJBdGtHbnlSVmpwQXl4OGdCY29RY0k5L3JhVkpZTU9qTjE1LzVBdTU0cCtCOENtNTRNQjZKWDR6SFBITXlMcVYvR2srWThXMDhsZjRyWjFIZVNya2ZwczQ4RWo4Wmoybnh4cVgwRCtNSmozd1pUNlgvMExNbXNWVWxkdEN2MHpZbHdSdVJqaU1iVm1TMXNUdHVWb0oyOEIyR084c1JjVFRVU25Nc1ZQLzNYYlE1RlVHT1NrNHZldFdhdER1MEtYZlJOYlYzQzJlNW9ua1ZmTlg0SU5PMXZ5MlZtdG5yL1pJUmhueVdNZTk3N1FpMXZ6cjdCd0R2T2RNQUFIaWNZMkJpd0E4VWdaaVJnWW1SaVlHZGdaZUJqMEdKUVlOQmkwR2Z3WkRCbk1HU3dZckJoc0dGd1pQQm5hR1F3WXNoaUtHVXdaVWhtaUdXZ1lWQm1JR1ZJWUtCazRHTklaUzlOQy9UemNEQUFBRHBod2hhQUFBPSkgZm9ybWF0KCd3b2ZmJyksXFxuICAgICAgICAgdXJsKCd6b2NpYWwtcmVndWxhci13ZWJmb250LnR0ZicpIGZvcm1hdCgndHJ1ZXR5cGUnKSxcXG4gICAgICAgICB1cmwoJ3pvY2lhbC1yZWd1bGFyLXdlYmZvbnQuc3ZnI3pvY2lhbHJlZ3VsYXInKSBmb3JtYXQoJ3N2ZycpO1xcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XFxufVwiKTtcbiAgaW5zZXJ0Q3NzKFwiaHRtbCwgYm9keSB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4uem9jaWFsLmF1dGgwOmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiP1xcXCI7XFxufVxcblxcbi56b2NpYWwuYXV0aDAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNDUwMDtcXG4gIHdpZHRoOiBhdXRvO1xcbn1cXG5cXG4uem9jaWFsLmJsb2NrIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgbWFyZ2luOiAxMHB4IDA7XFxuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi56b2NpYWwucHJpbWFyeSwgLnpvY2lhbC5zZWNvbmRhcnkge21hcmdpbjogMDsgcGFkZGluZzogMCAxZW07IGZvbnQtc2l6ZTogMTRweDsgbGluZS1oZWlnaHQ6IDQycHg7fVxcbi56b2NpYWwucHJpbWFyeTpiZWZvcmUsIC56b2NpYWwuc2Vjb25kYXJ5OmJlZm9yZSB7ZGlzcGxheTogbm9uZTt9XFxuLnpvY2lhbC5wcmltYXJ5IHtiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTE2LCAxMjYsIDEzMyk7fVxcbi56b2NpYWwuc2Vjb25kYXJ5IHtiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmMGViOyBjb2xvcjogIzIyMjsgdGV4dC1zaGFkb3c6IDAgMXB4IDAgcmdiYSgyNTUsMjU1LDI1NSwwLjgpO31cXG5cXG4uem9jaWFsIHsgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7IH1cIik7XG4gIGluc2VydENzcyhcImh0bWwuYnV0dG9uIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbmh0bWwuYnV0dG9uIGJvZHkge1xcbiBvdmVyZmxvdzogaGlkZGVuO1xcbiB3aWR0aDogNjAwcHg7IC8qIGZpeCBmaXJlZm94IHdpZHRoIGlubGluZSBibG9jayBpc3N1ZSAqL1xcbn1cXG5cIik7XG4gIGluc2VydENzcyhcIi8qISBub3JtYWxpemUuY3NzIHYxLjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0LmlvL25vcm1hbGl6ZSAqL1xcblxcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuICAgSFRNTDUgZGlzcGxheSBkZWZpbml0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBDb3JyZWN0cyBgYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgaW4gSUUgNi83LzgvOSBhbmQgRmlyZWZveCAzLlxcbiAqL1xcblxcbmFydGljbGUsXFxuYXNpZGUsXFxuZGV0YWlscyxcXG5maWdjYXB0aW9uLFxcbmZpZ3VyZSxcXG5mb290ZXIsXFxuaGVhZGVyLFxcbmhncm91cCxcXG5uYXYsXFxuc2VjdGlvbixcXG5zdW1tYXJ5IHtcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQ29ycmVjdHMgYGlubGluZS1ibG9ja2AgZGlzcGxheSBub3QgZGVmaW5lZCBpbiBJRSA2LzcvOC85IGFuZCBGaXJlZm94IDMuXFxuICovXFxuXFxuYXVkaW8sXFxuY2FudmFzLFxcbnZpZGVvIHtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICAqZGlzcGxheTogaW5saW5lO1xcbiAgICAqem9vbTogMTtcXG59XFxuXFxuLypcXG4gKiBQcmV2ZW50cyBtb2Rlcm4gYnJvd3NlcnMgZnJvbSBkaXNwbGF5aW5nIGBhdWRpb2Agd2l0aG91dCBjb250cm9scy5cXG4gKiBSZW1vdmUgZXhjZXNzIGhlaWdodCBpbiBpT1MgNSBkZXZpY2VzLlxcbiAqL1xcblxcbmF1ZGlvOm5vdChbY29udHJvbHNdKSB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIGhlaWdodDogMDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgc3R5bGluZyBmb3IgYGhpZGRlbmAgYXR0cmlidXRlIG5vdCBwcmVzZW50IGluIElFIDcvOC85LCBGaXJlZm94IDMsXFxuICogYW5kIFNhZmFyaSA0LlxcbiAqIEtub3duIGlzc3VlOiBubyBJRSA2IHN1cHBvcnQuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxcbiAgIEJhc2VcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogMS4gQ29ycmVjdHMgdGV4dCByZXNpemluZyBvZGRseSBpbiBJRSA2Lzcgd2hlbiBib2R5IGBmb250LXNpemVgIGlzIHNldCB1c2luZ1xcbiAqICAgIGBlbWAgdW5pdHMuXFxuICogMi4gUHJldmVudHMgaU9TIHRleHQgc2l6ZSBhZGp1c3QgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlLCB3aXRob3V0IGRpc2FibGluZ1xcbiAqICAgIHVzZXIgem9vbS5cXG4gKi9cXG5cXG5odG1sIHtcXG4gICAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbiAgICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKlxcbiAqIEFkZHJlc3NlcyBgZm9udC1mYW1pbHlgIGluY29uc2lzdGVuY3kgYmV0d2VlbiBgdGV4dGFyZWFgIGFuZCBvdGhlciBmb3JtXFxuICogZWxlbWVudHMuXFxuICovXFxuXFxuaHRtbCxcXG5idXR0b24sXFxuaW5wdXQsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gICAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XFxufVxcblxcbi8qXFxuICogQWRkcmVzc2VzIG1hcmdpbnMgaGFuZGxlZCBpbmNvcnJlY3RseSBpbiBJRSA2LzcuXFxuICovXFxuXFxuYm9keSB7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4gICBMaW5rc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgYG91dGxpbmVgIGluY29uc2lzdGVuY3kgYmV0d2VlbiBDaHJvbWUgYW5kIG90aGVyIGJyb3dzZXJzLlxcbiAqL1xcblxcbmE6Zm9jdXMge1xcbiAgICBvdXRsaW5lOiB0aGluIGRvdHRlZDtcXG59XFxuXFxuLypcXG4gKiBJbXByb3ZlcyByZWFkYWJpbGl0eSB3aGVuIGZvY3VzZWQgYW5kIGFsc28gbW91c2UgaG92ZXJlZCBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYTphY3RpdmUsXFxuYTpob3ZlciB7XFxuICAgIG91dGxpbmU6IDA7XFxufVxcblxcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuICAgVHlwb2dyYXBoeVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgZm9udCBzaXplcyBhbmQgbWFyZ2lucyBzZXQgZGlmZmVyZW50bHkgaW4gSUUgNi83LlxcbiAqIEFkZHJlc3NlcyBmb250IHNpemVzIHdpdGhpbiBgc2VjdGlvbmAgYW5kIGBhcnRpY2xlYCBpbiBGaXJlZm94IDQrLCBTYWZhcmkgNSxcXG4gKiBhbmQgQ2hyb21lLlxcbiAqL1xcblxcbmgxIHtcXG4gICAgZm9udC1zaXplOiAyZW07XFxuICAgIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbmgyIHtcXG4gICAgZm9udC1zaXplOiAxLjVlbTtcXG4gICAgbWFyZ2luOiAwLjgzZW0gMDtcXG59XFxuXFxuaDMge1xcbiAgICBmb250LXNpemU6IDEuMTdlbTtcXG4gICAgbWFyZ2luOiAxZW0gMDtcXG59XFxuXFxuaDQge1xcbiAgICBmb250LXNpemU6IDFlbTtcXG4gICAgbWFyZ2luOiAxLjMzZW0gMDtcXG59XFxuXFxuaDUge1xcbiAgICBmb250LXNpemU6IDAuODNlbTtcXG4gICAgbWFyZ2luOiAxLjY3ZW0gMDtcXG59XFxuXFxuaDYge1xcbiAgICBmb250LXNpemU6IDAuNzVlbTtcXG4gICAgbWFyZ2luOiAyLjMzZW0gMDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRSA3LzgvOSwgU2FmYXJpIDUsIGFuZCBDaHJvbWUuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgICBib3JkZXItYm90dG9tOiAxcHggZG90dGVkO1xcbn1cXG5cXG4vKlxcbiAqIEFkZHJlc3NlcyBzdHlsZSBzZXQgdG8gYGJvbGRlcmAgaW4gRmlyZWZveCAzKywgU2FmYXJpIDQvNSwgYW5kIENocm9tZS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG5ibG9ja3F1b3RlIHtcXG4gICAgbWFyZ2luOiAxZW0gNDBweDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgc3R5bGluZyBub3QgcHJlc2VudCBpbiBTYWZhcmkgNSBhbmQgQ2hyb21lLlxcbiAqL1xcblxcbmRmbiB7XFxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRSA2LzcvOC85LlxcbiAqL1xcblxcbm1hcmsge1xcbiAgICBiYWNrZ3JvdW5kOiAjZmYwO1xcbiAgICBjb2xvcjogIzAwMDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgbWFyZ2lucyBzZXQgZGlmZmVyZW50bHkgaW4gSUUgNi83LlxcbiAqL1xcblxcbnAsXFxucHJlIHtcXG4gICAgbWFyZ2luOiAxZW0gMDtcXG59XFxuXFxuLypcXG4gKiBDb3JyZWN0cyBmb250IGZhbWlseSBzZXQgb2RkbHkgaW4gSUUgNiwgU2FmYXJpIDQvNSwgYW5kIENocm9tZS5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5wcmUsXFxuc2FtcCB7XFxuICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIHNlcmlmO1xcbiAgICBfZm9udC1mYW1pbHk6ICdjb3VyaWVyIG5ldycsIG1vbm9zcGFjZTtcXG4gICAgZm9udC1zaXplOiAxZW07XFxufVxcblxcbi8qXFxuICogSW1wcm92ZXMgcmVhZGFiaWxpdHkgb2YgcHJlLWZvcm1hdHRlZCB0ZXh0IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5wcmUge1xcbiAgICB3aGl0ZS1zcGFjZTogcHJlO1xcbiAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XFxuICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgQ1NTIHF1b3RlcyBub3Qgc3VwcG9ydGVkIGluIElFIDYvNy5cXG4gKi9cXG5cXG5xIHtcXG4gICAgcXVvdGVzOiBub25lO1xcbn1cXG5cXG4vKlxcbiAqIEFkZHJlc3NlcyBgcXVvdGVzYCBwcm9wZXJ0eSBub3Qgc3VwcG9ydGVkIGluIFNhZmFyaSA0LlxcbiAqL1xcblxcbnE6YmVmb3JlLFxcbnE6YWZ0ZXIge1xcbiAgICBjb250ZW50OiAnJztcXG4gICAgY29udGVudDogbm9uZTtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgaW5jb25zaXN0ZW50IGFuZCB2YXJpYWJsZSBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG4gICAgZm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qXFxuICogUHJldmVudHMgYHN1YmAgYW5kIGBzdXBgIGFmZmVjdGluZyBgbGluZS1oZWlnaHRgIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG4gICAgZm9udC1zaXplOiA3NSU7XFxuICAgIGxpbmUtaGVpZ2h0OiAwO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3VwIHtcXG4gICAgdG9wOiAtMC41ZW07XFxufVxcblxcbnN1YiB7XFxuICAgIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4gICBMaXN0c1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgbWFyZ2lucyBzZXQgZGlmZmVyZW50bHkgaW4gSUUgNi83LlxcbiAqL1xcblxcbmRsLFxcbm1lbnUsXFxub2wsXFxudWwge1xcbiAgICBtYXJnaW46IDFlbSAwO1xcbn1cXG5cXG5kZCB7XFxuICAgIG1hcmdpbjogMCAwIDAgNDBweDtcXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgcGFkZGluZ3Mgc2V0IGRpZmZlcmVudGx5IGluIElFIDYvNy5cXG4gKi9cXG5cXG5tZW51LFxcbm9sLFxcbnVsIHtcXG4gICAgcGFkZGluZzogMCAwIDAgNDBweDtcXG59XFxuXFxuLypcXG4gKiBDb3JyZWN0cyBsaXN0IGltYWdlcyBoYW5kbGVkIGluY29ycmVjdGx5IGluIElFIDcuXFxuICovXFxuXFxubmF2IHVsLFxcbm5hdiBvbCB7XFxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICAgIGxpc3Qtc3R5bGUtaW1hZ2U6IG5vbmU7XFxufVxcblxcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuICAgRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiAxLiBSZW1vdmVzIGJvcmRlciB3aGVuIGluc2lkZSBgYWAgZWxlbWVudCBpbiBJRSA2LzcvOC85IGFuZCBGaXJlZm94IDMuXFxuICogMi4gSW1wcm92ZXMgaW1hZ2UgcXVhbGl0eSB3aGVuIHNjYWxlZCBpbiBJRSA3LlxcbiAqL1xcblxcbmltZyB7XFxuICAgIGJvcmRlcjogMDsgLyogMSAqL1xcbiAgICAtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljOyAvKiAyICovXFxufVxcblxcbi8qXFxuICogQ29ycmVjdHMgb3ZlcmZsb3cgZGlzcGxheWVkIG9kZGx5IGluIElFIDkuXFxuICovXFxuXFxuc3ZnOm5vdCg6cm9vdCkge1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxcbiAgIEZpZ3VyZXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkcmVzc2VzIG1hcmdpbiBub3QgcHJlc2VudCBpbiBJRSA2LzcvOC85LCBTYWZhcmkgNSwgYW5kIE9wZXJhIDExLlxcbiAqL1xcblxcbmZpZ3VyZSB7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cXG4gICBGb3Jtc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBDb3JyZWN0cyBtYXJnaW4gZGlzcGxheWVkIG9kZGx5IGluIElFIDYvNy5cXG4gKi9cXG5cXG5mb3JtIHtcXG4gICAgbWFyZ2luOiAwO1xcbn1cXG5cXG4vKlxcbiAqIERlZmluZSBjb25zaXN0ZW50IGJvcmRlciwgbWFyZ2luLCBhbmQgcGFkZGluZy5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNjMGMwYzA7XFxuICAgIG1hcmdpbjogMCAycHg7XFxuICAgIHBhZGRpbmc6IDAuMzVlbSAwLjYyNWVtIDAuNzVlbTtcXG59XFxuXFxuLypcXG4gKiAxLiBDb3JyZWN0cyBjb2xvciBub3QgYmVpbmcgaW5oZXJpdGVkIGluIElFIDYvNy84LzkuXFxuICogMi4gQ29ycmVjdHMgdGV4dCBub3Qgd3JhcHBpbmcgaW4gRmlyZWZveCAzLlxcbiAqIDMuIENvcnJlY3RzIGFsaWdubWVudCBkaXNwbGF5ZWQgb2RkbHkgaW4gSUUgNi83LlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuICAgIGJvcmRlcjogMDsgLyogMSAqL1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAyICovXFxuICAgICptYXJnaW4tbGVmdDogLTdweDsgLyogMyAqL1xcbn1cXG5cXG4vKlxcbiAqIDEuIENvcnJlY3RzIGZvbnQgc2l6ZSBub3QgYmVpbmcgaW5oZXJpdGVkIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBBZGRyZXNzZXMgbWFyZ2lucyBzZXQgZGlmZmVyZW50bHkgaW4gSUUgNi83LCBGaXJlZm94IDMrLCBTYWZhcmkgNSxcXG4gKiAgICBhbmQgQ2hyb21lLlxcbiAqIDMuIEltcHJvdmVzIGFwcGVhcmFuY2UgYW5kIGNvbnNpc3RlbmN5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gICAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICAgIG1hcmdpbjogMDsgLyogMiAqL1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7IC8qIDMgKi9cXG4gICAgKnZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IC8qIDMgKi9cXG59XFxuXFxuLypcXG4gKiBBZGRyZXNzZXMgRmlyZWZveCAzKyBzZXR0aW5nIGBsaW5lLWhlaWdodGAgb24gYGlucHV0YCB1c2luZyBgIWltcG9ydGFudGAgaW5cXG4gKiB0aGUgVUEgc3R5bGVzaGVldC5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQge1xcbiAgICBsaW5lLWhlaWdodDogbm9ybWFsO1xcbn1cXG5cXG4vKlxcbiAqIDEuIEF2b2lkIHRoZSBXZWJLaXQgYnVnIGluIEFuZHJvaWQgNC4wLiogd2hlcmUgKDIpIGRlc3Ryb3lzIG5hdGl2ZSBgYXVkaW9gXFxuICogICAgYW5kIGB2aWRlb2AgY29udHJvbHMuXFxuICogMi4gQ29ycmVjdHMgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSBgaW5wdXRgIHR5cGVzIGluIGlPUy5cXG4gKiAzLiBJbXByb3ZlcyB1c2FiaWxpdHkgYW5kIGNvbnNpc3RlbmN5IG9mIGN1cnNvciBzdHlsZSBiZXR3ZWVuIGltYWdlLXR5cGVcXG4gKiAgICBgaW5wdXRgIGFuZCBvdGhlcnMuXFxuICogNC4gUmVtb3ZlcyBpbm5lciBzcGFjaW5nIGluIElFIDcgd2l0aG91dCBhZmZlY3Rpbmcgbm9ybWFsIHRleHQgaW5wdXRzLlxcbiAqICAgIEtub3duIGlzc3VlOiBpbm5lciBzcGFjaW5nIHJlbWFpbnMgaW4gSUUgNi5cXG4gKi9cXG5cXG5idXR0b24sXFxuaHRtbCBpbnB1dFt0eXBlPVxcXCJidXR0b25cXFwiXSwgLyogMSAqL1xcbmlucHV0W3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuaW5wdXRbdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMiAqL1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7IC8qIDMgKi9cXG4gICAgKm92ZXJmbG93OiB2aXNpYmxlOyAgLyogNCAqL1xcbn1cXG5cXG4vKlxcbiAqIFJlLXNldCBkZWZhdWx0IGN1cnNvciBmb3IgZGlzYWJsZWQgZWxlbWVudHMuXFxuICovXFxuXFxuYnV0dG9uW2Rpc2FibGVkXSxcXG5pbnB1dFtkaXNhYmxlZF0ge1xcbiAgICBjdXJzb3I6IGRlZmF1bHQ7XFxufVxcblxcbi8qXFxuICogMS4gQWRkcmVzc2VzIGJveCBzaXppbmcgc2V0IHRvIGNvbnRlbnQtYm94IGluIElFIDgvOS5cXG4gKiAyLiBSZW1vdmVzIGV4Y2VzcyBwYWRkaW5nIGluIElFIDgvOS5cXG4gKiAzLiBSZW1vdmVzIGV4Y2VzcyBwYWRkaW5nIGluIElFIDcuXFxuICogICAgS25vd24gaXNzdWU6IGV4Y2VzcyBwYWRkaW5nIHJlbWFpbnMgaW4gSUUgNi5cXG4gKi9cXG5cXG5pbnB1dFt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcbmlucHV0W3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICAgIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG4gICAgKmhlaWdodDogMTNweDsgLyogMyAqL1xcbiAgICAqd2lkdGg6IDEzcHg7IC8qIDMgKi9cXG59XFxuXFxuLypcXG4gKiAxLiBBZGRyZXNzZXMgYGFwcGVhcmFuY2VgIHNldCB0byBgc2VhcmNoZmllbGRgIGluIFNhZmFyaSA1IGFuZCBDaHJvbWUuXFxuICogMi4gQWRkcmVzc2VzIGBib3gtc2l6aW5nYCBzZXQgdG8gYGJvcmRlci1ib3hgIGluIFNhZmFyaSA1IGFuZCBDaHJvbWVcXG4gKiAgICAoaW5jbHVkZSBgLW1vemAgdG8gZnV0dXJlLXByb29mKS5cXG4gKi9cXG5cXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICAgIC1tb3otYm94LXNpemluZzogY29udGVudC1ib3g7XFxuICAgIC13ZWJraXQtYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDIgKi9cXG4gICAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxufVxcblxcbi8qXFxuICogUmVtb3ZlcyBpbm5lciBwYWRkaW5nIGFuZCBzZWFyY2ggY2FuY2VsIGJ1dHRvbiBpbiBTYWZhcmkgNSBhbmQgQ2hyb21lXFxuICogb24gT1MgWC5cXG4gKi9cXG5cXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixcXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLypcXG4gKiBSZW1vdmVzIGlubmVyIHBhZGRpbmcgYW5kIGJvcmRlciBpbiBGaXJlZm94IDMrLlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5pbnB1dDo6LW1vei1mb2N1cy1pbm5lciB7XFxuICAgIGJvcmRlcjogMDtcXG4gICAgcGFkZGluZzogMDtcXG59XFxuXFxuLypcXG4gKiAxLiBSZW1vdmVzIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDYvNy84LzkuXFxuICogMi4gSW1wcm92ZXMgcmVhZGFiaWxpdHkgYW5kIGFsaWdubWVudCBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxudGV4dGFyZWEge1xcbiAgICBvdmVyZmxvdzogYXV0bzsgLyogMSAqL1xcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wOyAvKiAyICovXFxufVxcblxcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XFxuICAgVGFibGVzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKlxcbiAqIFJlbW92ZSBtb3N0IHNwYWNpbmcgYmV0d2VlbiB0YWJsZSBjZWxscy5cXG4gKi9cXG5cXG50YWJsZSB7XFxuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuICAgIGJvcmRlci1zcGFjaW5nOiAwO1xcbn1cIik7XG5cbiAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gbG9naW5UbXBsKHt9KTtcblxuICBhdXRoMC5nZXRTU09EYXRhKGZ1bmN0aW9uIChlcnIsIHNzb0RhdGEpIHtcbiAgICBfc3NvRGF0YSA9IHNzb0RhdGE7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIGluaXRpYWxpemUoKTtcbiAgfSk7XG59KTtcbiIsInZhciBnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9O3ZhciBhc3NlcnRfcmVxdWlyZWQgICA9IHJlcXVpcmUoJy4vbGliL2Fzc2VydF9yZXF1aXJlZCcpO1xudmFyIGJhc2U2NF91cmxfZGVjb2RlID0gcmVxdWlyZSgnLi9saWIvYmFzZTY0X3VybF9kZWNvZGUnKTtcbnZhciBxcyAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJ3FzJyk7XG52YXIgcmVxd2VzdCAgICAgICAgICAgPSByZXF1aXJlKCdyZXF3ZXN0Jyk7XG5cbnZhciBqc29ucCAgICAgICAgICAgICA9IHJlcXVpcmUoJ2pzb25wJyk7XG5cbnZhciB1c2VfanNvbnAgICAgICAgICA9IHJlcXVpcmUoJy4vbGliL3VzZV9qc29ucCcpO1xudmFyIExvZ2luRXJyb3IgICAgICAgID0gcmVxdWlyZSgnLi9saWIvTG9naW5FcnJvcicpO1xudmFyIGpzb25fcGFyc2UgICAgICAgID0gcmVxdWlyZSgnLi9saWIvanNvbl9wYXJzZScpO1xuXG5mdW5jdGlvbiBBdXRoMCAob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQXV0aDApKSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoMChvcHRpb25zKTtcbiAgfVxuXG4gIGFzc2VydF9yZXF1aXJlZChvcHRpb25zLCAnY2xpZW50SUQnKTtcbiAgYXNzZXJ0X3JlcXVpcmVkKG9wdGlvbnMsICdjYWxsYmFja1VSTCcpO1xuICBhc3NlcnRfcmVxdWlyZWQob3B0aW9ucywgJ2RvbWFpbicpO1xuXG4gIHRoaXMuX2NsaWVudElEID0gb3B0aW9ucy5jbGllbnRJRDtcbiAgdGhpcy5fY2FsbGJhY2tVUkwgPSBvcHRpb25zLmNhbGxiYWNrVVJMO1xuICB0aGlzLl9kb21haW4gPSBvcHRpb25zLmRvbWFpbjtcbiAgaWYgKG9wdGlvbnMuc3VjY2Vzcykge1xuICAgIHRoaXMucGFyc2VIYXNoKG9wdGlvbnMuc3VjY2Vzcyk7XG4gIH1cbiAgdGhpcy5fZmFpbHVyZSA9IG9wdGlvbnMuZmFpbHVyZTtcbn1cblxuQXV0aDAucHJvdG90eXBlLl9yZWRpcmVjdCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgZ2xvYmFsLndpbmRvdy5sb2NhdGlvbiA9IHVybDtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5fcmVuZGVyQW5kU3VibWl0V1NGZWRGb3JtID0gZnVuY3Rpb24gKGZvcm1IdG1sKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGZvcm1IdG1sO1xuICB2YXIgZm9ybSA9IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2KS5jaGlsZHJlblswXTtcbiAgZm9ybS5zdWJtaXQoKTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5wYXJzZUhhc2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYoIXdpbmRvdy5sb2NhdGlvbi5oYXNoLm1hdGNoKC9hY2Nlc3NfdG9rZW4vKSkgcmV0dXJuO1xuICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKTtcbiAgdmFyIHBhcnNlZF9xcyA9IHFzLnBhcnNlKGhhc2gpO1xuICB2YXIgaWRfdG9rZW4gPSBwYXJzZWRfcXMuaWRfdG9rZW47XG4gIHZhciBlbmNvZGVkID0gaWRfdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgdmFyIHByb2YgPSBqc29uX3BhcnNlKGJhc2U2NF91cmxfZGVjb2RlKGVuY29kZWQpKTtcbiAgY2FsbGJhY2socHJvZiwgaWRfdG9rZW4sIHBhcnNlZF9xcy5hY2Nlc3NfdG9rZW4sIHBhcnNlZF9xcy5zdGF0ZSk7XG59O1xuXG5BdXRoMC5wcm90b3R5cGUuc2lnbnVwID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICBxdWVyeS5lbWFpbCA9IG9wdGlvbnMudXNlcm5hbWUgfHwgb3B0aW9ucy5lbWFpbDtcbiAgcXVlcnkucGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkO1xuICBcbiAgcXVlcnkudGVuYW50ID0gdGhpcy5fZG9tYWluLnNwbGl0KCcuJylbMF07XG5cbiAgZnVuY3Rpb24gc3VjY2VzcyAoKSB7XG4gICAgaWYgKCdhdXRvX2xvZ2luJyBpbiBvcHRpb25zICYmICFvcHRpb25zLmF1dG9fbG9naW4pIHtcbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi5sb2dpbihvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICBmdW5jdGlvbiBmYWlsIChzdGF0dXMsIHJlc3ApIHtcbiAgICB2YXIgZXJyb3IgPSBuZXcgTG9naW5FcnJvcihzdGF0dXMsIHJlc3ApO1xuICAgIGlmIChjYWxsYmFjaykgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgIGlmIChzZWxmLl9mYWlsdXJlKSByZXR1cm4gc2VsZi5fZmFpbHVyZShlcnJvcik7IFxuICB9XG5cbiAgaWYgKHVzZV9qc29ucCgpKSB7XG4gICAgcmV0dXJuIGpzb25wKCdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvc2lnbnVwPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGZhaWwoMCwgZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwLnN0YXR1cyA9PSAyMDAgPyBcbiAgICAgICAgICAgICAgc3VjY2VzcygpIDpcbiAgICAgICAgICAgICAgZmFpbChyZXNwLnN0YXR1cywgcmVzcC5lcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVxd2VzdCh7XG4gICAgdXJsOiAgICAgJ2h0dHBzOi8vJyArIHRoaXMuX2RvbWFpbiArICcvZGJjb25uZWN0aW9ucy9zaWdudXAnLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2Vzczogc3VjY2Vzc1xuICB9KS5mYWlsKGZ1bmN0aW9uIChlcnIpIHtcbiAgICBmYWlsKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5sb2dpbiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAob3B0aW9ucy51c2VybmFtZSB8fCBvcHRpb25zLmVtYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW5XaXRoRGJDb25uZWN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBxdWVyeSA9IHtcbiAgICByZXNwb25zZV90eXBlOiAndG9rZW4nLFxuICAgIGNsaWVudF9pZDogICAgIHRoaXMuX2NsaWVudElELFxuICAgIGNvbm5lY3Rpb246ICAgIG9wdGlvbnMuY29ubmVjdGlvbixcbiAgICByZWRpcmVjdF91cmk6ICB0aGlzLl9jYWxsYmFja1VSTCxcbiAgICBzY29wZTogICAgICAgICAnb3BlbmlkIHByb2ZpbGUnXG4gIH07XG5cbiAgaWYgKG9wdGlvbnMuc3RhdGUpIHtcbiAgICBxdWVyeS5zdGF0ZSA9IG9wdGlvbnMuc3RhdGU7XG4gIH1cblxuICB0aGlzLl9yZWRpcmVjdCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9hdXRob3JpemU/JyArIHFzLnN0cmluZ2lmeShxdWVyeSkpO1xufTtcblxuQXV0aDAucHJvdG90eXBlLmxvZ2luV2l0aERiQ29ubmVjdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICB2YXIgcXVlcnkgPSB7XG4gICAgcmVzcG9uc2VfdHlwZTogJ3Rva2VuJyxcbiAgICBjbGllbnRfaWQ6ICAgICB0aGlzLl9jbGllbnRJRCxcbiAgICBjb25uZWN0aW9uOiAgICBvcHRpb25zLmNvbm5lY3Rpb24sXG4gICAgcmVkaXJlY3RfdXJpOiAgdGhpcy5fY2FsbGJhY2tVUkwsXG4gICAgc2NvcGU6ICAgICAgICAgJ29wZW5pZCBwcm9maWxlJ1xuICB9O1xuXG4gIGlmIChvcHRpb25zLnN0YXRlKSB7XG4gICAgcXVlcnkuc3RhdGUgPSBvcHRpb25zLnN0YXRlO1xuICB9XG5cbiAgcXVlcnkudXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG9wdGlvbnMuZW1haWw7XG4gIHF1ZXJ5LnBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZDtcbiAgXG4gIHF1ZXJ5LnRlbmFudCA9IHRoaXMuX2RvbWFpbi5zcGxpdCgnLicpWzBdO1xuXG4gIGZ1bmN0aW9uIHJldHVybl9lcnJvciAoZXJyb3IpIHtcbiAgICBpZiAoY2FsbGJhY2spICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICBpZiAoc2VsZi5fZmFpbHVyZSkgcmV0dXJuIHNlbGYuX2ZhaWx1cmUoZXJyb3IpOyBcbiAgfVxuXG4gIGlmICh1c2VfanNvbnAoKSkge1xuICAgIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy9kYmNvbm5lY3Rpb25zL2xvZ2luPycgKyBxcy5zdHJpbmdpZnkocXVlcnkpLCB7XG4gICAgICBwYXJhbTogJ2NieCcsXG4gICAgICB0aW1lb3V0OiAxNTAwMFxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgaWYoJ2Vycm9yJyBpbiByZXNwKSB7XG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKHJlc3Auc3RhdHVzLCByZXNwLmVycm9yKTtcbiAgICAgICAgcmV0dXJuIHJldHVybl9lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgICBzZWxmLl9yZW5kZXJBbmRTdWJtaXRXU0ZlZEZvcm0ocmVzcC5mb3JtKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlcXdlc3Qoe1xuICAgIHVybDogICAgICdodHRwczovLycgKyB0aGlzLl9kb21haW4gKyAnL2RiY29ubmVjdGlvbnMvbG9naW4nLFxuICAgIG1ldGhvZDogICdwb3N0JyxcbiAgICB0eXBlOiAgICAnaHRtbCcsXG4gICAgZGF0YTogICAgcXVlcnksXG4gICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgIHNlbGYuX3JlbmRlckFuZFN1Ym1pdFdTRmVkRm9ybShyZXNwKTtcbiAgICB9XG4gIH0pLmZhaWwoZnVuY3Rpb24gKGVycikge1xuICAgIHZhciBlcnJvciA9IG5ldyBMb2dpbkVycm9yKGVyci5zdGF0dXMsIGVyci5yZXNwb25zZVRleHQpO1xuICAgIHJldHVybiByZXR1cm5fZXJyb3IoZXJyb3IpO1xuICB9KTtcbn07XG5cbkF1dGgwLnByb3RvdHlwZS5nZXRTU09EYXRhID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHJldHVybiBqc29ucCgnaHR0cHM6Ly8nICsgdGhpcy5fZG9tYWluICsgJy91c2VyL3Nzb2RhdGEnLCB7XG4gICAgcGFyYW06ICdjYngnLFxuICAgIHRpbWVvdXQ6IDE1MDAwXG4gIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICBjYWxsYmFjayhudWxsLCBlcnIgP8Kge30gOiByZXNwKTsgLy8gQWx3YXlzIHJldHVybiBPSywgcmVnYXJkbGVzcyBvZiBhbnkgZXJyb3JzXG4gIH0pO1xufTtcblxuaWYgKGdsb2JhbC53aW5kb3cpIHtcbiAgZ2xvYmFsLndpbmRvdy5BdXRoMCA9IEF1dGgwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGgwOyIsInZhciBqc29uX3BhcnNlID0gcmVxdWlyZSgnLi9qc29uX3BhcnNlJyk7XG5cbmZ1bmN0aW9uIExvZ2luRXJyb3Ioc3RhdHVzLCBkZXRhaWxzKSB7XG4gIHZhciBvYmo7XG5cbiAgaWYgKHR5cGVvZiBkZXRhaWxzID09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIG9iaiA9IGpzb25fcGFyc2UoZGV0YWlscyk7XG4gICAgfSBjYXRjaCAoZXIpIHtcbiAgICAgIG9iaiA9IHttZXNzYWdlOiBkZXRhaWxzfTsgICAgICBcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb2JqID0gZGV0YWlscztcbiAgfVxuXG4gIHZhciBlcnIgPSBFcnJvci5jYWxsKHRoaXMsIG9iai5kZXNjcmlwdGlvbiB8fCBvYmoubWVzc2FnZSB8fCBvYmouZXJyb3IpO1xuXG4gIGVyci5zdGF0dXMgPSBzdGF0dXM7XG4gIGVyci5uYW1lID0gb2JqLmNvZGU7XG4gIGVyci5jb2RlID0gb2JqLmNvZGU7XG4gIGVyci5kZXRhaWxzID0gb2JqO1xuICBcbiAgaWYgKHN0YXR1cyA9PT0gMCkge1xuICAgIGVyci5jb2RlID0gXCJVbmtub3duXCI7XG4gICAgZXJyLm1lc3NhZ2UgPSBcIlVua25vd24gZXJyb3IuXCI7XG4gIH1cblxuICByZXR1cm4gZXJyO1xufVxuXG5pZiAoT2JqZWN0ICYmIE9iamVjdC5jcmVhdGUpIHtcbiAgTG9naW5FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSwgeyBcbiAgICBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogTG9naW5FcnJvciB9IFxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2dpbkVycm9yOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaiwgcHJvcCkge1xuICBpZiAoIW9ialtwcm9wXSkge1xuICAgIHRocm93IG5ldyBFcnJvcihwcm9wICsgJyBpcyByZXF1aXJlZC4nKTtcbiAgfVxufTsiLCJ2YXIgQmFzZTY0ID0gcmVxdWlyZSgnQmFzZTY0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBvdXRwdXQgPSBzdHIucmVwbGFjZShcIi1cIiwgXCIrXCIpLnJlcGxhY2UoXCJfXCIsIFwiL1wiKTtcbiAgc3dpdGNoIChvdXRwdXQubGVuZ3RoICUgNCkge1xuICAgIGNhc2UgMDpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIG91dHB1dCArPSBcIj09XCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDM6XG4gICAgICBvdXRwdXQgKz0gXCI9XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgXCJJbGxlZ2FsIGJhc2U2NHVybCBzdHJpbmchXCI7XG4gIH1cbiAgcmV0dXJuIEJhc2U2NC5hdG9iKG91dHB1dCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gd2luZG93LkpTT04gPyB3aW5kb3cuSlNPTi5wYXJzZShzdHIpIDogZXZhbCgnKCcgKyBzdHIgKyAnKScpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHhociA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbnVsbDtcbiAgXG4gIGlmICh4aHIgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICdYRG9tYWluUmVxdWVzdCcgaW4gd2luZG93ICYmIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHA6Jztcbn07IiwiOyhmdW5jdGlvbiAoKSB7XG5cbiAgdmFyXG4gICAgb2JqZWN0ID0gdHlwZW9mIGV4cG9ydHMgIT0gJ3VuZGVmaW5lZCcgPyBleHBvcnRzIDogdGhpcywgLy8gIzg6IHdlYiB3b3JrZXJzXG4gICAgY2hhcnMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLFxuICAgIElOVkFMSURfQ0hBUkFDVEVSX0VSUiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBmYWJyaWNhdGUgYSBzdWl0YWJsZSBlcnJvciBvYmplY3RcbiAgICAgIHRyeSB7IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJyQnKTsgfVxuICAgICAgY2F0Y2ggKGVycm9yKSB7IHJldHVybiBlcnJvcjsgfX0oKSk7XG5cbiAgLy8gZW5jb2RlclxuICAvLyBbaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vOTk5MTY2XSBieSBbaHR0cHM6Ly9naXRodWIuY29tL25pZ25hZ11cbiAgb2JqZWN0LmJ0b2EgfHwgKFxuICBvYmplY3QuYnRvYSA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGZvciAoXG4gICAgICAvLyBpbml0aWFsaXplIHJlc3VsdCBhbmQgY291bnRlclxuICAgICAgdmFyIGJsb2NrLCBjaGFyQ29kZSwgaWR4ID0gMCwgbWFwID0gY2hhcnMsIG91dHB1dCA9ICcnO1xuICAgICAgLy8gaWYgdGhlIG5leHQgaW5wdXQgaW5kZXggZG9lcyBub3QgZXhpc3Q6XG4gICAgICAvLyAgIGNoYW5nZSB0aGUgbWFwcGluZyB0YWJsZSB0byBcIj1cIlxuICAgICAgLy8gICBjaGVjayBpZiBkIGhhcyBubyBmcmFjdGlvbmFsIGRpZ2l0c1xuICAgICAgaW5wdXQuY2hhckF0KGlkeCB8IDApIHx8IChtYXAgPSAnPScsIGlkeCAlIDEpO1xuICAgICAgLy8gXCI4IC0gaWR4ICUgMSAqIDhcIiBnZW5lcmF0ZXMgdGhlIHNlcXVlbmNlIDIsIDQsIDYsIDhcbiAgICAgIG91dHB1dCArPSBtYXAuY2hhckF0KDYzICYgYmxvY2sgPj4gOCAtIGlkeCAlIDEgKiA4KVxuICAgICkge1xuICAgICAgY2hhckNvZGUgPSBpbnB1dC5jaGFyQ29kZUF0KGlkeCArPSAzLzQpO1xuICAgICAgaWYgKGNoYXJDb2RlID4gMHhGRikgdGhyb3cgSU5WQUxJRF9DSEFSQUNURVJfRVJSO1xuICAgICAgYmxvY2sgPSBibG9jayA8PCA4IHwgY2hhckNvZGU7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0pO1xuXG4gIC8vIGRlY29kZXJcbiAgLy8gW2h0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwMjAzOTZdIGJ5IFtodHRwczovL2dpdGh1Yi5jb20vYXRrXVxuICBvYmplY3QuYXRvYiB8fCAoXG4gIG9iamVjdC5hdG9iID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC89KyQvLCAnJylcbiAgICBpZiAoaW5wdXQubGVuZ3RoICUgNCA9PSAxKSB0aHJvdyBJTlZBTElEX0NIQVJBQ1RFUl9FUlI7XG4gICAgZm9yIChcbiAgICAgIC8vIGluaXRpYWxpemUgcmVzdWx0IGFuZCBjb3VudGVyc1xuICAgICAgdmFyIGJjID0gMCwgYnMsIGJ1ZmZlciwgaWR4ID0gMCwgb3V0cHV0ID0gJyc7XG4gICAgICAvLyBnZXQgbmV4dCBjaGFyYWN0ZXJcbiAgICAgIGJ1ZmZlciA9IGlucHV0LmNoYXJBdChpZHgrKyk7XG4gICAgICAvLyBjaGFyYWN0ZXIgZm91bmQgaW4gdGFibGU/IGluaXRpYWxpemUgYml0IHN0b3JhZ2UgYW5kIGFkZCBpdHMgYXNjaWkgdmFsdWU7XG4gICAgICB+YnVmZmVyICYmIChicyA9IGJjICUgNCA/IGJzICogNjQgKyBidWZmZXIgOiBidWZmZXIsXG4gICAgICAgIC8vIGFuZCBpZiBub3QgZmlyc3Qgb2YgZWFjaCA0IGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIGNvbnZlcnQgdGhlIGZpcnN0IDggYml0cyB0byBvbmUgYXNjaWkgY2hhcmFjdGVyXG4gICAgICAgIGJjKysgJSA0KSA/IG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSAmIGJzID4+ICgtMiAqIGJjICYgNikpIDogMFxuICAgICkge1xuICAgICAgLy8gdHJ5IHRvIGZpbmQgY2hhcmFjdGVyIGluIHRhYmxlICgwLTYzLCBub3QgZm91bmQgPT4gLTEpXG4gICAgICBidWZmZXIgPSBjaGFycy5pbmRleE9mKGJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0pO1xuXG59KCkpO1xuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXNcbiAqL1xuXG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdqc29ucCcpO1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnA7XG5cbi8qKlxuICogQ2FsbGJhY2sgaW5kZXguXG4gKi9cblxudmFyIGNvdW50ID0gMDtcblxuLyoqXG4gKiBOb29wIGZ1bmN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIEpTT05QIGhhbmRsZXJcbiAqXG4gKiBPcHRpb25zOlxuICogIC0gcGFyYW0ge1N0cmluZ30gcXMgcGFyYW1ldGVyIChgY2FsbGJhY2tgKVxuICogIC0gdGltZW91dCB7TnVtYmVyfSBob3cgbG9uZyBhZnRlciBhIHRpbWVvdXQgZXJyb3IgaXMgZW1pdHRlZCAoYDYwMDAwYClcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gb3B0aW9uYWwgb3B0aW9ucyAvIGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25hbCBjYWxsYmFja1xuICovXG5cbmZ1bmN0aW9uIGpzb25wKHVybCwgb3B0cywgZm4pe1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb3B0cykge1xuICAgIGZuID0gb3B0cztcbiAgICBvcHRzID0ge307XG4gIH1cblxuICB2YXIgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBwYXJhbSA9IG9wdHMucGFyYW0gfHwgJ2NhbGxiYWNrJztcbiAgdmFyIHRpbWVvdXQgPSBudWxsICE9IG9wdHMudGltZW91dCA/IG9wdHMudGltZW91dCA6IDYwMDAwO1xuICB2YXIgZW5jID0gZW5jb2RlVVJJQ29tcG9uZW50O1xuICB2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdO1xuICB2YXIgc2NyaXB0O1xuICB2YXIgdGltZXI7XG5cbiAgLy8gZ2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIHRoaXMgcmVxdWVzdFxuICB2YXIgaWQgPSBjb3VudCsrO1xuXG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBjbGVhbnVwKCk7XG4gICAgICBmbiAmJiBmbihuZXcgRXJyb3IoJ1RpbWVvdXQnKSk7XG4gICAgfSwgdGltZW91dCk7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhbnVwKCl7XG4gICAgdGFyZ2V0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICB3aW5kb3dbJ19fanAnICsgaWRdID0gbm9vcDtcbiAgfVxuXG4gIHdpbmRvd1snX19qcCcgKyBpZF0gPSBmdW5jdGlvbihkYXRhKXtcbiAgICBkZWJ1ZygnanNvbnAgZ290JywgZGF0YSk7XG4gICAgaWYgKHRpbWVyKSBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIGNsZWFudXAoKTtcbiAgICBmbiAmJiBmbihudWxsLCBkYXRhKTtcbiAgfTtcblxuICAvLyBhZGQgcXMgY29tcG9uZW50XG4gIHVybCArPSAofnVybC5pbmRleE9mKCc/JykgPyAnJicgOiAnPycpICsgcGFyYW0gKyAnPScgKyBlbmMoJ19fanAnICsgaWQgKyAnJyk7XG4gIHVybCA9IHVybC5yZXBsYWNlKCc/JicsICc/Jyk7XG5cbiAgZGVidWcoJ2pzb25wIHJlcSBcIiVzXCInLCB1cmwpO1xuXG4gIC8vIGNyZWF0ZSBzY3JpcHRcbiAgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5zcmMgPSB1cmw7XG4gIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIHRhcmdldCk7XG59O1xuIiwiXG4vKipcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYnVnO1xuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7VHlwZX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVidWcobmFtZSkge1xuICBpZiAoIWRlYnVnLmVuYWJsZWQobmFtZSkpIHJldHVybiBmdW5jdGlvbigpe307XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGZtdCl7XG4gICAgdmFyIGN1cnIgPSBuZXcgRGF0ZTtcbiAgICB2YXIgbXMgPSBjdXJyIC0gKGRlYnVnW25hbWVdIHx8IGN1cnIpO1xuICAgIGRlYnVnW25hbWVdID0gY3VycjtcblxuICAgIGZtdCA9IG5hbWVcbiAgICAgICsgJyAnXG4gICAgICArIGZtdFxuICAgICAgKyAnICsnICsgZGVidWcuaHVtYW5pemUobXMpO1xuXG4gICAgLy8gVGhpcyBoYWNrZXJ5IGlzIHJlcXVpcmVkIGZvciBJRThcbiAgICAvLyB3aGVyZSBgY29uc29sZS5sb2dgIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gICAgd2luZG93LmNvbnNvbGVcbiAgICAgICYmIGNvbnNvbGUubG9nXG4gICAgICAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZywgY29uc29sZSwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMuXG4gKi9cblxuZGVidWcubmFtZXMgPSBbXTtcbmRlYnVnLnNraXBzID0gW107XG5cbi8qKlxuICogRW5hYmxlcyBhIGRlYnVnIG1vZGUgYnkgbmFtZS4gVGhpcyBjYW4gaW5jbHVkZSBtb2Rlc1xuICogc2VwYXJhdGVkIGJ5IGEgY29sb24gYW5kIHdpbGRjYXJkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5kZWJ1Zy5lbmFibGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRyeSB7XG4gICAgbG9jYWxTdG9yYWdlLmRlYnVnID0gbmFtZTtcbiAgfSBjYXRjaChlKXt9XG5cbiAgdmFyIHNwbGl0ID0gKG5hbWUgfHwgJycpLnNwbGl0KC9bXFxzLF0rLylcbiAgICAsIGxlbiA9IHNwbGl0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgbmFtZSA9IHNwbGl0W2ldLnJlcGxhY2UoJyonLCAnLio/Jyk7XG4gICAgaWYgKG5hbWVbMF0gPT09ICctJykge1xuICAgICAgZGVidWcuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWUuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGVidWcubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWUgKyAnJCcpKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5kZWJ1Zy5kaXNhYmxlID0gZnVuY3Rpb24oKXtcbiAgZGVidWcuZW5hYmxlKCcnKTtcbn07XG5cbi8qKlxuICogSHVtYW5pemUgdGhlIGdpdmVuIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmRlYnVnLmh1bWFuaXplID0gZnVuY3Rpb24obXMpIHtcbiAgdmFyIHNlYyA9IDEwMDBcbiAgICAsIG1pbiA9IDYwICogMTAwMFxuICAgICwgaG91ciA9IDYwICogbWluO1xuXG4gIGlmIChtcyA+PSBob3VyKSByZXR1cm4gKG1zIC8gaG91cikudG9GaXhlZCgxKSArICdoJztcbiAgaWYgKG1zID49IG1pbikgcmV0dXJuIChtcyAvIG1pbikudG9GaXhlZCgxKSArICdtJztcbiAgaWYgKG1zID49IHNlYykgcmV0dXJuIChtcyAvIHNlYyB8IDApICsgJ3MnO1xuICByZXR1cm4gbXMgKyAnbXMnO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmRlYnVnLmVuYWJsZWQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkZWJ1Zy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChkZWJ1Zy5za2lwc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkZWJ1Zy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChkZWJ1Zy5uYW1lc1tpXS50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy8gcGVyc2lzdFxuXG5pZiAod2luZG93LmxvY2FsU3RvcmFnZSkgZGVidWcuZW5hYmxlKGxvY2FsU3RvcmFnZS5kZWJ1Zyk7XG4iLCIvKipcbiAqIE9iamVjdCN0b1N0cmluZygpIHJlZiBmb3Igc3RyaW5naWZ5KCkuXG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBPYmplY3QjaGFzT3duUHJvcGVydHkgcmVmXG4gKi9cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBzZWUgaXNzdWUgIzcwXG4gKi9cbnZhciBpc1Jlc3RvcmFibGVQcm90byA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBvO1xuXG4gIGlmICghT2JqZWN0LmNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuXG4gIG8gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBvLl9fcHJvdG9fXyA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgcmV0dXJuIG8uaGFzT3duUHJvcGVydHkgPT09IGhhc093blByb3BlcnR5O1xufSkoKTtcblxuLyoqXG4gKiBBcnJheSNpbmRleE9mIHNoaW0uXG4gKi9cblxudmFyIGluZGV4T2YgPSB0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbidcbiAgPyBmdW5jdGlvbihhcnIsIGVsKSB7IHJldHVybiBhcnIuaW5kZXhPZihlbCk7IH1cbiAgOiBmdW5jdGlvbihhcnIsIGVsKSB7XG4gICAgICBpZiAodHlwZW9mIGFyciA9PSAnc3RyaW5nJyAmJiB0eXBlb2YgXCJhXCJbMF0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXJyID0gYXJyLnNwbGl0KCcnKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhcnJbaV0gPT09IGVsKSByZXR1cm4gaTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4vKipcbiAqIEFycmF5LmlzQXJyYXkgc2hpbS5cbiAqL1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbi8qKlxuICogT2JqZWN0LmtleXMgc2hpbS5cbiAqL1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqIEFycmF5I2ZvckVhY2ggc2hpbS5cbiAqL1xuXG52YXIgZm9yRWFjaCA9IHR5cGVvZiBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCA9PT0gJ2Z1bmN0aW9uJ1xuICA/IGZ1bmN0aW9uKGFyciwgZm4pIHsgcmV0dXJuIGFyci5mb3JFYWNoKGZuKTsgfVxuICA6IGZ1bmN0aW9uKGFyciwgZm4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBmbihhcnJbaV0pO1xuICAgIH07XG5cbi8qKlxuICogQXJyYXkjcmVkdWNlIHNoaW0uXG4gKi9cblxudmFyIHJlZHVjZSA9IGZ1bmN0aW9uKGFyciwgZm4sIGluaXRpYWwpIHtcbiAgaWYgKHR5cGVvZiBhcnIucmVkdWNlID09PSAnZnVuY3Rpb24nKSByZXR1cm4gYXJyLnJlZHVjZShmbiwgaW5pdGlhbCk7XG4gIHZhciByZXMgPSBpbml0aWFsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykgcmVzID0gZm4ocmVzLCBhcnJbaV0pO1xuICByZXR1cm4gcmVzO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBudWxsYXJ5IG9iamVjdCBpZiBwb3NzaWJsZVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdCgpIHtcbiAgcmV0dXJuIGlzUmVzdG9yYWJsZVByb3RvXG4gICAgPyBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgOiB7fTtcbn1cblxuLyoqXG4gKiBDYWNoZSBub24taW50ZWdlciB0ZXN0IHJlZ2V4cC5cbiAqL1xuXG52YXIgaXNpbnQgPSAvXlswLTldKyQvO1xuXG5mdW5jdGlvbiBwcm9tb3RlKHBhcmVudCwga2V5KSB7XG4gIGlmIChwYXJlbnRba2V5XS5sZW5ndGggPT0gMCkgcmV0dXJuIHBhcmVudFtrZXldID0gY3JlYXRlT2JqZWN0KCk7XG4gIHZhciB0ID0gY3JlYXRlT2JqZWN0KCk7XG4gIGZvciAodmFyIGkgaW4gcGFyZW50W2tleV0pIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChwYXJlbnRba2V5XSwgaSkpIHtcbiAgICAgIHRbaV0gPSBwYXJlbnRba2V5XVtpXTtcbiAgICB9XG4gIH1cbiAgcGFyZW50W2tleV0gPSB0O1xuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocGFydHMsIHBhcmVudCwga2V5LCB2YWwpIHtcbiAgdmFyIHBhcnQgPSBwYXJ0cy5zaGlmdCgpO1xuICAvLyBlbmRcbiAgaWYgKCFwYXJ0KSB7XG4gICAgaWYgKGlzQXJyYXkocGFyZW50W2tleV0pKSB7XG4gICAgICBwYXJlbnRba2V5XS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgfVxuICAgIC8vIGFycmF5XG4gIH0gZWxzZSB7XG4gICAgdmFyIG9iaiA9IHBhcmVudFtrZXldID0gcGFyZW50W2tleV0gfHwgW107XG4gICAgaWYgKCddJyA9PSBwYXJ0KSB7XG4gICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmICgnJyAhPSB2YWwpIG9iai5wdXNoKHZhbCk7XG4gICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBvYmopIHtcbiAgICAgICAgb2JqW29iamVjdEtleXMob2JqKS5sZW5ndGhdID0gdmFsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqID0gcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICB9XG4gICAgICAvLyBwcm9wXG4gICAgfSBlbHNlIGlmICh+aW5kZXhPZihwYXJ0LCAnXScpKSB7XG4gICAgICBwYXJ0ID0gcGFydC5zdWJzdHIoMCwgcGFydC5sZW5ndGggLSAxKTtcbiAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgIC8vIGtleVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgcGFyZW50IGtleS92YWwgcGFpci5cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZShwYXJlbnQsIGtleSwgdmFsKXtcbiAgaWYgKH5pbmRleE9mKGtleSwgJ10nKSkge1xuICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnWycpXG4gICAgICAsIGxlbiA9IHBhcnRzLmxlbmd0aFxuICAgICAgLCBsYXN0ID0gbGVuIC0gMTtcbiAgICBwYXJzZShwYXJ0cywgcGFyZW50LCAnYmFzZScsIHZhbCk7XG4gICAgLy8gb3B0aW1pemVcbiAgfSBlbHNlIHtcbiAgICBpZiAoIWlzaW50LnRlc3Qoa2V5KSAmJiBpc0FycmF5KHBhcmVudC5iYXNlKSkge1xuICAgICAgdmFyIHQgPSBjcmVhdGVPYmplY3QoKTtcbiAgICAgIGZvciAodmFyIGsgaW4gcGFyZW50LmJhc2UpIHRba10gPSBwYXJlbnQuYmFzZVtrXTtcbiAgICAgIHBhcmVudC5iYXNlID0gdDtcbiAgICB9XG4gICAgc2V0KHBhcmVudC5iYXNlLCBrZXksIHZhbCk7XG4gIH1cblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vKipcbiAqIENvbXBhY3Qgc3BhcnNlIGFycmF5cy5cbiAqL1xuXG5mdW5jdGlvbiBjb21wYWN0KG9iaikge1xuICBpZiAoJ29iamVjdCcgIT0gdHlwZW9mIG9iaikgcmV0dXJuIG9iajtcblxuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIHtcbiAgICAgICAgcmV0LnB1c2gob2JqW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIG9ialtrZXldID0gY29tcGFjdChvYmpba2V5XSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgT2JqZWN0LnByb3RvdHlwZS5cbiAqIHNlZSBwdWxsLXJlcXVlc3QgIzU4XG4gKi9cblxuZnVuY3Rpb24gcmVzdG9yZVByb3RvKG9iaikge1xuICBpZiAoIWlzUmVzdG9yYWJsZVByb3RvKSByZXR1cm4gb2JqO1xuICBpZiAoaXNBcnJheShvYmopKSByZXR1cm4gb2JqO1xuICBpZiAob2JqICYmICdvYmplY3QnICE9IHR5cGVvZiBvYmopIHJldHVybiBvYmo7XG5cbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgb2JqW2tleV0gPSByZXN0b3JlUHJvdG8ob2JqW2tleV0pO1xuICAgIH1cbiAgfVxuXG4gIG9iai5fX3Byb3RvX18gPSBPYmplY3QucHJvdG90eXBlO1xuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBvYmouXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VPYmplY3Qob2JqKXtcbiAgdmFyIHJldCA9IHsgYmFzZToge30gfTtcblxuICBmb3JFYWNoKG9iamVjdEtleXMob2JqKSwgZnVuY3Rpb24obmFtZSl7XG4gICAgbWVyZ2UocmV0LCBuYW1lLCBvYmpbbmFtZV0pO1xuICB9KTtcblxuICByZXR1cm4gY29tcGFjdChyZXQuYmFzZSk7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIHN0ci5cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpe1xuICB2YXIgcmV0ID0gcmVkdWNlKFN0cmluZyhzdHIpLnNwbGl0KCcmJyksIGZ1bmN0aW9uKHJldCwgcGFpcil7XG4gICAgdmFyIGVxbCA9IGluZGV4T2YocGFpciwgJz0nKVxuICAgICAgLCBicmFjZSA9IGxhc3RCcmFjZUluS2V5KHBhaXIpXG4gICAgICAsIGtleSA9IHBhaXIuc3Vic3RyKDAsIGJyYWNlIHx8IGVxbClcbiAgICAgICwgdmFsID0gcGFpci5zdWJzdHIoYnJhY2UgfHwgZXFsLCBwYWlyLmxlbmd0aClcbiAgICAgICwgdmFsID0gdmFsLnN1YnN0cihpbmRleE9mKHZhbCwgJz0nKSArIDEsIHZhbC5sZW5ndGgpO1xuXG4gICAgLy8gP2Zvb1xuICAgIGlmICgnJyA9PSBrZXkpIGtleSA9IHBhaXIsIHZhbCA9ICcnO1xuICAgIGlmICgnJyA9PSBrZXkpIHJldHVybiByZXQ7XG5cbiAgICByZXR1cm4gbWVyZ2UocmV0LCBkZWNvZGUoa2V5KSwgZGVjb2RlKHZhbCkpO1xuICB9LCB7IGJhc2U6IGNyZWF0ZU9iamVjdCgpIH0pLmJhc2U7XG5cbiAgcmV0dXJuIHJlc3RvcmVQcm90byhjb21wYWN0KHJldCkpO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBxdWVyeSBgc3RyYCBvciBgb2JqYCwgcmV0dXJuaW5nIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyIHwge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbihzdHIpe1xuICBpZiAobnVsbCA9PSBzdHIgfHwgJycgPT0gc3RyKSByZXR1cm4ge307XG4gIHJldHVybiAnb2JqZWN0JyA9PSB0eXBlb2Ygc3RyXG4gICAgPyBwYXJzZU9iamVjdChzdHIpXG4gICAgOiBwYXJzZVN0cmluZyhzdHIpO1xufTtcblxuLyoqXG4gKiBUdXJuIHRoZSBnaXZlbiBgb2JqYCBpbnRvIGEgcXVlcnkgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG52YXIgc3RyaW5naWZ5ID0gZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbihvYmosIHByZWZpeCkge1xuICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeUFycmF5KG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIGlmICgnW29iamVjdCBPYmplY3RdJyA9PSB0b1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICByZXR1cm4gc3RyaW5naWZ5T2JqZWN0KG9iaiwgcHJlZml4KTtcbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygb2JqKSB7XG4gICAgcmV0dXJuIHN0cmluZ2lmeVN0cmluZyhvYmosIHByZWZpeCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByZWZpeCArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcob2JqKSk7XG4gIH1cbn07XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlTdHJpbmcoc3RyLCBwcmVmaXgpIHtcbiAgaWYgKCFwcmVmaXgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZ2lmeSBleHBlY3RzIGFuIG9iamVjdCcpO1xuICByZXR1cm4gcHJlZml4ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHN0cik7XG59XG5cbi8qKlxuICogU3RyaW5naWZ5IHRoZSBnaXZlbiBgYXJyYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUFycmF5KGFyciwgcHJlZml4KSB7XG4gIHZhciByZXQgPSBbXTtcbiAgaWYgKCFwcmVmaXgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3N0cmluZ2lmeSBleHBlY3RzIGFuIG9iamVjdCcpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgIHJldC5wdXNoKHN0cmluZ2lmeShhcnJbaV0sIHByZWZpeCArICdbJyArIGkgKyAnXScpKTtcbiAgfVxuICByZXR1cm4gcmV0LmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBTdHJpbmdpZnkgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ2lmeU9iamVjdChvYmosIHByZWZpeCkge1xuICB2YXIgcmV0ID0gW11cbiAgICAsIGtleXMgPSBvYmplY3RLZXlzKG9iailcbiAgICAsIGtleTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGtleSA9IGtleXNbaV07XG4gICAgaWYgKCcnID09IGtleSkgY29udGludWU7XG4gICAgaWYgKG51bGwgPT0gb2JqW2tleV0pIHtcbiAgICAgIHJldC5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0LnB1c2goc3RyaW5naWZ5KG9ialtrZXldLCBwcmVmaXhcbiAgICAgICAgPyBwcmVmaXggKyAnWycgKyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICddJ1xuICAgICAgICA6IGVuY29kZVVSSUNvbXBvbmVudChrZXkpKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogU2V0IGBvYmpgJ3MgYGtleWAgdG8gYHZhbGAgcmVzcGVjdGluZ1xuICogdGhlIHdlaXJkIGFuZCB3b25kZXJmdWwgc3ludGF4IG9mIGEgcXMsXG4gKiB3aGVyZSBcImZvbz1iYXImZm9vPWJhelwiIGJlY29tZXMgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgdmFyIHYgPSBvYmpba2V5XTtcbiAgaWYgKHVuZGVmaW5lZCA9PT0gdikge1xuICAgIG9ialtrZXldID0gdmFsO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkodikpIHtcbiAgICB2LnB1c2godmFsKTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IFt2LCB2YWxdO1xuICB9XG59XG5cbi8qKlxuICogTG9jYXRlIGxhc3QgYnJhY2UgaW4gYHN0cmAgd2l0aGluIHRoZSBrZXkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbGFzdEJyYWNlSW5LZXkoc3RyKSB7XG4gIHZhciBsZW4gPSBzdHIubGVuZ3RoXG4gICAgLCBicmFjZVxuICAgICwgYztcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGMgPSBzdHJbaV07XG4gICAgaWYgKCddJyA9PSBjKSBicmFjZSA9IGZhbHNlO1xuICAgIGlmICgnWycgPT0gYykgYnJhY2UgPSB0cnVlO1xuICAgIGlmICgnPScgPT0gYyAmJiAhYnJhY2UpIHJldHVybiBpO1xuICB9XG59XG5cbi8qKlxuICogRGVjb2RlIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGRlY29kZShzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0ci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cbiIsIi8qIVxuICAqIFJlcXdlc3QhIEEgZ2VuZXJhbCBwdXJwb3NlIFhIUiBjb25uZWN0aW9uIG1hbmFnZXJcbiAgKiAoYykgRHVzdGluIERpYXogMjAxM1xuICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9kZWQvcmVxd2VzdFxuICAqIGxpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGNvbnRleHQsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZGVmaW5pdGlvbilcbiAgZWxzZSBjb250ZXh0W25hbWVdID0gZGVmaW5pdGlvbigpXG59KCdyZXF3ZXN0JywgdGhpcywgZnVuY3Rpb24gKCkge1xuXG4gIHZhciB3aW4gPSB3aW5kb3dcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCB0d29IdW5kbyA9IC9eMjBcXGQkL1xuICAgICwgYnlUYWcgPSAnZ2V0RWxlbWVudHNCeVRhZ05hbWUnXG4gICAgLCByZWFkeVN0YXRlID0gJ3JlYWR5U3RhdGUnXG4gICAgLCBjb250ZW50VHlwZSA9ICdDb250ZW50LVR5cGUnXG4gICAgLCByZXF1ZXN0ZWRXaXRoID0gJ1gtUmVxdWVzdGVkLVdpdGgnXG4gICAgLCBoZWFkID0gZG9jW2J5VGFnXSgnaGVhZCcpWzBdXG4gICAgLCB1bmlxaWQgPSAwXG4gICAgLCBjYWxsYmFja1ByZWZpeCA9ICdyZXF3ZXN0XycgKyAoK25ldyBEYXRlKCkpXG4gICAgLCBsYXN0VmFsdWUgLy8gZGF0YSBzdG9yZWQgYnkgdGhlIG1vc3QgcmVjZW50IEpTT05QIGNhbGxiYWNrXG4gICAgLCB4bWxIdHRwUmVxdWVzdCA9ICdYTUxIdHRwUmVxdWVzdCdcbiAgICAsIHhEb21haW5SZXF1ZXN0ID0gJ1hEb21haW5SZXF1ZXN0J1xuICAgICwgbm9vcCA9IGZ1bmN0aW9uICgpIHt9XG5cbiAgICAsIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PSAnZnVuY3Rpb24nXG4gICAgICAgID8gQXJyYXkuaXNBcnJheVxuICAgICAgICA6IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5XG4gICAgICAgICAgfVxuXG4gICAgLCBkZWZhdWx0SGVhZGVycyA9IHtcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgLCByZXF1ZXN0ZWRXaXRoOiB4bWxIdHRwUmVxdWVzdFxuICAgICAgICAsIGFjY2VwdDoge1xuICAgICAgICAgICAgICAnKic6ICAndGV4dC9qYXZhc2NyaXB0LCB0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwsICovKidcbiAgICAgICAgICAgICwgeG1sOiAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnXG4gICAgICAgICAgICAsIGh0bWw6ICd0ZXh0L2h0bWwnXG4gICAgICAgICAgICAsIHRleHQ6ICd0ZXh0L3BsYWluJ1xuICAgICAgICAgICAgLCBqc29uOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgICAgLCBqczogICAnYXBwbGljYXRpb24vamF2YXNjcmlwdCwgdGV4dC9qYXZhc2NyaXB0J1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgeGhyID0gZnVuY3Rpb24obykge1xuICAgICAgICAvLyBpcyBpdCB4LWRvbWFpblxuICAgICAgICBpZiAoby5jcm9zc09yaWdpbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciB4aHIgPSB3aW5beG1sSHR0cFJlcXVlc3RdID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBudWxsXG4gICAgICAgICAgaWYgKHhociAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiB4aHIpIHtcbiAgICAgICAgICAgIHJldHVybiB4aHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHdpblt4RG9tYWluUmVxdWVzdF0pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWERvbWFpblJlcXVlc3QoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBjcm9zcy1vcmlnaW4gcmVxdWVzdHMnKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh3aW5beG1sSHR0cFJlcXVlc3RdKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAsIGdsb2JhbFNldHVwT3B0aW9ucyA9IHtcbiAgICAgICAgZGF0YUZpbHRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUmVhZHlTdGF0ZShyLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyB1c2UgX2Fib3J0ZWQgdG8gbWl0aWdhdGUgYWdhaW5zdCBJRSBlcnIgYzAwYzAyM2ZcbiAgICAgIC8vIChjYW4ndCByZWFkIHByb3BzIG9uIGFib3J0ZWQgcmVxdWVzdCBvYmplY3RzKVxuICAgICAgaWYgKHIuX2Fib3J0ZWQpIHJldHVybiBlcnJvcihyLnJlcXVlc3QpXG4gICAgICBpZiAoci5yZXF1ZXN0ICYmIHIucmVxdWVzdFtyZWFkeVN0YXRlXSA9PSA0KSB7XG4gICAgICAgIHIucmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBub29wXG4gICAgICAgIGlmICh0d29IdW5kby50ZXN0KHIucmVxdWVzdC5zdGF0dXMpKVxuICAgICAgICAgIHN1Y2Nlc3Moci5yZXF1ZXN0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZXJyb3Ioci5yZXF1ZXN0KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhlYWRlcnMoaHR0cCwgbykge1xuICAgIHZhciBoZWFkZXJzID0gby5oZWFkZXJzIHx8IHt9XG4gICAgICAsIGhcblxuICAgIGhlYWRlcnMuQWNjZXB0ID0gaGVhZGVycy5BY2NlcHRcbiAgICAgIHx8IGRlZmF1bHRIZWFkZXJzLmFjY2VwdFtvLnR5cGVdXG4gICAgICB8fCBkZWZhdWx0SGVhZGVycy5hY2NlcHRbJyonXVxuXG4gICAgLy8gYnJlYWtzIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyB3aXRoIGxlZ2FjeSBicm93c2Vyc1xuICAgIGlmICghby5jcm9zc09yaWdpbiAmJiAhaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSkgaGVhZGVyc1tyZXF1ZXN0ZWRXaXRoXSA9IGRlZmF1bHRIZWFkZXJzLnJlcXVlc3RlZFdpdGhcbiAgICBpZiAoIWhlYWRlcnNbY29udGVudFR5cGVdKSBoZWFkZXJzW2NvbnRlbnRUeXBlXSA9IG8uY29udGVudFR5cGUgfHwgZGVmYXVsdEhlYWRlcnMuY29udGVudFR5cGVcbiAgICBmb3IgKGggaW4gaGVhZGVycylcbiAgICAgIGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaCkgJiYgJ3NldFJlcXVlc3RIZWFkZXInIGluIGh0dHAgJiYgaHR0cC5zZXRSZXF1ZXN0SGVhZGVyKGgsIGhlYWRlcnNbaF0pXG4gIH1cblxuICBmdW5jdGlvbiBzZXRDcmVkZW50aWFscyhodHRwLCBvKSB7XG4gICAgaWYgKHR5cGVvZiBvLndpdGhDcmVkZW50aWFscyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGh0dHAud2l0aENyZWRlbnRpYWxzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgaHR0cC53aXRoQ3JlZGVudGlhbHMgPSAhIW8ud2l0aENyZWRlbnRpYWxzXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhbENhbGxiYWNrKGRhdGEpIHtcbiAgICBsYXN0VmFsdWUgPSBkYXRhXG4gIH1cblxuICBmdW5jdGlvbiB1cmxhcHBlbmQgKHVybCwgcykge1xuICAgIHJldHVybiB1cmwgKyAoL1xcPy8udGVzdCh1cmwpID8gJyYnIDogJz8nKSArIHNcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybCkge1xuICAgIHZhciByZXFJZCA9IHVuaXFpZCsrXG4gICAgICAsIGNia2V5ID0gby5qc29ucENhbGxiYWNrIHx8ICdjYWxsYmFjaycgLy8gdGhlICdjYWxsYmFjaycga2V5XG4gICAgICAsIGNidmFsID0gby5qc29ucENhbGxiYWNrTmFtZSB8fCByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4KHJlcUlkKVxuICAgICAgLy8gLCBjYnZhbCA9IG8uanNvbnBDYWxsYmFja05hbWUgfHwgKCdyZXF3ZXN0XycgKyByZXFJZCkgLy8gdGhlICdjYWxsYmFjaycgdmFsdWVcbiAgICAgICwgY2JyZWcgPSBuZXcgUmVnRXhwKCcoKF58XFxcXD98JiknICsgY2JrZXkgKyAnKT0oW14mXSspJylcbiAgICAgICwgbWF0Y2ggPSB1cmwubWF0Y2goY2JyZWcpXG4gICAgICAsIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgLCBsb2FkZWQgPSAwXG4gICAgICAsIGlzSUUxMCA9IG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSAxMC4wJykgIT09IC0xXG5cbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIGlmIChtYXRjaFszXSA9PT0gJz8nKSB7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKGNicmVnLCAnJDE9JyArIGNidmFsKSAvLyB3aWxkY2FyZCBjYWxsYmFjayBmdW5jIG5hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNidmFsID0gbWF0Y2hbM10gLy8gcHJvdmlkZWQgY2FsbGJhY2sgZnVuYyBuYW1lXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGNia2V5ICsgJz0nICsgY2J2YWwpIC8vIG5vIGNhbGxiYWNrIGRldGFpbHMsIGFkZCAnZW1cbiAgICB9XG5cbiAgICB3aW5bY2J2YWxdID0gZ2VuZXJhbENhbGxiYWNrXG5cbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnXG4gICAgc2NyaXB0LnNyYyA9IHVybFxuICAgIHNjcmlwdC5hc3luYyA9IHRydWVcbiAgICBpZiAodHlwZW9mIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgIT09ICd1bmRlZmluZWQnICYmICFpc0lFMTApIHtcbiAgICAgIC8vIG5lZWQgdGhpcyBmb3IgSUUgZHVlIHRvIG91dC1vZi1vcmRlciBvbnJlYWR5c3RhdGVjaGFuZ2UoKSwgYmluZGluZyBzY3JpcHRcbiAgICAgIC8vIGV4ZWN1dGlvbiB0byBhbiBldmVudCBsaXN0ZW5lciBnaXZlcyB1cyBjb250cm9sIG92ZXIgd2hlbiB0aGUgc2NyaXB0XG4gICAgICAvLyBpcyBleGVjdXRlZC4gU2VlIGh0dHA6Ly9qYXVib3VyZy5uZXQvMjAxMC8wNy9sb2FkaW5nLXNjcmlwdC1hcy1vbmNsaWNrLWhhbmRsZXItb2YuaHRtbFxuICAgICAgLy9cbiAgICAgIC8vIGlmIHRoaXMgaGFjayBpcyB1c2VkIGluIElFMTAganNvbnAgY2FsbGJhY2sgYXJlIG5ldmVyIGNhbGxlZFxuICAgICAgc2NyaXB0LmV2ZW50ID0gJ29uY2xpY2snXG4gICAgICBzY3JpcHQuaHRtbEZvciA9IHNjcmlwdC5pZCA9ICdfcmVxd2VzdF8nICsgcmVxSWRcbiAgICB9XG5cbiAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgoc2NyaXB0W3JlYWR5U3RhdGVdICYmIHNjcmlwdFtyZWFkeVN0YXRlXSAhPT0gJ2NvbXBsZXRlJyAmJiBzY3JpcHRbcmVhZHlTdGF0ZV0gIT09ICdsb2FkZWQnKSB8fCBsb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgIHNjcmlwdC5vbmNsaWNrICYmIHNjcmlwdC5vbmNsaWNrKClcbiAgICAgIC8vIENhbGwgdGhlIHVzZXIgY2FsbGJhY2sgd2l0aCB0aGUgbGFzdCB2YWx1ZSBzdG9yZWQgYW5kIGNsZWFuIHVwIHZhbHVlcyBhbmQgc2NyaXB0cy5cbiAgICAgIGZuKGxhc3RWYWx1ZSlcbiAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgaGVhZC5yZW1vdmVDaGlsZChzY3JpcHQpXG4gICAgICBsb2FkZWQgPSAxXG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBzY3JpcHQgdG8gdGhlIERPTSBoZWFkXG4gICAgaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpXG5cbiAgICAvLyBFbmFibGUgSlNPTlAgdGltZW91dFxuICAgIHJldHVybiB7XG4gICAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzY3JpcHQub25sb2FkID0gc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGxcbiAgICAgICAgZXJyKHt9LCAnUmVxdWVzdCBpcyBhYm9ydGVkOiB0aW1lb3V0Jywge30pXG4gICAgICAgIGxhc3RWYWx1ZSA9IHVuZGVmaW5lZFxuICAgICAgICBoZWFkLnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgICAgICAgbG9hZGVkID0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcXVlc3QoZm4sIGVycikge1xuICAgIHZhciBvID0gdGhpcy5vXG4gICAgICAsIG1ldGhvZCA9IChvLm1ldGhvZCB8fCAnR0VUJykudG9VcHBlckNhc2UoKVxuICAgICAgLCB1cmwgPSB0eXBlb2YgbyA9PT0gJ3N0cmluZycgPyBvIDogby51cmxcbiAgICAgIC8vIGNvbnZlcnQgbm9uLXN0cmluZyBvYmplY3RzIHRvIHF1ZXJ5LXN0cmluZyBmb3JtIHVubGVzcyBvLnByb2Nlc3NEYXRhIGlzIGZhbHNlXG4gICAgICAsIGRhdGEgPSAoby5wcm9jZXNzRGF0YSAhPT0gZmFsc2UgJiYgby5kYXRhICYmIHR5cGVvZiBvLmRhdGEgIT09ICdzdHJpbmcnKVxuICAgICAgICA/IHJlcXdlc3QudG9RdWVyeVN0cmluZyhvLmRhdGEpXG4gICAgICAgIDogKG8uZGF0YSB8fCBudWxsKVxuICAgICAgLCBodHRwXG4gICAgICAsIHNlbmRXYWl0ID0gZmFsc2VcblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgb24gYSBHRVQgcmVxdWVzdCBhbmQgd2UgaGF2ZSBkYXRhIHRoZW4gd2Ugc2hvdWxkIGFwcGVuZFxuICAgIC8vIHF1ZXJ5IHN0cmluZyB0byBlbmQgb2YgVVJMIGFuZCBub3QgcG9zdCBkYXRhXG4gICAgaWYgKChvLnR5cGUgPT0gJ2pzb25wJyB8fCBtZXRob2QgPT0gJ0dFVCcpICYmIGRhdGEpIHtcbiAgICAgIHVybCA9IHVybGFwcGVuZCh1cmwsIGRhdGEpXG4gICAgICBkYXRhID0gbnVsbFxuICAgIH1cblxuICAgIGlmIChvLnR5cGUgPT0gJ2pzb25wJykgcmV0dXJuIGhhbmRsZUpzb25wKG8sIGZuLCBlcnIsIHVybClcblxuICAgIGh0dHAgPSB4aHIobylcbiAgICBodHRwLm9wZW4obWV0aG9kLCB1cmwsIG8uYXN5bmMgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlKVxuICAgIHNldEhlYWRlcnMoaHR0cCwgbylcbiAgICBzZXRDcmVkZW50aWFscyhodHRwLCBvKVxuICAgIGlmICh3aW5beERvbWFpblJlcXVlc3RdICYmIGh0dHAgaW5zdGFuY2VvZiB3aW5beERvbWFpblJlcXVlc3RdKSB7XG4gICAgICAgIGh0dHAub25sb2FkID0gZm5cbiAgICAgICAgaHR0cC5vbmVycm9yID0gZXJyXG4gICAgICAgIC8vIE5PVEU6IHNlZVxuICAgICAgICAvLyBodHRwOi8vc29jaWFsLm1zZG4ubWljcm9zb2Z0LmNvbS9Gb3J1bXMvZW4tVVMvaWV3ZWJkZXZlbG9wbWVudC90aHJlYWQvMzBlZjNhZGQtNzY3Yy00NDM2LWI4YTktZjFjYTE5YjQ4MTJlXG4gICAgICAgIGh0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uKCkge31cbiAgICAgICAgc2VuZFdhaXQgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gaGFuZGxlUmVhZHlTdGF0ZSh0aGlzLCBmbiwgZXJyKVxuICAgIH1cbiAgICBvLmJlZm9yZSAmJiBvLmJlZm9yZShodHRwKVxuICAgIGlmIChzZW5kV2FpdCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0dHAuc2VuZChkYXRhKVxuICAgICAgfSwgMjAwKVxuICAgIH0gZWxzZSB7XG4gICAgICBodHRwLnNlbmQoZGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIGh0dHBcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXdlc3QobywgZm4pIHtcbiAgICB0aGlzLm8gPSBvXG4gICAgdGhpcy5mbiA9IGZuXG5cbiAgICBpbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFR5cGUodXJsKSB7XG4gICAgdmFyIG0gPSB1cmwubWF0Y2goL1xcLihqc29ufGpzb25wfGh0bWx8eG1sKShcXD98JCkvKVxuICAgIHJldHVybiBtID8gbVsxXSA6ICdqcydcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQobywgZm4pIHtcblxuICAgIHRoaXMudXJsID0gdHlwZW9mIG8gPT0gJ3N0cmluZycgPyBvIDogby51cmxcbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsXG5cbiAgICAvLyB3aGV0aGVyIHJlcXVlc3QgaGFzIGJlZW4gZnVsZmlsbGVkIGZvciBwdXJwb3NlXG4gICAgLy8gb2YgdHJhY2tpbmcgdGhlIFByb21pc2VzXG4gICAgdGhpcy5fZnVsZmlsbGVkID0gZmFsc2VcbiAgICAvLyBzdWNjZXNzIGhhbmRsZXJzXG4gICAgdGhpcy5fc3VjY2Vzc0hhbmRsZXIgPSBmdW5jdGlvbigpe31cbiAgICB0aGlzLl9mdWxmaWxsbWVudEhhbmRsZXJzID0gW11cbiAgICAvLyBlcnJvciBoYW5kbGVyc1xuICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMgPSBbXVxuICAgIC8vIGNvbXBsZXRlIChib3RoIHN1Y2Nlc3MgYW5kIGZhaWwpIGhhbmRsZXJzXG4gICAgdGhpcy5fY29tcGxldGVIYW5kbGVycyA9IFtdXG4gICAgdGhpcy5fZXJyZWQgPSBmYWxzZVxuICAgIHRoaXMuX3Jlc3BvbnNlQXJncyA9IHt9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICwgdHlwZSA9IG8udHlwZSB8fCBzZXRUeXBlKHRoaXMudXJsKVxuXG4gICAgZm4gPSBmbiB8fCBmdW5jdGlvbiAoKSB7fVxuXG4gICAgaWYgKG8udGltZW91dCkge1xuICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuYWJvcnQoKVxuICAgICAgfSwgby50aW1lb3V0KVxuICAgIH1cblxuICAgIGlmIChvLnN1Y2Nlc3MpIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBvLnN1Y2Nlc3MuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvLmVycm9yKSB7XG4gICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICBvLmVycm9yLmFwcGx5KG8sIGFyZ3VtZW50cylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKG8uY29tcGxldGUpIHtcbiAgICAgIHRoaXMuX2NvbXBsZXRlSGFuZGxlcnMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIG8uY29tcGxldGUuYXBwbHkobywgYXJndW1lbnRzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wbGV0ZSAocmVzcCkge1xuICAgICAgby50aW1lb3V0ICYmIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpXG4gICAgICBzZWxmLnRpbWVvdXQgPSBudWxsXG4gICAgICB3aGlsZSAoc2VsZi5fY29tcGxldGVIYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNlbGYuX2NvbXBsZXRlSGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3MgKHJlc3ApIHtcbiAgICAgIHJlc3AgPSAodHlwZSAhPT0gJ2pzb25wJykgPyBzZWxmLnJlcXVlc3QgOiByZXNwXG4gICAgICAvLyB1c2UgZ2xvYmFsIGRhdGEgZmlsdGVyIG9uIHJlc3BvbnNlIHRleHRcbiAgICAgIHZhciBmaWx0ZXJlZFJlc3BvbnNlID0gZ2xvYmFsU2V0dXBPcHRpb25zLmRhdGFGaWx0ZXIocmVzcC5yZXNwb25zZVRleHQsIHR5cGUpXG4gICAgICAgICwgciA9IGZpbHRlcmVkUmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3AucmVzcG9uc2VUZXh0ID0gclxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBjYW4ndCBhc3NpZ24gdGhpcyBpbiBJRTw9OCwganVzdCBpZ25vcmVcbiAgICAgIH1cbiAgICAgIGlmIChyKSB7XG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzpcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcCA9IHdpbi5KU09OID8gd2luLkpTT04ucGFyc2UocikgOiBldmFsKCcoJyArIHIgKyAnKScpXG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3IocmVzcCwgJ0NvdWxkIG5vdCBwYXJzZSBKU09OIGluIHJlc3BvbnNlJywgZXJyKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdqcyc6XG4gICAgICAgICAgcmVzcCA9IGV2YWwocilcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICByZXNwID0gclxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3htbCc6XG4gICAgICAgICAgcmVzcCA9IHJlc3AucmVzcG9uc2VYTUxcbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yIC8vIElFIHRyb2xvbG9cbiAgICAgICAgICAgICAgJiYgcmVzcC5yZXNwb25zZVhNTC5wYXJzZUVycm9yLmVycm9yQ29kZVxuICAgICAgICAgICAgICAmJiByZXNwLnJlc3BvbnNlWE1MLnBhcnNlRXJyb3IucmVhc29uXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVzcC5yZXNwb25zZVhNTFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9mdWxmaWxsZWQgPSB0cnVlXG4gICAgICBmbihyZXNwKVxuICAgICAgc2VsZi5fc3VjY2Vzc0hhbmRsZXIocmVzcClcbiAgICAgIHdoaWxlIChzZWxmLl9mdWxmaWxsbWVudEhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzcCA9IHNlbGYuX2Z1bGZpbGxtZW50SGFuZGxlcnMuc2hpZnQoKShyZXNwKVxuICAgICAgfVxuXG4gICAgICBjb21wbGV0ZShyZXNwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVycm9yKHJlc3AsIG1zZywgdCkge1xuICAgICAgcmVzcCA9IHNlbGYucmVxdWVzdFxuICAgICAgc2VsZi5fcmVzcG9uc2VBcmdzLnJlc3AgPSByZXNwXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MubXNnID0gbXNnXG4gICAgICBzZWxmLl9yZXNwb25zZUFyZ3MudCA9IHRcbiAgICAgIHNlbGYuX2VycmVkID0gdHJ1ZVxuICAgICAgd2hpbGUgKHNlbGYuX2Vycm9ySGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzZWxmLl9lcnJvckhhbmRsZXJzLnNoaWZ0KCkocmVzcCwgbXNnLCB0KVxuICAgICAgfVxuICAgICAgY29tcGxldGUocmVzcClcbiAgICB9XG5cbiAgICB0aGlzLnJlcXVlc3QgPSBnZXRSZXF1ZXN0LmNhbGwodGhpcywgc3VjY2VzcywgZXJyb3IpXG4gIH1cblxuICBSZXF3ZXN0LnByb3RvdHlwZSA9IHtcbiAgICBhYm9ydDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fYWJvcnRlZCA9IHRydWVcbiAgICAgIHRoaXMucmVxdWVzdC5hYm9ydCgpXG4gICAgfVxuXG4gICwgcmV0cnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGluaXQuY2FsbCh0aGlzLCB0aGlzLm8sIHRoaXMuZm4pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU21hbGwgZGV2aWF0aW9uIGZyb20gdGhlIFByb21pc2VzIEEgQ29tbW9uSnMgc3BlY2lmaWNhdGlvblxuICAgICAqIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1Byb21pc2VzL0FcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIGB0aGVuYCB3aWxsIGV4ZWN1dGUgdXBvbiBzdWNjZXNzZnVsIHJlcXVlc3RzXG4gICAgICovXG4gICwgdGhlbjogZnVuY3Rpb24gKHN1Y2Nlc3MsIGZhaWwpIHtcbiAgICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgICBmYWlsID0gZmFpbCB8fCBmdW5jdGlvbiAoKSB7fVxuICAgICAgaWYgKHRoaXMuX2Z1bGZpbGxlZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCA9IHN1Y2Nlc3ModGhpcy5fcmVzcG9uc2VBcmdzLnJlc3ApXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZhaWwodGhpcy5fcmVzcG9uc2VBcmdzLnJlc3AsIHRoaXMuX3Jlc3BvbnNlQXJncy5tc2csIHRoaXMuX3Jlc3BvbnNlQXJncy50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZnVsZmlsbG1lbnRIYW5kbGVycy5wdXNoKHN1Y2Nlc3MpXG4gICAgICAgIHRoaXMuX2Vycm9ySGFuZGxlcnMucHVzaChmYWlsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgYWx3YXlzYCB3aWxsIGV4ZWN1dGUgd2hldGhlciB0aGUgcmVxdWVzdCBzdWNjZWVkcyBvciBmYWlsc1xuICAgICAqL1xuICAsIGFsd2F5czogZnVuY3Rpb24gKGZuKSB7XG4gICAgICBpZiAodGhpcy5fZnVsZmlsbGVkIHx8IHRoaXMuX2VycmVkKSB7XG4gICAgICAgIGZuKHRoaXMuX3Jlc3BvbnNlQXJncy5yZXNwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcGxldGVIYW5kbGVycy5wdXNoKGZuKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBgZmFpbGAgd2lsbCBleGVjdXRlIHdoZW4gdGhlIHJlcXVlc3QgZmFpbHNcbiAgICAgKi9cbiAgLCBmYWlsOiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGlmICh0aGlzLl9lcnJlZCkge1xuICAgICAgICBmbih0aGlzLl9yZXNwb25zZUFyZ3MucmVzcCwgdGhpcy5fcmVzcG9uc2VBcmdzLm1zZywgdGhpcy5fcmVzcG9uc2VBcmdzLnQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvckhhbmRsZXJzLnB1c2goZm4pXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcXdlc3QobywgZm4pIHtcbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICAvLyBub3JtYWxpemUgbmV3bGluZSB2YXJpYW50cyBhY2NvcmRpbmcgdG8gc3BlYyAtPiBDUkxGXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMgPyBzLnJlcGxhY2UoL1xccj9cXG4vZywgJ1xcclxcbicpIDogJydcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcmlhbChlbCwgY2IpIHtcbiAgICB2YXIgbiA9IGVsLm5hbWVcbiAgICAgICwgdCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgLCBvcHRDYiA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgLy8gSUUgZ2l2ZXMgdmFsdWU9XCJcIiBldmVuIHdoZXJlIHRoZXJlIGlzIG5vIHZhbHVlIGF0dHJpYnV0ZVxuICAgICAgICAgIC8vICdzcGVjaWZpZWQnIHJlZjogaHR0cDovL3d3dy53My5vcmcvVFIvRE9NLUxldmVsLTMtQ29yZS9jb3JlLmh0bWwjSUQtODYyNTI5MjczXG4gICAgICAgICAgaWYgKG8gJiYgIW8uZGlzYWJsZWQpXG4gICAgICAgICAgICBjYihuLCBub3JtYWxpemUoby5hdHRyaWJ1dGVzLnZhbHVlICYmIG8uYXR0cmlidXRlcy52YWx1ZS5zcGVjaWZpZWQgPyBvLnZhbHVlIDogby50ZXh0KSlcbiAgICAgICAgfVxuICAgICAgLCBjaCwgcmEsIHZhbCwgaVxuXG4gICAgLy8gZG9uJ3Qgc2VyaWFsaXplIGVsZW1lbnRzIHRoYXQgYXJlIGRpc2FibGVkIG9yIHdpdGhvdXQgYSBuYW1lXG4gICAgaWYgKGVsLmRpc2FibGVkIHx8ICFuKSByZXR1cm5cblxuICAgIHN3aXRjaCAodCkge1xuICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgIGlmICghL3Jlc2V0fGJ1dHRvbnxpbWFnZXxmaWxlL2kudGVzdChlbC50eXBlKSkge1xuICAgICAgICBjaCA9IC9jaGVja2JveC9pLnRlc3QoZWwudHlwZSlcbiAgICAgICAgcmEgPSAvcmFkaW8vaS50ZXN0KGVsLnR5cGUpXG4gICAgICAgIHZhbCA9IGVsLnZhbHVlXG4gICAgICAgIC8vIFdlYktpdCBnaXZlcyB1cyBcIlwiIGluc3RlYWQgb2YgXCJvblwiIGlmIGEgY2hlY2tib3ggaGFzIG5vIHZhbHVlLCBzbyBjb3JyZWN0IGl0IGhlcmVcbiAgICAgICAgOyghKGNoIHx8IHJhKSB8fCBlbC5jaGVja2VkKSAmJiBjYihuLCBub3JtYWxpemUoY2ggJiYgdmFsID09PSAnJyA/ICdvbicgOiB2YWwpKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd0ZXh0YXJlYSc6XG4gICAgICBjYihuLCBub3JtYWxpemUoZWwudmFsdWUpKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdzZWxlY3QnOlxuICAgICAgaWYgKGVsLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdC1vbmUnKSB7XG4gICAgICAgIG9wdENiKGVsLnNlbGVjdGVkSW5kZXggPj0gMCA/IGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0gOiBudWxsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMDsgZWwubGVuZ3RoICYmIGkgPCBlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVsLm9wdGlvbnNbaV0uc2VsZWN0ZWQgJiYgb3B0Q2IoZWwub3B0aW9uc1tpXSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBjb2xsZWN0IHVwIGFsbCBmb3JtIGVsZW1lbnRzIGZvdW5kIGZyb20gdGhlIHBhc3NlZCBhcmd1bWVudCBlbGVtZW50cyBhbGxcbiAgLy8gdGhlIHdheSBkb3duIHRvIGNoaWxkIGVsZW1lbnRzOyBwYXNzIGEgJzxmb3JtPicgb3IgZm9ybSBmaWVsZHMuXG4gIC8vIGNhbGxlZCB3aXRoICd0aGlzJz1jYWxsYmFjayB0byB1c2UgZm9yIHNlcmlhbCgpIG9uIGVhY2ggZWxlbWVudFxuICBmdW5jdGlvbiBlYWNoRm9ybUVsZW1lbnQoKSB7XG4gICAgdmFyIGNiID0gdGhpc1xuICAgICAgLCBlLCBpXG4gICAgICAsIHNlcmlhbGl6ZVN1YnRhZ3MgPSBmdW5jdGlvbiAoZSwgdGFncykge1xuICAgICAgICAgIHZhciBpLCBqLCBmYVxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmYSA9IGVbYnlUYWddKHRhZ3NbaV0pXG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmEubGVuZ3RoOyBqKyspIHNlcmlhbChmYVtqXSwgY2IpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBlID0gYXJndW1lbnRzW2ldXG4gICAgICBpZiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYS9pLnRlc3QoZS50YWdOYW1lKSkgc2VyaWFsKGUsIGNiKVxuICAgICAgc2VyaWFsaXplU3VidGFncyhlLCBbICdpbnB1dCcsICdzZWxlY3QnLCAndGV4dGFyZWEnIF0pXG4gICAgfVxuICB9XG5cbiAgLy8gc3RhbmRhcmQgcXVlcnkgc3RyaW5nIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgZnVuY3Rpb24gc2VyaWFsaXplUXVlcnlTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHJlcXdlc3QudG9RdWVyeVN0cmluZyhyZXF3ZXN0LnNlcmlhbGl6ZUFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gIH1cblxuICAvLyB7ICduYW1lJzogJ3ZhbHVlJywgLi4uIH0gc3R5bGUgc2VyaWFsaXphdGlvblxuICBmdW5jdGlvbiBzZXJpYWxpemVIYXNoKCkge1xuICAgIHZhciBoYXNoID0ge31cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBpZiAobmFtZSBpbiBoYXNoKSB7XG4gICAgICAgIGhhc2hbbmFtZV0gJiYgIWlzQXJyYXkoaGFzaFtuYW1lXSkgJiYgKGhhc2hbbmFtZV0gPSBbaGFzaFtuYW1lXV0pXG4gICAgICAgIGhhc2hbbmFtZV0ucHVzaCh2YWx1ZSlcbiAgICAgIH0gZWxzZSBoYXNoW25hbWVdID0gdmFsdWVcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGhhc2hcbiAgfVxuXG4gIC8vIFsgeyBuYW1lOiAnbmFtZScsIHZhbHVlOiAndmFsdWUnIH0sIC4uLiBdIHN0eWxlIHNlcmlhbGl6YXRpb25cbiAgcmVxd2VzdC5zZXJpYWxpemVBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyID0gW11cbiAgICBlYWNoRm9ybUVsZW1lbnQuYXBwbHkoZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICBhcnIucHVzaCh7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlfSlcbiAgICB9LCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFyclxuICB9XG5cbiAgcmVxd2VzdC5zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiAnJ1xuICAgIHZhciBvcHQsIGZuXG4gICAgICAsIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG5cbiAgICBvcHQgPSBhcmdzLnBvcCgpXG4gICAgb3B0ICYmIG9wdC5ub2RlVHlwZSAmJiBhcmdzLnB1c2gob3B0KSAmJiAob3B0ID0gbnVsbClcbiAgICBvcHQgJiYgKG9wdCA9IG9wdC50eXBlKVxuXG4gICAgaWYgKG9wdCA9PSAnbWFwJykgZm4gPSBzZXJpYWxpemVIYXNoXG4gICAgZWxzZSBpZiAob3B0ID09ICdhcnJheScpIGZuID0gcmVxd2VzdC5zZXJpYWxpemVBcnJheVxuICAgIGVsc2UgZm4gPSBzZXJpYWxpemVRdWVyeVN0cmluZ1xuXG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cblxuICByZXF3ZXN0LnRvUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAobywgdHJhZCkge1xuICAgIHZhciBwcmVmaXgsIGlcbiAgICAgICwgdHJhZGl0aW9uYWwgPSB0cmFkIHx8IGZhbHNlXG4gICAgICAsIHMgPSBbXVxuICAgICAgLCBlbmMgPSBlbmNvZGVVUklDb21wb25lbnRcbiAgICAgICwgYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAvLyBJZiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpbnZva2UgaXQgYW5kIHJldHVybiBpdHMgdmFsdWVcbiAgICAgICAgICB2YWx1ZSA9ICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdmFsdWUpID8gdmFsdWUoKSA6ICh2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZSlcbiAgICAgICAgICBzW3MubGVuZ3RoXSA9IGVuYyhrZXkpICsgJz0nICsgZW5jKHZhbHVlKVxuICAgICAgICB9XG4gICAgLy8gSWYgYW4gYXJyYXkgd2FzIHBhc3NlZCBpbiwgYXNzdW1lIHRoYXQgaXQgaXMgYW4gYXJyYXkgb2YgZm9ybSBlbGVtZW50cy5cbiAgICBpZiAoaXNBcnJheShvKSkge1xuICAgICAgZm9yIChpID0gMDsgbyAmJiBpIDwgby5sZW5ndGg7IGkrKykgYWRkKG9baV0ubmFtZSwgb1tpXS52YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdHJhZGl0aW9uYWwsIGVuY29kZSB0aGUgXCJvbGRcIiB3YXkgKHRoZSB3YXkgMS4zLjIgb3Igb2xkZXJcbiAgICAgIC8vIGRpZCBpdCksIG90aGVyd2lzZSBlbmNvZGUgcGFyYW1zIHJlY3Vyc2l2ZWx5LlxuICAgICAgZm9yIChwcmVmaXggaW4gbykge1xuICAgICAgICBidWlsZFBhcmFtcyhwcmVmaXgsIG9bcHJlZml4XSwgdHJhZGl0aW9uYWwsIGFkZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzcGFjZXMgc2hvdWxkIGJlICsgYWNjb3JkaW5nIHRvIHNwZWNcbiAgICByZXR1cm4gcy5qb2luKCcmJykucmVwbGFjZSgvJTIwL2csICcrJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUGFyYW1zKHByZWZpeCwgb2JqLCB0cmFkaXRpb25hbCwgYWRkKSB7XG4gICAgdmFyIG5hbWUsIGksIHZcbiAgICAgICwgcmJyYWNrZXQgPSAvXFxbXFxdJC9cblxuICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBhcnJheSBpdGVtLlxuICAgICAgZm9yIChpID0gMDsgb2JqICYmIGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdiA9IG9ialtpXVxuICAgICAgICBpZiAodHJhZGl0aW9uYWwgfHwgcmJyYWNrZXQudGVzdChwcmVmaXgpKSB7XG4gICAgICAgICAgLy8gVHJlYXQgZWFjaCBhcnJheSBpdGVtIGFzIGEgc2NhbGFyLlxuICAgICAgICAgIGFkZChwcmVmaXgsIHYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgKHR5cGVvZiB2ID09PSAnb2JqZWN0JyA/IGkgOiAnJykgKyAnXScsIHYsIHRyYWRpdGlvbmFsLCBhZGQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcoKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBvYmplY3QgaXRlbS5cbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgYnVpbGRQYXJhbXMocHJlZml4ICsgJ1snICsgbmFtZSArICddJywgb2JqW25hbWVdLCB0cmFkaXRpb25hbCwgYWRkKVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlcmlhbGl6ZSBzY2FsYXIgaXRlbS5cbiAgICAgIGFkZChwcmVmaXgsIG9iailcbiAgICB9XG4gIH1cblxuICByZXF3ZXN0LmdldGNhbGxiYWNrUHJlZml4ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjYWxsYmFja1ByZWZpeFxuICB9XG5cbiAgLy8galF1ZXJ5IGFuZCBaZXB0byBjb21wYXRpYmlsaXR5LCBkaWZmZXJlbmNlcyBjYW4gYmUgcmVtYXBwZWQgaGVyZSBzbyB5b3UgY2FuIGNhbGxcbiAgLy8gLmFqYXguY29tcGF0KG9wdGlvbnMsIGNhbGxiYWNrKVxuICByZXF3ZXN0LmNvbXBhdCA9IGZ1bmN0aW9uIChvLCBmbikge1xuICAgIGlmIChvKSB7XG4gICAgICBvLnR5cGUgJiYgKG8ubWV0aG9kID0gby50eXBlKSAmJiBkZWxldGUgby50eXBlXG4gICAgICBvLmRhdGFUeXBlICYmIChvLnR5cGUgPSBvLmRhdGFUeXBlKVxuICAgICAgby5qc29ucENhbGxiYWNrICYmIChvLmpzb25wQ2FsbGJhY2tOYW1lID0gby5qc29ucENhbGxiYWNrKSAmJiBkZWxldGUgby5qc29ucENhbGxiYWNrXG4gICAgICBvLmpzb25wICYmIChvLmpzb25wQ2FsbGJhY2sgPSBvLmpzb25wKVxuICAgIH1cbiAgICByZXR1cm4gbmV3IFJlcXdlc3QobywgZm4pXG4gIH1cblxuICByZXF3ZXN0LmFqYXhTZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICBmb3IgKHZhciBrIGluIG9wdGlvbnMpIHtcbiAgICAgIGdsb2JhbFNldHVwT3B0aW9uc1trXSA9IG9wdGlvbnNba11cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVxd2VzdFxufSk7XG4iLCIvKiFcbiAgKiBCZWFuIC0gY29weXJpZ2h0IChjKSBKYWNvYiBUaG9ybnRvbiAyMDExLTIwMTJcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZmF0L2JlYW5cbiAgKiBNSVQgbGljZW5zZVxuICAqL1xuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ2JlYW4nLCB0aGlzLCBmdW5jdGlvbiAobmFtZSwgY29udGV4dCkge1xuICBuYW1lICAgID0gbmFtZSAgICB8fCAnYmVhbidcbiAgY29udGV4dCA9IGNvbnRleHQgfHwgdGhpc1xuXG4gIHZhciB3aW4gICAgICAgICAgICA9IHdpbmRvd1xuICAgICwgb2xkICAgICAgICAgICAgPSBjb250ZXh0W25hbWVdXG4gICAgLCBuYW1lc3BhY2VSZWdleCA9IC9bXlxcLl0qKD89XFwuLiopXFwufC4qL1xuICAgICwgbmFtZVJlZ2V4ICAgICAgPSAvXFwuLiovXG4gICAgLCBhZGRFdmVudCAgICAgICA9ICdhZGRFdmVudExpc3RlbmVyJ1xuICAgICwgcmVtb3ZlRXZlbnQgICAgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcbiAgICAsIGRvYyAgICAgICAgICAgID0gZG9jdW1lbnQgfHwge31cbiAgICAsIHJvb3QgICAgICAgICAgID0gZG9jLmRvY3VtZW50RWxlbWVudCB8fCB7fVxuICAgICwgVzNDX01PREVMICAgICAgPSByb290W2FkZEV2ZW50XVxuICAgICwgZXZlbnRTdXBwb3J0ICAgPSBXM0NfTU9ERUwgPyBhZGRFdmVudCA6ICdhdHRhY2hFdmVudCdcbiAgICAsIE9ORSAgICAgICAgICAgID0ge30gLy8gc2luZ2xldG9uIGZvciBxdWljayBtYXRjaGluZyBtYWtpbmcgYWRkKCkgZG8gb25lKClcblxuICAgICwgc2xpY2UgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcbiAgICAsIHN0cjJhcnIgICAgICAgID0gZnVuY3Rpb24gKHMsIGQpIHsgcmV0dXJuIHMuc3BsaXQoZCB8fCAnICcpIH1cbiAgICAsIGlzU3RyaW5nICAgICAgID0gZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHR5cGVvZiBvID09ICdzdHJpbmcnIH1cbiAgICAsIGlzRnVuY3Rpb24gICAgID0gZnVuY3Rpb24gKG8pIHsgcmV0dXJuIHR5cGVvZiBvID09ICdmdW5jdGlvbicgfVxuXG4gICAgICAvLyBldmVudHMgdGhhdCB3ZSBjb25zaWRlciB0byBiZSAnbmF0aXZlJywgYW55dGhpbmcgbm90IGluIHRoaXMgbGlzdCB3aWxsXG4gICAgICAvLyBiZSB0cmVhdGVkIGFzIGEgY3VzdG9tIGV2ZW50XG4gICAgLCBzdGFuZGFyZE5hdGl2ZUV2ZW50cyA9XG4gICAgICAgICdjbGljayBkYmxjbGljayBtb3VzZXVwIG1vdXNlZG93biBjb250ZXh0bWVudSAnICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSBidXR0b25zXG4gICAgICAgICdtb3VzZXdoZWVsIG1vdXNlbXVsdGl3aGVlbCBET01Nb3VzZVNjcm9sbCAnICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSB3aGVlbFxuICAgICAgICAnbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlbW92ZSBzZWxlY3RzdGFydCBzZWxlY3RlbmQgJyAgICAgICAgICAgICsgLy8gbW91c2UgbW92ZW1lbnRcbiAgICAgICAgJ2tleWRvd24ga2V5cHJlc3Mga2V5dXAgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGtleWJvYXJkXG4gICAgICAgICdvcmllbnRhdGlvbmNoYW5nZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb2JpbGVcbiAgICAgICAgJ2ZvY3VzIGJsdXIgY2hhbmdlIHJlc2V0IHNlbGVjdCBzdWJtaXQgJyAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIGZvcm0gZWxlbWVudHNcbiAgICAgICAgJ2xvYWQgdW5sb2FkIGJlZm9yZXVubG9hZCByZXNpemUgbW92ZSBET01Db250ZW50TG9hZGVkICcgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAncmVhZHlzdGF0ZWNoYW5nZSBtZXNzYWdlICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gd2luZG93XG4gICAgICAgICdlcnJvciBhYm9ydCBzY3JvbGwgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtaXNjXG4gICAgICAvLyBlbGVtZW50LmZpcmVFdmVudCgnb25YWVonLi4uIGlzIG5vdCBmb3JnaXZpbmcgaWYgd2UgdHJ5IHRvIGZpcmUgYW4gZXZlbnRcbiAgICAgIC8vIHRoYXQgZG9lc24ndCBhY3R1YWxseSBleGlzdCwgc28gbWFrZSBzdXJlIHdlIG9ubHkgZG8gdGhlc2Ugb24gbmV3ZXIgYnJvd3NlcnNcbiAgICAsIHczY05hdGl2ZUV2ZW50cyA9XG4gICAgICAgICdzaG93ICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBtb3VzZSBidXR0b25zXG4gICAgICAgICdpbnB1dCBpbnZhbGlkICcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAvLyBmb3JtIGVsZW1lbnRzXG4gICAgICAgICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCAnICAgICAgICAgICAgICAgICAgICAgKyAvLyB0b3VjaFxuICAgICAgICAnZ2VzdHVyZXN0YXJ0IGdlc3R1cmVjaGFuZ2UgZ2VzdHVyZWVuZCAnICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gZ2VzdHVyZVxuICAgICAgICAndGV4dGlucHV0JyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gVGV4dEV2ZW50XG4gICAgICAgICdyZWFkeXN0YXRlY2hhbmdlIHBhZ2VzaG93IHBhZ2VoaWRlIHBvcHN0YXRlICcgICAgICAgICAgICAgICAgICAgKyAvLyB3aW5kb3dcbiAgICAgICAgJ2hhc2hjaGFuZ2Ugb2ZmbGluZSBvbmxpbmUgJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArIC8vIHdpbmRvd1xuICAgICAgICAnYWZ0ZXJwcmludCBiZWZvcmVwcmludCAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gcHJpbnRpbmdcbiAgICAgICAgJ2RyYWdzdGFydCBkcmFnZW50ZXIgZHJhZ292ZXIgZHJhZ2xlYXZlIGRyYWcgZHJvcCBkcmFnZW5kICcgICAgICArIC8vIGRuZFxuICAgICAgICAnbG9hZHN0YXJ0IHByb2dyZXNzIHN1c3BlbmQgZW1wdGllZCBzdGFsbGVkIGxvYWRtZXRhZGF0YSAnICAgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ2xvYWRlZGRhdGEgY2FucGxheSBjYW5wbGF5dGhyb3VnaCBwbGF5aW5nIHdhaXRpbmcgc2Vla2luZyAnICAgICArIC8vIG1lZGlhXG4gICAgICAgICdzZWVrZWQgZW5kZWQgZHVyYXRpb25jaGFuZ2UgdGltZXVwZGF0ZSBwbGF5IHBhdXNlIHJhdGVjaGFuZ2UgJyAgKyAvLyBtZWRpYVxuICAgICAgICAndm9sdW1lY2hhbmdlIGN1ZWNoYW5nZSAnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgLy8gbWVkaWFcbiAgICAgICAgJ2NoZWNraW5nIG5vdXBkYXRlIGRvd25sb2FkaW5nIGNhY2hlZCB1cGRhdGVyZWFkeSBvYnNvbGV0ZSAnICAgICAgIC8vIGFwcGNhY2hlXG5cbiAgICAgIC8vIGNvbnZlcnQgdG8gYSBoYXNoIGZvciBxdWljayBsb29rdXBzXG4gICAgLCBuYXRpdmVFdmVudHMgPSAoZnVuY3Rpb24gKGhhc2gsIGV2ZW50cywgaSkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKSBldmVudHNbaV0gJiYgKGhhc2hbZXZlbnRzW2ldXSA9IDEpXG4gICAgICAgIHJldHVybiBoYXNoXG4gICAgICB9KHt9LCBzdHIyYXJyKHN0YW5kYXJkTmF0aXZlRXZlbnRzICsgKFczQ19NT0RFTCA/IHczY05hdGl2ZUV2ZW50cyA6ICcnKSkpKVxuXG4gICAgICAvLyBjdXN0b20gZXZlbnRzIGFyZSBldmVudHMgdGhhdCB3ZSAqZmFrZSosIHRoZXkgYXJlIG5vdCBwcm92aWRlZCBuYXRpdmVseSBidXRcbiAgICAgIC8vIHdlIGNhbiB1c2UgbmF0aXZlIGV2ZW50cyB0byBnZW5lcmF0ZSB0aGVtXG4gICAgLCBjdXN0b21FdmVudHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gcm9vdFxuICAgICAgICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgKGNvbnRhaW5lci5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlbGVtZW50KSAmIDE2KSA9PT0gMTZcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDogJ2NvbnRhaW5zJyBpbiByb290XG4gICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lci5ub2RlVHlwZSA9PT0gOSB8fCBjb250YWluZXIgPT09IHdpbmRvdyA/IHJvb3QgOiBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRhaW5lciAhPT0gZWxlbWVudCAmJiBjb250YWluZXIuY29udGFpbnMoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIGlmIChlbGVtZW50ID09PSBjb250YWluZXIpIHJldHVybiAxXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgLCBjaGVjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICB2YXIgcmVsYXRlZCA9IGV2ZW50LnJlbGF0ZWRUYXJnZXRcbiAgICAgICAgICAgICAgcmV0dXJuICFyZWxhdGVkXG4gICAgICAgICAgICAgICAgPyByZWxhdGVkID09IG51bGxcbiAgICAgICAgICAgICAgICA6IChyZWxhdGVkICE9PSB0aGlzICYmIHJlbGF0ZWQucHJlZml4ICE9PSAneHVsJyAmJiAhL2RvY3VtZW50Ly50ZXN0KHRoaXMudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgJiYgIWlzQW5jZXN0b3IocmVsYXRlZCwgdGhpcykpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1vdXNlZW50ZXI6IHsgYmFzZTogJ21vdXNlb3ZlcicsIGNvbmRpdGlvbjogY2hlY2sgfVxuICAgICAgICAgICwgbW91c2VsZWF2ZTogeyBiYXNlOiAnbW91c2VvdXQnLCBjb25kaXRpb246IGNoZWNrIH1cbiAgICAgICAgICAsIG1vdXNld2hlZWw6IHsgYmFzZTogL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgPyAnRE9NTW91c2VTY3JvbGwnIDogJ21vdXNld2hlZWwnIH1cbiAgICAgICAgfVxuICAgICAgfSgpKVxuXG4gICAgICAvLyB3ZSBwcm92aWRlIGEgY29uc2lzdGVudCBFdmVudCBvYmplY3QgYWNyb3NzIGJyb3dzZXJzIGJ5IHRha2luZyB0aGUgYWN0dWFsIERPTVxuICAgICAgLy8gZXZlbnQgb2JqZWN0IGFuZCBnZW5lcmF0aW5nIGEgbmV3IG9uZSBmcm9tIGl0cyBwcm9wZXJ0aWVzLlxuICAgICwgRXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gYSB3aGl0ZWxpc3Qgb2YgcHJvcGVydGllcyAoZm9yIGRpZmZlcmVudCBldmVudCB0eXBlcykgdGVsbHMgdXMgd2hhdCB0byBjaGVjayBmb3IgYW5kIGNvcHlcbiAgICAgICAgdmFyIGNvbW1vblByb3BzICA9IHN0cjJhcnIoJ2FsdEtleSBhdHRyQ2hhbmdlIGF0dHJOYW1lIGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgJyArXG4gICAgICAgICAgICAgICdkZXRhaWwgZXZlbnRQaGFzZSBnZXRNb2RpZmllclN0YXRlIGlzVHJ1c3RlZCBtZXRhS2V5IHJlbGF0ZWROb2RlIHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgJyAgK1xuICAgICAgICAgICAgICAnc3JjRWxlbWVudCB0YXJnZXQgdGltZVN0YW1wIHR5cGUgdmlldyB3aGljaCBwcm9wZXJ0eU5hbWUnKVxuICAgICAgICAgICwgbW91c2VQcm9wcyAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2J1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBkYXRhVHJhbnNmZXIgJyAgICAgICtcbiAgICAgICAgICAgICAgJ2Zyb21FbGVtZW50IG9mZnNldFggb2Zmc2V0WSBwYWdlWCBwYWdlWSBzY3JlZW5YIHNjcmVlblkgdG9FbGVtZW50JykpXG4gICAgICAgICAgLCBtb3VzZVdoZWVsUHJvcHMgPSBtb3VzZVByb3BzLmNvbmNhdChzdHIyYXJyKCd3aGVlbERlbHRhIHdoZWVsRGVsdGFYIHdoZWVsRGVsdGFZIHdoZWVsRGVsdGFaICcgK1xuICAgICAgICAgICAgICAnYXhpcycpKSAvLyAnYXhpcycgaXMgRkYgc3BlY2lmaWNcbiAgICAgICAgICAsIGtleVByb3BzICAgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlIGtleUlkZW50aWZpZXIgJyAgICAgICAgICArXG4gICAgICAgICAgICAgICdrZXlMb2NhdGlvbiBsb2NhdGlvbicpKVxuICAgICAgICAgICwgdGV4dFByb3BzICAgID0gY29tbW9uUHJvcHMuY29uY2F0KHN0cjJhcnIoJ2RhdGEnKSlcbiAgICAgICAgICAsIHRvdWNoUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCd0b3VjaGVzIHRhcmdldFRvdWNoZXMgY2hhbmdlZFRvdWNoZXMgc2NhbGUgcm90YXRpb24nKSlcbiAgICAgICAgICAsIG1lc3NhZ2VQcm9wcyA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdkYXRhIG9yaWdpbiBzb3VyY2UnKSlcbiAgICAgICAgICAsIHN0YXRlUHJvcHMgICA9IGNvbW1vblByb3BzLmNvbmNhdChzdHIyYXJyKCdzdGF0ZScpKVxuICAgICAgICAgICwgb3Zlck91dFJlZ2V4ID0gL292ZXJ8b3V0L1xuICAgICAgICAgICAgLy8gc29tZSBldmVudCB0eXBlcyBuZWVkIHNwZWNpYWwgaGFuZGxpbmcgYW5kIHNvbWUgbmVlZCBzcGVjaWFsIHByb3BlcnRpZXMsIGRvIHRoYXQgYWxsIGhlcmVcbiAgICAgICAgICAsIHR5cGVGaXhlcnMgICA9IFtcbiAgICAgICAgICAgICAgICB7IC8vIGtleSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAva2V5L2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoZXZlbnQsIG5ld0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQua2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgfHwgZXZlbnQud2hpY2hcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5UHJvcHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIG1vdXNlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9jbGlja3xtb3VzZSg/ISguKndoZWVsfHNjcm9sbCkpfG1lbnV8ZHJhZ3xkcm9wL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoZXZlbnQsIG5ld0V2ZW50LCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQucmlnaHRDbGljayA9IGV2ZW50LndoaWNoID09PSAzIHx8IGV2ZW50LmJ1dHRvbiA9PT0gMlxuICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LnBvcyA9IHsgeDogMCwgeTogMCB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnBhZ2VYIHx8IGV2ZW50LnBhZ2VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRYID0gZXZlbnQucGFnZVhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFkgPSBldmVudC5wYWdlWVxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuY2xpZW50WCB8fCBldmVudC5jbGllbnRZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5jbGllbnRYID0gZXZlbnQuY2xpZW50WCArIGRvYy5ib2R5LnNjcm9sbExlZnQgKyByb290LnNjcm9sbExlZnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0V2ZW50LmNsaWVudFkgPSBldmVudC5jbGllbnRZICsgZG9jLmJvZHkuc2Nyb2xsVG9wICsgcm9vdC5zY3JvbGxUb3BcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG92ZXJPdXRSZWdleC50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdFdmVudC5yZWxhdGVkVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBldmVudFsodHlwZSA9PSAnbW91c2VvdmVyJyA/ICdmcm9tJyA6ICd0bycpICsgJ0VsZW1lbnQnXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW91c2VQcm9wc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbW91c2Ugd2hlZWwgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL21vdXNlLiood2hlZWx8c2Nyb2xsKS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbW91c2VXaGVlbFByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBUZXh0RXZlbnRcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXnRleHQvaVxuICAgICAgICAgICAgICAgICAgLCBmaXg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRleHRQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gdG91Y2ggYW5kIGdlc3R1cmUgZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgIHJlZzogL150b3VjaHxeZ2VzdHVyZS9pXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdG91Y2hQcm9wcyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAsIHsgLy8gbWVzc2FnZSBldmVudHNcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvXm1lc3NhZ2UkL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtZXNzYWdlUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLCB7IC8vIHBvcHN0YXRlIGV2ZW50c1xuICAgICAgICAgICAgICAgICAgICByZWc6IC9ecG9wc3RhdGUkL2lcbiAgICAgICAgICAgICAgICAgICwgZml4OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzdGF0ZVByb3BzIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgeyAvLyBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVnOiAvLiovXG4gICAgICAgICAgICAgICAgICAsIGZpeDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29tbW9uUHJvcHMgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICAsIHR5cGVGaXhlck1hcCA9IHt9IC8vIHVzZWQgdG8gbWFwIGV2ZW50IHR5cGVzIHRvIGZpeGVyIGZ1bmN0aW9ucyAoYWJvdmUpLCBhIGJhc2ljIGNhY2hlIG1lY2hhbmlzbVxuXG4gICAgICAgICAgLCBFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgZWxlbWVudCwgaXNOYXRpdmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm5cbiAgICAgICAgICAgICAgZXZlbnQgPSBldmVudCB8fCAoKGVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQpLnBhcmVudFdpbmRvdyB8fCB3aW4pLmV2ZW50XG4gICAgICAgICAgICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IGV2ZW50XG4gICAgICAgICAgICAgIHRoaXMuaXNOYXRpdmUgICAgICAgPSBpc05hdGl2ZVxuICAgICAgICAgICAgICB0aGlzLmlzQmVhbiAgICAgICAgID0gdHJ1ZVxuXG4gICAgICAgICAgICAgIGlmICghZXZlbnQpIHJldHVyblxuXG4gICAgICAgICAgICAgIHZhciB0eXBlICAgPSBldmVudC50eXBlXG4gICAgICAgICAgICAgICAgLCB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudFxuICAgICAgICAgICAgICAgICwgaSwgbCwgcCwgcHJvcHMsIGZpeGVyXG5cbiAgICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQgJiYgdGFyZ2V0Lm5vZGVUeXBlID09PSAzID8gdGFyZ2V0LnBhcmVudE5vZGUgOiB0YXJnZXRcblxuICAgICAgICAgICAgICBpZiAoaXNOYXRpdmUpIHsgLy8gd2Ugb25seSBuZWVkIGJhc2ljIGF1Z21lbnRhdGlvbiBvbiBjdXN0b20gZXZlbnRzLCB0aGUgcmVzdCBleHBlbnNpdmUgJiBwb2ludGxlc3NcbiAgICAgICAgICAgICAgICBmaXhlciA9IHR5cGVGaXhlck1hcFt0eXBlXVxuICAgICAgICAgICAgICAgIGlmICghZml4ZXIpIHsgLy8gaGF2ZW4ndCBlbmNvdW50ZXJlZCB0aGlzIGV2ZW50IHR5cGUgYmVmb3JlLCBtYXAgYSBmaXhlciBmdW5jdGlvbiBmb3IgaXRcbiAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSB0eXBlRml4ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZUZpeGVyc1tpXS5yZWcudGVzdCh0eXBlKSkgeyAvLyBndWFyYW50ZWVkIHRvIG1hdGNoIGF0IGxlYXN0IG9uZSwgbGFzdCBpcyAuKlxuICAgICAgICAgICAgICAgICAgICAgIHR5cGVGaXhlck1hcFt0eXBlXSA9IGZpeGVyID0gdHlwZUZpeGVyc1tpXS5maXhcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvcHMgPSBmaXhlcihldmVudCwgdGhpcywgdHlwZSlcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBwcm9wcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgICAgICAgIGlmICghKChwID0gcHJvcHNbaV0pIGluIHRoaXMpICYmIHAgaW4gZXZlbnQpIHRoaXNbcF0gPSBldmVudFtwXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIC8vIHByZXZlbnREZWZhdWx0KCkgYW5kIHN0b3BQcm9wYWdhdGlvbigpIGFyZSBhIGNvbnNpc3RlbnQgaW50ZXJmYWNlIHRvIHRob3NlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBvbiB0aGUgRE9NLCBzdG9wKCkgaXMgYW4gYWxpYXMgZm9yIGJvdGggb2YgdGhlbSB0b2dldGhlclxuICAgICAgICBFdmVudC5wcm90b3R5cGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCkgdGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBlbHNlIHRoaXMub3JpZ2luYWxFdmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgRXZlbnQucHJvdG90eXBlLnN0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbikgdGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgZWxzZSB0aGlzLm9yaWdpbmFsRXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRoaXMucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIHRoaXMuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgLy8gc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgaGFzIHRvIGJlIGhhbmRsZWQgaW50ZXJuYWxseSBiZWNhdXNlIHdlIG1hbmFnZSB0aGUgZXZlbnQgbGlzdCBmb3JcbiAgICAgICAgLy8gZWFjaCBlbGVtZW50XG4gICAgICAgIC8vIG5vdGUgdGhhdCBvcmlnaW5hbEVsZW1lbnQgbWF5IGJlIGEgQmVhbiNFdmVudCBvYmplY3QgaW4gc29tZSBzaXR1YXRpb25zXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHRoaXMub3JpZ2luYWxFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKVxuICAgICAgICAgIHRoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlIH1cbiAgICAgICAgfVxuICAgICAgICBFdmVudC5wcm90b3R5cGUuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWxFdmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCAmJiB0aGlzLm9yaWdpbmFsRXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKVxuICAgICAgICB9XG4gICAgICAgIEV2ZW50LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uIChjdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgLy9UT0RPOiB0aGlzIGlzIHJpcGUgZm9yIG9wdGltaXNhdGlvbiwgbmV3IGV2ZW50cyBhcmUgKmV4cGVuc2l2ZSpcbiAgICAgICAgICAvLyBpbXByb3ZpbmcgdGhpcyB3aWxsIHNwZWVkIHVwIGRlbGVnYXRlZCBldmVudHNcbiAgICAgICAgICB2YXIgbmUgPSBuZXcgRXZlbnQodGhpcywgdGhpcy5lbGVtZW50LCB0aGlzLmlzTmF0aXZlKVxuICAgICAgICAgIG5lLmN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0XG4gICAgICAgICAgcmV0dXJuIG5lXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gRXZlbnRcbiAgICAgIH0oKSlcblxuICAgICAgLy8gaWYgd2UncmUgaW4gb2xkIElFIHdlIGNhbid0IGRvIG9ucHJvcGVydHljaGFuZ2Ugb24gZG9jIG9yIHdpbiBzbyB3ZSB1c2UgZG9jLmRvY3VtZW50RWxlbWVudCBmb3IgYm90aFxuICAgICwgdGFyZ2V0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBpc05hdGl2ZSkge1xuICAgICAgICByZXR1cm4gIVczQ19NT0RFTCAmJiAhaXNOYXRpdmUgJiYgKGVsZW1lbnQgPT09IGRvYyB8fCBlbGVtZW50ID09PSB3aW4pID8gcm9vdCA6IGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogQmVhbiBtYWludGFpbnMgYW4gaW50ZXJuYWwgcmVnaXN0cnkgZm9yIGV2ZW50IGxpc3RlbmVycy4gV2UgZG9uJ3QgdG91Y2ggZWxlbWVudHMsIG9iamVjdHNcbiAgICAgICAgKiBvciBmdW5jdGlvbnMgdG8gaWRlbnRpZnkgdGhlbSwgaW5zdGVhZCB3ZSBzdG9yZSBldmVyeXRoaW5nIGluIHRoZSByZWdpc3RyeS5cbiAgICAgICAgKiBFYWNoIGV2ZW50IGxpc3RlbmVyIGhhcyBhIFJlZ0VudHJ5IG9iamVjdCwgd2UgaGF2ZSBvbmUgJ3JlZ2lzdHJ5JyBmb3IgdGhlIHdob2xlIGluc3RhbmNlLlxuICAgICAgICAqL1xuICAgICwgUmVnRW50cnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBlYWNoIGhhbmRsZXIgaXMgd3JhcHBlZCBzbyB3ZSBjYW4gaGFuZGxlIGRlbGVnYXRpb24gYW5kIGN1c3RvbSBldmVudHNcbiAgICAgICAgdmFyIHdyYXBwZWRIYW5kbGVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZuLCBjb25kaXRpb24sIGFyZ3MpIHtcbiAgICAgICAgICAgIHZhciBjYWxsID0gZnVuY3Rpb24gKGV2ZW50LCBlYXJncykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGVsZW1lbnQsIGFyZ3MgPyBzbGljZS5jYWxsKGVhcmdzLCBldmVudCA/IDAgOiAxKS5jb25jYXQoYXJncykgOiBlYXJncylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgZmluZFRhcmdldCA9IGZ1bmN0aW9uIChldmVudCwgZXZlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZm4uX19iZWFuRGVsID8gZm4uX19iZWFuRGVsLmZ0KGV2ZW50LnRhcmdldCwgZWxlbWVudCkgOiBldmVudEVsZW1lbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICwgaGFuZGxlciA9IGNvbmRpdGlvblxuICAgICAgICAgICAgICAgICAgPyBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZmluZFRhcmdldChldmVudCwgdGhpcykgLy8gZGVsZWF0ZWQgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uZGl0aW9uLmFwcGx5KHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50KSBldmVudC5jdXJyZW50VGFyZ2V0ID0gdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbChldmVudCwgYXJndW1lbnRzKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoZm4uX19iZWFuRGVsKSBldmVudCA9IGV2ZW50LmNsb25lKGZpbmRUYXJnZXQoZXZlbnQpKSAvLyBkZWxlZ2F0ZWQgZXZlbnQsIGZpeCB0aGUgZml4XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGwoZXZlbnQsIGFyZ3VtZW50cylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGFuZGxlci5fX2JlYW5EZWwgPSBmbi5fX2JlYW5EZWxcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyXG4gICAgICAgICAgfVxuXG4gICAgICAgICwgUmVnRW50cnkgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgaGFuZGxlciwgb3JpZ2luYWwsIG5hbWVzcGFjZXMsIGFyZ3MsIHJvb3QpIHtcbiAgICAgICAgICAgIHZhciBjdXN0b21UeXBlICAgICA9IGN1c3RvbUV2ZW50c1t0eXBlXVxuICAgICAgICAgICAgICAsIGlzTmF0aXZlXG5cbiAgICAgICAgICAgIGlmICh0eXBlID09ICd1bmxvYWQnKSB7XG4gICAgICAgICAgICAgIC8vIHNlbGYgY2xlYW4tdXBcbiAgICAgICAgICAgICAgaGFuZGxlciA9IG9uY2UocmVtb3ZlTGlzdGVuZXIsIGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIsIG9yaWdpbmFsKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3VzdG9tVHlwZSkge1xuICAgICAgICAgICAgICBpZiAoY3VzdG9tVHlwZS5jb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gd3JhcHBlZEhhbmRsZXIoZWxlbWVudCwgaGFuZGxlciwgY3VzdG9tVHlwZS5jb25kaXRpb24sIGFyZ3MpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdHlwZSA9IGN1c3RvbVR5cGUuYmFzZSB8fCB0eXBlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNOYXRpdmUgICAgICA9IGlzTmF0aXZlID0gbmF0aXZlRXZlbnRzW3R5cGVdICYmICEhZWxlbWVudFtldmVudFN1cHBvcnRdXG4gICAgICAgICAgICB0aGlzLmN1c3RvbVR5cGUgICAgPSAhVzNDX01PREVMICYmICFpc05hdGl2ZSAmJiB0eXBlXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgICAgICAgPSBlbGVtZW50XG4gICAgICAgICAgICB0aGlzLnR5cGUgICAgICAgICAgPSB0eXBlXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsICAgICAgPSBvcmlnaW5hbFxuICAgICAgICAgICAgdGhpcy5uYW1lc3BhY2VzICAgID0gbmFtZXNwYWNlc1xuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgICAgID0gVzNDX01PREVMIHx8IGlzTmF0aXZlID8gdHlwZSA6ICdwcm9wZXJ0eWNoYW5nZSdcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ICAgICAgICA9IHRhcmdldEVsZW1lbnQoZWxlbWVudCwgaXNOYXRpdmUpXG4gICAgICAgICAgICB0aGlzW2V2ZW50U3VwcG9ydF0gPSAhIXRoaXMudGFyZ2V0W2V2ZW50U3VwcG9ydF1cbiAgICAgICAgICAgIHRoaXMucm9vdCAgICAgICAgICA9IHJvb3RcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlciAgICAgICA9IHdyYXBwZWRIYW5kbGVyKGVsZW1lbnQsIGhhbmRsZXIsIG51bGwsIGFyZ3MpXG4gICAgICAgICAgfVxuXG4gICAgICAgIC8vIGdpdmVuIGEgbGlzdCBvZiBuYW1lc3BhY2VzLCBpcyBvdXIgZW50cnkgaW4gYW55IG9mIHRoZW0/XG4gICAgICAgIFJlZ0VudHJ5LnByb3RvdHlwZS5pbk5hbWVzcGFjZXMgPSBmdW5jdGlvbiAoY2hlY2tOYW1lc3BhY2VzKSB7XG4gICAgICAgICAgdmFyIGksIGosIGMgPSAwXG4gICAgICAgICAgaWYgKCFjaGVja05hbWVzcGFjZXMpIHJldHVybiB0cnVlXG4gICAgICAgICAgaWYgKCF0aGlzLm5hbWVzcGFjZXMpIHJldHVybiBmYWxzZVxuICAgICAgICAgIGZvciAoaSA9IGNoZWNrTmFtZXNwYWNlcy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgICAgIGZvciAoaiA9IHRoaXMubmFtZXNwYWNlcy5sZW5ndGg7IGotLTspIHtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrTmFtZXNwYWNlc1tpXSA9PSB0aGlzLm5hbWVzcGFjZXNbal0pIGMrK1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2hlY2tOYW1lc3BhY2VzLmxlbmd0aCA9PT0gY1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWF0Y2ggYnkgZWxlbWVudCwgb3JpZ2luYWwgZm4gKG9wdCksIGhhbmRsZXIgZm4gKG9wdClcbiAgICAgICAgUmVnRW50cnkucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAoY2hlY2tFbGVtZW50LCBjaGVja09yaWdpbmFsLCBjaGVja0hhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50ID09PSBjaGVja0VsZW1lbnQgJiZcbiAgICAgICAgICAgICghY2hlY2tPcmlnaW5hbCB8fCB0aGlzLm9yaWdpbmFsID09PSBjaGVja09yaWdpbmFsKSAmJlxuICAgICAgICAgICAgKCFjaGVja0hhbmRsZXIgfHwgdGhpcy5oYW5kbGVyID09PSBjaGVja0hhbmRsZXIpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUmVnRW50cnlcbiAgICAgIH0oKSlcblxuICAgICwgcmVnaXN0cnkgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBvdXIgbWFwIHN0b3JlcyBhcnJheXMgYnkgZXZlbnQgdHlwZSwganVzdCBiZWNhdXNlIGl0J3MgYmV0dGVyIHRoYW4gc3RvcmluZ1xuICAgICAgICAvLyBldmVyeXRoaW5nIGluIGEgc2luZ2xlIGFycmF5LlxuICAgICAgICAvLyB1c2VzICckJyBhcyBhIHByZWZpeCBmb3IgdGhlIGtleXMgZm9yIHNhZmV0eSBhbmQgJ3InIGFzIGEgc3BlY2lhbCBwcmVmaXggZm9yXG4gICAgICAgIC8vIHJvb3RMaXN0ZW5lcnMgc28gd2UgY2FuIGxvb2sgdGhlbSB1cCBmYXN0XG4gICAgICAgIHZhciBtYXAgPSB7fVxuXG4gICAgICAgICAgLy8gZ2VuZXJpYyBmdW5jdGlvbmFsIHNlYXJjaCBvZiBvdXIgcmVnaXN0cnkgZm9yIG1hdGNoaW5nIGxpc3RlbmVycyxcbiAgICAgICAgICAvLyBgZm5gIHJldHVybnMgZmFsc2UgdG8gYnJlYWsgb3V0IG9mIHRoZSBsb29wXG4gICAgICAgICAgLCBmb3JBbGwgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgb3JpZ2luYWwsIGhhbmRsZXIsIHJvb3QsIGZuKSB7XG4gICAgICAgICAgICAgIHZhciBwZnggPSByb290ID8gJ3InIDogJyQnXG4gICAgICAgICAgICAgIGlmICghdHlwZSB8fCB0eXBlID09ICcqJykge1xuICAgICAgICAgICAgICAgIC8vIHNlYXJjaCB0aGUgd2hvbGUgcmVnaXN0cnlcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB0IGluIG1hcCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHQuY2hhckF0KDApID09IHBmeCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JBbGwoZWxlbWVudCwgdC5zdWJzdHIoMSksIG9yaWdpbmFsLCBoYW5kbGVyLCByb290LCBmbilcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSAwLCBsLCBsaXN0ID0gbWFwW3BmeCArIHR5cGVdLCBhbGwgPSBlbGVtZW50ID09ICcqJ1xuICAgICAgICAgICAgICAgIGlmICghbGlzdCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgZm9yIChsID0gbGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmICgoYWxsIHx8IGxpc3RbaV0ubWF0Y2hlcyhlbGVtZW50LCBvcmlnaW5hbCwgaGFuZGxlcikpICYmICFmbihsaXN0W2ldLCBsaXN0LCBpLCB0eXBlKSkgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAsIGhhcyA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBvcmlnaW5hbCwgcm9vdCkge1xuICAgICAgICAgICAgICAvLyB3ZSdyZSBub3QgdXNpbmcgZm9yQWxsIGhlcmUgc2ltcGx5IGJlY2F1c2UgaXQncyBhIGJpdCBzbG93ZXIgYW5kIHRoaXNcbiAgICAgICAgICAgICAgLy8gbmVlZHMgdG8gYmUgZmFzdFxuICAgICAgICAgICAgICB2YXIgaSwgbGlzdCA9IG1hcFsocm9vdCA/ICdyJyA6ICckJykgKyB0eXBlXVxuICAgICAgICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWxpc3RbaV0ucm9vdCAmJiBsaXN0W2ldLm1hdGNoZXMoZWxlbWVudCwgb3JpZ2luYWwsIG51bGwpKSByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgZ2V0ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCByb290KSB7XG4gICAgICAgICAgICAgIHZhciBlbnRyaWVzID0gW11cbiAgICAgICAgICAgICAgZm9yQWxsKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsLCBudWxsLCByb290LCBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50cmllcy5wdXNoKGVudHJ5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm4gZW50cmllc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgLCBwdXQgPSBmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgdmFyIGhhcyA9ICFlbnRyeS5yb290ICYmICF0aGlzLmhhcyhlbnRyeS5lbGVtZW50LCBlbnRyeS50eXBlLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAsIGtleSA9IChlbnRyeS5yb290ID8gJ3InIDogJyQnKSArIGVudHJ5LnR5cGVcbiAgICAgICAgICAgICAgOyhtYXBba2V5XSB8fCAobWFwW2tleV0gPSBbXSkpLnB1c2goZW50cnkpXG4gICAgICAgICAgICAgIHJldHVybiBoYXNcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICwgZGVsID0gZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgICAgICAgIGZvckFsbChlbnRyeS5lbGVtZW50LCBlbnRyeS50eXBlLCBudWxsLCBlbnRyeS5oYW5kbGVyLCBlbnRyeS5yb290LCBmdW5jdGlvbiAoZW50cnksIGxpc3QsIGkpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIGVudHJ5LnJlbW92ZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSBkZWxldGUgbWFwWyhlbnRyeS5yb290ID8gJ3InIDogJyQnKSArIGVudHJ5LnR5cGVdXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGR1bXAgYWxsIGVudHJpZXMsIHVzZWQgZm9yIG9udW5sb2FkXG4gICAgICAgICAgLCBlbnRyaWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgdCwgZW50cmllcyA9IFtdXG4gICAgICAgICAgICAgIGZvciAodCBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAodC5jaGFyQXQoMCkgPT0gJyQnKSBlbnRyaWVzID0gZW50cmllcy5jb25jYXQobWFwW3RdKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBlbnRyaWVzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgaGFzOiBoYXMsIGdldDogZ2V0LCBwdXQ6IHB1dCwgZGVsOiBkZWwsIGVudHJpZXM6IGVudHJpZXMgfVxuICAgICAgfSgpKVxuXG4gICAgICAvLyB3ZSBuZWVkIGEgc2VsZWN0b3IgZW5naW5lIGZvciBkZWxlZ2F0ZWQgZXZlbnRzLCB1c2UgcXVlcnlTZWxlY3RvckFsbCBpZiBpdCBleGlzdHNcbiAgICAgIC8vIGJ1dCBmb3Igb2xkZXIgYnJvd3NlcnMgd2UgbmVlZCBRd2VyeSwgU2l6emxlIG9yIHNpbWlsYXJcbiAgICAsIHNlbGVjdG9yRW5naW5lXG4gICAgLCBzZXRTZWxlY3RvckVuZ2luZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIHNlbGVjdG9yRW5naW5lID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGxcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKHMsIHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gci5xdWVyeVNlbGVjdG9yQWxsKHMpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmVhbjogTm8gc2VsZWN0b3IgZW5naW5lIGluc3RhbGxlZCcpIC8vIGVlZWtcbiAgICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGVjdG9yRW5naW5lID0gZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGF0dGFjaCB0aGlzIGxpc3RlbmVyIHRvIGVhY2ggRE9NIGV2ZW50IHRoYXQgd2UgbmVlZCB0byBsaXN0ZW4gdG8sIG9ubHkgb25jZVxuICAgICAgLy8gcGVyIGV2ZW50IHR5cGUgcGVyIERPTSBlbGVtZW50XG4gICAgLCByb290TGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQsIHR5cGUpIHtcbiAgICAgICAgaWYgKCFXM0NfTU9ERUwgJiYgdHlwZSAmJiBldmVudCAmJiBldmVudC5wcm9wZXJ0eU5hbWUgIT0gJ19vbicgKyB0eXBlKSByZXR1cm5cblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gcmVnaXN0cnkuZ2V0KHRoaXMsIHR5cGUgfHwgZXZlbnQudHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCBsID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgICAgICwgaSA9IDBcblxuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudCwgdGhpcywgdHJ1ZSlcbiAgICAgICAgaWYgKHR5cGUpIGV2ZW50LnR5cGUgPSB0eXBlXG5cbiAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGFsbCBoYW5kbGVycyByZWdpc3RlcmVkIGZvciB0aGlzIHR5cGUsIGNhbGxpbmcgdGhlbSB1bmxlc3MgdGhleSBoYXZlXG4gICAgICAgIC8vIGJlZW4gcmVtb3ZlZCBieSBhIHByZXZpb3VzIGhhbmRsZXIgb3Igc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgaGFzIGJlZW4gY2FsbGVkXG4gICAgICAgIGZvciAoOyBpIDwgbCAmJiAhZXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKTsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaXN0ZW5lcnNbaV0ucmVtb3ZlZCkgbGlzdGVuZXJzW2ldLmhhbmRsZXIuY2FsbCh0aGlzLCBldmVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhZGQgYW5kIHJlbW92ZSBsaXN0ZW5lcnMgdG8gRE9NIGVsZW1lbnRzXG4gICAgLCBsaXN0ZW5lciA9IFczQ19NT0RFTFxuICAgICAgICA/IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhZGQpIHtcbiAgICAgICAgICAgIC8vIG5ldyBicm93c2Vyc1xuICAgICAgICAgICAgZWxlbWVudFthZGQgPyBhZGRFdmVudCA6IHJlbW92ZUV2ZW50XSh0eXBlLCByb290TGlzdGVuZXIsIGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAoZWxlbWVudCwgdHlwZSwgYWRkLCBjdXN0b20pIHtcbiAgICAgICAgICAgIC8vIElFOCBhbmQgYmVsb3csIHVzZSBhdHRhY2hFdmVudC9kZXRhY2hFdmVudCBhbmQgd2UgaGF2ZSB0byBwaWdneS1iYWNrIHByb3BlcnR5Y2hhbmdlIGV2ZW50c1xuICAgICAgICAgICAgLy8gdG8gc2ltdWxhdGUgZXZlbnQgYnViYmxpbmcgZXRjLlxuICAgICAgICAgICAgdmFyIGVudHJ5XG4gICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgIHJlZ2lzdHJ5LnB1dChlbnRyeSA9IG5ldyBSZWdFbnRyeShcbiAgICAgICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAsIGN1c3RvbSB8fCB0eXBlXG4gICAgICAgICAgICAgICAgLCBmdW5jdGlvbiAoZXZlbnQpIHsgLy8gaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICByb290TGlzdGVuZXIuY2FsbChlbGVtZW50LCBldmVudCwgY3VzdG9tKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICwgcm9vdExpc3RlbmVyXG4gICAgICAgICAgICAgICAgLCBudWxsXG4gICAgICAgICAgICAgICAgLCBudWxsXG4gICAgICAgICAgICAgICAgLCB0cnVlIC8vIGlzIHJvb3RcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgaWYgKGN1c3RvbSAmJiBlbGVtZW50Wydfb24nICsgY3VzdG9tXSA9PSBudWxsKSBlbGVtZW50Wydfb24nICsgY3VzdG9tXSA9IDBcbiAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmF0dGFjaEV2ZW50KCdvbicgKyBlbnRyeS5ldmVudFR5cGUsIGVudHJ5LmhhbmRsZXIpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbnRyeSA9IHJlZ2lzdHJ5LmdldChlbGVtZW50LCBjdXN0b20gfHwgdHlwZSwgcm9vdExpc3RlbmVyLCB0cnVlKVswXVxuICAgICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBlbnRyeS50YXJnZXQuZGV0YWNoRXZlbnQoJ29uJyArIGVudHJ5LmV2ZW50VHlwZSwgZW50cnkuaGFuZGxlcilcbiAgICAgICAgICAgICAgICByZWdpc3RyeS5kZWwoZW50cnkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAsIG9uY2UgPSBmdW5jdGlvbiAocm0sIGVsZW1lbnQsIHR5cGUsIGZuLCBvcmlnaW5hbEZuKSB7XG4gICAgICAgIC8vIHdyYXAgdGhlIGhhbmRsZXIgaW4gYSBoYW5kbGVyIHRoYXQgZG9lcyBhIHJlbW92ZSBhcyB3ZWxsXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJtKGVsZW1lbnQsIHR5cGUsIG9yaWdpbmFsRm4pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgcmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3JnVHlwZSwgaGFuZGxlciwgbmFtZXNwYWNlcykge1xuICAgICAgICB2YXIgdHlwZSAgICAgPSBvcmdUeXBlICYmIG9yZ1R5cGUucmVwbGFjZShuYW1lUmVnZXgsICcnKVxuICAgICAgICAgICwgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgLCByZW1vdmVkICA9IHt9XG4gICAgICAgICAgLCBpLCBsXG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmICgoIWhhbmRsZXIgfHwgaGFuZGxlcnNbaV0ub3JpZ2luYWwgPT09IGhhbmRsZXIpICYmIGhhbmRsZXJzW2ldLmluTmFtZXNwYWNlcyhuYW1lc3BhY2VzKSkge1xuICAgICAgICAgICAgLy8gVE9ETzogdGhpcyBpcyBwcm9ibGVtYXRpYywgd2UgaGF2ZSBhIHJlZ2lzdHJ5LmdldCgpIGFuZCByZWdpc3RyeS5kZWwoKSB0aGF0XG4gICAgICAgICAgICAvLyBib3RoIGRvIHJlZ2lzdHJ5IHNlYXJjaGVzIHNvIHdlIHdhc3RlIGN5Y2xlcyBkb2luZyB0aGlzLiBOZWVkcyB0byBiZSByb2xsZWQgaW50b1xuICAgICAgICAgICAgLy8gYSBzaW5nbGUgcmVnaXN0cnkuZm9yQWxsKGZuKSB0aGF0IHJlbW92ZXMgd2hpbGUgZmluZGluZywgYnV0IHRoZSBjYXRjaCBpcyB0aGF0XG4gICAgICAgICAgICAvLyB3ZSdsbCBiZSBzcGxpY2luZyB0aGUgYXJyYXlzIHRoYXQgd2UncmUgaXRlcmF0aW5nIG92ZXIuIE5lZWRzIGV4dHJhIHRlc3RzIHRvXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3Qgc2NyZXcgaXQgdXAuIEBydmFnZ1xuICAgICAgICAgICAgcmVnaXN0cnkuZGVsKGhhbmRsZXJzW2ldKVxuICAgICAgICAgICAgaWYgKCFyZW1vdmVkW2hhbmRsZXJzW2ldLmV2ZW50VHlwZV0gJiYgaGFuZGxlcnNbaV1bZXZlbnRTdXBwb3J0XSlcbiAgICAgICAgICAgICAgcmVtb3ZlZFtoYW5kbGVyc1tpXS5ldmVudFR5cGVdID0geyB0OiBoYW5kbGVyc1tpXS5ldmVudFR5cGUsIGM6IGhhbmRsZXJzW2ldLnR5cGUgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBlYWNoIHR5cGUvZWxlbWVudCBmb3IgcmVtb3ZlZCBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgcm9vdExpc3RlbmVyIHdoZXJlIGl0J3Mgbm8gbG9uZ2VyIG5lZWRlZFxuICAgICAgICBmb3IgKGkgaW4gcmVtb3ZlZCkge1xuICAgICAgICAgIGlmICghcmVnaXN0cnkuaGFzKGVsZW1lbnQsIHJlbW92ZWRbaV0udCwgbnVsbCwgZmFsc2UpKSB7XG4gICAgICAgICAgICAvLyBsYXN0IGxpc3RlbmVyIG9mIHRoaXMgdHlwZSwgcmVtb3ZlIHRoZSByb290TGlzdGVuZXJcbiAgICAgICAgICAgIGxpc3RlbmVyKGVsZW1lbnQsIHJlbW92ZWRbaV0udCwgZmFsc2UsIHJlbW92ZWRbaV0uYylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHVwIGEgZGVsZWdhdGUgaGVscGVyIHVzaW5nIHRoZSBnaXZlbiBzZWxlY3Rvciwgd3JhcCB0aGUgaGFuZGxlciBmdW5jdGlvblxuICAgICwgZGVsZWdhdGUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGZuKSB7XG4gICAgICAgIC8vVE9ETzogZmluZFRhcmdldCAodGhlcmVmb3JlICQpIGlzIGNhbGxlZCB0d2ljZSwgb25jZSBmb3IgbWF0Y2ggYW5kIG9uY2UgZm9yXG4gICAgICAgIC8vIHNldHRpbmcgZS5jdXJyZW50VGFyZ2V0LCBmaXggdGhpcyBzbyBpdCdzIG9ubHkgbmVlZGVkIG9uY2VcbiAgICAgICAgdmFyIGZpbmRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0LCByb290KSB7XG4gICAgICAgICAgICAgIHZhciBpLCBhcnJheSA9IGlzU3RyaW5nKHNlbGVjdG9yKSA/IHNlbGVjdG9yRW5naW5lKHNlbGVjdG9yLCByb290KSA6IHNlbGVjdG9yXG4gICAgICAgICAgICAgIGZvciAoOyB0YXJnZXQgJiYgdGFyZ2V0ICE9PSByb290OyB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IGFycmF5Lmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0YXJnZXQpIHJldHVybiB0YXJnZXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAsIGhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBmaW5kVGFyZ2V0KGUudGFyZ2V0LCB0aGlzKVxuICAgICAgICAgICAgICBpZiAobWF0Y2gpIGZuLmFwcGx5KG1hdGNoLCBhcmd1bWVudHMpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgLy8gX19iZWFuRGVsIGlzbid0IHBsZWFzYW50IGJ1dCBpdCdzIGEgcHJpdmF0ZSBmdW5jdGlvbiwgbm90IGV4cG9zZWQgb3V0c2lkZSBvZiBCZWFuXG4gICAgICAgIGhhbmRsZXIuX19iZWFuRGVsID0ge1xuICAgICAgICAgICAgZnQgICAgICAgOiBmaW5kVGFyZ2V0IC8vIGF0dGFjaCBpdCBoZXJlIGZvciBjdXN0b21FdmVudHMgdG8gdXNlIHRvb1xuICAgICAgICAgICwgc2VsZWN0b3IgOiBzZWxlY3RvclxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVyXG4gICAgICB9XG5cbiAgICAsIGZpcmVMaXN0ZW5lciA9IFczQ19NT0RFTCA/IGZ1bmN0aW9uIChpc05hdGl2ZSwgdHlwZSwgZWxlbWVudCkge1xuICAgICAgICAvLyBtb2Rlcm4gYnJvd3NlcnMsIGRvIGEgcHJvcGVyIGRpc3BhdGNoRXZlbnQoKVxuICAgICAgICB2YXIgZXZ0ID0gZG9jLmNyZWF0ZUV2ZW50KGlzTmF0aXZlID8gJ0hUTUxFdmVudHMnIDogJ1VJRXZlbnRzJylcbiAgICAgICAgZXZ0W2lzTmF0aXZlID8gJ2luaXRFdmVudCcgOiAnaW5pdFVJRXZlbnQnXSh0eXBlLCB0cnVlLCB0cnVlLCB3aW4sIDEpXG4gICAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldnQpXG4gICAgICB9IDogZnVuY3Rpb24gKGlzTmF0aXZlLCB0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIC8vIG9sZCBicm93c2VyIHVzZSBvbnByb3BlcnR5Y2hhbmdlLCBqdXN0IGluY3JlbWVudCBhIGN1c3RvbSBwcm9wZXJ0eSB0byB0cmlnZ2VyIHRoZSBldmVudFxuICAgICAgICBlbGVtZW50ID0gdGFyZ2V0RWxlbWVudChlbGVtZW50LCBpc05hdGl2ZSlcbiAgICAgICAgaXNOYXRpdmUgPyBlbGVtZW50LmZpcmVFdmVudCgnb24nICsgdHlwZSwgZG9jLmNyZWF0ZUV2ZW50T2JqZWN0KCkpIDogZWxlbWVudFsnX29uJyArIHR5cGVdKytcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogUHVibGljIEFQSTogb2ZmKCksIG9uKCksIGFkZCgpLCAocmVtb3ZlKCkpLCBvbmUoKSwgZmlyZSgpLCBjbG9uZSgpXG4gICAgICAgICovXG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9mZihlbGVtZW50WywgZXZlbnRUeXBlKHMpWywgaGFuZGxlciBdXSlcbiAgICAgICAgKi9cbiAgICAsIG9mZiA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlU3BlYywgZm4pIHtcbiAgICAgICAgdmFyIGlzVHlwZVN0ciA9IGlzU3RyaW5nKHR5cGVTcGVjKVxuICAgICAgICAgICwgaywgdHlwZSwgbmFtZXNwYWNlcywgaVxuXG4gICAgICAgIGlmIChpc1R5cGVTdHIgJiYgdHlwZVNwZWMuaW5kZXhPZignICcpID4gMCkge1xuICAgICAgICAgIC8vIG9mZihlbCwgJ3QxIHQyIHQzJywgZm4pIG9yIG9mZihlbCwgJ3QxIHQyIHQzJylcbiAgICAgICAgICB0eXBlU3BlYyA9IHN0cjJhcnIodHlwZVNwZWMpXG4gICAgICAgICAgZm9yIChpID0gdHlwZVNwZWMubGVuZ3RoOyBpLS07KVxuICAgICAgICAgICAgb2ZmKGVsZW1lbnQsIHR5cGVTcGVjW2ldLCBmbilcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9IGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgIGlmICh0eXBlICYmIGN1c3RvbUV2ZW50c1t0eXBlXSkgdHlwZSA9IGN1c3RvbUV2ZW50c1t0eXBlXS5iYXNlXG5cbiAgICAgICAgaWYgKCF0eXBlU3BlYyB8fCBpc1R5cGVTdHIpIHtcbiAgICAgICAgICAvLyBvZmYoZWwpIG9yIG9mZihlbCwgdDEubnMpIG9yIG9mZihlbCwgLm5zKSBvciBvZmYoZWwsIC5uczEubnMyLm5zMylcbiAgICAgICAgICBpZiAobmFtZXNwYWNlcyA9IGlzVHlwZVN0ciAmJiB0eXBlU3BlYy5yZXBsYWNlKG5hbWVzcGFjZVJlZ2V4LCAnJykpIG5hbWVzcGFjZXMgPSBzdHIyYXJyKG5hbWVzcGFjZXMsICcuJylcbiAgICAgICAgICByZW1vdmVMaXN0ZW5lcihlbGVtZW50LCB0eXBlLCBmbiwgbmFtZXNwYWNlcylcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHR5cGVTcGVjKSkge1xuICAgICAgICAgIC8vIG9mZihlbCwgZm4pXG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZWxlbWVudCwgbnVsbCwgdHlwZVNwZWMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gb2ZmKGVsLCB7IHQxOiBmbjEsIHQyLCBmbjIgfSlcbiAgICAgICAgICBmb3IgKGsgaW4gdHlwZVNwZWMpIHtcbiAgICAgICAgICAgIGlmICh0eXBlU3BlYy5oYXNPd25Qcm9wZXJ0eShrKSkgb2ZmKGVsZW1lbnQsIGssIHR5cGVTcGVjW2tdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIG9uKGVsZW1lbnQsIGV2ZW50VHlwZShzKVssIHNlbGVjdG9yXSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKi9cbiAgICAsIG9uID0gZnVuY3Rpb24oZWxlbWVudCwgZXZlbnRzLCBzZWxlY3RvciwgZm4pIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsRm4sIHR5cGUsIHR5cGVzLCBpLCBhcmdzLCBlbnRyeSwgZmlyc3RcblxuICAgICAgICAvL1RPRE86IHRoZSB1bmRlZmluZWQgY2hlY2sgbWVhbnMgeW91IGNhbid0IHBhc3MgYW4gJ2FyZ3MnIGFyZ3VtZW50LCBmaXggdGhpcyBwZXJoYXBzP1xuICAgICAgICBpZiAoc2VsZWN0b3IgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZXZlbnRzID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLy9UT0RPOiB0aGlzIGNhbid0IGhhbmRsZSBkZWxlZ2F0ZWQgZXZlbnRzXG4gICAgICAgICAgZm9yICh0eXBlIGluIGV2ZW50cykge1xuICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICAgICAgICBvbi5jYWxsKHRoaXMsIGVsZW1lbnQsIHR5cGUsIGV2ZW50c1t0eXBlXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oc2VsZWN0b3IpKSB7XG4gICAgICAgICAgLy8gZGVsZWdhdGVkIGV2ZW50XG4gICAgICAgICAgb3JpZ2luYWxGbiA9IGZuXG4gICAgICAgICAgYXJncyAgICAgICA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCA0KVxuICAgICAgICAgIGZuICAgICAgICAgPSBkZWxlZ2F0ZShzZWxlY3Rvciwgb3JpZ2luYWxGbiwgc2VsZWN0b3JFbmdpbmUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncyAgICAgICA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAzKVxuICAgICAgICAgIGZuICAgICAgICAgPSBvcmlnaW5hbEZuID0gc2VsZWN0b3JcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGVzID0gc3RyMmFycihldmVudHMpXG5cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBvbmUoKSwgd3JhcCBpbiBhIHNlbGYtcmVtb3ZpbmcgaGFuZGxlclxuICAgICAgICBpZiAodGhpcyA9PT0gT05FKSB7XG4gICAgICAgICAgZm4gPSBvbmNlKG9mZiwgZWxlbWVudCwgZXZlbnRzLCBmbiwgb3JpZ2luYWxGbilcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IHR5cGVzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgIC8vIGFkZCBuZXcgaGFuZGxlciB0byB0aGUgcmVnaXN0cnkgYW5kIGNoZWNrIGlmIGl0J3MgdGhlIGZpcnN0IGZvciB0aGlzIGVsZW1lbnQvdHlwZVxuICAgICAgICAgIGZpcnN0ID0gcmVnaXN0cnkucHV0KGVudHJ5ID0gbmV3IFJlZ0VudHJ5KFxuICAgICAgICAgICAgICBlbGVtZW50XG4gICAgICAgICAgICAsIHR5cGVzW2ldLnJlcGxhY2UobmFtZVJlZ2V4LCAnJykgLy8gZXZlbnQgdHlwZVxuICAgICAgICAgICAgLCBmblxuICAgICAgICAgICAgLCBvcmlnaW5hbEZuXG4gICAgICAgICAgICAsIHN0cjJhcnIodHlwZXNbaV0ucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpLCAnLicpIC8vIG5hbWVzcGFjZXNcbiAgICAgICAgICAgICwgYXJnc1xuICAgICAgICAgICAgLCBmYWxzZSAvLyBub3Qgcm9vdFxuICAgICAgICAgICkpXG4gICAgICAgICAgaWYgKGVudHJ5W2V2ZW50U3VwcG9ydF0gJiYgZmlyc3QpIHtcbiAgICAgICAgICAgIC8vIGZpcnN0IGV2ZW50IG9mIHRoaXMgdHlwZSBvbiB0aGlzIGVsZW1lbnQsIGFkZCByb290IGxpc3RlbmVyXG4gICAgICAgICAgICBsaXN0ZW5lcihlbGVtZW50LCBlbnRyeS5ldmVudFR5cGUsIHRydWUsIGVudHJ5LmN1c3RvbVR5cGUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogYWRkKGVsZW1lbnRbLCBzZWxlY3Rvcl0sIGV2ZW50VHlwZShzKSwgaGFuZGxlclssIGFyZ3MgXSlcbiAgICAgICAgKlxuICAgICAgICAqIERlcHJlY2F0ZWQ6IGtlcHQgKGZvciBub3cpIGZvciBiYWNrd2FyZC1jb21wYXRpYmlsaXR5XG4gICAgICAgICovXG4gICAgLCBhZGQgPSBmdW5jdGlvbiAoZWxlbWVudCwgZXZlbnRzLCBmbiwgZGVsZm4pIHtcbiAgICAgICAgcmV0dXJuIG9uLmFwcGx5KFxuICAgICAgICAgICAgbnVsbFxuICAgICAgICAgICwgIWlzU3RyaW5nKGZuKVxuICAgICAgICAgICAgICA/IHNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgICAgICAgICAgICA6IFsgZWxlbWVudCwgZm4sIGV2ZW50cywgZGVsZm4gXS5jb25jYXQoYXJndW1lbnRzLmxlbmd0aCA+IDMgPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgNSkgOiBbXSlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAgKiBvbmUoZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgc2VsZWN0b3JdLCBoYW5kbGVyWywgYXJncyBdKVxuICAgICAgICAqL1xuICAgICwgb25lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gb24uYXBwbHkoT05FLCBhcmd1bWVudHMpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICAqIGZpcmUoZWxlbWVudCwgZXZlbnRUeXBlKHMpWywgYXJncyBdKVxuICAgICAgICAqXG4gICAgICAgICogVGhlIG9wdGlvbmFsICdhcmdzJyBhcmd1bWVudCBtdXN0IGJlIGFuIGFycmF5LCBpZiBubyAnYXJncycgYXJndW1lbnQgaXMgcHJvdmlkZWRcbiAgICAgICAgKiB0aGVuIHdlIGNhbiB1c2UgdGhlIGJyb3dzZXIncyBET00gZXZlbnQgc3lzdGVtLCBvdGhlcndpc2Ugd2UgdHJpZ2dlciBoYW5kbGVycyBtYW51YWxseVxuICAgICAgICAqL1xuICAgICwgZmlyZSA9IGZ1bmN0aW9uIChlbGVtZW50LCB0eXBlLCBhcmdzKSB7XG4gICAgICAgIHZhciB0eXBlcyA9IHN0cjJhcnIodHlwZSlcbiAgICAgICAgICAsIGksIGosIGwsIG5hbWVzLCBoYW5kbGVyc1xuXG4gICAgICAgIGZvciAoaSA9IHR5cGVzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgIHR5cGUgPSB0eXBlc1tpXS5yZXBsYWNlKG5hbWVSZWdleCwgJycpXG4gICAgICAgICAgaWYgKG5hbWVzID0gdHlwZXNbaV0ucmVwbGFjZShuYW1lc3BhY2VSZWdleCwgJycpKSBuYW1lcyA9IHN0cjJhcnIobmFtZXMsICcuJylcbiAgICAgICAgICBpZiAoIW5hbWVzICYmICFhcmdzICYmIGVsZW1lbnRbZXZlbnRTdXBwb3J0XSkge1xuICAgICAgICAgICAgZmlyZUxpc3RlbmVyKG5hdGl2ZUV2ZW50c1t0eXBlXSwgdHlwZSwgZWxlbWVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gbm9uLW5hdGl2ZSBldmVudCwgZWl0aGVyIGJlY2F1c2Ugb2YgYSBuYW1lc3BhY2UsIGFyZ3VtZW50cyBvciBhIG5vbiBET00gZWxlbWVudFxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBsaXN0ZW5lcnMgYW5kIG1hbnVhbGx5ICdmaXJlJ1xuICAgICAgICAgICAgaGFuZGxlcnMgPSByZWdpc3RyeS5nZXQoZWxlbWVudCwgdHlwZSwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgICBhcmdzID0gW2ZhbHNlXS5jb25jYXQoYXJncylcbiAgICAgICAgICAgIGZvciAoaiA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKGhhbmRsZXJzW2pdLmluTmFtZXNwYWNlcyhuYW1lcykpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyc1tqXS5oYW5kbGVyLmFwcGx5KGVsZW1lbnQsIGFyZ3MpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgICogY2xvbmUoZHN0RWxlbWVudCwgc3JjRWxlbWVudFssIGV2ZW50VHlwZSBdKVxuICAgICAgICAqXG4gICAgICAgICogVE9ETzogcGVyaGFwcyBmb3IgY29uc2lzdGVuY3kgd2Ugc2hvdWxkIGFsbG93IHRoZSBzYW1lIGZsZXhpYmlsaXR5IGluIHR5cGUgc3BlY2lmaWVycz9cbiAgICAgICAgKi9cbiAgICAsIGNsb25lID0gZnVuY3Rpb24gKGVsZW1lbnQsIGZyb20sIHR5cGUpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gcmVnaXN0cnkuZ2V0KGZyb20sIHR5cGUsIG51bGwsIGZhbHNlKVxuICAgICAgICAgICwgbCA9IGhhbmRsZXJzLmxlbmd0aFxuICAgICAgICAgICwgaSA9IDBcbiAgICAgICAgICAsIGFyZ3MsIGJlYW5EZWxcblxuICAgICAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChoYW5kbGVyc1tpXS5vcmlnaW5hbCkge1xuICAgICAgICAgICAgYXJncyA9IFsgZWxlbWVudCwgaGFuZGxlcnNbaV0udHlwZSBdXG4gICAgICAgICAgICBpZiAoYmVhbkRlbCA9IGhhbmRsZXJzW2ldLmhhbmRsZXIuX19iZWFuRGVsKSBhcmdzLnB1c2goYmVhbkRlbC5zZWxlY3RvcilcbiAgICAgICAgICAgIGFyZ3MucHVzaChoYW5kbGVyc1tpXS5vcmlnaW5hbClcbiAgICAgICAgICAgIG9uLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICB9XG5cbiAgICAsIGJlYW4gPSB7XG4gICAgICAgICAgb24gICAgICAgICAgICAgICAgOiBvblxuICAgICAgICAsIGFkZCAgICAgICAgICAgICAgIDogYWRkXG4gICAgICAgICwgb25lICAgICAgICAgICAgICAgOiBvbmVcbiAgICAgICAgLCBvZmYgICAgICAgICAgICAgICA6IG9mZlxuICAgICAgICAsIHJlbW92ZSAgICAgICAgICAgIDogb2ZmXG4gICAgICAgICwgY2xvbmUgICAgICAgICAgICAgOiBjbG9uZVxuICAgICAgICAsIGZpcmUgICAgICAgICAgICAgIDogZmlyZVxuICAgICAgICAsIEV2ZW50ICAgICAgICAgICAgIDogRXZlbnRcbiAgICAgICAgLCBzZXRTZWxlY3RvckVuZ2luZSA6IHNldFNlbGVjdG9yRW5naW5lXG4gICAgICAgICwgbm9Db25mbGljdCAgICAgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250ZXh0W25hbWVdID0gb2xkXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgIH1cbiAgICAgIH1cblxuICAvLyBmb3IgSUUsIGNsZWFuIHVwIG9uIHVubG9hZCB0byBhdm9pZCBsZWFrc1xuICBpZiAod2luLmF0dGFjaEV2ZW50KSB7XG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaSwgZW50cmllcyA9IHJlZ2lzdHJ5LmVudHJpZXMoKVxuICAgICAgZm9yIChpIGluIGVudHJpZXMpIHtcbiAgICAgICAgaWYgKGVudHJpZXNbaV0udHlwZSAmJiBlbnRyaWVzW2ldLnR5cGUgIT09ICd1bmxvYWQnKSBvZmYoZW50cmllc1tpXS5lbGVtZW50LCBlbnRyaWVzW2ldLnR5cGUpXG4gICAgICB9XG4gICAgICB3aW4uZGV0YWNoRXZlbnQoJ29udW5sb2FkJywgY2xlYW51cClcbiAgICAgIHdpbi5Db2xsZWN0R2FyYmFnZSAmJiB3aW4uQ29sbGVjdEdhcmJhZ2UoKVxuICAgIH1cbiAgICB3aW4uYXR0YWNoRXZlbnQoJ29udW5sb2FkJywgY2xlYW51cClcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgc2VsZWN0b3IgZW5naW5lIHRvIGludGVybmFsIGRlZmF1bHQgKHFTQSBvciB0aHJvdyBFcnJvcilcbiAgc2V0U2VsZWN0b3JFbmdpbmUoKVxuXG4gIHJldHVybiBiZWFuXG59KTsiLCIvKiFcbiAgKiBCb256bzogRE9NIFV0aWxpdHkgKGMpIER1c3RpbiBEaWF6IDIwMTJcbiAgKiBodHRwczovL2dpdGh1Yi5jb20vZGVkL2JvbnpvXG4gICogTGljZW5zZSBNSVRcbiAgKi9cbihmdW5jdGlvbiAobmFtZSwgY29udGV4dCwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKClcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIGRlZmluZShkZWZpbml0aW9uKVxuICBlbHNlIGNvbnRleHRbbmFtZV0gPSBkZWZpbml0aW9uKClcbn0pKCdib256bycsIHRoaXMsIGZ1bmN0aW9uKCkge1xuICB2YXIgd2luID0gd2luZG93XG4gICAgLCBkb2MgPSB3aW4uZG9jdW1lbnRcbiAgICAsIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gICAgLCBwYXJlbnROb2RlID0gJ3BhcmVudE5vZGUnXG4gICAgLCBzcGVjaWFsQXR0cmlidXRlcyA9IC9eKGNoZWNrZWR8dmFsdWV8c2VsZWN0ZWR8ZGlzYWJsZWQpJC9pXG4gICAgICAvLyB0YWdzIHRoYXQgd2UgaGF2ZSB0cm91YmxlIGluc2VydGluZyAqaW50bypcbiAgICAsIHNwZWNpYWxUYWdzID0gL14oc2VsZWN0fGZpZWxkc2V0fHRhYmxlfHRib2R5fHRmb290fHRkfHRyfGNvbGdyb3VwKSQvaVxuICAgICwgc2ltcGxlU2NyaXB0VGFnUmUgPSAvXFxzKjxzY3JpcHQgK3NyYz1bJ1wiXShbXidcIl0rKVsnXCJdPi9cbiAgICAsIHRhYmxlID0gWyc8dGFibGU+JywgJzwvdGFibGU+JywgMV1cbiAgICAsIHRkID0gWyc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+JywgM11cbiAgICAsIG9wdGlvbiA9IFsnPHNlbGVjdD4nLCAnPC9zZWxlY3Q+JywgMV1cbiAgICAsIG5vc2NvcGUgPSBbJ18nLCAnJywgMCwgMV1cbiAgICAsIHRhZ01hcCA9IHsgLy8gdGFncyB0aGF0IHdlIGhhdmUgdHJvdWJsZSAqaW5zZXJ0aW5nKlxuICAgICAgICAgIHRoZWFkOiB0YWJsZSwgdGJvZHk6IHRhYmxlLCB0Zm9vdDogdGFibGUsIGNvbGdyb3VwOiB0YWJsZSwgY2FwdGlvbjogdGFibGVcbiAgICAgICAgLCB0cjogWyc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+JywgMl1cbiAgICAgICAgLCB0aDogdGQgLCB0ZDogdGRcbiAgICAgICAgLCBjb2w6IFsnPHRhYmxlPjxjb2xncm91cD4nLCAnPC9jb2xncm91cD48L3RhYmxlPicsIDJdXG4gICAgICAgICwgZmllbGRzZXQ6IFsnPGZvcm0+JywgJzwvZm9ybT4nLCAxXVxuICAgICAgICAsIGxlZ2VuZDogWyc8Zm9ybT48ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+PC9mb3JtPicsIDJdXG4gICAgICAgICwgb3B0aW9uOiBvcHRpb24sIG9wdGdyb3VwOiBvcHRpb25cbiAgICAgICAgLCBzY3JpcHQ6IG5vc2NvcGUsIHN0eWxlOiBub3Njb3BlLCBsaW5rOiBub3Njb3BlLCBwYXJhbTogbm9zY29wZSwgYmFzZTogbm9zY29wZVxuICAgICAgfVxuICAgICwgc3RhdGVBdHRyaWJ1dGVzID0gL14oY2hlY2tlZHxzZWxlY3RlZHxkaXNhYmxlZCkkL1xuICAgICwgaWUgPSAvbXNpZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICAsIGhhc0NsYXNzLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3NcbiAgICAsIHVpZE1hcCA9IHt9XG4gICAgLCB1dWlkcyA9IDBcbiAgICAsIGRpZ2l0ID0gL14tP1tcXGRcXC5dKyQvXG4gICAgLCBkYXR0ciA9IC9eZGF0YS0oLispJC9cbiAgICAsIHB4ID0gJ3B4J1xuICAgICwgc2V0QXR0cmlidXRlID0gJ3NldEF0dHJpYnV0ZSdcbiAgICAsIGdldEF0dHJpYnV0ZSA9ICdnZXRBdHRyaWJ1dGUnXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIGZlYXR1cmVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3AnKVxuICAgICAgICBlLmlubmVySFRNTCA9ICc8YSBocmVmPVwiI3hcIj54PC9hPjx0YWJsZSBzdHlsZT1cImZsb2F0OmxlZnQ7XCI+PC90YWJsZT4nXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZkV4dGVuZGVkOiBlW2J5VGFnXSgnYScpWzBdW2dldEF0dHJpYnV0ZV0oJ2hyZWYnKSAhPSAnI3gnIC8vIElFIDwgOFxuICAgICAgICAsIGF1dG9UYm9keTogZVtieVRhZ10oJ3Rib2R5JykubGVuZ3RoICE9PSAwIC8vIElFIDwgOFxuICAgICAgICAsIGNvbXB1dGVkU3R5bGU6IGRvYy5kZWZhdWx0VmlldyAmJiBkb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZVxuICAgICAgICAsIGNzc0Zsb2F0OiBlW2J5VGFnXSgndGFibGUnKVswXS5zdHlsZS5zdHlsZUZsb2F0ID8gJ3N0eWxlRmxvYXQnIDogJ2Nzc0Zsb2F0J1xuICAgICAgICAsIHRyYW5zZm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHByb3BzID0gWyd0cmFuc2Zvcm0nLCAnd2Via2l0VHJhbnNmb3JtJywgJ01velRyYW5zZm9ybScsICdPVHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJ10sIGlcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAocHJvcHNbaV0gaW4gZS5zdHlsZSkgcmV0dXJuIHByb3BzW2ldXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSgpXG4gICAgICAgICwgY2xhc3NMaXN0OiAnY2xhc3NMaXN0JyBpbiBlXG4gICAgICAgICwgb3Bhc2l0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBkb2MuY3JlYXRlRWxlbWVudCgnYScpLnN0eWxlLm9wYWNpdHkgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICAgfSgpXG4gICAgICAgIH1cbiAgICAgIH0oKVxuICAgICwgdHJpbVJlcGxhY2UgPSAvKF5cXHMqfFxccyokKS9nXG4gICAgLCB3aGl0ZXNwYWNlUmVnZXggPSAvXFxzKy9cbiAgICAsIHRvU3RyaW5nID0gU3RyaW5nLnByb3RvdHlwZS50b1N0cmluZ1xuICAgICwgdW5pdGxlc3MgPSB7IGxpbmVIZWlnaHQ6IDEsIHpvb206IDEsIHpJbmRleDogMSwgb3BhY2l0eTogMSwgYm94RmxleDogMSwgV2Via2l0Qm94RmxleDogMSwgTW96Qm94RmxleDogMSB9XG4gICAgLCBxdWVyeSA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsICYmIGZ1bmN0aW9uIChzZWxlY3RvcikgeyByZXR1cm4gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpIH1cbiAgICAsIHRyaW0gPSBTdHJpbmcucHJvdG90eXBlLnRyaW0gP1xuICAgICAgICBmdW5jdGlvbiAocykge1xuICAgICAgICAgIHJldHVybiBzLnRyaW0oKVxuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICByZXR1cm4gcy5yZXBsYWNlKHRyaW1SZXBsYWNlLCAnJylcbiAgICAgICAgfVxuXG4gICAgLCBnZXRTdHlsZSA9IGZlYXR1cmVzLmNvbXB1dGVkU3R5bGVcbiAgICAgICAgPyBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsXG4gICAgICAgICAgICAgICwgY29tcHV0ZWQgPSBkb2MuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgJycpXG4gICAgICAgICAgICBjb21wdXRlZCAmJiAodmFsdWUgPSBjb21wdXRlZFtwcm9wZXJ0eV0pXG4gICAgICAgICAgICByZXR1cm4gZWwuc3R5bGVbcHJvcGVydHldIHx8IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICA6ICEoaWUgJiYgaHRtbC5jdXJyZW50U3R5bGUpXG4gICAgICAgICAgPyBmdW5jdGlvbiAoZWwsIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eVxuICAgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ3xudW1iZXJ9XG4gICAgICAgICAgICovXG4gICAgICAgICAgZnVuY3Rpb24gKGVsLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdmFyIHZhbCwgdmFsdWVcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSAnb3BhY2l0eScgJiYgIWZlYXR1cmVzLm9wYXNpdHkpIHtcbiAgICAgICAgICAgICAgdmFsID0gMTAwXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFsID0gZWxbJ2ZpbHRlcnMnXVsnRFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuQWxwaGEnXS5vcGFjaXR5XG4gICAgICAgICAgICAgIH0gY2F0Y2ggKGUxKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhbCA9IGVsWydmaWx0ZXJzJ10oJ2FscGhhJykub3BhY2l0eVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUyKSB7fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWwgLyAxMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gZWwuY3VycmVudFN0eWxlID8gZWwuY3VycmVudFN0eWxlW3Byb3BlcnR5XSA6IG51bGxcbiAgICAgICAgICAgIHJldHVybiBlbC5zdHlsZVtwcm9wZXJ0eV0gfHwgdmFsdWVcbiAgICAgICAgICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAmJiBub2RlLm5vZGVOYW1lICYmIChub2RlLm5vZGVUeXBlID09IDEgfHwgbm9kZS5ub2RlVHlwZSA9PSAxMSlcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplKG5vZGUsIGhvc3QsIGNsb25lKSB7XG4gICAgdmFyIGksIGwsIHJldFxuICAgIGlmICh0eXBlb2Ygbm9kZSA9PSAnc3RyaW5nJykgcmV0dXJuIGJvbnpvLmNyZWF0ZShub2RlKVxuICAgIGlmIChpc05vZGUobm9kZSkpIG5vZGUgPSBbIG5vZGUgXVxuICAgIGlmIChjbG9uZSkge1xuICAgICAgcmV0ID0gW10gLy8gZG9uJ3QgY2hhbmdlIG9yaWdpbmFsIGFycmF5XG4gICAgICBmb3IgKGkgPSAwLCBsID0gbm9kZS5sZW5ndGg7IGkgPCBsOyBpKyspIHJldFtpXSA9IGNsb25lTm9kZShob3N0LCBub2RlW2ldKVxuICAgICAgcmV0dXJuIHJldFxuICAgIH1cbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjIGEgY2xhc3MgbmFtZSB0byB0ZXN0XG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBmdW5jdGlvbiBjbGFzc1JlZyhjKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyhefFxcXFxzKyknICsgYyArICcoXFxcXHMrfCQpJylcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9uem98QXJyYXl9IGFyXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oT2JqZWN0LCBudW1iZXIsIChCb256b3xBcnJheSkpfSBmblxuICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfcmV2XG4gICAqIEByZXR1cm4ge0JvbnpvfEFycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaChhciwgZm4sIG9wdF9zY29wZSwgb3B0X3Jldikge1xuICAgIHZhciBpbmQsIGkgPSAwLCBsID0gYXIubGVuZ3RoXG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGluZCA9IG9wdF9yZXYgPyBhci5sZW5ndGggLSBpIC0gMSA6IGlcbiAgICAgIGZuLmNhbGwob3B0X3Njb3BlIHx8IGFyW2luZF0sIGFyW2luZF0sIGluZCwgYXIpXG4gICAgfVxuICAgIHJldHVybiBhclxuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtCb256b3xBcnJheX0gYXJcbiAgICogQHBhcmFtIHtmdW5jdGlvbihPYmplY3QsIG51bWJlciwgKEJvbnpvfEFycmF5KSl9IGZuXG4gICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAqIEByZXR1cm4ge0JvbnpvfEFycmF5fVxuICAgKi9cbiAgZnVuY3Rpb24gZGVlcEVhY2goYXIsIGZuLCBvcHRfc2NvcGUpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGlzTm9kZShhcltpXSkpIHtcbiAgICAgICAgZGVlcEVhY2goYXJbaV0uY2hpbGROb2RlcywgZm4sIG9wdF9zY29wZSlcbiAgICAgICAgZm4uY2FsbChvcHRfc2NvcGUgfHwgYXJbaV0sIGFyW2ldLCBpLCBhcilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBjYW1lbGl6ZShzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbiAobSwgbTEpIHtcbiAgICAgIHJldHVybiBtMS50b1VwcGVyQ2FzZSgpXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGRlY2FtZWxpemUocykge1xuICAgIHJldHVybiBzID8gcy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpIDogc1xuICB9XG5cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZnVuY3Rpb24gZGF0YShlbCkge1xuICAgIGVsW2dldEF0dHJpYnV0ZV0oJ2RhdGEtbm9kZS11aWQnKSB8fCBlbFtzZXRBdHRyaWJ1dGVdKCdkYXRhLW5vZGUtdWlkJywgKyt1dWlkcylcbiAgICB2YXIgdWlkID0gZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpXG4gICAgcmV0dXJuIHVpZE1hcFt1aWRdIHx8ICh1aWRNYXBbdWlkXSA9IHt9KVxuICB9XG5cblxuICAvKipcbiAgICogcmVtb3ZlcyB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYW4gZWxlbWVudFxuICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gICAqL1xuICBmdW5jdGlvbiBjbGVhckRhdGEoZWwpIHtcbiAgICB2YXIgdWlkID0gZWxbZ2V0QXR0cmlidXRlXSgnZGF0YS1ub2RlLXVpZCcpXG4gICAgaWYgKHVpZCkgZGVsZXRlIHVpZE1hcFt1aWRdXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGRhdGFWYWx1ZShkKSB7XG4gICAgdmFyIGZcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChkID09PSBudWxsIHx8IGQgPT09IHVuZGVmaW5lZCkgPyB1bmRlZmluZWQgOlxuICAgICAgICBkID09PSAndHJ1ZScgPyB0cnVlIDpcbiAgICAgICAgICBkID09PSAnZmFsc2UnID8gZmFsc2UgOlxuICAgICAgICAgICAgZCA9PT0gJ251bGwnID8gbnVsbCA6XG4gICAgICAgICAgICAgIChmID0gcGFyc2VGbG9hdChkKSkgPT0gZCA/IGYgOiBkO1xuICAgIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH1cblxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0JvbnpvfEFycmF5fSBhclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKE9iamVjdCwgbnVtYmVyLCAoQm9uem98QXJyYXkpKX0gZm5cbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfc2NvcGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciBgc29tZWB0aGluZyB3YXMgZm91bmRcbiAgICovXG4gIGZ1bmN0aW9uIHNvbWUoYXIsIGZuLCBvcHRfc2NvcGUpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGFyLmxlbmd0aDsgaSA8IGo7ICsraSkgaWYgKGZuLmNhbGwob3B0X3Njb3BlIHx8IG51bGwsIGFyW2ldLCBpLCBhcikpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuXG4gIC8qKlxuICAgKiB0aGlzIGNvdWxkIGJlIGEgZ2lhbnQgZW51bSBvZiBDU1MgcHJvcGVydGllc1xuICAgKiBidXQgaW4gZmF2b3Igb2YgZmlsZSBzaXplIHNhbnMtY2xvc3VyZSBkZWFkY29kZSBvcHRpbWl6YXRpb25zXG4gICAqIHdlJ3JlIGp1c3QgYXNraW5nIGZvciBhbnkgb2wgc3RyaW5nXG4gICAqIHRoZW4gaXQgZ2V0cyB0cmFuc2Zvcm1lZCBpbnRvIHRoZSBhcHByb3ByaWF0ZSBzdHlsZSBwcm9wZXJ0eSBmb3IgSlMgYWNjZXNzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHN0eWxlUHJvcGVydHkocCkge1xuICAgICAgKHAgPT0gJ3RyYW5zZm9ybScgJiYgKHAgPSBmZWF0dXJlcy50cmFuc2Zvcm0pKSB8fFxuICAgICAgICAoL150cmFuc2Zvcm0tP1tPb11yaWdpbiQvLnRlc3QocCkgJiYgKHAgPSBmZWF0dXJlcy50cmFuc2Zvcm0gKyAnT3JpZ2luJykpIHx8XG4gICAgICAgIChwID09ICdmbG9hdCcgJiYgKHAgPSBmZWF0dXJlcy5jc3NGbG9hdCkpXG4gICAgICByZXR1cm4gcCA/IGNhbWVsaXplKHApIDogbnVsbFxuICB9XG5cbiAgLy8gdGhpcyBpbnNlcnQgbWV0aG9kIGlzIGludGVuc2VcbiAgZnVuY3Rpb24gaW5zZXJ0KHRhcmdldCwgaG9zdCwgZm4sIHJldikge1xuICAgIHZhciBpID0gMCwgc2VsZiA9IGhvc3QgfHwgdGhpcywgciA9IFtdXG4gICAgICAvLyB0YXJnZXQgbm9kZXMgY291bGQgYmUgYSBjc3Mgc2VsZWN0b3IgaWYgaXQncyBhIHN0cmluZyBhbmQgYSBzZWxlY3RvciBlbmdpbmUgaXMgcHJlc2VudFxuICAgICAgLy8gb3RoZXJ3aXNlLCBqdXN0IHVzZSB0YXJnZXRcbiAgICAgICwgbm9kZXMgPSBxdWVyeSAmJiB0eXBlb2YgdGFyZ2V0ID09ICdzdHJpbmcnICYmIHRhcmdldC5jaGFyQXQoMCkgIT0gJzwnID8gcXVlcnkodGFyZ2V0KSA6IHRhcmdldFxuICAgIC8vIG5vcm1hbGl6ZSBlYWNoIG5vZGUgaW4gY2FzZSBpdCdzIHN0aWxsIGEgc3RyaW5nIGFuZCB3ZSBuZWVkIHRvIGNyZWF0ZSBub2RlcyBvbiB0aGUgZmx5XG4gICAgZWFjaChub3JtYWxpemUobm9kZXMpLCBmdW5jdGlvbiAodCwgaikge1xuICAgICAgZWFjaChzZWxmLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgZm4odCwgcltpKytdID0gaiA+IDAgPyBjbG9uZU5vZGUoc2VsZiwgZWwpIDogZWwpXG4gICAgICB9LCBudWxsLCByZXYpXG4gICAgfSwgdGhpcywgcmV2KVxuICAgIHNlbGYubGVuZ3RoID0gaVxuICAgIGVhY2gociwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHNlbGZbLS1pXSA9IGVcbiAgICB9LCBudWxsLCAhcmV2KVxuICAgIHJldHVybiBzZWxmXG4gIH1cblxuXG4gIC8qKlxuICAgKiBzZXRzIGFuIGVsZW1lbnQgdG8gYW4gZXhwbGljaXQgeC95IHBvc2l0aW9uIG9uIHRoZSBwYWdlXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHs/bnVtYmVyfSB4XG4gICAqIEBwYXJhbSB7P251bWJlcn0geVxuICAgKi9cbiAgZnVuY3Rpb24geHkoZWwsIHgsIHkpIHtcbiAgICB2YXIgJGVsID0gYm9uem8oZWwpXG4gICAgICAsIHN0eWxlID0gJGVsLmNzcygncG9zaXRpb24nKVxuICAgICAgLCBvZmZzZXQgPSAkZWwub2Zmc2V0KClcbiAgICAgICwgcmVsID0gJ3JlbGF0aXZlJ1xuICAgICAgLCBpc1JlbCA9IHN0eWxlID09IHJlbFxuICAgICAgLCBkZWx0YSA9IFtwYXJzZUludCgkZWwuY3NzKCdsZWZ0JyksIDEwKSwgcGFyc2VJbnQoJGVsLmNzcygndG9wJyksIDEwKV1cblxuICAgIGlmIChzdHlsZSA9PSAnc3RhdGljJykge1xuICAgICAgJGVsLmNzcygncG9zaXRpb24nLCByZWwpXG4gICAgICBzdHlsZSA9IHJlbFxuICAgIH1cblxuICAgIGlzTmFOKGRlbHRhWzBdKSAmJiAoZGVsdGFbMF0gPSBpc1JlbCA/IDAgOiBlbC5vZmZzZXRMZWZ0KVxuICAgIGlzTmFOKGRlbHRhWzFdKSAmJiAoZGVsdGFbMV0gPSBpc1JlbCA/IDAgOiBlbC5vZmZzZXRUb3ApXG5cbiAgICB4ICE9IG51bGwgJiYgKGVsLnN0eWxlLmxlZnQgPSB4IC0gb2Zmc2V0LmxlZnQgKyBkZWx0YVswXSArIHB4KVxuICAgIHkgIT0gbnVsbCAmJiAoZWwuc3R5bGUudG9wID0geSAtIG9mZnNldC50b3AgKyBkZWx0YVsxXSArIHB4KVxuXG4gIH1cblxuICAvLyBjbGFzc0xpc3Qgc3VwcG9ydCBmb3IgY2xhc3MgbWFuYWdlbWVudFxuICAvLyBhbHRobyB0byBiZSBmYWlyLCB0aGUgYXBpIHN1Y2tzIGJlY2F1c2UgaXQgd29uJ3QgYWNjZXB0IG11bHRpcGxlIGNsYXNzZXMgYXQgb25jZVxuICBpZiAoZmVhdHVyZXMuY2xhc3NMaXN0KSB7XG4gICAgaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoYylcbiAgICB9XG4gICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYylcbiAgICB9XG4gICAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoYylcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgaGFzQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIHJldHVybiBjbGFzc1JlZyhjKS50ZXN0KGVsLmNsYXNzTmFtZSlcbiAgICB9XG4gICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IHRyaW0oZWwuY2xhc3NOYW1lICsgJyAnICsgYylcbiAgICB9XG4gICAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGMpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSA9IHRyaW0oZWwuY2xhc3NOYW1lLnJlcGxhY2UoY2xhc3NSZWcoYyksICcgJykpXG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogdGhpcyBhbGxvd3MgbWV0aG9kIGNhbGxpbmcgZm9yIHNldHRpbmcgdmFsdWVzXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGJvbnpvKGVsZW1lbnRzKS5jc3MoJ2NvbG9yJywgZnVuY3Rpb24gKGVsKSB7XG4gICAqICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1vcmlnaW5hbC1jb2xvcicpXG4gICAqIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAgICogQHBhcmFtIHtmdW5jdGlvbiAoRWxlbWVudCl8c3RyaW5nfVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzZXR0ZXIoZWwsIHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT0gJ2Z1bmN0aW9uJyA/IHYoZWwpIDogdlxuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsKHgsIHksIHR5cGUpIHtcbiAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgaWYgKCFlbCkgcmV0dXJuIHRoaXNcbiAgICBpZiAoeCA9PSBudWxsICYmIHkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIChpc0JvZHkoZWwpID8gZ2V0V2luZG93U2Nyb2xsKCkgOiB7IHg6IGVsLnNjcm9sbExlZnQsIHk6IGVsLnNjcm9sbFRvcCB9KVt0eXBlXVxuICAgIH1cbiAgICBpZiAoaXNCb2R5KGVsKSkge1xuICAgICAgd2luLnNjcm9sbFRvKHgsIHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHggIT0gbnVsbCAmJiAoZWwuc2Nyb2xsTGVmdCA9IHgpXG4gICAgICB5ICE9IG51bGwgJiYgKGVsLnNjcm9sbFRvcCA9IHkpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7QXJyYXkuPEVsZW1lbnQ+fEVsZW1lbnR8Tm9kZXxzdHJpbmd9IGVsZW1lbnRzXG4gICAqL1xuICBmdW5jdGlvbiBCb256byhlbGVtZW50cykge1xuICAgIHRoaXMubGVuZ3RoID0gMFxuICAgIGlmIChlbGVtZW50cykge1xuICAgICAgZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMgIT09ICdzdHJpbmcnICYmXG4gICAgICAgICFlbGVtZW50cy5ub2RlVHlwZSAmJlxuICAgICAgICB0eXBlb2YgZWxlbWVudHMubGVuZ3RoICE9PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgZWxlbWVudHMgOlxuICAgICAgICAgIFtlbGVtZW50c11cbiAgICAgIHRoaXMubGVuZ3RoID0gZWxlbWVudHMubGVuZ3RoXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB0aGlzW2ldID0gZWxlbWVudHNbaV1cbiAgICB9XG4gIH1cblxuICBCb256by5wcm90b3R5cGUgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAgIGdldDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzW2luZGV4XSB8fCBudWxsXG4gICAgICB9XG5cbiAgICAgIC8vIGl0ZXRhdG9yc1xuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKEVsZW1lbnR8Tm9kZSl9IGZuXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9zY29wZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGVhY2g6IGZ1bmN0aW9uIChmbiwgb3B0X3Njb3BlKSB7XG4gICAgICAgIHJldHVybiBlYWNoKHRoaXMsIGZuLCBvcHRfc2NvcGUpXG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0PX0gb3B0X3Njb3BlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZGVlcEVhY2g6IGZ1bmN0aW9uIChmbiwgb3B0X3Njb3BlKSB7XG4gICAgICAgIHJldHVybiBkZWVwRWFjaCh0aGlzLCBmbiwgb3B0X3Njb3BlKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfcmVqZWN0XG4gICAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgICAqL1xuICAgICwgbWFwOiBmdW5jdGlvbiAoZm4sIG9wdF9yZWplY3QpIHtcbiAgICAgICAgdmFyIG0gPSBbXSwgbiwgaVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIG4gPSBmbi5jYWxsKHRoaXMsIHRoaXNbaV0sIGkpXG4gICAgICAgICAgb3B0X3JlamVjdCA/IChvcHRfcmVqZWN0KG4pICYmIG0ucHVzaChuKSkgOiBtLnB1c2gobilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbVxuICAgICAgfVxuXG4gICAgLy8gdGV4dCBhbmQgaHRtbCBpbnNlcnRlcnMhXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaCB0aGUgSFRNTCB0byBpbnNlcnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfdGV4dCB3aGV0aGVyIHRvIHNldCBvciBnZXQgdGV4dCBjb250ZW50XG4gICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAqL1xuICAgICwgaHRtbDogZnVuY3Rpb24gKGgsIG9wdF90ZXh0KSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvcHRfdGV4dFxuICAgICAgICAgICAgICA/IGh0bWwudGV4dENvbnRlbnQgPT09IHVuZGVmaW5lZCA/ICdpbm5lclRleHQnIDogJ3RleHRDb250ZW50J1xuICAgICAgICAgICAgICA6ICdpbm5lckhUTUwnXG4gICAgICAgICAgLCB0aGF0ID0gdGhpc1xuICAgICAgICAgICwgYXBwZW5kID0gZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICAgIGVhY2gobm9ybWFsaXplKGgsIHRoYXQsIGkpLCBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgLCB1cGRhdGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdF90ZXh0IHx8ICh0eXBlb2YgaCA9PSAnc3RyaW5nJyAmJiAhc3BlY2lhbFRhZ3MudGVzdChlbC50YWdOYW1lKSkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBlbFttZXRob2RdID0gaFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAgICAgYXBwZW5kKGVsLCBpKVxuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZW9mIGggIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICA/IHRoaXMuZW1wdHkoKS5lYWNoKHVwZGF0ZUVsZW1lbnQpXG4gICAgICAgICAgOiB0aGlzWzBdID8gdGhpc1swXVttZXRob2RdIDogJydcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90ZXh0IHRoZSB0ZXh0IHRvIHNldCwgb3RoZXJ3aXNlIHRoaXMgaXMgYSBnZXR0ZXJcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgdGV4dDogZnVuY3Rpb24gKG9wdF90ZXh0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmh0bWwob3B0X3RleHQsIHRydWUpXG4gICAgICB9XG5cbiAgICAgIC8vIG1vcmUgcmVsYXRlZCBpbnNlcnRpb24gbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhcHBlbmQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIGVhY2gobm9ybWFsaXplKG5vZGUsIHRoYXQsIGkpLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoaSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHByZXBlbmQ6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCwgaSkge1xuICAgICAgICAgIHZhciBmaXJzdCA9IGVsLmZpcnN0Q2hpbGRcbiAgICAgICAgICBlYWNoKG5vcm1hbGl6ZShub2RlLCB0aGF0LCBpKSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIGVsLmluc2VydEJlZm9yZShpLCBmaXJzdClcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gdGFyZ2V0IHRoZSBsb2NhdGlvbiBmb3Igd2hpY2ggeW91J2xsIGluc2VydCB5b3VyIG5ldyBjb250ZW50XG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGFwcGVuZFRvOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRfaG9zdCkge1xuICAgICAgICByZXR1cm4gaW5zZXJ0LmNhbGwodGhpcywgdGFyZ2V0LCBvcHRfaG9zdCwgZnVuY3Rpb24gKHQsIGVsKSB7XG4gICAgICAgICAgdC5hcHBlbmRDaGlsZChlbClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBwcmVwZW5kVG86IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0Lmluc2VydEJlZm9yZShlbCwgdC5maXJzdENoaWxkKVxuICAgICAgICB9LCAxKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtCb256b3xzdHJpbmd8RWxlbWVudHxBcnJheX0gbm9kZVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGJlZm9yZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoaSwgZWwpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IG5vZGVcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhZnRlcjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgZWFjaChub3JtYWxpemUobm9kZSwgdGhhdCwgaSksIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICBlbFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoaSwgZWwubmV4dFNpYmxpbmcpXG4gICAgICAgICAgfSwgbnVsbCwgMSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uICh0YXJnZXQsIG9wdF9ob3N0KSB7XG4gICAgICAgIHJldHVybiBpbnNlcnQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdF9ob3N0LCBmdW5jdGlvbiAodCwgZWwpIHtcbiAgICAgICAgICB0W3BhcmVudE5vZGVdLmluc2VydEJlZm9yZShlbCwgdClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7Qm9uem98c3RyaW5nfEVsZW1lbnR8QXJyYXl9IHRhcmdldCB0aGUgbG9jYXRpb24gZm9yIHdoaWNoIHlvdSdsbCBpbnNlcnQgeW91ciBuZXcgY29udGVudFxuICAgICAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRfaG9zdCBhbiBvcHRpb25hbCBob3N0IHNjb3BlIChwcmltYXJpbHkgdXNlZCB3aGVuIGludGVncmF0ZWQgd2l0aCBFbmRlcilcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKHRhcmdldCwgb3B0X2hvc3QpIHtcbiAgICAgICAgcmV0dXJuIGluc2VydC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0X2hvc3QsIGZ1bmN0aW9uICh0LCBlbCkge1xuICAgICAgICAgIHZhciBzaWJsaW5nID0gdC5uZXh0U2libGluZ1xuICAgICAgICAgIHNpYmxpbmcgP1xuICAgICAgICAgICAgdFtwYXJlbnROb2RlXS5pbnNlcnRCZWZvcmUoZWwsIHNpYmxpbmcpIDpcbiAgICAgICAgICAgIHRbcGFyZW50Tm9kZV0uYXBwZW5kQ2hpbGQoZWwpXG4gICAgICAgIH0sIDEpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0JvbnpvfHN0cmluZ3xFbGVtZW50fEFycmF5fSBub2RlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgcmVwbGFjZVdpdGg6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGJvbnpvKG5vcm1hbGl6ZShub2RlKSkuaW5zZXJ0QWZ0ZXIodGhpcylcbiAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKClcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF9ob3N0IGFuIG9wdGlvbmFsIGhvc3Qgc2NvcGUgKHByaW1hcmlseSB1c2VkIHdoZW4gaW50ZWdyYXRlZCB3aXRoIEVuZGVyKVxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGNsb25lOiBmdW5jdGlvbiAob3B0X2hvc3QpIHtcbiAgICAgICAgdmFyIHJldCA9IFtdIC8vIGRvbid0IGNoYW5nZSBvcmlnaW5hbCBhcnJheVxuICAgICAgICAgICwgbCwgaVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHJldFtpXSA9IGNsb25lTm9kZShvcHRfaG9zdCB8fCB0aGlzLCB0aGlzW2ldKVxuICAgICAgICByZXR1cm4gYm9uem8ocmV0KVxuICAgICAgfVxuXG4gICAgICAvLyBjbGFzcyBtYW5hZ2VtZW50XG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCBhZGRDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIC8vIHdlIGBlYWNoYCBoZXJlIHNvIHlvdSBjYW4gZG8gJGVsLmFkZENsYXNzKCdmb28gYmFyJylcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYyAmJiAhaGFzQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpKVxuICAgICAgICAgICAgICBhZGRDbGFzcyhlbCwgc2V0dGVyKGVsLCBjKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmVDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVhY2goYywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIGlmIChjICYmIGhhc0NsYXNzKGVsLCBzZXR0ZXIoZWwsIGMpKSlcbiAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIHNldHRlcihlbCwgYykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICovXG4gICAgLCBoYXNDbGFzczogZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgYyA9IHRvU3RyaW5nLmNhbGwoYykuc3BsaXQod2hpdGVzcGFjZVJlZ2V4KVxuICAgICAgICByZXR1cm4gc29tZSh0aGlzLCBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICByZXR1cm4gc29tZShjLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgcmV0dXJuIGMgJiYgaGFzQ2xhc3MoZWwsIGMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjIGNsYXNzbmFtZSB0byB0b2dnbGVcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IG9wdF9jb25kaXRpb24gd2hldGhlciB0byBhZGQgb3IgcmVtb3ZlIHRoZSBjbGFzcyBzdHJhaWdodCBhd2F5XG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uIChjLCBvcHRfY29uZGl0aW9uKSB7XG4gICAgICAgIGMgPSB0b1N0cmluZy5jYWxsKGMpLnNwbGl0KHdoaXRlc3BhY2VSZWdleClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlYWNoKGMsIGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICB0eXBlb2Ygb3B0X2NvbmRpdGlvbiAhPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgICAgICAgIG9wdF9jb25kaXRpb24gPyAhaGFzQ2xhc3MoZWwsIGMpICYmIGFkZENsYXNzKGVsLCBjKSA6IHJlbW92ZUNsYXNzKGVsLCBjKSA6XG4gICAgICAgICAgICAgICAgaGFzQ2xhc3MoZWwsIGMpID8gcmVtb3ZlQ2xhc3MoZWwsIGMpIDogYWRkQ2xhc3MoZWwsIGMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gZGlzcGxheSB0b2dnbGVyc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3R5cGUgdXNlZnVsIHRvIHNldCBiYWNrIHRvIGFueXRoaW5nIG90aGVyIHRoYW4gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgc2hvdzogZnVuY3Rpb24gKG9wdF90eXBlKSB7XG4gICAgICAgIG9wdF90eXBlID0gdHlwZW9mIG9wdF90eXBlID09ICdzdHJpbmcnID8gb3B0X3R5cGUgOiAnJ1xuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBvcHRfdHlwZVxuICAgICAgICB9KVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGhpZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X2NhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZz19IG9wdF90eXBlXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgdG9nZ2xlOiBmdW5jdGlvbiAob3B0X2NhbGxiYWNrLCBvcHRfdHlwZSkge1xuICAgICAgICBvcHRfdHlwZSA9IHR5cGVvZiBvcHRfdHlwZSA9PSAnc3RyaW5nJyA/IG9wdF90eXBlIDogJyc7XG4gICAgICAgIHR5cGVvZiBvcHRfY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiAob3B0X2NhbGxiYWNrID0gbnVsbClcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gKGVsLm9mZnNldFdpZHRoIHx8IGVsLm9mZnNldEhlaWdodCkgPyAnbm9uZScgOiBvcHRfdHlwZTtcbiAgICAgICAgICBvcHRfY2FsbGJhY2sgJiYgb3B0X2NhbGxiYWNrLmNhbGwoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLy8gRE9NIFdhbGtlcnMgJiBnZXR0ZXJzXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBmaXJzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYm9uem8odGhpcy5sZW5ndGggPyB0aGlzWzBdIDogW10pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGJvbnpvKHRoaXMubGVuZ3RoID8gdGhpc1t0aGlzLmxlbmd0aCAtIDFdIDogW10pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtFbGVtZW50fE5vZGV9XG4gICAgICAgKi9cbiAgICAsIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVsYXRlZCgnbmV4dFNpYmxpbmcnKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBwcmV2aW91czogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKCdwcmV2aW91c1NpYmxpbmcnKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCBwYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGVkKHBhcmVudE5vZGUpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCB0aGUgZGlyZWN0aW9uYWwgRE9NIG1ldGhvZFxuICAgICAgICogQHJldHVybiB7RWxlbWVudHxOb2RlfVxuICAgICAgICovXG4gICAgLCByZWxhdGVkOiBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBib256byh0aGlzLm1hcChcbiAgICAgICAgICBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIGVsID0gZWxbbWV0aG9kXVxuICAgICAgICAgICAgd2hpbGUgKGVsICYmIGVsLm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgICAgICAgIGVsID0gZWxbbWV0aG9kXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsIHx8IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgfVxuICAgICAgICApKVxuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGZvY3VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoICYmIHRoaXNbMF0uZm9jdXMoKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuXG5cbiAgICAgIC8qKlxuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIGJsdXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggJiYgdGhpc1swXS5ibHVyKClcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cblxuICAgICAgLy8gc3R5bGUgZ2V0dGVyIHNldHRlciAmIHJlbGF0ZWQgbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gb1xuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdlxuICAgICAgICogQHJldHVybiB7Qm9uem98c3RyaW5nfVxuICAgICAgICovXG4gICAgLCBjc3M6IGZ1bmN0aW9uIChvLCBvcHRfdikge1xuICAgICAgICB2YXIgcCwgaXRlciA9IG9cbiAgICAgICAgLy8gaXMgdGhpcyBhIHJlcXVlc3QgZm9yIGp1c3QgZ2V0dGluZyBhIHN0eWxlP1xuICAgICAgICBpZiAob3B0X3YgPT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgbyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIHJlcHVycG9zZSAndidcbiAgICAgICAgICBvcHRfdiA9IHRoaXNbMF1cbiAgICAgICAgICBpZiAoIW9wdF92KSByZXR1cm4gbnVsbFxuICAgICAgICAgIGlmIChvcHRfdiA9PT0gZG9jIHx8IG9wdF92ID09PSB3aW4pIHtcbiAgICAgICAgICAgIHAgPSAob3B0X3YgPT09IGRvYykgPyBib256by5kb2MoKSA6IGJvbnpvLnZpZXdwb3J0KClcbiAgICAgICAgICAgIHJldHVybiBvID09ICd3aWR0aCcgPyBwLndpZHRoIDogbyA9PSAnaGVpZ2h0JyA/IHAuaGVpZ2h0IDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIChvID0gc3R5bGVQcm9wZXJ0eShvKSkgPyBnZXRTdHlsZShvcHRfdiwgbykgOiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG8gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpdGVyID0ge31cbiAgICAgICAgICBpdGVyW29dID0gb3B0X3ZcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZmVhdHVyZXMub3Bhc2l0eSAmJiAnb3BhY2l0eScgaW4gaXRlcikge1xuICAgICAgICAgIC8vIG9oIHRoaXMgJ29sIGdhbXV0XG4gICAgICAgICAgaXRlci5maWx0ZXIgPSBpdGVyLm9wYWNpdHkgIT0gbnVsbCAmJiBpdGVyLm9wYWNpdHkgIT09ICcnXG4gICAgICAgICAgICA/ICdhbHBoYShvcGFjaXR5PScgKyAoaXRlci5vcGFjaXR5ICogMTAwKSArICcpJ1xuICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgIC8vIGdpdmUgaXQgbGF5b3V0XG4gICAgICAgICAgaXRlci56b29tID0gby56b29tIHx8IDFcbiAgICAgICAgICA7ZGVsZXRlIGl0ZXIub3BhY2l0eVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZm4oZWwsIHAsIHYpIHtcbiAgICAgICAgICBmb3IgKHZhciBrIGluIGl0ZXIpIHtcbiAgICAgICAgICAgIGlmIChpdGVyLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICAgIHYgPSBpdGVyW2tdO1xuICAgICAgICAgICAgICAvLyBjaGFuZ2UgXCI1XCIgdG8gXCI1cHhcIiAtIHVubGVzcyB5b3UncmUgbGluZS1oZWlnaHQsIHdoaWNoIGlzIGFsbG93ZWRcbiAgICAgICAgICAgICAgKHAgPSBzdHlsZVByb3BlcnR5KGspKSAmJiBkaWdpdC50ZXN0KHYpICYmICEocCBpbiB1bml0bGVzcykgJiYgKHYgKz0gcHgpXG4gICAgICAgICAgICAgIHRyeSB7IGVsLnN0eWxlW3BdID0gc2V0dGVyKGVsLCB2KSB9IGNhdGNoKGUpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZm4pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcj19IG9wdF94XG4gICAgICAgKiBAcGFyYW0ge251bWJlcj19IG9wdF95XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xudW1iZXJ9XG4gICAgICAgKi9cbiAgICAsIG9mZnNldDogZnVuY3Rpb24gKG9wdF94LCBvcHRfeSkge1xuICAgICAgICBpZiAob3B0X3ggJiYgdHlwZW9mIG9wdF94ID09ICdvYmplY3QnICYmICh0eXBlb2Ygb3B0X3gudG9wID09ICdudW1iZXInIHx8IHR5cGVvZiBvcHRfeC5sZWZ0ID09ICdudW1iZXInKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB4eShlbCwgb3B0X3gubGVmdCwgb3B0X3gudG9wKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdF94ID09ICdudW1iZXInIHx8IHR5cGVvZiBvcHRfeSA9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgICB4eShlbCwgb3B0X3gsIG9wdF95KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzWzBdKSByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAwXG4gICAgICAgICAgLCBsZWZ0OiAwXG4gICAgICAgICAgLCBoZWlnaHQ6IDBcbiAgICAgICAgICAsIHdpZHRoOiAwXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgZGUgPSBlbC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuICAgICAgICAgICwgYmNyID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgICAgICAsIHNjcm9sbCA9IGdldFdpbmRvd1Njcm9sbCgpXG4gICAgICAgICAgLCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoXG4gICAgICAgICAgLCBoZWlnaHQgPSBlbC5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAsIHRvcCA9IGJjci50b3AgKyBzY3JvbGwueSAtIE1hdGgubWF4KDAsIGRlICYmIGRlLmNsaWVudFRvcCwgZG9jLmJvZHkuY2xpZW50VG9wKVxuICAgICAgICAgICwgbGVmdCA9IGJjci5sZWZ0ICsgc2Nyb2xsLnggLSBNYXRoLm1heCgwLCBkZSAmJiBkZS5jbGllbnRMZWZ0LCBkb2MuYm9keS5jbGllbnRMZWZ0KVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0b3A6IHRvcFxuICAgICAgICAgICwgbGVmdDogbGVmdFxuICAgICAgICAgICwgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICAsIHdpZHRoOiB3aWR0aFxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICAgKi9cbiAgICAsIGRpbTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm4geyBoZWlnaHQ6IDAsIHdpZHRoOiAwIH1cbiAgICAgICAgdmFyIGVsID0gdGhpc1swXVxuICAgICAgICAgICwgZGUgPSBlbC5ub2RlVHlwZSA9PSA5ICYmIGVsLmRvY3VtZW50RWxlbWVudCAvLyBkb2N1bWVudFxuICAgICAgICAgICwgb3JpZyA9ICFkZSAmJiAhIWVsLnN0eWxlICYmICFlbC5vZmZzZXRXaWR0aCAmJiAhZWwub2Zmc2V0SGVpZ2h0ID9cbiAgICAgICAgICAgICAvLyBlbCBpc24ndCB2aXNpYmxlLCBjYW4ndCBiZSBtZWFzdXJlZCBwcm9wZXJseSwgc28gZml4IHRoYXRcbiAgICAgICAgICAgICBmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgdmFyIHMgPSB7XG4gICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGVsLnN0eWxlLnBvc2l0aW9uIHx8ICcnXG4gICAgICAgICAgICAgICAgICwgdmlzaWJpbGl0eTogZWwuc3R5bGUudmlzaWJpbGl0eSB8fCAnJ1xuICAgICAgICAgICAgICAgICAsIGRpc3BsYXk6IGVsLnN0eWxlLmRpc3BsYXkgfHwgJydcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIHQuZmlyc3QoKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICAgICAgICwgdmlzaWJpbGl0eTogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICAgLCBkaXNwbGF5OiAnYmxvY2snXG4gICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgcmV0dXJuIHNcbiAgICAgICAgICAgIH0odGhpcykgOiBudWxsXG4gICAgICAgICAgLCB3aWR0aCA9IGRlXG4gICAgICAgICAgICAgID8gTWF0aC5tYXgoZWwuYm9keS5zY3JvbGxXaWR0aCwgZWwuYm9keS5vZmZzZXRXaWR0aCwgZGUuc2Nyb2xsV2lkdGgsIGRlLm9mZnNldFdpZHRoLCBkZS5jbGllbnRXaWR0aClcbiAgICAgICAgICAgICAgOiBlbC5vZmZzZXRXaWR0aFxuICAgICAgICAgICwgaGVpZ2h0ID0gZGVcbiAgICAgICAgICAgICAgPyBNYXRoLm1heChlbC5ib2R5LnNjcm9sbEhlaWdodCwgZWwuYm9keS5vZmZzZXRIZWlnaHQsIGRlLnNjcm9sbEhlaWdodCwgZGUub2Zmc2V0SGVpZ2h0LCBkZS5jbGllbnRIZWlnaHQpXG4gICAgICAgICAgICAgIDogZWwub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgb3JpZyAmJiB0aGlzLmZpcnN0KCkuY3NzKG9yaWcpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodFxuICAgICAgICAgICwgd2lkdGg6IHdpZHRoXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXR0cmlidXRlcyBhcmUgaGFyZC4gZ28gc2hvcHBpbmdcblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gayBhbiBhdHRyaWJ1dGUgdG8gZ2V0IG9yIHNldFxuICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfdiB0aGUgdmFsdWUgdG8gc2V0XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xzdHJpbmd9XG4gICAgICAgKi9cbiAgICAsIGF0dHI6IGZ1bmN0aW9uIChrLCBvcHRfdikge1xuICAgICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICAgICAgLCBuXG5cbiAgICAgICAgaWYgKHR5cGVvZiBrICE9ICdzdHJpbmcnICYmICEoayBpbnN0YW5jZW9mIFN0cmluZykpIHtcbiAgICAgICAgICBmb3IgKG4gaW4gaykge1xuICAgICAgICAgICAgay5oYXNPd25Qcm9wZXJ0eShuKSAmJiB0aGlzLmF0dHIobiwga1tuXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb3B0X3YgPT0gJ3VuZGVmaW5lZCcgP1xuICAgICAgICAgICFlbCA/IG51bGwgOiBzcGVjaWFsQXR0cmlidXRlcy50ZXN0KGspID9cbiAgICAgICAgICAgIHN0YXRlQXR0cmlidXRlcy50ZXN0KGspICYmIHR5cGVvZiBlbFtrXSA9PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgIHRydWUgOiBlbFtrXSA6IChrID09ICdocmVmJyB8fCBrID09J3NyYycpICYmIGZlYXR1cmVzLmhyZWZFeHRlbmRlZCA/XG4gICAgICAgICAgICAgICAgZWxbZ2V0QXR0cmlidXRlXShrLCAyKSA6IGVsW2dldEF0dHJpYnV0ZV0oaykgOlxuICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHNwZWNpYWxBdHRyaWJ1dGVzLnRlc3QoaykgPyAoZWxba10gPSBzZXR0ZXIoZWwsIG9wdF92KSkgOiBlbFtzZXRBdHRyaWJ1dGVdKGssIHNldHRlcihlbCwgb3B0X3YpKVxuICAgICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga1xuICAgICAgICogQHJldHVybiB7Qm9uem99XG4gICAgICAgKi9cbiAgICAsIHJlbW92ZUF0dHI6IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgc3RhdGVBdHRyaWJ1dGVzLnRlc3QoaykgPyAoZWxba10gPSBmYWxzZSkgOiBlbC5yZW1vdmVBdHRyaWJ1dGUoaylcbiAgICAgICAgfSlcbiAgICAgIH1cblxuXG4gICAgICAvKipcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X3NcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfHN0cmluZ31cbiAgICAgICAqL1xuICAgICwgdmFsOiBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBzID09ICdzdHJpbmcnIHx8IHR5cGVvZiBzID09ICdudW1iZXInKSA/XG4gICAgICAgICAgdGhpcy5hdHRyKCd2YWx1ZScsIHMpIDpcbiAgICAgICAgICB0aGlzLmxlbmd0aCA/IHRoaXNbMF0udmFsdWUgOiBudWxsXG4gICAgICB9XG5cbiAgICAgIC8vIHVzZSB3aXRoIGNhcmUgYW5kIGtub3dsZWRnZS4gdGhpcyBkYXRhKCkgbWV0aG9kIHVzZXMgZGF0YSBhdHRyaWJ1dGVzIG9uIHRoZSBET00gbm9kZXNcbiAgICAgIC8vIHRvIGRvIHRoaXMgZGlmZmVyZW50bHkgY29zdHMgYSBsb3QgbW9yZSBjb2RlLiBjJ2VzdCBsYSB2aWVcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd8T2JqZWN0PX0gb3B0X2sgdGhlIGtleSBmb3Igd2hpY2ggdG8gZ2V0IG9yIHNldCBkYXRhXG4gICAgICAgKiBAcGFyYW0ge09iamVjdD19IG9wdF92XG4gICAgICAgKiBAcmV0dXJuIHtCb256b3xPYmplY3R9XG4gICAgICAgKi9cbiAgICAsIGRhdGE6IGZ1bmN0aW9uIChvcHRfaywgb3B0X3YpIHtcbiAgICAgICAgdmFyIGVsID0gdGhpc1swXSwgbywgbVxuICAgICAgICBpZiAodHlwZW9mIG9wdF92ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGlmICghZWwpIHJldHVybiBudWxsXG4gICAgICAgICAgbyA9IGRhdGEoZWwpXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRfayA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVhY2goZWwuYXR0cmlidXRlcywgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgKG0gPSAoJycgKyBhLm5hbWUpLm1hdGNoKGRhdHRyKSkgJiYgKG9bY2FtZWxpemUobVsxXSldID0gZGF0YVZhbHVlKGEudmFsdWUpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBvXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb1tvcHRfa10gPT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICBvW29wdF9rXSA9IGRhdGFWYWx1ZSh0aGlzLmF0dHIoJ2RhdGEtJyArIGRlY2FtZWxpemUob3B0X2spKSlcbiAgICAgICAgICAgIHJldHVybiBvW29wdF9rXVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uIChlbCkgeyBkYXRhKGVsKVtvcHRfa10gPSBvcHRfdiB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIERPTSBkZXRhY2htZW50ICYgcmVsYXRlZFxuXG4gICAgICAvKipcbiAgICAgICAqIEByZXR1cm4ge0JvbnpvfVxuICAgICAgICovXG4gICAgLCByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kZWVwRWFjaChjbGVhckRhdGEpXG4gICAgICAgIHJldHVybiB0aGlzLmRldGFjaCgpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICBkZWVwRWFjaChlbC5jaGlsZE5vZGVzLCBjbGVhckRhdGEpXG5cbiAgICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcmV0dXJuIHtCb256b31cbiAgICAgICAqL1xuICAgICwgZGV0YWNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWxbcGFyZW50Tm9kZV0gJiYgZWxbcGFyZW50Tm9kZV0ucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIHdobyB1c2VzIGEgbW91c2UgYW55d2F5PyBvaCByaWdodC5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAgICovXG4gICAgLCBzY3JvbGxUb3A6IGZ1bmN0aW9uICh5KSB7XG4gICAgICAgIHJldHVybiBzY3JvbGwuY2FsbCh0aGlzLCBudWxsLCB5LCAneScpXG4gICAgICB9XG5cblxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAgICovXG4gICAgLCBzY3JvbGxMZWZ0OiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gc2Nyb2xsLmNhbGwodGhpcywgeCwgbnVsbCwgJ3gnKVxuICAgICAgfVxuXG4gIH1cblxuXG4gIGZ1bmN0aW9uIGNsb25lTm9kZShob3N0LCBlbCkge1xuICAgIHZhciBjID0gZWwuY2xvbmVOb2RlKHRydWUpXG4gICAgICAsIGNsb25lRWxlbXNcbiAgICAgICwgZWxFbGVtc1xuICAgICAgLCBpXG5cbiAgICAvLyBjaGVjayBmb3IgZXhpc3RlbmNlIG9mIGFuIGV2ZW50IGNsb25lclxuICAgIC8vIHByZWZlcmFibHkgaHR0cHM6Ly9naXRodWIuY29tL2ZhdC9iZWFuXG4gICAgLy8gb3RoZXJ3aXNlIEJvbnpvIHdvbid0IGRvIHRoaXMgZm9yIHlvdVxuICAgIGlmIChob3N0LiQgJiYgdHlwZW9mIGhvc3QuY2xvbmVFdmVudHMgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaG9zdC4kKGMpLmNsb25lRXZlbnRzKGVsKVxuXG4gICAgICAvLyBjbG9uZSBldmVudHMgZnJvbSBldmVyeSBjaGlsZCBub2RlXG4gICAgICBjbG9uZUVsZW1zID0gaG9zdC4kKGMpLmZpbmQoJyonKVxuICAgICAgZWxFbGVtcyA9IGhvc3QuJChlbCkuZmluZCgnKicpXG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbEVsZW1zLmxlbmd0aDsgaSsrKVxuICAgICAgICBob3N0LiQoY2xvbmVFbGVtc1tpXSkuY2xvbmVFdmVudHMoZWxFbGVtc1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQm9keShlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQgPT09IHdpbiB8fCAoL14oPzpib2R5fGh0bWwpJC9pKS50ZXN0KGVsZW1lbnQudGFnTmFtZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFdpbmRvd1Njcm9sbCgpIHtcbiAgICByZXR1cm4geyB4OiB3aW4ucGFnZVhPZmZzZXQgfHwgaHRtbC5zY3JvbGxMZWZ0LCB5OiB3aW4ucGFnZVlPZmZzZXQgfHwgaHRtbC5zY3JvbGxUb3AgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlU2NyaXB0RnJvbUh0bWwoaHRtbCkge1xuICAgIHZhciBzY3JpcHRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgICAsIG1hdGNoZXMgPSBodG1sLm1hdGNoKHNpbXBsZVNjcmlwdFRhZ1JlKVxuICAgIHNjcmlwdEVsLnNyYyA9IG1hdGNoZXNbMV1cbiAgICByZXR1cm4gc2NyaXB0RWxcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5LjxFbGVtZW50PnxFbGVtZW50fE5vZGV8c3RyaW5nfSBlbHNcbiAgICogQHJldHVybiB7Qm9uem99XG4gICAqL1xuICBmdW5jdGlvbiBib256byhlbHMpIHtcbiAgICByZXR1cm4gbmV3IEJvbnpvKGVscylcbiAgfVxuXG4gIGJvbnpvLnNldFF1ZXJ5RW5naW5lID0gZnVuY3Rpb24gKHEpIHtcbiAgICBxdWVyeSA9IHE7XG4gICAgZGVsZXRlIGJvbnpvLnNldFF1ZXJ5RW5naW5lXG4gIH1cblxuICBib256by5hdWcgPSBmdW5jdGlvbiAobywgdGFyZ2V0KSB7XG4gICAgLy8gZm9yIHRob3NlIHN0YW5kYWxvbmUgYm9uem8gdXNlcnMuIHRoaXMgbG92ZSBpcyBmb3IgeW91LlxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgby5oYXNPd25Qcm9wZXJ0eShrKSAmJiAoKHRhcmdldCB8fCBCb256by5wcm90b3R5cGUpW2tdID0gb1trXSlcbiAgICB9XG4gIH1cblxuICBib256by5jcmVhdGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIC8vIGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoXG4gICAgcmV0dXJuIHR5cGVvZiBub2RlID09ICdzdHJpbmcnICYmIG5vZGUgIT09ICcnID9cbiAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHNpbXBsZVNjcmlwdFRhZ1JlLnRlc3Qobm9kZSkpIHJldHVybiBbY3JlYXRlU2NyaXB0RnJvbUh0bWwobm9kZSldXG4gICAgICAgIHZhciB0YWcgPSBub2RlLm1hdGNoKC9eXFxzKjwoW15cXHM+XSspLylcbiAgICAgICAgICAsIGVsID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgLCBlbHMgPSBbXVxuICAgICAgICAgICwgcCA9IHRhZyA/IHRhZ01hcFt0YWdbMV0udG9Mb3dlckNhc2UoKV0gOiBudWxsXG4gICAgICAgICAgLCBkZXAgPSBwID8gcFsyXSArIDEgOiAxXG4gICAgICAgICAgLCBucyA9IHAgJiYgcFszXVxuICAgICAgICAgICwgcG4gPSBwYXJlbnROb2RlXG4gICAgICAgICAgLCB0YiA9IGZlYXR1cmVzLmF1dG9UYm9keSAmJiBwICYmIHBbMF0gPT0gJzx0YWJsZT4nICYmICEoLzx0Ym9keS9pKS50ZXN0KG5vZGUpXG5cbiAgICAgICAgZWwuaW5uZXJIVE1MID0gcCA/IChwWzBdICsgbm9kZSArIHBbMV0pIDogbm9kZVxuICAgICAgICB3aGlsZSAoZGVwLS0pIGVsID0gZWwuZmlyc3RDaGlsZFxuICAgICAgICAvLyBmb3IgSUUgTm9TY29wZSwgd2UgbWF5IGluc2VydCBjcnVmdCBhdCB0aGUgYmVnaW5pbmcganVzdCB0byBnZXQgaXQgdG8gd29ya1xuICAgICAgICBpZiAobnMgJiYgZWwgJiYgZWwubm9kZVR5cGUgIT09IDEpIGVsID0gZWwubmV4dFNpYmxpbmdcbiAgICAgICAgZG8ge1xuICAgICAgICAgIC8vIHRib2R5IHNwZWNpYWwgY2FzZSBmb3IgSUU8OCwgY3JlYXRlcyB0Ym9keSBvbiBhbnkgZW1wdHkgdGFibGVcbiAgICAgICAgICAvLyB3ZSBkb24ndCB3YW50IGl0IGlmIHdlJ3JlIGp1c3QgYWZ0ZXIgYSA8dGhlYWQ+LCA8Y2FwdGlvbj4sIGV0Yy5cbiAgICAgICAgICBpZiAoKCF0YWcgfHwgZWwubm9kZVR5cGUgPT0gMSkgJiYgKCF0YiB8fCAoZWwudGFnTmFtZSAmJiBlbC50YWdOYW1lICE9ICdUQk9EWScpKSkge1xuICAgICAgICAgICAgZWxzLnB1c2goZWwpXG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChlbCA9IGVsLm5leHRTaWJsaW5nKVxuICAgICAgICAvLyBJRSA8IDkgZ2l2ZXMgdXMgYSBwYXJlbnROb2RlIHdoaWNoIG1lc3NlcyB1cCBpbnNlcnQoKSBjaGVjayBmb3IgY2xvbmluZ1xuICAgICAgICAvLyBgZGVwYCA+IDEgY2FuIGFsc28gY2F1c2UgcHJvYmxlbXMgd2l0aCB0aGUgaW5zZXJ0KCkgY2hlY2sgKG11c3QgZG8gdGhpcyBsYXN0KVxuICAgICAgICBlYWNoKGVscywgZnVuY3Rpb24oZWwpIHsgZWxbcG5dICYmIGVsW3BuXS5yZW1vdmVDaGlsZChlbCkgfSlcbiAgICAgICAgcmV0dXJuIGVsc1xuICAgICAgfSgpIDogaXNOb2RlKG5vZGUpID8gW25vZGUuY2xvbmVOb2RlKHRydWUpXSA6IFtdXG4gIH1cblxuICBib256by5kb2MgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZwID0gYm9uem8udmlld3BvcnQoKVxuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBNYXRoLm1heChkb2MuYm9keS5zY3JvbGxXaWR0aCwgaHRtbC5zY3JvbGxXaWR0aCwgdnAud2lkdGgpXG4gICAgICAsIGhlaWdodDogTWF0aC5tYXgoZG9jLmJvZHkuc2Nyb2xsSGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCwgdnAuaGVpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIGJvbnpvLmZpcnN0Q2hpbGQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICBmb3IgKHZhciBjID0gZWwuY2hpbGROb2RlcywgaSA9IDAsIGogPSAoYyAmJiBjLmxlbmd0aCkgfHwgMCwgZTsgaSA8IGo7IGkrKykge1xuICAgICAgaWYgKGNbaV0ubm9kZVR5cGUgPT09IDEpIGUgPSBjW2ogPSBpXVxuICAgIH1cbiAgICByZXR1cm4gZVxuICB9XG5cbiAgYm9uem8udmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGllID8gaHRtbC5jbGllbnRXaWR0aCA6IHNlbGYuaW5uZXJXaWR0aFxuICAgICAgLCBoZWlnaHQ6IGllID8gaHRtbC5jbGllbnRIZWlnaHQgOiBzZWxmLmlubmVySGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgYm9uem8uaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGNvbnRhaW5lciwgZWxlbWVudCkge1xuICAgICAgcmV0dXJuIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT0gMTZcbiAgICB9IDogJ2NvbnRhaW5zJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KTtcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoY29udGFpbmVyLCBlbGVtZW50KSB7XG4gICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnRbcGFyZW50Tm9kZV0pIHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGNvbnRhaW5lcikge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICByZXR1cm4gYm9uem9cbn0pOyAvLyB0aGUgb25seSBsaW5lIHdlIGNhcmUgYWJvdXQgdXNpbmcgYSBzZW1pLWNvbG9uLiBwbGFjZWQgaGVyZSBmb3IgY29uY2F0ZW5hdGlvbiB0b29sc1xuIiwiXG4vLyBub3QgaW1wbGVtZW50ZWRcbi8vIFRoZSByZWFzb24gZm9yIGhhdmluZyBhbiBlbXB0eSBmaWxlIGFuZCBub3QgdGhyb3dpbmcgaXMgdG8gYWxsb3dcbi8vIHVudHJhZGl0aW9uYWwgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtb2R1bGUuXG4iLCIvKiFcbiAgKiBkb21yZWFkeSAoYykgRHVzdGluIERpYXogMjAxMiAtIExpY2Vuc2UgTUlUXG4gICovXG4hZnVuY3Rpb24gKG5hbWUsIGRlZmluaXRpb24pIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxufSgnZG9tcmVhZHknLCBmdW5jdGlvbiAocmVhZHkpIHtcblxuICB2YXIgZm5zID0gW10sIGZuLCBmID0gZmFsc2VcbiAgICAsIGRvYyA9IGRvY3VtZW50XG4gICAgLCB0ZXN0RWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gICAgLCBoYWNrID0gdGVzdEVsLmRvU2Nyb2xsXG4gICAgLCBkb21Db250ZW50TG9hZGVkID0gJ0RPTUNvbnRlbnRMb2FkZWQnXG4gICAgLCBhZGRFdmVudExpc3RlbmVyID0gJ2FkZEV2ZW50TGlzdGVuZXInXG4gICAgLCBvbnJlYWR5c3RhdGVjaGFuZ2UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAgICwgcmVhZHlTdGF0ZSA9ICdyZWFkeVN0YXRlJ1xuICAgICwgbG9hZGVkUmd4ID0gaGFjayA/IC9ebG9hZGVkfF5jLyA6IC9ebG9hZGVkfGMvXG4gICAgLCBsb2FkZWQgPSBsb2FkZWRSZ3gudGVzdChkb2NbcmVhZHlTdGF0ZV0pXG5cbiAgZnVuY3Rpb24gZmx1c2goZikge1xuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAoZiA9IGZucy5zaGlmdCgpKSBmKClcbiAgfVxuXG4gIGRvY1thZGRFdmVudExpc3RlbmVyXSAmJiBkb2NbYWRkRXZlbnRMaXN0ZW5lcl0oZG9tQ29udGVudExvYWRlZCwgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9tQ29udGVudExvYWRlZCwgZm4sIGYpXG4gICAgZmx1c2goKVxuICB9LCBmKVxuXG5cbiAgaGFjayAmJiBkb2MuYXR0YWNoRXZlbnQob25yZWFkeXN0YXRlY2hhbmdlLCBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoL15jLy50ZXN0KGRvY1tyZWFkeVN0YXRlXSkpIHtcbiAgICAgIGRvYy5kZXRhY2hFdmVudChvbnJlYWR5c3RhdGVjaGFuZ2UsIGZuKVxuICAgICAgZmx1c2goKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gKHJlYWR5ID0gaGFjayA/XG4gICAgZnVuY3Rpb24gKGZuKSB7XG4gICAgICBzZWxmICE9IHRvcCA/XG4gICAgICAgIGxvYWRlZCA/IGZuKCkgOiBmbnMucHVzaChmbikgOlxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRlc3RFbC5kb1Njcm9sbCgnbGVmdCcpXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHJlYWR5KGZuKSB9LCA1MClcbiAgICAgICAgICB9XG4gICAgICAgICAgZm4oKVxuICAgICAgICB9KClcbiAgICB9IDpcbiAgICBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIGxvYWRlZCA/IGZuKCkgOiBmbnMucHVzaChmbilcbiAgICB9KVxufSkiLCJ2YXIgaW5zZXJ0ZWQgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgaWYgKGluc2VydGVkLmluZGV4T2YoY3NzKSA+PSAwKSByZXR1cm47XG4gICAgaW5zZXJ0ZWQucHVzaChjc3MpO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBcbiAgICBpZiAoZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShlbGVtLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwiLyohXG4gICogQHByZXNlcnZlIFF3ZXJ5IC0gQSBCbGF6aW5nIEZhc3QgcXVlcnkgc2VsZWN0b3IgZW5naW5lXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9xd2VyeVxuICAqIGNvcHlyaWdodCBEdXN0aW4gRGlheiAyMDEyXG4gICogTUlUIExpY2Vuc2VcbiAgKi9cblxuKGZ1bmN0aW9uIChuYW1lLCBjb250ZXh0LCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgY29udGV4dFtuYW1lXSA9IGRlZmluaXRpb24oKVxufSkoJ3F3ZXJ5JywgdGhpcywgZnVuY3Rpb24gKCkge1xuICB2YXIgZG9jID0gZG9jdW1lbnRcbiAgICAsIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50XG4gICAgLCBieUNsYXNzID0gJ2dldEVsZW1lbnRzQnlDbGFzc05hbWUnXG4gICAgLCBieVRhZyA9ICdnZXRFbGVtZW50c0J5VGFnTmFtZSdcbiAgICAsIHFTQSA9ICdxdWVyeVNlbGVjdG9yQWxsJ1xuICAgICwgdXNlTmF0aXZlUVNBID0gJ3VzZU5hdGl2ZVFTQSdcbiAgICAsIHRhZ05hbWUgPSAndGFnTmFtZSdcbiAgICAsIG5vZGVUeXBlID0gJ25vZGVUeXBlJ1xuICAgICwgc2VsZWN0IC8vIG1haW4gc2VsZWN0KCkgbWV0aG9kLCBhc3NpZ24gbGF0ZXJcblxuICAgICwgaWQgPSAvIyhbXFx3XFwtXSspL1xuICAgICwgY2xhcyA9IC9cXC5bXFx3XFwtXSsvZ1xuICAgICwgaWRPbmx5ID0gL14jKFtcXHdcXC1dKykkL1xuICAgICwgY2xhc3NPbmx5ID0gL15cXC4oW1xcd1xcLV0rKSQvXG4gICAgLCB0YWdPbmx5ID0gL14oW1xcd1xcLV0rKSQvXG4gICAgLCB0YWdBbmRPckNsYXNzID0gL14oW1xcd10rKT9cXC4oW1xcd1xcLV0rKSQvXG4gICAgLCBzcGxpdHRhYmxlID0gLyhefCwpXFxzKls+fitdL1xuICAgICwgbm9ybWFsaXpyID0gL15cXHMrfFxccyooWyxcXHNcXCtcXH4+XXwkKVxccyovZ1xuICAgICwgc3BsaXR0ZXJzID0gL1tcXHNcXD5cXCtcXH5dL1xuICAgICwgc3BsaXR0ZXJzTW9yZSA9IC8oPyFbXFxzXFx3XFwtXFwvXFw/XFwmXFw9XFw6XFwuXFwoXFwpXFwhLEAjJTw+XFx7XFx9XFwkXFwqXFxeJ1wiXSpcXF18W1xcc1xcd1xcK1xcLV0qXFwpKS9cbiAgICAsIHNwZWNpYWxDaGFycyA9IC8oWy4qKz9cXF49IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZ1xuICAgICwgc2ltcGxlID0gL14oXFwqfFthLXowLTldKyk/KD86KFtcXC5cXCNdK1tcXHdcXC1cXC4jXSspPykvXG4gICAgLCBhdHRyID0gL1xcWyhbXFx3XFwtXSspKD86KFtcXHxcXF5cXCRcXCpcXH5dP1xcPSlbJ1wiXT8oWyBcXHdcXC1cXC9cXD9cXCZcXD1cXDpcXC5cXChcXClcXCEsQCMlPD5cXHtcXH1cXCRcXCpcXF5dKylbXCInXT8pP1xcXS9cbiAgICAsIHBzZXVkbyA9IC86KFtcXHdcXC1dKykoXFwoWydcIl0/KFteKCldKylbJ1wiXT9cXCkpPy9cbiAgICAsIGVhc3kgPSBuZXcgUmVnRXhwKGlkT25seS5zb3VyY2UgKyAnfCcgKyB0YWdPbmx5LnNvdXJjZSArICd8JyArIGNsYXNzT25seS5zb3VyY2UpXG4gICAgLCBkaXZpZGVycyA9IG5ldyBSZWdFeHAoJygnICsgc3BsaXR0ZXJzLnNvdXJjZSArICcpJyArIHNwbGl0dGVyc01vcmUuc291cmNlLCAnZycpXG4gICAgLCB0b2tlbml6ciA9IG5ldyBSZWdFeHAoc3BsaXR0ZXJzLnNvdXJjZSArIHNwbGl0dGVyc01vcmUuc291cmNlKVxuICAgICwgY2h1bmtlciA9IG5ldyBSZWdFeHAoc2ltcGxlLnNvdXJjZSArICcoJyArIGF0dHIuc291cmNlICsgJyk/JyArICcoJyArIHBzZXVkby5zb3VyY2UgKyAnKT8nKVxuXG4gIHZhciB3YWxrZXIgPSB7XG4gICAgICAnICc6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUgIT09IGh0bWwgJiYgbm9kZS5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgLCAnPic6IGZ1bmN0aW9uIChub2RlLCBjb250ZXN0YW50KSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUucGFyZW50Tm9kZSA9PSBjb250ZXN0YW50LnBhcmVudE5vZGUgJiYgbm9kZS5wYXJlbnROb2RlXG4gICAgICB9XG4gICAgLCAnfic6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUucHJldmlvdXNTaWJsaW5nXG4gICAgICB9XG4gICAgLCAnKyc6IGZ1bmN0aW9uIChub2RlLCBjb250ZXN0YW50LCBwMSwgcDIpIHtcbiAgICAgICAgaWYgKCFub2RlKSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIChwMSA9IHByZXZpb3VzKG5vZGUpKSAmJiAocDIgPSBwcmV2aW91cyhjb250ZXN0YW50KSkgJiYgcDEgPT0gcDIgJiYgcDFcbiAgICAgIH1cbiAgICB9XG5cbiAgZnVuY3Rpb24gY2FjaGUoKSB7XG4gICAgdGhpcy5jID0ge31cbiAgfVxuICBjYWNoZS5wcm90b3R5cGUgPSB7XG4gICAgZzogZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiB0aGlzLmNba10gfHwgdW5kZWZpbmVkXG4gICAgfVxuICAsIHM6IGZ1bmN0aW9uIChrLCB2LCByKSB7XG4gICAgICB2ID0gciA/IG5ldyBSZWdFeHAodikgOiB2XG4gICAgICByZXR1cm4gKHRoaXMuY1trXSA9IHYpXG4gICAgfVxuICB9XG5cbiAgdmFyIGNsYXNzQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgY2xlYW5DYWNoZSA9IG5ldyBjYWNoZSgpXG4gICAgLCBhdHRyQ2FjaGUgPSBuZXcgY2FjaGUoKVxuICAgICwgdG9rZW5DYWNoZSA9IG5ldyBjYWNoZSgpXG5cbiAgZnVuY3Rpb24gY2xhc3NSZWdleChjKSB7XG4gICAgcmV0dXJuIGNsYXNzQ2FjaGUuZyhjKSB8fCBjbGFzc0NhY2hlLnMoYywgJyhefFxcXFxzKyknICsgYyArICcoXFxcXHMrfCQpJywgMSlcbiAgfVxuXG4gIC8vIG5vdCBxdWl0ZSBhcyBmYXN0IGFzIGlubGluZSBsb29wcyBpbiBvbGRlciBicm93c2VycyBzbyBkb24ndCB1c2UgbGliZXJhbGx5XG4gIGZ1bmN0aW9uIGVhY2goYSwgZm4pIHtcbiAgICB2YXIgaSA9IDAsIGwgPSBhLmxlbmd0aFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSBmbihhW2ldKVxuICB9XG5cbiAgZnVuY3Rpb24gZmxhdHRlbihhcikge1xuICAgIGZvciAodmFyIHIgPSBbXSwgaSA9IDAsIGwgPSBhci5sZW5ndGg7IGkgPCBsOyArK2kpIGFycmF5TGlrZShhcltpXSkgPyAociA9IHIuY29uY2F0KGFyW2ldKSkgOiAocltyLmxlbmd0aF0gPSBhcltpXSlcbiAgICByZXR1cm4gclxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlpZnkoYXIpIHtcbiAgICB2YXIgaSA9IDAsIGwgPSBhci5sZW5ndGgsIHIgPSBbXVxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSByW2ldID0gYXJbaV1cbiAgICByZXR1cm4gclxuICB9XG5cbiAgZnVuY3Rpb24gcHJldmlvdXMobikge1xuICAgIHdoaWxlIChuID0gbi5wcmV2aW91c1NpYmxpbmcpIGlmIChuW25vZGVUeXBlXSA9PSAxKSBicmVhaztcbiAgICByZXR1cm4gblxuICB9XG5cbiAgZnVuY3Rpb24gcShxdWVyeSkge1xuICAgIHJldHVybiBxdWVyeS5tYXRjaChjaHVua2VyKVxuICB9XG5cbiAgLy8gY2FsbGVkIHVzaW5nIGB0aGlzYCBhcyBlbGVtZW50IGFuZCBhcmd1bWVudHMgZnJvbSByZWdleCBncm91cCByZXN1bHRzLlxuICAvLyBnaXZlbiA9PiBkaXYuaGVsbG9bdGl0bGU9XCJ3b3JsZFwiXTpmb28oJ2JhcicpXG4gIC8vIGRpdi5oZWxsb1t0aXRsZT1cIndvcmxkXCJdOmZvbygnYmFyJyksIGRpdiwgLmhlbGxvLCBbdGl0bGU9XCJ3b3JsZFwiXSwgdGl0bGUsID0sIHdvcmxkLCA6Zm9vKCdiYXInKSwgZm9vLCAoJ2JhcicpLCBiYXJdXG4gIGZ1bmN0aW9uIGludGVycHJldCh3aG9sZSwgdGFnLCBpZHNBbmRDbGFzc2VzLCB3aG9sZUF0dHJpYnV0ZSwgYXR0cmlidXRlLCBxdWFsaWZpZXIsIHZhbHVlLCB3aG9sZVBzZXVkbywgcHNldWRvLCB3aG9sZVBzZXVkb1ZhbCwgcHNldWRvVmFsKSB7XG4gICAgdmFyIGksIG0sIGssIG8sIGNsYXNzZXNcbiAgICBpZiAodGhpc1tub2RlVHlwZV0gIT09IDEpIHJldHVybiBmYWxzZVxuICAgIGlmICh0YWcgJiYgdGFnICE9PSAnKicgJiYgdGhpc1t0YWdOYW1lXSAmJiB0aGlzW3RhZ05hbWVdLnRvTG93ZXJDYXNlKCkgIT09IHRhZykgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlkc0FuZENsYXNzZXMgJiYgKG0gPSBpZHNBbmRDbGFzc2VzLm1hdGNoKGlkKSkgJiYgbVsxXSAhPT0gdGhpcy5pZCkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlkc0FuZENsYXNzZXMgJiYgKGNsYXNzZXMgPSBpZHNBbmRDbGFzc2VzLm1hdGNoKGNsYXMpKSkge1xuICAgICAgZm9yIChpID0gY2xhc3Nlcy5sZW5ndGg7IGktLTspIGlmICghY2xhc3NSZWdleChjbGFzc2VzW2ldLnNsaWNlKDEpKS50ZXN0KHRoaXMuY2xhc3NOYW1lKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGlmIChwc2V1ZG8gJiYgcXdlcnkucHNldWRvc1twc2V1ZG9dICYmICFxd2VyeS5wc2V1ZG9zW3BzZXVkb10odGhpcywgcHNldWRvVmFsKSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHdob2xlQXR0cmlidXRlICYmICF2YWx1ZSkgeyAvLyBzZWxlY3QgaXMganVzdCBmb3IgZXhpc3RhbmNlIG9mIGF0dHJpYlxuICAgICAgbyA9IHRoaXMuYXR0cmlidXRlc1xuICAgICAgZm9yIChrIGluIG8pIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBrKSAmJiAob1trXS5uYW1lIHx8IGspID09IGF0dHJpYnV0ZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHdob2xlQXR0cmlidXRlICYmICFjaGVja0F0dHIocXVhbGlmaWVyLCBnZXRBdHRyKHRoaXMsIGF0dHJpYnV0ZSkgfHwgJycsIHZhbHVlKSkge1xuICAgICAgLy8gc2VsZWN0IGlzIGZvciBhdHRyaWIgZXF1YWxpdHlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZnVuY3Rpb24gY2xlYW4ocykge1xuICAgIHJldHVybiBjbGVhbkNhY2hlLmcocykgfHwgY2xlYW5DYWNoZS5zKHMsIHMucmVwbGFjZShzcGVjaWFsQ2hhcnMsICdcXFxcJDEnKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQXR0cihxdWFsaWZ5LCBhY3R1YWwsIHZhbCkge1xuICAgIHN3aXRjaCAocXVhbGlmeSkge1xuICAgIGNhc2UgJz0nOlxuICAgICAgcmV0dXJuIGFjdHVhbCA9PSB2YWxcbiAgICBjYXNlICdePSc6XG4gICAgICByZXR1cm4gYWN0dWFsLm1hdGNoKGF0dHJDYWNoZS5nKCdePScgKyB2YWwpIHx8IGF0dHJDYWNoZS5zKCdePScgKyB2YWwsICdeJyArIGNsZWFuKHZhbCksIDEpKVxuICAgIGNhc2UgJyQ9JzpcbiAgICAgIHJldHVybiBhY3R1YWwubWF0Y2goYXR0ckNhY2hlLmcoJyQ9JyArIHZhbCkgfHwgYXR0ckNhY2hlLnMoJyQ9JyArIHZhbCwgY2xlYW4odmFsKSArICckJywgMSkpXG4gICAgY2FzZSAnKj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZyh2YWwpIHx8IGF0dHJDYWNoZS5zKHZhbCwgY2xlYW4odmFsKSwgMSkpXG4gICAgY2FzZSAnfj0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnfj0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnfj0nICsgdmFsLCAnKD86XnxcXFxccyspJyArIGNsZWFuKHZhbCkgKyAnKD86XFxcXHMrfCQpJywgMSkpXG4gICAgY2FzZSAnfD0nOlxuICAgICAgcmV0dXJuIGFjdHVhbC5tYXRjaChhdHRyQ2FjaGUuZygnfD0nICsgdmFsKSB8fCBhdHRyQ2FjaGUucygnfD0nICsgdmFsLCAnXicgKyBjbGVhbih2YWwpICsgJygtfCQpJywgMSkpXG4gICAgfVxuICAgIHJldHVybiAwXG4gIH1cblxuICAvLyBnaXZlbiBhIHNlbGVjdG9yLCBmaXJzdCBjaGVjayBmb3Igc2ltcGxlIGNhc2VzIHRoZW4gY29sbGVjdCBhbGwgYmFzZSBjYW5kaWRhdGUgbWF0Y2hlcyBhbmQgZmlsdGVyXG4gIGZ1bmN0aW9uIF9xd2VyeShzZWxlY3RvciwgX3Jvb3QpIHtcbiAgICB2YXIgciA9IFtdLCByZXQgPSBbXSwgaSwgbCwgbSwgdG9rZW4sIHRhZywgZWxzLCBpbnRyLCBpdGVtLCByb290ID0gX3Jvb3RcbiAgICAgICwgdG9rZW5zID0gdG9rZW5DYWNoZS5nKHNlbGVjdG9yKSB8fCB0b2tlbkNhY2hlLnMoc2VsZWN0b3IsIHNlbGVjdG9yLnNwbGl0KHRva2VuaXpyKSlcbiAgICAgICwgZGl2aWRlZFRva2VucyA9IHNlbGVjdG9yLm1hdGNoKGRpdmlkZXJzKVxuXG4gICAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gclxuXG4gICAgdG9rZW4gPSAodG9rZW5zID0gdG9rZW5zLnNsaWNlKDApKS5wb3AoKSAvLyBjb3B5IGNhY2hlZCB0b2tlbnMsIHRha2UgdGhlIGxhc3Qgb25lXG4gICAgaWYgKHRva2Vucy5sZW5ndGggJiYgKG0gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLm1hdGNoKGlkT25seSkpKSByb290ID0gYnlJZChfcm9vdCwgbVsxXSlcbiAgICBpZiAoIXJvb3QpIHJldHVybiByXG5cbiAgICBpbnRyID0gcSh0b2tlbilcbiAgICAvLyBjb2xsZWN0IGJhc2UgY2FuZGlkYXRlcyB0byBmaWx0ZXJcbiAgICBlbHMgPSByb290ICE9PSBfcm9vdCAmJiByb290W25vZGVUeXBlXSAhPT0gOSAmJiBkaXZpZGVkVG9rZW5zICYmIC9eWyt+XSQvLnRlc3QoZGl2aWRlZFRva2Vuc1tkaXZpZGVkVG9rZW5zLmxlbmd0aCAtIDFdKSA/XG4gICAgICBmdW5jdGlvbiAocikge1xuICAgICAgICB3aGlsZSAocm9vdCA9IHJvb3QubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICByb290W25vZGVUeXBlXSA9PSAxICYmIChpbnRyWzFdID8gaW50clsxXSA9PSByb290W3RhZ05hbWVdLnRvTG93ZXJDYXNlKCkgOiAxKSAmJiAocltyLmxlbmd0aF0gPSByb290KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByXG4gICAgICB9KFtdKSA6XG4gICAgICByb290W2J5VGFnXShpbnRyWzFdIHx8ICcqJylcbiAgICAvLyBmaWx0ZXIgZWxlbWVudHMgYWNjb3JkaW5nIHRvIHRoZSByaWdodC1tb3N0IHBhcnQgb2YgdGhlIHNlbGVjdG9yXG4gICAgZm9yIChpID0gMCwgbCA9IGVscy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChpdGVtID0gaW50ZXJwcmV0LmFwcGx5KGVsc1tpXSwgaW50cikpIHJbci5sZW5ndGhdID0gaXRlbVxuICAgIH1cbiAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiByXG5cbiAgICAvLyBmaWx0ZXIgZnVydGhlciBhY2NvcmRpbmcgdG8gdGhlIHJlc3Qgb2YgdGhlIHNlbGVjdG9yICh0aGUgbGVmdCBzaWRlKVxuICAgIGVhY2gociwgZnVuY3Rpb24gKGUpIHsgaWYgKGFuY2VzdG9yTWF0Y2goZSwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zKSkgcmV0W3JldC5sZW5ndGhdID0gZSB9KVxuICAgIHJldHVybiByZXRcbiAgfVxuXG4gIC8vIGNvbXBhcmUgZWxlbWVudCB0byBhIHNlbGVjdG9yXG4gIGZ1bmN0aW9uIGlzKGVsLCBzZWxlY3Rvciwgcm9vdCkge1xuICAgIGlmIChpc05vZGUoc2VsZWN0b3IpKSByZXR1cm4gZWwgPT0gc2VsZWN0b3JcbiAgICBpZiAoYXJyYXlMaWtlKHNlbGVjdG9yKSkgcmV0dXJuICEhfmZsYXR0ZW4oc2VsZWN0b3IpLmluZGV4T2YoZWwpIC8vIGlmIHNlbGVjdG9yIGlzIGFuIGFycmF5LCBpcyBlbCBhIG1lbWJlcj9cblxuICAgIHZhciBzZWxlY3RvcnMgPSBzZWxlY3Rvci5zcGxpdCgnLCcpLCB0b2tlbnMsIGRpdmlkZWRUb2tlbnNcbiAgICB3aGlsZSAoc2VsZWN0b3IgPSBzZWxlY3RvcnMucG9wKCkpIHtcbiAgICAgIHRva2VucyA9IHRva2VuQ2FjaGUuZyhzZWxlY3RvcikgfHwgdG9rZW5DYWNoZS5zKHNlbGVjdG9yLCBzZWxlY3Rvci5zcGxpdCh0b2tlbml6cikpXG4gICAgICBkaXZpZGVkVG9rZW5zID0gc2VsZWN0b3IubWF0Y2goZGl2aWRlcnMpXG4gICAgICB0b2tlbnMgPSB0b2tlbnMuc2xpY2UoMCkgLy8gY29weSBhcnJheVxuICAgICAgaWYgKGludGVycHJldC5hcHBseShlbCwgcSh0b2tlbnMucG9wKCkpKSAmJiAoIXRva2Vucy5sZW5ndGggfHwgYW5jZXN0b3JNYXRjaChlbCwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zLCByb290KSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvLyBnaXZlbiBlbGVtZW50cyBtYXRjaGluZyB0aGUgcmlnaHQtbW9zdCBwYXJ0IG9mIGEgc2VsZWN0b3IsIGZpbHRlciBvdXQgYW55IHRoYXQgZG9uJ3QgbWF0Y2ggdGhlIHJlc3RcbiAgZnVuY3Rpb24gYW5jZXN0b3JNYXRjaChlbCwgdG9rZW5zLCBkaXZpZGVkVG9rZW5zLCByb290KSB7XG4gICAgdmFyIGNhbmRcbiAgICAvLyByZWN1cnNpdmVseSB3b3JrIGJhY2t3YXJkcyB0aHJvdWdoIHRoZSB0b2tlbnMgYW5kIHVwIHRoZSBkb20sIGNvdmVyaW5nIGFsbCBvcHRpb25zXG4gICAgZnVuY3Rpb24gY3Jhd2woZSwgaSwgcCkge1xuICAgICAgd2hpbGUgKHAgPSB3YWxrZXJbZGl2aWRlZFRva2Vuc1tpXV0ocCwgZSkpIHtcbiAgICAgICAgaWYgKGlzTm9kZShwKSAmJiAoaW50ZXJwcmV0LmFwcGx5KHAsIHEodG9rZW5zW2ldKSkpKSB7XG4gICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIGlmIChjYW5kID0gY3Jhd2wocCwgaSAtIDEsIHApKSByZXR1cm4gY2FuZFxuICAgICAgICAgIH0gZWxzZSByZXR1cm4gcFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoY2FuZCA9IGNyYXdsKGVsLCB0b2tlbnMubGVuZ3RoIC0gMSwgZWwpKSAmJiAoIXJvb3QgfHwgaXNBbmNlc3RvcihjYW5kLCByb290KSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTm9kZShlbCwgdCkge1xuICAgIHJldHVybiBlbCAmJiB0eXBlb2YgZWwgPT09ICdvYmplY3QnICYmICh0ID0gZWxbbm9kZVR5cGVdKSAmJiAodCA9PSAxIHx8IHQgPT0gOSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaXEoYXIpIHtcbiAgICB2YXIgYSA9IFtdLCBpLCBqO1xuICAgIG86XG4gICAgZm9yIChpID0gMDsgaSA8IGFyLmxlbmd0aDsgKytpKSB7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgYS5sZW5ndGg7ICsraikgaWYgKGFbal0gPT0gYXJbaV0pIGNvbnRpbnVlIG9cbiAgICAgIGFbYS5sZW5ndGhdID0gYXJbaV1cbiAgICB9XG4gICAgcmV0dXJuIGFcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5TGlrZShvKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgaXNGaW5pdGUoby5sZW5ndGgpKVxuICB9XG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplUm9vdChyb290KSB7XG4gICAgaWYgKCFyb290KSByZXR1cm4gZG9jXG4gICAgaWYgKHR5cGVvZiByb290ID09ICdzdHJpbmcnKSByZXR1cm4gcXdlcnkocm9vdClbMF1cbiAgICBpZiAoIXJvb3Rbbm9kZVR5cGVdICYmIGFycmF5TGlrZShyb290KSkgcmV0dXJuIHJvb3RbMF1cbiAgICByZXR1cm4gcm9vdFxuICB9XG5cbiAgZnVuY3Rpb24gYnlJZChyb290LCBpZCwgZWwpIHtcbiAgICAvLyBpZiBkb2MsIHF1ZXJ5IG9uIGl0LCBlbHNlIHF1ZXJ5IHRoZSBwYXJlbnQgZG9jIG9yIGlmIGEgZGV0YWNoZWQgZnJhZ21lbnQgcmV3cml0ZSB0aGUgcXVlcnkgYW5kIHJ1biBvbiB0aGUgZnJhZ21lbnRcbiAgICByZXR1cm4gcm9vdFtub2RlVHlwZV0gPT09IDkgPyByb290LmdldEVsZW1lbnRCeUlkKGlkKSA6XG4gICAgICByb290Lm93bmVyRG9jdW1lbnQgJiZcbiAgICAgICAgKCgoZWwgPSByb290Lm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKSAmJiBpc0FuY2VzdG9yKGVsLCByb290KSAmJiBlbCkgfHxcbiAgICAgICAgICAoIWlzQW5jZXN0b3Iocm9vdCwgcm9vdC5vd25lckRvY3VtZW50KSAmJiBzZWxlY3QoJ1tpZD1cIicgKyBpZCArICdcIl0nLCByb290KVswXSkpXG4gIH1cblxuICBmdW5jdGlvbiBxd2VyeShzZWxlY3RvciwgX3Jvb3QpIHtcbiAgICB2YXIgbSwgZWwsIHJvb3QgPSBub3JtYWxpemVSb290KF9yb290KVxuXG4gICAgLy8gZWFzeSwgZmFzdCBjYXNlcyB0aGF0IHdlIGNhbiBkaXNwYXRjaCB3aXRoIHNpbXBsZSBET00gY2FsbHNcbiAgICBpZiAoIXJvb3QgfHwgIXNlbGVjdG9yKSByZXR1cm4gW11cbiAgICBpZiAoc2VsZWN0b3IgPT09IHdpbmRvdyB8fCBpc05vZGUoc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gIV9yb290IHx8IChzZWxlY3RvciAhPT0gd2luZG93ICYmIGlzTm9kZShyb290KSAmJiBpc0FuY2VzdG9yKHNlbGVjdG9yLCByb290KSkgPyBbc2VsZWN0b3JdIDogW11cbiAgICB9XG4gICAgaWYgKHNlbGVjdG9yICYmIGFycmF5TGlrZShzZWxlY3RvcikpIHJldHVybiBmbGF0dGVuKHNlbGVjdG9yKVxuICAgIGlmIChtID0gc2VsZWN0b3IubWF0Y2goZWFzeSkpIHtcbiAgICAgIGlmIChtWzFdKSByZXR1cm4gKGVsID0gYnlJZChyb290LCBtWzFdKSkgPyBbZWxdIDogW11cbiAgICAgIGlmIChtWzJdKSByZXR1cm4gYXJyYXlpZnkocm9vdFtieVRhZ10obVsyXSkpXG4gICAgICBpZiAoaGFzQnlDbGFzcyAmJiBtWzNdKSByZXR1cm4gYXJyYXlpZnkocm9vdFtieUNsYXNzXShtWzNdKSlcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZWN0KHNlbGVjdG9yLCByb290KVxuICB9XG5cbiAgLy8gd2hlcmUgdGhlIHJvb3QgaXMgbm90IGRvY3VtZW50IGFuZCBhIHJlbGF0aW9uc2hpcCBzZWxlY3RvciBpcyBmaXJzdCB3ZSBoYXZlIHRvXG4gIC8vIGRvIHNvbWUgYXdrd2FyZCBhZGp1c3RtZW50cyB0byBnZXQgaXQgdG8gd29yaywgZXZlbiB3aXRoIHFTQVxuICBmdW5jdGlvbiBjb2xsZWN0U2VsZWN0b3Iocm9vdCwgY29sbGVjdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzKSB7XG4gICAgICB2YXIgb2lkLCBuaWRcbiAgICAgIGlmIChzcGxpdHRhYmxlLnRlc3QocykpIHtcbiAgICAgICAgaWYgKHJvb3Rbbm9kZVR5cGVdICE9PSA5KSB7XG4gICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBlbCBoYXMgYW4gaWQsIHJld3JpdGUgdGhlIHF1ZXJ5LCBzZXQgcm9vdCB0byBkb2MgYW5kIHJ1biBpdFxuICAgICAgICAgIGlmICghKG5pZCA9IG9pZCA9IHJvb3QuZ2V0QXR0cmlidXRlKCdpZCcpKSkgcm9vdC5zZXRBdHRyaWJ1dGUoJ2lkJywgbmlkID0gJ19fcXdlcnltZXVwc2NvdHR5JylcbiAgICAgICAgICBzID0gJ1tpZD1cIicgKyBuaWQgKyAnXCJdJyArIHMgLy8gYXZvaWQgYnlJZCBhbmQgYWxsb3cgdXMgdG8gbWF0Y2ggY29udGV4dCBlbGVtZW50XG4gICAgICAgICAgY29sbGVjdG9yKHJvb3QucGFyZW50Tm9kZSB8fCByb290LCBzLCB0cnVlKVxuICAgICAgICAgIG9pZCB8fCByb290LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHMubGVuZ3RoICYmIGNvbGxlY3Rvcihyb290LCBzLCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICB2YXIgaXNBbmNlc3RvciA9ICdjb21wYXJlRG9jdW1lbnRQb3NpdGlvbicgaW4gaHRtbCA/XG4gICAgZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgICAgcmV0dXJuIChjb250YWluZXIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZWxlbWVudCkgJiAxNikgPT0gMTZcbiAgICB9IDogJ2NvbnRhaW5zJyBpbiBodG1sID9cbiAgICBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XG4gICAgICBjb250YWluZXIgPSBjb250YWluZXJbbm9kZVR5cGVdID09PSA5IHx8IGNvbnRhaW5lciA9PSB3aW5kb3cgPyBodG1sIDogY29udGFpbmVyXG4gICAgICByZXR1cm4gY29udGFpbmVyICE9PSBlbGVtZW50ICYmIGNvbnRhaW5lci5jb250YWlucyhlbGVtZW50KVxuICAgIH0gOlxuICAgIGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcbiAgICAgIHdoaWxlIChlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSBpZiAoZWxlbWVudCA9PT0gY29udGFpbmVyKSByZXR1cm4gMVxuICAgICAgcmV0dXJuIDBcbiAgICB9XG4gICwgZ2V0QXR0ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGRldGVjdCBidWdneSBJRSBzcmMvaHJlZiBnZXRBdHRyaWJ1dGUoKSBjYWxsXG4gICAgICB2YXIgZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdwJylcbiAgICAgIHJldHVybiAoKGUuaW5uZXJIVE1MID0gJzxhIGhyZWY9XCIjeFwiPng8L2E+JykgJiYgZS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSgnaHJlZicpICE9ICcjeCcpID9cbiAgICAgICAgZnVuY3Rpb24gKGUsIGEpIHtcbiAgICAgICAgICByZXR1cm4gYSA9PT0gJ2NsYXNzJyA/IGUuY2xhc3NOYW1lIDogKGEgPT09ICdocmVmJyB8fCBhID09PSAnc3JjJykgP1xuICAgICAgICAgICAgZS5nZXRBdHRyaWJ1dGUoYSwgMikgOiBlLmdldEF0dHJpYnV0ZShhKVxuICAgICAgICB9IDpcbiAgICAgICAgZnVuY3Rpb24gKGUsIGEpIHsgcmV0dXJuIGUuZ2V0QXR0cmlidXRlKGEpIH1cbiAgICB9KClcbiAgLCBoYXNCeUNsYXNzID0gISFkb2NbYnlDbGFzc11cbiAgICAvLyBoYXMgbmF0aXZlIHFTQSBzdXBwb3J0XG4gICwgaGFzUVNBID0gZG9jLnF1ZXJ5U2VsZWN0b3IgJiYgZG9jW3FTQV1cbiAgICAvLyB1c2UgbmF0aXZlIHFTQVxuICAsIHNlbGVjdFFTQSA9IGZ1bmN0aW9uIChzZWxlY3Rvciwgcm9vdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLCBzcywgZVxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHJvb3Rbbm9kZVR5cGVdID09PSA5IHx8ICFzcGxpdHRhYmxlLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgLy8gbW9zdCB3b3JrIGlzIGRvbmUgcmlnaHQgaGVyZSwgZGVmZXIgdG8gcVNBXG4gICAgICAgICAgcmV0dXJuIGFycmF5aWZ5KHJvb3RbcVNBXShzZWxlY3RvcikpXG4gICAgICAgIH1cbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIHdoZXJlIHdlIG5lZWQgdGhlIHNlcnZpY2VzIG9mIGBjb2xsZWN0U2VsZWN0b3IoKWBcbiAgICAgICAgZWFjaChzcyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIGNvbGxlY3RTZWxlY3Rvcihyb290LCBmdW5jdGlvbiAoY3R4LCBzKSB7XG4gICAgICAgICAgZSA9IGN0eFtxU0FdKHMpXG4gICAgICAgICAgaWYgKGUubGVuZ3RoID09IDEpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGUuaXRlbSgwKVxuICAgICAgICAgIGVsc2UgaWYgKGUubGVuZ3RoKSByZXN1bHQgPSByZXN1bHQuY29uY2F0KGFycmF5aWZ5KGUpKVxuICAgICAgICB9KSlcbiAgICAgICAgcmV0dXJuIHNzLmxlbmd0aCA+IDEgJiYgcmVzdWx0Lmxlbmd0aCA+IDEgPyB1bmlxKHJlc3VsdCkgOiByZXN1bHRcbiAgICAgIH0gY2F0Y2ggKGV4KSB7IH1cbiAgICAgIHJldHVybiBzZWxlY3ROb25OYXRpdmUoc2VsZWN0b3IsIHJvb3QpXG4gICAgfVxuICAgIC8vIG5vIG5hdGl2ZSBzZWxlY3RvciBzdXBwb3J0XG4gICwgc2VsZWN0Tm9uTmF0aXZlID0gZnVuY3Rpb24gKHNlbGVjdG9yLCByb290KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sIGl0ZW1zLCBtLCBpLCBsLCByLCBzc1xuICAgICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKG5vcm1hbGl6ciwgJyQxJylcbiAgICAgIGlmIChtID0gc2VsZWN0b3IubWF0Y2godGFnQW5kT3JDbGFzcykpIHtcbiAgICAgICAgciA9IGNsYXNzUmVnZXgobVsyXSlcbiAgICAgICAgaXRlbXMgPSByb290W2J5VGFnXShtWzFdIHx8ICcqJylcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGl0ZW1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGlmIChyLnRlc3QoaXRlbXNbaV0uY2xhc3NOYW1lKSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gaXRlbXNbaV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICAvLyBtb3JlIGNvbXBsZXggc2VsZWN0b3IsIGdldCBgX3F3ZXJ5KClgIHRvIGRvIHRoZSB3b3JrIGZvciB1c1xuICAgICAgZWFjaChzcyA9IHNlbGVjdG9yLnNwbGl0KCcsJyksIGNvbGxlY3RTZWxlY3Rvcihyb290LCBmdW5jdGlvbiAoY3R4LCBzLCByZXdyaXRlKSB7XG4gICAgICAgIHIgPSBfcXdlcnkocywgY3R4KVxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoY3R4W25vZGVUeXBlXSA9PT0gOSB8fCByZXdyaXRlIHx8IGlzQW5jZXN0b3IocltpXSwgcm9vdCkpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHJbaV1cbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgICByZXR1cm4gc3MubGVuZ3RoID4gMSAmJiByZXN1bHQubGVuZ3RoID4gMSA/IHVuaXEocmVzdWx0KSA6IHJlc3VsdFxuICAgIH1cbiAgLCBjb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgLy8gY29uZmlnTmF0aXZlUVNBOiB1c2UgZnVsbHktaW50ZXJuYWwgc2VsZWN0b3Igb3IgbmF0aXZlIHFTQSB3aGVyZSBwcmVzZW50XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnNbdXNlTmF0aXZlUVNBXSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHNlbGVjdCA9ICFvcHRpb25zW3VzZU5hdGl2ZVFTQV0gPyBzZWxlY3ROb25OYXRpdmUgOiBoYXNRU0EgPyBzZWxlY3RRU0EgOiBzZWxlY3ROb25OYXRpdmVcbiAgICB9XG5cbiAgY29uZmlndXJlKHsgdXNlTmF0aXZlUVNBOiB0cnVlIH0pXG5cbiAgcXdlcnkuY29uZmlndXJlID0gY29uZmlndXJlXG4gIHF3ZXJ5LnVuaXEgPSB1bmlxXG4gIHF3ZXJ5LmlzID0gaXNcbiAgcXdlcnkucHNldWRvcyA9IHt9XG5cbiAgcmV0dXJuIHF3ZXJ5XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzPShmdW5jdGlvbigpIHt2YXIgdCA9IGZ1bmN0aW9uIGFub255bW91cyhsb2NhbHMsIGZpbHRlcnMsIGVzY2FwZSkge1xuZXNjYXBlID0gZXNjYXBlIHx8IGZ1bmN0aW9uIChodG1sKXtcbiAgcmV0dXJuIFN0cmluZyhodG1sKVxuICAgIC5yZXBsYWNlKC8mKD8hXFx3KzspL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xufTtcbnZhciBidWYgPSBbXTtcbndpdGggKGxvY2FscyB8fCB7fSkgeyAoZnVuY3Rpb24oKXsgXG4gYnVmLnB1c2goJzxkaXYgY2xhc3M9XCJtb2RlIHNpZ25pblwiPlxcbiAgICA8ZGl2IGNsYXNzPVwicG9wdXBcIj5cXG4gICAgICBcdDxkaXYgY2xhc3M9XCJvdmVybGF5XCI+XFxuICAgICAgICBcdDxkaXYgaWQ9XCJvbmVzdGVwXCIgY2xhc3M9XCJwYW5lbCBvbmVzdGVwXCI+XFxuICAgICAgICAgIFx0XHQ8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+XFxuICAgICAgICAgICAgXHRcdDxkaXYgY2xhc3M9XCJpbWFnZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPlxcbiAgICAgICAgICAgIFx0XHRcdDxpbWcgc3JjPVwiXCI+XFxuICAgICAgICAgICAgXHRcdDwvZGl2PlxcbiAgICAgICAgICAgIFx0XHQ8aDE+U2lnbiBJbjwvaDE+XFxuXHRcdCAgICAgICAgICAgIDxoMiBjbGFzcz1cImVycm9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+Jm5ic3A7PC9oMj5cXG5cdFx0ICAgICAgICAgICAgPGgyIGNsYXNzPVwic3VjY2Vzc1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPiZuYnNwOzwvaDI+XFxuXHRcdCAgICAgICAgICAgIDxhIGNsYXNzPVwiY2xvc2VcIj5DbG9zZTwvYT5cXG4gICAgICAgICAgXHRcdDwvaGVhZGVyPlxcblxcbiAgICAgICAgICBcdFx0PGRpdiBjbGFzcz1cImxvZ2dlZGluXCI+XFxuXHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgbGFzdC10aW1lXCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJzdHJhdGVneVwiPjwvZGl2Plxcblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVtYWlsLXJlYWRvbmx5XCI+PC9zcGFuPlxcblx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgdHlwZT1cImVtYWlsXCIgdmFsdWU9XCJcIiBkaXNhYmxlZCBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgdGl0bGU9XCJFbWFpbFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgdmFsdWU9XCJcIiBhdXRvZm9jdXMgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHRpdGxlPVwiUGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImFjdGlvblwiPlxcblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gSW48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHRcdCAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInNwaW5uZXJcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48L2J1dHRvbj5cXG5cdFx0XHRcdFx0XHRcdCAgXHQ8bGFiZWwgY2xhc3M9XCJjcmVhdGUtYWNjb3VudFwiPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY2VudGVyZWQgYWxsXCI+U2hvdyBhbGw8L3NwYW4+XFxuXHRcdCAgICAgICAgICAgIDwvZm9ybT5cXG4gICAgICAgICAgXHRcdDwvZGl2Plxcblxcblx0ICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm5vdGxvZ2dlZGluXCI+XFxuXHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHQgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJpY29ubGlzdFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjxwIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Li4uIG9yIHNpZ24gaW4gdXNpbmc8L3A+PC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwic2VwYXJhdG9yXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCI+PHNwYW4+b3I8L3NwYW4+PC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxQYXNzd29yZFwiPlxcblx0XHQgICAgICAgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZW1haWxcIj5cXG5cdFx0ICAgICAgICAgICAgICAgICAgXHRcdDxpbnB1dCBuYW1lPVwiZW1haWxcIiBpZD1cInNpZ25pbl9lYXN5X2VtYWlsXCIgdHlwZT1cImVtYWlsXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+XFxuXHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgaWQ9XCJzaWduaW5fZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gSW48L2J1dHRvbj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGxhYmVsIGNsYXNzPVwiY3JlYXRlLWFjY291bnRcIj48YSBocmVmPVwiamF2YXNjcmlwdDoge31cIiBjbGFzcz1cInNpZ24tdXBcIj5TaWduIFVwPC9hPjxzcGFuIGNsYXNzPVwiZGl2aWRlclwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Jm5ic3A74oCiJm5ic3A7PC9zcGFuPjxhIGhyZWY9XCJqYXZhc2NyaXB0OiB7fVwiIGNsYXNzPVwiZm9yZ290LXBhc3NcIj5Gb3Jnb3QgeW91ciBwYXNzd29yZD88L2E+PC9sYWJlbD5cXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHQgICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwic2lnbnVwXCI+XFxuXHRcdCAgICAgICAgICAgIDxmb3JtPlxcblx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImhlYWRlclwiPjwvZGl2Plxcblx0XHQgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsUGFzc3dvcmRcIj5cXG5cdFx0ICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImVtYWlsXCI+XFxuXHRcdCAgICAgICAgICAgICAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cImVtYWlsXCIgaWQ9XCJzaWdudXBfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0ICAgICAgICAgICAgICAgIFx0PC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHQgICAgICAgICAgICAgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwic2lnbnVwX2Vhc3lfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ3JlYXRlIGEgUGFzc3dvcmRcIiB0aXRsZT1cIlBhc3N3b3JkXCI+XFxuXHRcdCAgICAgICAgICAgICAgICBcdDwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNpZ24gVXA8L2J1dHRvbj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICBcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImZvb3RlclwiPjwvZGl2Plxcblx0XHRcdCAgICAgICAgICAgICAgICAgIFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJjZW50ZXJlZCBjYW5jZWxcIj5DYW5jZWw8L2E+XFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XFxuXHRcdCAgICAgICAgICAgICAgXHQ8L2Rpdj5cXG5cdFx0ICAgICAgICAgICAgPC9mb3JtPlxcblx0ICAgICAgICAgIFx0PC9kaXY+XFxuXFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzZXRcIj5cXG5cdFx0XHRcdFx0PGZvcm0gaWQ9XCJjaGFuZ2VfcGFzc3dvcmRcIj5cXG5cdFx0XHRcdFx0ICBcdDxkaXYgY2xhc3M9XCJoZWFkZXJcIj48L2Rpdj5cXG5cdFx0XHRcdFx0ICBcdDxkaXYgY2xhc3M9XCJlbWFpbFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJlbWFpbFwiPlxcblx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJlbWFpbFwiIGlkPVwicmVzZXRfZWFzeV9lbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJFbWFpbFwiIHRpdGxlPVwiRW1haWxcIj5cXG5cdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdCAgICBcdDxkaXYgY2xhc3M9XCJwYXNzd29yZFwiPlxcblx0XHRcdFx0XHQgICAgICBcdFx0PGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9wYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIHZhbHVlPVwiXCIgcmVxdWlyZWQgcGxhY2Vob2xkZXI9XCJOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIk5ldyBQYXNzd29yZFwiPlxcblx0XHRcdFx0XHQgICAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0ICAgIFx0PGRpdiBjbGFzcz1cInJlcGVhdFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdCAgICAgIFx0XHQ8aW5wdXQgbmFtZT1cInJlcGVhdF9wYXNzd29yZFwiIGlkPVwicmVzZXRfZWFzeV9yZXBlYXRfcGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiB2YWx1ZT1cIlwiIHJlcXVpcmVkIHBsYWNlaG9sZGVyPVwiQ29uZmlybSBOZXcgUGFzc3dvcmRcIiB0aXRsZT1cIkNvbmZpcm0gTmV3IFBhc3N3b3JkXCI+XFxuXHRcdFx0XHRcdCAgICBcdDwvZGl2Plxcblx0XHRcdFx0XHQgICAgXHQ8ZGl2IGNsYXNzPVwiYWN0aW9uXCI+XFxuXHRcdFx0XHRcdCAgICAgIFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cInpvY2lhbCBwcmltYXJ5IG5leHRcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiPlNlbmQ8L2J1dHRvbj5cXG5cdFx0XHRcdFx0ICAgICAgXHRcdDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3Bpbm5lclwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPjwvYnV0dG9uPlxcblx0XHRcdFx0XHQgICAgICBcdFx0PGRpdiBjbGFzcz1cIm9wdGlvbnNcIj5cXG5cdFx0XHRcdFx0ICAgICAgICBcdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6IHt9XCIgY2xhc3M9XCJjZW50ZXJlZCBjYW5jZWxcIj5DYW5jZWw8L2E+XFxuXHRcdFx0XHRcdCAgICAgIFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdFx0ICAgIFx0PC9kaXY+XFxuXHRcdFx0XHRcdCAgXHQ8L2Rpdj5cXG5cdFx0XHRcdFx0PC9mb3JtPlxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHRcXG4gICAgICAgICAgXHRcdDxmb290ZXI+XFxuICAgICAgICAgICAgXHRcdDxzcGFuPlBvd2VyZWQgYnkgPGEgaHJlZj1cImh0dHA6Ly9hdXRoMC5jb21cIiB0YXJnZXQ9XCJfbmV3XCI+QXV0aDA8L2E+PC9zcGFuPlxcbiAgICAgICAgICBcdFx0PC9mb290ZXI+XFxuICAgICAgICBcdDwvZGl2PlxcbiAgICAgIFx0PC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcbicpOyB9KSgpO1xufSBcbnJldHVybiBidWYuam9pbignJyk7XG59OyByZXR1cm4gZnVuY3Rpb24obCkgeyByZXR1cm4gdChsKSB9fSgpKSJdfQ==
;