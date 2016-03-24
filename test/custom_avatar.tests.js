/* global bean */

var clientID  = '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup';
var domain    = 'mdocs.auth0.com';

function type(input, value) {
  input.val(value);
  bean.fire(input[0], 'input');
}

function isVisible(element) {
  return !element.hasClass('a0-hide');
}

describe('avatars', function () {
  var email, avatar, icon, avatarImg;

  describe('when using a custom avatar function', function() {
    var expectedAvatarUrl = "http://lorempixel.com/200/200/";

    beforeEach(function (done) {
      this.widget = new Auth0Lock(clientID, domain);
      this.options = {
        rememberLastLogin: false,
        integratedWindowsLogin: false,
        fetchAvatar: function(widget, email) {
          widget.setImage(expectedAvatarUrl);
        }
      };

      done();
    });

    afterEach(function (done) {
      this.options = null;
      global.window.Auth0 = null;
      this.widget.hide(done);
    });

    it('should call the custom avatar function', function() {

      // Should never happen
      this.widget.on('icon shown', function () {
        expect(false).to.be.equal(true);
      });

      this.widget.on('avatar shown', function () {
        expect(isVisible(avatar)).to.be.equal(true);
        expect(isVisible(icon)).to.be.equal(false);
        expect(avatarImg.attr('src')).to.be.equal(expectedAvatarUrl);
        done();
      });

      this.widget.on('ready', function () {
        email     = $('#a0-lock .a0-notloggedin .a0-emailPassword .a0-email input');
        avatar    = $('#a0-lock .a0-header .a0-icon-container .a0-avatar');
        icon      = $('#a0-lock .a0-header .a0-icon-container .a0-image');
        avatarImg = $('#a0-lock .a0-header .a0-icon-container .a0-avatar img');

        expect(email).not.to.be.empty();
        expect(avatar).not.to.be.empty();
        expect(icon).not.to.be.empty();
        expect(avatarImg).not.to.empty();

        type(email, "some@email.com");
      });

      this.widget.show(this.options);
    });
  });

  describe('when gravatar is disabled and no custom avatar function is supplied', function() {
    var gravatarEmail = 'albertopose@gmail.com';

    beforeEach(function (done) {
      this.widget = new Auth0Lock(clientID, domain);
      this.options = {
        rememberLastLogin: false,
        integratedWindowsLogin: false,
        gravatar: false
      };

      done();
    });

    afterEach(function (done) {
      this.options = null;
      global.window.Auth0 = null;
      this.widget.hide(done);
    });

    it('should display the icon', function() {
      // Should never happen
      this.widget.on('avatar shown', function () {
        expect(false).to.be.equal(true);
      });

      this.widget.on('icon shown', function () {
        expect(isVisible(avatar)).to.be.equal(false);
        expect(isVisible(icon)).to.be.equal(true);
        done();
      });

      this.widget.on('ready', function () {
        email     = $('#a0-lock .a0-notloggedin .a0-emailPassword .a0-email input');
        avatar    = $('#a0-lock .a0-header .a0-icon-container .a0-avatar');
        icon      = $('#a0-lock .a0-header .a0-icon-container .a0-image');
        avatarImg = $('#a0-lock .a0-header .a0-icon-container .a0-avatar img');

        expect(email).not.to.be.empty();
        expect(avatar).not.to.be.empty();
        expect(icon).not.to.be.empty();
        expect(avatarImg).not.to.empty();

        type(email, gravatarEmail);
      });
    });
  });
});
