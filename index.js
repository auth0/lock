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

  var setTop = function(onTop, element) {
    if (!onTop) {
      setTimeout(function() {
        element.css({
          'marginTop': '-' + (element.attr('offsetHeight') / 2) + 'px',
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

  // initialize
  var initialize = function () {
    // TODO: add event (keypress) to close popup with ESC key
    // TODO: add event (click) to close popup with close button
    // TODO: add event (submit) to login with signIn button
    // TODO: support css option for non free subscriptions
    // TODO: load social buttons

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

    setTop(options.top, $('div.panel.onestep'));
  };

  // load
  var loginCss = fs.readFileSync(__dirname + '/widget/css/login.css');
  insertCss(loginCss);

  var div = document.createElement('div');
  div.innerHTML = loginTmpl({
    mode: options.mode
  });

  document.body.appendChild(div);

  initialize();
});
