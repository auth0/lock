/* global $, bean */
/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__auth0jp*', 'Auth0*']);

describe('Auth0Lock - SMS', function() {
  beforeEach(function (done) {
    var self = this;
    this.options = {
      callbackURL: 'http://localhost:3000/',
      rememberLastLogin: false
    };

    if (!this.auth0) return onhidden();
    this.auth0.hide(onhidden);
    function onhidden() {
      self.auth0 = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
      self.$client = self.auth0.$client;
      self.options = {
        apiToken: 'asdasdasd'
      }
      done();
    }
  });

  afterEach(function (done) {
    global.window.location.hash = '';
    global.window.Auth0 = null;
    this.auth0.hide(done)
  });

  it('should open in sms mode', function(done) {
    var auth0 = this.auth0;
    auth0.once('sms ready', function () {
      var $lock = $('#a0-lock');
      expect($lock.find('h1').html()).to.be(auth0.options.i18n.t('sms:title'));
      expect($lock.find('input[name="phone"]')).not.to.be.empty();
      // done();
    });
    auth0.showSMS(this.options);
  });

  it('should display error message when phone does not meet criteria', function(done) {
    var auth0 = this.auth0;
    auth0.once('sms ready', function () {
      var $lock = $('#a0-lock');
      var $input = $lock.find('input[name="phone"]');

      auth0.once('loading ready', function () {
        done(new Error ('It should never submit with wrong criteria'));
      });

      expect($input.val()).to.be.empty();
      bean.fire($lock.find('[type="submit"]')[0], 'click');
      expect($('.a0-input-box.a0-error-input')).not.to.be.empty();

      type($input, 'asd');
      bean.fire($lock.find('[type="submit"]')[0], 'click');
      expect($lock.find('.a0-error')).not.to.be.empty();

      done();
    });
    auth0.showSMS(this.options);
  });

});

function type(input, value) {
  bean.fire(input[0], 'focus');
  input.val(value);
  bean.fire(input[0], 'keydown');
  bean.fire(input[0], 'keyup');
  bean.fire(input[0], 'input');
}
