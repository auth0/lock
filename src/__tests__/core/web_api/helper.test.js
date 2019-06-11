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

  describe('access_denied to invalid_user_password mapping', function() {
    const domainMock = 'domainMock';
    const errorObjWithError = {
      error: 'access_denied',
      description: 'foobar'
    };
    const errorObjWithCode = {
      code: 'access_denied',
      description: 'foobar'
    };
    let currentWindowObj;

    beforeAll(function() {
      currentWindowObj = global.window;
      global.window = {
        locaction: {
          host: domainMock
        }
      };
    });

    afterAll(function() {
      global.window = currentWindowObj;
    });

    describe('domain is undefined', function() {
      it('should map access_denied error to invalid_user_password when error.error === access_denied', () => {
        const actualError = normalizeError(errorObjWithError);
        expect(actualError).toMatchSnapshot();
      });
      it('should map access_denied error to invalid_user_password when error.code === access_denied', () => {
        const actualError = normalizeError(errorObjWithCode);
        expect(actualError).toMatchSnapshot();
      });
    });

    describe("domain doesn't match current host", function() {
      it('should map access_denied error to invalid_user_password when error.error === access_denied', () => {
        const actualError = normalizeError(errorObjWithError, 'loremIpsum');
        expect(actualError).toMatchSnapshot();
      });
      it('should map access_denied error to invalid_user_password when error.code === access_denied', () => {
        const actualError = normalizeError(errorObjWithCode, 'loremIpsum');
        expect(actualError).toMatchSnapshot();
      });
    });

    describe('domain match current host', function() {
      it('should not map access_denied error to invalid_user_password when error.error === access_denied', () => {
        const actualError = normalizeError(errorObjWithError, domainMock);
        expect(actualError).toMatchSnapshot();
      });
      it('should not map access_denied error to invalid_user_password when error.code === access_denied', () => {
        const actualError = normalizeError(errorObjWithCode, domainMock);
        expect(actualError).toMatchSnapshot();
      });
    });
  });
});
