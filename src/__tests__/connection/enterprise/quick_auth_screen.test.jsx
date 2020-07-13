import React from 'react';
import I from 'immutable';
import { expectComponent } from 'testUtils';

jest.mock('engine/classic');

const getComponent = () => {
  const MFALoginScreen = require('connection/enterprise/quick_auth_screen').default;
  const screen = new MFALoginScreen();
  return screen.render();
};

describe('The quick auth screen', () => {
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: jest.fn()
    }
  };

  beforeEach(() => {
    jest.resetModules();

    const mockConnection = I.fromJS({
      name: 'Test',
      domains: ['test.com']
    });

    jest.mock('connection/social/index', () => ({
      hasScreen: false,
      authButtonsTheme: jest.fn(() => ({
        get: jest.fn()
      }))
    }));

    jest.mock('connection/enterprise', () => ({
      quickAuthConnection: jest.fn(() => mockConnection)
    }));

    jest.mock('core/index', () => ({
      ui: {
        preferConnectionDisplayName: jest.fn(() => false)
      }
    }));
  });

  it('renders the connection using the domain', async () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the connection using the display name when preferConnectionDisplayName is true', () => {
    const mockConnection = I.fromJS({
      name: 'Test',
      domains: ['test.com'],
      displayName: 'My Connection'
    });

    const { quickAuthConnection } = require('connection/enterprise');
    quickAuthConnection.mockReturnValue(mockConnection);

    const l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the connection using the connection domain when preferConnectionDisplayName is true, but no display name available', () => {
    const mockConnection = I.fromJS({
      name: 'Test',
      domains: ['test.com']
    });

    const { quickAuthConnection } = require('connection/enterprise');
    quickAuthConnection.mockReturnValue(mockConnection);

    const l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the connection using the connection display name when preferConnectionDisplayName is true and there are no IdP domains configured', () => {
    const mockConnection = I.fromJS({
      name: 'Test',
      displayName: 'My Connection'
    });

    const { quickAuthConnection } = require('connection/enterprise');
    quickAuthConnection.mockReturnValue(mockConnection);

    const l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('renders the connection using the connection name when there is no domain available', () => {
    const mockConnection = I.fromJS({
      name: 'Test'
    });

    const { quickAuthConnection } = require('connection/enterprise');
    quickAuthConnection.mockReturnValue(mockConnection);

    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
});
