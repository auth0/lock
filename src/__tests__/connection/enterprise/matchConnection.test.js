import I from 'immutable';
import { matchConnection } from '../../../connection/enterprise';

jest.mock('core/index', () => ({
  connections: jest.fn()
}));

describe('matchConnection', () => {
  afterEach(() => jest.resetAllMocks());

  it('does not throw when enterprise connection has no domains field (key absent)', () => {
    const { connections } = require('core/index');

    // Tenant omits the domains field entirely
    connections.mockReturnValue(
      I.fromJS([{ name: 'samlp-connection', strategy: 'samlp', type: 'enterprise' }])
    );

    const m = I.fromJS({ id: '__lock__' });

    expect(() => matchConnection(m, 'test@example.com')).not.toThrow();
    expect(matchConnection(m, 'test@example.com')).toBeFalsy();
  });

  it('does not throw when enterprise connection has domains explicitly set to null', () => {
    const { connections } = require('core/index');

    // Tenant returns domains: null
    connections.mockReturnValue(
      I.fromJS([{ name: 'samlp-connection', strategy: 'samlp', type: 'enterprise', domains: null }])
    );

    const m = I.fromJS({ id: '__lock__' });

    expect(() => matchConnection(m, 'test@example.com')).not.toThrow();
    expect(matchConnection(m, 'test@example.com')).toBeFalsy();
  });

  it('matches a connection when the email domain is in the domains list', () => {
    const { connections } = require('core/index');

    connections.mockReturnValue(
      I.fromJS([{ name: 'samlp-connection', strategy: 'samlp', type: 'enterprise', domains: ['example.com'] }])
    );

    const m = I.fromJS({ id: '__lock__' });

    expect(matchConnection(m, 'user@example.com')).toBeTruthy();
  });
});
