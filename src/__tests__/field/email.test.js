import Immutable from 'immutable';

describe('field/email', () => {
  let email;
  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      setField: jest.fn()
    }));

    email = require('field/email');
  });
  describe('setEmail()', () => {
    it(`trims email`, () => {
      email.setEmail(Immutable.fromJS({}), ' email@test.com ');
      const { mock } = require('field/index').setField;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
});
