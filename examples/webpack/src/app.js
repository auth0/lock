var Auth0Variables = require('./auth0-variables');
var Auth0Lock = require('auth0-lock');
var $ = require('jquery');

$(document).ready(function () {

  var lock = new Auth0Lock(
    Auth0Variables.AUTH0_CLIENT_ID,
    Auth0Variables.AUTH0_DOMAIN
  );

  var userProfile;

  $('.btn-login').click(function (e) {
    e.preventDefault();
    lock.showSignin(function (err, profile, token) {
      if (err) {
        // Error callback
        console.log('There was an error');
        alert('There was an error logging in');
      } else {
        // Success calback

        // Save the JWT token.
        localStorage.setItem('userToken', token);

        // Save the profile
        userProfile = profile;

        $('.login-box').hide();
        $('.logged-in-box').show();
        $('.nickname').text(profile.nickname);
        $('.nickname').text(profile.name);
        $('.avatar').attr('src', profile.picture);
      }
    });
  });

  $.ajaxSetup({
    'beforeSend': function (xhr) {
      if (localStorage.getItem('userToken')) {
        xhr.setRequestHeader('Authorization',
          'Bearer ' + localStorage.getItem('userToken'));
      }
    }
  });

  $('.btn-api').click(function (e) {
    // Just call your API here. The header will be sent
    $.ajax({
      url: 'http://localhost:3001/secured/ping',
      method: 'GET'
    }).then(function (data, textStatus, jqXHR) {
      alert('The request to the secured enpoint was successfull');
    }, function () {
      alert('You need to download the server seed and start it to call this API');
    });
  });

});