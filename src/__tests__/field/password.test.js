import Immutable from 'immutable';

describe('field/password', () => {
  let passwordField;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('password-sheriff/lib/policy');
    passwordField = require('field/password');
  });
  describe('validatePassword()', () => {
    it(`returns false when there is no password`, () => {
      const value = passwordField.validatePassword('');
      expect(value).toBe(false);
    });
    it(`returns true when there is no policy`, () => {
      const value = passwordField.validatePassword('the-password');
      expect(value).toBe(true);
    });
    it(`validates password correctly when there is a policy`, () => {
      const model = {
        toJS: jest.fn()
      };
      passwordField.validatePassword('the-password', model);
      const { mock } = require('password-sheriff/lib/policy').prototype.check;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0][0]).toBe('the-password');
      expect(model.toJS).toHaveBeenCalledTimes(1);
    });
  });
});
