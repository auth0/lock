import React from 'react';
import { render } from '@testing-library/react';
import Immutable from 'immutable';

import { extractPropsFromWrapper, getMockProps, mockComponent, setURL } from 'testUtils';

jest.mock('ui/pane/quick_auth_pane', () => mockComponent('quick_auth_pane'));

//there's a circular dependency with this module, so we need to mock it
jest.mock('engine/classic');

const getComponent = () => {
  const LastLoginScreen = require('core/sso/last_login_screen').default;
  const screen = new LastLoginScreen();
  return screen.render();
};

const renderAndGetProps = (Component, props) => {
  const { container } = render(<Component {...props} />);
  return getMockProps(container.querySelector('[data-__type="quick_auth_pane"]'));
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
        twitter: 'Twitter',
        'this-strategy-exists': 'Test Strategy'
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

  describe('renders correct icon', () => {
    const testStrategyName = 'this-strategy-exists';

    const EXPECTED_ICONS = {
      [testStrategyName]: testStrategyName, // known social strategy → returns strategy itself
      'google-apps': 'google-apps', // explicit passthrough
      adfs: 'windows',
      office365: 'windows',
      waad: 'windows',
      'some-other-strategy': 'auth0' // unknown → fallback
    };

    Object.entries(EXPECTED_ICONS).forEach(([strategy, expectedIcon]) => {
      it(`uses correct icon when strategy is ${strategy}`, () => {
        require('core/sso/index').lastUsedConnection = () => Immutable.fromJS({ strategy });
        const Component = getComponent();
        const props = renderAndGetProps(Component, defaultProps);
        expect(props.strategy).toBe(expectedIcon);
      });
    });

    it('maps adfs/office365/waad to "windows" icon', () => {
      require('core/sso/index').lastUsedConnection = () => Immutable.fromJS({ strategy: 'adfs' });
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.strategy).toBe('windows');
    });

    it('uses connection name as icon for unknown strategy', () => {
      require('core/sso/index').lastUsedConnection = () =>
        Immutable.fromJS({ strategy: 'unknown-strategy', name: 'my-conn' });
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.strategy).toBe('auth0');
    });

    it('uses name as strategy when strategy field is empty', () => {
      require('core/sso/index').lastUsedConnection = () =>
        Immutable.fromJS({ name: testStrategyName });
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.strategy).toBe(testStrategyName);
    });
  });

  describe('renders correct buttonLabel', () => {
    it('uses lastUsedUsername when present', () => {
      require('core/sso/index').lastUsedUsername = () => 'lastUsedUsername';
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.buttonLabel).toBe('lastUsedUsername');
    });

    it('uses SOCIAL_STRATEGY mapping when there is no lastUsedUsername', () => {
      require('core/sso/index').lastUsedConnection = () => ({ get: () => 'twitter' });
      require('core/sso/index').lastUsedUsername = () => undefined;
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.buttonLabel).toBe('Twitter');
    });

    it('uses lastUsedConnectionName when there is no lastUsedUsername and no SOCIAL_STRATEGY mapping', () => {
      require('core/sso/index').lastUsedUsername = () => undefined;
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.buttonLabel).toBe('lastUsedConnection');
    });
  });

  describe('renders with custom connection theme', () => {
    it('passes primaryColor and foregroundColor from theme', () => {
      require('connection/social/index').authButtonsTheme = () => ({
        get: () =>
          Immutable.fromJS({
            primaryColor: 'primaryColor',
            foregroundColor: 'foregroundColor',
            icon: 'icon'
          })
      });
      const Component = getComponent();
      const props = renderAndGetProps(Component, defaultProps);
      expect(props.primaryColor).toBe('primaryColor');
      expect(props.foregroundColor).toBe('foregroundColor');
      expect(props.buttonIcon).toBe('icon');
    });
  });

  it('calls checkSession in the buttonClickHandler when outside of the universal login page', () => {
    setURL('https://other-url.auth0.com');
    const Component = getComponent();
    const { container } = render(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'quick_auth_pane');
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
    const { container } = render(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'quick_auth_pane');
    props.buttonClickHandler();
    const { mock } = require('quick-auth/actions').logIn;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('id');
    expect(mock.calls[0][1].get()).toBe('lastUsedConnection');
    expect(mock.calls[0][2]).toBe('lastUsedUsername');
  });
  it('calls skipQuickAuth in the alternativeClickHandler', () => {
    const Component = getComponent();
    const { container } = render(<Component {...defaultProps} />);
    const props = extractPropsFromWrapper(container, 'quick_auth_pane');
    props.alternativeClickHandler();
    const { mock } = require('quick-auth/actions').skipQuickAuth;
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0][0]).toBe('id');
  });
});
