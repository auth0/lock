jest.mock('auth0-js');

const getClient = options => {
  const clientId = 'cid';
  const domain = 'domain';
  const Auth0LegacyAPIClient = require('core/web_api/legacy_api').default;
  const client = new Auth0LegacyAPIClient(clientId, domain, options);
  client.client.popup = {
    authorize: jest.fn(),
    loginWithCredentials: jest.fn()
  };
  client.client.client = {
    loginWithResourceOwner: jest.fn()
  };
  client.client.redirect = {
    loginWithCredentials: jest.fn()
  };
  client.client.transactionManager = {
    getStoredTransaction: jest.fn()
  };
  return client;
};

const getAuth0ClientMock = () => require('auth0-js');

describe('Auth0LegacyAPIClient', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('with overwrites', () => {
    it('should configure WebAuth with the proper overrides', () => {
      const client = getClient({
        overrides: {
          __tenant: 'tenant1',
          __token_issuer: 'issuer1'
        }
      });
      const mock = getAuth0ClientMock();
      const { overrides } = mock.WebAuth.mock.calls[0][0];
      expect(overrides).toEqual({ __tenant: 'tenant1', __token_issuer: 'issuer1' });
    });
  });

  describe('logIn', () => {
    const assertCallWithCallback = (mock, callbackFunction) => {
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toMatchSnapshot();
      mock.calls[0][1]();
      expect(callbackFunction.mock.calls.length).toBe(1);
    };

    const assertMethodCall = method => {
      expect(method.calls.length).toBe(1);
      expect(method.calls[0][0]).toMatchSnapshot();
    };

    const assertCallbackIsCalledOnce = (callback, method) => {
      method.calls[0][1]();
      expect(callback.mock.calls.length).toBe(1);
    };

    var callback;

    beforeEach(() => {
      callback = jest.fn();
    });

    describe('with social/enterprise (without username and email)', () => {
      const redirectAuthorize = () => {
        const mock = getAuth0ClientMock();
        return mock.WebAuth.mock.instances[0].authorize.mock;
      };

      const popupAuthorize = () => {
        const mock = getAuth0ClientMock();
        return mock.WebAuth.mock.instances[0].popup.authorize.mock;
      };

      it('should call authorize when redirect===true', () => {
        const client = getClient({
          redirect: true
        });
        client.logIn({}, {}, callback);
        assertMethodCall(redirectAuthorize());
        assertCallbackIsCalledOnce(callback, redirectAuthorize());
      });

      it('should call popup.authorize when redirect===false', () => {
        const client = getClient({
          redirect: false
        });
        client.logIn({}, {}, callback);
        assertMethodCall(popupAuthorize());
        assertCallbackIsCalledOnce(callback, popupAuthorize());
      });

      it('should call popup.authorize with additional authParams', () => {
        const client = getClient({
          redirect: false
        });
        client.logIn(
          {},
          { scope: 'openid offline_access read:users', audience: 'https://mysite.com/api' },
          callback
        );
        assertMethodCall(popupAuthorize());
        assertCallbackIsCalledOnce(callback, popupAuthorize());
      });
    });

    describe('with sso and redirect === false', () => {
      it('should call loginWithResourceOwner', () => {
        const client = getClient({
          sso: false,
          redirect: false
        });
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginWithResourceOwnerMock =
          mock.WebAuth.mock.instances[0].client.loginWithResourceOwner.mock;
        assertMethodCall(loginWithResourceOwnerMock);
        assertCallbackIsCalledOnce(callback, loginWithResourceOwnerMock);
      });
    });

    describe('with credentials', () => {
      const redirectLoginWithCredentials = () => {
        const mock = getAuth0ClientMock();
        return mock.WebAuth.mock.instances[0].redirect.loginWithCredentials.mock;
      };

      const popupLoginWithCredentials = () => {
        const mock = getAuth0ClientMock();
        return mock.WebAuth.mock.instances[0].popup.loginWithCredentials.mock;
      };

      it('should call loginWithCredentials', () => {
        const client = getClient({
          redirect: true,
          sso: true
        });
        client.logIn({ username: 'foo' }, {}, callback);
        assertMethodCall(redirectLoginWithCredentials());
        assertCallbackIsCalledOnce(callback, redirectLoginWithCredentials());
      });

      it('should call loginWithCredentials with auth params', () => {
        const client = getClient({
          redirect: true,
          sso: true
        });
        client.logIn(
          { username: 'foo' },
          { scope: 'openid offline_access write:users', audience: 'https://mysites.com/api' },
          callback
        );
        assertMethodCall(redirectLoginWithCredentials());
        assertCallbackIsCalledOnce(callback, redirectLoginWithCredentials());
      });

      it('should call popup.authorize when redirect===false', () => {
        const client = getClient({
          redirect: false,
          sso: true
        });
        client.logIn({ username: 'foo' }, {}, callback);
        assertMethodCall(popupLoginWithCredentials());
        assertCallbackIsCalledOnce(callback, popupLoginWithCredentials());
      });
    });
  });

  describe('parseHash', () => {
    it('should parse correct hash', () => {
      const jwt = require('jsonwebtoken');
      const client = getClient({
        redirect: false
      });
      const token = jwt.sign(
        { aud: client.clientID, iss: `https://${client.domain}/` },
        'someSecret',
        { expiresIn: '30m' }
      );
      const payload = jwt.decode(token);
      const callback = jest.fn();

      client.parseHash(
        `#access_token=aToken&id_token=${token}&refresh_token=rToken&state=/path%3Fone%3Dtwo%26three%3D3%234`,
        callback
      );
      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(null, {
        accessToken: 'aToken',
        idToken: token,
        idTokenPayload: payload,
        refreshToken: 'rToken',
        state: '/path?one=two&three=3#4'
      });
    });
  });
});
