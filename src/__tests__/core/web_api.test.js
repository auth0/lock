import Auth0WebApi from '../../core/web_api';

describe('Auth0WebApi', () => {
  let originalWindow;

  const LOCK_ID = 'lock-id';
  const CLIENT_ID = 'client-id';
  const DEFAULT_DOMAIN = 'test.com';
  const client = () => Auth0WebApi.clients[LOCK_ID];

  beforeEach(() => {
    originalWindow = window;
  });

  afterEach(() => {
    window = originalWindow;
  });

  describe('setupClient', () => {
    it('sets the correct options when is on the hosted login page', () => {
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, { redirect: true });
      expect(Auth0WebApi).toMatchSnapshot();
    });

    it('sets redirect: true when on the same origin as the specified domain', () => {
      delete global.window.location;
      window.location = { ...originalWindow.location, host: DEFAULT_DOMAIN, search: '' };

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
    });

    it('sets redirect: false when on a different origin as the specified domain', () => {
      delete global.window.location;
      window.location = { ...originalWindow.location, host: 'test-other.com', search: '' };

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true);
    });

    it('forces popup and sso mode for cordova, only when not running in the hosted environment', () => {
      delete global.window.location;
      window.location = { ...originalWindow.location, host: DEFAULT_DOMAIN, search: '' };
      window.cordova = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });

    it('forces popup and sso mode for electron, only when not running in the hosted environment', () => {
      delete global.window.location;
      window.location = { ...originalWindow.location, host: DEFAULT_DOMAIN, search: '' };
      window.electron = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });
  });
});
