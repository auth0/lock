import { getEntity, read, swap, updateEntity } from '../../store/index';
import { fetchClientSettings } from '../client/settings';
import { fetchSSOData } from '../sso/data';
import webAPI from '../web_api';
import * as l from '../index';

export function syncRemoteData(id) {
  syncClientSettings(id, (error, client) => syncSSOData(id));
  syncLocation(id);
}

function syncClientSettings(lockID, cb) {
  const lock = read(getEntity, "lock", lockID);
  if (lock.getIn(["client", "syncStatus"])) return;

  swap(updateEntity, "lock", lockID, m => {
    return m.setIn(["client", "syncStatus"], "loading");
  });

  const clientID = l.clientID(lock);
  const domain = l.domain(lock);
  const assetsUrl = undefined; // TODO

  fetchClientSettings(clientID, domain, assetsUrl, (error, client) => {
    swap(updateEntity, "lock", lockID, m => {
      return error
        ? m.setIn(["client", "syncStatus"], "error")
        : m.set("client", client.set("syncStatus", "ok"));
    });

    cb(error, client);
  });
}

function syncSSOData(lockID) {
  const lock = read(getEntity, "lock", lockID);
  if (lock.getIn(["sso", "syncStatus"])) return;

  swap(updateEntity, "lock", lockID, m => {
    return m.setIn(["sso", "syncStatus"], "loading");
  });

  fetchSSOData(lockID, (error, data) => {
    swap(updateEntity, "lock", lockID, m => {
      return m.set("sso", data.set("syncStatus", "ok"));
    });
  });
}

function syncLocation(id) {
  const location = read(getEntity, "location", 0);
  if (location && location.get("syncStatus")) return;

  swap(updateEntity, "location", 0, m => {
    return m.set("syncStatus", "loading");
  });

  webAPI.getUserCountry(id, (error, isoCode) => {
    swap(updateEntity, "location", 0, m => {
      return error
        ? m.set("syncStatus", "error")
        : m.set("syncStatus", "ok").set("isoCode", isoCode);
    });
  });
}
