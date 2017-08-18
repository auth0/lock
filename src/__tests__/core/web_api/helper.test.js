import { webAuthOverrides, normalizeError } from 'core/web_api/helper';

describe('webAuthOverrides', () => {
  it('should return overrides if any field is compatible with WebAuth', function() {
    expect(webAuthOverrides({ __tenant: 'tenant1', __token_issuer: 'issuer1' })).toMatchSnapshot();
  });

  it('should omit overrides that are not compatible with WebAuth', function() {
    expect(
      webAuthOverrides({ __tenant: 'tenant1', __token_issuer: 'issuer1', backgroundColor: 'blue' })
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
  it('maps COA not enabled error', () => {
    const normalized = normalizeError({
      error: 'unauthorized_client',
      error_description: 'Cross origin login not allowed.'
    });
    expect(normalized).toMatchSnapshot();
  });
});
