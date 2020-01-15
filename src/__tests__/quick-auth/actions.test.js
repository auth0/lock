import { logIn } from '../../quick-auth/actions';

jest.mock('../../core/actions', () => ({
  logIn: jest.fn()
}));

jest.mock('store/index', () => ({
  read: jest.fn(() => 'model'),
  getEntity: 'getEntity',
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

jest.mock('../../core/index', () => ({
  id: () => 'id',
  auth: {
    connectionScopes: jest.fn(() => ({
      get: jest.fn()
    })),
    redirect: jest.fn(() => true)
  },
  setSuppressSubmitOverlay: jest.fn()
}));

describe('quick-auth.actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls logIn with the correct parameters', () => {
    const connection = {
      get: jest.fn(key => {
        switch (key) {
          case 'name':
            return 'name';
          case 'strategy':
            return 'google';
        }
      })
    };

    logIn('id', connection, 'hint', 'prompt');

    const coreActions = require('../../core/actions');

    expect(coreActions.logIn.mock.calls.length).toBe(1);
    expect(coreActions.logIn.mock.calls[0]).toMatchSnapshot();
  });

  it('sets display to "popup" when using facebook and there\'s no redirect', () => {
    const connection = {
      get: jest.fn(key => {
        switch (key) {
          case 'name':
            return 'name';
          case 'strategy':
            return 'facebook';
        }
      })
    };

    const core = require('../../core/index');
    core.auth.redirect = jest.fn(() => false);

    logIn('id', connection);

    const coreActions = require('../../core/actions');

    expect(coreActions.logIn.mock.calls.length).toBe(1);
    expect(coreActions.logIn.mock.calls[0]).toMatchSnapshot();
  });

  it('calls setSuppressSubmitOverlay with true when using Apple connection', () => {
    const connection = {
      get: jest.fn(key => {
        switch (key) {
          case 'name':
            return 'name';
          case 'strategy':
            return 'apple';
        }
      })
    };

    logIn('id', connection);

    const { swap } = require('store/index');
    const l = require('../../core/index');

    expect(swap.mock.calls.length).toBe(1);
    expect(swap.mock.calls[0][3]).toBe(l.setSupressSubmitOverlay);
    expect(swap.mock.calls[0][4]).toBe(true);
  });

  it('calls setSuppressSubmitOverlay with false when not using Apple connection', () => {
    const connection = {
      get: jest.fn(key => {
        switch (key) {
          case 'name':
            return 'name';
          case 'strategy':
            return 'facebook';
        }
      })
    };

    logIn('id', connection);

    const { swap } = require('store/index');
    const l = require('../../core/index');

    expect(swap.mock.calls.length).toBe(1);
    expect(swap.mock.calls[0][3]).toBe(l.setSupressSubmitOverlay);
    expect(swap.mock.calls[0][4]).toBe(false);
  });
});
