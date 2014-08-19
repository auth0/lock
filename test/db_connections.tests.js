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
  describe('.show() options', function () {
    it('should disable signup', function (done) {
      this.widget = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
      this.widget.once('ready', function () {
        expect($('.a0-sign-up').length).to.equal(0);
        expect($('.a0-divider').length).to.equal(0);
        done();
      }).show({
        callbackURL: 'http://localhost:3000/',
        disableSignupAction: true,
        rememberLastLogin: false
      });
    });

    it('should show signup', function (done) {
      this.widget = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
      this.widget.once('ready', function () {
        expect($('.a0-sign-up').length).to.equal(1);
        done();
      }).show({
        callbackURL: 'http://localhost:3000/',
        rememberLastLogin: false
      });
    });

    afterEach(function () {
      this.widget.hide();
      this.widget = null;
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });
  });

  describe.skip('when username or password is empty', function () {
    after(function () {
      $('#a0-lock').parents('div').remove();
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });

    before(function () {
      this.auth0 = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
    });

    //fails on ie9
    it.skip('should not change to loading', function (done) {
      var auth0 = this.auth0;

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
      .show({
        callbackURL: 'http://localhost:3000/',
        rememberLastLogin: false
      });
    });

  });

  describe('when username or password is wrong', function () {
    after(function () {
      $('#a0-lock').parents('div').remove();
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });

    before(function (done) {
      this.auth0 = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
      done();
    });


    // the test fails on IE9 but it does work. It looks like a timing issue.
    // it('email should have focus', function () {
    //   var email_has_focus = $('#a0-signin_easy_email').is(':focus');
    //   expect(email_has_focus).to.be.ok();
    // });

    it('should display error', function (done) {
      var error = $('.a0-signin .a0-error').html();
      var auth0 = this.auth0;
      var submitted = false;
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
          done();
        }, 0);
      })
      .showSignin({
        callbackURL: 'http://localhost:3000/',
        connections: [ 'foobar' ],
        rememberLastLogin: false
      });
    });
  });
});
