describe('auth0-Widget', function () {

  var domain =      'abc.auth0.com';
  var clientID =    '123456789';
  var callbackURL = 'http://myapp.com/callback';
  var widget, client;

  var removeWidget = function () {
    $('#a0-widget').remove();
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
    client.getSSOData = function (withAd, callback) {
      callback(null, { sso: false });
    };
  });

  afterEach(function () {
    global.window.location.hash = '';
    removeWidget();
  });

  it('should initialize client with callbackOnLocationHash', function () {
    expect(client._callbackOnLocationHash).to.be(true);
  });

  it('should remove widget when user close it', function (done) {
    widget
    .once('ready', function () {
      bean.fire($('#a0-widget a.a0-close')[0], 'click');
    })
    .once('hidden', function () {
      expect($('#a0-widget').length).to.equal(0);
      done();
    })
    .show();
  });

  it('should show only notloggedin view if SSO data is not present', function (done) {
    widget
    .once('ready', function () {
      expect($('#a0-widget .a0-notloggedin')[0]).to.exist;
      expect($('#a0-widget .a0-loggedin')[0]).to.not.exist;
      expect($('#a0-widget .a0-signup')[0]).to.not.exist;
      expect($('#a0-widget .a0-reset')[0]).to.not.exist;
      done();
    })
    .show();

  });

  it('should show only loggedin view with SSO data (social) if it is present', function (done) {
      client.getSSOData = function (withAd, callback) {
        callback(null, {
          sso: true,
          lastUsedUsername: 'john@gmail.com',
          lastUsedConnection: { strategy: 'google-oauth2', connection: 'google-oauth2' }
        });
      };

      widget
      .once('ready', function () {
        expect($('#a0-widget .a0-notloggedin')[0]).to.not.exist;
        expect($('#a0-widget .a0-loggedin')[0]).to.exist;
        expect($('#a0-widget .a0-signup')[0]).to.not.exist;
        expect($('#a0-widget .a0-reset')[0]).to.not.exist;
        expect($('#a0-widget .a0-loggedin .a0-strategy [data-strategy]').attr('title')).to.equal('john@gmail.com (Google)');
        done();
      })
      .show();
  });

  it('should use only specified connections', function (done) {
    widget
    .once('ready', function () {
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
    })
    .show({
      connections: ['twitter', 'google-oauth2', 'invalid-connection', 'google-app1', 'dbTest', 'google-app3']
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

      expect(widget._options.cdn).to.equal('https://abc.contoso.com/w2/');
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

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="google-oauth2"]')[0], 'click');
      })
      .show();
    });

    it('should signin with social connection specifying state', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('google-oauth2');
        expect(options.username).to.not.exist;
        done();
      };

      widget
      .once('ready', function (mode) {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="google-oauth2"]')[0], 'click');
      })
      .show({ state: 'foo' });
    });

    it('should send offline_mode as true to the client', function (done) {
      client.login = function (options) {
        expect(options.offline_mode).to.equal(true);
        done();
      };

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="google-oauth2"]')[0], 'click');
      })
      .show({ offline_mode: true });
    });

    it('should signin with social connection specifying connection_scope if one is provided', function (done) {
      var connection_scopes = {
        'twitter': ['grant1', 'grant2'],
        'google-oauth2': ['grant3'] };
      var connections = ['twitter', 'google-oauth2'];

      client.login = function (options) {
        expect(options.connection).to.equal('twitter');
        expect(options.username).to.not.exist;
        expect(options.connection_scope.length).to.equal(2);
        expect(options.connection_scope[0]).to.equal('grant1');
        expect(options.connection_scope[1]).to.equal('grant2');
        expect(options.connection_scopes).to.not.exist;

        done();
      };

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="twitter"]')[0], 'click');
      })
      .show({ connections: connections, connection_scopes: connection_scopes });
    });

    it('should signin with social connection with undefined connection_scope if one is not provided (does not throw)', function (done) {
      var connection_scopes = {
        'twitter': ['grant1', 'grant2'] };
      var connections = ['twitter', 'google-oauth2'];

      client.login = function (options) {
        expect(options.connection).to.equal('google-oauth2');
        expect(options.username).to.not.exist;
        expect(options.connection_scope).to.not.exist;
        expect(options.connection_scopes).to.not.exist;

        done();
      };

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="google-oauth2"]')[0], 'click');
      })
      .show({ connections: connections, connection_scopes: connection_scopes });
    });

    it('should signin with database connection (auth0 strategy)', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget
      .once('ready', function () {
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input').val('john@fabrikam.com');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-password input').val('xyz');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show({ state: 'foo' });
    });

    it('should signin with database connection (auth0 strategy) specifying state', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget
      .once('ready', function () {
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input').val('john@fabrikam.com');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-password input').val('xyz');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show({ state: 'foo' });
    });

    it('should signin with adldap connection (auth0-adldap strategy)', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('adldap');
        expect(options.username).to.equal('peter');
        expect(options.password).to.equal('zzz');
        done();
      };

      widget
      .once('ready', function() {
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input').val('peter@litware.com');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-password input').val('zzz');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show({
        userPwdConnectionName: 'adldap'
      });
    });

    it('should signin with enterprise connection', function (done) {
      client.login = function (options) {
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      widget
      .once('ready', function () {
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input').val('mary@contoso.com');
        // we need this to check if password is ignored or not in validation
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input')[0], 'input');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show();
    });

    it('should signin with enterprise connection specifying extraParameters', function (done) {
      client.login = function (options) {
        expect(options.state).to.equal('foo');
        expect(options.connection).to.equal('contoso');
        expect(options.username).to.not.exist;
        done();
      };

      widget
      .once('ready', function () {
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input').val('mary@contoso.com');
        // we need this to check if password is ignored or not in validation
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-email input')[0], 'input');
        $('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show({ state: 'foo' });
    });

    it('should send extraParameters to login', function (done) {
      client.login = function (options) {
        expect(options.access_type).to.equal('offline');
        done();
      };

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-iconlist [data-strategy="google-oauth2"]')[0], 'click');
      })
      .show({ extraParameters: { access_type: 'offline' } });
    });
  });

  describe('Sign Up with database connection', function () {

    it('should show only signup view when user clicks on signup button', function (done) {
      widget
      .once('signin ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action a.a0-sign-up')[0], 'click');
      })
      .once('signup ready', function (){
        expect($('#a0-widget .a0-notloggedin')[0]).to.not.exist;
        expect($('#a0-widget .a0-loggedin')[0]).to.not.exist;
        expect($('#a0-widget .a0-reset')[0]).to.not.exist;
        expect($('#a0-widget .a0-signup')[0]).to.exist;
        done();
      })
      .show();
    });

    it('should call auth0.a0-signup', function (done) {
      client.signup = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget
      .once('signin ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action a.a0-sign-up')[0], 'click');
      })
      .once('signup ready', function () {
        $('#a0-widget .a0-signup .a0-emailPassword .a0-email input').val('john@fabrikam.com');
        $('#a0-widget .a0-signup .a0-emailPassword .a0-password input').val('xyz');
        $('#a0-widget .a0-signup .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show();
    });
  });

  describe('Change Password with database connection', function () {
    it('should show reset view when user clicks on change password button', function (done) {
      widget
      .once('signin ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action a.a0-forgot-pass')[0], 'click');
      })
      .once('reset ready',function () {
        expect($('#a0-widget .a0-notloggedin')[0]).to.not.exist;;
        expect($('#a0-widget .a0-loggedin')[0]).to.not.exist;;
        expect($('#a0-widget .a0-signup')[0]).to.not.exist;;
        expect($('#a0-widget .a0-reset')[0]).to.exist;;
        done();
      })
      .show();
    });

    it('should call auth0.changePassword', function (done) {
      client.changePassword = function (options) {
        expect(options.connection).to.equal('dbTest');
        expect(options.username).to.equal('john@fabrikam.com');
        expect(options.password).to.equal('xyz');
        done();
      };

      widget
      .once('ready', function () {
        bean.fire($('#a0-widget .a0-notloggedin .a0-emailPassword .a0-action a.a0-forgot-pass')[0], 'click');
      })
      .once('reset ready', function () {
        $('#a0-widget .a0-reset .a0-emailPassword .a0-email input').val('john@fabrikam.com');
        $('#a0-widget .a0-reset .a0-emailPassword .a0-password input').val('xyz');
        $('#a0-widget .a0-reset .a0-emailPassword .a0-repeatPassword input').val('xyz');
        $('#a0-widget .a0-reset .a0-emailPassword .a0-action button.a0-primary').trigger('click');
      })
      .show();
    });
  });

});
