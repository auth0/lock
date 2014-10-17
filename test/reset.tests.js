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
    this.client = this.widget.$auth0;
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
    .showReset();
  });

  it('should invoke callback function when reset is successfull', function(done) {
    var widget = this.widget;

    // mock success from reset password
    this.client.changePassword = function(options, callback) {
      callback(null, "success message");
    }

    widget
    .once('reset ready', function () {
      $('#a0-reset_easy_email').val('ohmy@mandatory.com');
      $('#a0-reset_easy_password').val('123');
      $('#a0-reset_easy_repeat_password').val('123');

      bean.fire($('.a0-reset form')[0], 'submit');
    })
    .showReset({}, onsuccess);

    function onsuccess(err, message) {
      expect(err).to.equal(null);
      expect(message).to.not.be(undefined);
      done();
    }
  });

  it('should invoke callback function with error when reset errors', function(done) {
    var widget = this.widget;

    // mock error from reset password
    this.client.changePassword = function(options, callback) {
      callback(new Error('Email does not exist'))
    }

    widget
    .once('reset ready', function () {
      $('#a0-reset_easy_email').val('unregistered@email.com');
      $('#a0-reset_easy_password').val('123');
      $('#a0-reset_easy_repeat_password').val('123');

      bean.fire($('.a0-reset form')[0], 'submit');
    })
    .showReset({}, onerror);

    function onerror(err, message) {
      expect(err).to.not.be(null);
      expect(message).to.be(undefined);
      done();
    }
  });

});
