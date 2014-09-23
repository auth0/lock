/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__widgetjp*', 'Auth0*']);

/**
 * Test reset
 */

describe('reset', function () {

  beforeEach(function (done) {
    this.widget = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
    done();
  });

  afterEach(function (done) {
    global.window.location.hash = '';
    global.window.Auth0 = null;
    this.widget.hide(done);
  });

  it('should show the loading pane on submit', function (done) {
    var widget = this.widget;

    widget
    .once('ready', function() {
      bean.fire($('#a0-lock .a0-forgot-pass')[0], 'click');
    })
    .once('reset ready', function () {
      $('#a0-reset_easy_email').val('ohmy@mandatory.com');
      $('#a0-reset_easy_password').val('123');
      $('#a0-reset_easy_repeat_password').val('123');

      widget
      .once('loading ready', function () {
        expect($('#a0-lock h1').html()).to.be(widget.options.i18n.t('reset:title'));
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
