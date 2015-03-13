/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__auth0jp*', 'Auth0*']);

/**
 * Test db connections
 */

describe('db connections', function () {
  beforeEach(function(done) {
    this.widget = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
    this.options = {
      rememberLastLogin: false
    };
    done();
  });

  afterEach(function (done) {
    global.window.location.hash = '';
    global.window.Auth0 = null;
    this.options = null;
    if (this.widget) return this.widget.hide(done);
    $('#a0-lock').remove();
    done();
  });

  describe('.show() options', function () {

    it('should disable signup', function (done) {
      this.options.disableSignupAction = true;

      this.widget.once('ready', function () {
        expect($('.a0-sign-up').length).to.equal(0);
        expect($('.a0-divider').length).to.equal(0);
        done();
      }).show(this.options);
    });

    it('should show signup', function (done) {
      this.widget.once('ready', function () {
        expect($('.a0-sign-up').length).to.equal(1);
        done();
      }).show(this.options);
    });

  });

  describe.skip('when username or password is empty', function () {
    //fails on ie9
    it.skip('should not change to loading', function (done) {
      var auth0 = this.widget;

      auth0
      .once('ready', function () {
        $('#a0-signin_easy_email').val('');
        $('#a0-signin_easy_password').val('');

        auth0.once('loading ready', function () {
          done(new Error('do not change to loading'));
        });
        setTimeout(function () {
          done();
        }, 500);
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
      })
      .show(this.options);
    });

  });

  describe('when username or password is wrong', function () {
    // the test fails on IE9 but it does work. It looks like a timing issue.
    it.skip('email should have focus', function (done) {
      var auth0 = this.widget;
      this.options.focusInput = true;

      auth0
      .once('ready', function() {
        expect($('#a0-signin_easy_email:focus')).to.not.be.empty();
        done();
      })
      .showSignin(this.options);
    });

    it('should display error', function (done) {
      var error = $('.a0-signin .a0-error').html();
      var auth0 = this.widget;
      var submitted = false;

      this.options.connections = [ 'foobar' ];

      auth0
      .once('ready', function () {
        $('#a0-signin_easy_email').val('j@j.com');
        $('#a0-signin_easy_password').val('yy');
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
        submitted = true;
      })
      .on('signin ready', function() {
        if (!submitted) return;
        setTimeout(function() {
          expect($('.a0-email .a0-input-box').hasClass('a0-error-input')).to.equal(true);
          expect($('.a0-password .a0-input-box').hasClass('a0-error-input')).to.equal(true);
          expect($('.a0-error').text()).to.equal(auth0.options.i18n.t('signin:wrongEmailPasswordErrorText'));
          done();
        }, 0);
      })
      .showSignin(this.options);
    });

    it('should remove error if the user changes the view', function(done) {
      var error = $('.a0-signin .a0-error').html();
      var auth0 = this.widget;
      var submitted = false;

      this.options.connections = [ 'foobar' ];

      auth0
      .once('ready', function () {
        $('#a0-signin_easy_email').val('j@j.com');
        $('#a0-signin_easy_password').val('yy');
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
        submitted = true;
      })
      .on('signin ready', function() {
        if (!submitted) return;
        setTimeout(function() {
          var signup_button = $('.a0-sign-up')[0];
          expect($('.a0-email .a0-input-box').hasClass('a0-error-input')).to.equal(true);
          expect($('.a0-password .a0-input-box').hasClass('a0-error-input')).to.equal(true);
          expect($('.a0-error').text()).to.equal(auth0.options.i18n.t('signin:wrongEmailPasswordErrorText'));
          bean.fire(signup_button, 'click');
        }, 0);
      })
      .on('signup ready', function() {
        expect($('.a0-error').text()).to.equal('');
        done();
      })
      .show(this.options);
    });
  });

  describe('when requires_username is enabled', function() {
    beforeEach(function(done) {
      // Mock `_isUsernameRequired` so it asumes database has enabled
      // requires_username on it's configuration
      this.options._isUsernameRequired = function() { return true; };
      done();
    });

    it('should handle a valid username', function (done) {
      var submitted = false;
      var auth0 = this.widget;

      auth0
      .once('ready', function () {
        $('#a0-signin_easy_email').val('pepo');
        $('#a0-signin_easy_password').val('yy');
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
        submitted = true;
      })
      .on('signin ready', function() {
        if (!submitted) return;
        expect($('.a0-email .a0-input-box').hasClass('a0-error-input')).to.equal(false);
        done();
      })
      .showSignin(this.options);
    });

  });
});
