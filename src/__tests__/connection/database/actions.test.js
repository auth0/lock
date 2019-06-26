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
  it('signUp splits root attributes correctly', () => {
    const id = 1;
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
      }
    });
    swap(setEntity, 'lock', id, m);
    signUp(id);
    const { validateAndSubmit: { mock: validateAndSubmitMock } } = coreActionsMock();
    expect(validateAndSubmitMock.calls.length).toBe(1);
    expect(validateAndSubmitMock.calls[0][0]).toBe(id);
    expect(validateAndSubmitMock.calls[0][1]).toContain('email');
    expect(validateAndSubmitMock.calls[0][1]).toContain('password');
    validateAndSubmitMock.calls[0][2](m);
    const { signUp: { mock: signUpMock } } = webApiMock();
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
});
