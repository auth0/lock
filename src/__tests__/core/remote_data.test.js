import * as l from '../../core/index';

const getSyncRemoteData = () => require('core/remote_data').syncRemoteData;

jest.mock('sync', () => jest.fn());

jest.mock('connection/enterprise', () => ({
  isADEnabled: () => true
}));

jest.mock('core/index', () => ({
  useTenantInfo: () => true,
  id: () => 'id',
  emitEvent: jest.fn()
}));

jest.mock('core/sso/data', () => ({
  fetchSSOData: jest.fn((id, adEnabled, cb) => cb(null, {}))
}));

describe('remote_data.syncRemoteData()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calls getSSOData with AD information', () => {
    [true, false].forEach(isAdEnabled => {
      it(`when isADEnabled is ${isAdEnabled}`, () => {
        require('connection/enterprise').isADEnabled = () => isAdEnabled;

        const syncRemoteData = getSyncRemoteData();
        syncRemoteData();

        const ssoCall = require('sync').mock.calls.find(c => c[1] === 'sso');
        ssoCall[2].syncFn('model', jest.fn());

        const [, sendADInformation, ,] = require('core/sso/data').fetchSSOData.mock.calls[0];

        expect(sendADInformation).toBe(isAdEnabled);
        expect(l.emitEvent).toHaveBeenCalledWith('model', 'ssodata fetched', expect.anything());
      });
    });
  });
});
