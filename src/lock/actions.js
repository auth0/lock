import WebAPI from './web_api';
import { swap, setEntity, updateEntity } from '../store/index';
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
  swap(updateEntity, "lock", id, l.close);
}
