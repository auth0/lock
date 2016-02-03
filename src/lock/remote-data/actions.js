import { getEntity, read, swap, updateEntity } from '../../store/index';
import webAPI from '../web_api';

// sso data

var ssoData = {};

export function fetchSSOData(id, cb) {
  if (ssoData[id]) return cb(null, ssoData[id]);
  if (registerCallback(id, cb) > 1) return;

  webAPI.getSSOData(id, false, (error, o) => execCallbacks(id, error, o));
}

const callbacks = {};

function registerCallback(id, cb) {
  if (callbacks[id]) {
    callbacks[id].push(cb);
  } else {
    callbacks[id] = [cb];
  }

  return callbacks[id].length;
}

function execCallbacks(id, ...args) {
  callbacks[id].forEach(x => x(...args));
  delete callbacks[id];
}

// location

export function fetchLocation(id) {
  const location = read(getEntity, "location", 0);

  if (!location || !location.get("syncStatus")) {
    webAPI.getUserCountry(id, (error, isoCode) => {
      swap(updateEntity, "location", 0, m => {
        return error
          ? m.set("syncStatus", "error")
          : m.set("syncStatus", "ok").set("isoCode", isoCode);
      });
    });
  }
}
