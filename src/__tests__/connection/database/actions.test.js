import Immutable, { List, Map } from 'immutable';
import { signUp } from '../../../connection/database/actions';
import { swap, setEntity } from '../../../store';

const webApiMock = () => require('core/web_api');
const coreActionsMock = () => require('core/actions');
jest.mock('core/actions', () => ({
  validateAndSubmit: jest.fn()
}));

jest.mock('core/web_api', () => ({
  signUp: jest.fn()
}));

describe('database/actions.js', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('signUp splits root attributes correctly', () => {
    const id = 1;
    const hookRunner = jest.fn((str, m, context, fn) => fn());

    require('connection/database/index').databaseConnectionName = () => 'test-connection';
    require('connection/database/index').shouldAutoLogin = () => true;

    const m = Immutable.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        },
        family_name: {
          value: 'test-family-name'
        },
        given_name: {
          value: 'test-given-name'
        },
        name: {
          value: 'test-name'
        },
        nickname: {
          value: 'test-nickname'
        },
        picture: {
          value: 'test-pic'
        },
        other_prop: {
          value: 'test-other'
        }
      },
      database: {
        additionalSignUpFields: [
          { name: 'family_name', storage: 'root' },
          { name: 'given_name', storage: 'root' },
          { name: 'name', storage: 'root' },
          { name: 'nickname', storage: 'root' },
          { name: 'picture', storage: 'root' },
          { name: 'other_prop' }
        ]
      },
      core: {
        hookRunner
      }
    });
    swap(setEntity, 'lock', id, m);
    signUp(id);
    const {
      validateAndSubmit: { mock: validateAndSubmitMock }
    } = coreActionsMock();
    expect(validateAndSubmitMock.calls.length).toBe(1);
    expect(validateAndSubmitMock.calls[0][0]).toBe(id);
    expect(validateAndSubmitMock.calls[0][1]).toContain('email');
    expect(validateAndSubmitMock.calls[0][1]).toContain('password');
    validateAndSubmitMock.calls[0][2](m);
    const {
      signUp: { mock: signUpMock }
    } = webApiMock();
    expect(signUpMock.calls.length).toBe(1);
    expect(signUpMock.calls[0][0]).toBe(id);
    expect(signUpMock.calls[0][1]).toMatchObject({
      connection: 'test-connection',
      email: 'test@email.com',
      password: 'testpass',
      autoLogin: true,
      family_name: 'test-family-name',
      given_name: 'test-given-name',
      name: 'test-name',
      nickname: 'test-nickname',
      picture: 'test-pic',
      user_metadata: {
        other_prop: 'test-other'
      }
    });
  });

  it('runs the signingUp hook on signUp', () => {
    const id = 1;

    require('connection/database/index').databaseConnectionName = () => 'test-connection';
    require('connection/database/index').shouldAutoLogin = () => true;

    const hookRunner = jest.fn((str, m, context, fn) => fn());

    const m = Immutable.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        }
      },
      core: {
        hookRunner
      }
    });

    swap(setEntity, 'lock', id, m);

    signUp(id);

    const {
      validateAndSubmit: { mock: validateAndSubmitMock }
    } = coreActionsMock();

    validateAndSubmitMock.calls[0][2](m);

    const {
      signUp: { mock: signUpMock }
    } = webApiMock();

    expect(hookRunner).toHaveBeenCalledTimes(1);
    expect(hookRunner).toHaveBeenCalledWith('signingUp', m, null, expect.any(Function));
    expect(signUpMock.calls.length).toBe(1);
    expect(signUpMock.calls[0][0]).toBe(id);
  });

  it('sanitizes additionalSignUp fields using dompurify', () => {
    const id = 1;
    const hookRunner = jest.fn((str, m, context, fn) => fn());

    require('connection/database/index').databaseConnectionName = () => 'test-connection';
    require('connection/database/index').shouldAutoLogin = () => true;

    // Test different fields using some examples from DOMPurify
    // https://github.com/cure53/DOMPurify#some-purification-samples-please
    const m = Immutable.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        },
        family_name: {
          value: 'Test <a href="https://www.google.co.uk">Fake link</a>' // HTML but not malicious
        },
        given_name: {
          value: '<img src=x onerror=alert(1)//>'
        },
        name: {
          value: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'
        },
        other_name: {
          value:
            '<div onclick=alert(0)><form onsubmit=alert(1)><input onfocus=alert(2) name=parentNode>123</form></div>'
        }
      },
      database: {
        additionalSignUpFields: [
          { name: 'family_name', storage: 'root' },
          { name: 'given_name', storage: 'root' },
          { name: 'name', storage: 'root' },
          { name: 'other_name' }
        ]
      },
      core: {
        hookRunner
      }
    });

    swap(setEntity, 'lock', id, m);
    signUp(id);

    const {
      validateAndSubmit: { mock: validateAndSubmitMock }
    } = coreActionsMock();

    validateAndSubmitMock.calls[0][2](m);

    const {
      signUp: { mock: signUpMock }
    } = webApiMock();

    expect(signUpMock.calls[0][1]).toMatchObject({
      connection: 'test-connection',
      email: 'test@email.com',
      password: 'testpass',
      autoLogin: true,
      family_name: 'Test Fake link',
      given_name: '',
      name: 'abc',
      user_metadata: {
        other_name: '123'
      }
    });
  });
});
