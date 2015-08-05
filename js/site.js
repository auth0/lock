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

  $('.auth0-lock-input-location').on('click', function() {

    console.log('select country');

    $('.auth0-lock').addClass('auth0-lock-mode-country');

    return false;
  });

  $('.auth0-lock-list-code').on('click', function() {

    console.log('country selected');

    $('.auth0-lock').removeClass('auth0-lock-mode-country');

    $('.auth0-lock').addClass('auth0-lock-mode-initial');

  });

  $('.auth0-lock-submit').click(function(){

    if ($('.auth0-lock-input-number').val() === '') {


      $('.auth0-lock-input-block-email').addClass('auth0-lock-error');
      $('.auth0-lock-input-block-email').addClass('animated pulse');

    }else if ($('.auth0-lock-input-number').val() === "11-3344-5566") {

      $('.auth0-lock').addClass('auth0-lock-mode-loading');

      console.log('value correct');

      setTimeout(function(){

        $('.auth0-lock').addClass('auth0-lock-mode-completed');

      }, 3000);

    }else{

    }

    return false;

  });

  $('.auth0-lock-go-back').click(function(){

    $('.auth0-lock').removeClass('auth0-lock-mode-loading');

    $('.auth0-lock').removeClass('auth0-lock-mode-completed');

    $('.auth0-lock').addClass('auth0-lock-mode-initial');

  });

  $('.auth0-lock-resend-link').click(function(){
    $(this).hide();
    $('.auth0-lock-sent-label').show();
  });

  $('.auth0-lock-go-back').click(function(){

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
