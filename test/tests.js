describe('Auth0-Widget', function () {

  afterEach(function () {
    global.window.location.hash = "";
  });

  describe('Sign In', function () {
    it('should work', function (done) {
      var widget = new Auth0Widget({
        domain:      'mdocs.auth0.com',
        clientID:    '0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 
        callbackURL: 'http://localhost:3000/'
      });

      widget.show();
      done();
    });
  });

  describe('Sign Up with auth0 connection', function () {
    // TODO
  });

  describe('Change Password with auth0 connection', function () {
    // TODO
  });

});
