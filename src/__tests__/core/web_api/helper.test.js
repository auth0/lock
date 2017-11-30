import expect from 'expect.js';
import { webAuthOverrides, normalizeError } from 'core/web_api/helper';

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
describe('normalizeError', () => {
  it('should map access_denied error to invalid_user_password', () => {
    const error = {
      error: 'access_denied',
      description: 'foobar'
    };
    const expectedError = {
      code: 'invalid_user_password',
      error: 'invalid_user_password',
      description: error.description
    };
    const actualError = normalizeError(error);
    expect(actualError).to.be.eql(expectedError);
  });
});
