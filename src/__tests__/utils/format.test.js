import format from '../../utils/format';

describe('format', () => {
  it('can format a string', () => {
    expect(format('a string')).toEqual('a string');
  });

  it('can replace a string', () => {
    expect(format('%s', 'test')).toEqual('test');
  });

  it('can replace a string inside a string', () => {
    expect(format('a string: %s', 'test')).toEqual('a string: test');
  });

  it('can replace multiple strings', () => {
    expect(format('%s:%s', 'a', 'b')).toEqual('a:b');
  });

  it('can replace with a number', () => {
    expect(format('%d', 12)).toEqual('12');
  });

  it('can format an object', () => {
    expect(format('%j', { key: 'value' })).toEqual('{"key":"value"}');
  });
});
