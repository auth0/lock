var _ = require('underscore');
var $ = require('../js/bonzo_qwery');

var buttonTmpl = require('../html/button.ejs');
var collapse_onfocus = require('../js/collapse_onfocus');
var is_small_screen = require('../js/is_small_screen');

var signup = module.exports;


signup.submit = function (widget, connectionName, email, password) {
  widget._setLoginView({mode: 'loading', title: 'signup'}, function () {
    widget._auth0.signup({
      connection: connectionName,
      username:   email,
      password:   password,
      auto_login: false
    }, function (err) {
      if (err) {
        return widget._setLoginView({mode: 'signup'}, function () {
          widget._showError(widget._parseResponseMessage(err, widget._dict.t('signup:serverErrorText')));
        });
      }
      return widget._signInWithAuth0(email, password);
    });
  });
};

signup.bind = function (widget) {
  var list = $('.a0-signup .a0-iconlist').html('');

  $('.a0-signup .a0-options').show(widget._openWith ? 'none' : 'block');

  _.chain(widget._client.strategies)
     .where({social: true})
     .map(function (s) { return  _.extend({}, s, {use_big_buttons: false}); })
     .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(widget._client.strategies, {social: true}).length > 0) {
    $('.a0-signup .a0-separator, .a0-signup .a0-iconlist').show();
  }

  $('span', list).a0_on('click', function (e) {
    widget._signInSocial(e);
  });

  var form = $('.a0-signup form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var connection  = widget._getAuth0Connection();
      var email = $('.a0-email input', form).val();
      var password = $('.a0-password input', form).val();
      signup.submit(widget, connection.name, email, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook($('.a0-signup form input'), $('.a0-collapse-social-signup'));
  }

  return signup;
};