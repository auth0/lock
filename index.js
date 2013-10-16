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
          { domain: '', name: '' }
        ]
      },
      {
        name: 'github',
        social: true,
        connections: [
          { domain: '', name: '' }
        ]
      },
      {
        name: 'twitter',
        social: true,
        connections: [
          { domain: '', name: '' }
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

  var _isAuth0Conn = function (strategy) {
    return strategy === 'auth0' || strategy === 'auth0-adldap';
  };

  var _getLoggedinView = function() {
    return $('.loggedin');
  };

  var _getNotLoggedinView = function() {
    return $('.notloggedin');
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

    showSignIn();
  };

  var showSignIn = function () {
    // TODO: if no social connections and one enterprise connection only, redirect
    // TODO: change labels text

    // TODO: support options.theme
    // TODO: show/hide show icon
    // TODO: hide divider dot if there are one of two
    // TODO: placeholders and buttons
    // TODO: show email, password, separator and button if there are enterprise/db connections
    // TODO: show placeholders for IE9

    $('div.panel').removeClass('active');
    $('div.overlay').addClass('active');
    $('div.panel.onestep').addClass('active');

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
