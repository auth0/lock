var _ = require('underscore');
var $ = require('../js/bonzo_qwery');

var buttonTmpl = require('../html/button.ejs');
var collapse_onfocus = require('../js/collapse_onfocus');
var is_small_screen = require('../js/is_small_screen');
var regex = require('../js/regex');
var empty = regex.empty;
var email_parser = regex.email_parser;
var signup = module.exports;


signup.submit = function (widget, connectionName, email, password) {
  widget._setLoginView({mode: 'loading', title: 'signup'}, function () {
    widget._auth0.signup({
      connection: connectionName,
      username:   email,
      password:   password,
      auto_login: false
    }, function (err) {

      if ( $()[0] !== widget._node ) {
        return console && console.log && console.log('this signup was triggered from another node instance', arguments);
      }

      if (err) {
        // set error message before view refresh
        // to avoid wrong resizing calculations
        if (400 === err.status) {
          widget._showError(widget._dict.t('signup:userExistsErrorText'))
        } else {
          widget._showError(widget._dict.t('signup:serverErrorText'));
        }
        return widget._setLoginView({ mode: 'signup' });
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
    .map(function (s) {
      var e = {
        use_big_buttons: false,
        title: widget._dict.t('signupSocialButton').replace('{connection:title}', s.title)
      }
      return  _.extend({}, s, e);
    })
    .each(function (s) { return list.append(buttonTmpl(s)); });

  if (_.where(widget._client.strategies, {social: true}).length > 0) {
    $('.a0-signup .a0-separator, .a0-signup .a0-iconlist').show();
  }

  $('.a0-zocial[data-strategy]', list).a0_on('click', function (e) {
    widget._signInSocial(e);
  });

  var form = $('.a0-signup form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var connection  = widget._getAuth0Connection();
      var email = $('.a0-email input', form).val();
      var password = $('.a0-password input', form).val();

      if (!valid(form, widget)) return;
      signup.submit(widget, connection.name, email, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook($('.a0-signup form input'), $('.a0-collapse-social-signup'));
  }

  return signup;
};

function valid(form, widget) {
  var ok = true;
  var email_input = $('input[name=email]', form);
  var email_empty = empty.test(email_input.val());
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var password_input = $('input[name=password]', form);
  var password_empty = empty.test(password_input.val());

  // asume valid by default
  // and reset errors
  widget._showError();
  widget._focusError();

  if (email_empty) {
    widget._focusError(email_input);
    ok = false;
  }

  if (!email_parsed && !email_empty) {
    widget._focusError(email_input, widget._dict.t('invalid'));
    ok = false;
  }

  if (password_empty) {
    widget._focusError(password_input);
    ok = false;
  };

  return ok;
}