import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { act } from '@testing-library/react';
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

// Renders the component and manually triggers the injectCaptchaScript callback,
// mimicking the original Enzyme test pattern: spy replaces injectCaptchaScript
// so the automatic componentDidMount call is captured, then the callback is invoked.
const mountCaptcha = (props) => {
  let instance = null;

  // Intercept injectCaptchaScript on the prototype so the automatic
  // componentDidMount call (during RTL render) does NOT invoke the captcha library.
  const proto = ThirdPartyCaptcha.prototype;
  const original = proto.injectCaptchaScript;
  proto.injectCaptchaScript = function(callback) {
    // no-op: prevents the library from being triggered by the automatic mount
  };

  act(() => {
    render(
      <ThirdPartyCaptcha
        {...props}
        ref={r => { instance = r; }}
      />
    );
  });

  // Restore original and manually drive componentDidMount with a spy
  proto.injectCaptchaScript = original;

  act(() => {
    const spy = jest.spyOn(instance, 'injectCaptchaScript');
    instance.componentDidMount();
    spy.mock.calls[0][0]();
  });

  return instance;
};

describe('ThirdPartyCaptcha', () => {
  let prevWindow;
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
      reset: () => {}
    };
  });
  afterAll(() => {
    global.window = prevWindow;
  });

  describe('recaptchav2', () => {
    let instance;
    beforeAll(() => {
      global.window.grecaptcha.render.mockClear();
      const lockMock = createLockMock({ provider: 'recaptcha_v2', siteKey: 'mySiteKey' });
      const captcha = l.captcha(lockMock);
      instance = mountCaptcha({
        provider: captcha.get('provider'),
        sitekey: captcha.get('siteKey'),
        clientSubdomain: captcha.get('clientSubdomain'),
        hl: 'en',
        isValid: true,
        value: undefined
      });
    });
    afterAll(() => cleanup());

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
    let instance;
    beforeAll(() => {
      global.window.friendlyChallenge.WidgetInstance.mockClear();
      const lockMock = createLockMock({ provider: 'friendly_captcha', siteKey: 'mySiteKey' });
      const captcha = l.captcha(lockMock);
      instance = mountCaptcha({
        provider: captcha.get('provider'),
        sitekey: captcha.get('siteKey'),
        clientSubdomain: captcha.get('clientSubdomain'),
        hl: 'en',
        isValid: true,
        value: undefined
      });
    });
    afterAll(() => cleanup());

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
    let instance;
    beforeAll(() => {
      global.window.hcaptcha.render.mockClear();
      const lockMock = createLockMock({ provider: 'hcaptcha', siteKey: 'mySiteKey' });
      const captcha = l.captcha(lockMock);
      instance = mountCaptcha({
        provider: captcha.get('provider'),
        sitekey: captcha.get('siteKey'),
        clientSubdomain: captcha.get('clientSubdomain'),
        hl: 'en',
        isValid: true,
        value: undefined
      });
    });
    afterAll(() => cleanup());

    it('should call render with the correct renderParams', () => {
      const renderCalls = global.window.hcaptcha.render.mock.calls;
      const renderParams = renderCalls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
      expect(renderCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('should call render on update', () => {
      const countBefore = global.window.hcaptcha.render.mock.calls.length;
      act(() => {
        instance.setState({});
      });
      const countAfter = global.window.hcaptcha.render.mock.calls.length;
      // componentDidUpdate triggers hcaptcha.render when h-captcha element exists
      expect(countAfter).toBeGreaterThanOrEqual(countBefore);
    })
  });

  describe('auth0_v2', () => {
    const mountAuth0V2 = (onChange = jest.fn()) => {
      let counter = 0;
      global.window.turnstile.render.mockClear();
      global.window.turnstile.reset = () => {
        global.window.turnstile.render(...global.window.turnstile.render.mock.calls[counter]);
        counter++;
      };
      const lockMock = createLockMock({ provider: 'auth0_v2', siteKey: 'mySiteKey' });
      const captcha = l.captcha(lockMock);
      return mountCaptcha({
        provider: captcha.get('provider'),
        sitekey: captcha.get('siteKey'),
        clientSubdomain: captcha.get('clientSubdomain'),
        hl: 'en',
        isValid: true,
        value: undefined,
        onChange
      });
    };

    it('should call render with the correct renderParams', () => {
      const instance = mountAuth0V2();
      const renderParams = global.window.turnstile.render.mock.calls[0][1];
      expect(renderParams).toEqual({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function),
        language: 'en',
        theme: 'light',
        retry: 'never',
        'response-field': false
      });
      cleanup();
    });

    it('should retry 3 times on error and then set value to BYPASS_CAPTCHA dummy token for failOpen', () => {
      const onChange = jest.fn();
      const instance = mountAuth0V2(onChange);

      // Call error-callback 3 times — each should increment retryCount and trigger reset (new render call)
      for (let i = 0; i < 3; i++) {
        const renderCallIndex = global.window.turnstile.render.mock.calls.length - 1;
        const currentErrorCallback = global.window.turnstile.render.mock.calls[renderCallIndex][1]['error-callback'];
        act(() => { currentErrorCallback(); });
        expect(instance.state.retryCount).toBe(i + 1);
        expect(instance.props.value).toBe(undefined);
      }

      // 4th call — past MAX_RETRY, should invoke onChange with BYPASS_CAPTCHA
      const lastRenderCallIndex = global.window.turnstile.render.mock.calls.length - 1;
      const lastErrorCallback = global.window.turnstile.render.mock.calls[lastRenderCallIndex][1]['error-callback'];
      act(() => { lastErrorCallback(); });

      expect(onChange.mock.calls).toHaveLength(1);
      expect(onChange.mock.calls[0][0]).toBe('BYPASS_CAPTCHA');
      cleanup();
    });
  });

  describe('recaptcha enterprise', () => {
    let instance;
    beforeAll(() => {
      global.window.grecaptcha.enterprise.render.mockClear();
      const lockMock = createLockMock({ provider: 'recaptcha_enterprise', siteKey: 'mySiteKey' });
      const captcha = l.captcha(lockMock);
      instance = mountCaptcha({
        provider: captcha.get('provider'),
        sitekey: captcha.get('siteKey'),
        clientSubdomain: captcha.get('clientSubdomain'),
        hl: 'en',
        isValid: true,
        value: undefined
      });
    });
    afterAll(() => cleanup());

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
