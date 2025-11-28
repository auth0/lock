import Auth0WebApi from '../../core/web_api';
import { setURL } from '../testUtils';

describe('Auth0WebApi', () => {
  let originalWindow;
  let originalLocation;

  const LOCK_ID = 'lock-id';
  const CLIENT_ID = 'client-id';
  const DEFAULT_DOMAIN = 'test.com';
  const client = () => Auth0WebApi.clients[LOCK_ID];

  beforeEach(() => {
    originalWindow = window.window;
    originalLocation = window.location;
  });

  afterEach(() => {
    window.window = originalWindow;
    delete window.location;
    window.location = originalLocation;
  });

  describe('setupClient', () => {
    it('sets the correct options when is on the hosted login page', () => {
      setURL(`https://${DEFAULT_DOMAIN}/`);
      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, { redirect: true });

      expect(client()).toEqual(
        expect.objectContaining({
          isUniversalLogin: true,
          domain: DEFAULT_DOMAIN,
          authOpt: {
            popup: false
          }
        })
      );
    });

    it('sets redirect: true when on the same origin as the specified domain', () => {
      setURL(`https://${DEFAULT_DOMAIN}/`);

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
    });

    it('sets redirect: false when on a different origin as the specified domain', () => {
      setURL('https://test-other.com/');

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true);
    });

    it('forces popup and sso mode for cordova, only when not running in the hosted environment', () => {
      setURL(`https://${DEFAULT_DOMAIN}/`);
      window.cordova = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });

    it('forces popup and sso mode for electron, only when not running in the hosted environment', () => {
      setURL(`https://${DEFAULT_DOMAIN}/`);
      window.electron = true;

      Auth0WebApi.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });
  });
});
