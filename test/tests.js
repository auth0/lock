describe('Auth0-Widget', function () {

  var domain =      'abc.auth0.com';
  var clientID =    '123456789';
  var callbackURL = 'http://myapp.com/callback';
  var widget, client;

  var removeWidget = function () {
    $('#auth0-widget').remove();
  };

  beforeEach(function () {
    widget = new Auth0Widget({
      domain:      domain,
      clientID:    clientID, 
      callbackURL: callbackURL
    });

    client = widget.getClient();
    client.getConnections = function (callback) {
      callback(null, [
        { name: 'google-oauth2', strategy: 'google-oauth2', status: true },
        { name: 'facebook', strategy: 'facebook', status: true },
        { name: 'contoso', strategy: 'adfs', status: true, domain: 'contoso.com' },
        { name: 'adldap', strategy: 'auth0-adldap', status: true, domain: 'litware.com' },
        { name: 'dbTest', strategy: 'auth0', status: true, domain: '', showSignup: true, showForgot: true }
      ]);
    };

    client.getSSOData = function (callback) {
      callback(null, { sso: false });
    };
  });

  afterEach(function () {
    global.window.location.hash = '';
    removeWidget();
  });

  it('should hide widget when user close it', function (done) {
    widget.show(function () {
      $('#auth0-widget header a.close')[0].click();

      setTimeout(function () {
        expect($('#auth0-widget').css('display')).to.equal('none');
        done();
      }, 700);
    });
  });

  it('should show only notloggedin view if SSO data is not present', function (done) {
    widget.show(function () {
      expect($('#auth0-widget .notloggedin').css('display')).to.equal('block');
      expect($('#auth0-widget .loggedin').css('display')).to.equal('none');
      expect($('#auth0-widget .signup').css('display')).to.equal('none');
      expect($('#auth0-widget .reset').css('display')).to.equal('none');
      done();
    });
  });

  it('should show only loggedin view with SSO data if it is present', function (done) {
    client.getSSOData = function (callback) {
      callback(null, { 
        sso: true, 
        lastUsedUsername: 'john@fabrikam.com', 
        lastUsedConnection: { strategy: 'auth0', connection: 'dbTest' }
      });
    };

    widget.show(function () {
      expect($('#auth0-widget .notloggedin').css('display')).to.equal('none');
      expect($('#auth0-widget .loggedin').css('display')).to.equal('block');
      expect($('#auth0-widget .signup').css('display')).to.equal('none');
      expect($('#auth0-widget .reset').css('display')).to.equal('none');
      expect($('#auth0-widget .loggedin .email input').val()).to.equal('john@fabrikam.com');
      done();
    });
  });

  describe('Sign In', function () {
    it('should signin with social connection', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('google-oauth2');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show(function () {
        $('#auth0-widget .notloggedin .iconlist span[data-strategy="google-oauth2"]').trigger('click');
      });
    });

    it('should signin with database connection (auth0 strategy)', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .email input').val('john@fabrikam.com');
        $('#auth0-widget .notloggedin .emailPassword .password input').val('xyz');
        $('#auth0-widget .notloggedin .emailPassword .action button.primary').trigger('click');
      });
    });

    it('should signin with adldap connection (auth0-adldap strategy)', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('adldap');
        expect(options.username).to.equal('peter');
        expect(options.password).to.equal('zzz');
        done();
      };

      widget.show({ 
        userPwdConnectionName: 'adldap' 
      }, function () {
        $('#auth0-widget .notloggedin .emailPassword .email input').val('peter@litware.com');
        $('#auth0-widget .notloggedin .emailPassword .password input').val('zzz');
        $('#auth0-widget .notloggedin .emailPassword .action button.primary').trigger('click');
      });
    });

    it('should signin with enterprise connection', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .email input').val('mary@contoso.com');
        $('#auth0-widget .notloggedin .emailPassword .action button.primary').trigger('click');
      });
    });

    it('should signin automatically if no social connections and only one enterprise connection', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      client.getConnections = function (callback) {
        callback(null, [
          { name: 'contoso', strategy: 'adfs', status: true, domain: 'contoso.com' }
        ]);
      };

      widget.show();
    });
  });

  describe('Sign Up with database connection', function () {
    it('should show only signup view when user clicks on signup button', function (done) {
      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .action a.sign-up')[0].click();
        expect($('#auth0-widget .notloggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .signup').css('display')).to.equal('block');
        expect($('#auth0-widget .reset').css('display')).to.equal('none');
        done();
      });
    });

    it('should call auth0.signup', function (done) {
      client.signup = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .action a.sign-up')[0].click();
        $('#auth0-widget .signup .emailPassword .email input').val('john@fabrikam.com');
        $('#auth0-widget .signup .emailPassword .password input').val('xyz');
        $('#auth0-widget .signup .emailPassword .action button.primary').trigger('click');
      });
    });
  });

  describe('Change Password with database connection', function () {
    it('should show reset view when user clicks on change password button', function (done) {
      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .action a.forgot-pass')[0].click();
        expect($('#auth0-widget .notloggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .signup').css('display')).to.equal('none');
        expect($('#auth0-widget .reset').css('display')).to.equal('block');
        done();
      });
    });

    it('should call auth0.changePassword', function (done) {
      client.changePassword = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget.show(function () {
        $('#auth0-widget .notloggedin .emailPassword .action a.forgot-pass')[0].click();
        $('#auth0-widget .reset .emailPassword .email input').val('john@fabrikam.com');
        $('#auth0-widget .reset .emailPassword .password input').val('xyz');
        $('#auth0-widget .reset .emailPassword .repeatPassword input').val('xyz');
        $('#auth0-widget .reset .emailPassword .action button.primary').trigger('click');
      });
    });
  });

});
