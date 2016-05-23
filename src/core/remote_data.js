import Immutable from 'immutable';
import { fetchClientSettings } from './client/settings';
import { pickConnections } from './client/index';
import { fetchSSOData } from './sso/data';
import * as l from './index';
import { isADEnabled } from '../connection/enterprise'; // shouldn't depend on this
import sync from '../sync2';
import { isSuccess } from '../sync';

export function syncRemoteData(m) {
  m = sync(m, "client", {
    syncFn: (m, cb) => fetchClientSettings(l.clientID(m), l.domain(m), undefined, cb), // TODO assetsUrl
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

  // TODO: this shouldn't be like this
  setTimeout(() => l.runHook(m, "didReceiveClientSettings"), 0);
  return m;
}

// import webAPI from '../web_api';

// function syncLocation(id) {
//   function syncFn(m, cb) {
//     webAPI.getUserCountry(id, cb);
//   }

//   function updateFn(m, result) {
//     return m.setIn(["location", "isoCode"], result);
//   }

//   sync(id, "location", null, syncFn, updateFn);
// }
