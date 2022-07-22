import React from 'react';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('connection/enterprise');
jest.mock('core/index');

jest.mock('field/social/social_buttons_pane', () => mockComponent('social_buttons_pane'));
// jest.mock('core/error_screen', () => mockComponent('error_screen'));
// jest.mock('core/loading_screen', () => mockComponent('loading_screen'));
jest.mock('field/email/email_pane', () => mockComponent('email_pane'));
// jest.mock('field/captcha/captcha_pane', () => mockComponent('captcha_pane'));
jest.mock('core/pane_separator', () => mockComponent('pane_separator'));
jest.mock('connection/database/sign_up_terms', () => mockComponent('sign_up_terms'));
jest.mock('connection/passwordless/index', () => ({
  isEmail: jest.fn()
}));

const getComponent = () => {
  const SocialOrEmailScreen = require('engine/passwordless/social_or_email_login_screen').default;
  const screen = new SocialOrEmailScreen();
  return screen.render();
};

describe('email passwordless', () => {
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

    jest.mock('connection/enterprise', () => ({
      isHRDEmailValid: jest.fn(() => false)
    }));

    jest.mock('core/index', () => ({
      hasSomeConnections: jest.fn(() => true)
    }));
  });

  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    model: 'model'
  };

  it('renders correctly', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
});
