import React from 'react';
import I from 'immutable';
import { expectComponent } from 'testUtils';
import LoginPane from '../../../connection/database/login_pane';

const lock = I.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

jest.mock('engine/classic');
jest.mock('connection/enterprise');

describe('LoginPane', () => {
  const defaultProps = {
    emailInputPlaceholder: '',
    forgotPasswordAction: '',
    i18n: { str: () => '', html: () => null },
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
    expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('renders a captcha', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('hides the captcha for SSO connections', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);

    expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });

  it('shows the captcha for SSO (ADFS) connections', () => {
    require('core/index').captcha.mockReturnValue({
      get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);
    require('connection/enterprise').isHRDDomain.mockReturnValue(true);

    expectComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  });
});
