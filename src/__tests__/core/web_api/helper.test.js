import expect from 'expect.js';
import { webAuthOverrides } from 'core/web_api/helper';

describe('webAuthOverrides', () => {
  it('should return overrides if any field is compatible with WebAuth', function() {
    expect(webAuthOverrides({ __tenant: 'tenant1', __token_issuer: 'issuer1' })).to.eql({
      __tenant: 'tenant1',
      __token_issuer: 'issuer1'
    });
  });

  it('should omit overrides that are not compatible with WebAuth', function() {
    expect(
      webAuthOverrides({ __tenant: 'tenant1', __token_issuer: 'issuer1', backgroundColor: 'blue' })
    ).to.eql({ __tenant: 'tenant1', __token_issuer: 'issuer1' });
  });

  it('should return null if no fields are compatible with WebAuth', function() {
    expect(webAuthOverrides({ backgroundColor: 'blue' })).to.not.be.ok();
  });
});
