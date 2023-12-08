import React from 'react';
import { mount } from 'enzyme';
import I from 'immutable';

import CaptchaPane from '../../field/captcha/captcha_pane';
import { ThirdPartyCaptcha, getRenderParams } from '../../field/captcha/third_party_captcha';
import CaptchaInput from '../../ui/input/captcha_input';

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

    it('should render ThirdPartyCaptcha if provider is recaptchav2', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
    });
  });

  describe('friendly captcha', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'friendly_captcha',
        siteKey: 'mySiteKey'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render ThirdPartyCaptcha if provider is friendly captcha', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
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

    it('should render ThirdPartyCaptcha if provider is hCaptcha', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
    });
  });

  describe('auth0_v2', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'auth0_v2',
        siteKey: 'mySiteKey'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render ThirdPartyCaptcha if provider is auth0_v2', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
    });

    it('renderParams auth0_v2', () => {
      const renderParams = getRenderParams({
        props: { provider: 'auth0_v2', hl: 'en', sitekey: 'mySiteKey' },
        changeHandler: () => {},
        expiredHandler: () => {},
        erroredHandler: () => {}
      });
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        language: 'en',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function),
        theme: 'light'
      });
    });

    it('renderParams', () => {
      const renderParams = getRenderParams({
        props: { provider: 'not_auth0_v2', hl: 'en', sitekey: 'mySiteKey' },
        changeHandler: () => {},
        expiredHandler: () => {},
        erroredHandler: () => {}
      });
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
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

    it('should render ThirdPartyCaptcha if provider is recaptcha_enterprise', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
    });
  });

  describe('Arkose', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'arkose',
        siteKey: 'mySiteKey',
        clientSubdomain:'client-api'
      });
      const i8nMock = createI18nMock();
      const onReloadMock = jest.fn();

      wrapper = mount(<CaptchaPane lock={lockMock} onReload={onReloadMock} i18n={i8nMock} />);
    });

    it('should render ThirdPartyCaptcha if provider is Arkose', () => {
      expect(wrapper.find(ThirdPartyCaptcha)).toHaveLength(1);
    });

    it('should pass the sitekey', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().sitekey).toBe('mySiteKey');
    });

    it('should pass the clientSubdomain', () => {
      expect(wrapper.find(ThirdPartyCaptcha).props().clientSubdomain).toBe('client-api');
    });
  });
});
