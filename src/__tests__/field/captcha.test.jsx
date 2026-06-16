import React from 'react';
import { render } from '@testing-library/react';
import I from 'immutable';

import CaptchaPane from '../../field/captcha/captcha_pane';

const createLockMock = ({ provider = 'auth0', required = true, siteKey = '', clientSubdomain = '' } = {}) =>
  I.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider, siteKey, clientSubdomain, required: required }
    }
  });

const createI18nMock = () => ({
  str: jest.fn().mockReturnValue('My i18N Compliant Language')
});

// We spy on ThirdPartyCaptcha and CaptchaInput via module mock to capture rendered props
let lastThirdPartyCaptchaProps = null;
let lastCaptchaInputProps = null;

jest.mock('../../field/captcha/third_party_captcha', () => {
  const actual = jest.requireActual('../../field/captcha/third_party_captcha');
  return {
    ...actual,
    ThirdPartyCaptcha: (props) => {
      lastThirdPartyCaptchaProps = props;
      return <div data-testid="third-party-captcha" />;
    }
  };
});

jest.mock('../../ui/input/captcha_input', () => (props) => {
  lastCaptchaInputProps = props;
  return <input data-testid="captcha-input" />;
});

describe('CaptchaPane', () => {
  beforeEach(() => {
    lastThirdPartyCaptchaProps = null;
    lastCaptchaInputProps = null;
  });

  describe('CaptchaInput', () => {
    it('should render CaptchaInput if no provider is specified', () => {
      const lockMock = createLockMock();
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      const { getByTestId } = render(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
      expect(getByTestId('captcha-input')).toBeTruthy();
    });
  });

  const captchaProviderCases = [
    ['recaptchav2', 'recaptcha_v2'],
    ['friendly captcha', 'friendly_captcha'],
    ['hcaptcha', 'hcaptcha'],
    ['auth0_v2', 'auth0_v2'],
    ['recaptcha enterprise', 'recaptcha_enterprise'],
    ['Arkose', 'arkose'],
  ];

  captchaProviderCases.forEach(([label, provider]) => {
    describe(label, () => {
      beforeEach(() => {
        lastThirdPartyCaptchaProps = null;
        const lockMock = createLockMock({ provider, siteKey: 'mySiteKey', clientSubdomain: provider === 'arkose' ? 'client-api' : '' });
        const i8nMock = createI18nMock();
        const onReloadMock = jest.fn();

        render(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
      });

      it(`should render ThirdPartyCaptcha if provider is ${label}`, () => {
        expect(lastThirdPartyCaptchaProps).not.toBeNull();
      });

      it('should pass the sitekey', () => {
        expect(lastThirdPartyCaptchaProps.sitekey).toBe('mySiteKey');
      });

      if (provider === 'arkose') {
        it('should pass the clientSubdomain', () => {
          expect(lastThirdPartyCaptchaProps.clientSubdomain).toBe('client-api');
        });
      }
    });
  });
});
