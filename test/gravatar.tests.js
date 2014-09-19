
/* global bean */

var clientID  = '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup';
var domain    = 'mdocs.auth0.com';

function type(input, value) {
  input.val(value);
  bean.fire(input.get(0), 'input');
}

function isVisible(element) {
  return !element.hasClass('a0-hide');
}

describe('gravatar', function () {
  var widget, email, avatar, icon, iconImg;

  beforeEach(function (done) {
    widget = new Auth0Lock(clientID, domain);


    widget.once('ready', function () {
      email   = $('#a0-lock .a0-notloggedin .a0-emailPassword .a0-email input');
      avatar  = $('#a0-lock .a0-header .a0-avatar');
      icon    = $('#a0-lock .a0-header .a0-image');
      iconImg = $('#a0-lock .a0-header .a0-image img');

      expect(email.get(0)).not.to.be(undefined);
      expect(avatar.get(0)).not.to.be(undefined);
      expect(icon.get(0)).not.to.be(undefined);
      expect(iconImg.get(0)).not.to.be(undefined);

      done();
    });

    widget.show();
  });

  afterEach(function (done) {
    widget.once('hidden', function () { done(); });

    widget.hide();
  });

  it('should display gravatar when email has an associated gravatar account', function (done) {

    var expectedGravatarURL = 'http://www.gravatar.com/avatar/9d8d8bff4484ddadf83684d88cb10188?d=404';
    var gravatarEmail = 'albertopose@gmail.com';

    // Should never happen
    widget.on('avatar shown', function () {
      expect(false).to.be.equal(true);
    });

    widget.on('icon shown', function () {
      expect(isVisible(avatar)).to.be.equal(false);
      expect(isVisible(icon)).to.be.equal(true);
      expect(iconImg.attr('src')).to.be.equal(expectedGravatarURL);
      done();
    });
    type(email, gravatarEmail);
  });

  it('should not display gravatar when email has no gravatar account', function (done) {
    var gravatarEmail = 'albertopose@gmail.co';

    // Should never happen
    widget.on('icon shown', function () {
      expect(false).to.be.equal(true);
    });

    widget.on('avatar shown', function () {
      expect(isVisible(avatar)).to.be.equal(true);
      expect(isVisible(icon)).to.be.equal(false);
      done();
    });
    type(email, gravatarEmail);
  });
});
