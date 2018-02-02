import React from 'react';
import { mount } from 'enzyme';
import Immutable from 'immutable';

import { expectComponent, extractPropsFromWrapper, mockComponent, setURL } from 'testUtils';

jest.mock('ui/pane/quick_auth_pane', () => mockComponent('quick_auth_pane'));

//there's a circular dependency with this module, so we need to mock it
jest.mock('engine/classic');

const getComponent = () => {
  const LastLoginScreen = require('core/sso/last_login_screen').default;
  const screen = new LastLoginScreen();
  return screen.render();
};

describe('LastLoginScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('quick-auth/actions', () => ({
      logIn: jest.fn(),
      checkSession: jest.fn(),
      skipQuickAuth: jest.fn()
    }));

    jest.mock('core/index', () => ({
      id: () => 'id',
      domain: () => 'me.auth0.com'
    }));

    jest.mock('core/sso/index', () => ({
      lastUsedConnection: () => ({
        get: () => 'lastUsedConnection'
      }),
      lastUsedUsername: () => 'lastUsedUsername'
    }));

    jest.mock('connection/social/index', () => ({
      STRATEGIES: {
        twitter: 'Twitter'
      },
      authButtonsTheme: () => ({
        get: () => undefined
      })
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
  it('renders correctly', () => {
    const Component = getComponent();
    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('renders with custom connection theme', () => {
    require('connection/social/index').authButtonsTheme = () => ({
      get: () =>
        Immutable.fromJS({
          primaryColor: 'primaryColor',
          foregroundColor: 'foregroundColor',
          icon: 'icon'
        })
    });
    const Component = getComponent();
    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  describe('renders correct icon', () => {
    const testStrategy = strategy => {
      it(`when strategy is ${strategy}`, () => {
        require('core/sso/index').lastUsedConnection = () =>
          Immutable.fromJS({
            strategy
          });
        const Component = getComponent();
        expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
      });
    };
    const testStrategyName = 'this-strategy-exists';
    require('connection/social/index').STRATEGIES = {
      [testStrategyName]: 'Test Strategy'
    };
    const strategies = [
      testStrategyName,
      'google-apps',
      'adfs',
      'office365',
      'waad',
      'some-other-strategy'
    ].forEach(testStrategy);

    it(`when strategy is empty, use name instead`, () => {
      require('core/sso/index').lastUsedConnection = () =>
        Immutable.fromJS({
          name: testStrategyName
        });
      const Component = getComponent();
      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
  });
  describe('renders correct buttonLabel', () => {
    it('uses SOCIAL_STRATEGY mapping when there is not a lastUsedUsername', () => {
      require('core/sso/index').lastUsedConnection = () => ({
        get: () => 'twitter'
      });
      require('core/sso/index').lastUsedUsername = () => undefined;
      const Component = getComponent();
      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
    it('uses lastUsedConnectionName when there is not a lastUsedUsername and no SOCIAL_STRATEGY mapping', () => {
      require('core/sso/index').lastUsedUsername = () => undefined;
      const Component = getComponent();
      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
  });
  it('calls checkSession in the buttonClickHandler when outside of the universal login page', () => {
    setURL('https://other-url.auth0.com');
    const Component = getComponent();
    const wrapper = mount(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.buttonClickHandler();
    const { mock } = require('quick-auth/actions').checkSession;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('id');
    expect(mock.calls[0][1].get()).toBe('lastUsedConnection');
    expect(mock.calls[0][2]).toBe('lastUsedUsername');
  });
  it('calls logIn in the buttonClickHandler when inside of the universal login page', () => {
    setURL('https://me.auth0.com');
    const Component = getComponent();
    const wrapper = mount(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.buttonClickHandler();
    const { mock } = require('quick-auth/actions').logIn;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('id');
    expect(mock.calls[0][1].get()).toBe('lastUsedConnection');
    expect(mock.calls[0][2]).toBe('lastUsedUsername');
  });
  it('calls skipQuickAuth in the alternativeClickHandler', () => {
    const Component = getComponent();
    const wrapper = mount(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(wrapper);
    props.alternativeClickHandler();
    const { mock } = require('quick-auth/actions').skipQuickAuth;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('id');
  });
});
