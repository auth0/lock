$(function() {

  //Initial default functions //
  $('body.full').click(function(){
    $('.auth0-lock').addClass('auth0-lock-opened');
    return false;
  });

  $('.auth0-lock-close').click(function(){
    $('.auth0-lock').removeClass('auth0-lock-opened');
    return false;
  });

  $(".global-error").click(function(){

    $('.auth0-global-grobal-error').slideToggle(200, function(){
      $('.auth0-global-grobal-error span').show();
    });
    return false;
  });

  $( ".auth0-lock-input-number" ).focusin(function() {

    if ($('.auth0-lock-input-block-email').hasClass('auth0-lock-error') ) {

      $('.auth0-lock-input-block-email').removeClass('auth0-lock-error');

    }
  });

  $('.auth0-lock-tabs li').click(function(){
    $('.auth0-lock-tabs li').toggleClass("auth0-lock-tabs-current");
    $('.auth0-lock-form').toggleClass("auth0-lock-hide");
  });


  // Initial steps functions //

  // Show list of region code
  $('.auth0-lock-input-location').on('click', function() {

    console.log('select country');

    $('.auth0-lock-select-country').show().removeClass('slide-leave slide-leave-active').addClass('slide-enter slide-enter-active');
    $('.auth0-lock-close').hide();

    return false;
  });


  // Selection region code and back to initial
  $('.auth0-lock-list-code').on('click', function() {

    console.log('country selected');

    $('.auth0-lock-select-country').removeClass('slide-enter slide-enter-active').addClass('slide-leave slide-leave-active');
    $('.auth0-lock-close').show();

  });


  // Button submit number and region code
  $('.auth0-lock-submit-code').on('click', function(){

    if ($('.auth0-lock-input-number').val() === '') {

      $('.auth0-lock-input-block-email').addClass('auth0-lock-error');
      $('.auth0-lock-input-block-email').addClass('animated pulse');

    }else if ($('.auth0-lock-input-number').val() === "11-3344-5566") {

      $('.auth0-lock').addClass('auth0-lock-mode-loading');

      console.log('enter code');

      setTimeout(function(){
        $('.auth0-lock-confirmation').show().addClass('slide-enter slide-enter-active');
        $('.auth0-lock').removeClass('auth0-lock-mode-loading');
      }, 2000);

    }else{

    }

    return false;

  });


  // Button submit passcode
  $('.auth0-lock-submit-complete').on('click', function(){

    if ($('.auth0-lock-input-code').val() === '') {

      $('.auth0-lock-input-block-code').addClass('auth0-lock-error');
      $('.auth0-lock-input-block-code').addClass('animated pulse');

    }else if ($('.auth0-lock-input-code').val() === "8888") {

      $('.auth0-lock').addClass('auth0-lock-mode-loading');

      console.log('value correct');

      setTimeout(function(){

        $('.auth0-lock-confirmation').show().addClass('animated slideInRight');

        $('.auth0-lock').removeClass('auth0-lock-mode-loading');

      }, 2000);

    }else{

    }

    return false;

  });


  // Back button
  $('.auth0-lock-go-back').click(function(){

    $('.auth0-lock .js-hide').hide();

  });


  // Resend passcode
  $('.auth0-lock-resend-link').click(function(){
    $(this).hide();
    $('.auth0-lock-sent-label').show();
  });

  // $(".auth0-lock-input-number").keyup(function() {
  //   if (this.value == "11-3344-5566") {
  //     $(".auth0-lock-header-logo").hide();
  //     $('.auth0-lock-header-bg-inner').css('background-image','url(img/avatar.png)').addClass("auth0-lock-no-grayscale");
  //     $(".auth0-lock-header-avatar").removeClass("auth0-lock-hide").addClass('animated fadeInDown');
  //     $('.auth0-lock-firstname').removeClass("auth0-lock-hide");
  //     $('.auth0-lock-name').hide();
  //   }
  //   else {
  //     $(".auth0-lock-header-logo").show();
  //     $(".auth0-lock-header-avatar").hide();
  //     $('.auth0-lock-firstname').hide();
  //     $('.auth0-lock-name').show();
  //   }
  // });
});
