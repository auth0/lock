import { ActionTypes } from '../control/constants';
import LockWebAPI from './web_api';
import * as Gravatar from '../gravatar/index';

import { setLock, updateLock } from '../store/index';
import * as l from './index';

export function setupLock(id, clientID, domain, options) {
  setLock(l.setup({
    id: id,
    clientID: clientID,
    domain: domain,
    options: options
  }));

  LockWebAPI.setupClient(id, clientID, domain, options || {});
}

export function openLock(id, mode, options) {
  updateLock(id, l.open, mode, options);
}

export function closeLock(id) {
  updateLock(id, l.close);
}
