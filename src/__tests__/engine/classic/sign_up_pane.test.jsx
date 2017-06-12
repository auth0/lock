import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('field/email/email_pane', () => mockComponent('email_pane'));
jest.mock('field/password/password_pane', () => mockComponent('password_pane'));
jest.mock('field/username/username_pane', () => mockComponent('username_pane'));
jest.mock('field/custom_input', () => mockComponent('custom_input'));

const getComponent = () => require('engine/classic/sign_up_pane').default;

describe('SignUpPane', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('connection/database/index', () => ({
      additionalSignUpFields: () => [],
      databaseConnectionRequiresUsername: () => false,
      passwordStrengthPolicy: () => 'passwordStrengthPolicy'
    }));
  });
  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    model: 'model',
    emailInputPlaceholder: 'emailInputPlaceholder',
    onlyEmail: true,
    passwordInputPlaceholder: 'passwordInputPlaceholder',
    passwordStrengthMessages: 'passwordStrengthMessages',
    usernameInputPlaceholder: 'usernameInputPlaceholder'
  };
  it('renders only email by default', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });
  it('shows header when instructions are available', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} instructions="instructions" />).toMatchSnapshot();
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
    it('shows UsernamePane when databaseConnectionRequiresUsername is true', () => {
      require('connection/database/index').databaseConnectionRequiresUsername = () => true;
      const Component = getComponent();

      expectComponent(<Component {...defaultProps} onlyEmail={false} />).toMatchSnapshot();
    });
  });
});
