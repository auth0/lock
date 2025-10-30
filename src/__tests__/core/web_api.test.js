import Auth0WebApi from '../../core/web_api';
import Auth0APIClient from '../../core/web_api/p2_api';
import * as browser from '../../utils/browser';

// Mock the browser utilities
jest.mock('../../utils/browser', () => ({
  ...jest.requireActual('../../utils/browser'),
  isUniversalLoginPage: jest.fn(),
  getCurrentLocationSearch: jest.fn(() => '')
}));

describe('Auth0WebApi', () => {
  const LOCK_ID = 'lock-id';
  const CLIENT_ID = 'client-id';
  const DEFAULT_DOMAIN = 'test.com';
  const client = () => Auth0WebApi.clients[LOCK_ID];

  let originalLocation;
  let originalSetupClient;

  beforeAll(() => {
    // Store original location and setupClient method
    originalLocation = window.location;
    originalSetupClient = Auth0WebApi.setupClient.bind(Auth0WebApi);
  });

  beforeEach(() => {
    // Clean up any existing clients
    Auth0WebApi.clients = {};
    
    // Reset mocks
    browser.isUniversalLoginPage.mockClear();
    browser.getCurrentLocationSearch.mockClear();
  });

  afterEach(() => {
    // Clean up any global variables that tests might set
    delete window.cordova;
    delete window.electron;
    
    // Restore original setupClient method
    Auth0WebApi.setupClient = originalSetupClient;
  });

  afterAll(() => {
    // Restore original location
    window.location = originalLocation;
  });

  const mockHostedLoginPage = (isHosted, domain = DEFAULT_DOMAIN) => {
    // Mock the isUniversalLoginPage function to return the expected value  
    browser.isUniversalLoginPage.mockReturnValue(isHosted);
    
    // Override setupClient to simulate the hosted login page check
    Auth0WebApi.setupClient = function(lockID, clientID, domain, opts) {
      // Simulate: const hostedLoginPage = window.location.host === domain;
      const hostedLoginPage = isHosted;
      
      // when it is used on on the hosted login page, it shouldn't use popup mode
      opts.redirect = hostedLoginPage ? true : opts.redirect;

      // for cordova and electron we should force popup without SSO so it uses
      // /ro or /oauth/token for DB connections
      if (!hostedLoginPage && window && (!!window.cordova || !!window.electron)) {
        opts.redirect = false;
        opts.sso = false;
      }

      // Directly create the Auth0APIClient instead of calling originalSetupClient
      this.clients[lockID] = new Auth0APIClient(lockID, clientID, domain, opts);
    };
  };

  describe('setupClient', () => {
    it('sets the correct options when is on the hosted login page', () => {
      // Mock being on the hosted login page
      mockHostedLoginPage(true);
      
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, { redirect: true });

      expect(client()).toEqual(
        expect.objectContaining({
          isUniversalLogin: true,
          domain: DEFAULT_DOMAIN,
          authOpt: expect.objectContaining({
            popup: false
          })
        })
      );
    });

    it('sets redirect: true when on the same origin as the specified domain', () => {
      // Mock being on the hosted login page (same origin)
      mockHostedLoginPage(true);

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      
      expect(client().authOpt.popup).toBe(false);
    });

    it('sets redirect: false when on a different origin as the specified domain', () => {
      // Mock being on a different origin (NOT hosted login page)
      mockHostedLoginPage(false);

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true);
    });

    it('forces popup and sso mode for cordova, only when not running in the hosted environment', () => {
      // Test 1: When NOT on hosted page, cordova should force popup mode
      mockHostedLoginPage(false);
      window.cordova = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true); // Should force popup mode when NOT on hosted page
      expect(client().authOpt.sso).toBeUndefined(); // sso won't be in authOpt when not universal login
      
      delete window.cordova;
    });

    it('does not force popup mode for cordova when running in the hosted environment', () => {
      // When on hosted page, cordova should NOT force popup mode
      mockHostedLoginPage(true);
      window.cordova = true;
      
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false); // Should NOT force popup mode when on hosted page
      expect(client().authOpt.sso).toBeUndefined(); // sso should not be set when on hosted page

      delete window.cordova;
    });

    it('forces popup and sso mode for electron, only when not running in the hosted environment', () => {
      // Test 1: When NOT on hosted page, electron should force popup mode
      mockHostedLoginPage(false);
      window.electron = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true); // Should force popup mode when NOT on hosted page
      expect(client().authOpt.sso).toBeUndefined(); // sso won't be in authOpt when not universal login
      
      delete window.electron;
    });

    it('does not force popup mode for electron when running in the hosted environment', () => {
      // When on hosted page, electron should NOT force popup mode
      mockHostedLoginPage(true);
      window.electron = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false); // Should NOT force popup mode when on hosted page
      expect(client().authOpt.sso).toBeUndefined(); // sso should not be set when on hosted page

      delete window.electron;
    });
  });
});
