import * as l from '../../core/index';

const getSyncRemoteData = () => require('core/remote_data').syncRemoteData;

jest.mock('sync', () => jest.fn((model, key, options) => model));

jest.mock('connection/enterprise', () => ({
  isADEnabled: () => true
}));

jest.mock('core/index', () => ({
  useTenantInfo: () => true,
  id: () => 'id',
  emitEvent: jest.fn(),
  setCaptcha: jest.fn(),
  setPasswordlessCaptcha: jest.fn(), 
  setPasswordResetCaptcha: jest.fn(),
  setSignupChallenge: jest.fn()
}));

jest.mock('core/sso/data', () => ({
  fetchSSOData: jest.fn((id, adEnabled, cb) => cb(null, {}))
}));

jest.mock('core/web_api', () => ({
  getChallenge: jest.fn(),
  getSignupChallenge: jest.fn()
}));

describe('remote_data.syncRemoteData()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calls getSSOData with AD information', () => {
    [true, false].forEach(isAdEnabled => {
      it(`when isADEnabled is ${isAdEnabled}`, () => {
        require('connection/enterprise').isADEnabled = () => isAdEnabled;

        const syncRemoteData = getSyncRemoteData();
        syncRemoteData();

        const ssoCall = require('sync').mock.calls.find(c => c[1] === 'sso');
        ssoCall[2].syncFn('model', jest.fn());

        const [, sendADInformation, ,] = require('core/sso/data').fetchSSOData.mock.calls[0];

        expect(sendADInformation).toBe(isAdEnabled);
        expect(l.emitEvent).toHaveBeenCalledWith('model', 'ssodata fetched', expect.anything());
      });
    });
  });

  describe('captcha syncing', () => {
    it('should sync both login captcha and signup captcha', () => {
      const syncRemoteData = getSyncRemoteData();
      syncRemoteData('mockModel');

      const syncCalls = require('sync').mock.calls;
      
      const captchaCall = syncCalls.find(c => c[1] === 'captcha');
      const signupCaptchaCall = syncCalls.find(c => c[1] === 'signupCaptcha');

      expect(captchaCall).toBeDefined();
      expect(signupCaptchaCall).toBeDefined();
    });

    it('should call webApi.getChallenge when captcha syncFn is executed', () => {
      const mockModel = { get: jest.fn().mockReturnValue('test-id') };
      const syncRemoteData = getSyncRemoteData();
      
      require('core/web_api').getChallenge.mockClear();
      
      syncRemoteData(mockModel);

      const syncCalls = require('sync').mock.calls;
      const captchaCall = syncCalls.find(c => c[1] === 'captcha');
      
      const mockCallback = jest.fn();
      captchaCall[2].syncFn(mockModel, mockCallback);

      expect(require('core/web_api').getChallenge).toHaveBeenCalledWith('test-id', expect.any(Function));
    });

    it('should call webApi.getSignupChallenge when signup captcha syncFn is executed', () => {
      const mockModel = { get: jest.fn().mockReturnValue('test-id') };
      const syncRemoteData = getSyncRemoteData();
      
      require('core/web_api').getSignupChallenge.mockClear();
      
      syncRemoteData(mockModel);

      const syncCalls = require('sync').mock.calls;
      const signupCaptchaCall = syncCalls.find(c => c[1] === 'signupCaptcha');
      
      const mockCallback = jest.fn();
      signupCaptchaCall[2].syncFn(mockModel, mockCallback);

      expect(require('core/web_api').getSignupChallenge).toHaveBeenCalledWith('test-id', expect.any(Function));
    });

    it('should sync both login captcha and signup captcha with proper keys', () => {
      const syncRemoteData = getSyncRemoteData();
      syncRemoteData('mockModel');

      const syncCalls = require('sync').mock.calls;
      const syncKeys = syncCalls.map(call => call[1]);
      
      expect(syncKeys).toContain('captcha');
      expect(syncKeys).toContain('signupCaptcha');
    });

    it('should configure captcha syncs with syncFn functions', () => {
      const syncRemoteData = getSyncRemoteData();
      syncRemoteData('mockModel');

      const syncCalls = require('sync').mock.calls;
      const captchaCall = syncCalls.find(c => c[1] === 'captcha');
      const signupCaptchaCall = syncCalls.find(c => c[1] === 'signupCaptcha');
      
      expect(captchaCall[2].syncFn).toEqual(expect.any(Function));
      expect(signupCaptchaCall[2].syncFn).toEqual(expect.any(Function));
    });

    it('should handle webApi errors gracefully', () => {
      const mockModel = { get: jest.fn().mockReturnValue('test-id') };
      const syncRemoteData = getSyncRemoteData();
      syncRemoteData(mockModel);

      const syncCalls = require('sync').mock.calls;
      const signupCaptchaCall = syncCalls.find(c => c[1] === 'signupCaptcha');
      
      require('core/web_api').getSignupChallenge.mockImplementation((id, cb) => {
        cb(new Error('Network error'), null);
      });

      const mockCallback = jest.fn();
      signupCaptchaCall[2].syncFn(mockModel, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, null);
    });

    it('should handle successful webApi response', () => {
      const mockModel = { get: jest.fn().mockReturnValue('test-id') };
      const syncRemoteData = getSyncRemoteData();
      syncRemoteData(mockModel);

      const syncCalls = require('sync').mock.calls;
      const signupCaptchaCall = syncCalls.find(c => c[1] === 'signupCaptcha');
      
      const mockCaptchaResponse = { required: true, siteKey: 'test-key' };
      
      require('core/web_api').getSignupChallenge.mockImplementation((id, cb) => {
        cb(null, mockCaptchaResponse);
      });

      const mockCallback = jest.fn();
      signupCaptchaCall[2].syncFn(mockModel, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, mockCaptchaResponse);
    });
  });
});
