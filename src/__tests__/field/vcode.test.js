import Immutable from 'immutable';

describe('field/vcode', () => {
  let vcode;
  beforeEach(() => {
    jest.resetModules();

    jest.mock('field/index', () => ({
      setField: jest.fn()
    }));

    vcode = require('field/vcode');
  });
  describe('setVcode()', () => {
    it(`trims code`, () => {
      vcode.setVcode(Immutable.fromJS({}), ' 123456 ');
      const { mock } = require('field/index').setField;
      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
});
