import I from 'immutable';
import { matchConnection } from '../../../connection/enterprise';

// Build a minimal lock model with enterprise connections at the path
// l.connections() calls tget(m, ['connections', type]) where tget uses
// dataFns(['core']).tget, which reads m.getIn(['core', 'transient', 'connections', type])
const buildModel = (connections) =>
  I.fromJS({ core: { transient: { connections: { enterprise: connections } } } });

describe('matchConnection', () => {
  it('returns the matching connection when domains contains the email domain', () => {
    const model = buildModel([
      { name: 'my-connection', strategy: 'waad', domains: ['example.com'] }
    ]);
    const result = matchConnection(model, 'user@example.com');
    expect(result).toBeDefined();
    expect(result.get('name')).toBe('my-connection');
  });

  it('returns undefined when no connection matches the email domain', () => {
    const model = buildModel([
      { name: 'my-connection', strategy: 'waad', domains: ['other.com'] }
    ]);
    expect(matchConnection(model, 'user@example.com')).toBeUndefined();
  });

  it('does not throw when a connection has null domains', () => {
    const model = buildModel([{ name: 'no-domains', strategy: 'waad', domains: null }]);
    expect(() => matchConnection(model, 'user@example.com')).not.toThrow();
    expect(matchConnection(model, 'user@example.com')).toBeUndefined();
  });

  it('returns false when email has no domain part', () => {
    const model = buildModel([
      { name: 'my-connection', strategy: 'waad', domains: ['example.com'] }
    ]);
    expect(matchConnection(model, 'notanemail')).toBe(false);
  });
});
