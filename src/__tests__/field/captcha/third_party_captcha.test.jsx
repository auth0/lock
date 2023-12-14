import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import I from 'immutable';
import * as l from '../../../core/index';
import { ThirdPartyCaptcha } from '../../../field/captcha/third_party_captcha';

const createLockMock = ({
  provider = 'auth0',
  required = true,
  siteKey = '',
  clientSubdomain = ''
} = {}) =>
  I.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider, siteKey, clientSubdomain, required: required }
    }
  });

describe('ThirdPartyCaptcha', () => {
  let prevWindow;
  let counter = 0;
  beforeAll(() => {
    prevWindow = global.window;
    global.window.grecaptcha = {
      render: jest.fn(),
      enterprise: {
        render: jest.fn()
      }
    };
    global.window.hcaptcha = {
      render: jest.fn()
    };
    global.window.friendlyChallenge = {
      WidgetInstance: jest.fn().mockImplementation((...args) => {
        return jest.fn(...args);
      })
    };
    global.window.turnstile = {
      render: jest.fn(),
      reset: () => {
        global.window.turnstile.render(...global.window.turnstile.render.mock.calls[counter]);
        counter++;
      }
    };
  });
  afterAll(() => {
    global.window = prevWindow;
  });
  describe('recaptchav2', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_v2',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      wrapper = mount(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      act(() => {
        const injectCaptchaScriptSpy = jest.spyOn(wrapper, 'injectCaptchaScript');

        wrapper.componentDidMount();

        injectCaptchaScriptSpy.mock.calls[0][0]();
      });
    });

    it('should call render with the correct renderParams', () => {
      const renderParams = global.window.grecaptcha.render.mock.calls[0][1];

      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
    });
  });

  describe('friendly captcha', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'friendly_captcha',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      wrapper = mount(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      act(() => {
        const injectCaptchaScriptSpy = jest.spyOn(wrapper, 'injectCaptchaScript');

        wrapper.componentDidMount();
        jest.spyOn(global.window.friendlyChallenge, 'WidgetInstance');

        injectCaptchaScriptSpy.mock.calls[0][0]();
      });
    });

    it('should call WidgetInstance constructor with the correct renderParams', () => {
      const renderParams = global.window.friendlyChallenge.WidgetInstance.mock.calls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        doneCallback: expect.any(Function),
        errorCallback: expect.any(Function),
        language: 'en'
      });
    });
  });

  describe('hcaptcha', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'hcaptcha',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      wrapper = mount(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      act(() => {
        const injectCaptchaScriptSpy = jest.spyOn(wrapper, 'injectCaptchaScript');

        wrapper.componentDidMount();

        injectCaptchaScriptSpy.mock.calls[0][0]();
      });
    });

    it('should call render with the correct renderParams', () => {
      const renderParams = global.window.hcaptcha.render.mock.calls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
    });
  });

  describe('auth0_v2', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'auth0_v2',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      wrapper = mount(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
          onChange={jest.fn()}
        />
      ).instance();
      act(() => {
        const injectCaptchaScriptSpy = jest.spyOn(wrapper, 'injectCaptchaScript');

        wrapper.componentDidMount();

        injectCaptchaScriptSpy.mock.calls[0][0]();
      });
    });

    it('should call render with the correct renderParams', () => {
      const renderParams = global.window.turnstile.render.mock.calls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function),
        language: 'en',
        theme: 'light',
        retry: 'never'
      });
    });

    it('should retry 3 times on error and then set value to BYPASS_CAPTCHA dummy token for failOpen', () => {
      const renderParams = global.window.turnstile.render.mock.calls[0][1];
      for (let i = 0; i < 3; i++) {
        const renderParams = global.window.turnstile.render.mock.calls[i][1];
        act(() => {
          renderParams['error-callback']();
        });
        const { retryCount } = wrapper.state;
        const { value } = wrapper.props;
        expect(retryCount).toBe(i + 1);
        expect(value).toBe(undefined);
      }

      act(() => renderParams['error-callback']());

      const { onChange } = wrapper.props;
      expect(onChange.mock.calls).toHaveLength(1);
      expect(onChange.mock.calls[0][0]).toBe('BYPASS_CAPTCHA');
    });
  });

  describe('recaptcha enterprise', () => {
    let wrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_enterprise',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      wrapper = mount(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      act(() => {
        const injectCaptchaScriptSpy = jest.spyOn(wrapper, 'injectCaptchaScript');

        wrapper.componentDidMount();

        injectCaptchaScriptSpy.mock.calls[0][0]();
      });
    });

    it('should call render with the correct renderParams', () => {
      const renderParams = global.window.grecaptcha.enterprise.render.mock.calls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
    });
  });
});
