/**
 * Mocha config
 */

mocha.timeout(60000);
mocha.ui('bdd');
mocha.reporter('html');
mocha.globals(['jQuery*', '__auth0jp*', 'Auth0*']);

describe('_findConnectionByEmailDomain', function () {
  var domain = 'abc.auth0.com';
  var clientID = '123456789';
  var widget;

  before(function (done) {
    widget = new Auth0Lock(clientID, domain);
    widget.display();
    done();
  });

  after(function (done) {
    global.window.Auth0 = null;
    widget.hide(done);
  });

  it('should return connection when email domain matches `domain`', function() {
    var entry = {domain: 'bye.com'};
    var result = widget.options._findConnectionByDomain('bye.com', [
      { connections: [entry] }
    ]);

    expect(result).not.to.be(undefined);
    expect(result.domain).to.be.equal(entry.domain);
    expect(result.domains).to.be.ok;
    expect(result.domains.length).to.be.equal(1);
    expect(result.domains[0]).to.equal(entry.domain);
  });

  it('should return connection when email domain matches `domain_aliases`', function () {
    var entry = { domain: 'bye.com', domain_aliases: ['bye.com', 'foo.com', 'bar.com'] };
    var result = widget.options._findConnectionByDomain('bar.com', [
      { connections: [entry] }
    ]);

    expect(result).not.to.be(undefined);
    expect(result.domain).to.be.equal(entry.domain);
    expect(result.domain_aliases).to.eql(entry.domain_aliases);
    expect(result.domains).not.to.be(undefined);
    expect(result.domains.length).to.be.equal(4);
    expect(result.domains).to.contain(entry.domain);
  });

  it('should return connection when email domain matches `domain_aliases` on second connection entry', function () {
    var entry = {domain: 'bye.com', domain_aliases: ['bye.com', 'foo.com', 'bar.com']};
    var result = widget.options._findConnectionByDomain('bar.com', [
      { connections: [] }, { connections: [{ domain: 'foobar.com' }] }, { connections: [entry] }
    ]);
    expect(result).not.to.be(undefined);
    expect(result.domain).to.be.equal(entry.domain);
    expect(result.domain_aliases).to.eql(entry.domain_aliases);
    expect(result.domains).not.to.be(undefined);
    expect(result.domains.length).to.be.equal(4);
    expect(result.domains).to.contain(entry.domain);
  });

  it('should return falsy when email domain matches neither `domain` nor `domain_aliases`', function () {
    var entry = {domain: 'bye.com', domain_aliases: ['bye.com', 'foo.com', 'bar.com']};
    var result = widget.options._findConnectionByDomain('unknown.com', [
      { connections: [entry] }
    ]);

    expect(result).to.be(undefined);
  });
});
