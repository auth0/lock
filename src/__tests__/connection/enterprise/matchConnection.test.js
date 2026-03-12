import I from 'immutable';
import { matchConnection } from '../../../connection/enterprise';

jest.mock('core/index', () => ({
  connections: jest.fn()
}));

describe('matchConnection', () => {
  afterEach(() => jest.resetAllMocks());

  it('does not throw when enterprise connection has no domains configured', () => {
    const { connections } = require('core/index');

    // Simulate tenant endpoint returning a connection with no domains field
    connections.mockReturnValue(
      I.fromJS([{ name: 'samlp-connection', strategy: 'samlp', type: 'enterprise' }])
    );

    const m = I.fromJS({ id: '__lock__' });

    expect(() => matchConnection(m, 'test@example.com')).not.toThrow();
  });
});
