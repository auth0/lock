import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('engine/classic/sign_up_pane', () => mockComponent('sign_up_pane'));
jest.mock('core/pane_separator', () => mockComponent('pane_separator'));
jest.mock('connection/database/sign_up_terms', () => mockComponent('sign_up_terms'));
jest.mock('field/social/social_buttons_pane', () => mockComponent('social_buttons_pane'));
jest.mock('connection/database/login_sign_up_tabs', () => mockComponent('login_sign_up_tabs'));
jest.mock('connection/enterprise/single_sign_on_notice', () =>
  mockComponent('single_sign_on_notice')
);

const getComponent = () => {
  const SignUpScreen = require('engine/classic/sign_up_screen').default;
  const screen = new SignUpScreen();
  return screen.render();
};

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      termsAccepted: () => true,
      hasScreen: () => false,
      mustAcceptTerms: () => false
    }));

    jest.mock('connection/database/actions', () => ({
      signUp: jest.fn(),
      toggleTermsAcceptance: jest.fn()
    }));
    jest.mock('engine/classic', () => ({
      hasOnlyClassicConnections: () => false,
      isSSOEnabled: () => false,
      useBigSocialButtons: () => false
    }));
    jest.mock('core/signed_in_confirmation', () => ({
      renderSignedInConfirmation: jest.fn()
    }));
    jest.mock('connection/database/signed_up_confirmation', () => ({
      renderSignedUpConfirmation: jest.fn()
    }));

    jest.mock('field/index', () => ({
      renderOptionSelection: () => false
    }));

    jest.mock('connection/enterprise/actions', () => ({
      logIn: jest.fn()
    }));

    jest.mock('i18n', () => ({ str: (_, keys) => keys.join(',') }));

    jest.mock('core/index', () => ({
      hasSomeConnections: () => false,
      id: () => 'id'
    }));
  });
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      group: (...keys) => keys.join(','),
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
  it('disables SocialButtonsPane when terms were not accepted', () => {
    require('core/index').hasSomeConnections = (m, connection) => connection === 'social';
    require('connection/database/index').termsAccepted = () => false;
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('renders SingleSignOnNotice when SSO is enabled and has screen login', () => {
    require('engine/classic').isSSOEnabled = () => true;
    require('connection/database/index').hasScreen = (m, screenName) => screenName === 'login';

    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('renders LoginSignUpTabs SSO is disabled and has screen login', () => {
    require('connection/database/index').hasScreen = (m, screenName) => screenName === 'login';
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  describe('renders SignUpPane', () => {
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
