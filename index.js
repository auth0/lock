var domready  = require('domready');
var Auth0     = require('auth0-js');
var qwery     = require('qwery');
var bonzo     = require('bonzo');
var fs        = require('fs');
var insertCss = require('insert-css');

var loginTmpl = require('./widget/html/login.html');

var $ = function (selector, root) {
  return bonzo(qwery(selector, root));
};

domready(function () {
  var options = {
    domain:      'mdocs.auth0.com',
    clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 
    callbackURL: 'http://localhost:3000/',
    mode:        'notloggedin'
  };

  var auth0 = Auth0({
    clientID:     options.clientID, 
    callbackURL:  options.callbackURL,
    domain:       options.domain
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
      'ad': { css: 'windows', name: 'AD / LDAP', social: false },
      'custom': { css: 'guest', name: 'Custom Auth', social: false },
      'auth0': { css: 'guest', name: 'Auth0', social: false },
      'auth0-adldap': { css: 'guest', name: 'AD/LDAP', social: false },
      'thirtysevensignals': { css: 'thirtysevensignals', name: '37 Signals', social: true },
      'box': { css: 'box', name: 'Box', social: true, imageicon: true },
      'salesforce': { css: 'salesforce', name: 'Salesforce', social: true },
      'fitbit': { css: 'fitbit', name: 'Fitbit', social: true }
  };

  var _auth0Strategy;
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

  var _setTop = function(onTop, element) {
    if (!onTop) {
      setTimeout(function() {
        element.css({
          'marginTop': '-' + (element[0].offsetHeight / 2) + 'px',
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

  // helper methods
  var _isAuth0Conn = function (strategy) {
    return strategy === 'auth0' || strategy === 'auth0-adldap';
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

  var redirect = function (url) {
    window.location = url;
  };

  // initialize
  var initialize = function () {
    // TODO: add event (keypress) to close popup with ESC key
    // TODO: add event (click) to close popup with close button
    // TODO: add event (submit) to login with signIn button
    // TODO: support css option for non free subscriptions
    
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
          //.setHtml(global.tlite.find("{name}", { name: _strategies[strategy.name].name}));

        list.append(button);
        list.css('display', 'block');

        $('.popup .panel.onestep .separator').css('display', 'block');
      }
    }

    // TODO: add event (click) to login with social connection

    showSignIn();
  };

  var showSignIn = function () {
    // if no social connections and one enterprise connection only, redirect
    if (!_areThereAnySocialConn() && 
      _client.strategies.length === 1 &&
      _client.strategies[0].name !== 'auth0' &&
      _client.strategies[0].connections.length === 1) {
      
      redirect(_client.strategies[0].connections[0].url);
    }

    // labels text
    options = options || {};
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

    _setTop(options.top, $('div.panel.onestep'));
  };

  // load
  insertCss(fs.readFileSync(__dirname + '/widget/css/login.css'));
  insertCss(fs.readFileSync(__dirname + '/widget/css/zocial.css'));
  insertCss(fs.readFileSync(__dirname + '/widget/css/common.css'));
  insertCss(fs.readFileSync(__dirname + '/widget/css/button.css'));
  insertCss(fs.readFileSync(__dirname + '/widget/css/normalize.css'));

  var div = document.createElement('div');
  div.innerHTML = loginTmpl({
    mode: options.mode
  });

  document.body.appendChild(div);

  initialize();
});
