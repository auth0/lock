var $ = require('../js/bonzo_qwery');
var reset = module.exports;

var is_small_screen = require('../js/is_small_screen');
var collapse_onfocus = require('../js/collapse_onfocus');
var regex = require('../js/regex');
var email_parser = regex.email_parser;
var empty = regex.empty;

reset.submit = function (widget, connectionName, username, password) {
  var container = $('.a0-reset form');

  widget._setLoginView({ mode: 'loading', title: 'reset' }, function () {
    widget._auth0.changePassword({
      connection: connectionName,
      username:   username,
      password:   password
    }, function (err) {

      if ( $()[0] !== widget._node ) {
        return console && console.log && console.log('this password reset was triggered from another node instance', arguments);
      }

      $('.a0-password input', container).val('');
      $('.a0-repeatPassword input', container).val('');

      if (err) {
        // set error message before view refresh
        // to avoid wrong resizing calculations
        if (400 === err.status) {
          widget._showError(widget._dict.t('reset:userDoesNotExistErrorText'));
        } else {
          widget._showError(widget._dict.t('reset:serverErrorText'));
        }
        return widget._setLoginView({ mode: 'reset' });
      }

      $('.a0-email input', container).val('');

      // set success message before view refresh
      // to avoid wrong resizing calculations
      widget._showSuccess(widget._dict.t('reset:successText'));
      widget._setLoginView({});
    });
  });
};

reset.bind = function (widget) {
  $('.a0-reset .a0-options').show(widget._openWith ? 'none' : 'block');

  var form = $('.a0-reset form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var username = $('.a0-email input', form).val();
      var password = $('.a0-password input', form).val();
      var connection  = widget._getAuth0Connection();

      if (!valid(form, widget)) return;
      reset.submit(widget, connection.name, username, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook($('.a0-reset form input'), $('.a0-collapse-reset'));
  }

  $('.a0-repeatPassword input', form)
    .a0_off('input')
    .a0_on('input', function() {
      if ($('.a0-password input', form).val() != this.value) {
        widget._setCustomValidity(this, widget._dict.t('reset:enterSamePasswordText'));
      } else {
        widget._setCustomValidity(this, '');
      }
    });
};

function valid(form, widget) {
  var ok = true;
  var email_input = $('input[name=email]', form);
  var email_empty = empty.test(email_input.val());
  var email_parsed = email_parser.exec(email_input.val().toLowerCase());
  var password_input = $('input[name=password]', form);
  var password_empty = empty.test(password_input.val());
  var repeat_password_input = $('input[name=repeat_password]', form);
  var repeat_password_empty = empty.test(repeat_password_input.val());

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

  if (repeat_password_empty) {
    widget._focusError(repeat_password_input);
    ok = false;
  };

  if (repeat_password_input.val() !== password_input.val()) {
    widget._focusError(repeat_password_input, widget._dict.t('mustMatch'));
    ok = false;
  };

  return ok;
}