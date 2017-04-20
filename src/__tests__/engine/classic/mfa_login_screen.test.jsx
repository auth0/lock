import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('connection/database/mfa_pane', () => mockComponent('mfa_pane'));

//there's a circular dependency with this module, so we need to mock it
jest.mock('engine/classic');

const getComponent = () => {
  const MFALoginScreen = require('engine/classic/mfa_login_screen').default;
  const screen = new MFALoginScreen();
  return screen.render();
};

describe('MFALoginScreen', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      hasScreen: () => false
    }));

    jest.mock('connection/database/actions', () => ({
      cancelMFALogin: jest.fn(),
      logIn: jest.fn()
    }));

    jest.mock('core/signed_in_confirmation', () => ({
      renderSignedInConfirmation: jest.fn()
    }));
  });
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(',')
    },
    model: 'model'
  };
  it('renders correctly', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
});
