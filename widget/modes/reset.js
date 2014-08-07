var $ = require('../js/bonzo_qwery');
var reset = module.exports;

var is_small_screen = require('../js/is_small_screen');
var collapse_onfocus = require('../js/collapse_onfocus');
var regex = require('../js/regex');
var email_parser = regex.email_parser;
var empty = regex.empty;
var trim = require('trim');

reset.submit = function (widget, connectionName, username, password) {
  var container = widget._$('.a0-reset form');

  widget._setLoginView({ mode: 'loading', title: 'reset' }, function () {
    widget._auth0.changePassword({
      connection: connectionName,
      username:   username,
      password:   password
    }, function (err) {

      // This is now dummy, and should no longer exist since all
      // dom events keep a reference to widget._container
      if ( !widget._container || widget._$()[0] !== widget._container.childNodes[0] ) {
        return console && console.log && console.log('this password reset was triggered from another node instance', arguments);
      }

      widget._$('.a0-password input', container).val('');
      widget._$('.a0-repeatPassword input', container).val('');

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

      widget._$('.a0-email input', container).val('');

      // set success message before view refresh
      // to avoid wrong resizing calculations
      widget._showSuccess(widget._dict.t('reset:successText'));

      return widget._setLoginView();
    });
  });
};

reset.bind = function (widget) {
  widget._$('.a0-reset .a0-options').show(widget._openWith ? 'none' : 'block');

  var form = widget._$('.a0-reset form')
    .a0_off('submit')
    .a0_on('submit', function (e) {
      e.preventDefault();
      var username = widget._$('.a0-email input', form).val();
      var password = widget._$('.a0-password input', form).val();
      var connection  = widget._getAuth0Connection();

      if (!valid(form, widget)) return;
      reset.submit(widget, connection.name, username, password);
    });

  if (is_small_screen()) {
    collapse_onfocus.hook(widget._$('.a0-reset form input'), widget._$('.a0-collapse-reset'));
  }

  widget._$('.a0-repeatPassword input', form)
    .a0_off('input')
    .a0_on('input', function() {
      if (widget._$('.a0-password input', form).val() != this.value) {
        widget._setCustomValidity(this, widget._dict.t('reset:enterSamePasswordText'));
      } else {
        widget._setCustomValidity(this, '');
      }
    });
};

function valid(form, widget) {
  var ok = true;
  var email_input = widget._$('input[name=email]', form);
  var email = trim(email_input.val());
  var email_empty = empty.test(email);
  var email_parsed = email_parser.exec(email.toLowerCase());
  var password_input = widget._$('input[name=password]', form);
  var password = password_input.val();
  var password_empty = empty.test(password);
  var repeat_password_input = widget._$('input[name=repeat_password]', form);
  var repeat_password = repeat_password_input.val();
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
