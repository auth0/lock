import I from 'immutable';
import { logIn } from '../../../connection/enterprise/actions';
import * as l from '../../../core/index';
import { setField } from '../../../field/index';

jest.mock('connection/database/index', () => ({
  databaseLogInWithEmail: jest.fn(() => true),
  databaseUsernameValue: jest.fn()
}));

jest.mock('store/index', () => ({
  read: jest.fn(() => 'model'),
  getEntity: 'getEntity',
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

jest.mock('connection/enterprise', () => ({
  matchConnection: jest.fn(),
  enterpriseActiveFlowConnection: jest.fn(),
  isHRDActive: jest.fn(),
  isEnterpriseDomain: jest.fn()
}));

jest.mock('core/actions', () => ({
  logIn: jest.fn()
}));

describe('Login with connection scopes', () => {
  let lock;

  beforeEach(() => {
    lock = I.fromJS({ id: '__lock__' });
    require('store/index').read.mockReturnValue(lock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('for an SSO connection', () => {
    it('passes connectionScopes to the connection', () => {
      lock = l.setup(
        '__lock__',
        'client',
        'domain',
        {
          auth: {
            connectionScopes: {
              'sso-connection': ['offline_access']
            }
          }
        },
        null,
        () => {}
      );

      lock = setField(lock, 'email', 'test@test.com');

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').matchConnection.mockReturnValue(
        I.fromJS({ name: 'sso-connection' })
      );

      const coreActions = require('core/actions');

      logIn('__lock__');

      expect(coreActions.logIn).toHaveBeenCalledWith('__lock__', ['email'], {
        connection_scope: ['offline_access'],
        connection: 'sso-connection',
        login_hint: 'test@test.com'
      });
    });

    it('should not throw an error if the captcha was not completed', () => {
      lock = l.setup('__lock__', 'client', 'domain', {}, null, () => {});
      lock = setField(lock, 'email', 'test@test.com');

      // This will be specified in the response from the /challenge endpoint if the
      // dashboard settings have Captcha as 'required', regardless of connection being used.
      lock = l.setCaptcha(lock, {
        required: true,
        provider: 'recaptcha_v2'
      });

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').matchConnection.mockReturnValue(
        I.fromJS({ name: 'sso-connection' })
      );

      const coreActions = require('core/actions');

      logIn('__lock__');
      expect(coreActions.logIn).toHaveBeenCalled();
    });
  });

  describe('for a non-SSO connection', () => {
    it('passes connectionScopes to the connection', () => {
      lock = l.setup('__lock__', 'client', 'domain', {
        auth: {
          connectionScopes: {
            'enterprise-connection': ['offline_access']
          }
        }
      });

      lock = setField(lock, 'password', 'test');
      lock = setField(lock, 'username', 'test');

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').enterpriseActiveFlowConnection.mockReturnValue(
        I.fromJS({ name: 'enterprise-connection' })
      );

      const coreActions = require('core/actions');

      logIn('__lock__');

      expect(coreActions.logIn).toHaveBeenCalledWith(
        '__lock__',
        ['password', 'username'],
        {
          connection_scope: ['offline_access'],
          connection: 'enterprise-connection',
          username: 'test',
          password: 'test',
          login_hint: 'test'
        },
        expect.any(Function)
      );
    });
  });
});
