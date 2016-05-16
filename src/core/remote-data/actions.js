import Immutable from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import { fetchClientSettings } from '../client/settings';
import { pickConnections } from '../client/index';
import { fetchSSOData } from '../sso/data';
import webAPI from '../web_api';
import * as l from '../index';
import { isADEnabled } from '../../connection/enterprise';
import { sync } from '../../sync';

export function syncRemoteData(id) {
  syncClientSettings(id, _ => syncSSOData(id));
  // syncLocation(id);
}

function syncClientSettings(id, cb) {
  function syncFn(m, cb) {
    const clientID = l.clientID(m);
    const domain = l.domain(m);
    const assetsUrl = undefined; // TODO
    fetchClientSettings(clientID, domain, assetsUrl, cb);
  }

  function updateFn(m, result) {
    result = Immutable.fromJS(result);
    m = m.setIn(
      ["core", "connections"],
      pickConnections(result, l.allowedConnections(m))
    );
    setTimeout(() => {
      l.runHook(read(getEntity, "lock", id), "didReceiveClientSettings");
      cb(result);
    }, 0);
    return m;
  }

  sync(id, "client", undefined, syncFn, updateFn);
}

function syncSSOData(id) {
  function syncFn(m, cb) {
    fetchSSOData(id, isADEnabled(m), cb);
  }

  function updateFn(m, result) {
    return m.mergeIn(["sso"], Immutable.fromJS(result));
  }

  sync(id, "sso", l.auth.sso, syncFn, updateFn);
}

function syncLocation(id) {
  function syncFn(m, cb) {
    webAPI.getUserCountry(id, cb);
  }

  function updateFn(m, result) {
    return m.setIn(["location", "isoCode"], result);
  }

  sync(id, "location", null, syncFn, updateFn);
}
