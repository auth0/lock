import { load } from '../../utils/cdn_utils';
import * as l from '../index';
import { initTenant } from './index';

export function fetchTenantSettings(tenantBaseUrl, cb) {
  load({
    method: 'setTenant',
    url: `${tenantBaseUrl}?t${+new Date()}`,
    check: () => true,
    cb: cb
  });
}

export function syncTenantSettingsSuccess(m, client_id, result) {
  m = initTenant(m, client_id, result);
  m = l.filterConnections(m);
  m = l.runHook(m, 'didReceiveClientSettings');
  return m;
}
