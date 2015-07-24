$(function() {

  $('body').click(function(){
    $('.auth0-lock').addClass('opened');
    return false;
  });

  $('.auth0-lock-close').click(function(){
    $('.auth0-lock').removeClass('opened');
    return false;
  });

  $('.auth0-lock-tabs li').click(function(){
    $('.auth0-lock-tabs li').toggleClass("auth0-lock-tabs-current");
    $('.auth0-lock-form').toggleClass("auth0-lock-hide");
  });

  $('.auth0-lock-submit').click(function(){

    if ($('.auth0-lock-input-email').val() === '') {


      $('.auth0-lock-input-block-email').addClass('auth0-lock-error');
      $('.auth0-lock-input-block-email').addClass('animated pulse');

    }else if ($('.auth0-lock-input-email').val() === "rickyrauch@gmail.com") {

      $('.auth0-lock').addClass('auth0-lock-submit-loading');

      $('.auth0-lock-submit i').addClass('animated fadeOutDownBig');

      $('.auth0-lock-submit .auth0-loading-container').addClass('animated fadeInDownBig');

      console.log('value correct');

      setTimeout(function(){
        $('.auth0-lock-header').addClass("fadeOutUp animated");
        $('.auth0-lock-header-avatar').addClass("fadeOutUp animated");
        $('.auth0-lock-content').addClass("fadeOut animated");
        $('.auth0-lock-submit').addClass("fadeOutDown animated");
        $('.auth0-lock-confirmation').show();
        $('.checkmark').css('display', 'block');

        setTimeout(function () {
          $('.checkmark').show();
        }, 1000);

      }, 3000);

    }else{

    }

    return false;

  });

  $(".global-error").click(function(){

    $('.auth0-global-grobal-error').slideToggle(200, function(){
      $('.auth0-global-grobal-error span').show();
    });
    return false;
  });

  $( ".auth0-lock-input-email" ).focusin(function() {

    if ($('.auth0-lock-input-block-email').hasClass('auth0-lock-error') ) {

      $('.auth0-lock-input-block-email').removeClass('auth0-lock-error');

    }
  });

  $(".auth0-lock-input-email").keyup(function() {
    if (this.value == "rickyrauch@gmail.com") {
      $(".auth0-lock-header-logo").hide();
      $('.auth0-lock-header-bg-inner').css('background-image','url(img/avatar.png)').addClass("auth0-lock-no-grayscale");
      $(".auth0-lock-header-avatar").removeClass("auth0-lock-hide").addClass('animated fadeInDown');
      $('.auth0-lock-firstname').removeClass("auth0-lock-hide");
      $('.auth0-lock-name').hide();
    }
    else {
    // $(".auth0-lock-header-logo").show();
    // $(".auth0-lock-header-avatar").hide();
    // $('.auth0-lock-firstname').hide();
    // $('.auth0-lock-name').show();
    }
  });
});
