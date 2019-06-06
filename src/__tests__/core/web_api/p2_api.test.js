import { setURL } from 'testUtils';

jest.mock('auth0-js');

const getClient = (options = {}) => {
  const lockId = 'lockId';
  const clientId = 'cid';
  const domain = 'me.auth0.com';
  const Auth0APIClient = require('core/web_api/p2_api').default;
  const client = new Auth0APIClient(lockId, clientId, domain, options);
  client.client.popup = {
    authorize: jest.fn(),
    loginWithCredentials: jest.fn()
  };
  client.client.client = {
    login: jest.fn(),
    signup: jest.fn(),
    changePassword: jest.fn(),
    passwordlessStart: jest.fn(),
    passwordlessLogin: jest.fn(),
    getUserCountry: jest.fn(),
    getSSOData: jest.fn()
  };
  return client;
};

const getAuth0ClientMock = () => require('auth0-js');
const assertCallWithCallback = (mock, callbackFunction) => {
  expect(mock.calls.length).toBe(1);
  expect(mock.calls[0][0]).toMatchSnapshot();
  mock.calls[0][1]();
  expect(callbackFunction.mock.calls.length).toBe(1);
};
describe('Auth0APIClient', () => {
  beforeEach(() => {
    jest.resetModules();
    require('auth0-js').version.raw = 'a0js.version';
    require('core/web_api/helper').getVersion = () => 'lock.version';
  });
  describe('init', () => {
    describe('with overrides', () => {
      it('always uses telemetry set in the `auth0Client` query param and inside the ULP', () => {
        const telemetryIn = { name: 'test-sdk', version: '1.0.0', env: { envOverride: true } };
        setURL(`https://me.auth0.com/authorize?auth0Client=${btoa(JSON.stringify(telemetryIn))}`);
        const options = {
          audience: 'foo',
          redirectUrl: '//localhost:8080/login/callback',
          responseMode: 'query',
          responseType: 'code',
          leeway: 60,
          _telemetryInfo: { ignored: true }
        };
        getClient(options);
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]._telemetryInfo).toMatchSnapshot();
      });
      it('overrides telemetry when outside the ULP', () => {
        setURL(`https://auth.myapp.com/authorize`);
        const options = {
          audience: 'foo',
          redirectUrl: '//localhost:8080/login/callback',
          responseMode: 'query',
          responseType: 'code',
          leeway: 60,
          _telemetryInfo: { name: 'test-sdk', version: '1.0.0', env: { envOverride: true } }
        };
        getClient(options);
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]._telemetryInfo).toMatchSnapshot();
      });
      it('uses default telemetry key when outside the ULP', () => {
        setURL(`https://auth.myapp.com/authorize`);
        getClient();
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]._telemetryInfo.name).toEqual('lock.js');
        expect(Object.keys(mock.WebAuth.mock.calls[0][0]._telemetryInfo.env)).toContain('auth0.js');
      });
      it('overrides auth0.js telemetry key', () => {
        setURL(`https://auth.myapp.com/authorize`);
        const options = {
          audience: 'foo',
          redirectUrl: '//localhost:8080/login/callback',
          responseMode: 'query',
          responseType: 'code',
          leeway: 60,
          _telemetryInfo: {
            name: 'test-sdk',
            version: '1.0.0',
            env: { 'auth0.js': 'this-will-be-overriden' }
          }
        };
        getClient(options);
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]._telemetryInfo.env['auth0.js']).toBe('a0js.version');
      });
      it('uses different telemetry key when inside the ULP', () => {
        setURL('https://me.auth0.com/');
        getClient();
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]._telemetryInfo.name).toEqual('lock.js-ulp');
        expect(Object.keys(mock.WebAuth.mock.calls[0][0]._telemetryInfo.env)).toContain(
          'auth0.js-ulp'
        );
      });
      it('forwards options to WebAuth', () => {
        setURL(`https://auth.myapp.com/authorize`);
        const options = {
          audience: 'foo',
          redirectUrl: '//localhost:8080/login/callback',
          responseMode: 'query',
          responseType: 'code',
          leeway: 60,
          overrides: {
            __tenant: 'tenant1',
            __token_issuer: 'issuer1',
            __jwks_uri: 'https://jwks.com'
          },
          plugins: [
            {
              name: 'ExamplePlugin'
            }
          ],
          params: {
            nonce: 'nonce',
            state: 'state',
            scope: 'custom_scope'
          }
        };
        const client = getClient(options);
        const mock = getAuth0ClientMock();
        expect(mock.WebAuth.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('should set authOpt according options', () => {
      it('should set sso:true when inside the universal login page', () => {
        setURL('https://me.auth0.com/');
        const options = {
          sso: true
        };
        const client = getClient(options);
        expect(client.authOpt.sso).toBe(true);
      });
      it('should set sso:false when inside the universal login page', () => {
        setURL('https://me.auth0.com/');
        const options = {
          sso: false
        };
        const client = getClient(options);
        expect(client.authOpt.sso).toBe(false);
      });
      it('should set sso:undefined when outside the universal login page', () => {
        setURL('https://other-url.auth0.com/');
        const options = {};
        const client = getClient(options);
        expect(client.authOpt.sso).toBe(undefined);
      });
      it('should set state from options.state', () => {
        const client = getClient({
          state: 'foo'
        });
        expect(client.authOpt.state).toBe('foo');
      });
      it('should set state from options.params.state', () => {
        const client = getClient({
          params: {
            state: 'foo'
          }
        });
        expect(client.authOpt.state).toBe('foo');
      });
      it('options.params.state should prevail over options.state', () => {
        const client = getClient({
          state: 'bar',
          params: {
            state: 'foo'
          }
        });
        expect(client.authOpt.state).toBe('foo');
      });
      it('should set nonce from options.nonce', () => {
        const client = getClient({
          nonce: 'foo'
        });
        expect(client.authOpt.nonce).toBe('foo');
      });
      it('should set nonce from options.params.nonce', () => {
        const client = getClient({
          params: {
            nonce: 'foo'
          }
        });
        expect(client.authOpt.nonce).toBe('foo');
      });
      it('options.params.nonce should prevail over options.nonce', () => {
        const client = getClient({
          nonce: 'bar',
          params: {
            nonce: 'foo'
          }
        });
        expect(client.authOpt.nonce).toBe('foo');
      });
      it('should set scope from options.params.scope', () => {
        const client = getClient({
          params: {
            scope: 'foo'
          }
        });
        expect(client.authOpt.scope).toBe('foo');
      });
    });
  });
  describe('logIn', () => {
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
      it('should call client.login', () => {
        const client = getClient({
          redirect: true
        });
        const callback = jest.fn();
        client.logIn(
          {
            username: 'foo'
          },
          {},
          callback
        );
        const mock = getAuth0ClientMock();
        const loginMock = mock.WebAuth.mock.instances[0].login.mock;
        assertCallWithCallback(loginMock, callback);
      });
      it('should use the provided login_hint', () => {
        const client = getClient({
          redirect: true
        });
        const callback = jest.fn();
        client.logIn(
          {
            email: 'foo',
            login_hint: 'valid_hint@test.com'
          },
          {
            login_hint: 'invalid_hint@test.com'
          },
          callback
        );
        const mock = getAuth0ClientMock();
        const loginMock = mock.WebAuth.mock.instances[0].login.mock;
        expect(loginMock.calls[0][0].login_hint).toBe('valid_hint@test.com');
      });
      it('should call popup.loginWithCredentials when redirect is false and sso is false', () => {
        const client = getClient({
          redirect: false,
          sso: false
        });
        const callback = jest.fn();
        client.logIn(
          {
            username: 'foo'
          },
          {},
          callback
        );
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
        client.logIn(
          {
            username: 'foo'
          },
          {},
          callback
        );
        const mock = getAuth0ClientMock();
        const loginWithCredentialsMock =
          mock.WebAuth.mock.instances[0].popup.loginWithCredentials.mock;
        assertCallWithCallback(loginWithCredentialsMock, callback);
      });
    });
    describe('should trim spaces in', () => {
      let client;
      let callback;
      let getMock = () => getAuth0ClientMock().WebAuth.mock.instances[0].login.mock;
      beforeEach(() => {
        client = getClient({
          redirect: true
        });
        callback = jest.fn();
      });
      it('the username', () => {
        client.logIn(
          {
            username: ' foo '
          },
          {},
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the username with a space', () => {
        client.logIn(
          {
            username: ' foo bar '
          },
          {},
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the email', () => {
        client.logIn(
          {
            email: ' foo@example.com '
          },
          {},
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the mfa_code', () => {
        client.logIn(
          {
            username: 'foo',
            mfa_code: ' 123456 '
          },
          {},
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
    });
  });
  describe('signUp', () => {
    describe('should trim spaces in', () => {
      let client;
      let callback;
      let getMock = () => getAuth0ClientMock().WebAuth.mock.instances[0].signup.mock;
      beforeEach(() => {
        client = getClient({
          redirect: true
        });
        callback = jest.fn();
      });
      it('the username', () => {
        client.signUp(
          {
            username: ' foo '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the username with a space', () => {
        client.signUp(
          {
            username: ' foo bar '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the email', () => {
        client.signUp(
          {
            email: ' foo@example.com '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
    });
  });
  describe('resetPassword', () => {
    describe('should trim spaces in', () => {
      let client;
      let callback;
      let getMock = () => getAuth0ClientMock().WebAuth.mock.instances[0].changePassword.mock;
      beforeEach(() => {
        client = getClient({
          redirect: true
        });
        callback = jest.fn();
      });
      it('the username', () => {
        client.resetPassword(
          {
            username: ' foo '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the username with a space', () => {
        client.resetPassword(
          {
            username: ' foo bar '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the email', () => {
        client.resetPassword(
          {
            email: ' foo@example.com '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
    });
  });
  describe('passwordlessStart', () => {
    it('should call client.passwordlessStart', () => {
      const client = getClient({});
      client.passwordlessStart(
        {
          foo: 'bar'
        },
        () => {}
      );
      const { mock } = client.client.passwordlessStart;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    describe('should trim spaces in', () => {
      let client;
      let callback;
      let getMock = () => getAuth0ClientMock().WebAuth.mock.instances[0].passwordlessStart.mock;
      beforeEach(() => {
        client = getClient({
          redirect: true
        });
        callback = jest.fn();
      });
      it('the email', () => {
        client.passwordlessStart(
          {
            email: ' foo@example.com '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the phoneNumber', () => {
        client.passwordlessStart(
          {
            phoneNumber: ' +554899999 '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
    });
  });
  describe('passwordlessVerify', () => {
    it('should call client.passwordlessLogin', () => {
      const client = getClient({});
      client.passwordlessVerify(
        {
          foo: 'bar'
        },
        () => {}
      );
      const { mock } = client.client.passwordlessLogin;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
    describe('should trim spaces in', () => {
      let client;
      let callback;
      let getMock = () => getAuth0ClientMock().WebAuth.mock.instances[0].passwordlessLogin.mock;
      beforeEach(() => {
        client = getClient({
          redirect: true
        });
        callback = jest.fn();
      });
      it('the email', () => {
        client.passwordlessVerify(
          {
            email: ' foo@example.com '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
      it('the phoneNumber', () => {
        client.passwordlessVerify(
          {
            phoneNumber: ' +554899999 '
          },
          callback
        );
        assertCallWithCallback(getMock(), callback);
      });
    });
  });

  it('getUserCountry should call getUserCountry', () => {
    const client = getClient({});
    client.getUserCountry('cb');
    const { mock } = client.client.client.getUserCountry;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('getSSOData should call client.client.getSSOData', () => {
    const client = getClient({});
    client.getSSOData(true, () => {});
    const { mock } = client.client.client.getSSOData;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  describe('parseHash', () => {
    it('should pass __enableIdPInitiatedLogin:false when options._enableImpersonation and options._enableIdPInitiatedLogin are not present', () => {
      const client = getClient({});
      client.parseHash('hash', 'cb');
      const mock = getAuth0ClientMock();
      const parseHashMock = mock.WebAuth.mock.instances[0].parseHash.mock;
      expect(parseHashMock.calls.length).toBe(1);
      expect(parseHashMock.calls[0]).toMatchSnapshot();
    });
    it('should pass __enableIdPInitiatedLogin when options._enableImpersonation===true', () => {
      const client = getClient({
        _enableImpersonation: true
      });
      client.parseHash('hash', 'cb');
      const mock = getAuth0ClientMock();
      const parseHashMock = mock.WebAuth.mock.instances[0].parseHash.mock;
      expect(parseHashMock.calls.length).toBe(1);
      expect(parseHashMock.calls[0]).toMatchSnapshot();
    });
    it('should pass __enableIdPInitiatedLogin when options._enableIdPInitiatedLogin===true', () => {
      const client = getClient({
        _enableIdPInitiatedLogin: true
      });
      client.parseHash('hash', 'cb');
      const mock = getAuth0ClientMock();
      const parseHashMock = mock.WebAuth.mock.instances[0].parseHash.mock;
      expect(parseHashMock.calls.length).toBe(1);
      expect(parseHashMock.calls[0]).toMatchSnapshot();
    });
  });
});
