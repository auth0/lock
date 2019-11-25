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
  it('sets isUniversalLoginPage to `true` when current host === domain', function() {
    setURL('https://brucke.auth0.com/authorize');
    setup('id', 'clientID', 'brucke.auth0.com', {}, 'hookRunner', 'emitEventFn');
    expect(mockInit.mock.calls[0][1].toJS().isUniversalLoginPage).toBe(true);
  });
  it('sets isUniversalLoginPage to `true` when current host === auth0 tenant specific domain', function() {
    setURL('https://brucke.auth0users.com/authorize');
    setup('id', 'clientID', 'brucke.auth0.com', {}, 'hookRunner', 'emitEventFn');
    expect(mockInit.mock.calls[0][1].toJS().isUniversalLoginPage).toBe(true);
  });
  it('sets isUniversalLoginPage to `true` when using a custom domain', function() {
    setURL('https://auth.example.com/authorize');
    setup('id', 'clientID', 'auth.example.com', {}, 'hookRunner', 'emitEventFn');
    expect(mockInit.mock.calls[0][1].toJS().isUniversalLoginPage).toBe(true);
  });
  it('sets isUniversalLoginPage to `false` when current host does not match any of the domains', function() {
    setURL('https://myapp.com/authorize');
    setup('id', 'clientID', 'brucke.auth0.com', {}, 'hookRunner', 'emitEventFn');
    expect(mockInit.mock.calls[0][1].toJS().isUniversalLoginPage).toBe(false);
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
  it('default redirectUrl should work when `window.location.origin` is not available', () => {
    setURL('https://test.com/path/#not-this-part', { noOrigin: true });
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
    setup('id', 'clientID', 'domain', options, 'hookRunner', 'emitEventFn');
    const { mock } = mockInit;
    expect(mock.calls.length).toBe(1);
    const model = mock.calls[0][1].toJS();
    expect(model).toMatchSnapshot();
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
