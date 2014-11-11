
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

describe('gravatar', function () {
  var email, avatar, icon, iconImg;

  beforeEach(function (done) {
    this.widget = new Auth0Lock(clientID, domain);
    this.options = {
      rememberLastLogin: false,
      integratedWindowsLogin: false
    };
    done();
  });

  afterEach(function (done) {
    this.options = null;
    global.window.Auth0 = null;
    this.widget.hide(done);
  });

  it('should display gravatar when email has an associated gravatar account', function (done) {
    var expectedGravatarURL = 'https://www.gravatar.com/avatar/9d8d8bff4484ddadf83684d88cb10188?d=404';
    var gravatarEmail = 'albertopose@gmail.com';

    // Should never happen
    this.widget.on('avatar shown', function () {
      expect(false).to.be.equal(true);
    });

    this.widget.on('icon shown', function () {
      expect(isVisible(avatar)).to.be.equal(false);
      expect(isVisible(icon)).to.be.equal(true);
      expect(iconImg.attr('src')).to.be.equal(expectedGravatarURL);
      done();
    });

    this.widget.on('ready', function () {
      email   = $('#a0-lock .a0-notloggedin .a0-emailPassword .a0-email input');
      avatar  = $('#a0-lock .a0-header .a0-avatar');
      icon    = $('#a0-lock .a0-header .a0-image');
      iconImg = $('#a0-lock .a0-header .a0-image img');

      expect(email).not.to.be.empty();
      expect(avatar).not.to.be.empty();
      expect(icon).not.to.be.empty();
      expect(iconImg).not.to.empty();

      type(email, gravatarEmail);
    });

    this.widget.show(this.options);

  });

  it('should not display gravatar when email has no gravatar account', function (done) {
    var gravatarEmail = 'albertopose@gmail.co';

    // Should never happen
    this.widget.on('icon shown', function () {
      expect(false).to.be.equal(true);
    });

    this.widget.on('avatar shown', function () {
      expect(isVisible(avatar)).to.be.equal(true);
      expect(isVisible(icon)).to.be.equal(false);
      done();
    });

    this.widget.on('ready', function () {
      email   = $('#a0-lock .a0-notloggedin .a0-emailPassword .a0-email input');
      avatar  = $('#a0-lock .a0-header .a0-avatar');
      icon    = $('#a0-lock .a0-header .a0-image');
      iconImg = $('#a0-lock .a0-header .a0-image img');

      expect(email).not.to.be.empty();
      expect(avatar).not.to.be.empty();
      expect(icon).not.to.be.empty();
      expect(iconImg).not.to.empty();

      type(email, gravatarEmail);
    });

    this.widget.show(this.options);
  });
});
