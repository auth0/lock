describe('assets url', function () {

  it('should work for the us region', function () {
    var lock = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.auth0.com');
    expect(lock.getAssetsUrl()).to.equal('https://cdn.auth0.com/');
  });

  it('should work for the eu region', function () {
    var lock = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'mdocs.eu.auth0.com');
    expect(lock.getAssetsUrl()).to.equal('https://cdn.eu.auth0.com/');
  });

  it('should work return the server domain name for non-auth0 domains', function () {
    var lock = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'login.lock-test.com');
    expect(lock.getAssetsUrl()).to.equal('https://login.lock-test.com/');
  });

  it('should work return the server domain name for nested auth0 domains', function () {
    var lock = new Auth0Lock('0HP71GSd6PuoRYJ3DXKdiXCUUdGmBbup', 'login.test1234.auth0.com');
    expect(lock.getAssetsUrl()).to.equal('https://login.test1234.auth0.com/');
  });

});