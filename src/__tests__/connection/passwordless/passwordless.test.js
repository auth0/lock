import { expectMockToMatch } from 'testUtils';

describe('passwordless connection', () => {
  let mockFns;
  beforeEach(() => {
    jest.resetModules();

    mockFns = {
      get: jest.fn(),
      initNS: jest.fn(),
      tget: jest.fn(),
      tremove: jest.fn(),
      tset: jest.fn()
    };

    jest.mock('utils/data_utils', () => ({
      dataFns: arr => {
        return mockFns;
      }
    }));
    jest.mock('field/phone_number', () => ({
      initLocation: jest.fn()
    }));
    jest.mock('core/web_api', () => ({
      getUserCountry: jest.fn()
    }));
    jest.mock('sync', () => jest.fn());
    jest.mock('core/index', () => ({
      id: () => 'id'
    }));
  });
  describe('initPasswordless()', () => {
    let initPasswordless;
    beforeEach(() => {
      initPasswordless = require('connection/passwordless/index').initPasswordless;
    });
    describe('calls initNS ', () => {
      it('with send:code when opts.passwordlessMethod is undefined', () => {
        initPasswordless(null, {});
        expectMockToMatch(mockFns.initNS, 1);
      });
      it('with send:code when opts.passwordlessMethod is code', () => {
        initPasswordless(null, {
          passwordlessMethod: 'code'
        });
        expectMockToMatch(mockFns.initNS, 1);
      });
      it('with send:link when opts.passwordlessMethod is link', () => {
        initPasswordless(null, {
          passwordlessMethod: 'link'
        });
        expectMockToMatch(mockFns.initNS, 1);
      });
      it('with mustAcceptTerms:true when opts.mustAcceptTerms is true', () => {
        initPasswordless(null, {
          mustAcceptTerms: true
        });
        expectMockToMatch(mockFns.initNS, 1);
      });
      it('with mustAcceptTerms:false when opts.mustAcceptTerms is false', () => {
        initPasswordless(null, {
          mustAcceptTerms: false
        });
        expectMockToMatch(mockFns.initNS, 1);
      });
    });
    it('should load default location via options.defaultLocation', () => {
      initPasswordless(null, {
        defaultLocation: 'en'
      });
      expectMockToMatch(require('field/phone_number').initLocation, 1);
    });
    it('should call webAPI.getUserCountry when there is no default location', () => {
      initPasswordless(null, {});
      const sync = require('sync');
      expectMockToMatch(sync, 1);

      const { syncFn, successFn } = sync.mock.calls[0][2];
      syncFn(null, 'cb');
      expectMockToMatch(require('core/web_api').getUserCountry, 1);

      successFn('model', 'en');
      expectMockToMatch(require('field/phone_number').initLocation, 1);
    });
  });
  describe('mustAcceptTerms()', () => {
    it('should return `mustAcceptTerms`', () => {
      require('connection/passwordless/index').mustAcceptTerms('model');
      expectMockToMatch(mockFns.get, 1);
    });
  });

  describe('toggleTermsAcceptance()', () => {
    it('should tset `termsAccepted` to false when `termsAccepted` is true', () => {
      mockFns.get.mockReturnValue(true);
      require('connection/passwordless/index').toggleTermsAcceptance('model');
      expectMockToMatch(mockFns.tset, 1);
    });
    it('should tset `termsAccepted` to true when `termsAccepted` is false', () => {
      mockFns.get.mockReturnValue(false);
      require('connection/passwordless/index').toggleTermsAcceptance('model');
      expectMockToMatch(mockFns.tset, 1);
    });
  });
});
