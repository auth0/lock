import Immutable from 'immutable';

describe('field/password', () => {
  let passwordField;
  beforeEach(() => {
    jest.resetModules();
    jest.mock('password-sheriff/lib/policy');
    passwordField = require('field/password');
  });
  describe('validatePassword()', () => {
    it(`validates password correctly`, () => {
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
