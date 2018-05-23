import Immutable from 'immutable';
import { dataFns } from '../../utils/data_utils';
import { clientID, domain } from '../../core/index';
import { initI18n } from '../../i18n';
import { setURL } from '../testUtils';

const setResolvedConnection = (...params) => require('core/index').setResolvedConnection(...params);
const setup = (...params) => require('core/index').setup(...params);

const mockLock = 'm';
let mockSet;
let mockInit;

jest.mock('i18n', () => ({
  initI18n: jest.fn()
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
