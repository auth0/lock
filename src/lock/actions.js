import Immutable from 'immutable';
import WebAPI from './web_api';
import { getEntity, read, swap, setEntity, updateEntity } from '../store/index';
import * as l from './index';

export function setupLock(id, clientID, domain) {
  const lock = l.setup({id: id, clientID: clientID, domain: domain});
  swap(setEntity, "lock", id, lock);

  WebAPI.setupClient(id, clientID, domain);
}

export function openLock(id, mode, options) {
  swap(updateEntity, "lock", id, l.open, mode, options);
}

export function closeLock(id) {
  const lock = read(getEntity, "lock", id);
  const modeSpec = read(getEntity, "mode", l.mode(lock));
  const closeHandler = modeSpec.get("closeHandler");
  typeof closeHandler == "function" ?
    closeHandler(lock) : swap(updateEntity, "lock", id, l.close);
}

export function registerMode(spec) {
  swap(setEntity, "mode", spec.name, Immutable.fromJS(spec));
}
