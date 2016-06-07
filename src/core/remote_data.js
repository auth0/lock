import Immutable from 'immutable';
import { fetchClientSettings } from './client/settings';
import { pickConnections } from './client/index';
import { fetchSSOData } from './sso/data';
import * as l from './index';
import { isADEnabled } from '../connection/enterprise'; // shouldn't depend on this
import sync, { isSuccess } from '../sync';

export function syncRemoteData(m) {
  m = sync(m, "client", {
    syncFn: (m, cb) => fetchClientSettings(l.clientID(m), l.assetsUrl(m), cb),
    successFn: syncClientSettingsSuccess
  });

  m = sync(m, "sso", {
    conditionFn: l.auth.sso,
    waitFn: m => isSuccess(m, "client"),
    syncFn: (m, cb) => fetchSSOData(l.id(m), isADEnabled(m), cb),
    successFn: (m, result) => m.mergeIn(["sso"], Immutable.fromJS(result))
  });

  return m;
}

function syncClientSettingsSuccess(m, result) {
  result = Immutable.fromJS(result);
  m = m.setIn(
    ["core", "connections"],
    pickConnections(result, l.allowedConnections(m))
  );

  m = l.runHook(m, "didReceiveClientSettings");

  return m;
}
