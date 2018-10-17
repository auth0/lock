import { mockComponent } from 'testUtils';
const getEngine = () => require('engine/passwordless').default;

jest.mock('core/error_screen', () => mockComponent('error_screen'));
jest.mock('core/loading_screen', () => mockComponent('loading_screen'));
jest.mock('engine/passwordless/social_or_email_login_screen', () =>
  mockComponent('social_or_email_login_screen')
);
jest.mock('engine/passwordless/social_or_phone_number_login_screen', () =>
  mockComponent('social_or_phone_number_login_screen')
);
jest.mock('connection/passwordless/ask_vcode', () => mockComponent('ask_vcode'));
jest.mock('core/sso/last_login_screen', () => mockComponent('last_login_screen'));

describe('Passwordless Engine', () => {
  describe('didReceiveClientSettings calls setPrefill', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.mock('core/index', () => ({
        hasSomeConnections: () => true,
        prefill: () => ({
          toJS() {
            return {
              email: 'prefill@example.com',
              phoneNumber: '12354'
            };
          }
        })
      }));
      jest.mock('field/email', () => ({
        setEmail: jest.fn(m => m)
      }));
      jest.mock('field/phone_number', () => ({
        setPhoneNumber: jest.fn(m => m)
      }));
    });
    it('when prefill options has `email` value', () => {
      const engine = getEngine();
      engine.didReceiveClientSettings('model');
      const setEmailMockCalls = require('field/email').setEmail.mock.calls;
      expect(setEmailMockCalls.length).toBe(1);
      expect(setEmailMockCalls[0][0]).toBe('model');
      expect(setEmailMockCalls[0][1]).toBe('prefill@example.com');
    });
    it('when prefill options has `phoneNumber` value', () => {
      const engine = getEngine();
      engine.didReceiveClientSettings('model');
      const setPhoneNumberMockCalls = require('field/phone_number').setPhoneNumber.mock.calls;
      expect(setPhoneNumberMockCalls.length).toBe(1);
      expect(setPhoneNumberMockCalls[0][0]).toBe('model');
      expect(setPhoneNumberMockCalls[0][1]).toBe('12354');
    });
  });
});
