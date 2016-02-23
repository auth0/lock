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
    this.options = {};
    done();
  });

  afterEach(function (done) {
    global.window.location.hash = '';
    global.window.Auth0 = null;
    this.options = null;
    this.widget.hide(done);
  });

  describe('Reset widget (legacy)', function() {
    it('should show the loading pane on submit', function (done) {
      var widget = this.widget;
      var readyLoading = false;

      this.client.changePassword = function(options, callback) {
        callback(null, "success message");
      };

      widget
      .once('reset ready', function () {
        $('#a0-reset_easy_email').val('ohmy@mandatory.com');
        $('#a0-reset_easy_password').val('123');
        $('#a0-reset_easy_repeat_password').val('123');

        widget
        .once('loading ready', function () {
          readyLoading = true;
          expect($('#a0-lock h1').html()).to.be(widget.options.i18n.t('reset:title'));
        })
        .once('signin ready', function() {
          expect(readyLoading).to.be(true);
          done();
        });

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset({useNewReset: false});
    });

    it('should not invoke callback function when reset is successfull', function(done) {
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
      .once('reset success', function() {
        done();
      })
      .showReset({useNewReset: false}, cb);

      function cb() {
        expect(false).to.be.ok(); // callback should not be invoked
        done();
      }
    });

    it('should not invoke callback function with error when reset errors', function(done) {
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
      .once('reset error', function() {
        done();
      })
      .showReset({useNewReset: false}, cb);

      function cb() {
        expect(false).to.be.ok(); // callback should not be invoked
        done();
      }
    });
  });

  describe('Reset widget (new)', function() {
    it('should show the loading pane on submit', function (done) {
      var widget = this.widget;
      var readyLoading = false;

      this.client.changePassword = function(options, callback) {
        callback(null, "success message");
      };

      widget
      .once('reset ready', function () {
        $('#a0-reset_easy_email').val('ohmy@mandatory.com');

        widget
        .once('loading ready', function () {
          readyLoading = true;
          expect($('#a0-lock h1').html()).to.be(widget.options.i18n.t('newReset:title'));
        })
        .once('signin ready', function() {
          expect(readyLoading).to.be(true);
          done();
        });

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset();
    });

    it('should not invoke callback function when reset is successfull', function(done) {
      var widget = this.widget;

      // mock success from reset password
      this.client.changePassword = function(options, callback) {
        callback(null, "success message");
      }

      widget
      .once('reset ready', function () {
        $('#a0-reset_easy_email').val('ohmy@mandatory.com');

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .once('reset success', function() {
        done();
      })
      .showReset(cb);

      function cb() {
        expect(false).to.be.ok(); // callback should not be invoked
        done();
      }
    });

    it('should not invoke callback function with error when reset errors', function(done) {
      var widget = this.widget;

      // mock error from reset password
      this.client.changePassword = function(options, callback) {
        callback(new Error('Email does not exist'))
      }

      widget
      .once('reset ready', function () {
        $('#a0-reset_easy_email').val('unregistered@email.com');

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .once('reset error', function() {
        done();
      })
      .showReset(cb);

      function cb() {
        expect(false).to.be.ok(); // callback should not be invoked
        done();
      }
    });
  });

  describe('when requires_username is enabled (for legacy only)', function() {

    beforeEach(function() {
      // Mock `_isUsernameRequired` so it asumes database has enabled
      // requires_username on it's configuration
      this.options.useNewReset = false;
      this.options._isUsernameRequired = function() { return true; };
    });

    it('should invalidate an empty username', function (done) {
      var auth0 = this.widget;
      var email = 'pepo@example.com';
      var password = '12345';

      auth0
      .once('reset ready', function() {
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');

        expect($('.a0-email .a0-error-input')).to.not.be.empty();
        done();
      })
      .showReset(this.options);
    });

    it('should invalidate an invalid username', function (done) {
      var auth0 = this.widget;
      var username = '1.1.1.1';
      var password = '12345';

      auth0
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(username);
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');

        expect($('.a0-email .a0-error-input')).to.not.be.empty();
        done();
      })
      .showReset(this.options);
    });

    it('should still invalidate an invalid email', function (done) {
      var auth0 = this.widget;
      var email = 'pepo@example';
      var password = '12345';

      auth0
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(email);
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');

        expect($('.a0-email .a0-error-input')).to.not.be.empty();
        done();
      })
      .showReset(this.options);
    });

    it('should send valid username on submit', function (done) {
      var auth0 = this.widget;
      var username = 'pepe';
      var email = 'pepo@example.com';
      var password = '12345';

      this.client.changePassword = function(options) {
        expect(options.username).to.equal(username);
        expect(options.password).to.equal(password);
        done();
      }

      auth0
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(username);
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

    it('should still send valid email on submit', function (done) {
      var auth0 = this.widget;
      var email = 'pepo@example.com';
      var password = '12345';

      this.client.changePassword = function(options) {
        expect(options.username).to.equal(email);
        expect(options.password).to.equal(password);
        done();
      }

      auth0
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(email);
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });
  });

  describe('Events (legacy)', function() {
    beforeEach(function() {
      this.options.useNewReset = false;
    });

    it('should fire up an submit event on submit', function(done) {
        var auth0 = this.widget;
        var email = 'pepo@example.com';
        var password = '12345';

        this.client.changePassword = function() {};

        auth0
        .once('reset submit', function(opts) {
          expect(opts).to.not.be(undefined);
          done();
        })
        .once('reset ready', function() {
          $('#a0-reset_easy_email').val(email);
          $('#a0-reset_easy_password').val(password);
          $('#a0-reset_easy_repeat_password').val(password);

          bean.fire($('.a0-reset form')[0], 'submit');
        })
        .showReset(this.options);
    });

    it('should fire up an error event on password missmatch', function(done) {
        var auth0 = this.widget;
        var email = 'pepo@example.com';
        var password = '12345';

        this.client.changePassword = function() {};

        auth0
        .once('reset error', function(err) {
          expect(err.message).to.be('password missmatch');
          done();
        })
        .once('reset ready', function() {
          $('#a0-reset_easy_email').val(email);
          $('#a0-reset_easy_password').val(password);
          $('#a0-reset_easy_repeat_password').val(password + 'invalid');

          bean.fire($('.a0-reset form')[0], 'submit');
        })
        .showReset(this.options);
    });

    it('should fire up an error event on password empty', function(done) {
        var auth0 = this.widget;
        var email = 'pepo@example.com';
        var password = '12345';

        this.client.changePassword = function() {};

        auth0
        .once('reset error', function(err) {
          expect(err.message).to.be('password empty');
          done();
        })
        .once('reset ready', function() {
          $('#a0-reset_easy_email').val(email);
          $('#a0-reset_easy_repeat_password').val(password + 'invalid');

          bean.fire($('.a0-reset form')[0], 'submit');
        })
        .showReset(this.options);
    });

    it('should fire up an error event on repeat password empty', function(done) {
        var auth0 = this.widget;
        var email = 'pepo@example.com';
        var password = '12345';

        this.client.changePassword = function() {};

        auth0
        .once('reset error', function(err) {
          expect(err.message).to.be('repeat password empty');
          done();
        })
        .once('reset ready', function() {
          $('#a0-reset_easy_email').val(email);
          $('#a0-reset_easy_password').val(password);

          bean.fire($('.a0-reset form')[0], 'submit');
        })
        .showReset(this.options);
    });

    it('should fire up an error event on email invalid', function(done) {
        var auth0 = this.widget;
        var email = 'pepo!&&*example.com';
        var password = '12345';

        auth0
        .once('reset error', function(err) {
          expect(err.message).to.be('email invalid');
          done();
        })
        .once('reset ready', function() {
          $('#a0-reset_easy_email').val(email);
          $('#a0-reset_easy_password').val(password);
          $('#a0-reset_easy_repeat_password').val(password);

          bean.fire($('.a0-reset form')[0], 'submit');
        })
        .showReset(this.options);
    });

    it('should fire up an error event on username empty', function (done) {
      var auth0 = this.widget;
      var email = 'pepo@example.com';
      var password = '12345';

      this.options._isUsernameRequired = function() { return true; };

      auth0
      .once('reset error', function(err) {
        expect(err.message).to.be('username empty');
        done();
      })
      .once('reset ready', function() {
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

    it('should fire up an error event on username invalid', function (done) {
      var auth0 = this.widget;
      var username = '1.1.1.1';
      var password = '12345';

      this.options._isUsernameRequired = function() { return true; };

      auth0
      .once('reset error', function(err) {
        expect(err.message).to.be('username invalid');
        done();
      })
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(username);
        $('#a0-reset_easy_password').val(password);
        $('#a0-reset_easy_repeat_password').val(password);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

  });

  describe('Events (new)', function() {
    it('should fire up an submit event on submit', function(done) {
      var auth0 = this.widget;
      var email = 'pepo@example.com';

      this.client.changePassword = function() {};

      auth0
      .once('reset submit', function(opts) {
        expect(opts).to.not.be(undefined);
        done();
      })
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(email);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });


    it('should fire up an error event on email invalid', function(done) {
      var auth0 = this.widget;
      var email = 'pepo!&&*example.com';

      auth0
      .once('reset error', function(err) {
        expect(err.message).to.be('email invalid');
        done();
      })
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(email);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

    it('should fire up an error event on username empty', function (done) {
      var auth0 = this.widget;
      var email = 'pepo@example.com';

      this.options._isUsernameRequired = function() { return true; };

      auth0
      .once('reset error', function(err) {
        expect(err.message).to.be('username empty');
        done();
      })
      .once('reset ready', function() {

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

    it('should fire up an error event on username invalid', function (done) {
      var auth0 = this.widget;
      var username = '1.1.1.1';

      this.options._isUsernameRequired = function() { return true; };

      auth0
      .once('reset error', function(err) {
        expect(err.message).to.be('username invalid');
        done();
      })
      .once('reset ready', function() {
        $('#a0-reset_easy_email').val(username);

        bean.fire($('.a0-reset form')[0], 'submit');
      })
      .showReset(this.options);
    });

  });

});
