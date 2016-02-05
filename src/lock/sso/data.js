import Immutable from 'immutable';
import webAPI from '../web_api';

export function fetchSSOData(id, cb) {
  if (cache[id]) return cb(null, cache[id]);
  if (registerCallback(id, cb) > 1) return;

  webAPI.getSSOData(id, false, (error, data) => {
    data = Immutable.fromJS(data);
    cache[id] = data;
    execCallbacks(id, error, data)
  });
}

const cache = {};
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
