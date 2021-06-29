import { checkSession, logIn } from '../../core/actions';
import { expectMockToMatch } from 'testUtils';
import * as l from 'core/index';
import { read } from 'store/index';
import webApi from '../../core/web_api';
import { fromJS } from 'immutable';

jest.mock('../../core/web_api', () => ({
  __esModule: true,
  default: {
    logIn: jest.fn(),
    checkSession: jest.fn()
  }
}));

jest.mock('store/index', () => ({
  read: jest.fn(() => 'model'),
  getEntity: 'getEntity',
  swap: jest.fn(),
  updateEntity: 'updateEntity',
  read: jest.fn()
}));

jest.mock('core/index');

describe('core.actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    l.submitting.mockReturnValue(true);
    l.id.mockReturnValue('id');
    l.auth.params.mockReturnValue(fromJS({}));
  });

  describe('checkSession', () => {
    it('should set submitting on start', () => {
      checkSession('id', 'params', 'cb');
      const { read, swap } = require('store/index');
      expectMockToMatch(read, 1);
      expectMockToMatch(swap, 1);
      swap.mock.calls[0][3]('model');
      expectMockToMatch(require('core/index').setSubmitting, 1);
    });
  });

  describe('logIn', () => {
    it('run the loggingIn hook', done => {
      const m = {};
      read.mockReturnValue(m);

      webApi.logIn.mockImplementation((id, params, authParams, cb) => {
        cb(null, {});
        done();
      });

      l.runHook.mockImplementation((m, hook, context, fn) => {
        expect(hook).toEqual('loggingIn');
        fn();
      });

      logIn();
    });

    it('should display an error if one was thrown from the hook', done => {
      const m = {};
      read.mockReturnValue(m);

      const store = require('store/index');

      store.swap.mockImplementation((entity, n, id, fn, value, error) => {
        if (error) {
          expect(error).toEqual('This is a hook error');
          done();
        }
      });

      l.loginErrorMessage.mockImplementation((m, error) => error.description);

      l.runHook.mockImplementation((m, hook, fn) => {
        expect(hook).toEqual('loggingIn');
        throw { code: 'hook_error', description: 'This is a hook error' };
      });

      logIn();
    });
  });
});
