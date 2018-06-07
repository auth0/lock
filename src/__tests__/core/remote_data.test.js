const getSyncRemoteData = () => require('core/remote_data').syncRemoteData;

describe('remote_data.syncRemoteData()', () => {
  beforeEach(() => {
    jest.resetModules();

    jest.mock('sync', () => jest.fn());

    jest.mock('connection/enterprise', () => ({
      isADEnabled: () => true
    }));

    jest.mock('core/index', () => ({
      useTenantInfo: () => true,
      id: () => 'id'
    }));

    jest.mock('core/sso/data', () => ({
      fetchSSOData: jest.fn()
    }));
  });
  describe('calls getSSOData with AD information', () => {
    [true, false].forEach(isAdEnabled => {
      it(`when isADEnabled is ${isAdEnabled}`, () => {
        require('connection/enterprise').isADEnabled = () => isAdEnabled;
        const syncRemoteData = getSyncRemoteData();
        syncRemoteData();
        const ssoCall = require('sync').mock.calls.find(c => c[1] === 'sso');
        ssoCall[2].syncFn('model', 'callback');
        const [
          id,
          sendADInformation,
          callback
        ] = require('core/sso/data').fetchSSOData.mock.calls[0];
        expect(sendADInformation).toBe(isAdEnabled);
      });
    });
  });
});
