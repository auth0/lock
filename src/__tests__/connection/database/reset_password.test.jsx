import React from 'react';
import { expectComponent, mockComponent } from 'testUtils';
import I from 'immutable';
import { setField } from '../../../field';

jest.mock('connection/database/reset_password_pane', () => mockComponent('reset_password_pane'));

const getScreen = () => {
  const ResetPasswordScreen = require('connection/database/reset_password').default;
  return new ResetPasswordScreen();
};

const getComponent = () => {
  const screen = getScreen();
  return screen.render();
};

describe('ResetPasswordScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      databaseUsernameValue: (model, options) => {
        expect(options.emailFirst).toBe(true);
        return 'foo@test.com';
      }
    }));

    jest.mock('connection/enterprise', () => ({
      isEnterpriseDomain: () => true
    }));

    jest.mock('i18n', () => ({
      str: (_, keys) => keys.join(',')
    }));

    jest.mock('core/index', () => ({
      id: () => 'id',
      setGlobalError: 'setGlobalError',
      clearGlobalError: 'clearGlobalError',
      connectionResolver: jest.fn().mockReturnValue(undefined),
      ui: {
        allowAutocomplete: () => false
      },
      submitting: () => false
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });

  it('isSubmitDisabled returns true when `isEnterpriseDomain` is true', () => {
    jest.useFakeTimers();
    require('connection/enterprise').isEnterpriseDomain = () => true;
    const screen = getScreen();
    expect(screen.isSubmitDisabled()).toBe(true);
    jest.runTimersToTime(50);
    expect(require('store/index').swap.mock.calls[0]).toMatchSnapshot();
  });

  it('isSubmitDisabled returns false when `isEnterpriseDomain` is false', () => {
    require('connection/enterprise').isEnterpriseDomain = () => false;
    const screen = getScreen();
    expect(screen.isSubmitDisabled()).toBe(false);
    expect(require('store/index').swap.mock.calls[0]).toMatchSnapshot();
  });

  describe('a custom connection resolver is being used', () => {
    let lock;
    let i18n;

    beforeEach(() => {
      lock = I.fromJS({
        id: '__lock-id__'
      });

      i18n = {
        html: jest.fn(),
        str: jest.fn()
      };
    });

    it('copies the username to the email field if an email address was entered', () => {
      require('core/index').connectionResolver.mockReturnValue(() => () => true);
      const store = require('store/index');
      const Component = getComponent();

      // Set a field on Lock to set the username field, then check it was set as the email
      const l = setField(lock, 'username', 'test@test.com');

      expectComponent(<Component i18n={i18n} model={l} />).toMatchSnapshot();

      expect(store.swap).toHaveBeenCalledWith(
        'updateEntity',
        'lock',
        'id',
        expect.anything(),
        'test@test.com',
        false
      );
    });

    it('sets the email field to a blank value if username is not an email address', () => {
      require('core/index').connectionResolver.mockReturnValue(() => () => true);
      const store = require('store/index');
      const Component = getComponent();

      // Set a field on Lock to set the username field, then check it was set as the email
      const l = setField(lock, 'username', 'some-username');

      expectComponent(<Component i18n={i18n} model={l} />).toMatchSnapshot();

      expect(store.swap).toHaveBeenCalledWith(
        'updateEntity',
        'lock',
        'id',
        expect.anything(),
        '',
        false
      );
    });
  });
});
