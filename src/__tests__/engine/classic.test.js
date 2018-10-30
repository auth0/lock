const getClassic = () => require('engine/classic').default;

describe('Classic Engine', () => {
  beforeEach(() => {
    jest.mock('connection/database/index', () => ({
      resolveAdditionalSignUpFields: m => ({ ...m, resolveAdditionalSignUpFields: true }),
      overrideDatabaseOptions: m => ({ ...m, overrideDatabaseOptions: true })
    }));
    jest.mock('sync', () => ({
      isSuccess: () => false
    }));
  });
  test('willShow calls `resolveAdditionalSignUpFields`', () => {
    const classic = getClassic();
    const model = classic.willShow(model, {});
    expect(model.resolveAdditionalSignUpFields).toBe(true);
  });
  test('willShow calls `overrideDatabaseOptions`', () => {
    const classic = getClassic();
    const model = classic.willShow(model, {});
    expect(model.overrideDatabaseOptions).toBe(true);
  });
});
