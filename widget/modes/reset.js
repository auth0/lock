var $ = require('../js/bonzo_qwery');

var reset = module.exports;

reset.submit = function (widget, connectionName, username, password) {
  var container = $('.a0-reset form');

  widget._setLoginView({ mode: 'loading', title: 'reset' }, function () {
    widget._auth0.changePassword({
      connection: connectionName,
      username:   username,
      password:   password
    }, function (err) {

      if ( $()[0] !== widget._node ) {
        return console.log && console.log('this password reset was triggered from another node instance', arguments);
      }

      $('.a0-password input', container).val('');
      $('.a0-repeatPassword input', container).val('');

      if (err) {
        return widget._setLoginView({ mode: 'reset' }, function () {
          widget._showError(widget._parseResponseMessage(err, widget._dict.t('reset:serverErrorText')));
        });
      }

      $('.a0-email input', container).val('');

      widget._setLoginView({}, function () {
        widget._showSuccess(widget._dict.t('reset:successText'));
      });
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
      reset.submit(widget, connection.name, username, password);
    });

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