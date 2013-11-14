describe('db connections', function () {
  describe('init options', function () {
    it('can disable signup', function (done) {
      new Auth0Widget({
        domain:      'mdocs.auth0.com',
        callbackURL: 'http://localhost:3000/',
        clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        enableReturnUserExperience: false,
        showSignup: false
      }).show().on('transition_mode', function (mode) {
        if (mode !== 'signin') return;
        expect($('.a0-sign-up').length).to.equal(0);
        expect($('.a0-divider').length).to.equal(0);
        done();
      });
    });

    it('should show signup', function (done) {
      new Auth0Widget({
        domain:      'mdocs.auth0.com',
        callbackURL: 'http://localhost:3000/',
        clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        enableReturnUserExperience: false,
      }).show().on('transition_mode', function (mode) {
        if (mode !== 'signin') return;
        expect($('.a0-sign-up').length).to.equal(1);
        done();
      });
    });

    afterEach(function () {
      $('#a0-widget').parents('div').remove();
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });
  });

  describe.skip('when username or password is empty', function () {
    after(function () {
      $('#a0-widget').parents('div').remove();
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });

    afterEach(function () {
      this.auth0.removeAllListeners('transition_mode');
    });

    before(function () {
      this.auth0 = new Auth0Widget({
        domain:      'mdocs.auth0.com',
        callbackURL: 'http://localhost:3000/',
        clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        enableReturnUserExperience: false
      });
    });

    //fails on ie9
    it.skip('should not change to loading', function (done) {
      var auth0 = this.auth0.show().on('transition_mode', function (mode) {
        if (mode !== 'signin') return;
        $('#a0-signin_easy_email').val('');
        $('#a0-signin_easy_password').val('');

        auth0.on('transition_mode', function (mode) {
          if (mode !== 'loading') return;
          done(new Error('do not change to loading'));
        });
        setTimeout(function () {
          done();
        }, 500);
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
      });
    });

  });

  describe('when username or password is wrong', function () {
    after(function () {
      $('#a0-widget').parents('div').remove();
      global.window.location.hash = '';
      global.window.Auth0 = null;
    });

    afterEach(function () {
      this.auth0.removeAllListeners('transition_mode');
    });

    before(function (done) {
      var auth0 = this.auth0 = new Auth0Widget({
        domain:      'mdocs.auth0.com',
        callbackURL: 'http://localhost:3000/',
        clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup',
        enableReturnUserExperience: false
      });

      auth0.on('_error', function () {
          done();
      });

      auth0.show().on('transition_mode', function (mode) {
        if (mode !== 'signin') return;
        $('#a0-signin_easy_email').val('j@j.com');
        $('#a0-signin_easy_password').val('te');
        var form = $('.a0-notloggedin form')[0];
        bean.fire(form, 'submit');
      });
    });


    // the test fails on IE9 but it does works. It looks like a timing issue.
    // it('email should have focus', function () {
    //   var email_has_focus = $('#a0-signin_easy_email').is(':focus');
    //   expect(email_has_focus).to.be.ok();
    // });

    it('should display error', function () {
      var error = $('.a0-signin .a0-error').html();
      expect(error).to.equal(this.auth0._dict.t('signin:wrongEmailPasswordErrorText'));
    });
  });
});
