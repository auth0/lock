describe('Auth0-Widget', function () {

  var domain =      'abc.auth0.com';
  var clientID =    '123456789';
  var callbackURL = 'http://myapp.com/callback';
  var widget, client;

  var removeWidget = function () {
    $('#auth0-widget').remove();
  };

  beforeEach(function () {
    Auth0Widget.prototype._getApp = function () {
      this._client = {
        strategies: [
          {
            "name": "facebook",
            "connections": [{ "name": "facebook", "domain": "" }]
          },
          {
            "name": "twitter",
            "connections": [{ "name": "twitter", "domain": "" }]
          },
          {
            "name": "google-oauth2",
            "connections": [{ "name": "google-oauth2", "domain": "" }]
          },
          {
            "name": "adfs",
            "connections": [{ "name": "contoso", "domain": "contoso.com" }]
          },
          {
            "name": "auth0-adldap",
            "connections": [{ "name": "adldap", "domain": "litware.com" }]
          },
          {
            "name": "auth0",
            "connections": [
              { "name": "dbTest", "domain": "", "showSignup": true, "showForgot": true },
              { "name": "Username-Password-Authentication", "domain": "" }
            ]
          },
          {
            "name": "google-apps",
            "connections": [
              { "name": "google-app1", "domain": "" },
              { "name": "google-app2", "domain": "" },
              { "name": "google-app3", "domain": "" }
            ]
          }
        ]
      };
    };

    widget = new Auth0Widget({
      domain:      domain,
      clientID:    clientID,
      callbackURL: callbackURL,
      callbackOnLocationHash: true
    });

    client = widget._auth0;
    client.getSSOData = function (callback) {
      callback(null, { sso: false });
    };
  });

  afterEach(function () {
    global.window.location.hash = '';
    removeWidget();
  });

  it('should initialize client with callbackOnLocationHash', function () {
    expect(client._callbackOnLocationHash).to.be.true;
  });

  it('should hide widget when user close it', function (done) {
    widget.show(function () {
      bean.fire($('#auth0-widget header a.close')[0], 'click');

      setTimeout(function () {
        expect($('#auth0-widget').css('display')).to.equal('none');
        done();
      }, 600);
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

  it('should show only loggedin view with SSO data (enterprise) if it is present', function (done) {
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

  it('should show only loggedin view with SSO data (social) if it is present', function (done) {
      client.getSSOData = function (callback) {
        callback(null, {
          sso: true,
          lastUsedUsername: 'john@gmail.com',
          lastUsedConnection: { strategy: 'google-oauth2', connection: 'google-oauth2' }
        });
      };

      widget.show(function () {
        expect($('#auth0-widget .notloggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin').css('display')).to.equal('block');
        expect($('#auth0-widget .signup').css('display')).to.equal('none');
        expect($('#auth0-widget .reset').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin .strategy span').html()).to.equal('john@gmail.com');
        expect($('#auth0-widget .loggedin .strategy span').attr('title')).to.equal('john@gmail.com (Google)');
        done();
      });
    });

  it('should use only specified connections', function (done) {
    widget.show({
      connections: ['twitter', 'google-oauth2', 'invalid-connection', 'google-app1', 'dbTest', 'google-app3']
    },
    function () {
      expect(widget._client.strategies.length).to.equal(4);

      expect(widget._client.strategies[0].name).to.equal('twitter');
      expect(widget._client.strategies[0].connections.length).to.equal(1);
      expect(widget._client.strategies[0].connections[0].name).to.equal('twitter');

      expect(widget._client.strategies[1].name).to.equal('google-oauth2');
      expect(widget._client.strategies[1].connections.length).to.equal(1);
      expect(widget._client.strategies[1].connections[0].name).to.equal('google-oauth2');

      expect(widget._client.strategies[2].name).to.equal('auth0');
      expect(widget._client.strategies[2].connections.length).to.equal(1);
      expect(widget._client.strategies[2].connections[0].name).to.equal('dbTest');

      expect(widget._client.strategies[3].name).to.equal('google-apps');
      expect(widget._client.strategies[3].connections.length).to.equal(2);
      expect(widget._client.strategies[3].connections[0].name).to.equal('google-app1');
      expect(widget._client.strategies[3].connections[1].name).to.equal('google-app3');

      done();
    });
  });

  describe('When assetsUrl option is not specified', function () {
    it('should use domain as assetsUrl if domain is not *.auth0.com', function () {
      var widget = new Auth0Widget({
        domain:      'abc.contoso.com',
        clientID:    clientID,
        callbackURL: callbackURL
      });

      expect(widget._options.assetsUrl).to.equal('https://abc.contoso.com/');
    });

    it('should use default assetsUrl if domain is *.auth0.com', function () {
      var widget = new Auth0Widget({
        domain:      'abc.auth0.com:3000',
        clientID:    clientID,
        callbackURL: callbackURL
      });

      expect(widget._options.assetsUrl).to.equal('https://s3.amazonaws.com/assets.auth0.com/');
    });
  });

  describe('When cdn option is not specified', function () {
    it('should use domain as cdn if domain is not *.auth0.com', function () {
      var widget = new Auth0Widget({
        domain:      'abc.contoso.com',
        clientID:    clientID,
        callbackURL: callbackURL
      });

      expect(widget._options.cdn).to.equal('https://abc.contoso.com/');
    });

    it('should use default cdn if domain is *.auth0.com', function () {
      var widget = new Auth0Widget({
        domain:      'abc.auth0.com',
        clientID:    clientID,
        callbackURL: callbackURL
      });

      expect(widget._options.cdn).to.equal('https://d19p4zemcycm7a.cloudfront.net/w2/');
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
        bean.fire($('#auth0-widget .notloggedin .iconlist span[data-strategy="google-oauth2"]')[0], 'click');
      });
    });

    it('should signin with social connection specifying state', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('google-oauth2');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show({ state: 'foo' }, function () {
        bean.fire($('#auth0-widget .notloggedin .iconlist span[data-strategy="google-oauth2"]')[0], 'click');
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

    it('should signin with database connection (auth0 strategy) specifying state', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget.show({ state: 'foo' }, function () {
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

    it('should signin with enterprise connection specifying extraParameters', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show({ state: 'foo' }, function () {
        $('#auth0-widget .notloggedin .emailPassword .email input').val('mary@contoso.com');
        $('#auth0-widget .notloggedin .emailPassword .action button.primary').trigger('click');
      });
    });

    it('should signin automatically if exists only one enterprise connection (but not userAndPass strategy)', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show({ connections: ['contoso'] });
    });

    it('should signin automatically if exists only one social connection', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('google-oauth2');
        expect(options.username).to.not.exist;
        done();
      };

      widget.show({ connections: ['google-oauth2'] });
    });
  });

  describe('Sign Up with database connection', function () {
    it('should show only signup view when user clicks on signup button', function (done) {
      widget.show(function () {
        bean.fire($('#auth0-widget .notloggedin .emailPassword .action a.sign-up')[0], 'click');
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
        bean.fire($('#auth0-widget .notloggedin .emailPassword .action a.sign-up')[0], 'click');
        $('#auth0-widget .signup .emailPassword .email input').val('john@fabrikam.com');
        $('#auth0-widget .signup .emailPassword .password input').val('xyz');
        $('#auth0-widget .signup .emailPassword .action button.primary').trigger('click');
      });
    });
  });

  describe('Change Password with database connection', function () {
    it('should show reset view when user clicks on change password button', function (done) {
      widget.show(function () {
        bean.fire($('#auth0-widget .notloggedin .emailPassword .action a.forgot-pass')[0], 'click');
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
        bean.fire($('#auth0-widget .notloggedin .emailPassword .action a.forgot-pass')[0], 'click');
        $('#auth0-widget .reset .emailPassword .email input').val('john@fabrikam.com');
        $('#auth0-widget .reset .emailPassword .password input').val('xyz');
        $('#auth0-widget .reset .emailPassword .repeatPassword input').val('xyz');
        $('#auth0-widget .reset .emailPassword .action button.primary').trigger('click');
      });
    });
  });

});
