/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__auth0jp*', 'Auth0*']);

/**
 * Test sign up
 */

describe('sign up', function () {

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
      done();
    }
  });

  afterEach(function (done) {
    global.window.location.hash = '';
    global.window.Auth0 = null;
    this.auth0.hide(done)
  });

  describe('when requires_username is enabled', function() {

    beforeEach(function() {
      // Mock `_isUsernameRequired` so it asumes database has enabled
      // requires_username on it's configuration
      this.options._isUsernameRequired = function() { return true; };
    });

    it('should show username and email inputs', function (done) {
      this.auth0
      .once('signup ready', function() {
        expect($('#a0-signup_easy_email')).to.not.be.empty();
        expect($('#a0-signup_easy_username')).to.not.be.empty();
        done();
      })
      .showSignup(this.options);
    });

    it('should invalidate an empty username', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('pepo@example.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');

        expect($('.a0-username .a0-error-input')).to.not.be.empty();
        done();
      })
      .showSignup(this.options);
    });

    it('should invalidate an invalid username', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_username').val('1.1.1.1');
        $('#a0-signup_easy_email').val('pepo@example.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');

        expect($('.a0-username .a0-error-input')).to.not.be.empty();
        done();
      })
      .showSignup(this.options);
    });

    it('should still invalidate an invalid email', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_username').val('pepe');
        $('#a0-signup_easy_email').val('pepo@example');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');

        expect($('.a0-email .a0-error-input')).to.not.be.empty();
        done();
      })
      .showSignup(this.options);
    });

    it('should send valid username and email on submit', function (done) {
      var auth0 = this.auth0;
      var username = 'pepe';
      var email = 'pepo@example.com';
      var password = '12345';

      auth0.$auth0.signup = function(options) {
        expect(options.email).to.equal(email);
        expect(options.username).to.equal(username);
        expect(options.password).to.equal(password);
        done();
      }

      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_username').val(username);
        $('#a0-signup_easy_email').val(email);
        $('#a0-signup_easy_password').val(password);

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .showSignup(this.options);
    });
  });

  it('should show the loading pane', function (done) {
    var auth0 = this.auth0;

    auth0
    .once('signup ready', function () {
      $('#a0-signup_easy_email').val('pepo@example.com');
      $('#a0-signup_easy_password').val('123');
      auth0.once('loading ready', function () {
        expect($('#a0-lock h1').html()).to.be(auth0.options.i18n.t('signup:title'));
        done();
      });
      bean.fire($('.a0-signup form')[0], 'submit');
    })
    .showSignup(this.options);
  });

  it('should not change to loading when server returns error', function (done) {
    var auth0 = this.auth0;

    auth0
    .once('signup ready', function () {
      $('#a0-signup_easy_email').val('pepo@example.com');
      $('#a0-signup_easy_password').val('123');
      bean.fire($('.a0-signup form')[0], 'submit');
    })
    .once('_error', function () {
      expect($('.a0-error').html()).to.be(auth0.options.i18n.t('signup:serverErrorText'));
      done();
    })
    .showSignup(this.options);
  });

  describe('signup with social buttons', function() {
    it('should show social big buttons with signup text when specified', function(done) {
      var auth0 = this.auth0;

      auth0
      .once('signup ready', function() {
        expect($('.a0-header h1').text()).to.be(auth0.options.i18n.t('signup').title);
        expect($('.a0-googleplus span').text()).to.be(auth0.options.i18n.t('signupSocialButton').replace('{connection:title}', 'Google'));
        expect($('.a0-windows span').text()).to.be(auth0.options.i18n.t('signupSocialButton').replace('{connection:title}', 'Microsoft Account'));
        done();
      })
      .showSignup({
        socialBigButtons: true
      });
    });

    it('should show a separator between social and db connections', function(done) {
      var auth0 = this.auth0;

      auth0
      .once('signup ready', function() {
        expect($('.a0-instructions').hasClass('a0-hide')).to.be(false);
        expect($('.a0-inputs').hasClass('a0-hide')).to.be(false);
        expect($('.a0-action').hasClass('a0-hide')).to.be(false);
        expect($('.a0-separator').hasClass('a0-hide')).to.be(false);
        done();
      })
      .showSignup();
    });

    it('should only show social buttons when no database connection in list', function(done) {
      var auth0 = this.auth0;

      auth0
      .once('signup ready', function() {
        expect($('.a0-header h1').text()).to.be(auth0.options.i18n.t('signup').title);
        expect($('.a0-instructions').hasClass('a0-hide')).to.be(true);
        expect($('.a0-inputs').hasClass('a0-hide')).to.be(true);
        expect($('.a0-action').hasClass('a0-hide')).to.be(true);
        expect($('.a0-separator').hasClass('a0-hide')).to.be(true);
        done();
      })
      .showSignup({
        connections: ['google-oauth2', 'windowslive']
      });
    });

    it('should only show social buttons with signup text when no database connection in list', function(done) {
      var auth0 = this.auth0;

      auth0
      .once('signup ready', function() {
        expect($('.a0-header h1').text()).to.be(auth0.options.i18n.t('signup').title);
        expect($('.a0-googleplus span').text()).to.be(auth0.options.i18n.t('signupSocialButton').replace('{connection:title}', 'Google'));
        expect($('.a0-windows span').text()).to.be(auth0.options.i18n.t('signupSocialButton').replace('{connection:title}', 'Microsoft Account'));
        expect($('.a0-instructions').hasClass('a0-hide')).to.be(true);
        expect($('.a0-inputs').hasClass('a0-hide')).to.be(true);
        expect($('.a0-action').hasClass('a0-hide')).to.be(true);
        expect($('.a0-separator').hasClass('a0-hide')).to.be(true);
        done();
      })
      .showSignup({
        socialBigButtons: true,
        connections: ['google-oauth2', 'windowslive']
      });
    });
  });

  it('should signin with social connection', function (done) {
    this.auth0.$auth0.login = function (options) {
      expect(options.connection).to.equal('google-oauth2');
      expect(options.username).to.be(undefined);
      done();
    };

    this.auth0
    .once('signup ready', function() {
      bean.fire($('.a0-signup [data-strategy="google-oauth2"]')[0], 'click');
    })
    .showSignup(this.options);
  });

  describe('signup events', function() {
    it('should fire up submit event when the form is submitted', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('tehsis@gmail.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup submit', function(options) {
        expect(options).not.to.be(undefined);
        done();
      })
      .showSignup(this.options);
  });

    it('should fire up error event when email is invalid', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('tehsis');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup error', function(err) {
        expect(err.message).to.be('email invalid');
        done();
      })
      .showSignup(this.options);
    });

    it('should fire up error event when email is empty', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup error', function(err) {
        expect(err.message).to.be('email empty');
        done();
      })
      .showSignup(this.options);
    });

    it('should fire up error event when password is empty', function (done) {
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('tehsis@gmail.com');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup error', function(err) {
        expect(err.message).to.be('password empty');
        done();
      })
      .showSignup(this.options);
    });

    it('should fire up error event when username is required and is empty', function (done) {
      this.options._isUsernameRequired = function() { return true; };
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('tehsis@gmail.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup error', function(err) {
        expect(err.message).to.be('username empty');
        done();
      })
      .showSignup(this.options);
    });

    it('should fire up error event when username is required and is invalid', function (done) {
      this.options._isUsernameRequired = function() { return true; };
      var auth0 = this.auth0;
      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_username').val('sdfasf@$$--');
        $('#a0-signup_easy_email').val('tehsis@gmail.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup error', function(err) {
        expect(err.message).to.be('username invalid');
        done();
      })
      .showSignup(this.options);
    });

    it('should fire up success event if there was no error', function (done) {
      var auth0 = this.auth0;

      var callback;

      this.options.loginAfterSignup = false;

      auth0.$auth0.signup = function(options, cb) {
        callback = cb;
        callback();
      };

      auth0
      .once('signup ready', function() {
        $('#a0-signup_easy_email').val('john@fabrikam.com');
        $('#a0-signup_easy_password').val('123');

        bean.fire($('.a0-signup form')[0], 'submit');
      })
      .once('signup success', function() {
        expect(callback).to.not.throwException();
        done();
      })
      .showSignup(this.options);
    });

    it('should fireup an emit event when signing up with social connection', function (done) {
      this.auth0.$auth0.login = function () {};

      this.auth0
      .once('signup submit', function(opts) {
        expect(opts).to.not.be(undefined);
        done();
      })
      .once('signup ready', function() {
        bean.fire($('.a0-signup [data-strategy="google-oauth2"]')[0], 'click');
      })
      .showSignup(this.options);
    });
  });
});
