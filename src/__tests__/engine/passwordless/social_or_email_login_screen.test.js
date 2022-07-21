import React from 'react';
import { expectShallowComponent } from 'testUtils';
import { mockComponent } from 'testUtils';
import {expectComponent} from "../../testUtils";
// import SocialOrEmailLoginScreen from 'engine/passwordless/social_or_email_login_screen'

jest.mock('field/social/social_buttons_pane', () => mockComponent('social_buttons_pane'));
jest.mock('field/email/email_pane', () => mockComponent('email_pane'));
// jest.mock('field/captcha/captcha_pane', () => mockComponent('captcha_pane'));
jest.mock('core/pane_separator', () => mockComponent('pane_separator'));
jest.mock('connection/database/sign_up_terms', () => mockComponent('sign_up_terms'));
// jest.mock('engine/passwordless/social_or_email_login_screen', () => mockComponent('social_or_email_login_screen'));

const getScreen = () => {
  const SocialOrEmailScreen = require('engine/passwordless/social_or_email_login_screen').default;
  return new SocialOrEmailScreen();
};

const getComponent = () => {
  // return null;
  console.log('hiii' + getScreen());
  console.log(getScreen().render());
  return getScreen().render();
};

describe('social or email login screen', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.mock('core/index', () => ({
      hasSomeConnections: () => true,
      prefill: () => ({
        toJS() {
          return {
            email: 'prefill@example.com',
            phoneNumber: '12354'
          };
        }
      })
    }));
    jest.mock('field/email', () => ({
      setEmail: jest.fn(m => m)
    }));
    jest.mock('field/phone_number', () => ({
      setPhoneNumber: jest.fn(m => m)
    }));
    console.log('hi');
  });

  const defaultProps = {
    i18n: {
      str: (...keys) => keys.join(','),
      group: (...keys) => keys.join(','),
      html: (...keys) => keys.join(',')
    },
    model: 'model'
  };

  //   it('renders correctly', async () => {
  //     expectShallowComponent(<SocialOrEmailLoginScreen {...defaultProps} />).toMatchSnapshot();
  //   });

  it('renders empty div by default', () => {
    const Component = getComponent();

    expectComponent(<Component {...defaultProps} />).toMatchSnapshot();
  });

  //   it('renders a captcha', () => {
  //     require('core/index').captcha.mockReturnValue({
  //       get() {
  //         return true;
  //       }
  //     });

  //     expectShallowComponent(<SocialOrEmailLoginScreen {...defaultProps} />).toMatchSnapshot();
  //   });

  //   it('hides the captcha for SSO connections', () => {
  //     require('core/index').captcha.mockReturnValue({
  //       get() {
  //         return true;
  //       }
  //     });

  //     require('engine/classic').isSSOEnabled.mockReturnValue(true);

  //     expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  //   });

  //   it('shows the captcha for SSO (ADFS) connections', () => {
  //     require('core/index').captcha.mockReturnValue({
  //       get() {
  //         return true;
  //       }
  //     });

  //     require('engine/classic').isSSOEnabled.mockReturnValue(true);
  //     require('connection/enterprise').isHRDDomain.mockReturnValue(true);

  //     expectShallowComponent(<LoginPane {...defaultProps} />).toMatchSnapshot();
  //   });
});
