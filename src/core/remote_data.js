import Immutable from 'immutable';
import { fetchClientSettings, syncClientSettingsSuccess } from './client/settings';
import { fetchTenantSettings, syncTenantSettingsSuccess } from './tenant/settings';
import * as l from './index';
import { isADEnabled } from '../connection/enterprise'; // shouldn't depend on this
import sync, { isSuccess } from '../sync';

export function syncRemoteData(m) {
  if (l.useTenantInfo(m)) {
    m = sync(m, 'client', {
      syncFn: (m, cb) => fetchTenantSettings(l.tenantBaseUrl(m), cb),
      successFn: (m, result) => syncTenantSettingsSuccess(m, l.clientID(m), result)
    });
  } else {
    m = sync(m, 'client', {
      syncFn: (m, cb) => fetchClientSettings(l.clientID(m), l.clientBaseUrl(m), cb),
      successFn: syncClientSettingsSuccess
    });
  }

  return m;
}
