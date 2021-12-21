import React from 'react';
import I from 'immutable';
import { expectShallowComponent } from 'testUtils';
import LoginPane from '../../../connection/database/login_pane';

const lock = I.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

jest.mock('engine/classic');
jest.mock('connection/enterprise');

describe('LoginPane', () => {
  const defaultProps = {
    emailInputPlaceholder: '',
    forgotPasswordAction: '',
    i18n: {},
    passwordInputPlaceholder: '',
    showForgotPasswordLink: true,
    showPassword: true,
    usernameInputPlaceholder: '',
    lock
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', async () => {
    expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('renders a captcha', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('hides the captcha for SSO connections', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);

    expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('shows the captcha for SSO (ADFS) connections', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);
    require('connection/enterprise').isHRDDomain.mockReturnValue(true);

    expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });
});
