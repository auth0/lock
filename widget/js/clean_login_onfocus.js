var bean = require('bean');

module.exports.hook = function ($) {
  var timeoutId;

  function on_blur() {
    timeoutId = setTimeout(function () {
      $('.a0-collapse-social').css('height', '120px');
      $('.a0-header').show();
    }, 5);
  }

  function on_focus () {
    clearTimeout(timeoutId);
    $('.a0-collapse-social').css('height', '0px');
    $('.a0-header').hide();
  }

  bean.on($('#a0-signin_easy_email')[0], 'blur', on_blur);
  bean.on($('#a0-signin_easy_email')[0], 'focus', on_focus);
  bean.on($('#a0-signin_easy_password')[0], 'blur', on_blur);
  bean.on($('#a0-signin_easy_password')[0], 'focus', on_focus);
};