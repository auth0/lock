import Immutable from 'immutable';
import { dataFns } from '../../utils/data_utils';
import { clientID, domain, loginErrorMessage } from '../../core/index';
import { initI18n } from '../../i18n';
import { setURL } from '../testUtils';

const setResolvedConnection = (...params) => require('core/index').setResolvedConnection(...params);
const setup = (...params) => require('core/index').setup(...params);

const mockLock = 'm';
let mockSet;
let mockInit;

jest.mock('i18n', () => ({
  initI18n: jest.fn(),
  html: (...keys) => keys.join()
}));

jest.mock('utils/data_utils', () => ({
  dataFns: () => ({
    get: jest.fn(),
    set: mockSet,
    init: mockInit
  })
}));

describe('setup', () => {
  beforeEach(() => {
    mockInit = jest.fn();
    jest.resetModules();
  });

  it('default redirectUrl should not include location.hash', () => {
    setURL('https://test.com/path/#not-this-part');
    const options = {};
    setup('id', 'clientID', 'domain', options, 'hookRunner', 'emitEventFn');
    const { mock } = mockInit;
    expect(mock.calls.length).toBe(1);
    const model = mock.calls[0][1].toJS();
    expect(model.auth.redirectUrl).toBe('https://test.com/path/');
  });

  it.only('default redirectUrl should work when `window.location.origin` is not available', () => {
    // setURL('https://test.com/path/#not-this-part', { noOrigin: true });
    jsdom.reconfigure({
      url: 'https://test.com/path/#not-this-part'
    });

    const options = {};
    setup('id', 'clientID', 'domain', options, 'hookRunner', 'emitEventFn');
    const { mock } = mockInit;
    expect(mock.calls.length).toBe(1);
    const model = mock.calls[0][1].toJS();
    expect(model.auth.redirectUrl).toBe('https://test.com/path/');
  });

  it('should work with redirect:false and responseType:id_token', () => {
    const options = {
      auth: {
        redirect: false,
        responseType: 'id_token'
      }
    };

    setup('id', 'clientID', 'domain', options, 'hookRunner', 'emitEventFn', 'handleEventFn');
    const { mock } = mockInit;
    expect(mock.calls.length).toBe(1);
    const model = mock.calls[0][1].toJS();
    expect(model).toMatchSnapshot();
  });

  describe('clientBaseUrl', () => {
    it('should default to the specified domain', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'my-tenant.us.auth0.com',
        {},
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.clientBaseUrl).toBe('https://my-tenant.us.auth0.com');
    });

    it('should use the clientBaseUrl option if given', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'my-tenant.us.auth0.com',
        {
          clientBaseUrl: 'https://client-base-url.example.com',
          configurationBaseUrl: 'https://config-base-url.example.com',
          assetsUrl: 'https://assets-url.example.com'
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.clientBaseUrl).toBe('https://client-base-url.example.com');
    });

    it('should use configurationBaseUrl if given', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'my-tenant.us.auth0.com',
        {
          configurationBaseUrl: 'https://config-base-url.example.com',
          assetsUrl: 'https://assets-url.example.com'
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.clientBaseUrl).toBe('https://config-base-url.example.com');
    });

    it('should use assetsUrl if given', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'my-tenant.us.auth0.com',
        {
          assetsUrl: 'https://assets-url.example.com'
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.clientBaseUrl).toBe('https://assets-url.example.com');
    });
  });

  describe('tenantBaseUrl', () => {
    it('should default to domain URL when using auth0.com', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'my-tenant.us.auth0.com',
        {
          __useTenantInfo: true
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.tenantBaseUrl).toBe('https://my-tenant.us.auth0.com/tenants/v1/my-tenant.js');
    });

    it('should default to domain URL when using a custom domain', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'auth.my-tenant.com',
        {
          __useTenantInfo: true
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.tenantBaseUrl).toBe('https://auth.my-tenant.com/info-v1.js');
    });

    it('should use configurationBaseUrl if specified', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'auth.my-tenant.com',
        {
          __useTenantInfo: true,
          configurationBaseUrl: 'https://config-base-url.com'
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.tenantBaseUrl).toBe('https://config-base-url.com/info-v1.js');
    });

    it('should use configurationBaseUrl with a custom tenant if specified', () => {
      const { mock } = mockInit;

      setup(
        'id',
        'clientID',
        'auth.my-tenant.com',
        {
          __useTenantInfo: true,
          configurationBaseUrl: 'https://config-base-url.com',
          overrides: {
            __tenant: 'custom-tenant'
          }
        },
        'hookRunner',
        'emitEventFn',
        'handleEventFn'
      );

      expect(mock.calls.length).toBe(1);

      const model = mock.calls[0][1].toJS();
      expect(model.tenantBaseUrl).toBe('https://config-base-url.com/tenants/v1/custom-tenant.js');
    });
  });
});

describe('setResolvedConnection', () => {
  beforeEach(() => {
    mockSet = jest.fn();
    jest.resetModules();
  });
  it('sets undefined when is called with undefined', () => {
    setResolvedConnection(mockLock, undefined);
    expect(mockSet.mock.calls.length).toBe(1);
    expect(mockSet.mock.calls[0]).toMatchSnapshot();
  });
  it('validates format', () => {
    expect(() => setResolvedConnection(mockLock, {})).toThrowErrorMatchingSnapshot();
    expect(() => setResolvedConnection(mockLock, { type: 'foo' })).toThrowErrorMatchingSnapshot();
    expect(() => setResolvedConnection(mockLock, { name: 'bar' })).toThrowErrorMatchingSnapshot();
  });
  it('accepts only database connections', () => {
    expect(() =>
      setResolvedConnection(mockLock, { type: 'foo', name: 'bar' })
    ).toThrowErrorMatchingSnapshot();
  });
  it('sets the connection', () => {
    setResolvedConnection(mockLock, { type: 'database', name: 'bar' });
    expect(mockSet.mock.calls.length).toBe(1);
    expect(mockSet.mock.calls[0]).toMatchSnapshot();
  });
  it('sets the connection as a Map instance', () => {
    setResolvedConnection(mockLock, { type: 'database', name: 'bar' });
    expect(mockSet.mock.calls.length).toBe(1);
    expect(Immutable.Map.isMap(mockSet.mock.calls[0][2])).toBe(true);
  });
});

describe('loginErrorMessage', () => {
  it('maps `password_expired` to `password_change_required`', () => {
    const result = loginErrorMessage(mockLock, { code: 'password_expired' }, 'type');

    expect(result).toBe([mockLock, 'error', 'login', 'password_change_required'].join());
  });
});
