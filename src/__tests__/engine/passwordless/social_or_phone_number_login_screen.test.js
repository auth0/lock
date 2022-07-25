import React from 'react';

import { expectComponent, mockComponent } from 'testUtils';

jest.mock('connection/enterprise');
jest.mock('core/index');

jest.mock('field/social/social_buttons_pane', () => mockComponent('social_buttons_pane'));
jest.mock('field/phone-number/phone_number_pane', () => mockComponent('phone_number_pane'));
jest.mock('field/captcha/captcha_pane', () => mockComponent('captcha_pane'));
jest.mock('core/pane_separator', () => mockComponent('pane_separator'));
jest.mock('connection/database/sign_up_terms', () => mockComponent('sign_up_terms'));
jest.mock('connection/passwordless/index', () => ({
  isEmail: jest.fn()
}));

const getComponent = () => {
  const SocialOrPhoneNumberScreen = require('engine/passwordless/social_or_phone_number_login_screen').default;
  const screen = new SocialOrPhoneNumberScreen();
  return screen.render();
};

describe('sms passwordless', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();

    jest.mock('connection/database/index', () => ({
      hasScreen: () => false,
      databaseUsernameValue: jest.fn()
    }));

    jest.mock('connection/database/actions', () => ({
      cancelMFALogin: jest.fn(),
      logIn: jest.fn()
    }));

    jest.mock('core/signed_in_confirmation', () => ({
      renderSignedInConfirmation: jest.fn()
    }));

    jest.mock('connection/enterprise', () => ({
      isHRDEmailValid: jest.fn(() => false),
      isHRDDomain: jest.fn(() => true)
    }));

    jest.mock('core/index', () => ({
      hasSomeConnections: jest.fn(() => true),
      captcha: jest.fn()
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

  it('renders a captcha', () => {
    const Component = getComponent();

    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
});
