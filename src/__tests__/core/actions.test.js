import { checkSession } from '../../core/actions';
import { expectMockToMatch } from 'testUtils';

jest.mock('../../core/web_api', () => ({
  checkSession: jest.fn()
}));

jest.mock('store/index', () => ({
  read: jest.fn(() => 'model'),
  getEntity: 'getEntity',
  swap: jest.fn(),
  updateEntity: 'updateEntity'
}));

jest.mock('core/index', () => ({
  id: () => 'id',
  setSubmitting: jest.fn()
}));

describe('core.actions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('checkSession', () => {
    it('should set submitting on start', () => {
      checkSession('id', 'params', 'cb');
      const { read, swap } = require('store/index');
      expectMockToMatch(read, 1);
      expectMockToMatch(swap, 1);
      swap.mock.calls[0][3]('model');
      expectMockToMatch(require('core/index').setSubmitting, 1);
    });
  });
});
