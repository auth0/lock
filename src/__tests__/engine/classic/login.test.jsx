import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('core/pane_separator', () => mockComponent('pane_separator'));
jest.mock('field/social/social_buttons_pane', () => mockComponent('social_buttons_pane'));
jest.mock('connection/database/login_pane', () => mockComponent('login_pane'));
jest.mock('connection/database/login_sign_up_tabs', () => mockComponent('login_sign_up_tabs'));
jest.mock('connection/enterprise/single_sign_on_notice', () =>
  mockComponent('single_sign_on_notice')
);

const getComponent = () => {
  const LoginScreen = require('engine/classic/login').default;
  const screen = new LoginScreen();
  return screen.render();
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      databaseConnection: () => false,
      databaseUsernameValue: () => false,
      databaseUsernameStyle: () => false,
      defaultDatabaseConnection: () => false,
      hasInitialScreen: () => false,
      hasScreen: () => false,
      signUpLink: () => false
    }));

    jest.mock('connection/database/actions', () => ({ logIn: jest.fn() }));

    jest.mock('connection/enterprise', () => ({
      defaultEnterpriseConnection: () => false,
      findADConnectionWithoutDomain: () => false,
      isHRDDomain: () => false
    }));

    jest.mock('connection/enterprise/actions', () => ({
      logIn: jest.fn(),
      startHRD: jest.fn()
    }));

    jest.mock('core/signed_in_confirmation', () => ({
      renderSignedInConfirmation: jest.fn()
    }));

    jest.mock('engine/classic', () => ({
      hasOnlyClassicConnections: () => false,
      isSSOEnabled: () => false,
      useBigSocialButtons: () => false
    }));

    jest.mock('i18n', () => ({ str: (_, keys) => keys.join(',') }));

    jest.mock('core/index', () => ({
      hasSomeConnections: () => false,
      countConnections: () => 0
    }));
  });
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    model: 'model'
  };
  it('renders empty div by default', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('renders SocialButtonsPane when has social connections', () => {
    require('core/index').hasSomeConnections = (m, connection) => connection === 'social';
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('renders SingleSignOnNotice when SSO is enabled', () => {
    require('engine/classic').isSSOEnabled = () => true;
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  describe('renders LoginSignUpTabs', () => {
    it('when database connection is enabled and has screen signUp', () => {
      require('core/index').hasSomeConnections = (m, connection) => connection === 'database';
      require('connection/database/index').hasScreen = (m, screenName) => screenName === 'signUp';
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
    it('when social connection is enabled and has initial screen signUp and has screen signUp', () => {
      require('core/index').hasSomeConnections = (m, connection) => connection === 'database';
      require('connection/database/index').hasInitialScreen = (m, screenName) =>
        screenName === 'signUp';
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
  });
  describe('renders LoginPane', () => {
    it('when SSO is enabled', () => {
      require('engine/classic').isSSOEnabled = () => true;
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
    it('when has database connection', () => {
      require('core/index').hasSomeConnections = (m, connection) => connection === 'database';
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
    it('when has enterprise connection', () => {
      require('core/index').hasSomeConnections = (m, connection) => connection === 'enterprise';
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
  });
});
