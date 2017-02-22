jest.mock('auth0-js');

const getClient = (options) => {
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
    loginWithCredentials: jest.fn(),
  };
  return client;
}

const getAuth0ClientMock = () => require('auth0-js');

describe('Auth0LegacyAPIClient', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('logIn', () => {
    const assertCallWithCallback = (mock, callbackFunction) => {
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toMatchSnapshot();
      mock.calls[0][1]();
      expect(callbackFunction.mock.calls.length).toBe(1);
    };
    describe('with social/enterprise (without username and email)', () => {
      it('should call authorize when redirect===true', () => {
        const client = getClient({
          redirect: true
        });
        const callback = jest.fn();
        client.logIn({}, {}, callback);
        const mock = getAuth0ClientMock();
        const authorizeMock = mock.WebAuth.mock.instances[0].authorize.mock;
        assertCallWithCallback(authorizeMock, callback);
      });
      it('should call popup.authorize when redirect===false', () => {
        const client = getClient({
          redirect: false
        });
        const callback = jest.fn();
        client.logIn({}, {}, callback);
        const mock = getAuth0ClientMock();
        const authorizeMock = mock.WebAuth.mock.instances[0].popup.authorize.mock;
        assertCallWithCallback(authorizeMock, callback);
      });
    });
    describe('with sso and redirect === false', () => {
      it('should call loginWithResourceOwner', () => {
        const client = getClient({
          sso: false,
          redirect: false
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginWithResourceOwnerMock = mock.WebAuth.mock.instances[0].client.loginWithResourceOwner.mock;
        assertCallWithCallback(loginWithResourceOwnerMock, callback);
      });
    });
    describe('with credentials', () => {
      it('should call loginWithCredentials', () => {
        const client = getClient({
          redirect: true,
          sso: true
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const authorizeMock = mock.WebAuth.mock.instances[0].redirect.loginWithCredentials.mock;
        assertCallWithCallback(authorizeMock, callback);
      });
      it('should call popup.authorize when redirect===false', () => {
        const client = getClient({
          redirect: false,
          sso: true
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const authorizeMock = mock.WebAuth.mock.instances[0].popup.loginWithCredentials.mock;
        assertCallWithCallback(authorizeMock, callback);
      });
    });
  });
});
