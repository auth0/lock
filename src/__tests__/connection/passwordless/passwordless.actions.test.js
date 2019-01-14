import passwordless from 'connection/passwordless/actions';
import { expectMockToMatch } from 'testUtils';

jest.useFakeTimers();

describe('passwordless actions', () => {
  let mockFns;
  let actions;
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/passwordless/index', () => ({
      isEmail: jest.fn(),
      isSendLink: jest.fn(),
      resend: 'resend',
      restartPasswordless: jest.fn(),
      send: () => 'send',
      setPasswordlessStarted: jest.fn(),
      setResendFailed: jest.fn(),
      setResendSuccess: jest.fn(),
      toggleTermsAcceptance: jest.fn()
    }));
    jest.mock('field/phone_number', () => ({
      phoneNumberWithDiallingCode: () => 'phoneNumberWithDiallingCode'
    }));
    jest.mock('field/index', () => ({
      getFieldValue: (m, field) => field
    }));
    jest.mock('core/web_api', () => ({
      startPasswordless: jest.fn(),
      passwordlessVerify: jest.fn()
    }));
    jest.mock('core/actions', () => ({
      closeLock: jest.fn(),
      logIn: jest.fn(),
      validateAndSubmit: jest.fn(),
      logInSuccess: jest.fn()
    }));
    jest.mock('i18n', () => ({ html: (_, keys) => keys.join(',') }));
    jest.mock('core/index', () => ({
      id: () => 'id',
      setSubmitting: jest.fn(m => m),
      auth: {
        params: () => ({
          toJS: () => ({
            auth: 'params'
          })
        })
      }
    }));
    jest.mock('store/index', () => ({
      read: jest.fn(() => 'model'),
      getEntity: 'getEntity',
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));

    actions = require('connection/passwordless/actions');
  });
  describe('requestPasswordlessEmail()', () => {
    it('calls validateAndSubmit()', () => {
      actions.requestPasswordlessEmail('id');
      expectMockToMatch(require('core/actions').validateAndSubmit, 1);
    });
    it('calls startPasswordless', () => {
      actions.requestPasswordlessEmail('id');
      require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
      expectMockToMatch(require('core/web_api').startPasswordless, 1);
    });
    it('calls setPasswordlessStarted() on success', () => {
      actions.requestPasswordlessEmail('id');
      require('core/actions').validateAndSubmit.mock.calls[0][2]('model');

      require('core/web_api').startPasswordless.mock.calls[0][2](null);

      const { swap } = require('store/index');
      expectMockToMatch(swap, 1);

      swap.mock.calls[0][3]('model');
      expectMockToMatch(require('core/index').setSubmitting, 1);
      expectMockToMatch(require('connection/passwordless/index').setPasswordlessStarted, 1);
    });
    describe('normalizes the error message', () => {
      it('with a generic error', () => {
        actions.requestPasswordlessEmail('id');
        require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
        const error = new Error('foobar');
        error.error = 'some_error_code';
        require('core/web_api').startPasswordless.mock.calls[0][2](error);

        jest.runAllTimers();

        const { read, swap } = require('store/index');
        expectMockToMatch(read, 1);
        expectMockToMatch(swap, 1);
      });
      it('with a sms_provider_error error and description includes (Code: 21211)', () => {
        actions.requestPasswordlessEmail('id');
        require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
        const error = new Error('foobar');
        error.error = 'sms_provider_error';
        error.description = 'something (Code: 21211)';
        require('core/web_api').startPasswordless.mock.calls[0][2](error);

        jest.runAllTimers();

        const { read, swap } = require('store/index');
        expectMockToMatch(swap, 1);
      });
    });
  });
  describe('resendEmail()', () => {
    it('calls setResendSuccess() on success', () => {
      actions.resendEmail('id');

      const { read, swap } = require('store/index');
      expectMockToMatch(read, 1);
      expectMockToMatch(swap, 1);

      require('core/web_api').startPasswordless.mock.calls[0][2](null);

      swap.mock.calls[1][3]('model');
      expectMockToMatch(require('connection/passwordless/index').setResendSuccess, 1);
    });
    it('calls setResendFailed on error', () => {
      actions.resendEmail('id');

      const { read, swap } = require('store/index');
      expectMockToMatch(read, 1);
      expectMockToMatch(swap, 1);

      require('core/web_api').startPasswordless.mock.calls[0][2](new Error('foobar'));
      jest.runAllTimers();
      swap.mock.calls[1][3]('model');
      expectMockToMatch(require('connection/passwordless/index').setResendFailed, 1);
    });
  });
  describe('sendSMS()', () => {
    it('calls validateAndSubmit()', () => {
      actions.sendSMS('id');
      expectMockToMatch(require('core/actions').validateAndSubmit, 1);
    });
    it('calls startPasswordless', () => {
      actions.sendSMS('id');
      require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
      expectMockToMatch(require('core/web_api').startPasswordless, 1);
    });
    it('calls setPasswordlessStarted() on success', () => {
      actions.sendSMS('id');
      require('core/actions').validateAndSubmit.mock.calls[0][2]('model');

      require('core/web_api').startPasswordless.mock.calls[0][2](null);

      const { swap } = require('store/index');
      expectMockToMatch(swap, 1);

      swap.mock.calls[0][3]('model');
      expectMockToMatch(require('core/index').setSubmitting, 1);
      expectMockToMatch(require('connection/passwordless/index').setPasswordlessStarted, 1);
    });
    describe('normalizes the error message', () => {
      it('with a generic error', () => {
        actions.sendSMS('id');
        require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
        const error = new Error('foobar');
        error.error = 'some_error_code';
        require('core/web_api').startPasswordless.mock.calls[0][2](error);

        jest.runAllTimers();

        const { read, swap } = require('store/index');
        expectMockToMatch(read, 1);
        expectMockToMatch(swap, 1);
      });
      it('with a sms_provider_error error and description includes (Code: 21211)', () => {
        actions.sendSMS('id');
        require('core/actions').validateAndSubmit.mock.calls[0][2]('model');
        const error = new Error('foobar');
        error.error = 'sms_provider_error';
        error.description = 'something (Code: 21211)';
        require('core/web_api').startPasswordless.mock.calls[0][2](error);

        jest.runAllTimers();

        const { read, swap } = require('store/index');
        expectMockToMatch(swap, 1);
      });
    });
  });
  describe('login()', () => {
    it('sets setSubmitting to true', () => {
      actions.logIn('id');

      const { read, swap } = require('store/index');
      expectMockToMatch(read, 1);
      expectMockToMatch(swap, 1);
    });
    it('calls webApi.passwordlessVerify() with sms options', () => {
      actions.logIn('id');
      expectMockToMatch(require('core/web_api').passwordlessVerify, 1);
    });
    it('calls webApi.passwordlessVerify() with email options', () => {
      require('connection/passwordless/index').isEmail = () => true;
      actions.logIn('id');
      expectMockToMatch(require('core/web_api').passwordlessVerify, 1);
    });
    describe('on webApi.passwordlessVerify() callback', () => {
      it('formats error when there is an error ', () => {
        actions.logIn('id');

        const error = new Error('foobar');
        error.error = 'some_error_code';
        require('core/web_api').passwordlessVerify.mock.calls[0][2](error);

        const { swap } = require('store/index');
        expectMockToMatch(swap, 2);
      });
      it('calls logInSuccess on success', () => {
        actions.logIn('id');
        require('core/web_api').passwordlessVerify.mock.calls[0][2](null, { result: true });

        expectMockToMatch(require('core/actions').logInSuccess, 1);
      });
    });
  });
  describe('toggleTermsAcceptance()', () => {
    it('calls internalToggleTermsAcceptance()', () => {
      actions.toggleTermsAcceptance('id');

      const { swap } = require('store/index');
      expectMockToMatch(swap, 1);

      swap.mock.calls[0][3]('model');

      expectMockToMatch(require('connection/passwordless/index').toggleTermsAcceptance, 1);
    });
  });
  it('restart calls restartPasswordless', () => {
    actions.restart('id');

    const { swap } = require('store/index');
    expectMockToMatch(swap, 1);
  });
});
