var $ = require('./bonzo_qwery');

module.exports.hook = function (inputs, collapsible) {
  var timeoutId;

  function on_blur() {
    timeoutId = setTimeout(function () {
      collapsible.show();
      $('.a0-header').show();
    }, 5);
  }

  function on_focus () {
    clearTimeout(timeoutId);
    collapsible.hide();
    $('.a0-header').hide();
  }

  inputs
    .a0_off('blur.collapse_onfocus')
    .a0_on('blur.collapse_onfocus', on_blur)
    .a0_off('focus.collapse_onfocus')
    .a0_on('focus.collapse_onfocus', on_focus);
};