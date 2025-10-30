import React from 'react';
import { expectComponent, mockComponent } from 'testUtils';
import { expectShallowComponent } from '../../testUtils';
import { Flow } from '../../../connection/captcha';

jest.mock('field/email/email_pane', () => mockComponent('email_pane'));
jest.mock('field/password/password_pane', () => mockComponent('password_pane'));
jest.mock('field/username/username_pane', () => mockComponent('username_pane'));
jest.mock('field/custom_input', () => mockComponent('custom_input'));
jest.mock('field/captcha/captcha_pane', () => mockComponent('captcha_pane'));

jest.mock('core/index', () => ({
  signupCaptcha: jest.fn()
}));

jest.mock('engine/classic', () => ({
  isSSOEnabled: jest.fn()
}));

jest.mock('connection/enterprise', () => ({
  isHRDDomain: jest.fn()
}));

const getComponent = () => require('engine/classic/sign_up_pane').default;

describe('SignUpPane', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      additionalSignUpFields: () => [],
      databaseConnectionRequiresUsername: () => false,
      passwordStrengthPolicy: () => 'passwordStrengthPolicy',
      signUpFieldsStrictValidation: () => true,
      databaseUsernameValue: () => null
    }));
  });
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    flow: Flow.SIGNUP,
    model: 'model',
    emailInputPlaceholder: 'emailInputPlaceholder',
    onlyEmail: true,
    passwordInputPlaceholder: 'passwordInputPlaceholder',
    passwordStrengthMessages: 'passwordStrengthMessages',
    usernameInputPlaceholder: 'usernameInputPlaceholder',
    strictValidation: false
  };
  it('renders only email by default', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('shows header when instructions are available', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} instructions="instructions" />).toMatchSnapshot();
  });

  it('shows the Captcha pane', () => {
    require('core/index').signupCaptcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(false);

    const Component = getComponent();

    expectShallowComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('hides the Captcha pane for SSO connections', () => {
    require('core/index').signupCaptcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);

    const Component = getComponent();

    expectShallowComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  it('shows the Captcha pane for SSO (ADFS) connections', () => {
    require('core/index').signupCaptcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);
    require('connection/enterprise').isHRDDomain.mockReturnValue(true);

    const Component = getComponent();

    expectShallowComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  describe('onlyEmail is false', () => {
    it('shows PasswordPane', () => {
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} onlyEmail={false} />).toMatchSnapshot();
    });
    it('shows custom fields when additionalSignUpFields returns additional fields', () => {
      require('connection/database/index').additionalSignUpFields = () => [
        { get: key => `${key}1` },
        { get: key => `${key}2` }
      ];
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} onlyEmail={false} />).toMatchSnapshot();
    });
    it('shows UsernamePane when databaseConnectionRequiresUsername is true and signUpHideUsernameField is false', () => {
      require('connection/database/index').databaseConnectionRequiresUsername = () => true;
      require('connection/database/index').signUpHideUsernameField = () => false;
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} onlyEmail={false} />).toMatchSnapshot();
    });
    it('hide UsernamePane when databaseConnectionRequiresUsername is true and signUpHideUsernameField is true', () => {
      require('connection/database/index').databaseConnectionRequiresUsername = () => true;
      require('connection/database/index').signUpHideUsernameField = () => true;
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
    });
  });
});
