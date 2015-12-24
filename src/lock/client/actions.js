import Immutable, { Map } from 'immutable';
import { swap, updateCollection } from '../../store/index';
import * as l from '../index';

export function loadClientSettingsSuccess(o) {
  const client = Immutable.fromJS(o);
  swap(updateCollection, "lock", ms => {
    return ms.map(m => {
      return client.get("id") === l.clientID(m)
        ? m.set("client", client)
        : m;
    });
  });
}

export function loadClientSettingsError(clientID) {
  // do nothing, in the future we may want to do something to signal that the
  // client settings couldn't be loaded
}

export function receiveSSOData(clientID, ssoData) {
  ssoData = Immutable.fromJS(ssoData);
  ssoData = ssoData.get("sso") === false
    ? Map()
    : ssoData.remove("sso");

  swap(updateCollection, "lock", ms => {
    return ms.map(m => {
      return clientID === l.clientID(m)
        ? m.set("sso", ssoData)
        : m;
    });
  });
}
