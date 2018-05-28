import React from 'react';
import { mount } from 'enzyme';

const getScreen = () => {
  const ResetPasswordScreen = require('connection/database/reset_password').default;
  return new ResetPasswordScreen();
};

describe('ResetPasswordScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      databaseUsernameValue: () => 'foo@test.com'
    }));

    jest.mock('connection/enterprise', () => ({
      isEnterpriseDomain: () => true
    }));

    jest.mock('i18n', () => ({ str: (_, keys) => keys.join(',') }));

    jest.mock('core/index', () => ({
      id: () => 'id',
      setGlobalError: 'setGlobalError',
      clearGlobalError: 'clearGlobalError'
    }));

    jest.mock('store/index', () => ({
      swap: jest.fn(),
      updateEntity: 'updateEntity'
    }));
  });
  it('isSubmitDisabled returns true when `isEnterpriseDomain` is true', () => {
    require('connection/enterprise').isEnterpriseDomain = () => true;
    const screen = getScreen();
    expect(screen.isSubmitDisabled()).toBe(true);
    expect(require('store/index').swap.mock.calls[0]).toMatchSnapshot();
  });
  it('isSubmitDisabled returns false when `isEnterpriseDomain` is false', () => {
    require('connection/enterprise').isEnterpriseDomain = () => false;
    const screen = getScreen();
    expect(screen.isSubmitDisabled()).toBe(false);
    expect(require('store/index').swap.mock.calls[0]).toMatchSnapshot();
  });
});
