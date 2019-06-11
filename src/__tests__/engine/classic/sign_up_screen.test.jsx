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

const getScreen = () => {
  const SignUpScreen = require('engine/classic/sign_up_screen').default;
  return new SignUpScreen();
};

const getComponent = () => {
  return getScreen().render();
};

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      databaseUsernameValue: (model, options) => {
        expect(options.emailFirst).toBe(true);
        return 'foo@bar.com';
      },
      termsAccepted: () => true,
      hasScreen: () => false,
      mustAcceptTerms: () => false,
      showTerms: () => true
    }));

    jest.mock('connection/database/actions', () => ({
      signUp: jest.fn(),
      toggleTermsAcceptance: jest.fn()
    }));
    jest.mock('engine/classic', () => ({
      hasOnlyClassicConnections: () => false,
      isSSOEnabled: (model, options) => {
        expect(options.emailFirst).toBe(true);
        return false;
      }
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

    jest.mock('connection/enterprise', () => ({
      isHRDDomain: () => false
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
  describe('on Submit, uses `options.emailFirst=true` and', () => {
    it('calls signup', () => {
      const screen = getScreen();
      screen.submitHandler()();
      const { mock } = require('connection/database/actions').signUp;
      expect(mock.calls.length).toBe(1);
    });
  });
  describe('renders SignupTerms', () => {
    it('when showTerms() && `terms` are truthy', () => {
      const screen = getScreen();
      const terms = screen.renderTerms('m', true);
      expect(terms).not.toBe(null);
    });
    it('with a checkbox when mustAcceptTerms() is true', () => {
      require('connection/database/index').mustAcceptTerms = () => true;
      const screen = getScreen();
      const terms = screen.renderTerms('m', true);
      expect(terms.props.showCheckbox).toBe(true);
    });
    it('without a checkbox when mustAcceptTerms() is true', () => {
      require('connection/database/index').mustAcceptTerms = () => false;
      const screen = getScreen();
      const terms = screen.renderTerms('m', true);
      expect(terms.props.showCheckbox).toBe(false);
    });
  });
  it('do not render SignupTerms when showTerms() is false', () => {
    require('connection/database/index').showTerms = () => false;
    const screen = getScreen();
    const terms = screen.renderTerms('m', true);
    expect(terms).toBe(null);
  });
  it('do not render SignupTerms when `terms` is falsy', () => {
    const screen = getScreen();
    const terms = screen.renderTerms('m', undefined);
    expect(terms).toBe(null);
  });
});
