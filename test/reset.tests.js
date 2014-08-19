/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__auth0jp*', 'Auth0*']);

/**
 * Test reset
 */

describe('reset', function () {
  afterEach(function () {
    $('#a0-lock').remove();
    global.window.location.hash = '';
    global.window.Auth0 = null;
  });

  beforeEach(function () {
    $('#a0-lock').parents('div').remove();
    this.auth0 = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
  });

  it('should show the loading pane', function (done) {
    var auth0 = this.auth0;

    auth0
    .once('ready', function() {
      bean.fire($('#a0-lock .a0-forgot-pass')[0], 'click');
    })
    .once('reset ready', function () {
      $('#a0-reset_easy_email').val('ohmy@mandatory.com');
      $('#a0-reset_easy_password').val('123');
      $('#a0-reset_easy_repeat_password').val('123');

      auth0
      .once('loading ready', function () {
        expect($('#a0-lock h1').html()).to.be(auth0.options.i18n.t('reset:title'));
        done();
      });

      bean.fire($('.a0-reset form')[0], 'submit');
    })
    .show({
      callbackURL: 'http://localhost:3000/',
      rememberLastLogin: false
    });
  });

});
