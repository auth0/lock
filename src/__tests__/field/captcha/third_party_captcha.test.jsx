import React from 'react';
import { shallow } from 'enzyme';
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
  describe('recaptchav2', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_v2',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
      expect(renderParams.language).toBeUndefined();
      expect(renderParams.theme).toBeUndefined();
      expect(Object.keys(renderParams)).toHaveLength(4);
    });
  });

  describe('friendly captcha', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'friendly_captcha',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        doneCallback: expect.any(Function),
        errorCallback: expect.any(Function),
        language: 'en'
      });
      expect(renderParams.theme).toBeUndefined();
      expect(renderParams.callback).toBeUndefined();
      expect(renderParams['expired-callback']).toBeUndefined();
      expect(renderParams['error-callback']).toBeUndefined();
      expect(Object.keys(renderParams)).toHaveLength(4);
    });
  });

  describe('hcaptcha', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'hcaptcha',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
      expect(renderParams.language).toBeUndefined();
      expect(renderParams.theme).toBeUndefined();
      expect(Object.keys(renderParams)).toHaveLength(4);
    });
  });

  describe('auth0_v2', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'auth0_v2',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function),
        language: 'en',
        theme: 'light'
      });
      expect(Object.keys(renderParams)).toHaveLength(6);
    });
  });

  describe('recaptcha enterprise', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'recaptcha_enterprise',
        siteKey: 'mySiteKey'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toMatchObject({
        sitekey: 'mySiteKey',
        callback: expect.any(Function),
        'expired-callback': expect.any(Function),
        'error-callback': expect.any(Function)
      });
      expect(renderParams.language).toBeUndefined();
      expect(renderParams.theme).toBeUndefined();
      expect(Object.keys(renderParams)).toHaveLength(4);
    });
  });

  describe('Arkose', () => {
    let shallowWrapper;
    beforeAll(() => {
      const lockMock = createLockMock({
        provider: 'arkose',
        siteKey: 'mySiteKey',
        clientSubdomain: 'client-api'
      });

      const captcha = l.captcha(lockMock);
      shallowWrapper = shallow(
        <ThirdPartyCaptcha
          provider={captcha.get('provider')}
          sitekey={captcha.get('siteKey')}
          clientSubdomain={captcha.get('clientSubdomain')}
          hl={'en'}
          isValid={true}
          value={undefined}
        />
      ).instance();
      shallowWrapper.componentDidMount();
    });

    it('should pass the sitekey', () => {
      const { renderParams } = shallowWrapper;
      expect(renderParams).toBeUndefined();
    });
  });
});
