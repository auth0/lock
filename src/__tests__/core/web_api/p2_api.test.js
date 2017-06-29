jest.mock('auth0-js');

const getClient = (options = {}) => {
  const lockId = 'lockId';
  const clientId = 'cid';
  const domain = 'domain';
  const Auth0APIClient = require('core/web_api/p2_api').default;
  const client = new Auth0APIClient(lockId, clientId, domain, options);
  client.client.popup = {
    authorize: jest.fn()
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
      describe('when `overrides._useCrossAuth` is true', () => {
        it('should fail when in popup mode', () => {
          const client = getClient({
            redirect: false,
            overrides: {
              __useCrossAuth: true
            }
          });
          expect(() => client.logIn({ username: 'foo' }, {})).toThrowErrorMatchingSnapshot();
        });
        it('should call client.login', () => {
          const client = getClient({
            redirect: true,
            overrides: {
              __useCrossAuth: true
            }
          });
          const callback = jest.fn();
          client.logIn({ username: 'foo' }, {}, callback);
          const mock = getAuth0ClientMock();
          const loginMock = mock.WebAuth.mock.instances[0].login.mock;
          assertCallWithCallback(loginMock, callback);
        });
      });
      it('should call client.client.login by default', () => {
        const client = getClient({
          redirect: true
        });
        const callback = jest.fn();
        client.logIn({ username: 'foo' }, {}, callback);
        const mock = getAuth0ClientMock();
        const loginMock = mock.WebAuth.mock.instances[0].client.login.mock;
        assertCallWithCallback(loginMock, callback);
      });
    });
  });
});
