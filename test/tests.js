describe('Auth0-Widget', function () {

  var domain = 'mdocs.auth0.com';
  var widget = new Auth0Widget({
    domain:      domain,
    clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 
    callbackURL: 'http://localhost:3000/'
  });

  var client = widget.getClient();

  var removeWidget = function () {
    $('#auth0-widget').remove();
  };

  afterEach(function () {
    global.window.location.hash = '';
    removeWidget();
  });

  describe('Sign In', function () {
    it('should show notloggedin view if SSO data is not present', function (done) {
      client.getSSOData = function (callback) {
        callback(null, { sso: false });
      };

      widget.show(function () {
        expect($('#auth0-widget .notloggedin').css('display')).to.equal('block');
        expect($('#auth0-widget .loggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .signup').css('display')).to.equal('none');
        expect($('#auth0-widget .reset').css('display')).to.equal('none');
        done();
      });
    });

    it('should show loggedin view with SSO data if it is present', function (done) {
      client.getSSOData = function (callback) {
        callback(null, { 
          sso: true, 
          lastUsedUsername: 'john@contoso.com', 
          lastUsedConnection: { strategy: 'auth0', connection: 'contoso' }
        });
      };

      widget.show(function () {
        expect($('#auth0-widget .notloggedin').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin').css('display')).to.equal('block');
        expect($('#auth0-widget .signup').css('display')).to.equal('none');
        expect($('#auth0-widget .reset').css('display')).to.equal('none');
        expect($('#auth0-widget .loggedin .email input').val()).to.equal('john@contoso.com');
        done();
      });
    });
  });

  describe('Sign Up with auth0 connection', function () {
    // TODO
  });

  describe('Change Password with auth0 connection', function () {
    // TODO
  });

});
