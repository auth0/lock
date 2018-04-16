import expect from 'expect.js';
import * as h from './helper/ui';
import Auth0Lock from '../src/index';

describe('theme options', function() {
  before(h.stubWebApis);
  after(h.restoreWebApis);

  describe('logo', function() {
    it('renders auth0 logo from cdn by default', function(done) {
      const options = {};
      const lock = new Auth0Lock('cid', 'domain', options);

      lock.on('show', () => {
        expect(h.logoUrl(lock)).to.equal(
          'http://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/badge.png'
        );
        lock.hide();
        done();
      });

      lock.show();
    });

    it('renders auth0 logo passed via options', function(done) {
      const options = { theme: { logo: 'https://my.logo/logo.svg' } };
      const lock = new Auth0Lock('cid', 'domain', options);

      lock.on('show', () => {
        expect(h.logoUrl(lock)).to.equal('https://my.logo/logo.svg');
        lock.hide();
        done();
      });

      lock.show();
    });

    it('renders a link around the logo if logoLink is specified', function(done) {
      const options = { theme: { logoLink: 'https://my.domain/' } };
      const lock = new Auth0Lock('cid', 'domain', options);

      lock.on('show', () => {
        expect(h.logoLink(lock)).to.equal('https://my.domain/');
        lock.hide();
        done();
      });

      lock.show();
    });
  });
});
