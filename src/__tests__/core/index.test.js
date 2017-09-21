import Immutable from 'immutable';
import { dataFns } from '../../utils/data_utils';

const setResolvedConnection = (...params) => require('core/index').setResolvedConnection(...params);

const mockLock = 'm';
let mockSet;
jest.mock('utils/data_utils', () => ({
  dataFns: () => ({
    set: mockSet
  })
}));

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
