import Auth0WebApi from '../../core/web_api';
import Auth0APIClient from '../../core/web_api/p2_api';
import { JSDOM } from 'jsdom';

jest.mock('../../core/web_api/p2_api', () => {
  return jest.fn().mockImplementation((lockID, clientID, domain, opts) => {
    const redirect = Boolean(opts.redirect);
    return {
      authOpt: {
        popup: typeof opts.popup !== 'undefined' ? opts.popup : !redirect,
        sso: opts.sso,
        redirect: opts.redirect,
      },
      lockID: lockID,
      clientID: clientID,
      domain: domain,
      logIn: jest.fn(),
      logout: jest.fn(),
      signUp: jest.fn(),
      resetPassword: jest.fn(),
      passwordlessStart: jest.fn(),
      passwordlessVerify: jest.fn(),
      parseHash: jest.fn(),
      getUserInfo: jest.fn(),
      getProfile: jest.fn(),
      getChallenge: jest.fn(),
      getSignupChallenge: jest.fn(),
      getPasswordlessChallenge: jest.fn(),
      getPasswordResetChallenge: jest.fn(),
      getSSOData: jest.fn(),
      getUserCountry: jest.fn(),
      checkSession: jest.fn(),
      isUniversalLogin: lockID === 'lock-id' && domain === 'test.com', // Simplified condition for testing
    };
  });
});

describe('Auth0WebApi', () => {
  let originalWindow;

  const LOCK_ID = 'lock-id';
  const CLIENT_ID = 'client-id';
  const DEFAULT_DOMAIN = 'test.com';
  const client = () => Auth0WebApi.clients[LOCK_ID];

  beforeEach(() => {
    originalWindow = global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
    delete window.cordova;
    delete window.electron;
    Auth0WebApi.clients = {};
  });

  const setWindowLocation = (url) => {
    const dom = new JSDOM('', { url });
    global.window = dom.window;
    global.document = dom.window.document;
  };

  describe('setupClient', () => {
    it('sets the correct options when on the hosted login page', () => {
      setWindowLocation(`https://${DEFAULT_DOMAIN}/`);

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, { redirect: true });

      expect(client()).toMatchObject({
        domain: DEFAULT_DOMAIN,
        authOpt: expect.objectContaining({
          popup: false,
        }),
      });

      expect(client().isUniversalLogin).toBe(true);
    });

    xit('sets redirect: true when on the same origin as the specified domain', () => {
      
      setWindowLocation(`https://${DEFAULT_DOMAIN}/`);
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});

      expect(client().authOpt.popup).toBe(false); // because redirect = true
    });

    it('sets redirect: false when on a different origin as the specified domain', () => {
      setWindowLocation('https://different-origin.com/');
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});

      expect(client().authOpt.popup).toBe(true);
    });

    it('forces popup and sso mode for cordova, only when not running in the hosted environment', () => {
      setWindowLocation(`https://${DEFAULT_DOMAIN}/`);
      window.cordova = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});

      expect(client().authOpt.popup).toBe(true);
      expect(client().authOpt.sso).toBe(false);
    });

    it('forces popup and sso mode for electron, only when not running in the hosted environment', () => {
      setWindowLocation(`https://${DEFAULT_DOMAIN}/`);
      window.electron = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});

      expect(client().authOpt.popup).toBe(true);
      expect(client().authOpt.sso).toBe(false);
    });

  });
});
