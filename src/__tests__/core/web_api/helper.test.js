import { webAuthOverrides, normalizeError } from 'core/web_api/helper';

describe('webAuthOverrides', () => {
  it('should return overrides if any field is compatible with WebAuth', function() {
    expect(
      webAuthOverrides({
        __tenant: 'tenant1',
        __token_issuer: 'issuer1',
        __jwks_uri: 'https://jwks.com'
      })
    ).toMatchSnapshot();
  });

  it('should omit overrides that are not compatible with WebAuth', function() {
    expect(
      webAuthOverrides({
        __tenant: 'tenant1',
        __token_issuer: 'issuer1',
        __jwks_uri: 'https://jwks.com',
        backgroundColor: 'blue'
      })
    ).toMatchSnapshot();
  });

  it('should return null if no fields are compatible with WebAuth', function() {
    expect(webAuthOverrides({ backgroundColor: 'blue' })).toBe(null);
  });
});

describe('normalizeError', () => {
  it('does nothing when there is no error', () => {
    const normalized = normalizeError(undefined);
    expect(normalized).toBe(undefined);
  });
  it('should map access_denied error to invalid_user_password when error.error === access_denied', () => {
    const error = {
      error: 'access_denied',
      description: 'foobar'
    };
    const expectedError = {
      code: 'invalid_user_password',
      error: 'invalid_user_password',
      description: 'foobar'
    };
    const actualError = normalizeError(error);
    expect(actualError).toMatchSnapshot();
  });
  it('should map access_denied error to invalid_user_password when error.code === access_denied', () => {
    const error = {
      code: 'access_denied',
      description: 'foobar'
    };
    const expectedError = {
      code: 'invalid_user_password',
      error: 'invalid_user_password',
      description: 'foobar'
    };
    const actualError = normalizeError(error);
    expect(actualError).toMatchSnapshot();
  });
});
