import expect from 'expect.js';
import * as h from './helper/ui';

describe('show lock connection scopes', function() {
  beforeEach(function(done) {
    h.stubWebApis();
    const opts = {
      auth: {
        connectionScopes: {
          facebook: ['scope_1', 'scope_2']
        }
      }
    };
    this.lock = h.displayLock('multiple social', opts, done);
  });

  afterEach(function() {
    this.lock.hide();
    h.restoreWebApis();
  });

  it('should redirect to /authorize for social login using Facebook', function(done) {
    h.assertAuthorizeRedirection((lockID, options, authParams) => {
      expect(options).to.be.an('object');
      expect(options.connection).to.be('facebook');
      expect(options.connection_scope).to.be.an('array');
      expect(options.connection_scope).to.have.length(2);
      expect(options.connection_scope).to.contain('scope_1');
      expect(options.connection_scope).to.contain('scope_2');
      done();
    });

    h.waitUntilExists(this.lock, '.auth0-lock-social-button', () =>
      h.clickSocialConnectionButton(this.lock, 'facebook')
    );
  });
});
