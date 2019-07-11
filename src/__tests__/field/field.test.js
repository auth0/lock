import Immutable from 'immutable';
import { setField } from '../../field';

const createModel = field =>
  Immutable.fromJS({
    field: {
      [field]: `old_test_${field}`
    }
  });

const testField = (field, maxLength) => {
  const m = createModel(field);
  expect(setField(m, field, '').toJS().field[field].valid).toBe(false);
  expect(setField(m, field, 'test_value').toJS().field[field].valid).toBe(true);
  if (maxLength) {
    expect(setField(m, field, 'a'.repeat(maxLength + 1)).toJS().field[field].valid).toBe(false);
  }
};
describe('field/index', () => {
  describe('default validation', () => {
    it('validates family_name', () => {
      testField('family_name', 150);
    });
    it('validates family_name', () => {
      testField('given_name', 150);
    });
    it('validates name', () => {
      testField('name', 300);
    });
    it('validates nickname', () => {
      testField('nickname', 300);
    });
    it('validates other fields', () => {
      testField('test');
    });
  });
});
