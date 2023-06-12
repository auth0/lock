import React from 'react';
import { mount } from 'enzyme';
import I from 'immutable';

import CaptchaPane from '../../field/captcha/captcha_pane';
import { ReCAPTCHA } from '../../field/captcha/recaptcha';
import CaptchaInput from '../../ui/input/captcha_input';

const createLockMock = ({ provider = 'auth0', required = true, siteKey = '' } = {}) =>
  I.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider, siteKey, required: required }
    }
  });

const createI18nMock = () => ({
  str: jest.fn().mockReturnValue('My i18N Compliant Language')
});

describe('CaptchaPane', () => {
  describe('CaptchaInput', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock();
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render CaptchaInput if no provider is specified', () => {
      expect(wrapper.find(CaptchaInput)).toHaveLength(1);
    });
  });

  describe('recaptchav2', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_v2',
        siteKey: 'mySiteKey'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render reCaptcha if provider is recaptchav2', () => {
      expect(wrapper.find(ReCAPTCHA)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ReCAPTCHA).props().sitekey).toBe('mySiteKey');
    });
  });

  describe('hcaptcha', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'hcaptcha',
        siteKey: 'mySiteKey'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render hCaptcha if provider is recaptchav2', () => {
      expect(wrapper.find(ReCAPTCHA)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ReCAPTCHA).props().sitekey).toBe('mySiteKey');
    });
  });

  describe('recaptcha enterprise', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_enterprise',
        siteKey: 'mySiteKey'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render reCaptcha if provider is recaptcha_enterprise', () => {
      expect(wrapper.find(ReCAPTCHA)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ReCAPTCHA).props().sitekey).toBe('mySiteKey');
    });
  });
});
