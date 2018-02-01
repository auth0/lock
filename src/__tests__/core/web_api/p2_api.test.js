jest.mock('auth0-js');

const getClient = (options = {}, isHostedLoginPage = false) => {
  const lockId = 'lockId';
  const clientId = 'cid';
  const domain = 'domain';
  const Auth0APIClient = require('core/web_api/p2_api').default;
  const client = new Auth0APIClient(lockId, clientId, domain, options);
  client.client.popup = {
    authorize: jest.fn(),
    loginWithCredentials: jest.fn()
  };
  client.client.client = {
    login: jest.fn()
  };
  return client;
};

const getAuth0ClientMock = () => require('auth0-js');

describe('Auth0APIClient', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe('init', () => {
    describe('with overrides', () => {
      it('forwards options to WebAuth', () => {
        const options = {
          audience: 'foo',
          redirectUrl: '//localhost:8080/login/callback',
          responseMode: 'query',
          responseType: 'code',
          leeway: 60,
          overrides: {
            __tenant: 'tenant1',
            __token_issuer: 'issuer1'
          },
          plugins: [{ name: 'ExamplePlugin' }],
          _telemetryInfo: {}
        };
        const client = getClient(options);
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]).toMatchSnapshot();
      });
    });
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
    describe('with credentials', () => {
      it('should call client.login when isHostedLoginPage===false', () => {
        const client = getClient({
          redirect: true
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginMock = mock.WebAuth.mock.instances[0].login.mock;
        assertCallWithCallback(loginMock, callback);
      });
      it('should call _hostedPages.login when isHostedLoginPage===true', () => {
        const client = getClient(
          {
            redirect: true
          },
          true
        );
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginMock = mock.WebAuth.mock.instances[0]._hostedPages.login.mock;
        assertCallWithCallback(loginMock, callback);
      });
      it('should call popup.loginWithCredentials when redirect is false and sso is false', () => {
        const client = getClient({
          redirect: false,
          sso: false
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginWithCredentialsMock =
          mock.WebAuth.mock.instances[0].popup.loginWithCredentials.mock;
        assertCallWithCallback(loginWithCredentialsMock, callback);
      });
      it('should call popup.loginWithCredentials when redirect is false and sso is true', () => {
        const client = getClient({
          redirect: false,
          sso: true
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginWithCredentialsMock =
          mock.WebAuth.mock.instances[0].popup.loginWithCredentials.mock;
        assertCallWithCallback(loginWithCredentialsMock, callback);
      });
    });
  });
});
